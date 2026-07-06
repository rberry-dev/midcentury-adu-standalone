import { Layout } from "@/components/Layout";
import { PageIntro } from "@/components/PageIntro";
import { useSeo } from "@/lib/seo";

const CSLB_LICENSE = "1234567";
const CSLB_CLASSIFICATION = "B — General Building Contractor";
const LAST_UPDATED = "May 1, 2026";

export default function LicenseInfoPage() {
  useSeo({
    title: "License Information",
    description:
      "ADU Homes Inc. license, bonding, and insurance information, as required by the California Contractors State License Board (CSLB).",
    path: "/license",
  });

  return (
    <Layout>
      <PageIntro
        eyebrow="Legal"
        title={<>License <em className="text-[var(--hemma-blue)]">Information</em></>}
        subtitle={`Last updated ${LAST_UPDATED}`}
      />

      <section className="px-6 md:px-12 pb-20 md:pb-28 bg-[var(--hemma-light)]">
        <div className="max-w-[760px] mx-auto prose-hemma">
          <div className="bg-[var(--hemma-white)] border border-[var(--hemma-sand-dark)] rounded-[6px] p-6 md:p-8 mb-10">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[var(--hemma-mid)] mb-3">
              CSLB Contractor's License
            </p>
            <p className="font-serif text-[28px] md:text-[34px] font-light text-[var(--hemma-black)] leading-[1.15] mb-4">
              Lic. #{CSLB_LICENSE}
            </p>
            <p className="text-[14px] md:text-[15px] font-light text-[var(--hemma-mid)] leading-[1.6] mb-3">
              Classification: {CSLB_CLASSIFICATION}
            </p>
            <p className="text-[13px] font-light text-[var(--hemma-mid)] leading-[1.6]">
              Verify our active license status at the{" "}
              <a
                href={`https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/CheckLicense.aspx?LicNum=${CSLB_LICENSE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--hemma-blue)] underline"
              >
                California Contractors State License Board
              </a>
              .
            </p>
          </div>

          <Section title="About this license">
            <p>
              ADU Homes Inc. holds an active California Contractors State
              License Board (CSLB) license. This license authorizes us to
              perform residential construction, including the design and
              installation of accessory dwelling units (ADUs), throughout the
              state of California.
            </p>
            <p>
              California Business and Professions Code §7030.5 requires that
              every licensed contractor display their license number in all
              advertising. We publish our license number on this page, in our
              footer, and on all written proposals.
            </p>
          </Section>

          <Section title="Bonding and insurance">
            <p>
              In addition to our state license, ADU Homes Inc. carries:
            </p>
            <ul>
              <li>The contractor's bond required by California state law.</li>
              <li>General liability insurance covering on-site construction activities.</li>
              <li>Workers' compensation coverage for all employees.</li>
            </ul>
            <p>
              Certificates of insurance are available on request before any
              project begins.
            </p>
          </Section>

          <Section title="Local permits">
            <p>
              Every Midcentury ADU project is permitted with the homeowner's local
              jurisdiction. We pull and manage permits on your behalf in
              participating Los Angeles County, Orange County, and San Diego
              County cities, and we coordinate inspections through final sign-off.
            </p>
          </Section>

          <Section title="Verify and report">
            <p>
              You can verify any California contractor's license, check for
              complaints, and report concerns at{" "}
              <a
                href="https://www.cslb.ca.gov/"
                target="_blank"
                rel="noopener noreferrer"
              >
                cslb.ca.gov
              </a>
              .
            </p>
          </Section>

          <Section title="Contact us">
            <p>
              ADU Homes Inc.<br />
              Email: <a href="mailto:hello@aduhomesinc.com">hello@aduhomesinc.com</a><br />
              Phone: (310) 555-MCEN
            </p>
          </Section>
        </div>
      </section>
    </Layout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="font-serif text-[22px] md:text-[26px] font-light text-[var(--hemma-black)] mb-4">
        {title}
      </h2>
      <div className="text-[14px] md:text-[15px] font-light leading-[1.75] text-[var(--hemma-mid)] space-y-3 [&_a]:text-[var(--hemma-blue)] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5">
        {children}
      </div>
    </div>
  );
}
