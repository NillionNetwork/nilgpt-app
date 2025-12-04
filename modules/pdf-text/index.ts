import PdfTextModule from './src/PdfTextModule';

export const getPageCount = async (filePath: string) => {
  return await PdfTextModule.getPageCount(filePath);
};

export const getText = async (filePath: string) => {
  return await PdfTextModule.getText(filePath);
};
