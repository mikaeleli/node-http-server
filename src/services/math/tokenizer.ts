export class MathTokenizer {
  private string = "";
  private cursor = 0;

  public init(data: string) {
    // Remove all whitespace
    this.string = data.replace(/\s/g, "");
    this.cursor = 0;
  }

  private hasNext() {
    return this.cursor < this.string.length;
  }

  public getNext(): Token | null {
    if (!this.hasNext()) {
      return null;
    }

    const string = this.string.slice(this.cursor);
    const char = string[0];

    if (isNumber(char)) {
      // Assign char to number to save a single loop
      // Amazing performance boost
      // Much wow
      let number = char;
      while (isNumber(string[number.length])) {
        number += string[number.length];
      }

      this.cursor += number.length;

      return {
        type: "NUMBER",
        value: Number(number),
      } satisfies NumberToken;
    }

    if (char === "+" || char === "-") {
      this.cursor++;
      return {
        type: "ADDITION_OPERATOR",
        value: char,
      } satisfies AdditionOperatorToken;
    }

    if (char === "*" || char === "/") {
      this.cursor++;

      return {
        type: "MULTIPLICATION_OPERATOR",
        value: char,
      } satisfies MultiplicationOperatorToken;
    }

    if (char === "(" || char === ")") {
      this.cursor++;

      return {
        type: char,
      } satisfies ParenthesisToken;
    }

    throw new Error("Unknown token");
  }
}

function isNumber(char: string): boolean {
  return !Number.isNaN(Number(char));
}

type NumberToken = {
  type: "NUMBER";
  value: number;
};

type AdditionOperatorToken = {
  type: "ADDITION_OPERATOR";
  value: "+" | "-";
};

type MultiplicationOperatorToken = {
  type: "MULTIPLICATION_OPERATOR";
  value: "*" | "/";
};

type ParenthesisToken = {
  type: "(" | ")";
};

export type OperatorToken = AdditionOperatorToken | MultiplicationOperatorToken;

export type Token = NumberToken | OperatorToken | ParenthesisToken;
