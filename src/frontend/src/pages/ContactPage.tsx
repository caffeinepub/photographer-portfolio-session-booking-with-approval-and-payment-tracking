import { CONTACT_INFO } from "@/constants/contactInfo";
import { Mail } from "lucide-react";
import { SiInstagram, SiTiktok } from "react-icons/si";

export default function ContactPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground">
              Ready to capture your next sports event or concert? Let's connect
              and discuss how we can bring your vision to life.
            </p>
          </div>

          {/* About Section */}
          <div className="mb-12">
            <div className="bg-card border rounded-xl p-8">
              <h2 className="font-serif text-2xl font-semibold mb-4">
                About the Photographer
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {CONTACT_INFO.bio}
              </p>
            </div>
          </div>

          {/* Contact Cards */}
          <div className="space-y-6">
            {/* Email Card */}
            <a href={`mailto:${CONTACT_INFO.email}`} className="block group">
              <div className="bg-card border rounded-xl p-8 transition-all hover:shadow-lg hover:border-primary/50">
                <div className="flex items-start space-x-4">
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      Email
                    </h2>
                    <p className="text-muted-foreground mb-3">
                      Send me a message and I'll get back to you within 24
                      hours.
                    </p>
                    <p className="text-lg font-medium text-foreground group-hover:text-primary transition-colors break-all">
                      {CONTACT_INFO.email}
                    </p>
                  </div>
                </div>
              </div>
            </a>

            {/* Instagram Card */}
            <a
              href={CONTACT_INFO.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="bg-card border rounded-xl p-8 transition-all hover:shadow-lg hover:border-primary/50">
                <div className="flex items-start space-x-4">
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <SiInstagram className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      Instagram
                    </h2>
                    <p className="text-muted-foreground mb-3">
                      Follow me for behind-the-scenes content and latest work.
                    </p>
                    <p className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                      {CONTACT_INFO.instagram.handle}
                    </p>
                  </div>
                </div>
              </div>
            </a>

            {/* TikTok Card */}
            {CONTACT_INFO.tiktok?.url && CONTACT_INFO.tiktok?.handle && (
              <a
                href={CONTACT_INFO.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="bg-card border rounded-xl p-8 transition-all hover:shadow-lg hover:border-primary/50">
                  <div className="flex items-start space-x-4">
                    <div className="shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <SiTiktok className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        TikTok
                      </h2>
                      <p className="text-muted-foreground mb-3">
                        Check out my short-form content and creative highlights.
                      </p>
                      <p className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                        {CONTACT_INFO.tiktok.handle}
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              Looking to book a session?{" "}
              <a
                href="/book"
                className="text-primary font-medium hover:underline"
              >
                Visit our booking page
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
