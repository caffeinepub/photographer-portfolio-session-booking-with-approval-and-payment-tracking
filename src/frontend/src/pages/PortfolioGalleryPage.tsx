import PageCTABar from "@/components/PageCTABar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
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

function Watermark() {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent, transparent 60px, rgba(255,255,255,0.07) 60px, rgba(255,255,255,0.07) 61px)",
        }}
      />
      {(
        [
          [8, 5],
          [8, 33],
          [8, 61],
          [8, 89],
          [28, 5],
          [28, 33],
          [28, 61],
          [28, 89],
          [48, 5],
          [48, 33],
          [48, 61],
          [48, 89],
          [68, 5],
          [68, 33],
          [68, 61],
          [68, 89],
          [88, 5],
          [88, 33],
          [88, 61],
          [88, 89],
          [18, 19],
          [18, 47],
          [18, 75],
          [38, 19],
          [38, 47],
          [38, 75],
          [58, 19],
          [58, 47],
          [58, 75],
          [78, 19],
          [78, 47],
          [78, 75],
        ] as [number, number][]
      ).map(([top, left]) => (
        <span
          key={`wm-${top}-${left}`}
          style={{
            position: "absolute",
            top: `${top}%`,
            left: `${left}%`,
            color: "rgba(255,255,255,0.18)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            transform: "rotate(-30deg)",
            whiteSpace: "nowrap",
            textShadow: "0 1px 2px rgba(0,0,0,0.4)",
          }}
        >
          slr.pics
        </span>
      ))}
    </div>
  );
}

export default function PortfolioGalleryPage() {
  const { data: portfolioItems = [], isLoading } = useGetAllPortfolioItems();
  const [activeTab, setActiveTab] = useState<TabId | "all">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const filteredItems = (() => {
    if (activeTab === "all") return portfolioItems;
    const tab = TABS.find((t) => t.id === activeTab);
    if (!tab) return portfolioItems;
    if (tab.category === "concert") {
      return portfolioItems.filter((item) => item.category === "concert");
    }
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

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const prev = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + filteredItems.length) % filteredItems.length,
    );
  }, [filteredItems.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i + 1) % filteredItems.length,
    );
  }, [filteredItems.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, prev, next, closeLightbox]);

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

  const lightboxItem =
    lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <div>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-serif text-5xl font-bold mb-4">Portfolio</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore sports action and concert moments captured through the
              lens
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
            <div
              className="text-center py-16"
              data-ocid="portfolio.empty_state"
            >
              <p className="text-muted-foreground text-lg">
                No photos in this category yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, idx) => (
                <button
                  key={item.id.toString()}
                  type="button"
                  data-ocid={`portfolio.item.${idx + 1}`}
                  onClick={() => openLightbox(idx)}
                  className="group relative aspect-[4/5] overflow-hidden rounded-sm shadow-elegant hover:shadow-elegant-lg transition-all duration-300 text-left w-full"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Watermark />
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
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem !== null && lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
            data-ocid="portfolio.modal"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              type="button"
              data-ocid="portfolio.close_button"
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-black/40 rounded-full p-2 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Prev */}
            {filteredItems.length > 1 && (
              <button
                type="button"
                data-ocid="portfolio.pagination_prev"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white bg-black/40 rounded-full p-3 transition-colors"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
            )}

            {/* Next */}
            {filteredItems.length > 1 && (
              <button
                type="button"
                data-ocid="portfolio.pagination_next"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white bg-black/40 rounded-full p-3 transition-colors"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={lightboxItem.imageUrl}
                  alt={lightboxItem.title}
                  className="max-w-[90vw] max-h-[75vh] object-contain rounded-sm"
                />
                <Watermark />
              </div>
              <div className="mt-4 text-center text-white">
                <h3 className="font-serif text-xl font-semibold">
                  {lightboxItem.title}
                </h3>
                <p className="text-white/60 text-sm mt-1 capitalize">
                  {lightboxItem.category}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PageCTABar />
    </div>
  );
}
