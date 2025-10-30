import { useRef, useEffect } from "react";
import { Film, Tv, Pencil, Trash2, Loader2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Movie } from "@shared/schema";

export type SortField = "budget" | "duration" | "year";
export type SortDirection = "asc" | "desc";

interface MoviesTableProps {
  movies: Movie[];
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  sortField: SortField | null;
  sortDirection: SortDirection;
  onSortChange: (field: SortField) => void;
  typeFilter: "all" | Movie["type"];
  onTypeFilterChange: (value: "all" | Movie["type"]) => void;
  className?: string;
}

export function MoviesTable({
  movies,
  onEdit,
  onDelete,
  onLoadMore,
  hasMore,
  isLoading,
  sortField,
  sortDirection,
  onSortChange,
  typeFilter,
  onTypeFilterChange,
  className,
}: MoviesTableProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  const formatCurrency = (value: string | number | null) => {
    if (!value) return "—";
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "—";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3.5 w-3.5" />;
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="h-3.5 w-3.5" />;
    }
    return <ArrowDown className="h-3.5 w-3.5" />;
  };

  return (
    <div className={cn("flex h-full w-full flex-col", className)}>
      <div className="flex-1 overflow-x-auto overflow-y-auto max-h-full">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-20 bg-muted/50">
            <tr className="border-b bg-muted/50">
              <th className="sticky left-0 z-30 bg-muted/50 text-left px-6 py-4 text-sm font-medium uppercase tracking-wide min-w-[200px]">
                Title
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium uppercase tracking-wide min-w-[120px]">
                <div className="flex items-center justify-between gap-2">
                  <span>Type</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-primary focus:outline-none focus:ring-0 focus:ring-offset-0",
                        typeFilter !== "all" && "text-primary"
                      )}
                      aria-label="Filter by type"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[140px]">
                      <DropdownMenuRadioGroup
                        value={typeFilter}
                        onValueChange={(value) => onTypeFilterChange(value as "all" | Movie["type"]) }
                      >
                        <DropdownMenuRadioItem value="all">All Types</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Movie">Movies</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="TV Show">TV Shows</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium uppercase tracking-wide min-w-[180px]">
                Director
              </th>
              <th className="text-right px-6 py-4 text-sm font-medium uppercase tracking-wide min-w-[120px]">
                <button
                  type="button"
                  onClick={() => onSortChange("budget")}
                  className="flex w-full items-center justify-end gap-2"
                >
                  Budget
                  {renderSortIcon("budget")}
                </button>
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium uppercase tracking-wide min-w-[160px]">
                Location
              </th>
              <th className="text-right px-6 py-4 text-sm font-medium uppercase tracking-wide min-w-[100px]">
                <button
                  type="button"
                  onClick={() => onSortChange("duration")}
                  className="flex w-full items-center justify-end gap-2"
                >
                  Duration
                  {renderSortIcon("duration")}
                </button>
              </th>
              <th className="text-center px-6 py-4 text-sm font-medium uppercase tracking-wide min-w-[80px]">
                <button
                  type="button"
                  onClick={() => onSortChange("year")}
                  className="flex w-full items-center justify-center gap-2"
                >
                  Year
                  {renderSortIcon("year")}
                </button>
              </th>
              <th className="text-center px-6 py-4 text-sm font-medium uppercase tracking-wide min-w-[120px] sticky right-0 bg-muted/50">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr
                key={movie.id}
                className="border-b hover-elevate"
                data-testid={`row-movie-${movie.id}`}
              >
                <td
                  className="sticky left-0 z-20 bg-background px-6 py-4 font-medium"
                  data-testid={`text-title-${movie.id}`}
                >
                  {movie.title}
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant="secondary"
                    className="gap-1.5"
                    data-testid={`badge-type-${movie.id}`}
                  >
                    {movie.type === "Movie" ? (
                      <Film className="h-3 w-3" />
                    ) : (
                      <Tv className="h-3 w-3" />
                    )}
                    {movie.type}
                  </Badge>
                </td>
                <td className="px-6 py-4" data-testid={`text-director-${movie.id}`}>
                  {movie.director}
                </td>
                <td className="px-6 py-4 text-right font-mono" data-testid={`text-budget-${movie.id}`}>
                  {formatCurrency(movie.budget)}
                </td>
                <td className="px-6 py-4 text-muted-foreground" data-testid={`text-location-${movie.id}`}>
                  {movie.location || "—"}
                </td>
                <td className="px-6 py-4 text-right font-mono" data-testid={`text-duration-${movie.id}`}>
                  {formatDuration(movie.duration)}
                </td>
                <td className="px-6 py-4 text-center font-mono" data-testid={`text-year-${movie.id}`}>
                  {movie.year}
                </td>
                <td className="px-6 py-4 sticky right-0 bg-background">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(movie)}
                      data-testid={`button-edit-${movie.id}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(movie)}
                      className="group text-muted-foreground"
                      data-testid={`button-delete-${movie.id}`}
                    >
                      <Trash2 className="h-4 w-4 transition-colors group-hover:text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {!hasMore && movies.length > 0 && (
              <tr className="border-b">
                <td className="px-6 py-4" />
                <td className="px-6 py-4 text-center text-sm text-muted-foreground" colSpan={6}>
                  You've reached the end of your collection
                </td>
                <td className="px-6 py-4" />
              </tr>
            )}
          </tbody>
        </table>
        {isLoading && (
          <div className="flex items-center justify-center py-8 border-b" data-testid="loading-indicator">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">Loading more entries...</span>
          </div>
        )}
        <div ref={loadMoreRef} className="h-4" />
      </div>
    </div>
  );
}
