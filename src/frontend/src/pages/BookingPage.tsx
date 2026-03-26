import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  DollarSign,
  Info,
  Loader2,
  Mail,
  MessageCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CONTACT_INFO } from "../constants/contactInfo";
import { SPORT_TYPES } from "../constants/photographyOptions";
import { useCreateBookingRequest } from "../hooks/useQueries";

const DM_VALUE = "DM on Instagram (@_slr.pics_)";

const STEPS = [
  { number: 1, label: "Your Info" },
  { number: 2, label: "Event Details" },
  { number: 3, label: "Review" },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div
      className="flex items-center justify-center mb-10"
      data-ocid="booking.section"
    >
      {STEPS.map((step, idx) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-200 ${
                step.number < currentStep
                  ? "bg-foreground border-foreground text-background"
                  : step.number === currentStep
                    ? "bg-background border-foreground text-foreground shadow-sm"
                    : "bg-background border-border text-muted-foreground"
              }`}
            >
              {step.number < currentStep ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : step.number === currentStep ? (
                <Circle className="w-4 h-4 fill-foreground" />
              ) : (
                <span>{step.number}</span>
              )}
            </div>
            <span
              className={`text-xs font-medium ${
                step.number === currentStep
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div
              className={`h-px w-16 sm:w-24 mx-2 mb-5 transition-all duration-200 ${
                step.number < currentStep ? "bg-foreground" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
      <span className="text-sm font-medium text-muted-foreground min-w-[140px]">
        {label}
      </span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}

export default function BookingPage() {
  const navigate = useNavigate();
  const createBooking = useCreateBookingRequest();
  const [currentStep, setCurrentStep] = useState(1);

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
    contactPreference: "Email",
    instagramHandle: "",
  });

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

    if (
      formData.contactPreference === DM_VALUE &&
      !formData.instagramHandle.trim()
    ) {
      toast.error("Please enter your Instagram handle");
      return;
    }

    const sportLabel =
      SPORT_TYPES.find((s) => s.value === formData.sportType)?.label ??
      formData.sportType;

    let notesWithContact = formData.additionalNotes
      ? `${formData.additionalNotes} | Contact via: ${formData.contactPreference}`
      : `Contact via: ${formData.contactPreference}`;

    if (
      formData.contactPreference === DM_VALUE &&
      formData.instagramHandle.trim()
    ) {
      notesWithContact += ` | Instagram: ${formData.instagramHandle.trim()}`;
    }

    try {
      await createBooking.mutateAsync({
        client: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          additionalNotes: notesWithContact,
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

  const handleNextStep1 = () => {
    if (!formData.name || !formData.email) {
      toast.error("Please fill in your name and email");
      return;
    }
    if (
      formData.contactPreference === DM_VALUE &&
      !formData.instagramHandle.trim()
    ) {
      toast.error("Please enter your Instagram handle");
      return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextStep2 = () => {
    if (!formData.sportType || !formData.date || !formData.time) {
      toast.error("Please fill in the sport, date, and time");
      return;
    }
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sportLabel =
    SPORT_TYPES.find((s) => s.value === formData.sportType)?.label ??
    formData.sportType;

  const formatTime = (t: string) => {
    if (!t) return "";
    const [h, m] = t.split(":");
    const hour = Number.parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    return `${hour % 12 || 12}:${m} ${ampm}`;
  };

  const formatDate = (d: string) => {
    if (!d) return "";
    const [y, mo, day] = d.split("-");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[Number.parseInt(mo) - 1]} ${Number.parseInt(day)}, ${y}`;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-serif text-5xl font-bold mb-4">
            Book a Sports Session
          </h1>
          <p className="text-muted-foreground text-lg">
            Request sports photography coverage for your game, match, or
            tournament
          </p>
        </div>

        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            This is a coverage request. Payment will be handled after your
            booking is approved by the photographer.
          </AlertDescription>
        </Alert>

        {/* Other Sessions Inquiry Note */}
        <div className="mb-6 rounded-xl border border-border/60 bg-muted/30 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border/40 bg-muted/50">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Other Sessions
            </span>
          </div>
          <div className="px-5 py-4">
            <p className="text-sm text-foreground/80 leading-relaxed mb-4">
              This booking form is for{" "}
              <span className="font-semibold text-foreground">
                sports sessions only
              </span>
              . For concerts, events, or any other type of photography, reach
              out directly and we'll get you sorted.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/60 bg-background hover:bg-muted/60 transition-colors text-sm font-medium text-foreground"
              >
                <Mail className="h-4 w-4 text-muted-foreground" />
                {CONTACT_INFO.email}
              </a>
              <a
                href={CONTACT_INFO.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/60 bg-background hover:bg-muted/60 transition-colors text-sm font-medium text-foreground"
              >
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                DM on Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Pricing Badge */}
        <div className="flex items-center justify-center mb-8">
          <Badge
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-700"
            variant="outline"
            data-ocid="booking.card"
          >
            <DollarSign className="h-4 w-4" />
            Sports sessions start at $20
          </Badge>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        <Card>
          {/* Step 1 — Your Info */}
          {currentStep === 1 && (
            <>
              <CardHeader>
                <CardTitle>Your Info</CardTitle>
                <CardDescription>
                  Tell us how to reach you after your request is reviewed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      data-ocid="booking.input"
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      data-ocid="booking.input"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number{" "}
                    <span className="text-muted-foreground text-xs">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="phone"
                    data-ocid="booking.input"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Preferred Contact Method</Label>
                  <RadioGroup
                    value={formData.contactPreference}
                    onValueChange={(value) =>
                      updateField("contactPreference", value)
                    }
                    className="space-y-2"
                    data-ocid="booking.radio"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Email" id="contact-email" />
                      <Label
                        htmlFor="contact-email"
                        className="cursor-pointer font-normal"
                      >
                        Email
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Text Message" id="contact-text" />
                      <Label
                        htmlFor="contact-text"
                        className="cursor-pointer font-normal"
                      >
                        Text Message
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={DM_VALUE} id="contact-dm" />
                      <Label
                        htmlFor="contact-dm"
                        className="cursor-pointer font-normal"
                      >
                        DM on Instagram (@_slr.pics_)
                      </Label>
                    </div>
                  </RadioGroup>

                  {formData.contactPreference === DM_VALUE && (
                    <div className="space-y-2 pl-1 pt-1">
                      <Label htmlFor="instagramHandle">
                        Your Instagram Handle{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="instagramHandle"
                        data-ocid="booking.input"
                        value={formData.instagramHandle}
                        onChange={(e) =>
                          updateField("instagramHandle", e.target.value)
                        }
                        placeholder="@yourusername"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="button"
                    data-ocid="booking.primary_button"
                    onClick={handleNextStep1}
                    className="gap-2"
                    size="lg"
                  >
                    Next: Event Details
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 2 — Event Details */}
          {currentStep === 2 && (
            <>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>
                  Tell us about the sports event you want covered
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="sportType">
                    Sport <span className="text-destructive">*</span>
                  </Label>
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
                    <Label htmlFor="date">
                      Event Date <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="date"
                      data-ocid="booking.input"
                      type="date"
                      value={formData.date}
                      onChange={(e) => updateField("date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">
                      Event Time <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="time"
                      data-ocid="booking.input"
                      type="time"
                      value={formData.time}
                      onChange={(e) => updateField("time", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">
                    Venue / Location{" "}
                    <span className="text-muted-foreground text-xs">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="location"
                    data-ocid="booking.input"
                    value={formData.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    placeholder="Stadium, arena, or field name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Event Description{" "}
                    <span className="text-muted-foreground text-xs">
                      (optional)
                    </span>
                  </Label>
                  <Textarea
                    id="description"
                    data-ocid="booking.textarea"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Tell us about the game, match, or tournament..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">
                    Additional Notes{" "}
                    <span className="text-muted-foreground text-xs">
                      (optional)
                    </span>
                  </Label>
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

                <div className="pt-2 flex items-center justify-between">
                  <Button
                    type="button"
                    data-ocid="booking.secondary_button"
                    variant="outline"
                    onClick={() => goBack(1)}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    data-ocid="booking.primary_button"
                    onClick={handleNextStep2}
                    className="gap-2"
                    size="lg"
                  >
                    Review Request
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3 — Review & Submit */}
          {currentStep === 3 && (
            <>
              <CardHeader>
                <CardTitle>Review Your Request</CardTitle>
                <CardDescription>
                  Double-check everything before submitting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Your Info Summary */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Your Info
                    </h3>
                    <div className="rounded-lg border border-border/60 bg-muted/20 px-5 py-4 space-y-3">
                      <SummaryRow label="Full Name" value={formData.name} />
                      <SummaryRow label="Email" value={formData.email} />
                      {formData.phone && (
                        <SummaryRow label="Phone" value={formData.phone} />
                      )}
                      <SummaryRow
                        label="Contact Preference"
                        value={formData.contactPreference}
                      />
                      {formData.contactPreference === DM_VALUE &&
                        formData.instagramHandle && (
                          <SummaryRow
                            label="Instagram"
                            value={formData.instagramHandle}
                          />
                        )}
                    </div>
                  </div>

                  <Separator />

                  {/* Event Details Summary */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Event Details
                    </h3>
                    <div className="rounded-lg border border-border/60 bg-muted/20 px-5 py-4 space-y-3">
                      <SummaryRow label="Sport" value={sportLabel} />
                      <SummaryRow
                        label="Date"
                        value={formatDate(formData.date)}
                      />
                      <SummaryRow
                        label="Time"
                        value={formatTime(formData.time)}
                      />
                      {formData.location && (
                        <SummaryRow
                          label="Venue / Location"
                          value={formData.location}
                        />
                      )}
                      {formData.description && (
                        <SummaryRow
                          label="Description"
                          value={formData.description}
                        />
                      )}
                      {formData.additionalNotes && (
                        <SummaryRow
                          label="Additional Notes"
                          value={formData.additionalNotes}
                        />
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <Button
                      type="button"
                      data-ocid="booking.secondary_button"
                      variant="outline"
                      onClick={() => goBack(2)}
                      className="gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      data-ocid="booking.submit_button"
                      disabled={createBooking.isPending}
                      size="lg"
                      className="gap-2"
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
                  </div>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
