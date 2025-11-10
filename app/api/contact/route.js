// app/api/contact/route.js
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function POST(req) {
  try {
    // Ensure server got env vars
    const SG_KEY = process.env.SENDGRID_API_KEY;
    const TO_EMAIL = process.env.TO_EMAIL;
    const FROM_EMAIL = process.env.FROM_EMAIL;

    if (!SG_KEY) {
      console.error("Missing SENDGRID_API_KEY");
      return new Response(JSON.stringify({ error: "Missing SENDGRID_API_KEY" }), { status: 500 });
    }
    if (!TO_EMAIL) {
      console.error("Missing TO_EMAIL");
      return new Response(JSON.stringify({ error: "Missing TO_EMAIL" }), { status: 500 });
    }
    if (!FROM_EMAIL) {
      console.error("Missing FROM_EMAIL");
      return new Response(JSON.stringify({ error: "Missing FROM_EMAIL" }), { status: 500 });
    }

    // parse request body
    const body = await req.json();
    const {
      fullName = "(no name)",
      company = "(no company)",
      email = "(no email)",
      phone = "(no phone)",
      message = "(no message)",
    } = body;

    // Build message
    const msg = {
      to: TO_EMAIL,                 // <- required
      from: FROM_EMAIL,             // must be authenticated domain email
      replyTo: email || undefined,
      subject: `Quote Request from ${fullName}`,
      text: `Name: ${fullName}\nCompany: ${company}\nEmail: ${email}\nPhone: ${phone}\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; line-height:1.4;">
          <h2>New Quote Request</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Company:</strong> ${company}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Project Details:</strong><br/>${String(message).replace(/\n/g, "<br/>")}</p>
        </div>
      `,
    };

    // log lightweight debug
    console.log("Attempting to send email with msg.to:", msg.to, "from:", msg.from);

    // Attempt to send
    const result = await sgMail.send(msg);
    console.log("SendGrid result:", result);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    // log full error to terminal (SendGrid errors may include response.body)
    console.error("SendGrid error (full):", error);
    if (error.response && error.response.body) {
      console.error("SendGrid response body:", error.response.body);
    }
    // return helpful error to client
    return new Response(
      JSON.stringify({ error: "Email failed to send", details: error.message || String(error) }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
