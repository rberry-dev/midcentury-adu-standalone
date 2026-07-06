import { Resend } from "resend";
import { logger } from "./logger";

const apiKey = process.env.RESEND_API_KEY;
const fromAddress =
  process.env.RESEND_FROM_EMAIL ?? "Midcentury ADU <onboarding@resend.dev>";
const notifyTo = (process.env.LEAD_NOTIFICATION_TO ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const adminBaseUrl = process.env.ADMIN_BASE_URL ?? "";

const resend = apiKey ? new Resend(apiKey) : null;

export interface LeadEmailInput {
  id: number;
  source: string;
  email: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  zip: string | null;
  modelInterest: string | null;
  intendedUse: string | null;
  processStage: string | null;
  message: string | null;
  scheduledAt: Date | null;
}

const SOURCE_LABEL: Record<string, string> = {
  discovery_call: "Discovery Call",
  brochure: "Brochure Download",
  financing: "Financing Pre-Qualification",
  newsletter: "Newsletter Signup",
  contact: "Contact Form",
};

const SOURCE_SUBJECT: Record<string, string> = {
  discovery_call: "Your Midcentury ADU discovery call is confirmed",
  brochure: "Your Midcentury ADU brochure",
  financing: "We received your financing request",
  newsletter: "Welcome to Midcentury ADU",
  contact: "Thanks for reaching out to Midcentury ADU",
};

function fmtPT(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(d);
}

function sanitizeHeader(s: string | null | undefined, max = 200): string {
  if (!s) return "";
  return s
    .replace(/[\r\n\u0000-\u001F\u007F]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function escapeIcsText(s: string | null | undefined): string {
  if (!s) return "";
  return s
    .replace(/[\r\n\u0000-\u001F\u007F]+/g, " ")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .trim();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function toIcsDate(d: Date): string {
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

function buildIcs(lead: LeadEmailInput): string | null {
  if (!lead.scheduledAt) return null;
  const start = lead.scheduledAt;
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const uid = `midcentury-adu-lead-${lead.id}@aduhomesinc.com`;
  const summary = "Midcentury ADU Discovery Call";
  const description =
    "Discovery call with the Midcentury ADU team to discuss your ADU project. " +
    "We'll cover models, timelines, financing, and answer any questions.";
  const organizerEmail = sanitizeHeader(notifyTo[0] ?? "hello@aduhomesinc.com");
  const attendeeEmail = sanitizeHeader(lead.email);
  const attendeeName = escapeIcsText(lead.name ?? lead.email);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Midcentury ADU//ADU Homes//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${escapeIcsText(uid)}`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeIcsText(summary)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `ORGANIZER;CN=Midcentury ADU:mailto:${organizerEmail}`,
    `ATTENDEE;CN=${attendeeName};RSVP=TRUE:mailto:${attendeeEmail}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

const BRAND_BLUE = "#004E89";
const BRAND_SAND = "#F5F1EA";
const BRAND_BLACK = "#1A1A1A";
const BRAND_MID = "#6B6B6B";

function emailShell(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:${BRAND_SAND};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${BRAND_BLACK};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND_SAND};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:6px;overflow:hidden;">
        <tr><td style="padding:28px 32px;border-bottom:1px solid #eee;">
          <div style="font-size:13px;font-weight:600;letter-spacing:0.18em;color:${BRAND_BLUE};text-transform:uppercase;">Midcentury ADU</div>
          <div style="font-size:11px;color:${BRAND_MID};margin-top:2px;">by ADU Homes</div>
        </td></tr>
        <tr><td style="padding:32px;font-size:15px;line-height:1.6;color:${BRAND_BLACK};">
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:20px 32px;border-top:1px solid #eee;font-size:12px;color:${BRAND_MID};line-height:1.6;">
          Midcentury ADU by ADU Homes &middot; California &middot; <a href="https://aduhomesinc.com" style="color:${BRAND_BLUE};text-decoration:none;">aduhomesinc.com</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function leadDetailRows(lead: LeadEmailInput): string {
  const rows: Array<[string, string | null]> = [
    ["Source", SOURCE_LABEL[lead.source] ?? lead.source],
    ["Name", lead.name],
    ["Email", lead.email],
    ["Phone", lead.phone],
    ["Address", lead.address],
    ["ZIP", lead.zip],
    ["Model interest", lead.modelInterest],
    ["Intended use", lead.intendedUse],
    ["Process stage", lead.processStage],
    [
      "Scheduled time",
      lead.scheduledAt ? fmtPT(lead.scheduledAt) : null,
    ],
    ["Message", lead.message],
  ];
  return rows
    .filter(([, v]) => v && String(v).trim().length > 0)
    .map(
      ([k, v]) =>
        `<tr>
          <td style="padding:8px 0;color:${BRAND_MID};font-size:13px;width:140px;vertical-align:top;">${escapeHtml(k)}</td>
          <td style="padding:8px 0;color:${BRAND_BLACK};font-size:14px;">${escapeHtml(String(v))}</td>
        </tr>`,
    )
    .join("");
}

function buildNotificationEmail(lead: LeadEmailInput): {
  subject: string;
  html: string;
  text: string;
} {
  const label = SOURCE_LABEL[lead.source] ?? lead.source;
  const safeName = sanitizeHeader(lead.name, 80);
  const headline = safeName
    ? `New lead: ${safeName} (${label})`
    : `New lead: ${label}`;
  const adminLink = adminBaseUrl
    ? `<p style="margin:24px 0 0 0;"><a href="${escapeHtml(adminBaseUrl)}/admin/leads" style="display:inline-block;background:${BRAND_BLUE};color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-size:14px;font-weight:500;">Open in admin</a></p>`
    : "";
  const html = emailShell(
    headline,
    `<h2 style="margin:0 0 8px 0;font-size:20px;font-weight:500;color:${BRAND_BLACK};">${escapeHtml(headline)}</h2>
     <p style="margin:0 0 20px 0;color:${BRAND_MID};font-size:13px;">Lead ID #${lead.id}</p>
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
       ${leadDetailRows(lead)}
     </table>
     ${adminLink}`,
  );
  const text = [
    headline,
    `Lead ID #${lead.id}`,
    "",
    `Source: ${label}`,
    lead.name ? `Name: ${lead.name}` : null,
    `Email: ${lead.email}`,
    lead.phone ? `Phone: ${lead.phone}` : null,
    lead.address ? `Address: ${lead.address}` : null,
    lead.zip ? `ZIP: ${lead.zip}` : null,
    lead.modelInterest ? `Model: ${lead.modelInterest}` : null,
    lead.intendedUse ? `Use: ${lead.intendedUse}` : null,
    lead.processStage ? `Stage: ${lead.processStage}` : null,
    lead.scheduledAt ? `Scheduled: ${fmtPT(lead.scheduledAt)}` : null,
    lead.message ? `Message: ${lead.message}` : null,
  ]
    .filter(Boolean)
    .join("\n");
  return { subject: sanitizeHeader(`[Midcentury ADU Lead] ${headline}`), html, text };
}

function buildConfirmationEmail(lead: LeadEmailInput): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = sanitizeHeader(
    SOURCE_SUBJECT[lead.source] ?? "Thanks for reaching out to Midcentury ADU",
  );
  const greeting = lead.name ? `Hi ${escapeHtml(lead.name.split(" ")[0])},` : "Hi there,";
  let body = "";

  if (lead.source === "discovery_call" && lead.scheduledAt) {
    body = `<p style="margin:0 0 16px 0;">${greeting}</p>
      <p style="margin:0 0 16px 0;">Your discovery call with the Midcentury ADU team is confirmed for:</p>
      <p style="margin:0 0 20px 0;padding:14px 18px;background:${BRAND_SAND};border-left:3px solid ${BRAND_BLUE};font-size:15px;font-weight:500;">${escapeHtml(fmtPT(lead.scheduledAt))}</p>
      <p style="margin:0 0 16px 0;">A calendar invite is attached to this email — open it to add the call to Google, Apple, or Outlook calendar.</p>
      <p style="margin:0 0 16px 0;">We'll call you at the number you provided. If you need to reschedule or have questions before then, just reply to this email.</p>
      <p style="margin:24px 0 0 0;color:${BRAND_MID};">— The Midcentury ADU team</p>`;
  } else if (lead.source === "brochure") {
    body = `<p style="margin:0 0 16px 0;">${greeting}</p>
      <p style="margin:0 0 16px 0;">Thanks for downloading the Midcentury ADU brochure. We hope it gives you a clear picture of our floor plans, finishes, and the all-in pricing for each model.</p>
      <p style="margin:0 0 16px 0;">When you're ready to talk through your project — site, budget, timeline, financing — just reply to this email or book a 30-minute discovery call from the website.</p>
      <p style="margin:24px 0 0 0;color:${BRAND_MID};">— The Midcentury ADU team</p>`;
  } else if (lead.source === "financing") {
    body = `<p style="margin:0 0 16px 0;">${greeting}</p>
      <p style="margin:0 0 16px 0;">We received your financing pre-qualification request. One of our financing partners will reach out within one business day with personalized rate and payment options for your ADU project.</p>
      <p style="margin:0 0 16px 0;">In the meantime, if you have questions or want to talk through models and budget, just reply to this email.</p>
      <p style="margin:24px 0 0 0;color:${BRAND_MID};">— The Midcentury ADU team</p>`;
  } else if (lead.source === "newsletter") {
    body = `<p style="margin:0 0 16px 0;">${greeting}</p>
      <p style="margin:0 0 16px 0;">You're on the Midcentury ADU list. Expect one short email a month — new floor plans, finished projects, and California ADU news. No spam, unsubscribe anytime.</p>
      <p style="margin:24px 0 0 0;color:${BRAND_MID};">— The Midcentury ADU team</p>`;
  } else {
    body = `<p style="margin:0 0 16px 0;">${greeting}</p>
      <p style="margin:0 0 16px 0;">Thanks for reaching out. We received your message and will get back to you within one business day.</p>
      <p style="margin:24px 0 0 0;color:${BRAND_MID};">— The Midcentury ADU team</p>`;
  }

  const html = emailShell(subject, body);
  const text = body
    .replace(/<[^>]+>/g, "")
    .replace(/\s+\n/g, "\n")
    .trim();
  return { subject, html, text };
}

export async function sendLeadEmails(lead: LeadEmailInput): Promise<void> {
  if (!resend) {
    logger.warn(
      { leadId: lead.id },
      "RESEND_API_KEY not configured; skipping lead emails",
    );
    return;
  }
  const client = resend;

  const tasks: Array<Promise<unknown>> = [];

  async function safeSend(
    label: "notification" | "confirmation",
    payload: Parameters<typeof client.emails.send>[0],
  ): Promise<void> {
    try {
      const r = await client.emails.send(payload);
      if (r.error) {
        logger.error(
          { leadId: lead.id, kind: label, err: r.error },
          `Resend rejected lead ${label} email`,
        );
      } else {
        logger.info(
          { leadId: lead.id, kind: label, msgId: r.data?.id },
          `Sent lead ${label} email`,
        );
      }
    } catch (err) {
      logger.error(
        { leadId: lead.id, kind: label, err },
        `Resend send threw for lead ${label} email`,
      );
    }
  }

  if (notifyTo.length > 0) {
    const notif = buildNotificationEmail(lead);
    tasks.push(
      safeSend("notification", {
        from: fromAddress,
        to: notifyTo,
        replyTo: sanitizeHeader(lead.email),
        subject: notif.subject,
        html: notif.html,
        text: notif.text,
      }),
    );
  } else {
    logger.warn(
      { leadId: lead.id },
      "LEAD_NOTIFICATION_TO not set; skipping internal notification",
    );
  }

  const conf = buildConfirmationEmail(lead);
  const ics = buildIcs(lead);
  tasks.push(
    safeSend("confirmation", {
      from: fromAddress,
      to: [sanitizeHeader(lead.email)],
      subject: conf.subject,
      html: conf.html,
      text: conf.text,
      attachments: ics
        ? [
            {
              filename: "midcentury-adu-discovery-call.ics",
              content: Buffer.from(ics).toString("base64"),
            },
          ]
        : undefined,
    }),
  );

  await Promise.allSettled(tasks);
}
