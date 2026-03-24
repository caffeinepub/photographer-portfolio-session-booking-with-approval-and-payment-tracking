import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

export default function BookingConfirmationPage() {
  return (
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
              Thank you for your interest in our sports and concert photography
              services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-left space-y-4 bg-muted/50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg">What happens next?</h3>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="font-semibold text-foreground">1.</span>
                  <span>
                    We'll review your coverage request and event details
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-foreground">2.</span>
                  <span>
                    You'll receive an email with our availability and pricing
                    quote
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-foreground">3.</span>
                  <span>
                    Once approved, we'll confirm the coverage details and
                    finalize the booking
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-foreground">4.</span>
                  <span>Payment will be arranged after confirmation</span>
                </li>
              </ol>
            </div>

            <p className="text-sm text-muted-foreground">
              We typically respond within 24-48 hours. If you have any urgent
              questions, please contact us directly.
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
  );
}
