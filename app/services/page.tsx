import { ServicesCatalog } from "@/components/ServicesCatalog";
import { JsonLd } from "@/components/JsonLd";
import { CtaButton, PageHero, Section } from "@/components/ui";
import { breadcrumbNode, pageMeta, seoCopy } from "@/lib/seo";
import { getServiceCategories, getServices } from "@/lib/vessel";

export const metadata = pageMeta({
  title: seoCopy.services.title,
  description: seoCopy.services.description,
  path: "/services",
});

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const [catalog, categories] = await Promise.all([
    getServices({ skip: 0, take: 10, search: "" }),
    getServiceCategories(),
  ]);

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
        {categories.length > 0 ? (
          <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <div key={cat.id} className="border-t border-border pt-4">
                <h2 className="font-display text-xl text-teal-deep">{cat.name}</h2>
                {cat.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {cat.description}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        <ServicesCatalog initial={catalog} categories={categories} />
      </Section>
    </>
  );
}
