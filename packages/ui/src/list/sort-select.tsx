"use client";

import { Select } from "../forms/select";

type Option<V extends string> = { value: V; label: string };

export function SortSelect<V extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: Option<V>[];
  value: V;
  onChange: (next: V) => void;
  className?: string;
}) {
  return (
    <Select
      className={className}
      value={value}
      onChange={(e) => onChange(e.target.value as V)}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          Sort: {opt.label}
        </option>
      ))}
    </Select>
  );
}
