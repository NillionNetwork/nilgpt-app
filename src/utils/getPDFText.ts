import { PDF_PAGE_LIMIT } from '@/components/ChatInput/constants';
import { getPageCount, getText } from '@modules/pdf-text';
import { Alert } from 'react-native';

const getPDFText = async (filePath: string) => {
  try {
    const pageCount = await getPageCount(filePath);
    if (pageCount > PDF_PAGE_LIMIT) {
      Alert.alert(
        'PDF too large',
        `Please select a PDF with ${PDF_PAGE_LIMIT} pages or less`,
      );
      return null;
    }

    const textContent = await getText(filePath);
    if (!textContent.trim()) {
      throw new Error('PDF has no text content');
    }

    return textContent;
  } catch (error) {
    Alert.alert(
      'Failed to process PDF',
      'Please try again with a different PDF',
    );
    console.error(error);
    return null;
  }
};

export default getPDFText;
