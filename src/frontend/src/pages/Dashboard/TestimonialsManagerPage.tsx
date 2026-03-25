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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateTestimonial,
  useDeleteTestimonial,
  useGetAllTestimonials,
  useToggleTestimonialApproval,
} from "../../hooks/useQueries";

export default function TestimonialsManagerPage() {
  const { data: testimonials = [], isLoading } = useGetAllTestimonials();
  const createTestimonial = useCreateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();
  const toggleApproval = useToggleTestimonialApproval();

  const [form, setForm] = useState({ clientName: "", quote: "", sport: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientName.trim() || !form.quote.trim()) {
      toast.error("Client name and quote are required.");
      return;
    }
    setSubmitting(true);
    try {
      await createTestimonial.mutateAsync({
        clientName: form.clientName.trim(),
        quote: form.quote.trim(),
        sport: form.sport.trim() || null,
      });
      toast.success("Testimonial added!");
      setForm({ clientName: "", quote: "", sport: "" });
    } catch {
      toast.error("Failed to add testimonial.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await deleteTestimonial.mutateAsync(id);
      toast.success("Testimonial deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  const handleToggle = async (id: bigint) => {
    try {
      await toggleApproval.mutateAsync(id);
    } catch {
      toast.error("Failed to update approval.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="ghost" size="sm">
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-serif font-bold">Testimonials</h1>
          <p className="text-muted-foreground text-sm">
            Manage client reviews shown on the homepage
          </p>
        </div>
      </div>

      {/* Add Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" /> Add Testimonial
          </CardTitle>
          <CardDescription>
            Add a new client review to your homepage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="clientName">Client Name *</Label>
                <Input
                  id="clientName"
                  data-ocid="testimonial.input"
                  value={form.clientName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, clientName: e.target.value }))
                  }
                  placeholder="e.g. Marcus Johnson"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sport">Sport (optional)</Label>
                <Input
                  id="sport"
                  data-ocid="testimonial.input"
                  value={form.sport}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, sport: e.target.value }))
                  }
                  placeholder="e.g. Baseball"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="quote">Quote *</Label>
              <Textarea
                id="quote"
                data-ocid="testimonial.textarea"
                value={form.quote}
                onChange={(e) =>
                  setForm((p) => ({ ...p, quote: e.target.value }))
                }
                placeholder="What did the client say about your work?"
                rows={3}
              />
            </div>
            <Button
              type="submit"
              data-ocid="testimonial.submit_button"
              disabled={submitting}
            >
              {submitting ? "Adding..." : "Add Testimonial"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle>All Testimonials</CardTitle>
          <CardDescription>
            Toggle approval to show/hide on the homepage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p
              className="text-muted-foreground text-sm"
              data-ocid="testimonials.loading_state"
            >
              Loading...
            </p>
          ) : testimonials.length === 0 ? (
            <p
              className="text-muted-foreground text-sm"
              data-ocid="testimonials.empty_state"
            >
              No testimonials yet. Add one above.
            </p>
          ) : (
            <div className="space-y-4">
              {testimonials.map((t, i) => (
                <div
                  key={t.id.toString()}
                  data-ocid={`testimonials.item.${i + 1}`}
                  className="flex items-start gap-4 p-4 border border-border rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        {t.clientName}
                      </span>
                      {t.sport && (
                        <Badge
                          variant="secondary"
                          className="text-xs capitalize"
                        >
                          {t.sport}
                        </Badge>
                      )}
                      <Badge
                        variant={t.approved ? "default" : "outline"}
                        className="text-xs"
                      >
                        {t.approved ? "Live" : "Hidden"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {t.approved ? "On" : "Off"}
                      </span>
                      <Switch
                        data-ocid={`testimonials.switch.${i + 1}`}
                        checked={t.approved}
                        onCheckedChange={() => handleToggle(t.id)}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      data-ocid={`testimonials.delete_button.${i + 1}`}
                      onClick={() => handleDelete(t.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
