export interface Movie {
  _id: string;
  title: string;
  posterUrl: string;
  imageFileId?: string;
  catagory: string; // Backend uses 'catagory'
  rating: string;
  releaseDate: string | number;
  status: "available" | "coming_soon";
}