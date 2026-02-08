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

function normalizeType(v) {
  const t = String(v || "")
    .trim()
    .toLowerCase();
  if (t === "course" || t === "rental" || t === "general") {
    return t;
  }
  return "general";
}

function typeLabel(type) {
  if (type === "course") {
    return "Kurz";
  }
  if (type === "rental") {
    return "Pronájem";
  }
  return "Obecná poptávka";
}

function subjectFor(type, context) {
  const ctx = context ? `: ${context}` : "";
  if (type === "course") {
    return `Poptávka kurzu${ctx}`;
  }
  if (type === "rental") {
    return `Poptávka pronájmu${ctx}`;
  }
  return `Poptávka z webu${ctx}`;
}

export async function createInquiry(req, res) {
  const honeypot = String(req.body.website || "").trim();

  if (honeypot) {
    return res.status(200).json({ ok: true });
  }

  try {
    const type = normalizeType(req.body.type);
    const context = requiredString(req.body.context);
    const courseTitle = requiredString(req.body.courseTitle);
    const effectiveContext = context || courseTitle;

    const name = requiredString(req.body.name);
    const email = requiredString(req.body.email);
    const phone = requiredString(req.body.phone);
    const message = requiredString(req.body.message);

    const hp = requiredString(req.body.website);
    if (hp) {
      return res.status(201).json({ ok: true });
    }

    if (!name) {
      return res.status(400).json({ message: "Chybí jméno." });
    }
    if (!email) {
      return res.status(400).json({ message: "Chybí e-mail." });
    }

    const to = requiredString(process.env.INQUIRY_TO);
    if (!to) {
      return res.status(500).json({ message: "Chybí INQUIRY_TO." });
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

    const label = typeLabel(type);
    const subject = subjectFor(type, effectiveContext);

    const text = [
      `Typ: ${label}`,
      `Kontext: ${effectiveContext || "-"}`,
      `Jméno: ${name}`,
      `E-mail: ${email}`,
      `Telefon: ${phone || "-"}`,
      "",
      "Zpráva:",
      message || "-",
    ].join("\n");

    const html = `
      <h2>Nová poptávka – ${escapeHtml(label)}</h2>
      <ul>
        <li><b>Kontext:</b> ${escapeHtml(effectiveContext || "-")}</li>
        <li><b>Jméno:</b> ${escapeHtml(name)}</li>
        <li><b>E-mail:</b> ${escapeHtml(email)}</li>
        <li><b>Telefon:</b> ${escapeHtml(phone || "-")}</li>
      </ul>
      <p><b>Zpráva:</b></p>
      <pre style="white-space:pre-wrap;margin:0;padding:12px;border:1px solid #eee;border-radius:10px;background:#fafafa;">${escapeHtml(
        message || "-",
      )}</pre>
    `;

    await transporter.sendMail({
      from: process.env.INQUIRY_FROM || process.env.SMTP_USER,
      to,
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
