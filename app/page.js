import ContactForm from "./components/ContactForm";

export default function Home() {
  return (
    <main className="bg-blue-900 text-white min-h-screen">

      {/* HERO SECTION */}
      <section className="text-center py-16 px-4 bg-gradient-to-b from-blue-900 to-blue-800">
        <h1 className="text-5xl font-bold mb-4">Max Barricades</h1>
        <p className="text-lg max-w-2xl mx-auto">
          FDOT Certified • Fully Insured • Reliable Traffic Control & Barricade Services in Florida
        </p>
      </section>

      {/* SERVICES */}
      <section className="p-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/10 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Traffic Drums</h3>
            <p>High-visibility MUTCD compliant drums for road and site safety.</p>
          </div>
          <div className="bg-white/10 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Signs</h3>
            <p>Road work, detour, lane closed, and custom traffic signs.</p>
          </div>
          <div className="bg-white/10 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Traffic Control</h3>
            <p>Certified temporary traffic control for any project size.</p>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="p-8 max-w-3xl mx-auto">
        <ContactForm />
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 text-sm opacity-80">
        © {new Date().getFullYear()} Max Barricades — All rights reserved.
      </footer>

    </main>
  );
}
