import { toUIMessageStream } from "@ai-sdk/langchain";
import { createUIMessageStreamResponse, type UIMessage } from "ai";
import { ChatOllama } from "@langchain/ollama";
import { AIMessage, HumanMessage } from "@langchain/core/messages";

export const FetchStreamingResponse = async (
  _input: RequestInfo | URL,
  init?: RequestInit,
) => {
  const { messages }: { messages: UIMessage[] } = JSON.parse(
    init?.body as string,
  );

  const model = new ChatOllama({
    model: "qwen3:1.7b",
  });

  const stream = await model.stream(
    messages.map((message) =>
      message.role == "user"
        ? new HumanMessage(
            message.parts
              .map((part) => (part.type === "text" ? part.text : ""))
              .join(""),
          )
        : new AIMessage(
            message.parts
              .map((part) => (part.type === "text" ? part.text : ""))
              .join(""),
          ),
    ),
  );

  return createUIMessageStreamResponse({
    stream: toUIMessageStream(stream),
  });
};
