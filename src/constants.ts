export enum CHARACTER_SET {
  CR = "\r",
  LF = "\n",
  CRLF = "\r\n",
  SP = " ",
}

export const HEADER_AND_BODY_SEPARATOR = CHARACTER_SET.CRLF + CHARACTER_SET.CRLF;

export const HEADER_KEY_VALUE_SEPARATOR = ": ";