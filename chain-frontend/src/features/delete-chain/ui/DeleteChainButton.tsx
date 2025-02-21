import type { Chain } from "@/entities/chain/schema";
import { deleteChainById } from "@/entities/chain/api/delete";

import { useState } from "react";
import { useChainState } from "@/entities/chain/model";
import { useNavigate } from "@tanstack/react-router";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { Button } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface DeleteChainButtonProps {
  chain: Chain;
}

export default function DeleteChainButton({ chain }: DeleteChainButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const deleteChain = useChainState((state) => state.deleteChain);
  const navigate = useNavigate({ from: "/$namespace/$chainId" });

  async function handleDeletion() {
    setLoading(true);

    await deleteChainById(chain._id!);
    deleteChain(chain._id!);
    navigate({ to: "/$namespace" });

    setLoading(false);
    setIsOpen(false);
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="contained"
        color="error"
        sx={{
          width: "100%",
          letterSpacing: "1px",
        }}
      >
        <DeleteOutlineIcon className="mr-2" />
        Удалить
      </Button>

      <Dialog
        open={isOpen}
        onClose={() => {
          if (!loading) setIsOpen(false);
        }}
      >
        <DialogTitle className="select-none">Удаление цепочки</DialogTitle>

        <DialogContent>
          <DialogContentText className="select-none">
            Вы уверены, что хотите удалить эту цепочку?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            color="error"
            onClick={() => setIsOpen(false)}
            disabled={loading}
          >
            Отменить
          </Button>
          <Button
            onClick={handleDeletion}
            variant="contained"
            disabled={loading}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
