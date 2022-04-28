export const downloadJson = (value: string, name: string) => {
  const json = value ? JSON.stringify(JSON.parse(value), null, 2) : value;

  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([json], { type: `text/json` }));
  a.download = name;
  a.click();
};
