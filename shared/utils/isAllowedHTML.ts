export const isAllowedHTML = (val, allowedTags = []) => {
  const regex = /<([^/\s>]+)[^>]*>/gi;
  let match;

  while ((match = regex.exec(val)) !== null) {
    if (!allowedTags.includes(match[1].toLowerCase())) {
      return false;
    }
  }

  return true;
};
