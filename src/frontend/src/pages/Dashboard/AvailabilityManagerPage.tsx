import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Link } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { ArrowLeft, CalendarX, Save, Trash2 } from "lucide-react";
// biome-ignore lint/correctness/useExhaustiveDependencies: savedDates array identity changes on each fetch; join is a stable primitive dep
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useGetUnavailableDates,
  useSetUnavailableDates,
} from "../../hooks/useQueries";

export default function AvailabilityManagerPage() {
  const { data: savedDates = [], isLoading } = useGetUnavailableDates();
  const setUnavailableDates = useSetUnavailableDates();

  const [localDates, setLocalDates] = useState<Date[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  // Sync from server on load
  useEffect(() => {
    if (!isLoading) {
      const parsed = savedDates
        .map((d) => {
          try {
            return parseISO(d);
          } catch {
            return null;
          }
        })
        .filter((d): d is Date => d !== null);
      setLocalDates(parsed);
      setIsDirty(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, savedDates]);

  const handleSave = async () => {
    const dateStrings = localDates.map((d) => format(d, "yyyy-MM-dd"));
    try {
      await setUnavailableDates.mutateAsync(dateStrings);
      toast.success("Availability saved");
      setIsDirty(false);
    } catch {
      toast.error("Failed to save availability");
    }
  };

  const handleClearAll = () => {
    setLocalDates([]);
    setIsDirty(true);
  };

  const sortedDateStrings = localDates
    .map((d) => format(d, "yyyy-MM-dd"))
    .sort();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            data-ocid="availability_manager.link"
          >
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Dashboard
            </Link>
          </Button>
        </div>

        <div>
          <h1 className="font-serif text-4xl font-bold mb-2">
            Manage Availability
          </h1>
          <p className="text-muted-foreground">
            Click any date to mark it as unavailable. Click again to clear it.
          </p>
        </div>

        {/* Calendar */}
        <div
          className="flex justify-center"
          data-ocid="availability_manager.panel"
        >
          {isLoading ? (
            <div
              className="flex items-center justify-center h-64 text-muted-foreground"
              data-ocid="availability_manager.loading_state"
            >
              Loading...
            </div>
          ) : (
            <Calendar
              mode="multiple"
              selected={localDates}
              onSelect={(days) => {
                setLocalDates(days ?? []);
                setIsDirty(true);
              }}
              className="rounded-xl border shadow-sm p-4 bg-card"
              modifiersClassNames={{
                selected:
                  "!bg-red-100 !text-red-600 hover:!bg-red-200 font-semibold",
              }}
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            onClick={handleSave}
            disabled={!isDirty || setUnavailableDates.isPending}
            data-ocid="availability_manager.save_button"
          >
            {setUnavailableDates.isPending ? (
              "Saving..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>

          {localDates.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearAll}
              data-ocid="availability_manager.delete_button"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove All Blocks
            </Button>
          )}

          {isDirty && (
            <span className="text-sm text-muted-foreground">
              Unsaved changes
            </span>
          )}
        </div>

        {/* Blocked dates list */}
        {sortedDateStrings.length > 0 ? (
          <div className="border rounded-xl p-5 space-y-3 bg-card">
            <h2 className="font-semibold text-sm uppercase tracking-wider opacity-60 flex items-center gap-2">
              <CalendarX className="h-4 w-4" />
              Blocked Dates ({sortedDateStrings.length})
            </h2>
            <ul className="flex flex-wrap gap-2">
              {sortedDateStrings.map((d, i) => (
                <li
                  key={d}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-medium"
                  data-ocid={`availability_manager.item.${i + 1}`}
                >
                  {format(parseISO(d), "MMM d, yyyy")}
                  <button
                    type="button"
                    onClick={() => {
                      setLocalDates((prev) =>
                        prev.filter((x) => format(x, "yyyy-MM-dd") !== d),
                      );
                      setIsDirty(true);
                    }}
                    className="ml-1 hover:opacity-70"
                    aria-label={`Remove ${d}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div
            className="border rounded-xl p-8 text-center text-muted-foreground bg-card"
            data-ocid="availability_manager.empty_state"
          >
            No dates blocked — all days are currently available.
          </div>
        )}
      </div>
    </div>
  );
}
