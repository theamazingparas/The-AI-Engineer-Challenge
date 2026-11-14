/** One message shown in the chat transcript. */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
