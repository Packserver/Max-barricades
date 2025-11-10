"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  function update(e) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ state: "loading", msg: "Sending..." });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        console.error("API error:", json);
        setStatus({
          state: "error",
          msg: json?.error || json?.details || "Server error. See console.",
        });
        return;
      }

      setStatus({ state: "success", msg: "Quote request sent — we’ll email you shortly!" });
      setForm({ fullName: "", company: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error("Network error:", err);
      setStatus({ state: "error", msg: "Network error. Try again." });
    }
  }

  return (
    <div className="bg-white/10 p-6 rounded-lg">
      <h3 className="text-2xl font-semibold mb-4">Request A Quote</h3>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="fullName"
          value={form.fullName}
          onChange={update}
          type="text"
          placeholder="Full Name"
          required
          className="p-3 rounded text-black"
        />
        <input
          name="company"
          value={form.company}
          onChange={update}
          type="text"
          placeholder="Company (optional)"
          className="p-3 rounded text-black"
        />
        <input
          name="email"
          value={form.email}
          onChange={update}
          type="email"
          placeholder="Email"
          required
          className="p-3 rounded text-black"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={update}
          type="tel"
          placeholder="Phone"
          className="p-3 rounded text-black"
        />

        <textarea
          name="message"
          value={form.message}
          onChange={update}
          placeholder="Describe the project (drums, signs, dates, location...)"
          className="p-3 rounded text-black md:col-span-2 h-32"
          required
        />

        <div className="md:col-span-2 flex items-center gap-4">
          <button
            type="submit"
            disabled={status.state === "loading"}
            className="bg-yellow-400 text-blue-900 font-bold px-6 py-3 rounded-lg hover:bg-yellow-300 transition disabled:opacity-60"
          >
            {status.state === "loading" ? "Sending..." : "Submit Quote Request"}
          </button>

          {/* Feedback message */}
          {status.state === "success" && (
            <span className="text-green-300">{status.msg}</span>
          )}
          {status.state === "error" && (
            <span className="text-red-300">{status.msg}</span>
          )}
        </div>
      </form>
    </div>
  );
}
