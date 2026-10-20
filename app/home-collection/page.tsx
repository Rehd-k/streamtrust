import { Suspense } from "react";
import { HomeCollectionWizard } from "@/components/HomeCollectionWizard";
import { JsonLd } from "@/components/JsonLd";
import { PageHero, Section } from "@/components/ui";
import { servicesForHomeCollection } from "@/lib/catalog";
import { breadcrumbNode, pageMeta, seoCopy } from "@/lib/seo";
import { getAllServices } from "@/lib/vessel";

export const metadata = pageMeta({
  title: seoCopy.homeCollection.title,
  description: seoCopy.homeCollection.description,
  path: "/home-collection",
});

export const dynamic = "force-dynamic";

export default async function HomeCollectionPage() {
  const { services, error } = await getAllServices();
  const eligible = servicesForHomeCollection(services);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Home sample kit", path: "/home-collection" },
          ]),
        ]}
      />
      <PageHero
        eyebrow="Home collection"
        title="Request a sample kit"
        description="Choose eligible lab tests, share your delivery address, and we will send a kit with return instructions."
      />
      <Section>
        <Suspense fallback={<p className="text-muted">Loading…</p>}>
          <HomeCollectionWizard services={eligible} loadError={error} />
        </Suspense>
      </Section>
    </>
  );
}
