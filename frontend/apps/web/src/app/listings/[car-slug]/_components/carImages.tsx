import Image from "next/image";
import { PhotoView, PhotoProvider } from "react-photo-view";

interface CarImagesProps {
  interiorImages?: string[];
  exteriorImages?: string[];
}

function CarImages({
  interiorImages = [],
  exteriorImages = [],
}: CarImagesProps) {
  // Don't render if no images are available
  if (interiorImages.length === 0 && exteriorImages.length === 0) {
    return null;
  }

  return (
    <div id="gallery" className="container mx-auto px-2 py-8">
      <h2 className="mb-6 text-2xl font-bold">Image Gallery</h2>

      <div className="">
        <div className="py-6">
          {/* Anchor Navigation Boxes */}
          <div className="mb-8 flex gap-4">
            {interiorImages.length > 0 && (
              <a
                href="#interior-gallery"
                className="block overflow-hidden rounded-lg transition-all hover:shadow-md"
              >
                <div className="relative h-24 w-32">
                  <Image
                    src={interiorImages[0] ?? ""}
                    alt="Interior"
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
                <div className="bg-gray-100 p-2 text-center text-sm font-medium text-gray-700">
                  Interior ({interiorImages.length})
                </div>
              </a>
            )}

            {exteriorImages.length > 0 && (
              <a
                href="#exterior-gallery"
                className="block overflow-hidden rounded-lg transition-all hover:shadow-md"
              >
                <div className="relative h-24 w-32">
                  <Image
                    src={exteriorImages[0] ?? ""}
                    alt="Exterior"
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
                <div className="bg-gray-100 p-2 text-center text-sm font-medium text-gray-700">
                  Exterior ({exteriorImages.length})
                </div>
              </a>
            )}
          </div>

          {/* Interior Section */}
          {interiorImages.length > 0 && (
            <div id="interior-gallery" className="mb-12 scroll-mt-24">
              <h3 className="mb-4 text-xl font-semibold">Interior</h3>
              <PhotoProvider>
                <div className="grid grid-cols-2 gap-0 md:grid-cols-3">
                  {interiorImages.map((imageUrl, index) => {
                    // First image (index 0) spans two rows in left column
                    if (index === 0) {
                      return (
                        <div
                          key={`interior-${index}`}
                          className="relative aspect-square h-full min-h-52 overflow-hidden border border-gray-100 md:row-span-2"
                        >
                          <PhotoView src={imageUrl}>
                            <Image
                              src={imageUrl}
                              alt={`Interior image ${index + 1}`}
                              fill
                              className="cursor-pointer object-cover"
                              sizes="(max-width: 768px) 50vw, 33vw"
                            />
                          </PhotoView>
                        </div>
                      );
                    }
                    // Subsequent images are in middle and right columns, one row each
                    return (
                      <div
                        key={`interior-${index}`}
                        className="relative aspect-square h-full min-h-52 overflow-hidden border border-gray-100"
                      >
                        <PhotoView src={imageUrl}>
                          <Image
                            src={imageUrl}
                            alt={`Interior image ${index + 1}`}
                            fill
                            className="cursor-pointer object-cover"
                            sizes="(max-width: 768px) 50vw, 33vw"
                          />
                        </PhotoView>
                      </div>
                    );
                  })}
                </div>
              </PhotoProvider>
            </div>
          )}

          {/* Exterior Section */}
          {exteriorImages.length > 0 && (
            <div id="exterior-gallery" className="scroll-mt-24">
              <h3 className="mb-4 text-xl font-semibold">Exterior</h3>
              <PhotoProvider>
                <div className="grid grid-cols-2 gap-0 md:grid-cols-3">
                  {exteriorImages.map((imageUrl, index) => {
                    // First image (index 0) spans two rows in left column
                    if (index === 0) {
                      return (
                        <div
                          key={`exterior-${index}`}
                          className="relative aspect-square h-full min-h-52 overflow-hidden border border-gray-100 md:row-span-2"
                        >
                          <PhotoView src={imageUrl}>
                            <Image
                              src={imageUrl}
                              alt={`Exterior image ${index + 1}`}
                              fill
                              className="cursor-pointer object-cover"
                              sizes="(max-width: 768px) 50vw, 33vw"
                            />
                          </PhotoView>
                        </div>
                      );
                    }
                    // Subsequent images are in middle and right columns, one row each
                    return (
                      <div
                        key={`exterior-${index}`}
                        className="relative aspect-square h-full min-h-52 overflow-hidden border border-gray-100"
                      >
                        <PhotoView src={imageUrl}>
                          <Image
                            src={imageUrl}
                            alt={`Exterior image ${index + 1}`}
                            fill
                            className="cursor-pointer object-cover"
                            sizes="(max-width: 768px) 50vw, 33vw"
                          />
                        </PhotoView>
                      </div>
                    );
                  })}
                </div>
              </PhotoProvider>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CarImages;
