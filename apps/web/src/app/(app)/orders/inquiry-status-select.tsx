"use client";

import { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LeadStatus } from "@/lib/supabase/types";
import { updateInquiryStatus } from "./actions";

const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "Neu",
  CONTACTED: "In Bearbeitung",
  CONVERTED: "Bestätigt",
  DECLINED: "Abgelehnt",
};

const STATUS_ORDER: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "CONVERTED",
  "DECLINED",
];

export function InquiryStatusSelect({
  id,
  status,
}: {
  id: string;
  status: LeadStatus;
}) {
  const [value, setValue] = useState(status);
  const [pending, startTransition] = useTransition();

  return (
    <Select
      value={value}
      disabled={pending}
      onValueChange={(next) => {
        const previous = value;
        setValue(next as LeadStatus);
        startTransition(async () => {
          const result = await updateInquiryStatus(id, next as LeadStatus);
          if (result.error) setValue(previous);
        });
      }}
    >
      <SelectTrigger size="sm" className="w-[160px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUS_ORDER.map((s) => (
          <SelectItem key={s} value={s}>
            {STATUS_LABELS[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { STATUS_LABELS };
