import type { CommentAction } from "./schema";

type ActionAttachmentType = "empty" | "image" | "voice";

const imageExtensions = ["jpeg", "jpg", "png"];
const voiceExtensions = ["mp3", "ogg"];

export function getActionAttachmentType(
  action: CommentAction,
): ActionAttachmentType {
  if (action.fileUrls.length === 0) {
    return "empty";
  } else if (imageExtensions.includes(action.fileUrls[0].split(".").at(-1)!)) {
    return "image";
  } else if (voiceExtensions.includes(action.fileUrls[0].split(".").at(-1)!)) {
    return "voice";
  } else {
    return "empty";
  }
}
