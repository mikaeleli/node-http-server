type MathOperation = (a: number, b: number) => number;

const operations: Record<string, MathOperation> = {
  "+": (a: number, b: number) => a + b,
  "-": (a: number, b: number) => a - b,
  "*": (a: number, b: number) => a * b,
  "/": (a: number, b: number) => a / b,
};

const operators = Object.keys(operations);

export function simpleStringMath(input: string) {
  const nodes = [];

  let currentNode = "";

  for (let index = 0; index < input.length; index++) {
    const char = input[index].trim();

    if (Number.isInteger(Number(char))) {
      currentNode += char;
      continue;
    } else if (operators.includes(char)) {
      nodes.push(currentNode);
      nodes.push(char);
      currentNode = "";
      continue;
    }

    throw new Error(`Invalid character: ${char}`);
  }

  if (currentNode) {
    nodes.push(currentNode);
    currentNode = "";
  }

  let result = 0;
  let nextOperation: MathOperation | undefined = undefined;
  let a: number | undefined = undefined;
  let b: number | undefined = undefined;

  console.log({ nodes });

  nodes.forEach((node) => {
    if (operators.includes(node)) {
      nextOperation = operations[node];
      return;
    }
    if (a === undefined) {
      a = Number(node);
      return;
    }

    b = Number(node);

    result = nextOperation!(a, b);
    a = result;
    nextOperation = undefined;
    console.log("a", a);
    console.log("b", b);
    console.log("nextOperation", nextOperation);
    console.log("result", result);
  });

  return result;
}

type NumberToken = {
  type: "number";
  value: string;
};

type OperatorToken = {
  type: "operator";
  value: string;
};

type NestedToken = {
  type: "nested";
  nestedTokens: MathToken[];
};

type MathToken = NumberToken | OperatorToken | NestedToken;

export function mathLexer(input: string): MathToken[] {
  const tokens: MathToken[] = [];

  input = input.replace(/\s/g, "");
  console.log("[mathLexer] input", input);

  
  for (let index = 0; index < input.length; index++) {
    const char = input[index].trim();
    console.log(`[mathLexer] processing: "${char}"`);
    
    if (Number.isInteger(Number(char))) {
      let numberBuilder = char;
      let searchIndex = index + 1;
      let nextChar = input[searchIndex];

      while (Number.isInteger(Number(nextChar))) {
        numberBuilder += nextChar;
        searchIndex++;
        nextChar = input[searchIndex];
      }

      // move the index to the end of the number
      index += numberBuilder.length - 1;
      tokens.push({ type: "number", value: numberBuilder });
      continue;
    } else if (operators.includes(char)) {
      tokens.push({ type: "operator", value: char });
      continue;
    } else if (char === "(") {
      // this means that we have a nested expression and we need to find the matching closing parenthesis
      const slicedInput = input.slice(index);

      let nestedParenthesisCount = 0;

      for (
        let searchIndex = 0;
        searchIndex < slicedInput.length;
        searchIndex++
      ) {
        const searchChar = slicedInput[searchIndex];
        if (searchChar === "(") {
          nestedParenthesisCount++;
          continue;
        } else if (searchChar === ")") {
          nestedParenthesisCount--;
          if (nestedParenthesisCount === 0) {
            // we found the matching parenthesis
            // slice off the parenthesis
            const nestedEquation = slicedInput.slice(1, searchIndex);
            console.log("nested equation", { nestedEquation });
            const nestedTokens = mathLexer(nestedEquation);
            console.log("nested tokens", { nestedTokens });
            tokens.push({ type: "nested", nestedTokens });
            console.log(
              `setting index to ${index + searchIndex} which is "${input.slice(
                index + searchIndex
              )}"`
            );
            console.log("index before", index);
            index += searchIndex;
            console.log("index after", index);
            break;
          }
        }
      }

      if (nestedParenthesisCount !== 0) {
        throw new Error(`Error: Parenthesis not closed`);
      }

      continue;
    } else if (char === ")") {
      throw new Error(`Invalid state wadafakk: ${input.slice(0, index + 1)}`);
    }

    throw new Error(`Invalid character: ${char}`);
  }

  console.log("[mathLexer] tokens returned", tokens);

  return tokens;
}

// Use this function in the future, reduces the boilerplate in calculator
function performOperation({result, nextNumber, operation}: {result?: number, nextNumber: number, operation?: MathOperation}) {
  if (result === undefined) return nextNumber;

  if (!operation) throw new Error(`Invalid state: ${JSON.stringify({result, b: nextNumber, operation})}`);

  return operation(result, nextNumber);
}

// Order of operations: Brackets, Exponents, Division & Multiplication, Addition & Subtraction
function calculator(tokens: Array<MathToken>): number {
  let nextOperation: MathOperation | undefined = undefined;
  let result: number | undefined = undefined;

  console.log("[calculator]: got props:", { tokens });


  // if we only have one token and it's a number, return it
  // handles cases like (1)
  if (tokens.length === 1 && tokens[0].type === "number") return Number(tokens[0].value);

  tokens.forEach((token) => {
    console.log("[calculator] processing token: ", { token, nextOperation, result });

    switch (token.type) {
      case "nested":
        if (result === undefined) {
          console.log("assigning result to nested tokens")
          result = calculator(token.nestedTokens);
          break;
        }
        console.log("calculating nested tokens")
        if (!nextOperation)
          throw new Error(`Invalid state: ${JSON.stringify(token)}`);

        result = nextOperation(result, calculator(token.nestedTokens));
        break;
      case "number":
        if (result === undefined) {
          result = Number(token.value);
          break;
        }
        if (!nextOperation)
          throw new Error(`Invalid state: ${JSON.stringify(token)}`);
        result = nextOperation(result, Number(token.value));
        nextOperation = undefined;
        break;
      case "operator":
        nextOperation = operations[token.value];
        break;
      default:
        break;
    }

    console.log("[calculator]: result is now:", { result, nextOperation });
  });


  return result!;
}

export function complexMath(input: string) {
  console.log("complet math input: ", input);
  const tokens = mathLexer(input);

  console.log({ tokens });

  return calculator(tokens);
}
