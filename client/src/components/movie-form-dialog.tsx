import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMovieSchema, type InsertMovie, type Movie } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Save, X } from "lucide-react";

interface MovieFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InsertMovie) => void;
  movie?: Movie;
  isSubmitting?: boolean;
}

export function MovieFormDialog({
  open,
  onOpenChange,
  onSubmit,
  movie,
  isSubmitting = false,
}: MovieFormDialogProps) {
  const form = useForm<InsertMovie>({
    resolver: zodResolver(insertMovieSchema),
    defaultValues: {
      title: "",
      type: "Movie",
      director: "",
      budget: undefined,
      location: undefined,
      duration: undefined,
      year: new Date().getFullYear(),
      additionalDetails: undefined,
    },
  });

  // Update form values when movie changes (for edit mode)
  useEffect(() => {
    if (movie) {
      form.reset({
        title: movie.title,
        type: movie.type as "Movie" | "TV Show",
        director: movie.director,
        budget: movie.budget ? Number(movie.budget) : undefined,
        location: movie.location || undefined,
        duration: movie.duration || undefined,
        year: movie.year,
        additionalDetails: movie.additionalDetails || undefined,
      });
    } else {
      form.reset({
        title: "",
        type: "Movie",
        director: "",
        budget: undefined,
        location: undefined,
        duration: undefined,
        year: new Date().getFullYear(),
        additionalDetails: undefined,
      });
    }
  }, [movie, form]);

  const selectedType = form.watch("type");
  const isDurationRequired = selectedType === "Movie";

  const handleSubmit = (data: InsertMovie) => {
    onSubmit(data);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen && !isSubmitting) {
        handleClose();
      }
    }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="dialog-movie-form">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {movie ? "Edit Entry" : "Add New Entry"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter movie or TV show title"
                      className="h-12"
                      data-testid="input-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Type <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12" data-testid="select-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Movie" data-testid="option-movie">Movie</SelectItem>
                        <SelectItem value="TV Show" data-testid="option-tvshow">TV Show</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Year <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="2024"
                        className="h-12 font-mono"
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                        data-testid="input-year"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="director"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Director <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter director name"
                      className="h-12"
                      data-testid="input-director"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                          $
                        </span>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="h-12 pl-8 font-mono"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          data-testid="input-budget"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Duration (minutes) {isDurationRequired && <span className="text-destructive">*</span>}
                      {!isDurationRequired && <span className="text-muted-foreground text-xs">(Optional for TV shows)</span>}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="number"
                          placeholder="120"
                          className="h-12 font-mono"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          data-testid="input-duration"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                          min
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      placeholder="Filming location"
                      className="h-12"
                      data-testid="input-location"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Details (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ""}
                      placeholder="Add any additional information about this entry..."
                      className="min-h-[120px] resize-none"
                      data-testid="input-additional-details"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="border-t pt-6">
              <div className="flex justify-end gap-4 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  data-testid="button-cancel"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} data-testid="button-submit">
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Saving..." : movie ? "Update Entry" : "Add Entry"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
