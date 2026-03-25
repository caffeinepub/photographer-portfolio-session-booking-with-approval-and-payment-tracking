import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useIsCallerAdmin } from "../../hooks/useQueries";
import LoginButton from "../auth/LoginButton";

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();

  const isAuthenticated = !!identity;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/assets/uploads/img_4650-019d2283-52c4-7534-95bf-09c2d0a9a16c-1.jpeg"
              alt="slr.pics"
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="font-serif text-xl font-semibold tracking-tight">
              slr.pics
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-primary"
              data-ocid="nav.link"
            >
              Home
            </Link>
            <Link
              to="/portfolio"
              className="text-sm font-medium transition-colors hover:text-primary"
              data-ocid="nav.link"
            >
              Portfolio
            </Link>
            <Link
              to="/availability"
              className="text-sm font-medium transition-colors hover:text-primary"
              data-ocid="nav.link"
            >
              Check Availability
            </Link>
            <Link
              to="/photos"
              className="text-sm font-medium transition-colors hover:text-primary"
              data-ocid="nav.link"
            >
              Client Albums
            </Link>
            <Link
              to="/book"
              className="text-sm font-medium transition-colors hover:text-primary"
              data-ocid="nav.link"
            >
              Book Coverage
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium transition-colors hover:text-primary"
              data-ocid="nav.link"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium transition-colors hover:text-primary"
              data-ocid="nav.link"
            >
              Contact
            </Link>
            {isAuthenticated && isAdmin && (
              <Link
                to="/dashboard"
                className="text-sm font-medium transition-colors hover:text-primary"
                data-ocid="nav.link"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:block">
            <LoginButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
            <Link
              to="/"
              className="block text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
              data-ocid="nav.link"
            >
              Home
            </Link>
            <Link
              to="/portfolio"
              className="block text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
              data-ocid="nav.link"
            >
              Portfolio
            </Link>
            <Link
              to="/availability"
              className="block text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
              data-ocid="nav.link"
            >
              Check Availability
            </Link>
            <Link
              to="/photos"
              className="block text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
              data-ocid="nav.link"
            >
              Client Albums
            </Link>
            <Link
              to="/book"
              className="block text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
              data-ocid="nav.link"
            >
              Book Coverage
            </Link>
            <Link
              to="/about"
              className="block text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
              data-ocid="nav.link"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
              data-ocid="nav.link"
            >
              Contact
            </Link>
            {isAuthenticated && isAdmin && (
              <Link
                to="/dashboard"
                className="block text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
                data-ocid="nav.link"
              >
                Dashboard
              </Link>
            )}
            <div className="pt-4">
              <LoginButton />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
