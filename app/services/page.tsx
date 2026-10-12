import { ServicesCatalog } from "@/components/ServicesCatalog";
import { JsonLd } from "@/components/JsonLd";
import { CtaButton, PageHero, Section } from "@/components/ui";
import { categories } from "@/lib/mock-catalog";
import { breadcrumbNode, pageMeta, seoCopy } from "@/lib/seo";
import { getTests } from "@/lib/vessel";

export const metadata = pageMeta({
  title: seoCopy.services.title,
  description: seoCopy.services.description,
  path: "/services",
});

export default async function ServicesPage() {
  const tests = await getTests();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
        ]}
      />
      <PageHero
        eyebrow="Services"
        title="Tests & prices"
        description="Browse laboratory, imaging, cardiac, and package options. Prices shown in Nigerian Naira."
        actions={
          <>
            <CtaButton href="/home-collection" variant="ghost">
              Home sample kit
            </CtaButton>
            <CtaButton href="/book" variant="ghost">
              Book a visit
            </CtaButton>
          </>
        }
      />

      <Section>
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat.id} className="border-t border-border pt-4">
              <h2 className="font-display text-xl text-teal-deep">{cat.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {cat.description}
              </p>
            </div>
          ))}
        </div>

        <ServicesCatalog initialTests={tests} />
      </Section>
    </>
  );
}
