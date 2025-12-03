"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMemo, useState, useEffect, useCallback } from "react";

interface ProductSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProductSearchBar({
  value,
  onChange,
}: ProductSearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = useCallback(() => {
    setLocalValue("");
    onChange("");
  }, [onChange]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-primary/60 pointer-events-none z-10" />
      <Input
        type="text"
        placeholder="Search products by name..."
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="h-11 pl-10 pr-10 text-base border-primary/20 focus-visible:border-primary/40 focus-visible:ring-primary/20 transition-all"
      />
      {localValue && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-primary/10"
        >
          <X className="size-4 text-muted-foreground" />
        </Button>
      )}
    </div>
  );
}

