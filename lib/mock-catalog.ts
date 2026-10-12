export type CatalogCategory = {
  id: string;
  name: string;
  description: string;
  slug: string;
};

export type CatalogTest = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  priceNgn: number;
  turnaround: string;
  preparation: string;
  homeCollectionEligible: boolean;
  popular?: boolean;
};

export const categories: CatalogCategory[] = [
  {
    id: "cat-lab",
    name: "Automated Laboratory",
    slug: "laboratory",
    description:
      "Full blood work, chemistry panels, and specialised assays with automated analysers.",
  },
  {
    id: "cat-imaging",
    name: "Imaging & Radiology",
    slug: "imaging",
    description:
      "Digital X-ray, mammography, ultrasound, and specialised radiographic investigations.",
  },
  {
    id: "cat-cardiac",
    name: "Cardiac & ECG",
    slug: "cardiac",
    description: "Electrocardiography and heart-health screening.",
  },
  {
    id: "cat-womens",
    name: "Women's Health",
    slug: "womens-health",
    description: "Pap smear, mammography, and reproductive health checks.",
  },
  {
    id: "cat-packages",
    name: "Health Check Packages",
    slug: "packages",
    description: "Bundled comprehensive screenings for individuals and families.",
  },
];

export const tests: CatalogTest[] = [
  {
    id: "test-fbc",
    categoryId: "cat-lab",
    name: "Full Blood Count (FBC)",
    slug: "full-blood-count",
    description:
      "Complete blood count including haemoglobin, white cells, platelets, and indices.",
    priceNgn: 4500,
    turnaround: "Same day",
    preparation: "No special preparation required.",
    homeCollectionEligible: true,
    popular: true,
  },
  {
    id: "test-lft",
    categoryId: "cat-lab",
    name: "Liver Function Test (LFT)",
    slug: "liver-function-test",
    description: "AST, ALT, bilirubin, ALP, and related liver enzymes.",
    priceNgn: 8000,
    turnaround: "Same day",
    preparation: "Prefer fasting 8–12 hours; water allowed.",
    homeCollectionEligible: true,
  },
  {
    id: "test-rft",
    categoryId: "cat-lab",
    name: "Kidney Function Test (RFT)",
    slug: "kidney-function-test",
    description: "Urea, creatinine, electrolytes, and eGFR estimate.",
    priceNgn: 7500,
    turnaround: "Same day",
    preparation: "Stay hydrated; avoid heavy protein meal beforehand.",
    homeCollectionEligible: true,
  },
  {
    id: "test-lipid",
    categoryId: "cat-lab",
    name: "Lipid Profile",
    slug: "lipid-profile",
    description: "Total cholesterol, HDL, LDL, and triglycerides.",
    priceNgn: 6500,
    turnaround: "Same day",
    preparation: "Fasting 9–12 hours recommended.",
    homeCollectionEligible: true,
    popular: true,
  },
  {
    id: "test-hba1c",
    categoryId: "cat-lab",
    name: "HbA1c (Glycated Haemoglobin)",
    slug: "hba1c",
    description: "Three-month average blood sugar control marker.",
    priceNgn: 7000,
    turnaround: "Same day",
    preparation: "No fasting required.",
    homeCollectionEligible: true,
  },
  {
    id: "test-malaria",
    categoryId: "cat-lab",
    name: "Malaria Parasite (MP)",
    slug: "malaria-parasite",
    description: "Microscopy / rapid detection of malaria parasites.",
    priceNgn: 2500,
    turnaround: "Within 2 hours",
    preparation: "No special preparation.",
    homeCollectionEligible: true,
  },
  {
    id: "test-thyroid",
    categoryId: "cat-lab",
    name: "Thyroid Function (TSH, T3, T4)",
    slug: "thyroid-function",
    description: "TSH with free T3 and free T4 for thyroid assessment.",
    priceNgn: 15000,
    turnaround: "24–48 hours",
    preparation: "No fasting required; list current medications.",
    homeCollectionEligible: true,
  },
  {
    id: "test-xray-chest",
    categoryId: "cat-imaging",
    name: "Digital Chest X-ray",
    slug: "digital-chest-xray",
    description: "High-resolution digital radiograph of the chest.",
    priceNgn: 8000,
    turnaround: "Same day report",
    preparation: "Remove jewellery and metal objects from the chest area.",
    homeCollectionEligible: false,
    popular: true,
  },
  {
    id: "test-xray-special",
    categoryId: "cat-imaging",
    name: "Special X-ray Investigation",
    slug: "special-xray",
    description:
      "Contrast or specialised radiographic studies (e.g. IVU, barium series) as requested.",
    priceNgn: 25000,
    turnaround: "Same day to 48 hours",
    preparation: "Depends on study — our team will brief you when booking.",
    homeCollectionEligible: false,
  },
  {
    id: "test-mammo",
    categoryId: "cat-imaging",
    name: "Digital Mammography",
    slug: "digital-mammography",
    description: "Digital breast imaging for screening and diagnostic evaluation.",
    priceNgn: 35000,
    turnaround: "Same day report",
    preparation:
      "Avoid deodorant/powder on the day; schedule ideally 1 week after period starts.",
    homeCollectionEligible: false,
    popular: true,
  },
  {
    id: "test-uss-abd",
    categoryId: "cat-imaging",
    name: "Abdominal Ultrasound",
    slug: "abdominal-ultrasound",
    description: "Ultrasound scan of abdominal organs.",
    priceNgn: 12000,
    turnaround: "Same day",
    preparation: "Fasting 6–8 hours; full bladder may be required.",
    homeCollectionEligible: false,
    popular: true,
  },
  {
    id: "test-uss-obs",
    categoryId: "cat-imaging",
    name: "Obstetric Ultrasound",
    slug: "obstetric-ultrasound",
    description: "Pregnancy ultrasound for viability, dating, and anomaly screening.",
    priceNgn: 10000,
    turnaround: "Same day",
    preparation: "Full bladder for early pregnancy scans.",
    homeCollectionEligible: false,
  },
  {
    id: "test-uss-pelvic",
    categoryId: "cat-imaging",
    name: "Pelvic Ultrasound",
    slug: "pelvic-ultrasound",
    description: "Pelvic organ assessment via ultrasound.",
    priceNgn: 10000,
    turnaround: "Same day",
    preparation: "Full bladder usually required.",
    homeCollectionEligible: false,
  },
  {
    id: "test-ecg",
    categoryId: "cat-cardiac",
    name: "ECG (Electrocardiogram)",
    slug: "ecg",
    description: "12-lead ECG recording of heart rhythm and conduction.",
    priceNgn: 5000,
    turnaround: "Immediate tracing; report same day",
    preparation: "Wear clothing that allows easy access to the chest.",
    homeCollectionEligible: false,
    popular: true,
  },
  {
    id: "test-pap",
    categoryId: "cat-womens",
    name: "Pap Smear",
    slug: "pap-smear",
    description: "Cervical cytology screening for early detection of cell changes.",
    priceNgn: 8000,
    turnaround: "3–5 working days",
    preparation:
      "Avoid intercourse, douching, or vaginal creams 24–48 hours before the test.",
    homeCollectionEligible: false,
    popular: true,
  },
  {
    id: "test-package-basic",
    categoryId: "cat-packages",
    name: "Basic Health Check",
    slug: "basic-health-check",
    description: "FBC, fasting sugar, urinalysis, and blood pressure check.",
    priceNgn: 15000,
    turnaround: "Same day",
    preparation: "Fasting 8–12 hours recommended.",
    homeCollectionEligible: true,
  },
  {
    id: "test-package-comp",
    categoryId: "cat-packages",
    name: "Comprehensive Health Check",
    slug: "comprehensive-health-check",
    description:
      "Extended panel: FBC, LFT, RFT, lipid, HbA1c, urinalysis, ECG, and chest X-ray.",
    priceNgn: 55000,
    turnaround: "Same day to 24 hours",
    preparation: "Fasting 8–12 hours; bring prior reports if available.",
    homeCollectionEligible: false,
    popular: true,
  },
  {
    id: "test-package-exec",
    categoryId: "cat-packages",
    name: "Executive Wellness Package",
    slug: "executive-wellness",
    description:
      "Comprehensive labs plus ultrasound, ECG, and physician review coordination.",
    priceNgn: 95000,
    turnaround: "24–48 hours",
    preparation: "Fasting required; appointment preferred.",
    homeCollectionEligible: false,
  },
];

export function formatNgn(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getCategoryById(id: string) {
  return categories.find((c) => c.id === id);
}

export function getTestById(id: string) {
  return tests.find((t) => t.id === id);
}

export function getTestBySlug(slug: string) {
  return tests.find((t) => t.slug === slug);
}

export function getTestsByCategory(categoryId: string) {
  return tests.filter((t) => t.categoryId === categoryId);
}

export function getHomeCollectionTests() {
  return tests.filter((t) => t.homeCollectionEligible);
}

export function searchTests(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return tests;
  return tests.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      getCategoryById(t.categoryId)?.name.toLowerCase().includes(q),
  );
}
