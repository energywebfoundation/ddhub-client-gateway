export const parseJson = (value: object | string) => {
  try {
    return typeof value === 'object'
      ? JSON.stringify(value, null, 2)
      : JSON.stringify(JSON.parse(value), null, 2);
  } catch (error) {
    return '';
  }
};

export const downloadJson = (value: object | string, name: string) => {
  const json = parseJson(value);

  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([json], { type: `application/json` }));
  a.download = name;
  a.click();
};
