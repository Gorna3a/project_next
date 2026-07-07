'use client';
import dynamic from "next/dynamic";

const ChatPage = dynamic(() => import("@/platform/pages/Chat/ChatPage"), { ssr: false });

export default function Chat() {
  return <ChatPage />;
}
