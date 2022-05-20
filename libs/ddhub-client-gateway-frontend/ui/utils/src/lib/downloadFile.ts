export type TFownloadFile = {
  data: string;
  name: string;
  contentType: string;
};

export const downloadFile = ({ data, name, contentType }: TFownloadFile) => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([data], { type: contentType }));
  a.download = name;
  a.click();
};
