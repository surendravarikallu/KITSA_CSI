import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SectionHeader } from "@/components/shared/PublicComponents";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { GalleryItem } from "@shared/schema";

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  const { data: images, isLoading } = useQuery<GalleryItem[]>({
    queryKey: ["/api/gallery"],
  });

  const categories = ["all", "workshops", "hackathons", "seminars"];
  
  const filteredImages = images?.filter(img => 
    filter === "all" || (img.caption?.toLowerCase().includes(filter))
  );

  return (
    <div className="container mx-auto px-4 py-16">
      <SectionHeader 
        title="Event Gallery" 
        subtitle="Capturing moments from our various workshops, seminars, and hackathons."
      />

      <div className="flex justify-center mb-12">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            {categories.map(cat => (
              <TabsTrigger key={cat} value={cat} className="capitalize">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="aspect-video rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages?.map((img) => (
            <div 
              key={img.id} 
              className="group relative aspect-video overflow-hidden rounded-xl cursor-pointer hover-elevate transition-all"
              onClick={() => setSelectedImage(img.imageUrl)}
            >
              <img 
                src={img.imageUrl} 
                alt={img.caption || ""} 
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white font-medium text-center px-4">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
          {selectedImage && (
            <img src={selectedImage} alt="Preview" className="w-full h-auto rounded-lg" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
