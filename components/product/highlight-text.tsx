interface HighlightTextProps {
  text: string;
  searchQuery: string;
}

export function HighlightText({ text, searchQuery }: HighlightTextProps) {
  if (!searchQuery.trim()) {
    return <span>{text}</span>;
  }

  // Split search query into individual words
  const searchWords = searchQuery
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (searchWords.length === 0) {
    return <span>{text}</span>;
  }

  const lowerText = text.toLowerCase();
  const textLength = text.length;
  
  // Create an array to track which characters should be highlighted
  const highlightMap = new Array(textLength).fill(false);

  // Mark all matching words in the highlight map
  searchWords.forEach((word) => {
    let index = lowerText.indexOf(word, 0);
    while (index !== -1) {
      // Mark all characters in this match as highlighted
      for (let i = index; i < index + word.length && i < textLength; i++) {
        highlightMap[i] = true;
      }
      index = lowerText.indexOf(word, index + 1);
    }
  });

  // Build the parts array from the highlight map
  const parts: Array<{ text: string; isMatch: boolean }> = [];
  let currentPart = { text: "", isMatch: highlightMap[0] || false };

  for (let i = 0; i < textLength; i++) {
    const shouldHighlight = highlightMap[i];

    if (shouldHighlight === currentPart.isMatch) {
      // Continue the current part
      currentPart.text += text[i];
    } else {
      // Save current part and start a new one
      if (currentPart.text) {
        parts.push(currentPart);
      }
      currentPart = { text: text[i], isMatch: shouldHighlight };
    }
  }

  // Add the last part
  if (currentPart.text) {
    parts.push(currentPart);
  }

  // If no parts were created (shouldn't happen, but safety check)
  if (parts.length === 0) {
    return <span>{text}</span>;
  }

  return (
    <span>
      {parts.map((part, i) =>
        part.isMatch ? (
          <mark
            key={i}
            className="bg-primary/20 text-primary font-semibold rounded px-0.5"
          >
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </span>
  );
}

