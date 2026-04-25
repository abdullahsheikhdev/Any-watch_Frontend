"use server";
import { imagekit } from "@/lib/imagekit";

export interface UploadResponse {
  success: boolean;
  url?: string;
  fileId?: string;
  error?: string;
}

export async function uploadImage(formData: FormData): Promise<UploadResponse> {
  try {
    const file = formData.get("image") as File;

    if (!file || file.size === 0) {
      console.error("Upload Error: No file or empty file");
      return { success: false, error: "No file uploaded or file is empty" };
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      console.error("Upload Error: Invalid file type", file.type);
      return { success: false, error: "Invalid file type. Please upload an image." };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64File = buffer.toString("base64");

    console.log(`Uploading file: ${file.name}, size: ${file.size} bytes`);

    const response = await imagekit.upload({
      file: base64File,
      fileName: file.name,
      folder: "/Movies", 
    });

    console.log("ImageKit Upload Success:", response.url);

    return { 
      success: true, 
      url: response.url, 
      fileId: response.fileId 
    };
  } catch (error: any) {
    console.error("ImageKit Upload Error Details:", {
      message: error.message,
      stack: error.stack,
      details: error
    });
    
    let errorMessage = "Something went wrong during upload";
    if (error.message) errorMessage = error.message;
    if (error.help) errorMessage += `. ${error.help}`;

    return { 
      success: false, 
      error: errorMessage
    };
  }
}