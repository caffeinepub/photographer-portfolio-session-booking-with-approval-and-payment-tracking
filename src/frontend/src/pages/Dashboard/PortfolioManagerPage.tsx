import { useState } from 'react';
import { useGetAllPortfolioItems, useCreatePortfolioItem, useUpdatePortfolioItem, useDeletePortfolioItem } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { PortfolioItem } from '../../backend';
import { PHOTOGRAPHY_CATEGORIES } from '../../constants/photographyOptions';

export default function PortfolioManagerPage() {
  const { data: portfolioItems = [], isLoading } = useGetAllPortfolioItems();
  const createItem = useCreatePortfolioItem();
  const updateItem = useUpdatePortfolioItem();
  const deleteItem = useDeletePortfolioItem();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: '',
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', imageUrl: '', category: '' });
    setEditingItem(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createItem.mutateAsync(formData);
      toast.success('Portfolio item created successfully');
      setIsCreateOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create portfolio item');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !formData.title || !formData.imageUrl || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await updateItem.mutateAsync({
        id: editingItem.id,
        ...formData,
      });
      toast.success('Portfolio item updated successfully');
      setEditingItem(null);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update portfolio item');
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteItem.mutateAsync(id);
      toast.success('Portfolio item deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete portfolio item');
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
            <h1 className="font-serif text-4xl font-bold mb-2">Portfolio Manager</h1>
            <p className="text-muted-foreground">Add, edit, or remove portfolio items</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>Create Portfolio Item</DialogTitle>
                  <DialogDescription>Add a new sports or concert item to your portfolio</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-title">Title *</Label>
                    <Input
                      id="create-title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Portfolio item title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
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
                    <Label htmlFor="create-imageUrl">Image URL *</Label>
                    <Input
                      id="create-imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-description">Description</Label>
                    <Textarea
                      id="create-description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe this portfolio item..."
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => { setIsCreateOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createItem.isPending}>
                    {createItem.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
                      <CardTitle className="text-lg truncate">{item.title}</CardTitle>
                      <Badge variant="secondary">{item.category}</Badge>
                    </div>
                    <div className="flex gap-1">
                      <Dialog open={editingItem?.id === item.id} onOpenChange={(open) => !open && resetForm()}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <form onSubmit={handleUpdate}>
                            <DialogHeader>
                              <DialogTitle>Edit Portfolio Item</DialogTitle>
                              <DialogDescription>Update the portfolio item details</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-title">Title *</Label>
                                <Input
                                  id="edit-title"
                                  value={formData.title}
                                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-category">Category *</Label>
                                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                  <SelectTrigger id="edit-category">
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
                                <Label htmlFor="edit-imageUrl">Image URL *</Label>
                                <Input
                                  id="edit-imageUrl"
                                  value={formData.imageUrl}
                                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                  id="edit-description"
                                  value={formData.description}
                                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                  rows={4}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="button" variant="outline" onClick={() => { setEditingItem(null); resetForm(); }}>
                                Cancel
                              </Button>
                              <Button type="submit" disabled={updateItem.isPending}>
                                {updateItem.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
                            <AlertDialogTitle>Delete Portfolio Item</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{item.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
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
