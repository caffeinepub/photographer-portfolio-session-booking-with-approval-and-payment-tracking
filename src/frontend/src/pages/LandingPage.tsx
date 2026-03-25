import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import { CheckCircle, Quote } from "lucide-react";
import { useState } from "react";
import { SiInstagram, SiTiktok } from "react-icons/si";
import { toast } from "sonner";
import {
  useGetAllPortfolioItems,
  useGetApprovedTestimonials,
  useGetHeroBackground,
  useSubmitTestimonial,
} from "../hooks/useQueries";

export default function LandingPage() {
  const { data: portfolioItems = [] } = useGetAllPortfolioItems();
  const { data: heroBackground = "" } = useGetHeroBackground();
  const { data: testimonials = [] } = useGetApprovedTestimonials();
  const submitTestimonial = useSubmitTestimonial();
  const featuredItems = portfolioItems.slice(0, 3);

  const [reviewForm, setReviewForm] = useState({
    name: "",
    quote: "",
    sport: "",
  });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const heroBg =
    heroBackground ||
    "/assets/generated/photography-hero-sports-concert.dim_1920x1080.png";

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.quote.trim()) {
      toast.error("Please fill in your name and review.");
      return;
    }
    setReviewSubmitting(true);
    try {
      await submitTestimonial.mutateAsync({
        clientName: reviewForm.name.trim(),
        quote: reviewForm.quote.trim(),
        sport: reviewForm.sport.trim() || null,
      });
      setReviewSubmitted(true);
    } catch {
      toast.error("Failed to submit your review. Please try again.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroBg})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Action & Energy,
            <br />
            Captured in Motion
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/80">
            Sports photography that captures the intensity of the game — from
            the field to the court.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-base">
              <Link to="/portfolio">View Portfolio</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
            >
              <Link to="/book">Book Coverage</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* What I do — simple text rows */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-8">
              Specialties
            </p>
            <div className="divide-y divide-border">
              {[
                {
                  label: "Baseball",
                  desc: "Game coverage, action shots, portraits",
                },
                {
                  label: "Basketball",
                  desc: "Court-side action and highlight moments",
                },
                {
                  label: "Football",
                  desc: "Full game coverage from sideline to end zone",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-baseline justify-between py-4 gap-8"
                >
                  <span className="font-serif text-xl font-semibold">
                    {item.label}
                  </span>
                  <span className="text-sm text-muted-foreground text-right">
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work */}
      {featuredItems.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-3">
                Portfolio
              </p>
              <h2 className="font-serif text-4xl font-bold">Featured Work</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4 max-w-6xl">
              {featuredItems.map((item) => (
                <Link
                  key={item.id.toString()}
                  to="/portfolio"
                  className="group relative aspect-[4/5] overflow-hidden rounded-sm shadow-elegant hover:shadow-elegant-lg transition-all duration-300"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="font-serif text-xl font-semibold mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-white/80">{item.category}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10">
              <Button asChild variant="outline" size="lg">
                <Link to="/portfolio">View Full Portfolio</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-3">
                Reviews
              </p>
              <h2 className="font-serif text-4xl font-bold">
                What Clients Say
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
              {testimonials.map((t, i) => (
                <Card
                  key={t.id.toString()}
                  data-ocid={`testimonials.item.${i + 1}`}
                  className="relative border-border"
                >
                  <CardContent className="pt-8 pb-6 px-6">
                    <Quote className="absolute top-4 left-4 h-5 w-5 text-muted-foreground/30" />
                    <p className="text-foreground/80 leading-relaxed mb-6 italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="border-t border-border pt-4">
                      <p className="font-semibold text-foreground">
                        {t.clientName}
                      </p>
                      {t.sport && (
                        <p className="text-sm text-muted-foreground capitalize mt-0.5">
                          {t.sport}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Submit a Review */}
      <section id="leave-review" className="py-20 bg-[#0a0a0a]">
        <div className="container mx-auto px-4 max-w-xl">
          <div className="mb-8">
            <p className="text-xs font-medium tracking-widest uppercase text-white/40 mb-3">
              Reviews
            </p>
            <h2 className="font-serif text-3xl font-bold text-white">
              Share Your Experience
            </h2>
            <p className="text-white/50 text-sm mt-2">
              Worked with Slade? Leave a review — it will appear on the site
              once approved.
            </p>
          </div>

          {reviewSubmitted ? (
            <div
              data-ocid="review.success_state"
              className="flex flex-col items-center gap-4 py-10 text-center"
            >
              <CheckCircle className="h-12 w-12 text-green-400" />
              <p className="text-white font-semibold text-lg">
                Thanks for your review!
              </p>
              <p className="text-white/50 text-sm max-w-xs">
                Your submission has been received and will appear on the site
                once approved.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleReviewSubmit}
              className="space-y-4"
              data-ocid="review.panel"
            >
              <div className="space-y-1.5">
                <Label htmlFor="review-name" className="text-white/80 text-sm">
                  Your Name *
                </Label>
                <Input
                  id="review-name"
                  data-ocid="review.input"
                  value={reviewForm.name}
                  onChange={(e) =>
                    setReviewForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. Marcus Johnson"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-white/40"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="review-sport" className="text-white/80 text-sm">
                  Sport (optional)
                </Label>
                <Input
                  id="review-sport"
                  data-ocid="review.input"
                  value={reviewForm.sport}
                  onChange={(e) =>
                    setReviewForm((p) => ({ ...p, sport: e.target.value }))
                  }
                  placeholder="e.g. Baseball"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-white/40"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="review-quote" className="text-white/80 text-sm">
                  Your Review *
                </Label>
                <Textarea
                  id="review-quote"
                  data-ocid="review.textarea"
                  value={reviewForm.quote}
                  onChange={(e) =>
                    setReviewForm((p) => ({ ...p, quote: e.target.value }))
                  }
                  placeholder="Tell us about your experience..."
                  rows={4}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 resize-none"
                />
              </div>
              <Button
                type="submit"
                data-ocid="review.submit_button"
                disabled={reviewSubmitting}
                className="w-full"
              >
                {reviewSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl font-bold mb-4">
            Ready to Book Your Sports Coverage?
          </h2>
          <p className="text-lg mb-8 max-w-xl opacity-90">
            Sports sessions starting at $20. Book your coverage for your next
            game or tournament.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/book">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Social Follow Section */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-3">
            Follow Along
          </h2>
          <p className="text-white/50 mb-10 max-w-lg mx-auto">
            Latest shots and behind-the-scenes moments
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="https://www.instagram.com/_slr.pics_"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="social.primary_button"
              className="flex items-center gap-3 px-8 py-4 rounded-full text-white font-semibold text-base transition-all hover:scale-105 active:scale-95"
              style={{
                background:
                  "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
              }}
            >
              <SiInstagram className="h-5 w-5" />
              Follow on Instagram
            </a>
            <a
              href="https://www.tiktok.com/@_slr.pics_?_r=1&_t=ZP-93qjJcBT9Re"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="social.secondary_button"
              className="flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-semibold text-base transition-all hover:scale-105 active:scale-95 border border-white/20"
            >
              <SiTiktok className="h-5 w-5" />
              Follow on TikTok
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
