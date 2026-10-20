import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Section } from "@/components/ui";
import { formatNgn } from "@/lib/catalog";
import { completePayment } from "@/lib/payments";
import { pageMeta, seoCopy } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...pageMeta({
    title: seoCopy.payCallback.title,
    description: seoCopy.payCallback.description,
    path: "/pay/callback",
  }),
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ tx_ref?: string; reference?: string; status?: string }>;
};

export default async function PayCallbackPage({ searchParams }: Props) {
  const params = await searchParams;
  const reference = params.tx_ref || params.reference || "";
  const result = reference ? await completePayment(reference) : null;

  return (
    <>
      <PageHero
        eyebrow="Payment"
        title={result?.paid ? "Payment received" : "Payment not completed"}
        description={
          result?.message ||
          "Flutterwave did not return a payment reference. You can try again from the price list."
        }
      />
      <Section>
        {result?.paid && result.order ? (
          <div className="mx-auto max-w-xl">
            <p className="text-sm text-muted">
              Reference <span className="font-mono font-medium text-foreground">{result.reference}</span>
            </p>
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {result.order.items.map((item) => (
                <li key={item.id} className="flex justify-between py-3 text-sm">
                  <span>{item.name}</span>
                  <span className="font-medium">{formatNgn(item.priceNgn)}</span>
                </li>
              ))}
              <li className="flex justify-between py-3 font-semibold">
                <span>Total paid</span>
                <span>{formatNgn(result.amountNgn)}</span>
              </li>
            </ul>
            <p className="mt-4 text-sm text-muted">
              {result.emailSent
                ? "The receipt was emailed to you and to the centre."
                : "Keep this reference. The centre can confirm the payment with it."}
            </p>
          </div>
        ) : null}
        <div className="mt-8">
          <Link href="/services" className="text-sm font-semibold text-teal hover:underline">
            Back to tests and prices
          </Link>
        </div>
      </Section>
    </>
  );
}
