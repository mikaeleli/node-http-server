import { describe, expect, test } from "vitest";
import { JsonParser } from "./parser";

const parser = new JsonParser();

describe(JsonParser.name, () => {
  test("string", () => {
    const result = parser.parse('"name"');

    expect(result).toEqual({
      type: "string",
      value: "name",
    });
  });

  test("string with spaces", () => {
    const result = parser.parse('"hello darkness, my old friend"');

    expect(result).toEqual({
      type: "string",
      value: "hello darkness, my old friend",
    });
  });

  test("escaped string", () => {
    const result = parser.parse('"hello \\"world\\""');

    expect(result).toEqual({
      type: "string",
      value: 'hello \\"world\\"',
    });
  });

  test("multiple strings", () => {
    // should this be an error?
    const result = parser.parse('"name" "age"');

    expect(result).toEqual({
      type: "string",
      value: "name",
    });
  });

  test("number", () => {
    const result = parser.parse("123");

    expect(result).toEqual({
      type: "number",
      value: 123,
    });
  });

  test("boolean", () => {
    const result = parser.parse("true");

    expect(result).toEqual({
      type: "boolean",
      value: true,
    });
  });

  test("null", () => {
    const result = parser.parse("null");

    expect(result).toEqual({
      type: "null",
      value: null,
    });
  });

  test("empty object", () => {
    const result = parser.parse("{}");

    expect(result).toEqual({
      type: "object",
      fields: [],
    });
  });

  test("object", () => {
    const result = parser.parse('{"name":"mikael", "age": 28}');

    expect(result).toEqual({
      type: "object",
      fields: [
        {
          key: "name",
          value: {
            type: "string",
            value: "mikael",
          },
        },
        {
          key: "age",
          value: {
            type: "number",
            value: 28,
          },
        },
      ],
    });
  });

  test("nested object", () => {
    const result = parser.parse(
      '{"name":"mikael", "age": 28, "address": {"street": "123 main st"}}'
    );

    expect(result).toEqual({
      type: "object",
      fields: [
        {
          key: "name",
          value: {
            type: "string",
            value: "mikael",
          },
        },
        {
          key: "age",
          value: {
            type: "number",
            value: 28,
          },
        },
        {
          key: "address",
          value: {
            type: "object",
            fields: [
              {
                key: "street",
                value: {
                  type: "string",
                  value: "123 main st",
                },
              },
            ],
          },
        },
      ],
    });
  });

  test("deeply nested object", () => {
    const result = parser.parse(
      '{"name":"mikael", "age": 28, "address": {"street": "123 main st", "city": {"name": "san francisco"}}}'
    );
    expect(result).toEqual({
      type: "object",
      fields: [
        {
          key: "name",
          value: {
            type: "string",
            value: "mikael",
          },
        },
        {
          key: "age",
          value: {
            type: "number",
            value: 28,
          },
        },
        {
          key: "address",
          value: {
            type: "object",
            fields: [
              {
                key: "street",
                value: {
                  type: "string",
                  value: "123 main st",
                },
              },
              {
                key: "city",
                value: {
                  type: "object",
                  fields: [
                    {
                      key: "name",
                      value: {
                        type: "string",
                        value: "san francisco",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
  });

  test("empty array", () => {
    const result = parser.parse("[]");

    expect(result).toEqual({
      type: "array",
      items: [],
    });
  });

  test("simple array", () => {
    const result = parser.parse('["name", "age", 2, true]');

    expect(result).toEqual({
      type: "array",
      items: [
        {
          type: "string",
          value: "name",
        },
        {
          type: "string",
          value: "age",
        },
        {
          type: "number",
          value: 2,
        },
        {
          type: "boolean",
          value: true,
        },
      ],
    });
  });

  test("nested array", () => {
    const result = parser.parse('["name", "age", 2, true, ["hello", "world"]]');

    expect(result).toEqual({
      type: "array",
      items: [
        {
          type: "string",
          value: "name",
        },
        {
          type: "string",
          value: "age",
        },
        {
          type: "number",
          value: 2,
        },
        {
          type: "boolean",
          value: true,
        },
        {
          type: "array",
          items: [
            {
              type: "string",
              value: "hello",
            },
            {
              type: "string",
              value: "world",
            },
          ],
        },
      ],
    });
  });

  test("deeply nested array", () => {
    const result = parser.parse(
      '["name", "age", 2, true, ["hello", "world", ["foo", "bar"]]]'
    );

    expect(result).toEqual({
      type: "array",
      items: [
        {
          type: "string",
          value: "name",
        },
        {
          type: "string",
          value: "age",
        },
        {
          type: "number",
          value: 2,
        },
        {
          type: "boolean",
          value: true,
        },
        {
          type: "array",
          items: [
            {
              type: "string",
              value: "hello",
            },
            {
              type: "string",
              value: "world",
            },
            {
              type: "array",
              items: [
                {
                  type: "string",
                  value: "foo",
                },
                {
                  type: "string",
                  value: "bar",
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
