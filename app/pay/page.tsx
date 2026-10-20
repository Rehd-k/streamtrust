import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutForm } from "@/components/CheckoutForm";
import { PageHero, Section } from "@/components/ui";
import { pageMeta, seoCopy } from "@/lib/seo";
import { getService } from "@/lib/vessel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...pageMeta({
    title: seoCopy.pay.title,
    description: seoCopy.pay.description,
    path: "/pay",
  }),
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ service?: string | string[] }> };

export default async function PayPage({ searchParams }: Props) {
  const params = await searchParams;
  const raw = params.service;
  const ids = [...new Set((Array.isArray(raw) ? raw : raw ? [raw] : []).map((id) => id.trim()))];
  const loaded = await Promise.all(ids.map((id) => getService(id)));
  const items = loaded.flatMap((service) => (service ? [service] : []));

  return (
    <>
      <PageHero
        eyebrow="Payment"
        title="Pay for your tests"
        description="Card, transfer, and USSD are handled by Flutterwave. The receipt is emailed when the payment succeeds."
      />
      <Section>
        {items.length === 0 ? (
          <p className="text-muted">
            Choose a test from the{" "}
            <Link href="/services" className="font-medium text-teal hover:underline">
              price list
            </Link>{" "}
            before paying.
          </p>
        ) : (
          <CheckoutForm items={items} />
        )}
      </Section>
    </>
  );
}
