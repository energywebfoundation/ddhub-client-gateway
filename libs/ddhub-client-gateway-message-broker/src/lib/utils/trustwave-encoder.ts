import he from 'he';
import type { JSONSchema7 } from "json-schema";


function listStringTypeOnlyBy(schema: JSONSchema7, basePtr = ""): string[] {
  const out: string[] = [];

  if (schema.type === "object" && schema.properties) {
    for (const [key, sub] of Object.entries(schema.properties)) {
      const ptr = `${basePtr}/${key}`;
      if (
        sub &&
        (sub as JSONSchema7).type === "string" &&
        !(sub as JSONSchema7).pattern &&
        !(sub as JSONSchema7).enum &&
        !(sub as JSONSchema7).format &&
        !(sub as JSONSchema7).const
      ) {
        out.push(ptr);
      }
      out.push(...listStringTypeOnlyBy(sub as JSONSchema7, ptr));
    }
  }

  if (Array.isArray(schema.allOf)) {
    for (const s of schema.allOf) {
      out.push(...listStringTypeOnlyBy(s as JSONSchema7, basePtr));
    }
  }

  return Array.from(new Set(out));
}

function encodeFieldsBy(data: any, ptrs: string[]) {
  for (const ptr of ptrs) {
    const parts = ptr.split("/").filter(Boolean);
    let ref: any = data;
    for (let i = 0; i < parts.length - 1; i++) {
      ref = ref?.[parts[i]];
      if (ref === undefined) break;
    }
    const last = parts[parts.length - 1];
    if (ref && typeof ref[last] === "string") {
      ref[last] = htmlEncode(ref[last]);
    }
  }
  return data;
}

function htmlEncode(str: string): string {
  return he.encode(str, { useNamedReferences: true })
    .replace(/&apos;/g, '&#x27;')  // trustwave: use &#x27; (not &apos;)
    .replace(/\//g, '&#x2F;')
    .replace(/-/g, '&#x2D;')
    .replace(/\./g, '&#x2E;')
    .replace(/\\/g, '&#x5C;')
    // eslint-disable-next-line no-control-regex
    .replace(/\x08/g, '&#x08;')   // \b backspace
    // eslint-disable-next-line no-control-regex
    .replace(/\x0C/g, '&#x0C;')   // \f form feed
    .replace(/\n/g, '&#10;')      // newline
    .replace(/\r/g, '&#13;')      // carriage return
    .replace(/\t/g, '&#x09;');    // tab
}

export function encodeTrustwave(str: string): string {
  try {
    // Wrap in quotes so JSON.parse can interpret escapes
    str = JSON.parse(`"${str.replace(/"/g, '\\"')}"`);
  } catch {
    // If parsing fails (malformed escapes), just keep the original
  }

  return htmlEncode(str);
}

export function decodeTrustwave(str: string): string {
  const normalized = str
    .replace(/&#x27;/gi, "'")   // apostrophe
    .replace(/&#x2F;/gi, '/')
    .replace(/&#x2D;/gi, '-')
    .replace(/&#x2E;/gi, '.')
    .replace(/&#x5C;/gi, '\\')
    .replace(/&#x08;/gi, '\b')  // backspace
    .replace(/&#x0C;/gi, '\f')  // form feed
    .replace(/&#10;/gi, '\n')   // newline
    .replace(/&#13;/gi, '\r')   // carriage return
    .replace(/&#x09;/gi, '\t'); // tab

  return he.decode(normalized);
}

export function encodeValuesBySchema(input: any, schema: JSONSchema7) {
  const data = typeof input === "string" ? JSON.parse(input) : input;
  const fields = listStringTypeOnlyBy(schema, "");
  return encodeFieldsBy(data, fields);
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
      // Not valid JSON, try decoding HTML-encoded content
      let decoded = input;
      let stillEncoded = true;
      let decodeCount = 0;
      const maxDecodes = 3; // Handle up to triple encoding

      while (stillEncoded && decodeCount < maxDecodes) {
        const previousDecoded = decoded;
        decoded = decodeTrustwave(decoded);
        decodeCount++;

        // Check if it's still encoded
        stillEncoded = decoded.includes('&lt;') || decoded.includes('&gt;') ||
          decoded.includes('&#x27;') || decoded.includes('&amp;');

        // If no change occurred, break to avoid infinite loop
        if (decoded === previousDecoded) {
          break;
        }
      }

      try {
        obj = JSON.parse(decoded);
      } catch (e2) {
        // Still not valid JSON, return the decoded string
        return decoded;
      }
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