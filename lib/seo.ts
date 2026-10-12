import type { Metadata } from "next";
import { formatNgn, type CatalogTest } from "@/lib/mock-catalog";
import { org } from "@/lib/org";

type SeoEntry = { title: string; description: string };

export const seoCopy = {
  home: {
    title: "StreamTrust Diagnostics | Tests and Imaging in Uyo",
    description:
      "StreamTrust Diagnostics — digital mammography, X-ray, ultrasound, automated laboratory, ECG, Pap smear, and home sample collection in Uyo, Akwa Ibom.",
  },
  about: {
    title: "About StreamTrust Diagnostics in Uyo, Akwa Ibom State",
    description:
      "About StreamTrust Diagnostics in Uyo, Akwa Ibom. Digital mammography, X-ray, ultrasound, automated laboratory, ECG, Pap smear, and home sample kits.",
  },
  contact: {
    title: "Contact StreamTrust Diagnostics in Uyo, Akwa Ibom State",
    description:
      "Contact StreamTrust Diagnostics at 1 Udobio Street, Uyo. Call 0803 269 1000, email info@streamtrust.com.ng, or WhatsApp. Open Mon-Sat, 8am-6pm.",
  },
  health: {
    title: "Health Topics and Screening | StreamTrust Diagnostics",
    description:
      "Guides from StreamTrust Diagnostics in Uyo on breast cancer, prostate cancer, HIV, cervical screening, diabetes, and heart health. Book a visit.",
  },
  gallery: {
    title: "Our Centre Photo Gallery | StreamTrust Diagnostics",
    description:
      "Photos from StreamTrust Diagnostics in Uyo — our team, the laboratory, and health awareness at the centre on Udobio Street, Akwa Ibom.",
  },
  services: {
    title: "All Diagnostic Test Prices | StreamTrust Diagnostics",
    description:
      "Browse laboratory, imaging, ECG, Pap smear, and health-check prices at StreamTrust Diagnostics in Uyo. Fees in naira, with home kits for eligible tests.",
  },
  homeCollection: {
    title: "Request a Home Sample Kit | StreamTrust Diagnostics",
    description:
      "Request a home sample kit from StreamTrust Diagnostics in Uyo. We deliver the kit, you collect the sample, and return it for laboratory analysis.",
  },
  book: {
    title: "Book Your Diagnostic Visit | StreamTrust Diagnostics",
    description:
      "Book a diagnostic visit at StreamTrust Diagnostics in Uyo. Choose a specialty and date for laboratory, imaging, ECG, or women's health tests.",
  },
  portal: {
    title: "Patient Portal Dashboard | StreamTrust Diagnostics",
    description:
      "Your StreamTrust Diagnostics patient portal in Uyo. Review upcoming appointments, laboratory reports, and billing after you sign in.",
  },
  portalLogin: {
    title: "Sign In to Patient Portal | StreamTrust Diagnostics",
    description:
      "Sign in to the StreamTrust Diagnostics patient portal with your Patient ID and date of birth to view reports, bills, and appointments.",
  },
  portalProfile: {
    title: "Edit Your Patient Profile | StreamTrust Diagnostics",
    description:
      "Update the contact details on your StreamTrust Diagnostics patient record. Profile changes are available to signed-in patients in Uyo.",
  },
  portalBilling: {
    title: "Patient Bills and Invoices | StreamTrust Diagnostics",
    description:
      "Review invoices and payments on your StreamTrust Diagnostics patient account. Billing details are shown after you sign in to the portal.",
  },
  portalAppointments: {
    title: "Your Centre Appointments | StreamTrust Diagnostics",
    description:
      "See diagnostic appointments at StreamTrust Diagnostics in Uyo. Upcoming visits and history are listed for signed-in patient portal users.",
  },
  portalReports: {
    title: "Patient Laboratory Reports | StreamTrust Diagnostics",
    description:
      "Open laboratory and imaging reports from StreamTrust Diagnostics in Uyo. Reports appear in the patient portal after you sign in.",
  },
} as const satisfies Record<string, SeoEntry>;

const TITLE_OVERRIDES: Record<string, string> = {
  "Pap Smear": "Pap Smear Screening in Uyo | StreamTrust Diagnostics",
};

const DESCRIPTION_OVERRIDES: Record<string, string> = {
  "Special X-ray Investigation":
    "Special X-ray studies at StreamTrust Diagnostics, Uyo. Contrast exams such as IVU or barium, arranged when your clinician requests them. From ₦25,000.",
  "Comprehensive Health Check":
    "Book a Comprehensive Health Check at StreamTrust Diagnostics, Uyo. Includes FBC, LFT, RFT, lipids, HbA1c, ECG, and a chest X-ray. From ₦55,000.",
};

function inRange(value: string, min: number, max: number) {
  return value.length >= min && value.length <= max;
}

export function testTitle(name: string) {
  const override = TITLE_OVERRIDES[name];
  if (override) return override;

  const options = [
    `${name} at StreamTrust Diagnostics, Uyo`,
    `${name} | StreamTrust Diagnostics, Uyo`,
    `${name} in Uyo | StreamTrust Diagnostics`,
    `${name} Test in Uyo | StreamTrust Diagnostics`,
    `${name} | StreamTrust Diagnostics`,
  ];
  const title = options.find((option) => inRange(option, 50, 60));
  if (!title) {
    throw new Error(`No 50–60 character title for ${name}`);
  }
  return title;
}

export function testDescription(
  test: Pick<
    CatalogTest,
    "name" | "description" | "priceNgn" | "homeCollectionEligible"
  >,
) {
  const override = DESCRIPTION_OVERRIDES[test.name];
  if (override) return override;

  const price = formatNgn(test.priceNgn);
  const visit = test.homeCollectionEligible
    ? "Home sample kits are available."
    : "Done at our Uyo centre.";
  const options = [
    `${test.name} at StreamTrust Diagnostics in Uyo. ${test.description} ${visit} From ${price}.`,
    `Book ${test.name} at StreamTrust Diagnostics, Uyo. ${test.description} From ${price}.`,
    `${test.name} in Uyo, StreamTrust Diagnostics. ${test.description} ${visit} From ${price}.`,
    `${test.name} at StreamTrust Diagnostics, Uyo, Akwa Ibom. ${test.description} From ${price}.`,
  ];
  const description = options.find((option) => inRange(option, 120, 155));
  if (!description) {
    throw new Error(`No 120–155 character description for ${test.name}`);
  }
  return description;
}

export function pageMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  if (!inRange(title, 50, 60)) {
    throw new Error(`Title is ${title.length} characters (want 50–60): ${title}`);
  }
  if (!inRange(description, 120, 155)) {
    throw new Error(
      `Description is ${description.length} characters (want 120–155): ${description}`,
    );
  }

  const canonical = path === "/" ? "/" : path;
  const url = canonical === "/" ? org.website : `${org.website}${canonical}`;
  const image = {
    url: "/opengraph-image",
    width: 1200,
    height: 630,
    alt: "StreamTrust Diagnostics, laboratory and imaging in Uyo",
  };

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url,
      siteName: org.name,
      locale: "en_NG",
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function absoluteUrl(path: string) {
  return path === "/" ? org.website : `${org.website}${path}`;
}

export function medicalClinicJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: org.name,
    url: org.website,
    image: `${org.website}/streamtrust.png`,
    logo: `${org.website}/streamtrust.png`,
    telephone: org.phones.map((phone) => `+234${phone.replace(/^0/, "")}`),
    email: org.emails[0],
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "1 Udobio Street, Behind Kilimanjoro, Off Ikot Ekpene Road",
      addressLocality: org.city,
      addressRegion: org.state,
      addressCountry: "NG",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "08:00",
      closes: "18:00",
    },
    areaServed: {
      "@type": "City",
      name: org.city,
    },
  };
}

export function breadcrumbNode(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceNode(
  test: Pick<CatalogTest, "name" | "slug" | "description" | "priceNgn" | "homeCollectionEligible">,
) {
  return {
    "@type": "Service",
    name: test.name,
    serviceType: test.name,
    description: testDescription(test),
    url: absoluteUrl(`/services/${test.slug}`),
    areaServed: org.city,
    provider: {
      "@type": "MedicalClinic",
      name: org.name,
      url: org.website,
    },
    offers: {
      "@type": "Offer",
      price: test.priceNgn,
      priceCurrency: "NGN",
      url: absoluteUrl(`/services/${test.slug}`),
    },
  };
}
