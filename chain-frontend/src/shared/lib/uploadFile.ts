import { z } from "zod";
import { getAxios } from "./getAxios";

const fileSchema = z.object({
  url: z.string(),
});

export async function uploadFile(file: File) {
  const axios = getAxios();

  try {
    const data = new FormData();
    data.set("file", file);

    const response = await axios.post("/s3", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return fileSchema.parse(response.data).url;
  } catch {
    return null;
  }
}
