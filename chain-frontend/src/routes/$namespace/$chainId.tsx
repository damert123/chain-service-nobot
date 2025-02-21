import { redirect } from "@tanstack/react-router";
import { requireChains } from "@/entities/chain/lib";
import { createFileRoute } from "@tanstack/react-router";

import { ChainEditor } from "@/widgets/chain-editor";
import { useChainState } from "@/entities/chain/model";

function ChainPage() {
  const { chain } = Route.useLoaderData();
  return <ChainEditor key={chain._id} chain={chain} />;
}

export const Route = createFileRoute("/$namespace/$chainId")({
  component: ChainPage,
  loader: async ({ params }) => {
    await requireChains(params.namespace);
    const chainState = useChainState.getState();
    const chains = chainState.chains;

    if (typeof chains === "undefined")
      throw redirect({ to: "/$namespace", params });

    const selectedChain = chainState.getChain(params.chainId);
    if (!selectedChain) throw redirect({ to: "/$namespace", params });

    return { chain: selectedChain };
  },
});
