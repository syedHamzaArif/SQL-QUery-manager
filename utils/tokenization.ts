import GPT3 from "gpt3-tokenizer";

export const getTokens = (prompt: string) => {
  const tokenizer = new GPT3({ type: "codex" });
  const tokens = tokenizer.encode(prompt);
  return tokens;
};

export const calculateRemainingTokens = (max_tokens: number, prompt_tokens: number) => {
  return max_tokens - prompt_tokens;
}
