import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useGetAllPortfolioItems } from "../hooks/useQueries";

const TABS = [
  { id: "baseball", label: "Baseball", category: "sports", sport: "baseball" },
  {
    id: "basketball",
    label: "Basketball",
    category: "sports",
    sport: "basketball",
  },
  { id: "football", label: "Football", category: "sports", sport: "football" },
  {
    id: "concert",
    label: "Boots on the Bayou",
    category: "concert",
    sport: null,
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function PortfolioGalleryPage() {
  const { data: portfolioItems = [], isLoading } = useGetAllPortfolioItems();
  const [activeTab, setActiveTab] = useState<TabId | "all">("all");
  const navigate = useNavigate();

  const filteredItems = (() => {
    if (activeTab === "all") return portfolioItems;
    const tab = TABS.find((t) => t.id === activeTab);
    if (!tab) return portfolioItems;
    if (tab.category === "concert") {
      return portfolioItems.filter((item) => item.category === "concert");
    }
    // Sports tab: filter by sport keyword in title, or fall back to all sports
    const bySport = portfolioItems.filter(
      (item) =>
        item.category === "sports" &&
        item.title.toLowerCase().includes(tab.sport!),
    );
    return bySport.length > 0
      ? bySport
      : portfolioItems.filter((item) => item.category === "sports");
  })();

  const activeTabData = TABS.find((t) => t.id === activeTab);
  const showBookButton =
    activeTab !== "all" && activeTabData && activeTabData.category === "sports";

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
        <div className="text-center mb-10">
          <h1 className="font-serif text-5xl font-bold mb-4">Portfolio</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore sports action and concert moments captured through the lens
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            type="button"
            data-ocid="portfolio.tab"
            onClick={() => setActiveTab("all")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
              activeTab === "all"
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
            }`}
          >
            All
          </button>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              data-ocid="portfolio.tab"
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Book Session Button for sports tabs */}
        {showBookButton && activeTabData && (
          <div className="flex justify-center mb-8">
            <Button
              data-ocid="portfolio.primary_button"
              onClick={() =>
                navigate({
                  to: "/book",
                  search: { sport: activeTabData.sport! } as any,
                })
              }
              size="lg"
            >
              Book a {activeTabData.label} Session
            </Button>
          </div>
        )}

        {filteredItems.length === 0 ? (
          <div className="text-center py-16" data-ocid="portfolio.empty_state">
            <p className="text-muted-foreground text-lg">
              No photos in this category yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => (
              <Link
                key={item.id.toString()}
                to="/portfolio/$id"
                params={{ id: item.id.toString() }}
                data-ocid={`portfolio.item.${idx + 1}`}
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
