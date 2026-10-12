import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SitePhoto } from "@/components/SitePhoto";
import { PageHero, Section } from "@/components/ui";
import { photosForTopicPrefix } from "@/lib/gallery";
import { healthTopics } from "@/lib/health-topics";
import { breadcrumbNode, pageMeta, seoCopy } from "@/lib/seo";

export const metadata = pageMeta({
  title: seoCopy.health.title,
  description: seoCopy.health.description,
  path: "/health",
});

export default function HealthPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Health", path: "/health" },
          ]),
        ]}
      />
      <PageHero
        eyebrow="Health"
        title="Topics we want you to know"
        description="Plain-language notes on screening and tests people ask about at a diagnostic centre. This is general information, not a personal medical plan."
      />

      <Section>
        <ul className="grid gap-8 sm:grid-cols-2">
          {healthTopics.map((topic) => {
            const photo = photosForTopicPrefix(topic.imagePrefix)[0];
            return (
              <li key={topic.slug} className="border-t border-border pt-5">
                {photo ? (
                  <SitePhoto
                    src={photo.src}
                    alt={photo.alt}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="mb-4 aspect-[4/3] w-full"
                  />
                ) : null}
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-soft">
                  {topic.eyebrow}
                </p>
                <h2 className="font-display mt-2 text-2xl text-teal-deep">
                  <Link
                    href={`/health/${topic.slug}`}
                    className="hover:underline"
                  >
                    {topic.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {topic.summary}
                </p>
              </li>
            );
          })}
        </ul>
      </Section>
    </>
  );
}
