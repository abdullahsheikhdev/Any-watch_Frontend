"use server";

import { imagekit } from "@/lib/imagekit";
import { revalidatePath } from "next/cache";

export async function deleteImageAction(fileId: string) {
  try {
    if (!fileId) {
      return { success: false, error: "File ID is required" };
    }


    await imagekit.deleteFile(fileId);


    revalidatePath("/"); 

    return { success: true, message: "Image deleted successfully" };
  } catch (error: any) {
    console.error("ImageKit Delete Error:", error);
    return { success: false, error: error.message || "Failed to delete image" };
  }
}