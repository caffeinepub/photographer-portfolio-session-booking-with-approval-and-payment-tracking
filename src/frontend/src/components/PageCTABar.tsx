import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Calendar, Clock, Images, Mail, MessageSquare } from "lucide-react";

export default function PageCTABar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLeaveReview = () => {
    const scrollToReview = () => {
      document
        .getElementById("leave-review")
        ?.scrollIntoView({ behavior: "smooth" });
    };

    if (location.pathname === "/") {
      scrollToReview();
    } else {
      navigate({ to: "/" });
      setTimeout(scrollToReview, 100);
    }
  };

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

          {/* Button row with Contact separated */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2 flex-wrap">
            {/* Primary group */}
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap justify-center">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-foreground text-foreground bg-background hover:bg-foreground/10 font-semibold"
                data-ocid="cta.primary_button"
              >
                <Link to="/book">
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
                <Link to="/availability">
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
                <Link to="/photos">
                  <Images className="mr-2 h-4 w-4" />
                  Client Photos
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-foreground text-foreground bg-background hover:bg-foreground/10 font-semibold"
                data-ocid="cta.open_modal_button"
                onClick={handleLeaveReview}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Leave a Review
              </Button>
            </div>

            {/* Separator */}
            <div className="hidden sm:block w-px h-10 bg-border mx-1" />

            {/* Contact — visually isolated */}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-foreground text-foreground bg-background hover:bg-foreground/10 font-semibold"
              data-ocid="cta.contact_button"
            >
              <Link to="/contact">
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
