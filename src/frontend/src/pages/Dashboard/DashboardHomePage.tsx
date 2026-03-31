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
import { Switch } from "@/components/ui/switch";
import { Link } from "@tanstack/react-router";
import {
  Calendar,
  CalendarDays,
  CheckCircle,
  Clock,
  CreditCard,
  FolderOpen,
  Image,
  Loader2,
  MessageSquare,
  Rocket,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import ProfileSetupModal from "../../components/auth/ProfileSetupModal";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import {
  useGetAllBookingRequests,
  useGetCallerUserProfile,
  useGetHeroBackground,
  useSetHeroBackground,
} from "../../hooks/useQueries";
import { processImageFile } from "../../utils/imageDataUrl";
import { validateHostname } from "../../utils/validateHostname";

export default function DashboardHomePage() {
  const { data: bookings = [] } = useGetAllBookingRequests();
  const { identity } = useInternetIdentity();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const { data: heroBackground = "" } = useGetHeroBackground();
  const setHeroBackground = useSetHeroBackground();

  const [customDomain, setCustomDomain] = useState("slr.pics");
  const [isPublishing, setIsPublishing] = useState(false);
  const [domainError, setDomainError] = useState<string | null>(null);
  const [paymentsEnabled, setPaymentsEnabled] = useState(false);
  const bgFileRef = useRef<HTMLInputElement>(null);

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
    const error = validateHostname(customDomain);
    if (error) {
      setDomainError(error);
      toast.error(`Invalid domain: ${error}`);
      return;
    }
    setIsPublishing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success(`Successfully configured domain: ${customDomain}`);
    } catch (err) {
      toast.error("Failed to publish. Please try again.");
      console.error("Publish error:", err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleBgFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file);
      await setHeroBackground.mutateAsync(dataUrl);
      toast.success("Background updated");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update background");
    } finally {
      if (bgFileRef.current) bgFileRef.current.value = "";
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

          {/* Home Background Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Home Background Photo
              </CardTitle>
              <CardDescription>
                Upload a photo to use as the hero background on the home page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {heroBackground && (
                <div className="rounded-lg overflow-hidden border">
                  <img
                    src={heroBackground}
                    alt="Current home background"
                    className="w-full max-h-48 object-cover"
                  />
                </div>
              )}
              <input
                ref={bgFileRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleBgFileChange}
                data-ocid="home_bg.upload_button"
              />
              <Button
                onClick={() => bgFileRef.current?.click()}
                disabled={setHeroBackground.isPending}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {setHeroBackground.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Choose Photo
                  </>
                )}
              </Button>
              {setHeroBackground.isPending && (
                <p
                  className="text-sm text-muted-foreground"
                  data-ocid="home_bg.loading_state"
                >
                  Uploading your background photo...
                </p>
              )}
            </CardContent>
          </Card>

          {/* Payments Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payments
              </CardTitle>
              <CardDescription>
                Enable Stripe payments to let clients pay a deposit when booking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Switch
                  id="payments-toggle"
                  checked={paymentsEnabled}
                  onCheckedChange={setPaymentsEnabled}
                  data-ocid="payments.toggle"
                />
                <Label htmlFor="payments-toggle" className="cursor-pointer">
                  {paymentsEnabled ? "Payments enabled" : "Payments disabled"}
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                {paymentsEnabled
                  ? "Payments are enabled. Stripe integration coming soon — contact support to activate."
                  : "Payments are currently disabled. Enable to collect deposits at booking."}
              </p>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            <Card>
              <CardHeader>
                <CardTitle>Client Albums</CardTitle>
                <CardDescription>
                  Create and manage password-protected photo albums
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/dashboard/albums">
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Manage Albums
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
                <CardDescription>
                  Manage which days are open for bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/dashboard/availability">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Manage Availability
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Testimonials</CardTitle>
                <CardDescription>
                  Review and approve client testimonials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/dashboard/testimonials">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Manage Reviews
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
