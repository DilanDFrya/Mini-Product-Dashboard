import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: { min: string; max: string };
  onPriceRangeChange: (range: { min: string; max: string }) => void;
  filteredCount: number;
  totalCount: number;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  filteredCount,
  totalCount,
  hasActiveFilters,
  onClearFilters,
}: ProductFiltersProps) {
  return (
    <div className="rounded-lg border border-border bg-gradient-to-br from-muted/60 via-muted/40 to-muted/30 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            size="sm"
            className="h-7 text-xs"
          >
            <X className="mr-1.5 size-3.5" />
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Category
          </label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range Filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Price Range
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min $"
              value={priceRange.min}
              onChange={(e) =>
                onPriceRangeChange({ ...priceRange, min: e.target.value })
              }
              className="h-9"
              step="0.01"
              min="0"
            />
            <span className="text-muted-foreground">to</span>
            <Input
              type="number"
              placeholder="Max $"
              value={priceRange.max}
              onChange={(e) =>
                onPriceRangeChange({ ...priceRange, max: e.target.value })
              }
              className="h-9"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-end">
          <div className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {filteredCount}
            </span>{" "}
            {filteredCount === 1 ? "product" : "products"}
            {totalCount !== filteredCount && (
              <span className="ml-1">of {totalCount} total</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

