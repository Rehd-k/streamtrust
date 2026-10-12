import { redirect } from "next/navigation";
import { PortalNav } from "@/components/PortalNav";
import { ProfileForm } from "@/components/ProfileForm";
import { getPatientToken } from "@/lib/auth";
import { patientGet } from "@/lib/portal";
import { pageMeta, seoCopy } from "@/lib/seo";

export const metadata = pageMeta({
  title: seoCopy.portalProfile.title,
  description: seoCopy.portalProfile.description,
  path: "/portal/profile",
});

export default async function PortalProfilePage() {
  const token = await getPatientToken();
  if (!token) redirect("/portal/login");

  const profile = await patientGet<Record<string, unknown>>("/patient/profile");

  return (
    <div>
      <PortalNav />
      <h1 className="font-display mt-8 text-3xl text-teal-deep">Profile</h1>
      <p className="mt-2 text-muted">Update your contact details.</p>

      {profile.error ? (
        <p className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-900">
          {profile.error.message}
        </p>
      ) : (
        <div className="mt-8">
          <ProfileForm initial={profile.data ?? {}} />
        </div>
      )}
    </div>
  );
}
