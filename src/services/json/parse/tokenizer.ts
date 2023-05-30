export class JsonTokenizer {
  private string = "";
  private cursor = 0;

  public init(data: string) {
    this.string = data;
    this.cursor = 0;
  }

  private hasNext() {
    return this.cursor < this.string.length;
  }

  public getNext(): Token | null {
    if (!this.hasNext()) {
      return null;
    }

    const char = this.string[this.cursor];

    // WHITESPACE
    if (char === " " || char === "\n" || char === "\t") {
      // skip whitespace
      this.cursor++;
      return this.getNext();
    }

    // COMMA
    if (char === ",") {
      // skip comma
      this.cursor++;
      return this.getNext();
    }

    // NUMBER
    if (isNumber(char)) {
      // Assign char to number to save a single loop
      // Amazing performance boost
      // Much wow
      const string = this.string.slice(this.cursor);
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

    // STRING
    if (char === '"') {
      // we found a double quote string and we need to find the matching closing double quote
      // we can't just split on the double quote because it might be escaped
      // we want to return the entire string, excluding the double quotes
      // so we need to find the next double quote that isn't escaped

      const slicedStringInput = this.string.slice(this.cursor);

      for (
        // start at 1 to skip the first double quote
        let searchIndex = 1;
        searchIndex < slicedStringInput.length;
        searchIndex++
      ) {
        const searchChar = slicedStringInput[searchIndex];
        const isEscapedQuote = slicedStringInput[searchIndex - 1] === "\\";
        if (searchChar === '"' && !isEscapedQuote) {
          // slice off the double quotes
          const value = slicedStringInput.slice(1, searchIndex);
          // move the cursor to the end of the string, plus two (2) to account for the double quotes
          this.cursor += value.length + 2;

          return {
            type: "STRING",
            // slice the string to remove the double quotes
            value,
          } satisfies StringToken;
        }
      }

      throw new Error(`String not terminated: ${this.string}`);
    }

    // BOOLEAN
    if (char === "t" || char === "f") {
      // we might have a boolean, let's check further

      const slicedStringInput = this.string.slice(this.cursor);

      const regExp = /\b(true|false)\b/;

      const match = regExp.exec(slicedStringInput);

      if (match) {
        // move the cursor to the end of the string
        this.cursor += match[0].length;

        return {
          type: "BOOLEAN",
          value: match[0] === "true",
        } satisfies BooleanToken;
      }
    }

    // NULL
    if (char === "n") {
      // we might have a null, let's check further

      const slicedStringInput = this.string.slice(this.cursor);

      const regExp = /\b(null)\b/;

      const match = regExp.exec(slicedStringInput);

      if (match) {
        // move the cursor to the end of the string
        this.cursor += match[0].length;

        return {
          type: "NULL",
          value: null,
        } satisfies NullToken;
      }
    }

    // COLON
    if (char === ":") {
      this.cursor++;

      return {
        type: char,
      } satisfies ColonToken;
    }

    // OBJECT
    if (char === "{" || char === "}") {
      this.cursor++;

      return {
        type: char,
      } satisfies ObjectToken;
    }

    // ARRAY
    if (char === "[" || char === "]") {
      this.cursor++;

      return {
        type: char,
      } satisfies ArrayToken;
    }

    throw new Error(`Unknown token ${char}`);
  }
}

function isNumber(char: string): boolean {
  // I added the char check because if a whitespace is passed in, it will return true
  return !!char && !Number.isNaN(Number(char));
}

type NumberToken = {
  type: "NUMBER";
  value: number;
};

type StringToken = {
  type: "STRING";
  value: string;
};

type BooleanToken = {
  type: "BOOLEAN";
  value: boolean;
};

type NullToken = {
  type: "NULL";
  value: null;
};

type ColonToken = {
  type: ":";
};

type ObjectToken = {
  type: "{" | "}";
};

type ArrayToken = {
  type: "[" | "]";
};

type LiteralToken = StringToken | NumberToken | BooleanToken | NullToken;

export type Token = LiteralToken | ColonToken | ObjectToken | ArrayToken;
