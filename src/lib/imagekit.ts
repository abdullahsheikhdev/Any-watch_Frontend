import ImageKit from "imagekit";

if (!process.env.IMAGEKIT_PUBLIC_KEY || 
    !process.env.IMAGEKIT_PRIVATE_KEY || 
    !process.env.IMAGEKIT_URL_ENDPOINT) {
  throw new Error("Missing ImageKit Environment Variables");
}

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});