import Link from "next/link";
import { HeroCarousel } from "@/components/HeroCarousel";
import { SitePhoto } from "@/components/SitePhoto";
import { CtaButton, Section } from "@/components/ui";
import { listGalleryPhotos, listHeroSlides } from "@/lib/gallery";
import { formatNgn } from "@/lib/catalog";
import { org } from "@/lib/org";
import { pageMeta, seoCopy } from "@/lib/seo";
import { getServices } from "@/lib/vessel";

export const metadata = pageMeta({
  title: seoCopy.home.title,
  description: seoCopy.home.description,
  path: "/",
});

const diagnosticsOrder = [
  "06414B30-F161-4D83-8CD3-78AB78729BA0.png",
  "32F2842F-D45C-4C89-9131-0811454295AE.png",
  "91AC85C0-7D60-45EA-9953-20415519D3E9.png",
  "98D922BB-09BD-47FB-8CE1-1544CB5A9296.png",
  "9FC4A1C3-6DBA-45FF-A508-49573B8D4393.png",
];

const diagnosticsCopy: Record<
  string,
  { alt: string; caption: string; wide?: boolean }
> = {
  "06414B30-F161-4D83-8CD3-78AB78729BA0.png": {
    alt: "StreamTrust staff member in front of the centre service wall",
    caption: "At the service wall",
    wide: true,
  },
  "32F2842F-D45C-4C89-9131-0811454295AE.png": {
    alt: "Sonographer preparing an ultrasound machine at StreamTrust Diagnostics",
    caption: "Ultrasound suite",
  },
  "91AC85C0-7D60-45EA-9953-20415519D3E9.png": {
    alt: "Medical laboratory scientist loading a sample into an analyser",
    caption: "Loading a sample",
  },
  "98D922BB-09BD-47FB-8CE1-1544CB5A9296.png": {
    alt: "Gloved hands pipetting a sample beside racks of blood tubes",
    caption: "Pipetting on the bench",
  },
  "9FC4A1C3-6DBA-45FF-A508-49573B8D4393.png": {
    alt: "Scientist registering a blood sample on a haematology analyser",
    caption: "Haematology analyser",
  },
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const popular = await getServices({ skip: 0, take: 4, search: "" });
  const slides = listHeroSlides();
  const byFile = new Map(
    listGalleryPhotos().map((photo) => [photo.file, photo]),
  );
  const diagnostics = diagnosticsOrder.flatMap((file) => {
    const photo = byFile.get(file);
    const copy = diagnosticsCopy[file];
    if (!photo || !copy) return [];
    return [{ ...photo, ...copy }];
  });

  return (
    <>
      <HeroCarousel slides={slides} />

      <Section>
        <div className="reveal grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-teal-soft">
              Why StreamTrust
            </p>
            <h2 className="font-display mt-2 text-3xl tracking-tight text-foreground sm:text-4xl">
              Accurate results. Calm experience.
            </h2>
            <p className="mt-4 max-w-lg text-muted leading-relaxed">
              From digital mammography to automated lab panels, we combine modern
              equipment with clear communication — including sample kits delivered
              to your door when you cannot visit.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-block text-sm font-semibold text-teal underline-offset-4 hover:underline"
            >
              Learn about our centre
            </Link>
          </div>
          <SitePhoto
            src="/images/lab_tech_possing.png"
            alt="StreamTrust staff member in the centre waiting area"
            sizes="(max-width: 768px) 100vw, 45vw"
            className="aspect-[4/3] min-h-64 w-full md:min-h-80"
          />
        </div>
      </Section>

      <section className="bg-surface">
        <Section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.14em] text-teal-soft">
                Services
              </p>
              <h2 className="font-display mt-2 text-3xl tracking-tight text-foreground">
                What we offer
              </h2>
            </div>
            <Link
              href="/services"
              className="text-sm font-semibold text-teal underline-offset-4 hover:underline"
            >
              View all tests & prices
            </Link>
          </div>
          <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {org.taglines.map((tag) => (
              <li key={tag} className="border-t border-border pt-4">
                <p className="font-medium text-foreground">{tag}</p>
              </li>
            ))}
          </ul>
        </Section>
      </section>

      <Section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-teal-soft">
              Prices
            </p>
            <h2 className="font-display mt-2 text-3xl tracking-tight text-foreground">
              From the catalogue
            </h2>
          </div>
        </div>
        {popular.error ? (
          <p className="mt-10 text-sm text-muted" role="alert">
            {popular.error}{" "}
            <Link href="/services" className="font-semibold text-teal hover:underline">
              Open the price list
            </Link>
          </p>
        ) : (
          <ul className="mt-10 divide-y divide-border border-y border-border">
            {popular.services.map((test) => (
              <li key={test.id}>
                <Link
                  href={`/services/${test.id}`}
                  className="flex flex-col gap-1 py-5 transition-colors hover:bg-surface-soft/60 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <div>
                    <p className="font-medium text-foreground">{test.name}</p>
                    {test.description ? (
                      <p className="mt-1 line-clamp-1 text-sm text-muted">
                        {test.description}
                      </p>
                    ) : null}
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-teal">
                    {formatNgn(test.priceNgn)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <section className="bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <SitePhoto
            src="/images/med_lab_scienties.png"
            alt="Medical laboratory scientists at StreamTrust Diagnostics"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="aspect-[5/4] min-h-[20rem] w-full lg:min-h-[28rem]"
          />
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-teal-soft">
              The team
            </p>
            <h2 className="font-display mt-2 text-3xl tracking-tight text-foreground sm:text-5xl">
              Medical laboratory scientists
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
              The people you meet at the centre are the same people who run
              your samples. Scientists and clinical staff stay close to the
              bench, so questions get a clear answer before you leave.
            </p>
            <p className="mt-4 max-w-md leading-relaxed text-muted">
              From reception to the laboratory, the team is prepared for
              screening, routine panels, and the tests your doctor has asked
              for.
            </p>
            <Link
              href="/gallery"
              className="mt-6 inline-block text-sm font-semibold text-teal underline-offset-4 hover:underline"
            >
              See the team in the gallery
            </Link>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:order-2">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-teal-soft">
              On the bench
            </p>
            <h2 className="font-display mt-2 text-3xl tracking-tight text-foreground sm:text-5xl">
              Laboratory scientist at work
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
              Haematology runs on automated analysers, with a scientist at the
              screen for every batch. Samples stay labelled, tracked, and
              reviewed before a result is released.
            </p>
            <p className="mt-4 max-w-md leading-relaxed text-muted">
              That is the same care behind home kits: you collect at home, we
              analyse here, and the report is ready for you and your clinician.
            </p>
          </div>
          <SitePhoto
            src="/images/lab_scientsit_at_work.png"
            alt="Laboratory scientist at work in the haematology section"
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="aspect-[3/4] min-h-[28rem] w-full lg:order-1 lg:min-h-[42rem]"
          />
        </div>
      </Section>

      <section className="bg-teal-deep text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent">
            The centre
          </p>
          <h2 className="font-display mt-2 max-w-2xl text-3xl tracking-tight sm:text-5xl">
            StreamTrust Diagnostics
          </h2>
          <p className="mt-4 max-w-xl text-white/75">
            Ultrasound, automated chemistry, and sample handling under one roof
            in Uyo — the rooms and the work behind your report.
          </p>
          <ul className="mt-12 grid gap-8 sm:grid-cols-2">
            {diagnostics.map((photo) => (
              <li
                key={photo.src}
                className={photo.wide ? "sm:col-span-2" : undefined}
              >
                <figure>
                  <SitePhoto
                    src={photo.src}
                    alt={photo.alt}
                    sizes={
                      photo.wide
                        ? "(max-width: 1152px) 100vw, 1152px"
                        : "(max-width: 640px) 100vw, 50vw"
                    }
                    className={
                      photo.wide
                        ? "aspect-[5/4] min-h-[22rem] w-full"
                        : "aspect-[3/4] min-h-[24rem] w-full"
                    }
                  />
                  <figcaption className="mt-3 text-sm text-white/70">
                    {photo.caption}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#141218] text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-display text-3xl tracking-tight">
              Prefer testing from home?
            </h2>
            <p className="mt-2 max-w-md text-white/75">
              We send a sample kit, you collect at home, and return it for analysis.
            </p>
          </div>
          <CtaButton href="/home-collection">Start home kit request</CtaButton>
        </div>
      </section>
    </>
  );
}
