import { Link, useLocation, useNavigate } from "@tanstack/react-router";

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
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-2 flex-wrap">
            {/* Primary group — plain text links */}
            <div className="flex flex-col sm:flex-row gap-6 flex-wrap justify-center items-center">
              <Link
                to="/book"
                className="text-sm font-medium tracking-wide transition-opacity hover:opacity-50"
                data-ocid="cta.primary_button"
              >
                Book Now
              </Link>
              <Link
                to="/availability"
                className="text-sm font-medium tracking-wide transition-opacity hover:opacity-50"
                data-ocid="cta.secondary_button"
              >
                Check Availability
              </Link>
              <Link
                to="/photos"
                className="text-sm font-medium tracking-wide transition-opacity hover:opacity-50"
                data-ocid="cta.tertiary_button"
              >
                Client Photos
              </Link>
              <button
                type="button"
                className="text-sm font-medium tracking-wide transition-opacity hover:opacity-50 cursor-pointer"
                data-ocid="cta.open_modal_button"
                onClick={handleLeaveReview}
              >
                Leave a Review
              </button>
            </div>

            {/* Separator */}
            <div className="hidden sm:block w-px h-6 bg-foreground/20" />

            {/* Contact — bordered box */}
            <Link
              to="/contact"
              className="border border-foreground px-5 py-2 text-sm font-medium tracking-wide transition-opacity hover:opacity-60 rounded-none"
              data-ocid="cta.contact_button"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
