import { redirect } from "@tanstack/react-router";
import { requireChains } from "@/entities/chain/lib";
import { useChainState } from "@/entities/chain/model";
import { createFileRoute } from "@tanstack/react-router";

import { Typography } from "@mui/material";

function IndexPage() {
  return (
    <Typography
      variant="h4"
      sx={{ color: "#4C4E64DE" }}
      className="select-none"
    >
      Создайте цепочку
    </Typography>
  );
}

export const Route = createFileRoute("/$namespace/")({
  component: IndexPage,
  loader: async ({ params }) => {
    await requireChains(params.namespace);
    const chains = useChainState.getState().chains;

    if (typeof chains === "undefined") throw redirect({ to: "/" });

    if (chains[0]?._id)
      throw redirect({
        to: "/$namespace/$chainId",
        params: { namespace: params.namespace, chainId: chains[0]!._id },
      });
  },
});
