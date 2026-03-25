import PageCTABar from "@/components/PageCTABar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Download,
  Eye,
  FolderOpen,
  Image,
  Lock,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { PublicAlbumView } from "../backend";
import { useListAlbums, useVerifyAlbumPassword } from "../hooks/useQueries";

export default function ClientAlbumsPage() {
  const { data: albums = [], isLoading } = useListAlbums();
  const verifyPassword = useVerifyAlbumPassword();

  const [selectedAlbum, setSelectedAlbum] = useState<PublicAlbumView | null>(
    null,
  );
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [unlockedPhotos, setUnlockedPhotos] = useState<string[] | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  const handleAlbumClick = (album: PublicAlbumView) => {
    setSelectedAlbum(album);
    setPassword("");
    setPasswordError("");
    setUnlockedPhotos(null);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlbum) return;
    setPasswordError("");

    try {
      const photos = await verifyPassword.mutateAsync({
        albumId: selectedAlbum.id,
        password,
      });
      if (photos === null) {
        setPasswordError("Incorrect password. Please try again.");
      } else {
        setUnlockedPhotos(photos);
        toast.success(`Welcome! ${selectedAlbum.name} is now unlocked.`);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleBack = () => {
    setSelectedAlbum(null);
    setUnlockedPhotos(null);
    setPassword("");
    setPasswordError("");
  };

  // Lightbox
  if (lightboxPhoto) {
    return (
      // biome-ignore lint/a11y/useKeyWithClickEvents: lightbox backdrop dismiss
      <div
        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        onClick={() => setLightboxPhoto(null)}
        data-ocid="photos.modal"
      >
        <button
          type="button"
          className="absolute top-4 right-4 text-white bg-black/60 rounded-full p-2 hover:bg-black/80"
          onClick={() => setLightboxPhoto(null)}
          data-ocid="photos.close_button"
        >
          <X className="h-6 w-6" />
        </button>
        <img
          src={lightboxPhoto}
          alt="Selected"
          className="max-w-[95vw] max-h-[90vh] object-contain rounded"
        />
        <a
          href={lightboxPhoto}
          download
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90"
          data-ocid="photos.primary_button"
        >
          <Download className="h-4 w-4" />
          Download
        </a>
      </div>
    );
  }

  // Unlocked Gallery View
  if (unlockedPhotos && selectedAlbum) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleBack}
              data-ocid="photos.secondary_button"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Albums
            </Button>
            <div>
              <h1 className="font-serif text-3xl font-bold">
                {selectedAlbum.name}
              </h1>
              <p className="text-muted-foreground">
                For: {selectedAlbum.clientName}
              </p>
            </div>
          </div>

          {unlockedPhotos.length === 0 ? (
            <div className="text-center py-20" data-ocid="photos.empty_state">
              <Image className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">
                No photos in this album yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {unlockedPhotos.map((url, i) => (
                <div
                  key={url}
                  className="group relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer"
                  data-ocid={`photos.item.${i + 1}`}
                >
                  <img
                    src={url}
                    alt={`Gallery item ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      className="bg-white/90 text-black rounded-full p-2 hover:bg-white"
                      onClick={() => setLightboxPhoto(url)}
                      data-ocid="photos.button"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <a
                      href={url}
                      download
                      className="bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90"
                      data-ocid="photos.primary_button"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    );
  }

  // Password Entry
  if (selectedAlbum && !unlockedPhotos) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-8"
            data-ocid="photos.secondary_button"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Albums
          </Button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-serif text-2xl font-bold mb-1">
              {selectedAlbum.name}
            </h2>
            <p className="text-muted-foreground">
              For: {selectedAlbum.clientName}
            </p>
            {selectedAlbum.description && (
              <p className="text-sm text-muted-foreground mt-2">
                {selectedAlbum.description}
              </p>
            )}
          </div>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="album-password">Album Password</Label>
                  <Input
                    id="album-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                    data-ocid="photos.input"
                  />
                  {passwordError && (
                    <p
                      className="text-sm text-destructive"
                      data-ocid="photos.error_state"
                    >
                      {passwordError}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!password || verifyPassword.isPending}
                  data-ocid="photos.submit_button"
                >
                  {verifyPassword.isPending ? "Unlocking..." : "Unlock Album"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  // Albums Grid
  return (
    <div>
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center">
            <h1 className="font-serif text-4xl font-bold mb-3">
              Client Albums
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Your album will be listed below. Click your album and enter the
              password provided to access and download your photos.
            </p>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
              ))}
            </div>
          ) : albums.length === 0 ? (
            <div className="text-center py-20" data-ocid="photos.empty_state">
              <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">
                No albums available yet.
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album, i) => (
                <button
                  key={album.id.toString()}
                  type="button"
                  className="group text-left rounded-xl overflow-hidden border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  onClick={() => handleAlbumClick(album)}
                  data-ocid={`photos.item.${i + 1}`}
                >
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    {album.coverPhotoUrl ? (
                      <img
                        src={album.coverPhotoUrl}
                        alt={album.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="h-12 w-12 text-muted-foreground/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute top-3 right-3 bg-black/60 rounded-full p-1.5">
                      <Lock className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-base mb-0.5 group-hover:text-primary transition-colors">
                      {album.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      For: {album.clientName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {album.photoCount.toString()} photo
                      {album.photoCount !== 1n ? "s" : ""}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
      <PageCTABar />
    </div>
  );
}
