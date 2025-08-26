import he from 'he';


function looksLikeDateTime(str: string): boolean {
  // Quick reject if it's empty or too short
  if (!str || str.length < 6) return false;

  // Try to parse as Date
  const d = new Date(str);

  // Check if parsing produced a valid date
  return !isNaN(d.getTime());
}

export function encodeTrustwave(str: string): string {
  try {
    // Wrap in quotes so JSON.parse can interpret escapes
    str = JSON.parse(`"${str.replace(/"/g, '\\"')}"`);
  } catch {
    // If parsing fails (malformed escapes), just keep the original
  }

  if (looksLikeDateTime(str)) {
    return str;
  }

  return he.encode(str, { useNamedReferences: true })
    .replace(/&apos;/g, '&#x27;')  // enforce Trustwave's mapping
    .replace(/\//g, '&#x2F;')
    .replace(/-/g, '&#x2D;')
    .replace(/\r/g, '&#13;')
    .replace(/\n/g, '&#10;');
}

export function decodeTrustwave(str: string): string {
  const normalized = str
    .replace(/&#13;/gi, '\r')
    .replace(/&#10;/gi, '\n');
  return he.decode(normalized);
}

export function encodeValuesOnly(input, topLevel?: boolean) {
  let obj = input;

  // If it's a string and looks like JSON, try parsing
  if (typeof input === 'string') {
    try {
      if (!topLevel) {
        obj = JSON.stringify(JSON.parse(input));
      } else {
        obj = JSON.parse(input);
      }
    } catch (e) {
      // Not valid JSON, just encode the string directly
      return encodeTrustwave(input);
    }
  }

  if (typeof obj === 'string') return encodeTrustwave(obj);
  if (Array.isArray(obj)) return obj.map(v => encodeValuesOnly(v, false));
  if (obj && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, k) => {
      acc[k] = encodeValuesOnly(obj[k]);
      return acc;
    }, {});
  }
  return obj;
}

export function decodeValuesOnly(input) {
  let obj = input;

  // If it's a string and looks like JSON, try parsing
  if (typeof input === 'string') {
    try {
      obj = JSON.parse(input);
    } catch (e) {
      // Not valid JSON, just encode the string directly
      return decodeTrustwave(input);
    }
  }

  if (typeof obj === 'string') return decodeTrustwave(obj);
  if (Array.isArray(obj)) return obj.map(decodeValuesOnly);
  if (obj && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = decodeValuesOnly(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}

export function encodeValuesOnlyArray(arr: string[]): string[] {
  return arr.map(encodeTrustwave);
}

export function decodeValuesOnlyArray(arr: string[]): string[] {
  return arr.map(decodeTrustwave);
}