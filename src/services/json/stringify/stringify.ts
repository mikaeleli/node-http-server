// Recursively stringify a JSON object
export function jsonStringify(data: undefined): undefined;
export function jsonStringify(data: unknown): string;
export function jsonStringify(data: unknown): string | undefined {
  if (data === undefined) {
    return undefined;
  }

  if (typeof data === "string") {
    return `"${data}"`;
  }

  if (typeof data === "number") {
    return data.toString();
  }

  if (typeof data === "boolean") {
    return data.toString();
  }

  if (data === null) {
    return "null";
  }

  if (Array.isArray(data)) {
    const result = data
      // filter out undefined values
      .filter((item) => typeof item !== "undefined")
      .map((item) => jsonStringify(item))
      .join(",");
    return `[${result}]`;
  }

  if (typeof data === "object" && data.constructor === Object) {
    const result = Object.entries(data)
      // filter out undefined values
      .filter(([_, value]) => typeof value !== "undefined")
      .map(([key, value]) => {
        return `"${key}":${jsonStringify(value)}`;
      })
      .join(",");

    return `{${result}}`;
  }

  throw new Error("Not implemented");
}
