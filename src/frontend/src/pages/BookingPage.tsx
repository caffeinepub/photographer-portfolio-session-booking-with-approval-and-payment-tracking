import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { Info, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SESSION_TYPES } from "../constants/photographyOptions";
import { useCreateBookingRequest } from "../hooks/useQueries";

export default function BookingPage() {
  const navigate = useNavigate();
  const createBooking = useCreateBookingRequest();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    additionalNotes: "",
    sessionType: "",
    location: "",
    description: "",
    date: "",
    time: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.sessionType ||
      !formData.date ||
      !formData.time
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!SESSION_TYPES.some((type) => type.value === formData.sessionType)) {
      toast.error("Please select a valid session type (Sports or Concert)");
      return;
    }

    try {
      await createBooking.mutateAsync({
        client: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          additionalNotes: formData.additionalNotes,
        },
        session: {
          sessionType: formData.sessionType,
          location: formData.location,
          description: formData.description,
          date: formData.date,
          time: formData.time,
        },
      });

      toast.success("Booking request submitted successfully!");
      navigate({ to: "/book/confirmation" });
    } catch (error: any) {
      toast.error(error.message || "Failed to submit booking request");
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold mb-4">Book Coverage</h1>
          <p className="text-muted-foreground text-lg">
            Request sports or concert photography coverage for your event
          </p>
        </div>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertDescription>
            This is a coverage request. Payment will be handled after your
            booking is approved by the photographer.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Coverage Details</CardTitle>
            <CardDescription>
              Tell us about your sports event or concert and we'll get back to
              you soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Contact Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              {/* Session Details */}
              <div className="space-y-4 pt-6 border-t">
                <h3 className="font-semibold text-lg">Coverage Details</h3>
                <div className="space-y-2">
                  <Label htmlFor="sessionType">Coverage Type *</Label>
                  <Select
                    value={formData.sessionType}
                    onValueChange={(value) => updateField("sessionType", value)}
                  >
                    <SelectTrigger id="sessionType">
                      <SelectValue placeholder="Select coverage type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SESSION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Event Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => updateField("date", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Event Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => updateField("time", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Venue/Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    placeholder="Stadium, arena, or venue name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Event Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Tell us about the game, match, tournament, concert, or performance..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={(e) =>
                      updateField("additionalNotes", e.target.value)
                    }
                    placeholder="Any specific shots or moments you want captured?"
                    rows={3}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={createBooking.isPending}
                className="w-full"
                size="lg"
              >
                {createBooking.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Coverage Request"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
