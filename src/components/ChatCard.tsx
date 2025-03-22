import { Card } from "./ui/card";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { useState, useRef, useEffect } from "react";
import { UserIcon, BotIcon, LoaderIcon, SendIcon } from "lucide-react";
import { useCompletion } from "ai/react";
import type { Chat } from "@/lib/chats";

interface ChatCardProps {
  chat: Chat;
  onMessageReceived?: (message: string) => void;
}

const ChatCard = ({ chat, onMessageReceived }: ChatCardProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { completion, complete, error } = useCompletion({
    api: "/api/chat",
    onFinish: (result) => {
      setIsGenerating(false);
      if (onMessageReceived) {
        onMessageReceived(result);
      }
    },
    onError: (error) => {
      console.error("Error:", error);
      setIsGenerating(false);
    },
  });

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  useEffect(() => {
    if (completion || isGenerating) {
      scrollToBottom();
    }
  }, [completion, isGenerating]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;

    setIsGenerating(true);
    await complete(chat.prompt);
  };

  return (
    <Card className="w-full bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-lg text-white">{chat.title}</CardTitle>
        <CardDescription className="text-zinc-400">{chat.description}</CardDescription>
      </CardHeader>
      <CardContent className="h-72 w-full overflow-y-auto overflow-x-hidden scroll-smooth">
        <div className="space-y-4">
          <div className="flex items-start gap-3 w-full">
            <div className="bg-white p-2 rounded-full flex-shrink-0">
              <UserIcon className="h-4 w-4" />
            </div>
            <div className="bg-white rounded-lg p-3 text-sm break-words max-w-[calc(100%-3rem)]">
              {chat.prompt}
            </div>
          </div>

          {(isGenerating || completion) && (
            <div className="flex items-start gap-3 w-full">
              <div className="bg-white p-2 rounded-full flex-shrink-0">
                <BotIcon className="h-4 w-4 text-black" />
              </div>
              <div className="bg-white rounded-lg p-3 text-sm whitespace-pre-line break-words max-w-[calc(100%-3rem)]">
                {isGenerating && !completion && (
                  <div className="flex items-center gap-2">
                    <LoaderIcon className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                )}
                {completion}
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm break-words">
              Error: {error.message}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="mt-2">
        <button
          onClick={handleGenerate}
          className="w-full gap-2 flex items-center justify-center py-2 bg-black text-white border border-transparent hover:border-white/50 rounded-md"
          disabled={isGenerating}
        >
          <SendIcon className="h-4 w-4" />
          <span>
            {isGenerating
              ? "Generating..."
              : completion
              ? "Regenerate"
              : "Generate"}
          </span>
        </button>
      </CardFooter>
    </Card>
  );
};

export default ChatCard; 