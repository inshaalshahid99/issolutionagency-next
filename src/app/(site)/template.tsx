import { PageTransition } from "@/components/effects/PageTransition";

export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
