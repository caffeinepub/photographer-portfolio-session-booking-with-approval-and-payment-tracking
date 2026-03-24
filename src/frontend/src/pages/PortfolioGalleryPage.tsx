import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useGetAllPortfolioItems } from "../hooks/useQueries";

export default function PortfolioGalleryPage() {
  const { data: portfolioItems = [], isLoading } = useGetAllPortfolioItems();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold mb-4">Portfolio</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our collection of sports action on the field and court, plus
            electrifying concert moments from live performances
          </p>
        </div>

        {portfolioItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No portfolio items yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <Badge variant="secondary" className="mb-2">
                      {item.category}
                    </Badge>
                    <h3 className="font-serif text-xl font-semibold mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-white/80 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
