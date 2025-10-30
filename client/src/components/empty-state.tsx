import { Film } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAddNew: () => void;
}

export function EmptyState({ onAddNew }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4" data-testid="empty-state">
      <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
        <Film className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-semibold mb-2">No movies or TV shows yet</h3>
      <p className="text-muted-foreground text-center mb-8 max-w-md">
        Start building your collection by adding your favorite movies and TV shows!
      </p>
      <Button onClick={onAddNew} size="lg" data-testid="button-add-first">
        <Film className="h-5 w-5 mr-2" />
        Add Your First Entry
      </Button>
    </div>
  );
}
