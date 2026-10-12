import Image from "next/image";
import Link from "next/link";
import { formatPhoneDisplay, org, telHref, whatsappHref } from "@/lib/org";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-teal-deep text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src={org.logoPath}
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
            />
            <div>
              <p className="font-display text-2xl tracking-tight">{org.shortName}</p>
              <p className="text-sm text-sage">{org.name}</p>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/75">
            Diagnostic excellence in Uyo — laboratory, imaging, and home sample
            collection you can trust.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-sage">
            Visit
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/85">{org.address}</p>
          <p className="mt-2 text-sm text-white/70">{org.hours}</p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-sage">
            Contact
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {org.phones.map((phone) => (
              <li key={phone}>
                <a className="hover:text-sage" href={telHref(phone)}>
                  {formatPhoneDisplay(phone)}
                </a>
              </li>
            ))}
            <li>
              <a className="hover:text-sage" href={`mailto:${org.emails[0]}`}>
                {org.emails[0]}
              </a>
            </li>
            <li>
              <a
                className="hover:text-sage"
                href={whatsappHref("Hello StreamTrust, I need assistance.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {org.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/services" className="hover:text-white">
              Services
            </Link>
            <Link href="/health" className="hover:text-white">
              Health
            </Link>
            <Link href="/home-collection" className="hover:text-white">
              Home kit
            </Link>
            <Link href="/portal/login" className="hover:text-white">
              Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
