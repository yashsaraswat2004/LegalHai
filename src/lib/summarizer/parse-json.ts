/** Strip markdown fences and parse model JSON safely */
export function parseModelJson<T>(raw: string): T {
  let text = raw.trim();

  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    text = fenceMatch[1].trim();
  }

  const start = text.indexOf("{");
  let end = text.lastIndexOf("}");

  if (start === -1) {
    throw new Error("AI response was not valid JSON.");
  }

  if (end === -1 || end <= start) {
    text = text.slice(start);
    const repaired = repairTruncatedJson(text);
    return JSON.parse(repaired) as T;
  }

  text = text.slice(start, end + 1);

  try {
    return JSON.parse(text) as T;
  } catch {
    return JSON.parse(repairTruncatedJson(text)) as T;
  }
}

/** Close open strings/brackets when the model hits max_tokens mid-JSON */
function repairTruncatedJson(text: string): string {
  let repaired = text.trim();

  const quoteCount = (repaired.match(/(?<!\\)"/g) ?? []).length;
  if (quoteCount % 2 !== 0) {
    repaired += '"';
  }

  const stack: string[] = [];
  let inString = false;
  let escaped = false;

  for (const char of repaired) {
    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") {
        escaped = true;
        continue;
      }
      if (char === '"') inString = false;
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }
    if (char === "{") stack.push("}");
    else if (char === "[") stack.push("]");
    else if (char === "}" || char === "]") stack.pop();
  }

  while (stack.length > 0) {
    repaired += stack.pop();
  }

  repaired = repaired.replace(/,\s*([}\]])/g, "$1");
  return repaired;
}
