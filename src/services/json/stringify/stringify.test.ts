import { describe, expect, test } from "vitest";
import { jsonStringify } from "./stringify";

describe(jsonStringify.name, () => {
  test("string", () => {
    const result = jsonStringify("hello");
    expect(result).toEqual('"hello"');
  });

  test("number", () => {
    const result = jsonStringify(16);
    expect(result).toEqual("16");
  });

  test("boolean", () => {
    const result = jsonStringify(true);
    expect(result).toEqual("true");
  });

  test("null", () => {
    const result = jsonStringify(null);
    expect(result).toEqual("null");
  });

  test("undefined", () => {
    const result = jsonStringify(undefined);
    expect(result).toEqual(undefined);
  });

  test("empty array", () => {
    const result = jsonStringify([]);
    expect(result).toEqual("[]");
  });

  test("array", () => {
    const result = jsonStringify([1, 2, 3]);
    expect(result).toEqual("[1,2,3]");
  });

  test("nested array", () => {
    const result = jsonStringify([1, 2, [3, 4]]);
    expect(result).toEqual("[1,2,[3,4]]");
  });

  test("array with all types", () => {
    const result = jsonStringify([
      "hello",
      16,
      true,
      null,
      undefined,
      [1, 2, 3],
    ]);

    expect(result).toEqual('["hello",16,true,null,[1,2,3]]');
  })

  test("empty object", () => {
    const result = jsonStringify({});

    expect(result).toEqual("{}");
  });

  test("simple object", () => {
    const result = jsonStringify({
      name: "Mikael",
      age: 28,
      hadLaserSurgery: true,
    });

    expect(result).toEqual('{"name":"Mikael","age":28,"hadLaserSurgery":true}');
  });

  test("nested object", () => {
    const result = jsonStringify({
      name: "Mikael",
      age: 28,
      hadLaserSurgery: true,
      address: {
        city: "Reykjavík",
        country: "Iceland",
      },
    });

    expect(result).toEqual(
      '{"name":"Mikael","age":28,"hadLaserSurgery":true,"address":{"city":"Reykjavík","country":"Iceland"}}'
    );
  });

  test("object with all types", () => {
    const result = jsonStringify({
      name: "Mikael",
      age: 28,
      hadLaserSurgery: true,
      address: {
        city: "Reykjavík",
        country: "Iceland",
      },
      favoriteNumbers: [1, 2, 3],
      hair: null,
      shouldNotBeIncluded: undefined,
    });

    expect(result).toEqual(
      '{"name":"Mikael","age":28,"hadLaserSurgery":true,"address":{"city":"Reykjavík","country":"Iceland"},"favoriteNumbers":[1,2,3],"hair":null}'
    );
  });
});
