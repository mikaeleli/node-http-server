import { JsonTokenizer, Token } from "./tokenizer";

// Recursive descent parser
// https://en.wikipedia.org/wiki/Recursive_descent_parser
// Code based on: https://dmitrysoshnikov.teachable.com/p/parser-from-scratch
export class JsonParser {
  private tokenizer: JsonTokenizer;
  private lookahead: Token | null = null;

  constructor() {
    this.tokenizer = new JsonTokenizer();
  }

  public parse(data: string) {
    this.tokenizer.init(data);

    this.lookahead = this.tokenizer.getNext();

    return this.Program();
  }

  // Sweet sweet generics to the rescue
  // Would otherwise have to do a bunch of type casting when eating a token
  private eat<T extends Token["type"]>(type: T): Token & { type: T } {
    const token = this.lookahead;

    if (!token) {
      throw new Error("Unexpected end of input");
    }

    if (token.type !== type) {
      throw new Error(`Expected ${type} but got ${token.type}`);
    }

    this.lookahead = this.tokenizer.getNext();

    return token as Token & { type: T };
  }

  private Program() {
    return this.Primary();
  }

  private Primary() {
    switch (this.lookahead?.type) {
      case "[":
        return this.Array();
      case "{":
        return this.Object();
      default:
        return this.Primative();
    }
  }

  private Object() {
    this.eat("{");

    const fields: Array<{ key: string; value: unknown }> = [];

    while (this.lookahead?.type !== "}") {
      const key = this.eat("STRING").value;

      this.eat(":");

      const value = this.Primary();

      fields.push({
        key,
        value,
      });
    }

    this.eat("}");

    return {
      type: "object",
      fields,
    };
  }

  private Array() {
    this.eat("[");

    const items: unknown[] = [];

    while (this.lookahead?.type !== "]") {
      const value = this.Primary();

      items.push(value);
    }

    this.eat("]");

    return {
      type: "array",
      items,
    };
  }

  private Primative() {
    switch (this.lookahead?.type) {
      case "STRING":
        return {
          type: "string",
          value: this.eat("STRING").value,
        };
      case "NUMBER":
        return {
          type: "number",
          value: this.eat("NUMBER").value,
        };
      case "BOOLEAN":
        return {
          type: "boolean",
          value: this.eat("BOOLEAN").value,
        };
      case "NULL":
        return {
          type: "null",
          value: this.eat("NULL").value,
        };
      default:
        throw new Error(`Unexpected token type`);
    }
  }
}
