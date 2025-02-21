import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { chainSchema } from "@/entities/chain/schema";
import { upsertChain } from "@/entities/chain/api/upsert";
import { useChainState } from "@/entities/chain/model";
import { useParams } from "@tanstack/react-router";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField } from "@mui/material";
import { IconButton, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function AddChainButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { namespace } = useParams({ from: "/$namespace/$chainId" });

  const navigate = useNavigate({ from: "/$namespace/$chainId" });
  const addChain = useChainState((state) => state.addChain);

  async function handleOnSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const validatedData = chainSchema.parse({
      ...Object.fromEntries(formData),
      namespaceId: namespace,
    });

    const createdChain = await upsertChain(validatedData);
    setLoading(false);

    if (createdChain) {
      addChain(createdChain);
      setIsOpen(false);
      navigate({ to: `/$namespace/${createdChain._id}` });
      return;
    }

    setIsError(true);
  }

  return (
    <>
      <IconButton
        size="medium"
        color="info"
        sx={{ borderRadius: "4px" }}
        onClick={() => setIsOpen(true)}
      >
        <AddIcon />
      </IconButton>

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
