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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SPORT_TYPES } from "../constants/photographyOptions";
import { useCreateBookingRequest } from "../hooks/useQueries";

export default function BookingPage() {
  const navigate = useNavigate();
  const createBooking = useCreateBookingRequest();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    additionalNotes: "",
    sportType: "",
    location: "",
    description: "",
    date: "",
    time: "",
  });

  // Pre-fill sport from URL query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sport = params.get("sport");
    if (sport && SPORT_TYPES.some((s) => s.value === sport)) {
      setFormData((prev) => ({ ...prev, sportType: sport }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.sportType ||
      !formData.date ||
      !formData.time
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const sportLabel =
      SPORT_TYPES.find((s) => s.value === formData.sportType)?.label ??
      formData.sportType;

    try {
      await createBooking.mutateAsync({
        client: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          additionalNotes: formData.additionalNotes,
        },
        session: {
          sessionType: "sports",
          location: formData.location,
          description: `Sport: ${sportLabel}${formData.description ? ` | ${formData.description}` : ""}`,
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
          <h1 className="font-serif text-5xl font-bold mb-4">
            Book a Sports Session
          </h1>
          <p className="text-muted-foreground text-lg">
            Request sports photography coverage for your game, match, or
            tournament
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
              Tell us about your sports event and we'll get back to you soon
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
                      data-ocid="booking.input"
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
                      data-ocid="booking.input"
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
                    data-ocid="booking.input"
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
                  <Label htmlFor="sportType">Sport *</Label>
                  <Select
                    value={formData.sportType}
                    onValueChange={(value) => updateField("sportType", value)}
                  >
                    <SelectTrigger id="sportType" data-ocid="booking.select">
                      <SelectValue placeholder="Select a sport" />
                    </SelectTrigger>
                    <SelectContent>
                      {SPORT_TYPES.map((sport) => (
                        <SelectItem key={sport.value} value={sport.value}>
                          {sport.label}
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
                      data-ocid="booking.input"
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
                      data-ocid="booking.input"
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
                    data-ocid="booking.input"
                    value={formData.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    placeholder="Stadium, arena, or field name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Event Description</Label>
                  <Textarea
                    id="description"
                    data-ocid="booking.textarea"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Tell us about the game, match, or tournament..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    data-ocid="booking.textarea"
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
                data-ocid="booking.submit_button"
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
