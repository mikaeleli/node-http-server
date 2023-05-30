import { BinaryExpression, MathParser } from "./parser";

export function math(equation: string): number {
  const parser = new MathParser();
  const expression = parser.parse(equation);

  return evaluateBinaryExpression(expression);
}

const operations: Record<string, (a: number, b: number) => number> = {
  "+": (a: number, b: number) => a + b,
  "-": (a: number, b: number) => a - b,
  "*": (a: number, b: number) => a * b,
  "/": (a: number, b: number) => a / b,
};

function evaluateBinaryExpression(expression: BinaryExpression): number {
  if (expression.type === "number") return expression.value;

  return operations[expression.operator](
    evaluateBinaryExpression(expression.left),
    evaluateBinaryExpression(expression.right)
  );
}
