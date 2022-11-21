import { defineFeature, loadFeature } from 'jest-cucumber';

console.log(__dirname);
const feature = loadFeature('../../feature/test.feature', {
  loadRelativePath: true,
});

jest.setTimeout(100000);

class Memory {
  public map = {};
}

const tempTestMemory = new Memory();

const givenChuj = (given) => {
  given('Chuj', () => {
    console.log('chuj');
  });
};

const whenCipa = (when, memo: Memory) => {
  when(/^Chuj into cipa with (.*)$/, (cm) => {
    memo.map['CM'] = cm;
  });
};

const thenResultCipa = (then, memo: Memory) => {
  then(/^Result (.*)$/, (cm) => {
    expect(memo.map['CM']).toBe(cm);
  });
};

describe('Test Feature', () => {
  beforeEach(() => {
    tempTestMemory.map = {};
  });

  defineFeature(feature, (test) => {
    test('CIPA', ({ given, when, then }) => {
      givenChuj(given);
      whenCipa(when, tempTestMemory);
      thenResultCipa(then, tempTestMemory);
    });
  });
});
