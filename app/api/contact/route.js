// app/api/contact/route.js
import sgMail from "@sendgrid/mail";

export async function POST(req) {
  try {
    // quick diagnostics before calling SendGrid
    const hasKey = !!process.env.SENDGRID_API_KEY;
    const keyLooksGood = hasKey && process.env.SENDGRID_API_KEY.startsWith("SG.");
    const from = process.env.FROM_EMAIL || "";
    const to = process.env.TO_EMAIL || "";

    console.log("DEBUG: SENDGRID_KEY_PRESENT:", hasKey);
    console.log("DEBUG: SENDGRID_KEY_STARTS_WITH_SG:", keyLooksGood);
    console.log("DEBUG: FROM_EMAIL present:", Boolean(from), "valueLooksLikeEmail:", from.includes("@"));
    console.log("DEBUG: TO_EMAIL present:", Boolean(to), "valueLooksLikeEmail:", to.includes("@"));

    // If critical env missing, return immediate helpful error to browser
    if (!hasKey) {
      return new Response(JSON.stringify({ error: "Missing SENDGRID_API_KEY" }), { status: 500 });
    }
    if (!from || !from.includes("@")) {
      return new Response(JSON.stringify({ error: "Invalid or missing FROM_EMAIL env var" }), { status: 500 });
    }
    if (!to || !to.includes("@")) {
      return new Response(JSON.stringify({ error: "Invalid or missing TO_EMAIL env var" }), { status: 500 });
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const body = await req.json().catch(() => ({}));
    const {
      fullName = "(no name)",
      company = "(no company)",
      email = "(no email)",
      phone = "(no phone)",
      message = "(no message)",
    } = body;

    const msg = {
      to: process.env.TO_EMAIL,
      from: process.env.FROM_EMAIL, // must be verified / authenticated on SendGrid
      replyTo: email,
      subject: `Quote Request from ${fullName}`,
      text: `Name: ${fullName}\nCompany: ${company}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
      html: `<div><h2>New Quote Request</h2>
             <p><strong>Name:</strong> ${fullName}</p>
             <p><strong>Company:</strong> ${company}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone}</p>
             <p><strong>Project:</strong><br/>${String(message).replace(/\n/g,"<br/>")}</p>
             </div>`,
    };

    // Attempt to send and return SendGrid's response details for debugging
    const result = await sgMail.send(msg);
    console.log("DEBUG: SendGrid success result:", Array.isArray(result) ? result.length : result);

    return new Response(JSON.stringify({ success: true, result: (result && result.length ? "sent" : result) }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    // log full server error and any SendGrid response body
    console.error("SendGrid error (full):", err);
    if (err.response && err.response.body) {
      console.error("SendGrid response body:", err.response.body);
    }

    const details = err?.response?.body ?? err?.message ?? String(err);
    return new Response(JSON.stringify({ error: "Email failed to send", details }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
