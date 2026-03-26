import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Link } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { CalendarCheck, CalendarX } from "lucide-react";
import { useState } from "react";
import PageCTABar from "../components/PageCTABar";
import { useGetUnavailableDates } from "../hooks/useQueries";

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

  return (
    <main>
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
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

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-green-600" />
              <span className="text-foreground/70">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarX className="h-4 w-4 text-red-500" />
              <span className="text-foreground/70">Unavailable</span>
            </div>
          </div>

          {/* Calendar */}
          <div className="w-full" data-ocid="availability.panel">
            {isLoading ? (
              <div
                className="flex items-center justify-center h-64 text-muted-foreground"
                data-ocid="availability.loading_state"
              >
                Loading availability...
              </div>
            ) : (
              <Calendar
                mode="single"
                month={month}
                onMonthChange={setMonth}
                modifiers={{ unavailable: unavailableDays }}
                modifiersClassNames={{
                  unavailable:
                    "!bg-red-100 !text-red-500 line-through opacity-60 cursor-not-allowed",
                }}
                className="rounded-xl border shadow-sm p-4 md:p-6 bg-card w-full"
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
                classNames={{
                  months:
                    "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
                  month: "space-y-4 w-full",
                  caption:
                    "flex justify-center pt-1 relative items-center mb-4",
                  caption_label: "text-xl font-semibold",
                  nav: "space-x-1 flex items-center",
                  nav_button:
                    "h-10 w-10 bg-transparent p-0 opacity-50 hover:opacity-100",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse",
                  head_row: "flex w-full",
                  head_cell:
                    "text-muted-foreground rounded-md flex-1 font-medium text-sm text-center py-2",
                  row: "flex w-full mt-1",
                  cell: "flex-1 text-center text-sm p-0.5 relative",
                  day: "w-full h-12 md:h-14 p-0 font-normal text-base aria-selected:opacity-100 rounded-lg hover:bg-accent transition-colors",
                  day_selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground font-bold",
                  day_outside: "text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-50",
                }}
              />
            )}
          </div>

          {/* Unavailable date list */}
          {unavailableDays.length > 0 && (
            <div className="border rounded-xl p-5 space-y-3 bg-card">
              <h2 className="font-semibold text-sm uppercase tracking-wider opacity-60">
                Blocked Dates
              </h2>
              <ul className="flex flex-wrap gap-2">
                {unavailableDateStrings
                  .slice()
                  .sort()
                  .map((d) => (
                    <li
                      key={d}
                      className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-medium"
                    >
                      {format(parseISO(d), "MMM d, yyyy")}
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* CTA */}
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
