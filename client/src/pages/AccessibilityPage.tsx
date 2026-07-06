import { Layout } from "@/components/Layout";
import { PageIntro } from "@/components/PageIntro";
import { useSeo } from "@/lib/seo";

const LAST_UPDATED = "May 1, 2026";

export default function AccessibilityPage() {
  useSeo({
    title: "Accessibility Statement",
    description:
      "Midcentury ADU by ADU Homes Inc. is committed to digital accessibility. Read our accessibility statement, the standards we target, and how to report a barrier.",
    path: "/accessibility",
  });

  return (
    <Layout>
      <PageIntro
        eyebrow="Legal"
        title={<>Accessibility <em className="text-[var(--hemma-blue)]">Statement</em></>}
        subtitle={`Last updated ${LAST_UPDATED}`}
      />

      <section className="px-6 md:px-12 pb-20 md:pb-28 bg-[var(--hemma-light)]">
        <div className="max-w-[760px] mx-auto prose-hemma">
          <Section title="Our commitment">
            <p>
              Midcentury ADU, the residential ADU brand of ADU Homes Inc. ("Midcentury ADU,"
              "we," "us"), is committed to making our website and digital
              services usable by everyone, including people with disabilities.
              We believe good design should welcome every California homeowner,
              regardless of how they access the web.
            </p>
          </Section>

          <Section title="Standard we target">
            <p>
              We aim to conform with the{" "}
              <a
                href="https://www.w3.org/TR/WCAG21/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Web Content Accessibility Guidelines (WCAG) 2.1, Level AA
              </a>{" "}
              published by the World Wide Web Consortium (W3C). These
              guidelines explain how to make web content more accessible to
              people with a wide range of disabilities, including visual,
              auditory, physical, speech, cognitive, language, learning, and
              neurological disabilities.
            </p>
          </Section>

          <Section title="Measures we take">
            <ul>
              <li>Designing pages with semantic HTML and clear heading structure.</li>
              <li>Providing meaningful alternative text for content images and aria-hidden on decorative images.</li>
              <li>Ensuring text and interactive elements meet color-contrast minimums.</li>
              <li>Building forms that work with keyboard navigation and screen readers.</li>
              <li>Reserving image dimensions to prevent layout shift during page load.</li>
              <li>Reviewing new pages and components against WCAG 2.1 AA before publishing.</li>
            </ul>
          </Section>

          <Section title="Known limitations">
            <p>
              Despite our efforts, some content on our website may not yet be
              fully accessible. Areas we are actively working to improve
              include:
            </p>
            <ul>
              <li>PDF brochures and floor plans, which may not be fully tagged for screen-reader compatibility.</li>
              <li>Embedded third-party content (such as scheduling widgets and ad-platform pixels) that we do not directly control.</li>
              <li>Older photography that may lack the level of descriptive alt text we apply to new content.</li>
            </ul>
            <p>
              We are continuously updating these areas and welcome feedback to
              prioritize fixes.
            </p>
          </Section>

          <Section title="Report a barrier or request assistance">
            <p>
              If you experience a barrier accessing any part of our website, or
              if you need information from this site in an alternative format,
              please contact us. We aim to respond within five business days.
            </p>
            <p>
              Email: <a href="mailto:accessibility@aduhomesinc.com">accessibility@aduhomesinc.com</a><br />
              Phone: (310) 555-MCEN<br />
              Mail: ADU Homes Inc., Accessibility Coordinator, Los Angeles, CA
            </p>
            <p>
              When you contact us, please include the page URL, a description
              of the issue, and the assistive technology or browser you were
              using so we can reproduce the problem.
            </p>
          </Section>

          <Section title="Formal complaints">
            <p>
              We welcome the chance to fix issues directly. If you are not
              satisfied with our response, you may also file a complaint with
              the U.S. Department of Justice under the Americans with
              Disabilities Act (ADA), or with the California Department of Fair
              Employment and Housing under the Unruh Civil Rights Act.
            </p>
          </Section>

          <Section title="Ongoing improvement">
            <p>
              Accessibility is an ongoing effort, not a one-time project. We
              periodically review our site, update this statement, and revise
              our practices as standards and tools evolve.
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
