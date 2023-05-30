import { Token, MathTokenizer } from "./tokenizer";

// Recursive descent parser
// https://en.wikipedia.org/wiki/Recursive_descent_parser
// Code based on: https://dmitrysoshnikov.teachable.com/p/parser-from-scratch
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

  private Expression(): Expression {
    return this.Addition();
  }

  private BinaryExpression(
    expressionBuilder: () => Expression,
    operatorToken: "ADDITION_OPERATOR" | "MULTIPLICATION_OPERATOR"
  ) {
    // left is either a NumberLiteral or a BinaryExpression
    let left = expressionBuilder();

    // Recursively build up the BinaryExpression while the lookahead matches with the operatorToken
    // This is how we handle the order of operations
    // For example, 1 + 2 * 3 will be parsed as 1 + (2 * 3)
    // And 1 + 2 * 3 + 4 will be parsed as (1 + (2 * 3)) + 4
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

  // Multiplication has higher priority (in the order of operations) than addition, therefore, we call Multiplication first
  // This ensures that the Multiplication is evaluated first
  private Addition(): Expression {
    return this.BinaryExpression(
      () => this.Multiplication(),
      "ADDITION_OPERATOR"
    );
  }

  private Multiplication(): Expression {
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

  private ParenthesizedExpression(): Expression {
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

type Expression = BinaryExpression | NumberLiteral;

export type BinaryExpression = {
  type: "BinaryExpression";
  left: BinaryExpression | NumberLiteral;
  right: BinaryExpression | NumberLiteral;
  operator: "+" | "-" | "*" | "/";
};
