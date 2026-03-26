import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import {
  ArrowLeft,
  CalendarX,
  ChevronLeft,
  ChevronRight,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useGetUnavailableDates,
  useSetUnavailableDates,
} from "../../hooks/useQueries";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AvailabilityManagerPage() {
  const { data: savedDates = [], isLoading } = useGetUnavailableDates();
  const setUnavailableDates = useSetUnavailableDates();

  const [localDates, setLocalDates] = useState<Date[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [month, setMonth] = useState<Date>(new Date());

  // biome-ignore lint/correctness/useExhaustiveDependencies: savedDates array identity changes on each fetch; join is a stable primitive dep
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
  }, [isLoading, savedDates.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleDate = (day: Date) => {
    setLocalDates((prev) => {
      const exists = prev.some((d) => isSameDay(d, day));
      return exists ? prev.filter((d) => !isSameDay(d, day)) : [...prev, day];
    });
    setIsDirty(true);
  };

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

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const isBlocked = (d: Date) => localDates.some((u) => isSameDay(u, d));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sortedDateStrings = localDates
    .map((d) => format(d, "yyyy-MM-dd"))
    .sort();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
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
            Click any date to block or unblock it. Save when done.
          </p>
        </div>

        <div
          className="w-full rounded-xl border shadow-sm bg-card p-4 md:p-8"
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
            <>
              <div className="flex items-center justify-between mb-6">
                <button
                  type="button"
                  onClick={() => setMonth((m) => addMonths(m, -1))}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-xl font-semibold">
                  {format(month, "MMMM yyyy")}
                </span>
                <button
                  type="button"
                  onClick={() => setMonth((m) => addMonths(m, 1))}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-7 mb-2">
                {DAYS.map((d) => (
                  <div
                    key={d}
                    className="text-center text-xs font-semibold text-muted-foreground py-2 uppercase tracking-wide"
                  >
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day) => {
                  const outside = !isSameMonth(day, month);
                  const blocked = isBlocked(day);
                  const isToday = isSameDay(day, today);

                  let cellClass =
                    "flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer select-none aspect-square ";
                  if (outside) {
                    cellClass += "text-muted-foreground/30 cursor-default";
                  } else if (blocked) {
                    cellClass +=
                      "bg-red-100 text-red-600 hover:bg-red-200 font-semibold";
                  } else if (isToday) {
                    cellClass +=
                      "bg-accent text-accent-foreground font-bold hover:bg-accent/80 ring-2 ring-primary";
                  } else {
                    cellClass += "hover:bg-accent/60";
                  }

                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      className={cellClass}
                      onClick={() => !outside && toggleDate(day)}
                      aria-label={`${blocked ? "Unblock" : "Block"} ${format(day, "MMM d")}`}
                    >
                      {format(day, "d")}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

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
