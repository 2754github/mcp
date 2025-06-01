import { randomBytes } from "node:crypto";

const pool = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").filter((x) => {
  return ![
    "D", // 0
    "O", // 0
    "Q", // 0
    "I", // 1
    "Z", // 2
    "S", // 5
    "G", // 6
    "B", // 8
  ].includes(x);
});

const poolLength = pool.length;

export const generateId = (length: number): string => {
  return randomBytes(length).reduce(
    (prev, curr) => {
      return prev + pool[curr % poolLength];
    },
    "",
  );
};

import { expect } from "jsr:@std/expect@1";

Deno.test("generateId", () => {
  const testCases = [
    {
      length: -1,
      expected: new RangeError(
        'The value of "size" is out of range. It must be >= 0 && <= 2147483647. Received -1',
      ),
    },
    {
      length: 0,
      expected: /^$/,
    },
    {
      length: 1,
      expected: /^[0-9ACEFHJKLMNPRTUVWXY]{1}$/,
    },
    {
      length: 28,
      expected: /^[0-9ACEFHJKLMNPRTUVWXY]{28}$/,
    },
    {
      length: 2147483647,
      expected: new RangeError(
        "Attempt to allocate Buffer larger than maximum size: 0x7fffffff bytes",
      ),
    },
  ];

  for (const testCase of testCases) {
    const { length, expected } = testCase;

    if (Error.isError(expected)) {
      const actual = () => {
        generateId(length);
      };

      expect(actual).toThrow(expected);
      expect(actual).toThrow(expected.message);
    } else {
      const actual = generateId(length);

      expect(actual).toMatch(expected);
    }
  }
});
