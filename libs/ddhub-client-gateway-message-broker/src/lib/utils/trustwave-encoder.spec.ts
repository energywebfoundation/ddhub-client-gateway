import {
  decodeValuesOnly,
  decodeValuesOnlyArray,
  encodeValuesBySchema,
  encodeValuesOnlyArray,
} from './trustwave-encoder';
import type { JSONSchema7 } from 'json-schema';

describe('trustwave-encoder', () => {
  describe('decodeValuesOnly', () => {
    it('should maintain numeric and boolean string fields as strings in JSON payloads', () => {
      const payload = {
        vendorName: '213',
        email: 'test@energyweb&#x2E;org',
        vendorId: 123,
        communityId: 'asd',
        decimal: '1.5',
        leadingZeros: '00123',
        text: 'abc',
        bool: 'true',
        nul: 'null',
        sci: '1e3',
        json: '{"x":1}',
      };

      const serializedWire = JSON.stringify(payload);
      const decoded = decodeValuesOnly(serializedWire);

      // Verify all strings maintain their exact string types
      expect(typeof decoded.vendorName).toBe('string');
      expect(decoded.vendorName).toBe('213');

      expect(typeof decoded.decimal).toBe('string');
      expect(decoded.decimal).toBe('1.5');

      expect(typeof decoded.bool).toBe('string');
      expect(decoded.bool).toBe('true');

      expect(typeof decoded.nul).toBe('string');
      expect(decoded.nul).toBe('null');

      expect(typeof decoded.sci).toBe('string');
      expect(decoded.sci).toBe('1e3');

      expect(typeof decoded.json).toBe('string');
      expect(decoded.json).toBe('{"x":1}');

      expect(typeof decoded.leadingZeros).toBe('string');
      expect(decoded.leadingZeros).toBe('00123');

      // Verify HTML entities are decoded
      expect(decoded.email).toBe('test@energyweb.org');

      // Verify numbers and primitives are preserved
      expect(typeof decoded.vendorId).toBe('number');
      expect(decoded.vendorId).toBe(123);
    });

    it('should decode standalone scalar strings without converting to numbers', () => {
      expect(decodeValuesOnly('213')).toBe('213');
      expect(typeof decodeValuesOnly('213')).toBe('string');

      expect(decodeValuesOnly('true')).toBe('true');
      expect(typeof decodeValuesOnly('true')).toBe('string');

      expect(decodeValuesOnly('topic-name-100')).toBe('topic-name-100');
    });

    it('should handle nested objects and arrays preserving string types', () => {
      const complex = {
        nested: {
          code: '099',
          amount: '42.50',
          active: 'false',
        },
        items: ['10', '20', '30'],
      };

      const decoded = decodeValuesOnly(JSON.stringify(complex));

      expect(typeof decoded.nested.code).toBe('string');
      expect(decoded.nested.code).toBe('099');

      expect(typeof decoded.nested.amount).toBe('string');
      expect(decoded.nested.amount).toBe('42.50');

      expect(typeof decoded.nested.active).toBe('string');
      expect(decoded.nested.active).toBe('false');

      expect(decoded.items).toEqual(['10', '20', '30']);
      expect(typeof decoded.items[0]).toBe('string');
    });

    it('should handle already-parsed object inputs', () => {
      const obj = {
        vendorName: '213',
        email: 'test&#x2E;org',
        count: 5,
      };

      const decoded = decodeValuesOnly(obj);

      expect(decoded.vendorName).toBe('213');
      expect(typeof decoded.vendorName).toBe('string');
      expect(decoded.email).toBe('test.org');
      expect(decoded.count).toBe(5);
    });
  });

  describe('encodeValuesBySchema and round-trip', () => {
    it('should round-trip payload without type corruption when schema defines vendorName as string', () => {
      const schema: JSONSchema7 = {
        type: 'object',
        properties: {
          vendorName: { type: 'string', maxLength: 25 },
          email: { type: 'string' },
        },
      };

      const originalPayload = {
        vendorName: '213',
        email: 'user/test@energyweb.org',
        numericId: 999,
        status: 'true',
      };

      // Send side
      const encoded = encodeValuesBySchema(JSON.stringify(originalPayload), schema);
      const wire = JSON.stringify(encoded);

      // Receive side
      const received = decodeValuesOnly(wire);

      expect(received.vendorName).toBe('213');
      expect(typeof received.vendorName).toBe('string');

      expect(received.email).toBe('user/test@energyweb.org');
      expect(typeof received.email).toBe('string');

      expect(received.numericId).toBe(999);
      expect(typeof received.numericId).toBe('number');

      expect(received.status).toBe('true');
      expect(typeof received.status).toBe('string');
    });
  });

  describe('edge cases and deep nesting', () => {
    it('should handle null, undefined, boolean, and number inputs gracefully', () => {
      expect(decodeValuesOnly(null)).toBeNull();
      expect(decodeValuesOnly(undefined)).toBeUndefined();
      expect(decodeValuesOnly(true)).toBe(true);
      expect(decodeValuesOnly(false)).toBe(false);
      expect(decodeValuesOnly(0)).toBe(0);
      expect(decodeValuesOnly(123.45)).toBe(123.45);
      expect(decodeValuesOnly(-99)).toBe(-99);
    });

    it('should handle empty strings and whitespace strings', () => {
      expect(decodeValuesOnly('')).toBe('');
      expect(decodeValuesOnly('   ')).toBe('   ');
    });

    it('should handle malformed JSON strings without crashing', () => {
      expect(decodeValuesOnly('{not a json')).toBe('{not a json');
      expect(decodeValuesOnly('{"unclosed":')).toBe('{"unclosed":');
    });

    it('should handle empty objects and arrays', () => {
      expect(decodeValuesOnly('{}')).toEqual({});
      expect(decodeValuesOnly('[]')).toEqual([]);
    });

    it('should preserve nulls and booleans inside nested objects', () => {
      const input = {
        name: '213',
        description: null,
        isActive: false,
        nested: {
          emptyField: null,
          isVerified: true,
          count: 0,
        },
      };

      const decoded = decodeValuesOnly(JSON.stringify(input));
      expect(decoded.name).toBe('213');
      expect(typeof decoded.name).toBe('string');
      expect(decoded.description).toBeNull();
      expect(decoded.isActive).toBe(false);
      expect(decoded.nested.emptyField).toBeNull();
      expect(decoded.nested.isVerified).toBe(true);
      expect(decoded.nested.count).toBe(0);
    });

    it('should handle arrays of objects with nested string and numeric values', () => {
      const input = [
        { id: '001', code: '213', total: 100 },
        { id: '002', code: '1.5', total: 200 },
        { id: '003', code: 'true', total: 300 },
      ];

      const decoded = decodeValuesOnly(JSON.stringify(input));
      expect(Array.isArray(decoded)).toBe(true);
      expect(decoded.length).toBe(3);

      expect(decoded[0].id).toBe('001');
      expect(typeof decoded[0].id).toBe('string');
      expect(decoded[0].code).toBe('213');
      expect(typeof decoded[0].code).toBe('string');
      expect(decoded[0].total).toBe(100);

      expect(decoded[1].code).toBe('1.5');
      expect(typeof decoded[1].code).toBe('string');

      expect(decoded[2].code).toBe('true');
      expect(typeof decoded[2].code).toBe('string');
    });

    it('should handle 4+ levels of nesting (deep structures)', () => {
      const deep = {
        l1: {
          l2: {
            l3: {
              l4: {
                target: '213',
                flag: 'false',
                items: ['10', '20'],
              },
            },
          },
        },
      };

      const decoded = decodeValuesOnly(JSON.stringify(deep));
      expect(decoded.l1.l2.l3.l4.target).toBe('213');
      expect(typeof decoded.l1.l2.l3.l4.target).toBe('string');
      expect(decoded.l1.l2.l3.l4.flag).toBe('false');
      expect(typeof decoded.l1.l2.l3.l4.flag).toBe('string');
      expect(decoded.l1.l2.l3.l4.items).toEqual(['10', '20']);
      expect(typeof decoded.l1.l2.l3.l4.items[0]).toBe('string');
    });

    it('should preserve stringified JSON inside a nested property', () => {
      const input = {
        id: '123',
        rawConfig: '{"subKey":"subVal","innerNum":"456"}',
      };

      const decoded = decodeValuesOnly(JSON.stringify(input));
      expect(decoded.id).toBe('123');
      expect(typeof decoded.id).toBe('string');
      expect(decoded.rawConfig).toBe('{"subKey":"subVal","innerNum":"456"}');
      expect(typeof decoded.rawConfig).toBe('string');
    });
  });

  describe('array helpers', () => {
    it('should encode and decode string arrays', () => {
      const tags = ['tag/1', 'tag.2'];
      const encoded = encodeValuesOnlyArray(tags);
      expect(encoded[0]).toContain('&#x2F;');
      expect(encoded[1]).toContain('&#x2E;');

      const decoded = decodeValuesOnlyArray(encoded);
      expect(decoded).toEqual(tags);
    });
  });
});
