/**
 * Simulates uploading an event image file.
 * In a real application, this would send the file to a server endpoint.
 * Here, we validate the file and return a Data URL for local preview and state management.
 * 
 * @param file The image file to upload.
 * @returns A promise that resolves with an object containing the public URL of the uploaded image.
 */
export async function uploadEventImage(file: File): Promise<{ url: string }> {
  const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File is too large. Maximum size is 8 MB.");
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Unsupported file type. Please use JPG, PNG, or WebP.");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({ url: reader.result as string });
    };
    reader.onerror = (error) => {
      reject(new Error("Failed to read file: " + error));
    };
    reader.readAsDataURL(file);
  });
}
