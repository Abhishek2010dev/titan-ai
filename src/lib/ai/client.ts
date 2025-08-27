import { ollama } from "ollama-ai-provider-v2";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

export const FetchStreamingResponse = async (
  _input: RequestInfo | URL,
  init?: RequestInit,
) => {
  try {
    const { messages }: { messages: UIMessage[] } = JSON.parse(
      init?.body as string,
    );
    console.table(messages);
    const result = streamText({
      model: ollama("llama3.2:1"),
      messages: convertToModelMessages(messages),
      abortSignal: init?.signal as AbortSignal | undefined,
      system:
        "You are a helpful assistant that can answer questions and help with tasks",
    });

    return result.toUIMessageStreamResponse({});
  } catch (e: any) {
    console.error("FetchStreamingResponse error:", e);
    return new Response(
      JSON.stringify({
        error: true,
        message: e?.message ?? "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
