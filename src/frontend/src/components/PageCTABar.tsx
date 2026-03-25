import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Calendar, Clock, Images } from "lucide-react";

function scrollTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function PageCTABar() {
  return (
    <section
      className="mt-16 bg-background text-foreground border-t border-border"
      data-ocid="cta.section"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <p className="text-sm font-medium tracking-widest uppercase opacity-60">
            slr.pics
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold">
            Ready to work together?
          </h2>
          <p className="opacity-70 text-base max-w-md mx-auto">
            Lock in your session, check the calendar, or grab your photos — all
            in a few clicks.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-foreground text-foreground bg-background hover:bg-foreground/10 font-semibold"
              data-ocid="cta.primary_button"
            >
              <Link to="/book" onClick={scrollTop}>
                <Calendar className="mr-2 h-4 w-4" />
                Book Now
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-foreground text-foreground bg-background hover:bg-foreground/10 font-semibold"
              data-ocid="cta.secondary_button"
            >
              <Link to="/book" onClick={scrollTop}>
                <Clock className="mr-2 h-4 w-4" />
                Check Availability
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-foreground text-foreground bg-background hover:bg-foreground/10 font-semibold"
              data-ocid="cta.tertiary_button"
            >
              <Link to="/photos" onClick={scrollTop}>
                <Images className="mr-2 h-4 w-4" />
                Client Photos
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
