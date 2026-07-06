import { Layout } from "@/components/Layout";
import { PageIntro } from "@/components/PageIntro";
import { useSeo } from "@/lib/seo";

const LAST_UPDATED = "May 1, 2026";

export default function PrivacyPage() {
  useSeo({
    title: "Privacy Policy",
    description:
      "How Midcentury ADU by ADU Homes Inc. collects, uses, and protects personal information from California homeowners exploring an ADU project.",
    path: "/privacy",
  });

  return (
    <Layout>
      <PageIntro
        eyebrow="Legal"
        title={<>Privacy <em className="text-[var(--hemma-blue)]">Policy</em></>}
        subtitle={`Last updated ${LAST_UPDATED}`}
      />

      <section className="px-6 md:px-12 pb-20 md:pb-28 bg-[var(--hemma-light)]">
        <div className="max-w-[760px] mx-auto prose-hemma">
          <Section title="Who we are">
            <p>
              Midcentury ADU is the residential ADU brand of ADU Homes Inc. ("Midcentury ADU," "we,"
              "us"). This Privacy Policy explains how we collect, use, share, and
              protect personal information when you visit our websites, request a
              brochure or consultation, or otherwise interact with us.
            </p>
          </Section>

          <Section title="Information we collect">
            <p>We collect information you provide directly to us, including:</p>
            <ul>
              <li>Contact details such as name, email, phone number, and property address.</li>
              <li>Project information such as ADU model interest, intended use, and timeline.</li>
              <li>Scheduling details for discovery calls (date, time).</li>
              <li>Any optional message or notes you provide.</li>
            </ul>
            <p>
              We also automatically collect limited technical information through
              cookies and analytics pixels, including IP address, device and
              browser type, pages visited, and referring URL. We use Cloudflare
              Turnstile to detect automated traffic on our forms.
            </p>
          </Section>

          <Section title="How we use your information">
            <ul>
              <li>To respond to your inquiries and schedule discovery calls.</li>
              <li>To send you transactional emails (confirmations, calendar invites, project updates) and the brochure or other materials you request.</li>
              <li>To send marketing communications you have opted into. You can unsubscribe from any marketing email at any time.</li>
              <li>To match you with a California-licensed ADU lender, only when you submit our financing form.</li>
              <li>To improve our website, measure ad performance, and prevent fraud.</li>
            </ul>
          </Section>

          <Section title="When we share your information">
            <p>
              We do not sell your personal information for monetary
              consideration. However, our use of advertising and analytics
              cookies (including Google and Meta pixels) may constitute
              "sharing" of personal information for cross-context behavioral
              advertising under the California Privacy Rights Act (CPRA).
              California residents may opt out of this sharing — see "Your
              California privacy rights" below. We share information with:
            </p>
            <ul>
              <li>Service providers who help us operate the site (hosting, email delivery via Resend, bot protection via Cloudflare).</li>
              <li>Advertising and analytics platforms (such as Google and Meta) for measurement and remarketing, where permitted.</li>
              <li>California-licensed lending partners, only when you complete our financing pre-qualification form.</li>
              <li>Law enforcement or other parties when required by law or to protect our rights.</li>
            </ul>
          </Section>

          <Section title="Your California privacy rights (CCPA / CPRA)">
            <p>
              California residents have the right to (a) know what personal
              information we collect and how it is used, (b) request deletion of
              personal information, (c) request correction of inaccurate
              information, (d) opt out of the "sale" or "sharing" of personal
              information for cross-context behavioral advertising, and
              (e) non-discrimination for exercising these rights.
            </p>
            <p>
              To exercise any of these rights, email{" "}
              <a href="mailto:privacy@aduhomesinc.com">privacy@aduhomesinc.com</a>.
              We will verify your request and respond within 45 days.
            </p>
          </Section>

          <Section title="TCPA consent">
            <p>
              By submitting a form on this site that includes a phone number, you
              expressly consent to receive calls and text messages from Midcentury ADU and
              its lending partners about your ADU inquiry, including via
              autodialed or pre-recorded means. Consent is not a condition of
              purchase. Message and data rates may apply. Reply STOP to opt out
              of texts at any time.
            </p>
          </Section>

          <Section title="Cookies and tracking">
            <p>
              We use first- and third-party cookies for analytics, advertising
              measurement, and remarketing. You can control cookies through your
              browser settings or by using the opt-out tools offered by the
              respective ad platforms (Google, Meta).
            </p>
          </Section>

          <Section title="Data retention and security">
            <p>
              We retain personal information for as long as needed to provide our
              services, comply with our legal obligations, resolve disputes, and
              enforce our agreements. We use commercially reasonable
              administrative, technical, and physical safeguards to protect your
              information, but no system can be guaranteed 100% secure.
            </p>
          </Section>

          <Section title="Children's privacy">
            <p>
              Our services are not directed to individuals under 16, and we do
              not knowingly collect personal information from children.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              We may update this Privacy Policy from time to time. The "Last
              updated" date at the top of the page reflects the most recent
              revision.
            </p>
          </Section>

          <Section title="Contact us">
            <p>
              ADU Homes Inc.<br />
              Email: <a href="mailto:privacy@aduhomesinc.com">privacy@aduhomesinc.com</a><br />
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
