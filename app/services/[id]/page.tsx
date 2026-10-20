import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { CtaButton, PageHero, Section } from "@/components/ui";
import { canRequestHomeKit, formatNgn } from "@/lib/catalog";
import {
  breadcrumbNode,
  pageMeta,
  serviceMeta,
  serviceNode,
} from "@/lib/seo";
import { getService } from "@/lib/vessel";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const test = await getService(id);
  if (!test) return { title: "Test not found", robots: { index: false, follow: false } };
  const meta = serviceMeta(test);
  return pageMeta({
    title: meta.title,
    description: meta.description,
    path: `/services/${test.id}`,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { id } = await params;
  const test = await getService(id);
  if (!test) notFound();

  const homeKit = canRequestHomeKit(test);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: test.name, path: `/services/${test.id}` },
          ]),
          serviceNode(test),
        ]}
      />
      <PageHero
        eyebrow={test.categoryName || "Service"}
        title={test.name}
        description={test.description || "Diagnostic service at StreamTrust Diagnostics."}
        actions={
          <>
            <CtaButton href={`/pay?service=${test.id}`}>Pay for this test</CtaButton>
            <CtaButton href="/book" variant="ghost">
              Book a visit
            </CtaButton>
            {homeKit ? (
              <CtaButton href={`/home-collection?test=${test.id}`} variant="ghost">
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
          {test.turnaround ? (
            <div className="border-t border-border pt-4">
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                Turnaround
              </dt>
              <dd className="mt-2 text-lg text-foreground">{test.turnaround}</dd>
            </div>
          ) : null}
          <div className="border-t border-border pt-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
              Home collection
            </dt>
            <dd className="mt-2 text-lg text-foreground">
              {homeKit ? "Available" : "Centre visit required"}
            </dd>
          </div>
        </dl>

        <div className="mt-12 max-w-2xl border-t border-border pt-8">
          <h2 className="font-display text-2xl text-teal-deep">Preparation</h2>
          <p className="mt-3 leading-relaxed text-muted">
            {test.preparation ||
              "Preparation depends on the test. The centre will explain what to do when you book."}
          </p>
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
