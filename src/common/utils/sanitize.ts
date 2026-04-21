import sanitizeHtml from 'sanitize-html';

export function cleanText(value: string): string {
  if (!value) return value;

  return sanitizeHtml(value, {
    allowedTags: [], //  elimina TODO el HTML peligroso
    allowedAttributes: {},
  });
}