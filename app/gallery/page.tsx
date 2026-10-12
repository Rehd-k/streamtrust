import { JsonLd } from "@/components/JsonLd";
import { SitePhoto } from "@/components/SitePhoto";
import { PageHero, Section } from "@/components/ui";
import { listGalleryPhotos } from "@/lib/gallery";
import { breadcrumbNode, pageMeta, seoCopy } from "@/lib/seo";

export const metadata = pageMeta({
  title: seoCopy.gallery.title,
  description: seoCopy.gallery.description,
  path: "/gallery",
});

export default function GalleryPage() {
  const photos = listGalleryPhotos();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Gallery", path: "/gallery" },
          ]),
        ]}
      />
      <PageHero
        eyebrow="Gallery"
        title="Inside the centre"
        description="Team, laboratory, and awareness photos from our Uyo centre."
      />

      <Section>
        {photos.length === 0 ? (
          <p className="text-muted">Photos will appear here once they are added.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <li key={photo.src}>
                <figure>
                  <SitePhoto
                    src={photo.src}
                    alt={photo.alt}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="aspect-[4/3] w-full"
                  />
                  <figcaption className="mt-2 text-sm text-muted">
                    {photo.alt}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
