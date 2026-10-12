import { JsonLd } from "@/components/JsonLd";
import { PageHero, PlaceholderPhoto, Section } from "@/components/ui";
import { formatPhoneDisplay, org, telHref, whatsappHref } from "@/lib/org";
import { breadcrumbNode, pageMeta, seoCopy } from "@/lib/seo";

export const metadata = pageMeta({
  title: seoCopy.contact.title,
  description: seoCopy.contact.description,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />
      <PageHero
        eyebrow="Contact"
        title="Visit or reach us"
        description="Call, WhatsApp, or stop by our centre off Ikot Ekpene Road."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-2xl text-teal-deep">Address</h2>
              <p className="mt-3 max-w-md leading-relaxed text-muted">
                {org.address}
              </p>
              <p className="mt-2 text-sm text-muted">{org.hours}</p>
            </div>

            <div>
              <h2 className="font-display text-2xl text-teal-deep">Phone</h2>
              <ul className="mt-3 space-y-2">
                {org.phones.map((phone) => (
                  <li key={phone}>
                    <a
                      href={telHref(phone)}
                      className="text-lg text-teal hover:underline"
                    >
                      {formatPhoneDisplay(phone)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-2xl text-teal-deep">Email</h2>
              <a
                href={`mailto:${org.emails[0]}`}
                className="mt-3 inline-block text-lg text-teal hover:underline"
              >
                {org.emails[0]}
              </a>
            </div>

            <a
              href={whatsappHref("Hello StreamTrust, I would like to enquire.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-md bg-teal px-5 py-3 text-sm font-semibold text-white hover:bg-teal-deep"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div>
            <PlaceholderPhoto
              label="Map of the Uyo centre"
              className="min-h-80 w-full"
            />
            <p className="mt-3 text-sm text-muted">
              Map embed coming soon. Use the address above with your preferred
              maps app.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
