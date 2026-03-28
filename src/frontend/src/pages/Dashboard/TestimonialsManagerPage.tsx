import { Link } from "@tanstack/react-router";

export default function TestimonialsManagerPage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <p className="text-muted-foreground mb-4">
        Testimonials have been removed.
      </p>
      <Link to="/dashboard" className="underline text-sm">
        Back to Dashboard
      </Link>
    </div>
  );
}
