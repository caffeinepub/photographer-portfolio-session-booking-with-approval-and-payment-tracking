import PageCTABar from "@/components/PageCTABar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Instagram, MessageCircle, Phone } from "lucide-react";

export default function BookingConfirmationPage() {
  return (
    <div>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-3xl font-serif">
                Coverage Request Received!
              </CardTitle>
              <CardDescription className="text-base">
                Thank you for your interest in sports photography coverage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-left space-y-4 bg-muted/50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg">What happens next?</h3>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="font-semibold text-foreground">1.</span>
                    <span>
                      Your request has been submitted — Slade will review your
                      event details shortly
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-foreground">2.</span>
                    <span>
                      Expect a reply via text or DM on Instagram, typically
                      within 24 hours
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-foreground">3.</span>
                    <span>
                      Once details are confirmed, your session will be locked in
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-foreground">4.</span>
                    <span>
                      Session pricing starts at $20 — final quote discussed at
                      confirmation
                    </span>
                  </li>
                </ol>
              </div>

              {/* Contact Methods */}
              <div className="grid sm:grid-cols-2 gap-4">
                <a
                  href="tel:225-910-2426"
                  className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Text / Call</p>
                    <p className="font-medium text-sm">225-910-2426</p>
                  </div>
                </a>
                <a
                  href="https://www.instagram.com/_slr.pics_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Instagram className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">
                      Instagram DM
                    </p>
                    <p className="font-medium text-sm">@_slr.pics_</p>
                  </div>
                </a>
              </div>

              <p className="text-sm text-muted-foreground">
                Questions in the meantime? Feel free to text or DM — Slade
                typically responds quickly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild variant="default">
                  <Link to="/">Return Home</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/portfolio">View Portfolio</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <PageCTABar />
    </div>
  );
}
