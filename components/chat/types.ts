import type { InferUITools, UIDataTypes, UIMessage } from "ai";
import type { NortTools } from "@/lib/ai/tools";
import type { Dictionary } from "@/lib/i18n/dictionaries/es";

export type NortUIMessage = UIMessage<unknown, UIDataTypes, InferUITools<NortTools>>;
export type NortPart = NortUIMessage["parts"][number];
export type ChatDict = Dictionary["chat"];

export interface NortShellProps {
  locale: "es" | "en";
  dict: ChatDict;
  whatsappHref: string;
  privacyHref: string;
  calUrl: string;
  newTabLabel: string;
}
