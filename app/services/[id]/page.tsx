import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { CtaButton, PageHero, Section } from "@/components/ui";
import { formatNgn, getCategoryById, tests } from "@/lib/mock-catalog";
import {
  breadcrumbNode,
  pageMeta,
  serviceNode,
  testDescription,
  testTitle,
} from "@/lib/seo";
import { getTest } from "@/lib/vessel";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return tests.map((t) => ({ id: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const test = await getTest(id);
  if (!test) return { title: "Test not found", robots: { index: false, follow: false } };
  return pageMeta({
    title: testTitle(test.name),
    description: testDescription(test),
    path: `/services/${test.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { id } = await params;
  const test = await getTest(id);
  if (!test) notFound();

  const category = getCategoryById(test.categoryId);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: test.name, path: `/services/${test.slug}` },
          ]),
          serviceNode(test),
        ]}
      />
      <PageHero
        eyebrow={category?.name ?? "Service"}
        title={test.name}
        description={test.description}
        actions={
          <>
            <CtaButton href="/book">Book this test</CtaButton>
            {test.homeCollectionEligible ? (
              <CtaButton
                href={`/home-collection?test=${test.slug}`}
                variant="ghost"
              >
                Request home kit
              </CtaButton>
            ) : null}
          </>
        }
      />

      <Section>
        <dl className="grid gap-8 sm:grid-cols-3">
          <div className="border-t border-border pt-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
              Price
            </dt>
            <dd className="mt-2 font-display text-3xl text-teal-deep">
              {formatNgn(test.priceNgn)}
            </dd>
          </div>
          <div className="border-t border-border pt-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
              Turnaround
            </dt>
            <dd className="mt-2 text-lg text-foreground">{test.turnaround}</dd>
          </div>
          <div className="border-t border-border pt-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
              Home collection
            </dt>
            <dd className="mt-2 text-lg text-foreground">
              {test.homeCollectionEligible ? "Available" : "Centre visit required"}
            </dd>
          </div>
        </dl>

        <div className="mt-12 max-w-2xl border-t border-border pt-8">
          <h2 className="font-display text-2xl text-teal-deep">Preparation</h2>
          <p className="mt-3 leading-relaxed text-muted">{test.preparation}</p>
          <p className="mt-8 text-sm text-muted">
            Questions?{" "}
            <Link href="/contact" className="font-medium text-teal hover:underline">
              Contact the centre
            </Link>
            .
          </p>
        </div>
      </Section>
    </>
  );
}
