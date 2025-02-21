import type { Chain } from "@/entities/chain/schema";
import { useChainState } from "@/entities/chain/model";
import { useNavigate } from "@tanstack/react-router";

import { useState, useRef } from "react";
import { upsertChain } from "@/entities/chain/api/upsert";

import { ActionEditor } from "@/widgets/action-editor";
import { ActionCard } from "@/widgets/action-card";
import { RenameChainButton } from "@/features/rename-chain";
import { DeleteChainButton } from "@/features/delete-chain";

import { Typography, Button } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { CommentAction } from "@/entities/action/schema";

interface ChainEditorProps {
  chain: Chain;
}

export default function ChainEditor({ chain }: ChainEditorProps) {
  const actionsListRef = useRef<HTMLDivElement>(null);
  const [addingNewAction, setAddingNewAction] = useState(
    !chain.actions || chain.actions.length === 0,
  );

  const navigate = useNavigate({ from: "/$namespace/$chainId" });
  const addCommentAction = useChainState((state) => state.addCommentAction);
  const updateAction = useChainState((state) => state.updateAction);
  const [actionToEdit, setActionToEdit] = useState<number | null>(null);

  if (!chain.actions || addingNewAction || actionToEdit !== null)
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between">
          <Breadcrumbs sx={{ fontSize: "24px" }}>
            <Typography
              variant="h5"
              sx={{ color: "#4C4E64DE", opacity: "60%" }}
              className="select-none"
            >
              {chain.name}
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: "#4C4E64DE", opacity: "87%" }}
              className="select-none"
            >
              {actionToEdit === null ? "Новый пост" : "Редактировать пост"}
            </Typography>
          </Breadcrumbs>

          <div className="flex items-center gap-x-5">
            <RenameChainButton chain={chain} />
            <DeleteChainButton chain={chain} />
          </div>
        </div>

        <div className="flex grow flex-col items-center justify-center">
          <ActionEditor
            actionIndex={actionToEdit ?? 0}
            initialAction={
              actionToEdit !== null
                ? (chain.actions?.[actionToEdit] as CommentAction)
                : undefined
            }
            onSave={async (actionIndex, action) => {
              if (addingNewAction) {
                addCommentAction(chain._id!, action);
                setAddingNewAction(false);
              } else if (actionToEdit !== null) {
                updateAction(chain._id!, actionIndex, action);
                setActionToEdit(null);
              }

              await upsertChain(chain);
              navigate({ to: "/$namespace/$chainId" });

              if (addingNewAction) {
                setTimeout(
                  () =>
                    actionsListRef.current?.scrollTo({
                      behavior: "smooth",
                      top: actionsListRef.current.scrollHeight,
                    }),
                  0,
                );
              }
            }}
            onClose={() => {
              if (addingNewAction) setAddingNewAction(false);
              if (actionToEdit !== null) setActionToEdit(null);
            }}
            canExit={chain.actions?.length !== 0}
          />
        </div>
      </div>
    );

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex items-center justify-between">
        <Typography
          variant="h5"
          sx={{ color: "#4C4E64DE", opacity: "87%" }}
          className="select-none"
        >
          {chain.name}
        </Typography>
        <div className="flex items-center gap-x-5">
          <RenameChainButton chain={chain} />
          <DeleteChainButton chain={chain} />
        </div>
      </div>

      <div
        ref={actionsListRef}
        className="no-scrollbar flex grow flex-col items-center gap-y-24 overflow-y-scroll pb-20 pt-8"
      >
        {chain.actions.map((action, index) => (
          <ActionCard
            key={index}
            chain={chain}
            action={action}
            actionIndex={index}
            onEdit={(actionIndex) => {
              setActionToEdit(actionIndex);
            }}
          />
        ))}

        <div className="-mt-4">
          <Button
            variant="outlined"
            sx={{
              width: "450px",
            }}
            onClick={() => setAddingNewAction(true)}
          >
            Добавить
          </Button>
        </div>
      </div>
    </div>
  );
}
