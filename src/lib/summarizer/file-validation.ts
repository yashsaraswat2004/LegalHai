const MAX_FILE_SIZE = 15 * 1024 * 1024;
const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain",
];

export function isAcceptedFile(file: File): boolean {
  return ACCEPTED_TYPES.includes(file.type) || file.name.endsWith(".txt");
}

export function validateFile(file: File): string | null {
  if (!isAcceptedFile(file)) {
    return "Please upload a PDF, image (JPG/PNG/WebP), or text file.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "File is too large. Maximum size is 15 MB.";
  }
  return null;
}
