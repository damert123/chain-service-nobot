import type { Chain } from "@/entities/chain/schema";

import { useState } from "react";
import { upsertChain } from "@/entities/chain/api/upsert";
import { useChainState } from "@/entities/chain/model";
import { useNavigate } from "@tanstack/react-router";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

interface RenameChainButtonProps {
  chain: Chain;
}

export default function RenameChainButton({ chain }: RenameChainButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate({ from: "/$namespace/$chainId" });

  const [chainName, setChainName] = useState(chain.name || "");
  const updateChain = useChainState((state) => state.updateChain);

  async function handleOnSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const newChainName = formData.get("name");

    if (!newChainName) {
      setIsError(true);
      return;
    }

    chain.name = newChainName.toString();
    const upsertedChain = await upsertChain(chain);
    setLoading(false);

    if (upsertedChain) {
      updateChain(upsertedChain);
      navigate({ to: "/$namespace/$chainId" });
      setIsOpen(false);
      return;
    }

    setIsError(true);
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="text"
        sx={{
          width: "100%",
          letterSpacing: "1px",
          color: "#4C4E64DE",
        }}
      >
        <DriveFileRenameOutlineIcon className="mr-2" />
        Переименовать
      </Button>

      <Dialog
        open={isOpen}
        onClose={() => {
          if (!loading) setIsOpen(false);
        }}
        PaperProps={{
          component: "form",
          onSubmit: handleOnSubmit,
        }}
      >
        <DialogTitle className="select-none">
          Введите название цепочки
        </DialogTitle>

        <DialogContent>
          <TextField
            error={isError}
            className="select-none"
            autoFocus
            required
            id="name"
            name="name"
            fullWidth
            variant="standard"
            label="Название"
            autoComplete="off"
            value={chainName}
            onChange={(event) => setChainName(event.target.value)}
          />
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
            variant="contained"
            type="submit"
            disabled={loading || isError}
          >
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
