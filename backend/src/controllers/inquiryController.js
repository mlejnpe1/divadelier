import nodemailer from "nodemailer";

function requiredString(v) {
  return String(v || "").trim();
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function createInquiry(req, res) {
  try {
    const courseTitle = requiredString(req.body.courseTitle);
    const name = requiredString(req.body.name);
    const email = requiredString(req.body.email);
    const phone = requiredString(req.body.phone);
    const message = requiredString(req.body.message);

    if (!name) {
      return res.status(400).json({ message: "Chybí jméno." });
    }
    if (!email) {
      return res.status(400).json({ message: "Chybí e-mail." });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || "465"),
      secure: String(process.env.SMTP_SECURE || "true") === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const subject = `Poptávka kurzu: ${courseTitle || "Neuvedeno"}`;

    const text = [
      `Kurz: ${courseTitle || "-"}`,
      `Jméno: ${name}`,
      `E-mail: ${email}`,
      `Telefon: ${phone || "-"}`,
      "",
      "Zpráva:",
      message || "-",
    ].join("\n");

    const html = `
      <h2>Nová poptávka kurzu</h2>
      <ul>
        <li><b>Kurz:</b> ${escapeHtml(courseTitle || "-")}</li>
        <li><b>Jméno:</b> ${escapeHtml(name)}</li>
        <li><b>E-mail:</b> ${escapeHtml(email)}</li>
        <li><b>Telefon:</b> ${escapeHtml(phone || "-")}</li>
      </ul>
      <p><b>Zpráva:</b></p>
      <pre style="white-space:pre-wrap">${escapeHtml(message || "-")}</pre>
    `;

    await transporter.sendMail({
      from: process.env.INQUIRY_FROM || process.env.SMTP_USER,
      to: process.env.INQUIRY_TO,
      replyTo: email,
      subject,
      text,
      html,
    });

    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error("Error in createInquiry.", error);
    return res.status(500).json({ message: "Nepodařilo se odeslat poptávku." });
  }
}
