import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { SitePhoto } from "@/components/SitePhoto";
import { CtaButton, PageHero, Section } from "@/components/ui";
import { photosForTopicPrefix } from "@/lib/gallery";
import {
  getHealthTopic,
  healthDisclaimer,
  healthTopics,
} from "@/lib/health-topics";
import { breadcrumbNode, pageMeta } from "@/lib/seo";
import { getServices } from "@/lib/vessel";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return healthTopics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = getHealthTopic(slug);
  if (!topic) {
    return { title: "Topic not found", robots: { index: false, follow: false } };
  }
  return pageMeta({
    title: topic.seoTitle,
    description: topic.seoDescription,
    path: `/health/${topic.slug}`,
  });
}

export default async function HealthTopicPage({ params }: Props) {
  const { slug } = await params;
  const topic = getHealthTopic(slug);
  if (!topic) notFound();

  const photos = photosForTopicPrefix(topic.imagePrefix);
  const related = await relatedServices(topic.relatedServiceSlugs);
  const others = healthTopics.filter((item) => item.slug !== topic.slug);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Health", path: "/health" },
            { name: topic.title, path: `/health/${topic.slug}` },
          ]),
        ]}
      />
      <PageHero
        eyebrow={topic.eyebrow}
        title={topic.title}
        description={topic.summary}
        actions={
          <>
            <CtaButton href="/book">Book a visit</CtaButton>
            <CtaButton href="/contact" variant="ghost">
              Contact the centre
            </CtaButton>
          </>
        }
      />

      <Section>
        {photos.length > 0 ? (
          <ul className="mb-12 grid gap-4 sm:grid-cols-2">
            {photos.map((photo) => (
              <li key={photo.src}>
                <SitePhoto
                  src={photo.src}
                  alt={photo.alt}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="aspect-[4/3] w-full"
                />
              </li>
            ))}
          </ul>
        ) : null}

        <div className="max-w-3xl space-y-10">
          {topic.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-2xl tracking-tight text-teal-deep">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3 leading-relaxed text-muted">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          {related.length > 0 ? (
            <section>
              <h2 className="font-display text-2xl tracking-tight text-teal-deep">
                Tests at StreamTrust
              </h2>
              <ul className="mt-4 space-y-3">
                {related.map((test) => (
                  <li key={test.id}>
                    <Link
                      href={`/services/${test.id}`}
                      className="font-medium text-teal hover:underline"
                    >
                      {test.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted">{test.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <p className="border-t border-border pt-5 text-sm leading-relaxed text-muted">
            {healthDisclaimer}
          </p>
        </div>

        <div className="mt-14">
          <h2 className="font-display text-xl text-teal-deep">More health topics</h2>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {others.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/health/${item.slug}`}
                  className="text-sm font-medium text-teal hover:underline"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}

async function relatedServices(slugs: string[]) {
  const related = [];
  const seen = new Set<string>();

  for (const slug of slugs) {
    const search = slug.replace(/-/g, " ");
    const { services } = await getServices({ search, skip: 0, take: 10 });
    const needle = search.toLowerCase();
    const lastWord = needle.split(" ").at(-1) ?? needle;
    const match =
      services.find((service) => service.name.toLowerCase() === needle) ??
      services.find((service) => service.name.toLowerCase().includes(lastWord)) ??
      services[0];
    if (match && !seen.has(match.id)) {
      seen.add(match.id);
      related.push(match);
    }
  }

  return related;
}
