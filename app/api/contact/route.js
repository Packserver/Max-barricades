import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
  try {
    // Early checks
    const missing = [];
    if (!process.env.SENDGRID_API_KEY) missing.push("SENDGRID_API_KEY");
    if (!process.env.TO_EMAIL) missing.push("TO_EMAIL");
    if (!process.env.FROM_EMAIL) missing.push("FROM_EMAIL");
    if (missing.length) {
      console.error("Missing env vars:", missing.join(", "));
      return new Response(JSON.stringify({ error: "Server misconfiguration", missing }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    const body = await req.json();
    const {
      fullName = "(no name)",
      company = "(no company)",
      email = "(no email)",
      phone = "(no phone)",
      message = "(no message)",
    } = body || {};

    const msg = {
      to: process.env.TO_EMAIL,
      from: process.env.FROM_EMAIL,          // must be a verified sender / domain
      reply_to: email,                       // use SendGrid's reply_to field name
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

    const result = await sgMail.send(msg);
    console.log("SendGrid result:", result); // server-side log

    // Return success (don't leak internal SendGrid response in production)
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });

  } catch (error) {
    // Helpful server-side logging
    console.error("SendGrid error (full):", error);
    if (error.response && error.response.body) {
      console.error("SendGrid response body:", JSON.stringify(error.response.body));
    }

    // Return safe debug info (reduce in production)
    const details = (error.response && error.response.body) || error.message || String(error);
    return new Response(JSON.stringify({ error: "Email failed to send", details }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
