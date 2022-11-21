import { MemoryHelper } from './memory.helper';

export const thenResponseMemTypeShouldBe = (then, memory: MemoryHelper) => {
  then(
    /^Response status for (.*) should be (.*)$/,
    (memType: string, responseStatus: number) => {
      expect(memory.map[memType].res.statusCode).toBe(+responseStatus);
    }
  );
};
