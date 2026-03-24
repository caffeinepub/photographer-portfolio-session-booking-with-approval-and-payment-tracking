/**
 * Validates and converts an image file to a data URL string.
 * Supports common image formats (JPEG, PNG, GIF, WebP) with a 5MB size limit.
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates an image file for type and size constraints
 */
export function validateImageFile(file: File): ImageValidationResult {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error:
        "Invalid file type. Please select a JPEG, PNG, GIF, or WebP image.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds 5MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`,
    };
  }

  return { valid: true };
}

/**
 * Converts an image file to a data URL string using FileReader
 */
export function convertImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file as data URL"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading file. Please try again."));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Validates and converts an image file to a data URL in one step
 */
export async function processImageFile(file: File): Promise<string> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return convertImageToDataUrl(file);
}
