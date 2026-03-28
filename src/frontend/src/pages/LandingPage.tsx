import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ChevronRight,
  Circle,
  Crosshair,
  Shield,
  Target,
  Timer,
  Zap,
} from "lucide-react";
import { SiInstagram, SiTiktok } from "react-icons/si";
import {
  useGetAllPortfolioItems,
  useGetHeroBackground,
} from "../hooks/useQueries";

export default function LandingPage() {
  const { data: portfolioItems = [] } = useGetAllPortfolioItems();
  const { data: heroBackground = "" } = useGetHeroBackground();
  const featuredItems = portfolioItems.slice(0, 3);

  const heroBg =
    heroBackground ||
    "/assets/generated/photography-hero-sports-concert.dim_1920x1080.png";

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-white/60 mb-4">
            Slade Robert · slr.pics
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-5 tracking-tight leading-none">
            Louisiana Sports
            <br />
            <span className="italic font-normal">Photography</span>
          </h1>
          <p className="text-base md:text-lg mb-10 max-w-lg mx-auto text-white/70 font-light">
            Capturing athletes in motion — baseball, basketball, football,
            soccer, volleyball, softball, track & field, and more across
            Louisiana.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="text-sm font-semibold tracking-wide px-8"
            >
              <Link to="/book">Book a Session</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-sm font-semibold tracking-wide px-8 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
            >
              <Link to="/portfolio">View Portfolio</Link>
            </Button>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/30">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/30" />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 divide-x divide-background/10">
            {[
              { stat: "8+", label: "Sports Covered" },
              { stat: "LA", label: "Louisiana-Based" },
              { stat: "$20", label: "Starting Price" },
            ].map((item) => (
              <div
                key={item.label}
                className="py-6 flex flex-col items-center text-center"
              >
                <span className="font-serif text-3xl md:text-4xl font-bold">
                  {item.stat}
                </span>
                <span className="text-xs tracking-widest uppercase mt-1 opacity-50 font-medium">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties */}
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
                  icon: Crosshair,
                  sport: "baseball",
                },
                {
                  label: "Basketball",
                  desc: "Court-side action and highlight moments",
                  icon: Circle,
                  sport: "basketball",
                },
                {
                  label: "Football",
                  desc: "Full game coverage from sideline to end zone",
                  icon: Shield,
                  sport: "football",
                },
                {
                  label: "Soccer",
                  desc: "Game coverage, action shots, match highlights",
                  icon: Activity,
                  sport: "soccer",
                },
                {
                  label: "Volleyball",
                  desc: "Match coverage, spike and dig moments",
                  icon: Zap,
                  sport: "volleyball",
                },
                {
                  label: "Softball",
                  desc: "Game coverage, pitching and batting action",
                  icon: Target,
                  sport: "softball",
                },
                {
                  label: "Track & Field",
                  desc: "Meet coverage, individual and relay events",
                  icon: Timer,
                  sport: "track",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-5 gap-8 group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="font-serif text-xl font-semibold">
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-sm text-muted-foreground text-right hidden sm:block">
                        {item.desc}
                      </span>
                      <Link
                        to="/book"
                        search={{ sport: item.sport }}
                        className="text-xs font-semibold tracking-wide text-foreground/50 hover:text-foreground flex items-center gap-1 transition-colors whitespace-nowrap"
                      >
                        Book <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-3">
              Portfolio
            </p>
            <h2 className="font-serif text-4xl font-bold">Featured Work</h2>
          </div>

          {featuredItems.length > 0 ? (
            <>
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
                        <p className="text-xs font-medium tracking-widest uppercase text-white/60 mb-1">
                          {item.category}
                        </p>
                        <h3 className="font-serif text-lg font-semibold">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[10px] font-semibold tracking-widest uppercase bg-black/60 backdrop-blur-sm text-white/80 px-2 py-1 rounded-sm">
                        {item.category}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-10">
                <Button asChild variant="outline" size="lg">
                  <Link to="/portfolio">View Full Portfolio</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="max-w-md py-10 text-muted-foreground">
              <p className="text-sm mb-4">
                Portfolio photos will appear here once uploaded. In the
                meantime, browse the full gallery.
              </p>
              <Button asChild variant="outline">
                <Link to="/portfolio">Go to Portfolio</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background border-t border-border">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-4">
            Ready to work together?
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Book Your Session
          </h2>
          <p className="text-muted-foreground text-base md:text-lg mb-10 max-w-xl">
            Sports coverage starting at $20. Reach out to reserve your date —
            limited availability each season.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="px-8">
              <Link to="/book">Book Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Social Follow Section */}
      <section className="py-16 bg-foreground">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-background/40 mb-3">
            Social
          </p>
          <h2 className="font-serif text-3xl font-bold text-background mb-2">
            Stay Updated
          </h2>
          <p className="text-background/50 text-sm mb-10 max-w-sm mx-auto">
            Follow along for my latest work, game-day shots, and
            behind-the-scenes moments.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://www.instagram.com/_slr.pics_"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="social.primary_button"
              className="inline-flex items-center gap-2.5 px-8 py-3 rounded-full font-semibold text-sm tracking-wide text-white transition-transform duration-200 hover:scale-105 active:scale-95"
              style={{
                background:
                  "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
                boxShadow: "0 4px 20px rgba(220, 39, 67, 0.45)",
              }}
            >
              <SiInstagram className="h-4 w-4" />
              Instagram
            </a>

            <a
              href="https://www.tiktok.com/@_slr.pics_?_r=1&_t=ZP-93qjJcBT9Re"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="social.secondary_button"
              className="inline-flex items-center gap-2.5 px-8 py-3 rounded-full font-semibold text-sm tracking-wide text-white transition-transform duration-200 hover:scale-105 active:scale-95"
              style={{
                background: "#010101",
                boxShadow: "0 4px 20px rgba(105, 201, 208, 0.35)",
                border: "1px solid rgba(105,201,208,0.25)",
              }}
            >
              <SiTiktok
                className="h-4 w-4"
                style={{
                  filter:
                    "drop-shadow(2px 2px 0px #EE1D52) drop-shadow(-2px -2px 0px #69C9D0)",
                }}
              />
              TikTok
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
