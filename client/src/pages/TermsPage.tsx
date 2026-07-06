import { Layout } from "@/components/Layout";
import { PageIntro } from "@/components/PageIntro";
import { useSeo } from "@/lib/seo";

const LAST_UPDATED = "May 1, 2026";

export default function TermsPage() {
  useSeo({
    title: "Terms of Service",
    description:
      "Terms of service for using the Midcentury ADU by ADU Homes Inc. website, brochure, and discovery-call booking system.",
    path: "/terms",
  });

  return (
    <Layout>
      <PageIntro
        eyebrow="Legal"
        title={<>Terms of <em className="text-[var(--hemma-blue)]">Service</em></>}
        subtitle={`Last updated ${LAST_UPDATED}`}
      />

      <section className="px-6 md:px-12 pb-20 md:pb-28 bg-[var(--hemma-light)]">
        <div className="max-w-[760px] mx-auto">
          <Section title="Acceptance of terms">
            <p>
              These Terms of Service ("Terms") govern your access to and use of
              the websites, content, and online services (collectively, the
              "Services") offered by ADU Homes Inc. ("Midcentury ADU," "we," "us"). By
              accessing or using the Services, you agree to be bound by these
              Terms. If you do not agree, do not use the Services.
            </p>
          </Section>

          <Section title="No warranty; informational only">
            <p>
              All content on the Services — including floor plans, pricing
              estimates, the financing calculator, and timelines — is provided
              for informational purposes only and may change without notice.
              Pricing, availability, financing terms, build timelines, and
              regulatory requirements vary by jurisdiction and project. Nothing
              on the Services constitutes a binding offer, contract, financial
              advice, or legal advice. A binding agreement is created only by a
              signed written contract.
            </p>
          </Section>

          <Section title="Financing calculator and lender introductions">
            <p>
              Our financing calculator produces estimated payments based on
              inputs you provide and is not a loan offer or commitment to lend.
              When you submit our financing pre-qualification form, we may
              introduce you to one or more California-licensed lending partners.
              We are not a lender, mortgage broker, or financial advisor. All
              loan terms, qualification decisions, and rates are determined by
              the lender, not by us.
            </p>
          </Section>

          <Section title="Discovery calls and scheduling">
            <p>
              Discovery calls are 30-minute introductory conversations and do
              not create any obligation on either party. We may reschedule or
              cancel a booked call with reasonable notice. Recording of calls,
              if any, will be disclosed at the start of the call.
            </p>
          </Section>

          <Section title="Acceptable use">
            <p>You agree not to:</p>
            <ul>
              <li>Submit false, misleading, or impersonating information through any form.</li>
              <li>Use bots, scrapers, or automated tools to access the Services or bypass our bot-protection measures.</li>
              <li>Interfere with the Services' security, availability, or other users' use.</li>
              <li>Use the Services for any unlawful purpose or in violation of any applicable law.</li>
            </ul>
          </Section>

          <Section title="Intellectual property">
            <p>
              All content on the Services — including text, photographs,
              renderings, logos, floor-plan drawings, and the Midcentury ADU name and
              brand — is owned by ADU Homes Inc. or its licensors and protected
              by U.S. and international intellectual-property laws. You may view
              and share links to our content for personal, non-commercial use.
              Any other use requires prior written permission.
            </p>
          </Section>

          <Section title="Third-party services and links">
            <p>
              The Services may include links to third-party websites or services
              we do not control (lender sites, payment processors, social
              networks). We are not responsible for the content, policies, or
              practices of any third party.
            </p>
          </Section>

          <Section title="Disclaimer of warranties">
            <p className="uppercase text-[12px] tracking-[0.06em] leading-[1.7]">
              The services are provided "as is" and "as available" without
              warranties of any kind, whether express or implied, including any
              implied warranties of merchantability, fitness for a particular
              purpose, or non-infringement. We do not warrant that the services
              will be uninterrupted, error-free, or secure.
            </p>
          </Section>

          <Section title="Limitation of liability">
            <p className="uppercase text-[12px] tracking-[0.06em] leading-[1.7]">
              To the maximum extent permitted by law, ADU Homes Inc. and its
              affiliates, officers, employees, and agents will not be liable for
              any indirect, incidental, special, consequential, or punitive
              damages, or any loss of profits or revenues, arising from your use
              of the services. Our total liability for any claim arising out of
              or relating to these terms or the services will not exceed one
              hundred U.S. dollars (US$100).
            </p>
          </Section>

          <Section title="Indemnification">
            <p>
              You agree to indemnify and hold ADU Homes Inc. harmless from any
              claim, loss, or expense (including reasonable attorneys' fees)
              arising out of your breach of these Terms or your misuse of the
              Services.
            </p>
          </Section>

          <Section title="Governing law and venue">
            <p>
              These Terms are governed by the laws of the State of California,
              without regard to its conflict-of-laws rules. Any dispute arising
              out of these Terms or the Services will be resolved exclusively in
              the state or federal courts located in Los Angeles County,
              California, and you consent to personal jurisdiction there.
            </p>
          </Section>

          <Section title="Changes to these terms">
            <p>
              We may update these Terms from time to time. Continued use of the
              Services after an update constitutes acceptance of the revised
              Terms.
            </p>
          </Section>

          <Section title="Contact">
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
