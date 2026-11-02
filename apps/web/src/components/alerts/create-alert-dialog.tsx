"use client";

import React, { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check, Loader2 } from "lucide-react";
import type { Alert } from "@mdias/types";

// ─── Dialog primitives (thin wrappers over Radix) ─────────────────────────────

const Dialog = DialogPrimitive.Root;
const DialogTitle = DialogPrimitive.Title;
const DialogDescription = DialogPrimitive.Description;

function DialogContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/60" />
      <DialogPrimitive.Content className={className}>{children}</DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1.5">{children}</div>;
}

function DialogFooter({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={className}>{children}</div>;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MAHARASHTRA_DISTRICTS = [
  // 6 Regions (Division-level)
  "Marathwada Region (All 8 Districts)",
  "Vidarbha — Amravati Region (All 5 Districts)",
  "Vidarbha — Nagpur Region (All 6 Districts)",
  "Pune / Desh Region (All 5 Districts)",
  "Nashik / Khandesh Region (All 5 Districts)",
  "Konkan & Western Ghats Region (All 7 Districts)",
  // 36 Individual Districts
  "Ahilyanagar (Ahmednagar) • Nashik Div.",
  "Akola • Amravati Div.",
  "Amravati • Amravati Div.",
  "Beed • Marathwada",
  "Bhandara • Nagpur Div.",
  "Buldhana • Amravati Div.",
  "Chandrapur • Nagpur Div.",
  "Chh. Sambhajinagar • Marathwada",
  "Dharashiv (Osmanabad) • Marathwada",
  "Dhule • Nashik Div.",
  "Gadchiroli • Nagpur Div.",
  "Gondia • Nagpur Div.",
  "Hingoli • Marathwada",
  "Jalgaon • Nashik Div.",
  "Jalna • Marathwada",
  "Kolhapur • Pune Div.",
  "Latur • Marathwada",
  "Mumbai City • Konkan",
  "Mumbai Suburban • Konkan",
  "Nagpur • Nagpur Div.",
  "Nanded • Marathwada",
  "Nandurbar • Nashik Div.",
  "Nashik • Nashik Div.",
  "Palghar • Konkan",
  "Parbhani • Marathwada",
  "Pune • Pune Div.",
  "Raigad • Konkan",
  "Ratnagiri • Konkan",
  "Sangli • Pune Div.",
  "Satara • Pune Div.",
  "Sindhudurg • Konkan",
  "Solapur • Pune Div.",
  "Thane • Konkan",
  "Wardha • Nagpur Div.",
  "Washim • Amravati Div.",
  "Yavatmal • Amravati Div.",
];

const METRICS = [
  { value: "NDVI_ANOMALY",      label: "NDVI Anomaly" },
  { value: "SPI_3M",            label: "SPI-3M" },
  { value: "RESERVOIR_FILL",    label: "Reservoir Fill (%)" },
  { value: "GROUNDWATER_DEPTH", label: "Groundwater Depth (m)" },
  { value: "RISK_SCORE",        label: "Drought Risk Score" },
  { value: "DROUGHT_CLASS",     label: "Drought Class" },
];

const OPERATORS = [
  { value: "gte", label: "≥ (greater than or equal)" },
  { value: "lte", label: "≤ (less than or equal)" },
  { value: "eq",  label: "= (equals)" },
];

const CHANNELS = [
  { value: "EMAIL",   label: "Email" },
  { value: "SMS",     label: "SMS" },
  { value: "WEBHOOK", label: "Webhook" },
];

const DESTINATION_LABEL: Record<string, string> = {
  EMAIL:   "Email Address",
  SMS:     "Phone Number (E.164, e.g. +919876543210)",
  WEBHOOK: "Webhook URL",
};

const DESTINATION_PLACEHOLDER: Record<string, string> = {
  EMAIL:   "hydrology-cell@mdias-prototype.org",
  SMS:     "+919876543210",
  WEBHOOK: "https://hooks.example.com/drought-alert",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SelectItem({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  return (
    <Select.Item
      value={value}
      className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-[#FAFAFA] outline-none data-[highlighted]:bg-[#27272A]"
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="ml-auto">
        <Check className="h-3.5 w-3.5 text-[#A855F7]" />
      </Select.ItemIndicator>
    </Select.Item>
  );
}

function StyledSelect({
  value,
  onValueChange,
  placeholder,
  children,
}: {
  value: string;
  onValueChange: (v: string) => void;
  placeholder: string;
  children: React.ReactNode;
}) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger className="flex w-full items-center justify-between rounded-lg border border-[#3F3F46] bg-[#27272A] px-3 py-2 text-sm text-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-[#A855F7] data-[placeholder]:text-[#A1A1AA]">
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDown className="h-4 w-4 text-[#A1A1AA]" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="z-50 max-h-64 overflow-y-auto rounded-lg border border-[#3F3F46] bg-[#18181B] p-1 shadow-2xl">
          <Select.Viewport>{children}</Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

// ─── Form State ───────────────────────────────────────────────────────────────

interface FormState {
  regionName: string;
  metric: string;
  operator: string;
  threshold: string;
  channel: string;
  destination: string;
}

const EMPTY: FormState = {
  regionName: "",
  metric: "",
  operator: "lte",
  threshold: "",
  channel: "EMAIL",
  destination: "",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface CreateAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (alert: Partial<Alert>) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CreateAlertDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateAlertDialogProps) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.regionName) e.regionName = "Select a region";
    if (!form.metric)     e.metric     = "Select a metric";
    if (!form.operator)   e.operator   = "Select an operator";
    if (!form.threshold || isNaN(Number(form.threshold)))
      e.threshold = "Enter a valid number";
    if (!form.destination) e.destination = "Enter a destination";
    if (form.channel === "EMAIL" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.destination))
      e.destination = "Enter a valid email address";
    if (form.channel === "SMS" && !/^\+\d{10,15}$/.test(form.destination))
      e.destination = "Enter a valid E.164 phone number";
    if (form.channel === "WEBHOOK" && !/^https?:\/\/.+/.test(form.destination))
      e.destination = "Enter a valid URL starting with http(s)://";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          regionId:   form.regionName.toLowerCase().replace(/\s+/g, "-"),
          regionName: form.regionName,
          metric:     form.metric,
          operator:   form.operator,
          threshold:  Number(form.threshold),
          channel:    form.channel,
          destination:form.destination,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to create alert");
      }
      const body = await res.json();
      onCreated?.(body.data);
      setForm(EMPTY);
      onOpenChange(false);
    } catch (err) {
      setErrors({ destination: (err as Error).message });
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setForm(EMPTY);
    setErrors({});
    onOpenChange(false);
  }

  const destLabel = DESTINATION_LABEL[form.channel] ?? "Destination";
  const destPlaceholder = DESTINATION_PLACEHOLDER[form.channel] ?? "";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#3F3F46] border-t-2 border-t-[#A855F7] bg-[#18181B] p-6 shadow-2xl focus:outline-none">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#FAFAFA]">
            Create Early-Warning Notification Rule
          </DialogTitle>
          <DialogDescription className="text-sm text-[#A1A1AA]">
            Receive automated notifications when a satellite or hydrological indicator crosses a threshold in any of the 6 Maharashtra regions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          {/* Region */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#FAFAFA]">
              Maharashtra Region / District
            </label>
            <StyledSelect
              value={form.regionName}
              onValueChange={(v) => set("regionName", v)}
              placeholder="Select region or district…"
            >
              {MAHARASHTRA_DISTRICTS.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </StyledSelect>
            {errors.regionName && (
              <p className="mt-1 text-xs text-red-400">{errors.regionName}</p>
            )}
          </div>

          {/* Metric */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#FAFAFA]">
              Earth Observation / Hydrology Metric
            </label>
            <StyledSelect
              value={form.metric}
              onValueChange={(v) => set("metric", v)}
              placeholder="Select metric…"
            >
              {METRICS.map((m) => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </StyledSelect>
            {errors.metric && (
              <p className="mt-1 text-xs text-red-400">{errors.metric}</p>
            )}
          </div>

          {/* Operator + Threshold */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#FAFAFA]">
                Operator
              </label>
              <StyledSelect
                value={form.operator}
                onValueChange={(v) => set("operator", v)}
                placeholder="Select…"
              >
                {OPERATORS.map((op) => (
                  <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                ))}
              </StyledSelect>
              {errors.operator && (
                <p className="mt-1 text-xs text-red-400">{errors.operator}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#FAFAFA]">
                Threshold
              </label>
              <input
                type="number"
                step="any"
                value={form.threshold}
                onChange={(e) => set("threshold", e.target.value)}
                placeholder="-1.5"
                className="w-full rounded-lg border border-[#3F3F46] bg-[#27272A] px-3 py-2 text-sm text-[#FAFAFA] placeholder-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
              />
              {errors.threshold && (
                <p className="mt-1 text-xs text-red-400">{errors.threshold}</p>
              )}
            </div>
          </div>

          {/* Channel */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#FAFAFA]">
              Notification Channel
            </label>
            <StyledSelect
              value={form.channel}
              onValueChange={(v) => set("channel", v)}
              placeholder="Select channel…"
            >
              {CHANNELS.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </StyledSelect>
          </div>

          {/* Destination */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#FAFAFA]">
              {destLabel}
            </label>
            <input
              type="text"
              value={form.destination}
              onChange={(e) => set("destination", e.target.value)}
              placeholder={destPlaceholder}
              className="w-full rounded-lg border border-[#3F3F46] bg-[#27272A] px-3 py-2 text-sm text-[#FAFAFA] placeholder-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
            />
            {errors.destination && (
              <p className="mt-1 text-xs text-red-400">{errors.destination}</p>
            )}
          </div>

          <DialogFooter className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-[#3F3F46] bg-[#27272A] px-4 py-2 text-sm text-[#FAFAFA] hover:bg-[#3F3F46]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-lg bg-[#A855F7] px-4 py-2 text-sm font-semibold text-[#FAFAFA] hover:bg-[#9333EA] disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Notification Rule
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
