import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { Check, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  useDeleteTestimonial,
  useGetAllTestimonials,
  useToggleTestimonialApproval,
} from "../../hooks/useQueries";

export default function TestimonialsManagerPage() {
  const { data: testimonials = [], isLoading } = useGetAllTestimonials();
  const toggleApproval = useToggleTestimonialApproval();
  const deleteTestimonial = useDeleteTestimonial();

  const handleToggle = async (id: bigint) => {
    try {
      await toggleApproval.mutateAsync(id);
      toast.success("Updated");
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteTestimonial.mutateAsync(id);
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold mb-1">Testimonials</h1>
            <p className="text-muted-foreground text-sm">
              Approve or remove client reviews
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard">Back</Link>
          </Button>
        </div>

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
            No testimonials yet.
          </p>
        ) : (
          <div className="space-y-4" data-ocid="testimonials.list">
            {testimonials.map((t, index) => (
              <Card
                key={t.id.toString()}
                data-ocid={`testimonials.item.${index + 1}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-base font-semibold">
                      {t.clientName}
                    </CardTitle>
                    <Badge variant={t.approved ? "default" : "secondary"}>
                      {t.approved ? "Published" : "Pending"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    "{t.quote}"
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={t.approved ? "outline" : "default"}
                      onClick={() => handleToggle(t.id)}
                      disabled={toggleApproval.isPending}
                      data-ocid={`testimonials.toggle.${index + 1}`}
                    >
                      {t.approved ? (
                        <>
                          <X className="h-3 w-3 mr-1" /> Unpublish
                        </>
                      ) : (
                        <>
                          <Check className="h-3 w-3 mr-1" /> Approve
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(t.id)}
                      disabled={deleteTestimonial.isPending}
                      data-ocid={`testimonials.delete_button.${index + 1}`}
                    >
                      <Trash2 className="h-3 w-3 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
