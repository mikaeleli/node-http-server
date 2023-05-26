import { Token, MathTokenizer } from "./tokenizer";

export class MathParser {
  private tokenizer: MathTokenizer;
  private lookahead: Token | null = null;

  constructor() {
    this.tokenizer = new MathTokenizer();
  }

  public parse(data: string) {
    this.tokenizer.init(data);

    this.lookahead = this.tokenizer.getNext();

    return this.Program();
  }

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
    return this.Expression();
  }

  private Expression() {
    return this.Addition();
  }

  private BinaryExpression(
    expressionBuilder: () => BinaryExpression,
    operatorToken: "ADDITION_OPERATOR" | "MULTIPLICATION_OPERATOR"
  ) {
    let left = expressionBuilder();

    while (this.lookahead?.type === operatorToken) {
      const operator = this.eat(operatorToken).value;
      const right = expressionBuilder();

      left = {
        type: "BinaryExpression",
        left,
        right,
        operator: operator,
      } satisfies BinaryExpression;
    }

    return left;
  }

  private Addition(): BinaryExpression {
    return this.BinaryExpression(
      () => this.Multiplication(),
      "ADDITION_OPERATOR"
    );
  }

  private Multiplication(): BinaryExpression {
    return this.BinaryExpression(
      () => this.PrimaryExpression(),
      "MULTIPLICATION_OPERATOR"
    );
  }

  private PrimaryExpression() {
    switch (this.lookahead?.type) {
      case "NUMBER":
        return this.Number();
      case "(":
        return this.ParenthesizedExpression();
      default:
        throw new Error(
          `PrimaryExpression: Unexpected token ${this.lookahead?.type}`
        );
    }
  }

  private ParenthesizedExpression(): BinaryExpression {
    this.eat("(");
    const expression = this.Expression();
    this.eat(")");

    return expression;
  }

  private Number(): NumberLiteral {
    const token = this.eat("NUMBER");

    return {
      type: "number",
      value: token.value,
    };
  }
}

type NumberLiteral = {
  type: "number";
  value: number;
};

export type BinaryExpression =
  | {
      type: "BinaryExpression";
      left: BinaryExpression | NumberLiteral;
      right: BinaryExpression | NumberLiteral;
      operator: "+" | "-" | "*" | "/";
    }
  | NumberLiteral;
