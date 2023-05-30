import { describe, expect, test } from "vitest";
import { JsonTokenizer, Token } from "./tokenizer";

const tokenizer = new JsonTokenizer();

function getAllTokens(data: string) {
  tokenizer.init(data);
  const tokens: Array<Token> = [];

  while (true) {
    const token = tokenizer.getNext();
    if (!token) {
      break;
    }
    tokens.push(token);
  }

  return tokens;
}

describe(JsonTokenizer.name, () => {
    test("string", () => {
        const tokens = getAllTokens('"name"');

        expect(tokens).toEqual([
            {
                type: "STRING",
                value: "name",
            },
        ]);
    })

    test("multiple strings", () => {
        const tokens = getAllTokens('"name" "age"');

        expect(tokens).toEqual([
            {
                type: "STRING",
                value: "name",
            },
            {
                type: "STRING",
                value: "age",
            },
        ]);
    })
})