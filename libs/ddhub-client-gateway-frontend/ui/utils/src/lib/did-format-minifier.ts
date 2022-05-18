const CHARACTERS_AFTER_LAST_COLON = 7;
const LAST_CHARACTERS = 5;

export function didFormatMinifier(
  value: string,
  charsAfterLastColon: number = CHARACTERS_AFTER_LAST_COLON,
  lastCharacters: number = LAST_CHARACTERS
) {
  if (!value) {
    return value;
  }

  const lastColonIndex = value.lastIndexOf(':');
  return `${value.substring(
    0,
    lastColonIndex + charsAfterLastColon
  )}...${value.substring(value.length - lastCharacters)}`;
}
