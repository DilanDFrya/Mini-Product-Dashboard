import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProductSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProductSearchBar({
  value,
  onChange,
}: ProductSearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-primary/60" />
      <Input
        type="text"
        placeholder="Search products by name or description..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 pl-10 text-base border-primary/20 focus-visible:border-primary/40 focus-visible:ring-primary/20"
      />
    </div>
  );
}

