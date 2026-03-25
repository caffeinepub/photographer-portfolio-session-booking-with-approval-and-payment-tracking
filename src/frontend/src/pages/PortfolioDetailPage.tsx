import PageCTABar from "@/components/PageCTABar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useGetPortfolioItem } from "../hooks/useQueries";

export default function PortfolioDetailPage() {
  const { id } = useParams({ from: "/portfolio/$id" });
  const { data: item, isLoading } = useGetPortfolioItem(BigInt(id));

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-serif text-3xl font-bold mb-4">
          Portfolio Item Not Found
        </h1>
        <Button asChild variant="outline">
          <Link to="/portfolio">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolio
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <Button asChild variant="ghost" className="mb-8">
            <Link to="/portfolio">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portfolio
            </Link>
          </Button>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-4">
                  {item.category}
                </Badge>
                <h1 className="font-serif text-4xl font-bold mb-4">
                  {item.title}
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  Added{" "}
                  {new Date(
                    Number(item.timestamp) / 1000000,
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="pt-6">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link to="/book">Book a Similar Session</Link>
                </Button>
              </div>
            </div>

            <div className="lg:sticky lg:top-24 h-fit">
              <div className="aspect-[4/5] overflow-hidden rounded-sm shadow-elegant-lg">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <PageCTABar />
    </div>
  );
}
