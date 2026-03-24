import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Award, Calendar, Camera } from "lucide-react";
import { useGetAllPortfolioItems } from "../hooks/useQueries";

export default function LandingPage() {
  const { data: portfolioItems = [] } = useGetAllPortfolioItems();
  const featuredItems = portfolioItems.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(/assets/generated/photography-hero-sports-concert.dim_1920x1080.png)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-fade-in">
            Action & Energy,
            <br />
            Captured in Motion
          </h1>
          <p
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/90 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            Professional sports and concert photography that captures the
            intensity of the game and the energy of live music
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <Button asChild size="lg" className="text-base">
              <Link to="/portfolio">View Portfolio</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <Link to="/book">Book Coverage</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                <Camera className="h-8 w-8" />
              </div>
              <h3 className="font-serif text-xl font-semibold">
                Fast-Action Expertise
              </h3>
              <p className="text-muted-foreground">
                High-speed equipment and techniques to freeze every decisive
                moment on the field or stage
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="font-serif text-xl font-semibold">
                Event Coverage
              </h3>
              <p className="text-muted-foreground">
                Comprehensive coverage for games, tournaments, concerts, and
                live performances
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="font-serif text-xl font-semibold">
                Dynamic Results
              </h3>
              <p className="text-muted-foreground">
                Powerful images that capture the emotion, intensity, and
                atmosphere of your event
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work */}
      {featuredItems.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl font-bold mb-4">
                Featured Work
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Recent sports action and concert moments captured
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {featuredItems.map((item) => (
                <Link
                  key={item.id.toString()}
                  to="/portfolio/$id"
                  params={{ id: item.id.toString() }}
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
            <div className="text-center mt-12">
              <Button asChild variant="outline" size="lg">
                <Link to="/portfolio">View Full Portfolio</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl font-bold mb-4">
            Ready to Book Your Coverage?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Let's capture the action together. Book your sports or concert
            photography coverage today.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/book">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
