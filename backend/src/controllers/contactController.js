import nodemailer from "nodemailer";

function buildTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || "587"),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    requireTLS: true,
    tls: { minVersion: "TLSv1.2" },
  });
}

export async function createContactMessage(req, res) {
  try {
    const { name, email, message, company, page } = req.body || {};

    if (String(company || "").trim()) {
      return res.status(200).json({ ok: true });
    }

    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim();
    const cleanMessage = String(message || "").trim();

    if (!cleanName || !cleanEmail || !cleanMessage) {
      return res.status(400).json({ message: "Chybí povinná pole." });
    }

    const to = process.env.CONTACT_TO || process.env.INQUIRY_TO;
    if (!to) {
      return res.status(500).json({ message: "Chybí CONTACT_TO/INQUIRY_TO." });
    }

    const subject = `Kontakt z webu${page ? ` (${page})` : ""}: ${cleanName}`;
    const text =
      `Jméno: ${cleanName}\n` +
      `E-mail: ${cleanEmail}\n` +
      `Stránka: ${page || "-"}\n\n` +
      `${cleanMessage}\n`;

    const html = `
      <h2>Kontakt z webu</h2>
      <p><b>Jméno:</b> ${escapeHtml(cleanName)}</p>
      <p><b>E-mail:</b> ${escapeHtml(cleanEmail)}</p>
      <p><b>Stránka:</b> ${escapeHtml(page || "-")}</p>
      <hr />
      <p style="white-space:pre-wrap">${escapeHtml(cleanMessage)}</p>
    `;

    const transporter = buildTransporter();

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      replyTo: cleanEmail,
      subject,
      text,
      html,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error in createContactMessage.", error);
    return res.status(500).json({ message: "Nepodařilo se odeslat zprávu." });
  }
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
