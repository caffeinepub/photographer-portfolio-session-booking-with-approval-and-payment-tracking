import { Link } from "@tanstack/react-router";

export default function PageCTABar() {
  const btnClass =
    "border border-foreground px-5 py-2 text-sm font-medium tracking-wide hover:bg-foreground/5 transition-colors";

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

          <div className="flex flex-wrap gap-3 justify-center items-center pt-2">
            <Link
              to="/book"
              className={btnClass}
              data-ocid="cta.primary_button"
            >
              Book Now
            </Link>
            <Link
              to="/availability"
              className={btnClass}
              data-ocid="cta.secondary_button"
            >
              Check Availability
            </Link>
            <Link
              to="/photos"
              className={btnClass}
              data-ocid="cta.tertiary_button"
            >
              Client Photos
            </Link>
            <Link
              to="/contact"
              className={btnClass}
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
