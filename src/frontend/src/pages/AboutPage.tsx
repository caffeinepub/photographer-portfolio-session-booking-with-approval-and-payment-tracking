import PageCTABar from "@/components/PageCTABar";
import { CONTACT_INFO } from "@/constants/contactInfo";

export default function AboutPage() {
  return (
    <div>
      <div className="min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-10 md:mb-14">
              <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-4">
                slr.pics
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-0">
                About
              </h1>
            </div>

            {/* Profile + Bio */}
            <div className="flex flex-col md:grid md:grid-cols-[200px_1fr] gap-8 md:gap-14 items-start">
              <div className="shrink-0">
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden">
                  <img
                    src="/assets/uploads/photographer_capturing_the_concert_scene-019d2741-8072-756a-ae31-939ae4e01812-1.png"
                    alt="Slade Robert — slr.pics"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-1">
                    Slade Robert
                  </h2>
                  <p className="text-sm text-muted-foreground tracking-wide">
                    Sports & Concert Photographer — Louisiana
                  </p>
                </div>
                <p className="text-foreground/80 leading-relaxed text-base">
                  {CONTACT_INFO.bio}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border mt-12 md:mt-16 pt-10 md:pt-12">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-bold">
                    Baseball
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Field Coverage
                  </p>
                </div>
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-bold">
                    Basketball
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Court Action
                  </p>
                </div>
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-bold">
                    Football
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Game Day Moments
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PageCTABar />
    </div>
  );
}
