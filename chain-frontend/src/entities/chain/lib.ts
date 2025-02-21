import { useChainState } from "./model";
import { getChainList } from "./api/list";
import { redirect } from "@tanstack/react-router";

export async function requireChains(namespaceId: string) {
  const chainState = useChainState.getState();
  if (chainState.chains) return;

  const chains = await getChainList(namespaceId);
  if (chains === null) throw redirect({ to: "/" });

  chainState.setChains(chains);
}
