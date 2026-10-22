"use client";

import dynamic from "next/dynamic";

/** The assistant is code-split and loaded on the client only. */
const ChatAssistant = dynamic(() => import("./ChatAssistant"), { ssr: false });

export function ChatAssistantLoader({ aiEnabled }: { aiEnabled: boolean }) {
  return <ChatAssistant aiEnabled={aiEnabled} />;
}
