import { useState, useRef } from "react";
import { uploadFile } from "@/shared/lib/uploadFile";
import type { CommentAction } from "@/entities/action/schema";
import { getActionAttachmentType } from "@/entities/action/lib";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Button, TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import TextFieldsIcon from "@mui/icons-material/TextFields";
import ImageIcon from "@mui/icons-material/Image";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import MicNoneIcon from "@mui/icons-material/MicNone";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      className="mt-3"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface ActionEditorProps {
  actionIndex?: number;
  initialAction?: CommentAction;
  onSave?: (actionIndex: number, action: CommentAction) => Promise<void> | void;
  onClose?: () => Promise<void> | void;
  canExit?: boolean;
}

export default function ActionEditor({
  actionIndex = 0,
  initialAction,
  onSave,
  onClose,
  canExit = false,
}: ActionEditorProps) {
  const imageRef = useRef<HTMLInputElement>(null);
  const voiceRef = useRef<HTMLInputElement>(null);

  const attachmentType = initialAction
    ? getActionAttachmentType(initialAction)
    : "empty";

  const [value, setValue] = useState(
    attachmentType === "empty" ? 0 : attachmentType === "image" ? 1 : 2,
  );

  const [loading, setLoading] = useState(false);

  const [imageUrl, setImageUrl] = useState<string | null>(
    initialAction && attachmentType === "image"
      ? initialAction.fileUrls[0]!
      : null,
  );

  const [voiceUrl, setVoiceUrl] = useState<string | null>(
    initialAction && attachmentType === "voice"
      ? initialAction.fileUrls[0]!
      : null,
  );

  const [action, setAction] = useState<CommentAction>(
    initialAction ?? {
      actionType: "comment",
      text: "",
      fileUrls: [],
    },
  );

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    if (loading) return;
    setValue(newValue);
  };

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
    origin: "image" | "voice",
  ) {
    if (!event.target.files) return;
    const file = event.target.files[0];

    setLoading(true);
    const fileUrl = await uploadFile(file);

    if (!fileUrl) {
      alert("К сожалению, не удалось загрузить файл");
      setLoading(false);
      return;
    }

    if (origin === "image") {
      setImageUrl(fileUrl);
    } else if (origin === "voice") {
      setVoiceUrl(fileUrl);
    }

    setLoading(false);
  }

  function handleSave() {
    if (!onSave) return;

    if (value === 0) {
      if (!action.text) {
        alert("Введите текст");
        return;
      }

      onSave(actionIndex, {
        actionType: action.actionType,
        text: action.text,
        fileUrls: [],
      });
    } else if (value === 1) {
      if (!imageUrl) {
        alert("Добавьте картинку");
        return;
      }

      onSave(actionIndex, {
        actionType: action.actionType,
        text: action.text === "" ? null : action.text,
        fileUrls: [imageUrl],
      });
    } else if (value === 2) {
      if (!voiceUrl) {
        alert("Загрузите голосовое :3");
        return;
      }

      onSave(actionIndex, {
        actionType: action.actionType,
        text: null,
        fileUrls: [voiceUrl],
      });
    }
  }

  return (
    <>
      <div className="min-h-[500px] w-[80%] rounded-sm bg-white shadow-md">
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="Редактировать пост"
            >
              <Tab label="Текст" icon={<TextFieldsIcon />} {...a11yProps(0)} />
              <Tab label="Изображение" icon={<ImageIcon />} {...a11yProps(1)} />
              <Tab
                label="Голосовое"
                icon={<RecordVoiceOverIcon />}
                {...a11yProps(2)}
              />
            </Tabs>
          </Box>

          <TabPanel value={value} index={0}>
            <TextField
              fullWidth
              multiline
              minRows={10}
              maxRows={10}
              value={action.text ?? ""}
              onChange={(event) =>
                setAction((currentAction) => ({
                  ...currentAction,
                  text: event.target.value,
                }))
              }
            />
          </TabPanel>

          <TabPanel value={value} index={1}>
            <div className="flex items-center justify-between">
              <div className="mb-9 flex w-full items-center justify-between">
                <div className="flex items-center gap-x-10">
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    onClick={() => {
                      if (!imageRef.current) return;
                      imageRef.current.click();
                    }}
                  >
                    {imageUrl === null ? "Добавить фото" : "Изменить фото"}
                  </Button>
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Current image"
                      className="w-20 select-none"
                      draggable={false}
                    />
                  )}
                </div>

                {loading && (
                  <div className="">
                    <CircularProgress />
                  </div>
                )}
              </div>

              <input
                ref={imageRef}
                accept="image/*"
                type="file"
                className="mb-4 hidden select-none"
                onChange={async (e) => await handleFileChange(e, "image")}
              />
            </div>

            <TextField
              fullWidth
              multiline
              minRows={8}
              maxRows={8}
              value={action.text ?? ""}
              onChange={(event) =>
                setAction((currentAction) => ({
                  ...currentAction,
                  text: event.target.value,
                }))
              }
            />
          </TabPanel>

          <TabPanel value={value} index={2}>
            <div className="mt-5 text-center">
              <input
                ref={voiceRef}
                type="file"
                accept=".mp3, .ogg"
                className="mb-4 hidden select-none"
                onChange={async (e) => await handleFileChange(e, "voice")}
              />
              <Button
                startIcon={<MicNoneIcon />}
                variant="contained"
                color="info"
                disabled={loading}
                onClick={() => {
                  if (!voiceRef.current) return;
                  voiceRef.current.click();
                }}
              >
                {voiceUrl ? "Изменить голосовое" : "Загрузить голосовое"}
              </Button>

              {voiceUrl && (
                <div className="mt-10 flex justify-center">
                  <audio controls>
                    <source src={voiceUrl} type="audio/mp3" />
                    <source src={voiceUrl} type="audio/ogg" />
                  </audio>
                </div>
              )}
            </div>
          </TabPanel>
        </Box>
      </div>

      <div className="mt-4 flex gap-x-4">
        {canExit && (
          <Button
            color="error"
            disabled={loading}
            onClick={() => {
              if (onClose) onClose();
            }}
          >
            Отменить
          </Button>
        )}
        <Button
          variant="contained"
          type="submit"
          disabled={loading}
          onClick={handleSave}
        >
          Сохранить
        </Button>
      </div>
    </>
  );
}
