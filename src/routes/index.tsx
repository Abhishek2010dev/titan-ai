import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { FetchStreamingResponse } from "@/lib/ai/client";
import React, { useState } from "react";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "@/components/ai-elements/prompt-input";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      fetch: FetchStreamingResponse,
    }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({
        text: input,
      });
    }
    setInput("");
  };
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        <Conversation className="h-full">
          <ConversationContent className="px-6 py-8 max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <Message from={message.role}>
                  <MessageContent>
                    {message.parts
                      .filter((part) => part.type == "text")
                      .map((part, i) => (
                        <Response key={`${message.id}-${i}`}>
                          {part.text}
                        </Response>
                      ))}
                  </MessageContent>
                </Message>
              </div>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>

      <div className="sticky bottom-0 left-0 right-0 bg-background p-2">
        <PromptInput
          onSubmit={handleSubmit}
          className="w-full max-w-4xl mx-auto relative"
        >
          <PromptInputTextarea
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <PromptInputToolbar>
            <PromptInputSubmit disabled={!input} status={status} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
}
