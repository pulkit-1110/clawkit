export const clip = (text: string, max = 4000) =>
  text.length <= max ? text : text.slice(0, max) + '\n…[truncated]';

export async function replyMd(
  ctx: { reply: (t: string, o?: object) => Promise<unknown> },
  text: string,
) {
  const body = clip(text);
  try {
    return await ctx.reply(body, { parse_mode: 'Markdown' });
  } catch (err) {
    // Arbitrary LLM output often contains unbalanced Markdown entities (a stray
    // `*`, `_`, or an unclosed code block), which Telegram rejects 
    const description = (err as { response?: { description?: string } })?.response
      ?.description;
    if (description?.includes("can't parse entities")) {
      return await ctx.reply(body);
    }
    throw err;
  }
}

/** Text after `/name …` */
export function commandArg(fullText: string, name: string): string {
  return fullText.replace(new RegExp(`^/${name}\\s*`, 'i'), '').trim();
}