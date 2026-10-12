import { PortalLoginForm } from "@/components/PortalLoginForm";
import { PageHero, Section } from "@/components/ui";
import { getPatientToken } from "@/lib/auth";
import { pageMeta, seoCopy } from "@/lib/seo";
import { redirect } from "next/navigation";

export const metadata = pageMeta({
  title: seoCopy.portalLogin.title,
  description: seoCopy.portalLogin.description,
  path: "/portal/login",
});

export default async function PortalLoginPage() {
  const token = await getPatientToken();
  if (token) redirect("/portal");

  return (
    <>
      <PageHero
        eyebrow="Patient portal"
        title="Sign in"
        description="Use your Patient ID and date of birth. New devices may need front-desk approval before full access."
      />
      <Section>
        <PortalLoginForm />
      </Section>
    </>
  );
}
