"use server";
import { imagekit } from "@/lib/imagekit";

export interface UploadResponse {
  success: boolean;
  url?: string;
  fileId?: string;
  error?: string;
}

export async function uploadImage(formData: FormData): Promise<UploadResponse> {
  const file = formData.get("image") as File;

  if (!file || file.size === 0) {
    return { success: false, error: "No file uploaded or file is empty" };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const response = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder: "Movies", 
    });

    return { 
      success: true, 
      url: response.url, 
      fileId: response.fileId 
    };
  } catch (error: unknown) {
    console.error("ImageKit Upload Error:", error);
    const message = error instanceof Error ? error.message : "Something went wrong during upload";
    return { 
      success: false, 
      error: message
    };
  }
}