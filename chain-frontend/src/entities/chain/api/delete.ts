import { getAxios } from "@/shared/lib/getAxios";

export async function deleteChainById(id: string) {
  const axios = getAxios();
  await axios.delete(`/chain/delete/${id}/`);
}
