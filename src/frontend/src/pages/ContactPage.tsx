import PageCTABar from "@/components/PageCTABar";
import { CONTACT_INFO } from "@/constants/contactInfo";
import { Mail, Phone } from "lucide-react";
import { SiInstagram, SiTiktok } from "react-icons/si";

export default function ContactPage() {
  return (
    <div>
      <div className="min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-xl mx-auto">
            {/* Header */}
            <div className="mb-14">
              <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-4">
                slr.pics
              </p>
              <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight">
                Contact
              </h1>
            </div>

            {/* Contact List */}
            <div className="divide-y divide-border">
              {/* Phone */}
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="group flex items-center justify-between py-5 hover:text-primary transition-colors"
                data-ocid="contact.link"
              >
                <div className="flex items-center gap-4">
                  <Phone className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  <span className="text-sm text-muted-foreground">Phone</span>
                </div>
                <span className="font-medium text-sm">
                  {CONTACT_INFO.phone}
                </span>
              </a>

              {/* Email */}
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="group flex items-center justify-between py-5 hover:text-primary transition-colors"
                data-ocid="contact.link"
              >
                <div className="flex items-center gap-4">
                  <Mail className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  <span className="text-sm text-muted-foreground">Email</span>
                </div>
                <span className="font-medium text-sm break-all text-right">
                  {CONTACT_INFO.email}
                </span>
              </a>

              {/* Instagram */}
              <a
                href={CONTACT_INFO.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between py-5 hover:text-primary transition-colors"
                data-ocid="contact.link"
              >
                <div className="flex items-center gap-4">
                  <SiInstagram className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Instagram
                  </span>
                </div>
                <span className="font-medium text-sm">
                  {CONTACT_INFO.instagram.handle}
                </span>
              </a>

              {/* TikTok */}
              {CONTACT_INFO.tiktok?.url && CONTACT_INFO.tiktok?.handle && (
                <a
                  href={CONTACT_INFO.tiktok.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-5 hover:text-primary transition-colors"
                  data-ocid="contact.link"
                >
                  <div className="flex items-center gap-4">
                    <SiTiktok className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      TikTok
                    </span>
                  </div>
                  <span className="font-medium text-sm">
                    {CONTACT_INFO.tiktok.handle}
                  </span>
                </a>
              )}
            </div>

            {/* Book link */}
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Ready to book?{" "}
                <a
                  href="/book"
                  className="text-foreground font-medium underline underline-offset-4 hover:text-primary transition-colors"
                >
                  Visit the booking page
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <PageCTABar />
    </div>
  );
}
