import { ollama } from "ollama-ai-provider-v2";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

export const FetchStreamingResponse = async (
  _input: RequestInfo | URL,
  init?: RequestInit,
) => {
  const { messages }: { messages: UIMessage[] } = JSON.parse(
    init?.body as string,
  );
  const result = streamText({
    model: ollama("qwen3:1.7b"),
    providerOptions: { ollama: { think: true } },
    messages: convertToModelMessages(messages),
    abortSignal: init?.signal as AbortSignal | undefined,
    system:
      "You are a helpful assistant that can answer questions and help with tasks",
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  });
};
