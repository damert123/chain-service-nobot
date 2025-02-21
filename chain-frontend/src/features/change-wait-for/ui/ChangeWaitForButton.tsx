import { upsertChain } from "@/entities/chain/api/upsert";
import type { WaitAction } from "@/entities/action/schema";
import SettingsIcon from "@mui/icons-material/Settings";

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useChainState } from "@/entities/chain/model";

import {
  Dialog,
  DialogContent,
  Typography,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

interface ChangeWaitForButtonProps {
  chainId: string;
  actionIndex: number;
  action: WaitAction;
}

export default function ChangeWaitForButton({
  chainId,
  actionIndex,
  action,
}: ChangeWaitForButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate({ from: "/$namespace/$chainId" });
  const getChain = useChainState((state) => state.getChain);
  const updateAction = useChainState((state) => state.updateAction);

  const [waitFor, setWaitFor] = useState<string | number>(
    action.waitFor >= 60 ? action.waitFor / 60 : 1,
  );

  async function handleSave() {
    setLoading(true);
    let cleanWaitFor: number;

    if (waitFor === "" || waitFor === "0") {
      cleanWaitFor = 1;
    } else if (typeof waitFor === "string") {
      cleanWaitFor = parseInt(waitFor);
    } else {
      cleanWaitFor = waitFor;
    }

    action.waitFor = cleanWaitFor * 60;
    updateAction(chainId, actionIndex, action);

    const chain = getChain(chainId)!;
    const upsertedChain = await upsertChain(chain);
    setLoading(false);

    if (upsertedChain) {
      navigate({ to: "/$namespace/$chainId" });
      setIsOpen(false);
      return;
    }

    setIsError(true);
  }

  return (
    <>
      <button
        className="flex h-[20px] items-center justify-center rounded-sm bg-[#4C4E648A] bg-opacity-[54%] p-0"
        onClick={() => {
          if (!loading) setIsOpen(true);
        }}
      >
        <SettingsIcon sx={{ width: "20px", color: "white" }} />
      </button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogContent>
          <div className="flex items-center gap-x-20">
            <div>
              <Typography
                className="select-none"
                variant="h6"
                sx={{ color: "#4C4E64DE", opacity: "87%" }}
              >
                Тайминг
              </Typography>

              <Typography
                className="select-none"
                sx={{ color: "#4C4E6499", opacity: "60%" }}
              >
                Отправить через
              </Typography>
            </div>

            <div className="flex items-center gap-x-4">
              <TextField
                error={isError}
                className="select-none"
                type="number"
                id="waitFor"
                name="waitFor"
                fullWidth
                variant="outlined"
                label="Минуты"
                autoComplete="off"
                value={waitFor}
                onChange={(event) => setWaitFor(event.target.value)}
              />
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <Button
            color="error"
            disabled={loading}
            onClick={() => setIsOpen(false)}
          >
            Отменить
          </Button>

          <Button
            variant="contained"
            disabled={loading || isError}
            onClick={handleSave}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
