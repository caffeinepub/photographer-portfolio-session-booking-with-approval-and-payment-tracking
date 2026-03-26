import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import PageCTABar from "../components/PageCTABar";
import { useGetUnavailableDates } from "../hooks/useQueries";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AvailabilityPage() {
  const { data: unavailableDateStrings = [], isLoading } =
    useGetUnavailableDates();
  const [month, setMonth] = useState<Date>(new Date());

  const unavailableDays = unavailableDateStrings
    .map((d) => {
      try {
        return parseISO(d);
      } catch {
        return null;
      }
    })
    .filter((d): d is Date => d !== null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const isUnavailable = (d: Date) =>
    unavailableDays.some((u) => isSameDay(u, d));
  const isPast = (d: Date) => isBefore(d, today);

  return (
    <main>
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <p className="text-sm font-medium tracking-widest uppercase opacity-60">
              slr.pics
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold">
              Check Availability
            </h1>
            <p className="text-muted-foreground text-lg">
              See which dates are open for a session
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500" />
              <span className="text-foreground/70">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-red-400" />
              <span className="text-foreground/70">Unavailable</span>
            </div>
          </div>

          <div
            className="w-full rounded-xl border shadow-sm bg-card p-4 md:p-8"
            data-ocid="availability.panel"
          >
            {isLoading ? (
              <div
                className="flex items-center justify-center h-64 text-muted-foreground"
                data-ocid="availability.loading_state"
              >
                Loading availability...
              </div>
            ) : (
              <>
                {/* Month nav */}
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

                {/* Day headers */}
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

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day) => {
                    const outside = !isSameMonth(day, month);
                    const past = isPast(day);
                    const unavail = isUnavailable(day);
                    const isToday = isSameDay(day, today);

                    let cellClass =
                      "flex items-center justify-center rounded-lg text-sm font-medium transition-colors aspect-square ";
                    if (outside || past) {
                      cellClass += "text-muted-foreground/30";
                    } else if (unavail) {
                      cellClass += "bg-red-100 text-red-500 line-through";
                    } else if (isToday) {
                      cellClass +=
                        "bg-accent text-accent-foreground font-bold ring-2 ring-primary";
                    } else {
                      cellClass +=
                        "bg-green-50 text-green-700 hover:bg-green-100";
                    }

                    return (
                      <div key={day.toISOString()} className={cellClass}>
                        {format(day, "d")}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className="text-center pt-4">
            <p className="text-muted-foreground mb-4">
              Sports sessions starting at <strong>$20</strong>. Ready to lock in
              your date?
            </p>
            <Button
              asChild
              size="lg"
              className="font-semibold"
              data-ocid="availability.primary_button"
            >
              <Link to="/book">Book a Session</Link>
            </Button>
          </div>
        </div>
      </section>
      <PageCTABar />
    </main>
  );
}
