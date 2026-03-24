import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Loader2, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { PortfolioItem } from "../../backend";
import { PHOTOGRAPHY_CATEGORIES } from "../../constants/photographyOptions";
import {
  useCreatePortfolioItem,
  useDeletePortfolioItem,
  useGetAllPortfolioItems,
  useUpdatePortfolioItem,
} from "../../hooks/useQueries";
import { processImageFile } from "../../utils/imageDataUrl";

export default function PortfolioManagerPage() {
  const { data: portfolioItems = [], isLoading } = useGetAllPortfolioItems();
  const createItem = useCreatePortfolioItem();
  const updateItem = useUpdatePortfolioItem();
  const deleteItem = useDeletePortfolioItem();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFormData({ title: "", description: "", imageUrl: "", category: "" });
    setImagePreview("");
    setEditingItem(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (editFileInputRef.current) editFileInputRef.current.value = "";
  };

  const handleFileSelect = async (file: File, isEdit = false) => {
    setIsProcessingImage(true);
    try {
      const dataUrl = await processImageFile(file);
      setFormData({ ...formData, imageUrl: dataUrl });
      setImagePreview(dataUrl);
      toast.success("Image loaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to process image");
      if (isEdit && editFileInputRef.current) {
        editFileInputRef.current.value = "";
      } else if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit = false,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file, isEdit);
    }
  };

  const clearImage = () => {
    setFormData({ ...formData, imageUrl: "" });
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (editFileInputRef.current) editFileInputRef.current.value = "";
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createItem.mutateAsync(formData);
      toast.success("Portfolio item created successfully");
      setIsCreateOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to create portfolio item");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !editingItem ||
      !formData.title ||
      !formData.imageUrl ||
      !formData.category
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await updateItem.mutateAsync({
        id: editingItem.id,
        ...formData,
      });
      toast.success("Portfolio item updated successfully");
      setEditingItem(null);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to update portfolio item");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteItem.mutateAsync(id);
      toast.success("Portfolio item deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete portfolio item");
    }
  };

  const openEditDialog = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      category: item.category,
    });
    setImagePreview(item.imageUrl);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold mb-2">
              Portfolio Manager
            </h1>
            <p className="text-muted-foreground">
              Add, edit, or remove portfolio items
            </p>
          </div>
          <Dialog
            open={isCreateOpen}
            onOpenChange={(open) => {
              setIsCreateOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>Create Portfolio Item</DialogTitle>
                  <DialogDescription>
                    Add a new sports or concert item to your portfolio
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-title">Title *</Label>
                    <Input
                      id="create-title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Portfolio item title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger id="create-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {PHOTOGRAPHY_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-image-upload">Image *</Label>
                    <p className="text-xs text-muted-foreground">
                      Upload an image (JPEG, PNG, GIF, or WebP, max 5MB) or
                      enter an image URL below
                    </p>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isProcessingImage}
                          className="flex-1"
                        >
                          {isProcessingImage ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Choose File
                            </>
                          )}
                        </Button>
                        {imagePreview && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={clearImage}
                            disabled={isProcessingImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={(e) => handleFileInputChange(e, false)}
                        className="hidden"
                      />
                      {imagePreview && (
                        <div className="border rounded-lg overflow-hidden">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                            Or
                          </span>
                        </div>
                      </div>
                      <Input
                        id="create-imageUrl"
                        value={formData.imageUrl}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            imageUrl: e.target.value,
                          });
                          setImagePreview(e.target.value);
                        }}
                        placeholder="https://example.com/image.jpg"
                        disabled={isProcessingImage}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-description">Description</Label>
                    <Textarea
                      id="create-description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe this portfolio item..."
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createItem.isPending || isProcessingImage}
                  >
                    {createItem.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Create
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {portfolioItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No portfolio items yet. Click "Add Item" to create your first one.
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
              <Card key={item.id.toString()} className="overflow-hidden">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">
                        {item.title}
                      </CardTitle>
                      <Badge variant="secondary">{item.category}</Badge>
                    </div>
                    <div className="flex gap-1">
                      <Dialog
                        open={editingItem?.id === item.id}
                        onOpenChange={(open) => !open && resetForm()}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <form onSubmit={handleUpdate}>
                            <DialogHeader>
                              <DialogTitle>Edit Portfolio Item</DialogTitle>
                              <DialogDescription>
                                Update the portfolio item details
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-title">Title *</Label>
                                <Input
                                  id="edit-title"
                                  value={formData.title}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      title: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-category">
                                  Category *
                                </Label>
                                <Select
                                  value={formData.category}
                                  onValueChange={(value) =>
                                    setFormData({
                                      ...formData,
                                      category: value,
                                    })
                                  }
                                >
                                  <SelectTrigger id="edit-category">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {PHOTOGRAPHY_CATEGORIES.map((cat) => (
                                      <SelectItem
                                        key={cat.value}
                                        value={cat.value}
                                      >
                                        {cat.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-image-upload">
                                  Image *
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  Upload a new image (JPEG, PNG, GIF, or WebP,
                                  max 5MB) or update the image URL below
                                </p>
                                <div className="space-y-3">
                                  <div className="flex gap-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() =>
                                        editFileInputRef.current?.click()
                                      }
                                      disabled={isProcessingImage}
                                      className="flex-1"
                                    >
                                      {isProcessingImage ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Processing...
                                        </>
                                      ) : (
                                        <>
                                          <Upload className="mr-2 h-4 w-4" />
                                          Choose File
                                        </>
                                      )}
                                    </Button>
                                    {imagePreview && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={clearImage}
                                        disabled={isProcessingImage}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                  <input
                                    ref={editFileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                    onChange={(e) =>
                                      handleFileInputChange(e, true)
                                    }
                                    className="hidden"
                                  />
                                  {imagePreview && (
                                    <div className="border rounded-lg overflow-hidden">
                                      <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-48 object-cover"
                                      />
                                    </div>
                                  )}
                                  <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                      <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                      <span className="bg-background px-2 text-muted-foreground">
                                        Or
                                      </span>
                                    </div>
                                  </div>
                                  <Input
                                    id="edit-imageUrl"
                                    value={formData.imageUrl}
                                    onChange={(e) => {
                                      setFormData({
                                        ...formData,
                                        imageUrl: e.target.value,
                                      });
                                      setImagePreview(e.target.value);
                                    }}
                                    placeholder="https://example.com/image.jpg"
                                    disabled={isProcessingImage}
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-description">
                                  Description
                                </Label>
                                <Textarea
                                  id="edit-description"
                                  value={formData.description}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      description: e.target.value,
                                    })
                                  }
                                  rows={4}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setEditingItem(null);
                                  resetForm();
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                disabled={
                                  updateItem.isPending || isProcessingImage
                                }
                              >
                                {updateItem.isPending ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : null}
                                Update
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Portfolio Item
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{item.title}"?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                {item.description && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
