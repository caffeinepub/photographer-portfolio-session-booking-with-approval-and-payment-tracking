import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import type { BookingRequest } from "../../backend";
import { useGetAllBookingRequests } from "../../hooks/useQueries";

function BookingStatusBadge({ status }: { status: string }) {
  const variants: Record<
    string,
    {
      variant: "default" | "secondary" | "destructive" | "outline";
      label: string;
    }
  > = {
    pending: { variant: "secondary", label: "Pending" },
    accepted: { variant: "default", label: "Accepted" },
    confirmed: { variant: "default", label: "Confirmed" },
    denied: { variant: "destructive", label: "Denied" },
  };

  const config = variants[status] || { variant: "outline", label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function BookingCard({ booking }: { booking: BookingRequest }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{booking.client.name}</CardTitle>
            <CardDescription>{booking.client.email}</CardDescription>
          </div>
          <BookingStatusBadge status={booking.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Session Type</p>
            <p className="font-medium">{booking.session.sessionType}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Requested Date</p>
            <p className="font-medium">
              {booking.session.date} at {booking.session.time}
            </p>
          </div>
          {booking.session.location && (
            <div>
              <p className="text-muted-foreground">Location</p>
              <p className="font-medium">{booking.session.location}</p>
            </div>
          )}
          <div>
            <p className="text-muted-foreground">Submitted</p>
            <p className="font-medium">
              {new Date(
                Number(booking.timestamp) / 1000000,
              ).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Button asChild className="w-full">
          <Link
            to="/dashboard/bookings/$id"
            params={{ id: booking.id.toString() }}
          >
            View Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function BookingsListPage() {
  const { data: bookings = [], isLoading } = useGetAllBookingRequests();

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const acceptedBookings = bookings.filter(
    (b) => b.status === "accepted" || b.status === "confirmed",
  );
  const deniedBookings = bookings.filter((b) => b.status === "denied");

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="font-serif text-4xl font-bold mb-2">Bookings</h1>
          <p className="text-muted-foreground">
            Manage all your client booking requests
          </p>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({pendingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Accepted ({acceptedBookings.length})
            </TabsTrigger>
            <TabsTrigger value="denied">
              Denied ({deniedBookings.length})
            </TabsTrigger>
            <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No pending booking requests
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {pendingBookings.map((booking) => (
                  <BookingCard key={booking.id.toString()} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-4">
            {acceptedBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No accepted bookings
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {acceptedBookings.map((booking) => (
                  <BookingCard key={booking.id.toString()} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="denied" className="space-y-4">
            {deniedBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No denied bookings
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {deniedBookings.map((booking) => (
                  <BookingCard key={booking.id.toString()} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {bookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No bookings yet
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {bookings.map((booking) => (
                  <BookingCard key={booking.id.toString()} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
