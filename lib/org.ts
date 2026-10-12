export const org = {
  name: "StreamTrust Diagnostics",
  shortName: "StreamTrust",
  address:
    "1 Udobio Street, Behind Kilimanjoro, Off Ikot Ekpene Road, Uyo, Akwa Ibom",
  city: "Uyo",
  state: "Akwa Ibom",
  phones: ["08032691000", "08135115577"] as const,
  emails: ["info@streamtrust.com.ng"] as const,
  website: "https://streamtrust.com.ng",
  logoPath: "/streamtrust.png",
  taglines: [
    "Digital Mammography",
    "Digital X-ray",
    "Special X-ray Investigations",
    "Ultrasound Scan",
    "Automated Laboratory",
    "Comprehensive Health Check",
    "Pap Smear",
    "ECG",
  ] as const,
  hours: "Mon–Sat · 8:00 AM – 6:00 PM",
  whatsapp: "2348032691000",
} as const;

export function formatPhoneDisplay(phone: string) {
  return phone.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");
}

export function telHref(phone: string) {
  return `tel:+234${phone.replace(/^0/, "")}`;
}

export function whatsappHref(message?: string) {
  const text = message
    ? `?text=${encodeURIComponent(message)}`
    : "";
  return `https://wa.me/${org.whatsapp}${text}`;
}
