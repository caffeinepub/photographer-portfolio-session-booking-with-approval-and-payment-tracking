import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Calendar, Camera, Images } from "lucide-react";

export default function PageCTABar() {
  return (
    <section
      className="mt-16 bg-foreground text-background"
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
              className="bg-background text-foreground hover:bg-background/90 font-semibold"
              data-ocid="cta.primary_button"
            >
              <Link to="/book">
                <Calendar className="mr-2 h-4 w-4" />
                Book Now
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-background/40 text-background hover:bg-background/10 hover:text-background"
              data-ocid="cta.secondary_button"
            >
              <Link to="/book">
                <Camera className="mr-2 h-4 w-4" />
                Check Availability
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-background/40 text-background hover:bg-background/10 hover:text-background"
              data-ocid="cta.secondary_button"
            >
              <Link to="/photos">
                <Images className="mr-2 h-4 w-4" />
                Get Your Photos
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
