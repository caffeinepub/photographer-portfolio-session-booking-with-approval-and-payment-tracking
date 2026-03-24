import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  DollarSign,
  Loader2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { PaymentStatus } from "../../backend";
import {
  useAcceptBooking,
  useConfirmBooking,
  useDenyBooking,
  useGetBookingRequest,
  useSetBookingPrice,
  useUpdatePaymentStatus,
} from "../../hooks/useQueries";

export default function BookingDetailPage() {
  const { id } = useParams({ from: "/dashboard/bookings/$id" });
  const { data: booking, isLoading } = useGetBookingRequest(BigInt(id));

  const acceptBooking = useAcceptBooking();
  const denyBooking = useDenyBooking();
  const confirmBooking = useConfirmBooking();
  const setPriceMutation = useSetBookingPrice();
  const updatePayment = useUpdatePaymentStatus();

  const [notes, setNotes] = useState("");
  const [proposedDateTime, setProposedDateTime] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-serif text-3xl font-bold mb-4">
          Booking Not Found
        </h1>
        <Button asChild variant="outline">
          <Link to="/dashboard/bookings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Link>
        </Button>
      </div>
    );
  }

  const handleAccept = async () => {
    try {
      await acceptBooking.mutateAsync({
        id: booking.id,
        proposedDateTime: proposedDateTime || null,
        notes: notes,
      });
      toast.success("Booking accepted successfully");
      setNotes("");
      setProposedDateTime("");
    } catch (error: any) {
      toast.error(error.message || "Failed to accept booking");
    }
  };

  const handleDeny = async () => {
    if (!notes.trim()) {
      toast.error("Please provide a reason for denial");
      return;
    }
    try {
      await denyBooking.mutateAsync({
        id: booking.id,
        notes: notes,
      });
      toast.success("Booking denied");
      setNotes("");
    } catch (error: any) {
      toast.error(error.message || "Failed to deny booking");
    }
  };

  const handleConfirm = async () => {
    if (!proposedDateTime.trim()) {
      toast.error("Please provide a confirmed date and time");
      return;
    }
    try {
      await confirmBooking.mutateAsync({
        id: booking.id,
        confirmedDateTime: proposedDateTime,
      });
      toast.success("Booking confirmed");
      setProposedDateTime("");
    } catch (error: any) {
      toast.error(error.message || "Failed to confirm booking");
    }
  };

  const handleSetPrice = async () => {
    const priceNum = Number.parseFloat(priceInput);
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    try {
      await setPriceMutation.mutateAsync({
        id: booking.id,
        price: BigInt(Math.round(priceNum * 100)), // Store as cents
      });
      toast.success("Price set successfully");
      setPriceInput("");
    } catch (error: any) {
      toast.error(error.message || "Failed to set price");
    }
  };

  const handleUpdatePayment = async () => {
    if (!paymentStatus) {
      toast.error("Please select a payment status");
      return;
    }
    try {
      await updatePayment.mutateAsync({
        id: booking.id,
        status: paymentStatus as PaymentStatus,
      });
      toast.success("Payment status updated");
      setPaymentStatus("");
    } catch (error: any) {
      toast.error(error.message || "Failed to update payment status");
    }
  };

  const statusVariants: Record<
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

  const statusConfig = statusVariants[booking.status] || {
    variant: "outline",
    label: booking.status,
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button asChild variant="ghost">
          <Link to="/dashboard/bookings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Link>
        </Button>

        <div className="flex items-center justify-between">
          <h1 className="font-serif text-4xl font-bold">Booking Details</h1>
          <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
        </div>

        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{booking.client.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{booking.client.email}</p>
              </div>
              {booking.client.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{booking.client.phone}</p>
                </div>
              )}
            </div>
            {booking.client.additionalNotes && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Additional Notes
                  </p>
                  <p className="text-sm">{booking.client.additionalNotes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Session Details */}
        <Card>
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Session Type</p>
                <p className="font-medium">{booking.session.sessionType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Requested Date & Time
                </p>
                <p className="font-medium">
                  {booking.session.date} at {booking.session.time}
                </p>
              </div>
              {booking.session.location && (
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{booking.session.location}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="font-medium">
                  {new Date(
                    Number(booking.timestamp) / 1000000,
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            {booking.session.description && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Description
                  </p>
                  <p className="text-sm">{booking.session.description}</p>
                </div>
              </>
            )}
            {booking.proposedDateTime && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Proposed/Confirmed Date & Time
                  </p>
                  <p className="font-medium">{booking.proposedDateTime}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Payment Information */}
        {(booking.status === "accepted" || booking.status === "confirmed") && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment Information
              </CardTitle>
              <CardDescription>
                Manage pricing and payment status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Price</p>
                  <p className="font-medium text-lg">
                    {booking.price
                      ? `$${(Number(booking.price) / 100).toFixed(2)}`
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Payment Status
                  </p>
                  <Badge
                    variant={
                      booking.paymentStatus === "paid" ? "default" : "secondary"
                    }
                  >
                    {booking.paymentStatus}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Set Price (USD)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                      placeholder="0.00"
                    />
                    <Button
                      onClick={handleSetPrice}
                      disabled={setPriceMutation.isPending}
                    >
                      {setPriceMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Set"
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentStatus">Update Payment Status</Label>
                  <div className="flex gap-2">
                    <Select
                      value={paymentStatus}
                      onValueChange={setPaymentStatus}
                    >
                      <SelectTrigger id="paymentStatus">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unpaid">Unpaid</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleUpdatePayment}
                      disabled={updatePayment.isPending}
                    >
                      {updatePayment.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Update"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Photographer Notes */}
        {booking.photographerNotes && (
          <Card>
            <CardHeader>
              <CardTitle>Photographer Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{booking.photographerNotes}</p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {booking.status === "pending" && (
          <Card>
            <CardHeader>
              <CardTitle>Respond to Booking</CardTitle>
              <CardDescription>
                Accept or deny this booking request
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="proposedDateTime">
                  Proposed Date & Time (Optional)
                </Label>
                <Input
                  id="proposedDateTime"
                  value={proposedDateTime}
                  onChange={(e) => setProposedDateTime(e.target.value)}
                  placeholder="e.g., Saturday, March 15th at 2:00 PM"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes or reasons..."
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleAccept}
                  disabled={acceptBooking.isPending}
                  className="flex-1"
                >
                  {acceptBooking.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Accept Booking
                </Button>
                <Button
                  onClick={handleDeny}
                  disabled={denyBooking.isPending}
                  variant="destructive"
                  className="flex-1"
                >
                  {denyBooking.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="mr-2 h-4 w-4" />
                  )}
                  Deny Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {booking.status === "accepted" && (
          <Card>
            <CardHeader>
              <CardTitle>Confirm Booking</CardTitle>
              <CardDescription>
                Set the final confirmed date and time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="confirmedDateTime">
                  Confirmed Date & Time *
                </Label>
                <Input
                  id="confirmedDateTime"
                  value={proposedDateTime}
                  onChange={(e) => setProposedDateTime(e.target.value)}
                  placeholder="e.g., Saturday, March 15th at 2:00 PM"
                />
              </div>
              <Button
                onClick={handleConfirm}
                disabled={confirmBooking.isPending}
                className="w-full"
              >
                {confirmBooking.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                Confirm Booking
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
