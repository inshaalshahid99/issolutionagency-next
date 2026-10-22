import { buildSystemPrompt } from "@/lib/chat-prompt";
import { clientIp, rateLimit } from "@/lib/rate-limit";

type Msg = { role: "user" | "assistant"; content: string };

const MAX_MESSAGES = 24;
const MAX_CHARS = 2000;

/**
 * POST /api/chat — streams a reply from an OpenAI-compatible Chat Completions API.
 * Env: OPENAI_API_KEY (required), OPENAI_MODEL (default "gpt-4o-mini"),
 * OPENAI_BASE_URL (optional, default https://api.openai.com/v1).
 * Without a key it returns 503 { fallback: true } and the widget runs its scripted demo flow.
 */
export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "The AI assistant is not configured.", fallback: true }, { status: 503 });
  }

  const rl = rateLimit(`chat:${clientIp(req)}`, 30, 10 * 60 * 1000);
  if (!rl.ok) {
    return Response.json({ error: "Too many messages. Please wait a few minutes, or use “Talk to a human”." }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  }

  let messages: Msg[] = [];
  try {
    const body = (await req.json()) as { messages?: unknown };
    if (!Array.isArray(body.messages)) throw new Error("bad");
    messages = body.messages
      .filter((m): m is Msg => !!m && typeof m === "object" && ((m as Msg).role === "user" || (m as Msg).role === "assistant") && typeof (m as Msg).content === "string")
      .slice(-MAX_MESSAGES)
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
    if (!messages.length || messages[messages.length - 1].role !== "user") throw new Error("bad");
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  let upstream: Response;
  try {
    upstream = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        stream: true,
        temperature: 0.4,
        max_tokens: 400,
        messages: [{ role: "system", content: buildSystemPrompt() }, ...messages],
      }),
      signal: req.signal,
    });
  } catch {
    return Response.json({ error: "The assistant is unreachable right now. Please use “Talk to a human”." }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    console.error("[chat] upstream error", upstream.status, await upstream.text().catch(() => ""));
    return Response.json({ error: "The assistant is unavailable right now. Please use “Talk to a human”." }, { status: 502 });
  }

  // Convert the SSE stream into a plain text stream of content deltas.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const reader = upstream.body.getReader();
  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      let buffer = "";
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            const t = line.trim();
            if (!t.startsWith("data:")) continue;
            const data = t.slice(5).trim();
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data) as { choices?: { delta?: { content?: string } }[] };
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              /* ignore keep-alives and partial lines */
            }
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" },
  });
}
