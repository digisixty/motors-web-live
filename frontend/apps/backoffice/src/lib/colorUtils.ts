// Function to determine if a color is light or dark
export const isLightColor = (color: string): boolean => {
  // Convert hex to RGB
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate luminance using the formula for relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  }

  // Handle RGB format
  if (color.startsWith("rgb")) {
    const rgbValues = color.match(/\d+/g);
    if (rgbValues && rgbValues.length >= 3) {
      const r = parseInt(rgbValues?.[0]);
      const g = parseInt(rgbValues?.[1] || "");
      const b = parseInt(rgbValues?.[2] || "");

      // Calculate luminance using the formula for relative luminance
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5;
    }
  }

  // Default to light if color format is not recognized
  return true;
};

export const parseColorValue = (
  value: string
): { hex: string; text: string }[] => {
  if (!value) return [];

  // Split by semicolon to get color-text pairs
  const pairs = value.split(";").filter((pair) => pair.trim());

  return pairs.map((pair) => {
    // Split each pair by comma to get hex and text
    const [hexPart, ...textParts] = pair.split(",");
    const hex = hexPart?.trim() || "";
    // Don't trim text to preserve trailing spaces
    const text = textParts.join(",").replace(/^ /, "") || "";

    return { hex, text };
  });
};
