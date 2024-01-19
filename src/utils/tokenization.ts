// TODO: Design a robust token counter for streaming responses (model specific, min token count, limits, etc.)

// Currently disabled
export const parseChunk = (chunk: string) => {
  const lines = chunk.split('\n');

  let result = '';

  for (const line of lines) {
    if (line.startsWith('data:')) {
      if (line.includes('[DONE]')) {
        continue;
      }
      const data = JSON.parse(line.slice(6));
      if (data.choices[0].delta && data.choices[0].delta.content) {
        result += data.choices[0].delta.content;
      }
    }
  }
  return result;
};
