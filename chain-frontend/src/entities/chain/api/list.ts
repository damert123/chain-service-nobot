import { z } from "zod";
import { chainSchema } from "../schema";
import { getAxios } from "@/shared/lib/getAxios";

export async function getChainList(namespaceId: string) {
  const axios = getAxios();

  try {
    const response = await axios.get("/chain/list/", {
      params: { namespace_id: namespaceId },
    });
    return z.array(chainSchema).parse(response.data);
  } catch {
    return null;
  }
}
