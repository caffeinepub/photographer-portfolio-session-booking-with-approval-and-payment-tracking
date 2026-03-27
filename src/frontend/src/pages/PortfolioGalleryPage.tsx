import PageCTABar from "@/components/PageCTABar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
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

function WatermarkedImage({
  src,
  alt,
  className,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      // Draw tiled watermark
      ctx.save();
      ctx.font = `bold ${Math.max(16, img.naturalWidth / 20)}px sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.textBaseline = "middle";

      const text = "slr.pics";
      const tileW = img.naturalWidth / 4;
      const tileH = img.naturalHeight / 4;

      for (let row = -1; row <= 5; row++) {
        for (let col = -1; col <= 5; col++) {
          ctx.save();
          const x = col * tileW + (row % 2 === 0 ? 0 : tileW / 2);
          const y = row * tileH;
          ctx.translate(x + tileW / 2, y + tileH / 2);
          ctx.rotate((-30 * Math.PI) / 180);
          ctx.fillText(text, 0, 0);
          ctx.restore();
        }
      }
      ctx.restore();
    };
    img.src = src;
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={style}
      onContextMenu={(e) => e.preventDefault()}
      draggable={false}
      aria-label={alt}
    />
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

          {/* Tab Pills - horizontally scrollable on mobile */}
          <div className="relative mb-8">
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide -mx-1 px-1">
              <button
                type="button"
                data-ocid="portfolio.tab"
                onClick={() => setActiveTab("all")}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
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
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
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
                  <WatermarkedImage
                    src={item.imageUrl}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
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
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white bg-black/40 rounded-full p-2 sm:p-3 transition-colors"
              >
                <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
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
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white bg-black/40 rounded-full p-2 sm:p-3 transition-colors"
              >
                <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
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
                <WatermarkedImage
                  src={lightboxItem.imageUrl}
                  alt={lightboxItem.title}
                  className="max-w-[90vw] max-h-[75vh] rounded-sm"
                />
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
