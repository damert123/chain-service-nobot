import { useMemo } from "react";
import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useChainState } from "@/entities/chain/model";

import List from "@/shared/ui/List";
import { TextField } from "@mui/material";
import { AddChainButton } from "@/features/add-chain";

export default function Sidebar() {
  const params = useParams({ strict: false });
  const chains = useChainState((state) => state.chains || []);
  const [query, setQuery] = useState("");

  const filteredChains = useMemo(
    () =>
      chains.filter((value) =>
        value.name?.toLowerCase().includes(query.toLocaleLowerCase()),
      ),
    [query, chains],
  );

  // @ts-expect-error because i don't know why
  const chainId: string | undefined = params.chainId;

  return (
    <div className="no-scrollbar relative flex h-screen w-[450px] flex-col bg-bg-color px-4 pb-2">
      <div className="mt-3 flex w-full items-start gap-x-3 pb-3">
        <TextField
          fullWidth
          placeholder="Искать по названию"
          color="primary"
          sx={{ backgroundColor: "#23253B", input: { color: "white" } }}
          variant="outlined"
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <AddChainButton />
      </div>

      <div className="no-scrollbar grow overflow-y-scroll">
        <List.Root className="space-y-2">
          {filteredChains.map((chain) => (
            <List.LinkItem
              key={chain._id}
              to={`/$namespace/${chain._id}`}
              isSelected={chainId == chain._id}
            >
              {chain.name}
            </List.LinkItem>
          ))}
        </List.Root>
      </div>
    </div>
  );
}
