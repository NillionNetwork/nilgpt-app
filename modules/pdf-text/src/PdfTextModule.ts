import { NativeModule, requireNativeModule } from 'expo';

import { PdfTextModuleEvents } from './PdfText.types';

declare class PdfTextModule extends NativeModule<PdfTextModuleEvents> {
  getPageCount(filePath: string): Promise<number>;
  getText(filePath: string): Promise<string>;
}

export default requireNativeModule<PdfTextModule>('PdfText');
