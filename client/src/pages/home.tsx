import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Film, Plus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { MoviesTable, SortDirection, SortField } from "@/components/movies-table";
import { MovieFormDialog } from "@/components/movie-form-dialog";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { EmptyState } from "@/components/empty-state";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Movie, InsertMovie } from "@shared/schema";

interface MoviesResponse {
  data: Movie[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

export default function Home() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [page, setPage] = useState(1);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | Movie["type"]>("all");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | undefined>();
  const [deletingMovie, setDeletingMovie] = useState<Movie | null>(null);

  const normalizeMovie = (movie: Movie): Movie => ({
    ...movie,
    id: Number(movie.id ?? 0),
    budget: movie.budget == null ? null : Number(movie.budget),
    duration: movie.duration == null ? null : Number(movie.duration),
    year: Number(movie.year),
    createdAt: movie.createdAt instanceof Date ? movie.createdAt : new Date(movie.createdAt),
    updatedAt: movie.updatedAt instanceof Date ? movie.updatedAt : new Date(movie.updatedAt),
  });

  const { data, isLoading: isInitialLoading } = useQuery<MoviesResponse>({
    queryKey: ["/api/movies", page],
    queryFn: async () => {
      const res = await fetch(`/api/movies?page=${page}&limit=20`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }
      return await res.json();
    },
  });

  useEffect(() => {
    if (!data?.data) {
      return;
    }

    const normalized = data.data.map(normalizeMovie);

    if (page === 1) {
      setAllMovies(normalized);
      return;
    }

    setAllMovies((prev) => {
      const existingIds = new Set(prev.map((m) => m.id));
      const newMovies = normalized.filter((m) => !existingIds.has(m.id));
      if (newMovies.length > 0) {
        return [...prev, ...newMovies];
      }
      return prev;
    });
  }, [data, page]);

  const createMutation = useMutation({
    mutationFn: async (newMovie: InsertMovie) => {
      const res = await apiRequest("POST", "/api/movies", newMovie);
      return normalizeMovie(await res.json() as Movie);
    },
    onSuccess: (newMovie) => {
      queryClient.invalidateQueries({ queryKey: ["/api/movies"] });
      setAllMovies([]);
      setPage(1);
      setSearchTerm("");
      setSortField(null);
      setSortDirection("asc");
      setTypeFilter("all");
      toast({
        title: "Entry added",
        description: `Successfully added "${newMovie.title}"`,
      });
      setIsFormOpen(false);
      setEditingMovie(undefined);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add entry. Please try again.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertMovie }) => {
      const res = await apiRequest("PUT", `/api/movies/${id}`, data);
      return normalizeMovie(await res.json() as Movie);
    },
    onSuccess: (updatedMovie) => {
      queryClient.invalidateQueries({ queryKey: ["/api/movies"] });
      setAllMovies([]);
      setPage(1);
      setSearchTerm("");
      setSortField(null);
      setSortDirection("asc");
      setTypeFilter("all");
      toast({
        title: "Entry updated",
        description: `Successfully updated "${updatedMovie.title}"`,
      });
      setIsFormOpen(false);
      setEditingMovie(undefined);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update entry. Please try again.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/movies/${id}`);
    },
    onSuccess: (_, id) => {
      const normalizedId = Number(id);
      setAllMovies((prev) => prev.filter((movie) => movie.id !== normalizedId));
      queryClient.invalidateQueries({ queryKey: ["/api/movies"] });
      if (page !== 1) {
        setPage(1);
      }
      setSearchTerm("");
      setSortField(null);
      setSortDirection("asc");
      setTypeFilter("all");
      toast({
        title: "Entry deleted",
        description: `Successfully deleted "${deletingMovie?.title}"`,
      });
      setIsDeleteDialogOpen(false);
      setDeletingMovie(null);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete entry. Please try again.",
      });
    },
  });

  const hasMore = data?.pagination.hasNextPage ?? false;

  const displayedMovies = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();
    let filtered = allMovies;

    if (normalizedQuery) {
      filtered = filtered.filter((movie) => {
        const titleMatch = movie.title.toLowerCase().includes(normalizedQuery);
        const directorMatch = movie.director.toLowerCase().includes(normalizedQuery);
        const locationMatch = (movie.location ?? "").toLowerCase().includes(normalizedQuery);
        return titleMatch || directorMatch || locationMatch;
      });
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((movie) => movie.type === typeFilter);
    }

    if (sortField) {
      const sorted = [...filtered].sort((a, b) => {
        const getNumericValue = (movie: Movie, field: SortField) => {
          const raw = movie[field];
          if (raw == null) {
            return null;
          }
          if (typeof raw === "string") {
            const parsed = parseFloat(raw);
            return Number.isNaN(parsed) ? null : parsed;
          }
          return raw;
        };

        const aValue = getNumericValue(a, sortField);
        const bValue = getNumericValue(b, sortField);

        if (aValue == null && bValue == null) {
          return a.title.localeCompare(b.title);
        }
        if (aValue == null) {
          return 1;
        }
        if (bValue == null) {
          return -1;
        }

        if (aValue === bValue) {
          return a.title.localeCompare(b.title);
        }

        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      });

      return sorted;
    }

    return filtered;
  }, [allMovies, searchTerm, typeFilter, sortField, sortDirection]);

  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleTypeFilterChange = (value: "all" | Movie["type"]) => {
    setTypeFilter(value);
  };

  const handleAddNew = () => {
    setEditingMovie(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(normalizeMovie(movie));
    setIsFormOpen(true);
  };

  const handleDelete = (movie: Movie) => {
    setDeletingMovie(movie);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: InsertMovie) => {
    if (editingMovie) {
      updateMutation.mutate({ id: editingMovie.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingMovie) return;
    deleteMutation.mutate(Number(deletingMovie.id));
  };

  const handleLoadMore = () => {
    if (hasMore && !isInitialLoading) {
      setPage(prev => prev + 1);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    setLocation("/");
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <Film className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold font-heading" data-testid="text-app-title">
                My Collection
              </h1>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <Button onClick={handleLogout} variant="outline" size="lg" data-testid="button-logout">
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 overflow-hidden">
        {allMovies.length === 0 && !isInitialLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <EmptyState onAddNew={handleAddNew} />
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-card-border overflow-hidden shadow-sm flex h-full flex-col">
            <div className="flex flex-col gap-4 border-b border-card-border bg-muted/20 p-4 md:flex-row md:items-center md:justify-between">
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by title, director, or location"
                className="md:max-w-sm"
                data-testid="input-search"
              />
              <div className="w-full md:w-auto flex items-center justify-end">
                <Button
                  onClick={handleAddNew}
                  size="lg"
                  className="w-full md:w-auto"
                  data-testid="button-add-new"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Entry
                </Button>
              </div>
            </div>
            <MoviesTable
              className="flex-1 min-h-0"
              movies={displayedMovies}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              isLoading={isInitialLoading}
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={handleSortChange}
              typeFilter={typeFilter}
              onTypeFilterChange={handleTypeFilterChange}
            />
          </div>
        )}
      </main>

      <div className="sm:hidden fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <Button
          onClick={handleLogout}
          size="icon"
          variant="outline"
          className="h-12 w-12 rounded-full shadow-lg bg-background"
          data-testid="button-logout-mobile"
        >
          <LogOut className="h-5 w-5" />
        </Button>
        <Button
          onClick={handleAddNew}
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
          data-testid="button-add-new-mobile"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <MovieFormDialog
        open={isFormOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsFormOpen(false);
            setEditingMovie(undefined);
          }
        }}
        onSubmit={handleFormSubmit}
        movie={editingMovie}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        movie={deletingMovie}
        isDeleting={isDeleting}
      />
    </div>
  );
}
