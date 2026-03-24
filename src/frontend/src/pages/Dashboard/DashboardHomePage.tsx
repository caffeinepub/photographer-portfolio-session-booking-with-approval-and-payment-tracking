import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";
import { Calendar, CheckCircle, Clock, Image, Rocket } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ProfileSetupModal from "../../components/auth/ProfileSetupModal";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useGetAllBookingRequests } from "../../hooks/useQueries";
import { useGetCallerUserProfile } from "../../hooks/useQueries";
import { validateHostname } from "../../utils/validateHostname";

export default function DashboardHomePage() {
  const { data: bookings = [] } = useGetAllBookingRequests();
  const { identity } = useInternetIdentity();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const [customDomain, setCustomDomain] = useState("slr.pics");
  const [isPublishing, setIsPublishing] = useState(false);
  const [domainError, setDomainError] = useState<string | null>(null);

  const isAuthenticated = !!identity;
  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const acceptedCount = bookings.filter(
    (b) => b.status === "accepted" || b.status === "confirmed",
  ).length;

  const handleDomainChange = (value: string) => {
    setCustomDomain(value);
    const error = validateHostname(value);
    setDomainError(error);
  };

  const handlePublish = async () => {
    // Validate hostname before publishing
    const error = validateHostname(customDomain);
    if (error) {
      setDomainError(error);
      toast.error(`Invalid domain: ${error}`);
      return;
    }

    setIsPublishing(true);
    try {
      // Simulate publish action - in a real app, this would call a backend API
      // For now, we'll just show a success message
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success(`Successfully configured domain: ${customDomain}`);
    } catch (error) {
      toast.error("Failed to publish. Please try again.");
      console.error("Publish error:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <>
      <ProfileSetupModal open={showProfileSetup} />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="font-serif text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your bookings and portfolio
            </p>
          </div>

          {/* Publish Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                Publish to Production
              </CardTitle>
              <CardDescription>
                Configure your custom domain and publish your site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customDomain">Custom Domain</Label>
                <Input
                  id="customDomain"
                  type="text"
                  placeholder="example.com"
                  value={customDomain}
                  onChange={(e) => handleDomainChange(e.target.value)}
                  className={domainError ? "border-destructive" : ""}
                />
                {domainError && (
                  <p className="text-sm text-destructive">{domainError}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Enter your custom domain (e.g., slr.pics, example.com,
                  my-site.photography)
                </p>
              </div>
              <Button
                onClick={handlePublish}
                disabled={isPublishing || !!domainError}
                className="w-full sm:w-auto"
              >
                {isPublishing ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-4 w-4" />
                    Publish to Production
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Requests
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Accepted Sessions
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{acceptedCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Bookings
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bookings.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Portfolio Items
                </CardTitle>
                <Image className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Bookings</CardTitle>
                <CardDescription>
                  Review and respond to client booking requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/dashboard/bookings">
                    <Calendar className="mr-2 h-4 w-4" />
                    View All Bookings
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manage Portfolio</CardTitle>
                <CardDescription>
                  Add, edit, or remove portfolio items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/dashboard/portfolio">
                    <Image className="mr-2 h-4 w-4" />
                    Manage Portfolio
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Bookings */}
          {pendingCount > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
                <CardDescription>
                  {pendingCount} booking{pendingCount !== 1 ? "s" : ""} awaiting
                  your response
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bookings
                    .filter((b) => b.status === "pending")
                    .slice(0, 3)
                    .map((booking) => (
                      <div
                        key={booking.id.toString()}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{booking.client.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.session.sessionType} •{" "}
                            {booking.session.date}
                          </p>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link
                            to="/dashboard/bookings/$id"
                            params={{ id: booking.id.toString() }}
                          >
                            Review
                          </Link>
                        </Button>
                      </div>
                    ))}
                </div>
                {pendingCount > 3 && (
                  <Button asChild variant="ghost" className="w-full mt-4">
                    <Link to="/dashboard/bookings">View All Pending</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
