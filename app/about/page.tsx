import { JsonLd } from "@/components/JsonLd";
import { SitePhoto } from "@/components/SitePhoto";
import { PageHero, Section } from "@/components/ui";
import { org } from "@/lib/org";
import { breadcrumbNode, pageMeta, seoCopy } from "@/lib/seo";

export const metadata = pageMeta({
  title: seoCopy.about.title,
  description: seoCopy.about.description,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />
      <PageHero
        eyebrow="About"
        title="Diagnostics rooted in trust"
        description={`${org.name} serves families and clinicians across Uyo with modern laboratory and imaging services — and home sample collection when travel is hard.`}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="font-display text-3xl tracking-tight text-teal-deep">
              Our centre
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Located at {org.address}, StreamTrust brings together digital
              mammography, X-ray, ultrasound, automated laboratory panels, ECG,
              Pap smear, and comprehensive health checks under one roof.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              We built this centre so patients get clear answers without the
              confusion — transparent pricing, prepared staff, and results you
              and your doctor can act on.
            </p>
          </div>
          <SitePhoto
            src="/images/scientist_using_machine.png"
            alt="Laboratory scientist using an analyser at StreamTrust Diagnostics"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="aspect-[4/3] min-h-72 w-full lg:min-h-full"
          />
        </div>
      </Section>

      <section className="bg-surface">
        <Section>
          <h2 className="font-display text-3xl tracking-tight text-teal-deep">
            Modalities
          </h2>
          <p className="mt-3 max-w-xl text-muted">
            Core capabilities we run every day.
          </p>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {org.taglines.map((tag) => (
              <li
                key={tag}
                className="border-l-2 border-sage pl-4 text-lg text-teal-deep"
              >
                {tag}
              </li>
            ))}
          </ul>
        </Section>
      </section>

      <Section>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Patient-first",
              body: "Plain-language prep instructions and respectful appointment flow.",
            },
            {
              title: "Home kits",
              body: "Eligible lab tests can be requested from home — we ship the kit to you.",
            },
            {
              title: "Portal access",
              body: "Registered patients view reports, bills, and appointments online.",
            },
          ].map((item) => (
            <div key={item.title} className="border-t border-border pt-5">
              <h3 className="font-display text-xl text-teal-deep">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
