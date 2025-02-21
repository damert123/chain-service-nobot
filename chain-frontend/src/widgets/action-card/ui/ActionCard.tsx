import type { Chain } from "@/entities/chain/schema";
import type { Action } from "@/entities/action/schema";

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useChainState } from "@/entities/chain/model";
import { upsertChain } from "@/entities/chain/api/upsert";

import humanizeDuration from "humanize-duration";
import { ChangeWaitForButton } from "@/features/change-wait-for";
import { getActionAttachmentType } from "@/entities/action/lib";

import { IconButton } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Menu, MenuItem, Divider } from "@mui/material";

interface ActionCardProps {
  chain: Chain;
  action: Action;
  actionIndex: number;
  onEdit?: (actionIndex: number) => void;
  onClose?: (actionIndex: number) => void;
}

export default function ActionCard({
  chain,
  action,
  actionIndex,
  onEdit,
}: ActionCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const navigate = useNavigate({ from: "/$namespace/$chainId" });
  const deleteAction = useChainState((state) => state.deleteAction);
  const moveActionUp = useChainState((state) => state.moveActionUp);
  const moveActionDown = useChainState((state) => state.moveActionDown);

  if (action.actionType === "comment") {
    const attachmentType = getActionAttachmentType(action);

    return (
      <div className="relative w-[450px] select-none whitespace-pre-line rounded-md bg-white text-[#4C4E64DE] opacity-[84%] shadow-lg after:absolute after:-bottom-12 after:left-1/2 after:h-8 after:w-1 after:-translate-x-1/2 after:rounded-md after:bg-[#666CFF] after:opacity-[12%]">
        <div className="absolute -right-3 top-0 translate-x-full">
          <IconButton
            onClick={(event) => {
              setAnchorEl(event.currentTarget);
              setIsOpen(true);
            }}
            sx={{
              borderRadius: "4px",
              border: "1px solid #4C4E641F",
              width: "32px",
              height: "32px",
            }}
            size="small"
          >
            <MoreHorizIcon />
          </IconButton>

          <Menu
            className="mt-2"
            anchorEl={anchorEl}
            open={isOpen}
            onClose={() => setIsOpen(false)}
          >
            <MenuItem
              onClick={() => {
                setIsOpen(false);
                if (onEdit) onEdit(actionIndex);
              }}
            >
              <EditIcon
                sx={{ color: "#4C4E64DE", opacity: "87%" }}
                className="mr-2"
              />
              <span className="font-normal text-[#4C4E64DE] opacity-[87%]">
                Редактировать
              </span>
            </MenuItem>

            <Divider sx={{ my: 0.5 }} />

            <MenuItem
              onClick={async () => {
                moveActionUp(chain._id!, actionIndex);
                setIsOpen(false);
                await upsertChain(chain);
                navigate({ to: "/$namespace/$chainId" });
              }}
            >
              <ArrowUpwardIcon
                sx={{ color: "#4C4E64DE", opacity: "87%" }}
                className="mr-2"
              />
              <span className="font-normal text-[#4C4E64DE] opacity-[87%]">
                Переместить выше
              </span>
            </MenuItem>

            <MenuItem
              onClick={async () => {
                moveActionDown(chain._id!, actionIndex);
                setIsOpen(false);
                await upsertChain(chain);
                navigate({ to: "/$namespace/$chainId" });
              }}
            >
              <ArrowDownwardIcon
                sx={{ color: "#4C4E64DE", opacity: "87%" }}
                className="mr-2"
              />
              <span className="font-normal text-[#4C4E64DE] opacity-[87%]">
                Переместить ниже
              </span>
            </MenuItem>

            <Divider sx={{ my: 0.5 }} />

            <MenuItem
              onClick={async () => {
                deleteAction(chain._id!, actionIndex);
                setIsOpen(false);
                await upsertChain(chain);
                navigate({ to: "/$namespace/$chainId" });
              }}
            >
              <DeleteOutlineIcon
                sx={{ color: "#4C4E64DE", opacity: "87%" }}
                className="mr-2"
              />
              <span className="font-normal text-[#4C4E64DE] opacity-[87%]">
                Удалить
              </span>
            </MenuItem>
          </Menu>
        </div>
        {attachmentType === "image" && (
          <img
            src={action.fileUrls[0]}
            alt="Image"
            draggable={false}
            className={`w-full select-none ${!action.text && "rounded-b-md"} rounded-t-md`}
          />
        )}
        {attachmentType === "voice" && (
          <div className="flex justify-center p-3">
            <audio controls>
              <source src={action.fileUrls[0]} type="audio/mp3" />
              <source src={action.fileUrls[0]} type="audio/ogg" />
            </audio>
          </div>
        )}
        {action.text && <div className="p-4">{action.text}</div>}
      </div>
    );
  }

  return (
    <div className="relative flex select-none items-center gap-x-2 text-[#4C4E64DE] opacity-[84%] before:absolute before:-top-6 before:left-1/2 before:h-4 before:w-4 before:-translate-x-1/2 before:rounded-full before:border-[2.5px] before:border-primary after:absolute after:left-1/2 after:top-11 after:h-16 after:w-1 after:-translate-x-1/2 after:rounded-md after:bg-[#666CFF] after:opacity-[12%]">
      <span>
        Задержка: {humanizeDuration(action.waitFor * 1000, { language: "ru" })}
      </span>

      <ChangeWaitForButton
        chainId={chain._id!}
        actionIndex={actionIndex}
        action={action}
      />
    </div>
  );
}
