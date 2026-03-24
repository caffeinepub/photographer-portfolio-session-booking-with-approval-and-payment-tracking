import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const appIdentifier =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "unknown-app";

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col space-y-6">
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <img
                src="/assets/generated/photographer-logo-slr-pics.dim_512x512.png"
                alt="slr.pics Logo"
                className="h-8 w-8 object-contain opacity-60"
              />
              <span className="text-sm text-muted-foreground">
                © {currentYear} slr.pics. All rights reserved.
              </span>
            </div>

            <div className="flex flex-col space-y-2">
              <h3 className="text-sm font-semibold text-foreground">
                Get in Touch
              </h3>
              <Link
                to="/contact"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center"
              >
                Visit our contact page →
              </Link>
            </div>
          </div>

          {/* Attribution */}
          <div className="flex justify-center md:justify-start pt-4 border-t">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>Built with</span>
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              <span>using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
