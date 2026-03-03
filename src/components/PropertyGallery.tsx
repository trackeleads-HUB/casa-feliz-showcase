import { useState } from "react";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  images: { url: string; is_cover: boolean | null }[];
  title: string;
};

const PropertyGallery = ({ images, title }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="w-full h-72 md:h-96 bg-muted rounded-xl flex items-center justify-center">
        <Home size={48} className="text-muted-foreground/30" />
      </div>
    );
  }

  const prev = () => setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative w-full h-72 md:h-[28rem] rounded-xl overflow-hidden bg-muted">
        <img
          src={images[currentIndex].url}
          alt={`${title} - Foto ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />

        {images.length > 1 && (
          <>
            <Button
              size="icon"
              variant="secondary"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100"
              onClick={prev}
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100"
              onClick={next}
            >
              <ChevronRight size={20} />
            </Button>
            <span className="absolute bottom-3 right-3 bg-foreground/60 text-primary-foreground text-xs px-2.5 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                i === currentIndex ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img.url} alt={`Miniatura ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;
