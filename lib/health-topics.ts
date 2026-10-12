export const healthDisclaimer =
  "This page is general information for patients in Uyo. It is not a diagnosis or a personal medical plan. Talk with a clinician about which tests are right for you, and read results with your doctor.";

export type HealthSection = {
  heading: string;
  paragraphs: string[];
};

export type HealthTopic = {
  slug: string;
  imagePrefix: string;
  title: string;
  eyebrow: string;
  seoTitle: string;
  seoDescription: string;
  summary: string;
  sections: HealthSection[];
  relatedServiceSlugs: string[];
};

export const healthTopics: HealthTopic[] = [
  {
    slug: "breast-cancer",
    imagePrefix: "breast_cancer",
    title: "Breast cancer awareness",
    eyebrow: "Screening",
    seoTitle: "Breast Cancer Awareness in Uyo | StreamTrust Diagnostics",
    seoDescription:
      "Learn why breast screening matters and how digital mammography at StreamTrust Diagnostics in Uyo can help find changes early. Book a visit.",
    summary:
      "Breast cancer starts in breast tissue. Screening looks for changes before they cause symptoms, and a mammogram is a common way to do that.",
    sections: [
      {
        heading: "What it is",
        paragraphs: [
          "Breast cancer is a growth of abnormal cells in the breast. It can affect women, and less often men. A lump is one possible sign. Skin dimpling, nipple discharge, or a change in breast shape are others. Many people have no symptom at all when a change is first found.",
        ],
      },
      {
        heading: "Why early testing matters",
        paragraphs: [
          "Finding a change early often means more choices for care. Digital mammography takes X-ray images of the breast so a clinician can look for changes that are too small to feel.",
          "A mammogram is a screening or diagnostic image. It does not, by itself, confirm cancer. If something needs a closer look, your clinician will explain the next step.",
        ],
      },
      {
        heading: "Who is often screened",
        paragraphs: [
          "Many screening programmes invite women from about age 40, and earlier when a clinician advises it because of family history or a breast change. Do not wait for a birthday if you notice a new lump or nipple change — ask to be assessed.",
          "StreamTrust Diagnostics offers digital mammography at our Uyo centre. Our team explains how to prepare when you book.",
        ],
      },
    ],
    relatedServiceSlugs: ["digital-mammography"],
  },
  {
    slug: "prostate-cancer",
    imagePrefix: "prostate_cancer",
    title: "Prostate cancer awareness",
    eyebrow: "Men's health",
    seoTitle: "Prostate Cancer Screening in Uyo | StreamTrust Diagnostics",
    seoDescription:
      "Plain-language notes on prostate cancer screening for men in Uyo. StreamTrust Diagnostics explains who to talk with and how to arrange a visit.",
    summary:
      "The prostate is a small gland below the bladder. Cancer there is often slow-growing, and some cases need prompt attention. A clinician helps decide if testing is useful.",
    sections: [
      {
        heading: "What it is",
        paragraphs: [
          "Prostate cancer begins in the prostate gland, which sits under the bladder in men. Early disease often causes no symptoms. Later changes can include a weak urine stream, needing to pass urine more often, or blood in the urine. Those symptoms have many causes that are not cancer.",
        ],
      },
      {
        heading: "Why a conversation about testing matters",
        paragraphs: [
          "Prostate checks are usually a shared decision with a clinician. They may include questions about symptoms, an examination, and a blood test. Testing is not automatic for every man, because some results need careful follow-up.",
          "Family history, age, and urinary changes are common reasons to ask. Many men start that conversation around age 50, and earlier if a close relative had prostate cancer.",
        ],
      },
      {
        heading: "How to arrange a visit",
        paragraphs: [
          "Call StreamTrust Diagnostics or book a visit and tell us you want to discuss prostate testing. We will confirm which tests are available at the centre and what to expect on the day.",
        ],
      },
    ],
    relatedServiceSlugs: [],
  },
  {
    slug: "hiv-testing",
    imagePrefix: "hiv",
    title: "HIV testing",
    eyebrow: "Testing",
    seoTitle: "HIV Testing and Awareness in Uyo | StreamTrust Diagnostics",
    seoDescription:
      "What an HIV test is for, who should consider one, and how to arrange testing at StreamTrust Diagnostics in Uyo. General information, not a diagnosis.",
    summary:
      "HIV is a virus that affects the immune system. Many people feel well for years. A test is the way to know your status.",
    sections: [
      {
        heading: "What it is",
        paragraphs: [
          "HIV (human immunodeficiency virus) weakens the body's defence against infections over time if it is not treated. You cannot tell by looking at someone whether they have HIV. A laboratory test is how status is known.",
        ],
      },
      {
        heading: "Why testing matters",
        paragraphs: [
          "Knowing your status lets you start care if the result is positive, and it helps you protect partners. Modern treatment allows many people with HIV to live long, healthy lives. A negative result is also useful — it is a chance to ask how to stay negative.",
          "Testing is a private medical service. Results should be explained by a clinician, not read alone from a sheet of paper.",
        ],
      },
      {
        heading: "Who should consider a test",
        paragraphs: [
          "Anyone who wants to know can ask for a test. It is especially worth discussing after a possible exposure, with a new partner, during pregnancy, or as part of routine care. You do not need to feel ill.",
          "Contact StreamTrust Diagnostics to ask which HIV-related tests we run and how to book. We will tell you what is available before you visit.",
        ],
      },
    ],
    relatedServiceSlugs: [],
  },
  {
    slug: "cervical-screening",
    imagePrefix: "cervical",
    title: "Cervical screening",
    eyebrow: "Women's health",
    seoTitle: "Cervical Screening in Uyo | StreamTrust Diagnostics",
    seoDescription:
      "Why a Pap smear looks for cervical cell changes, who is often screened, and how to book cervical screening at StreamTrust Diagnostics in Uyo.",
    summary:
      "Cervical screening looks for cell changes on the cervix before they become cancer. A Pap smear is the test we offer for that check.",
    sections: [
      {
        heading: "What it is",
        paragraphs: [
          "The cervix is the lower part of the womb. Cervical cancer usually develops slowly from cell changes. A Pap smear collects a small sample of those cells so they can be examined in the laboratory.",
        ],
      },
      {
        heading: "Why screening matters",
        paragraphs: [
          "Cell changes often cause no pain. Screening is how they are found while they are still easier to assess. An abnormal smear is not the same as a cancer diagnosis. It means a clinician should review the result with you.",
        ],
      },
      {
        heading: "Who is often screened",
        paragraphs: [
          "People with a cervix are often invited from about age 25, on a schedule a clinician recommends. Screening still matters if you feel well. Tell us if you are pregnant or have had a recent gynaecology procedure so we can advise on timing.",
          "Book a Pap smear at our Uyo centre. The team explains simple preparation steps when you schedule the visit.",
        ],
      },
    ],
    relatedServiceSlugs: ["pap-smear"],
  },
  {
    slug: "diabetes",
    imagePrefix: "diabetes",
    title: "Diabetes screening",
    eyebrow: "Laboratory",
    seoTitle: "Diabetes Screening in Uyo | StreamTrust Diagnostics",
    seoDescription:
      "How HbA1c is used in diabetes screening, who may need the test, and how to book it at StreamTrust Diagnostics in Uyo, Akwa Ibom State.",
    summary:
      "Diabetes means blood sugar stays higher than it should. An HbA1c test reflects average sugar over recent months and is used for screening and monitoring.",
    sections: [
      {
        heading: "What it is",
        paragraphs: [
          "Diabetes affects how the body handles sugar. Over time, high sugar can harm the heart, kidneys, eyes, and nerves. Some people are diagnosed after thirst, frequent urination, tiredness, or weight change. Others are found on a routine blood test.",
        ],
      },
      {
        heading: "Why the test matters",
        paragraphs: [
          "HbA1c (glycated haemoglobin) does not depend on a single meal the way a finger-prick sugar reading can. Clinicians use it to see whether sugar has been high over the past few months, and to follow people who already know they have diabetes.",
          "The number is interpreted with your history. It is not a diagnosis on its own.",
        ],
      },
      {
        heading: "Who may need it",
        paragraphs: [
          "Ask about HbA1c if you have symptoms, a family history of diabetes, or you are booking a health check. People already on treatment use it to see how control is going.",
          "You can book HbA1c at StreamTrust Diagnostics in Uyo. Fasting rules, if any, are confirmed when you book.",
        ],
      },
    ],
    relatedServiceSlugs: ["hba1c"],
  },
  {
    slug: "heart-health",
    imagePrefix: "heart_health",
    title: "Heart health",
    eyebrow: "Heart checks",
    seoTitle: "Heart Health Screening in Uyo | StreamTrust Diagnostics",
    seoDescription:
      "How lipid tests and an ECG support heart checks, who may benefit, and how to book them at StreamTrust Diagnostics in Uyo. Talk with your clinician.",
    summary:
      "Heart risk is checked in more than one way. A lipid profile looks at cholesterol in the blood. An ECG records the heart's electrical activity.",
    sections: [
      {
        heading: "What these checks look at",
        paragraphs: [
          "A lipid profile measures fats in the blood, including cholesterol. High levels over many years raise the chance of heart and blood-vessel disease. An ECG (electrocardiogram) is a short, painless tracing of the heartbeat. It can show rhythm problems and some signs of strain on the heart.",
        ],
      },
      {
        heading: "Why they are used",
        paragraphs: [
          "Neither test diagnoses every heart condition. Together with blood pressure, symptoms, and your history, they give a clinician a clearer picture. Chest pain, breathlessness, or fainting need urgent medical care — do not wait for a routine appointment.",
        ],
      },
      {
        heading: "Who may benefit",
        paragraphs: [
          "Adults are often offered these checks if they have high blood pressure, diabetes, smoke, or a family history of early heart disease. They are also part of several StreamTrust health-check packages.",
          "Book a lipid profile, an ECG, or both at our Uyo centre. We will tell you if fasting is needed for the blood test.",
        ],
      },
    ],
    relatedServiceSlugs: ["lipid-profile", "ecg"],
  },
];

export function getHealthTopic(slug: string) {
  return healthTopics.find((topic) => topic.slug === slug);
}
