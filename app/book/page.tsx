import { BookingWizard } from "@/components/BookingWizard";
import { JsonLd } from "@/components/JsonLd";
import { PageHero, Section } from "@/components/ui";
import { getPatientToken } from "@/lib/auth";
import { breadcrumbNode, pageMeta, seoCopy } from "@/lib/seo";

export const metadata = pageMeta({
  title: seoCopy.book.title,
  description: seoCopy.book.description,
  path: "/book",
});

export default async function BookPage() {
  const token = await getPatientToken();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Book", path: "/book" },
          ]),
        ]}
      />
      <PageHero
        eyebrow="Book"
        title="Schedule a visit"
        description="Choose a specialty and preferred date. Portal sign-in is required so we can attach the request to your patient record."
      />
      <Section>
        <BookingWizard authenticated={Boolean(token)} />
      </Section>
    </>
  );
}
