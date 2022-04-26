export const downloadJson = (value: string, name: string) => {
  const json = value ? JSON.stringify(JSON.parse(value), null, 2) : value;

  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([json], { type: `text/json` }));
  a.download = name;
  a.click();
};

export const fields = [
  { label: 'Topic ID:', value: 'id' },
  { label: 'Version:', value: 'version' },
  { label: 'Topic Name:', value: 'name' },
  { label: 'Schema type:', value: 'schemaType' },
  { label: 'Tags:', value: 'tags' },
];
