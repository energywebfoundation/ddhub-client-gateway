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
    .replace(/&apos;/g, '&#x27;')  // enforce Trustwave's mapping
    .replace(/\//g, '&#x2F;')
    .replace(/-/g, '&#x2D;')
    .replace(/\r/g, '&#13;')
    .replace(/\n/g, '&#10;');
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
    .replace(/&#13;/gi, '\r')
    .replace(/&#10;/gi, '\n');
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