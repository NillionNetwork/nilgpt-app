import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';

import { Ionicons } from './ExpoIcon';

const CopyButton: React.FC<{ content: string }> = ({ content }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyContentToClipboard = () => {
    Clipboard.setStringAsync(content)
      .then(() => setIsCopied(true))
      .finally(() => setTimeout(() => setIsCopied(false), 1000));
  };

  return (
    <>
      {isCopied ? (
        <Ionicons name="checkmark" size={14} className="text-neutral-400" />
      ) : (
        <Ionicons
          name="copy-outline"
          size={14}
          className="text-neutral-400 active:opacity-70"
          onPress={copyContentToClipboard}
        />
      )}
    </>
  );
};

export default CopyButton;
