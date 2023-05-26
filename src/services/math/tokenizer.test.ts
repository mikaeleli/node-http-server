import { describe, expect, test } from "vitest";
import { MathTokenizer, Token } from "./tokenizer";

const tokenizer = new MathTokenizer();

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

describe(MathTokenizer.name, () => {
  test("16", () => {
    const tokens = getAllTokens("16");

    expect(tokens).toEqual([
      {
        type: "NUMBER",
        value: 16,
      },
    ]);
  });

  test.only("18 + 24 / (1 - 54)", () => {
    const tokens = getAllTokens("18 + 24 / (1 - 54)");

    console.log({tokens});

    expect(tokens).toEqual([
      {
        type: "NUMBER",
        value: 18,
      },
      {
        type: "ADDITION_OPERATOR",
        value: "+",
      },
      {
        type: "NUMBER",
        value: 24,
      },
      {
        type: "MULTIPLICATION_OPERATOR",
        value: "/",
      },
      {
        type: "(",
      },
      {
        type: "NUMBER",
        value: 1,
      },
      {
        type: "ADDITION_OPERATOR",
        value: "-",
      },
      {
        type: "NUMBER",
        value: 54,
      },
      {
        type: ")",
      },
    ]);
  })
});
