import { Container } from "@/components/layout/container";
import { SiteHeader } from "@/components/layout/site-header";
import { ChatWindow } from "@/features/chat/components/chat-window";

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-100 via-emerald-50 to-slate-100">
      <SiteHeader />
      <section className="py-6 sm:py-8">
        <Container>
          <ChatWindow />
        </Container>
      </section>
    </main>
  );
}
