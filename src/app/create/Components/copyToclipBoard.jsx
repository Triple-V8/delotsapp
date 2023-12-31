import React, { useState } from 'react';

const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (data) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(data).then(
        () => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        },
        (error) => {
          console.error('Failed to copy to clipboard:', error);
        }
      );
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = data;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return { copied, handleCopy };
};

export default useCopyToClipboard;
