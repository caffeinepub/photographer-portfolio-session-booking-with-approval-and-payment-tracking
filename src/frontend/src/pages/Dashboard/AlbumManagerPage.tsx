import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  FolderOpen,
  Image,
  Loader2,
  Lock,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { ClientAlbum } from "../../backend";
import {
  useAddPhotoToAlbum,
  useCreateAlbum,
  useDeleteAlbum,
  useGetAllAlbums,
  useRemovePhotoFromAlbum,
  useUpdateAlbum,
} from "../../hooks/useQueries";
import { processImageFile } from "../../utils/imageDataUrl";

type Mode = "list" | "manage-photos";

interface AlbumFormData {
  name: string;
  clientName: string;
  description: string;
  password: string;
  coverPhotoUrl: string;
}

const emptyForm: AlbumFormData = {
  name: "",
  clientName: "",
  description: "",
  password: "",
  coverPhotoUrl: "",
};

export default function AlbumManagerPage() {
  const { data: albums = [], isLoading } = useGetAllAlbums();
  const createAlbum = useCreateAlbum();
  const updateAlbum = useUpdateAlbum();
  const deleteAlbum = useDeleteAlbum();
  const addPhoto = useAddPhotoToAlbum();
  const removePhoto = useRemovePhotoFromAlbum();

  const [mode, setMode] = useState<Mode>("list");
  const [managingAlbum, setManagingAlbum] = useState<ClientAlbum | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editAlbum, setEditAlbum] = useState<ClientAlbum | null>(null);
  const [deleteAlbumTarget, setDeleteAlbumTarget] =
    useState<ClientAlbum | null>(null);

  const [form, setForm] = useState<AlbumFormData>(emptyForm);
  const [coverUploading, setCoverUploading] = useState(false);
  const [photosUploading, setPhotosUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);

  const handleOpenCreate = () => {
    setForm(emptyForm);
    setCreateOpen(true);
  };

  const handleOpenEdit = (album: ClientAlbum) => {
    setForm({
      name: album.name,
      clientName: album.clientName,
      description: album.description,
      password: album.password,
      coverPhotoUrl: album.coverPhotoUrl,
    });
    setEditAlbum(album);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    try {
      const dataUrl = await processImageFile(file);
      setForm((prev) => ({ ...prev, coverPhotoUrl: dataUrl }));
      toast.success("Cover uploaded");
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload cover");
    } finally {
      setCoverUploading(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAlbum.mutateAsync(form);
      toast.success("Album created!");
      setCreateOpen(false);
    } catch {
      toast.error("Failed to create album");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAlbum) return;
    try {
      await updateAlbum.mutateAsync({ id: editAlbum.id, ...form });
      toast.success("Album updated!");
      setEditAlbum(null);
    } catch {
      toast.error("Failed to update album");
    }
  };

  const handleDelete = async () => {
    if (!deleteAlbumTarget) return;
    try {
      await deleteAlbum.mutateAsync(deleteAlbumTarget.id);
      toast.success("Album deleted");
      setDeleteAlbumTarget(null);
    } catch {
      toast.error("Failed to delete album");
    }
  };

  const handleManagePhotos = (album: ClientAlbum) => {
    setManagingAlbum(album);
    setMode("manage-photos");
  };

  const handleAddPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length || !managingAlbum) return;
    setPhotosUploading(true);
    try {
      await Promise.all(
        files.map(async (file) => {
          const dataUrl = await processImageFile(file);
          await addPhoto.mutateAsync({
            albumId: managingAlbum.id,
            photoUrl: dataUrl,
          });
        }),
      );
      toast.success(
        `${files.length} photo${files.length > 1 ? "s" : ""} added`,
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to add some photos");
    } finally {
      setPhotosUploading(false);
      if (photosInputRef.current) photosInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = async (photoUrl: string) => {
    if (!managingAlbum) return;
    try {
      await removePhoto.mutateAsync({ albumId: managingAlbum.id, photoUrl });
      toast.success("Removed");
    } catch {
      toast.error("Failed to remove");
    }
  };

  const AlbumForm = ({
    onSubmit,
    isPending,
  }: { onSubmit: (e: React.FormEvent) => void; isPending: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="album-name">Album Name *</Label>
          <Input
            id="album-name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
            data-ocid="albums.input"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client-name">Client Name *</Label>
          <Input
            id="client-name"
            value={form.clientName}
            onChange={(e) =>
              setForm((p) => ({ ...p, clientName: e.target.value }))
            }
            required
            data-ocid="albums.input"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
          rows={3}
          data-ocid="albums.textarea"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">
          <Lock className="h-3.5 w-3.5 inline mr-1" />
          Password *
        </Label>
        <Input
          id="password"
          type="text"
          value={form.password}
          onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          required
          placeholder="e.g. Smith2024"
          data-ocid="albums.input"
        />
      </div>
      <div className="space-y-2">
        <Label>Cover</Label>
        <div className="flex items-center gap-3">
          {form.coverPhotoUrl && (
            <img
              src={form.coverPhotoUrl}
              alt="Album cover"
              className="h-14 w-14 rounded object-cover"
            />
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={coverUploading}
            onClick={() => coverInputRef.current?.click()}
            data-ocid="albums.upload_button"
          >
            {coverUploading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {coverUploading ? "Uploading..." : "Upload Cover"}
          </Button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handleCoverUpload}
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          type="submit"
          disabled={isPending}
          data-ocid="albums.submit_button"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {isPending ? "Saving..." : "Save Album"}
        </Button>
      </DialogFooter>
    </form>
  );

  if (mode === "manage-photos" && managingAlbum) {
    const freshAlbum =
      albums.find((a) => a.id === managingAlbum.id) ?? managingAlbum;

    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setMode("list")}
              data-ocid="albums.secondary_button"
            >
              ← Back to Albums
            </Button>
            <div>
              <h1 className="font-serif text-3xl font-bold">
                {freshAlbum.name}
              </h1>
              <p className="text-muted-foreground">
                For: {freshAlbum.clientName}
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Add Photos</CardTitle>
              <CardDescription>Upload new photos to this album</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                disabled={photosUploading}
                onClick={() => photosInputRef.current?.click()}
                data-ocid="albums.upload_button"
              >
                {photosUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {photosUploading ? "Uploading..." : "Add Photos"}
              </Button>
              <input
                ref={photosInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                multiple
                className="hidden"
                onChange={handleAddPhotos}
                data-ocid="albums.dropzone"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Photos ({freshAlbum.photoUrls.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {freshAlbum.photoUrls.length === 0 ? (
                <div
                  className="text-center py-12 text-muted-foreground"
                  data-ocid="albums.empty_state"
                >
                  <Image className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p>No photos yet. Upload some above.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {freshAlbum.photoUrls.map((url, i) => (
                    <div
                      key={url}
                      className="relative group aspect-square rounded-lg overflow-hidden bg-muted"
                      data-ocid={`albums.item.${i + 1}`}
                    >
                      <img
                        src={url}
                        alt={`Album item ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          type="button"
                          className="bg-destructive text-destructive-foreground rounded-full p-1.5 hover:bg-destructive/90"
                          onClick={() => handleRemovePhoto(url)}
                          data-ocid={`albums.delete_button.${i + 1}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold mb-1">
              Client Albums
            </h1>
            <p className="text-muted-foreground">
              Create and manage password-protected photo albums
            </p>
          </div>
          <Button onClick={handleOpenCreate} data-ocid="albums.primary_button">
            <Plus className="h-4 w-4 mr-2" />
            New Album
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : albums.length === 0 ? (
          <div className="text-center py-20" data-ocid="albums.empty_state">
            <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-40" />
            <p className="text-muted-foreground text-lg">No albums yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first album to deliver client photos.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {albums.map((album, i) => (
              <Card
                key={album.id.toString()}
                data-ocid={`albums.item.${i + 1}`}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {album.coverPhotoUrl ? (
                      <img
                        src={album.coverPhotoUrl}
                        alt={album.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="h-6 w-6 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold truncate">{album.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      For: {album.clientName}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {album.photoUrls.length} photos
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        {album.password}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleManagePhotos(album)}
                      data-ocid={`albums.edit_button.${i + 1}`}
                    >
                      <Image className="h-3.5 w-3.5 mr-1" />
                      Photos
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(album)}
                      data-ocid={`albums.edit_button.${i + 1}`}
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteAlbumTarget(album)}
                      className="text-destructive hover:text-destructive"
                      data-ocid={`albums.delete_button.${i + 1}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg" data-ocid="albums.dialog">
          <DialogHeader>
            <DialogTitle>Create New Album</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new client album.
            </DialogDescription>
          </DialogHeader>
          <AlbumForm
            onSubmit={handleCreateSubmit}
            isPending={createAlbum.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editAlbum} onOpenChange={(o) => !o && setEditAlbum(null)}>
        <DialogContent className="max-w-lg" data-ocid="albums.dialog">
          <DialogHeader>
            <DialogTitle>Edit Album</DialogTitle>
            <DialogDescription>Update the album details.</DialogDescription>
          </DialogHeader>
          <AlbumForm
            onSubmit={handleEditSubmit}
            isPending={updateAlbum.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteAlbumTarget}
        onOpenChange={(o) => !o && setDeleteAlbumTarget(null)}
      >
        <AlertDialogContent data-ocid="albums.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Album?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{deleteAlbumTarget?.name}&quot;
              and all its photos. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="albums.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="albums.confirm_button"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
