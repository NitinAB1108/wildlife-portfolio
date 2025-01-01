import { useMemo } from 'react';
import Image from 'next/image';

interface BackgroundSlideshowProps {
  isMobile: boolean;
}

const BackgroundSlideshow = ({ isMobile }: BackgroundSlideshowProps) => {
  const columnImages = useMemo(() => {
    const speeds = [0.25, 0.40, 0.2, 0.3];
    const totalImages = 24;

    const uniqueImages = Array.from({ length: totalImages }, (_, i) => ({
      path: `/display_compressed/image${i + 1}.jpg`,
      name: `Display Image ${i + 1}`,
      id: `display-${i}`,
      category: 'Display'
    }));

    return speeds.map((_, colIndex) => {
      return uniqueImages.slice(colIndex * 6, (colIndex + 1) * 6);
    });
  }, []);

  return (
    <div className="absolute inset-0">
      <div className="grid grid-cols-4 h-full">
        {columnImages.map((images, colIndex) => (
          <div key={colIndex} className="relative overflow-hidden">
            <div 
              className="animate-scroll will-change-transform"
              style={{
                animation: `scroll${colIndex % 2 === 0 ? 'Down' : 'Up'} ${isMobile ? 20/(colIndex * 0.25 + 0.5) : 30/(colIndex * 0.25 + 0.5)}s linear infinite`,
              }}
            >
              {[...images, ...images].map((image, index) => (
                <div
                  key={`${image.id}-${index}`}
                  className="relative h-[20vh] md:h-[35vh] w-full"
                >
                  <Image
                    src={image.path}
                    alt={image.name}
                    fill
                    className="object-cover"
                    sizes="25vw"
                    quality={40}
                    loading={index < 2 ? "eager" : "lazy"}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LC0yMi4xODY6OTg2MDQ0PkE9P0RHSktLS0xMTU1NTU1NTU3/2wBDAR4eHh0aHTQaGjRNMCUtTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundSlideshow;