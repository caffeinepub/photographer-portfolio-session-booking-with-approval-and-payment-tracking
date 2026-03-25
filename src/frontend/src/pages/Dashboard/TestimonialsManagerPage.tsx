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
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle, Clock, Plus, Trash2 } from "lucide-react";
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

  const pending = testimonials.filter((t) => !t.approved);
  const approved = testimonials.filter((t) => t.approved);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientName.trim() || !form.quote.trim()) {
      toast.error("Client name and quote are required.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await createTestimonial.mutateAsync({
        clientName: form.clientName.trim(),
        quote: form.quote.trim(),
        sport: form.sport.trim() || null,
      });
      // Auto-approve admin-added testimonials
      if (result && typeof result === "object" && "id" in result) {
        await toggleApproval.mutateAsync((result as any).id);
      }
      toast.success("Testimonial added and published!");
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

  const handleApprove = async (id: bigint) => {
    try {
      await toggleApproval.mutateAsync(id);
      toast.success("Testimonial approved and now live!");
    } catch {
      toast.error("Failed to approve.");
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
            Add a client review directly — it will be published immediately
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
                  data-ocid="testimonial.select"
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
              {submitting ? "Adding..." : "Add & Publish"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <p
          className="text-muted-foreground text-sm"
          data-ocid="testimonials.loading_state"
        >
          Loading...
        </p>
      ) : (
        <>
          {/* Pending Review */}
          <Card className="mb-6 border-amber-200 dark:border-amber-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Clock className="h-5 w-5" />
                Pending Review
                {pending.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                  >
                    {pending.length} pending
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                These were submitted by visitors and need your approval before
                going live
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pending.length === 0 ? (
                <p
                  className="text-muted-foreground text-sm"
                  data-ocid="pending.empty_state"
                >
                  No pending submissions — you&apos;re all caught up!
                </p>
              ) : (
                <div className="space-y-3">
                  {pending.map((t, i) => (
                    <div
                      key={t.id.toString()}
                      data-ocid={`pending.item.${i + 1}`}
                      className="flex items-start gap-4 p-4 border border-amber-200 dark:border-amber-900/50 rounded-lg bg-amber-50/50 dark:bg-amber-950/20"
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
                        </div>
                        <p className="text-sm text-muted-foreground">
                          &ldquo;{t.quote}&rdquo;
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          data-ocid={`pending.confirm_button.${i + 1}`}
                          onClick={() => handleApprove(t.id)}
                          className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Approve
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          data-ocid={`pending.delete_button.${i + 1}`}
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

          {/* Approved */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Approved
                {approved.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {approved.length} live
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                These are currently visible on the homepage
              </CardDescription>
            </CardHeader>
            <CardContent>
              {approved.length === 0 ? (
                <p
                  className="text-muted-foreground text-sm"
                  data-ocid="testimonials.empty_state"
                >
                  No approved testimonials yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {approved.map((t, i) => (
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
                          <Badge variant="default" className="text-xs">
                            Live
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          &ldquo;{t.quote}&rdquo;
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          data-ocid={`testimonials.toggle.${i + 1}`}
                          onClick={() => handleToggle(t.id)}
                          className="text-xs"
                        >
                          Unpublish
                        </Button>
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
        </>
      )}
    </div>
  );
}
