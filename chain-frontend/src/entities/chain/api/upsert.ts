import { chainSchema, type Chain } from "../schema";
import { getAxios } from "@/shared/lib/getAxios";

export async function upsertChain(chain: Chain) {
  const axios = getAxios();

  try {
    const response = await axios.post("/chain/", chain);
    return chainSchema.parse(response.data);
  } catch {
    return null;
  }
}
