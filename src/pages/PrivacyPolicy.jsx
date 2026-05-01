import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}
        />
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20 relative z-10">
          <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1 text-white/70 hover:text-white text-sm font-medium transition-colors">
            <span className="material-symbols-outlined text-lg">arrow_back</span> Back
          </button>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight font-headline">Privacy Policy</h1>
          <p className="text-white/70 mt-3 text-sm">Last updated: May 1, 2026</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <div className="prose prose-stone dark:prose-invert max-w-none space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-on-surface font-headline flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600">info</span>
              1. Introduction
            </h2>
            <p className="text-stone-600 leading-relaxed">
              SafarAI ("we", "our", "us") operates a travel concierge platform that uses artificial intelligence to help users discover, plan, and experience Morocco. This Privacy Policy explains how we collect, use, store, and protect your personal data when you use our application and services.
            </p>
            <p className="text-stone-600 leading-relaxed">
              By accessing or using SafarAI, you agree to the practices described in this policy. If you do not agree, please do not use the service.
            </p>
          </section>

          <div className="h-px bg-stone-200 dark:bg-stone-700" />

          <section>
            <h2 className="text-2xl font-bold text-on-surface font-headline flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600">location_on</span>
              2. Location Data
            </h2>
            <p className="text-stone-600 leading-relaxed">
              SafarAI collects and processes location data in the following ways:
            </p>
            <ul className="list-disc pl-6 text-stone-600 space-y-2">
              <li><strong>IP-based geolocation:</strong> We use your IP address to detect your approximate country for regulatory compliance (GDPR/CCPA) and to provide region-appropriate content.</li>
              <li><strong>Search-based location:</strong> When you search for destinations or request itineraries, the city names you provide are resolved to geographic coordinates using our internal lookup tables.</li>
              <li><strong>Weather services:</strong> Coordinates are sent to Visual Crossing to display current weather conditions for destinations you explore.</li>
            </ul>
            <p className="text-stone-600 leading-relaxed">
              We do not access your device's GPS without explicit permission, and we do not continuously track your real-time location.
            </p>
          </section>

          <div className="h-px bg-stone-200 dark:bg-stone-700" />

          <section>
            <h2 className="text-2xl font-bold text-on-surface font-headline flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600">auto_awesome</span>
              3. AI Itinerary Generation
            </h2>
            <p className="text-stone-600 leading-relaxed">
              SafarAI employs a multi-stage AI pipeline (the "Waterfall Architecture") to generate travel recommendations:
            </p>
            <ul className="list-disc pl-6 text-stone-600 space-y-2">
              <li><strong>Language Detection:</strong> Your input is analyzed to detect its language and translated to English for processing.</li>
              <li><strong>Intent Classification:</strong> A lightweight AI model classifies your request (e.g., explore, weather, culture) without accessing external tools.</li>
              <li><strong>Data Fetching:</strong> Based on the classified intent, real-time data is fetched from third-party APIs (OpenTripMap) using deterministic, native code — not AI-generated coordinates.</li>
              <li><strong>Response Generation:</strong> A final AI model composes a natural-language response enriched with the fetched data, translated back to your detected language.</li>
            </ul>
            <p className="text-stone-600 leading-relaxed">
              AI-generated content is provided for informational purposes only. We do not guarantee the accuracy of AI recommendations and advise users to verify critical details independently.
            </p>
          </section>

          <div className="h-px bg-stone-200 dark:bg-stone-700" />

          <section>
            <h2 className="text-2xl font-bold text-on-surface font-headline flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600">api</span>
              4. Third-Party API Integrations
            </h2>
            <p className="text-stone-600 leading-relaxed">SafarAI integrates with the following third-party services:</p>
            <ul className="list-disc pl-6 text-stone-600 space-y-2">
              <li><strong>OpenTripMap:</strong> Provides points of interest, monuments, and cultural site data based on geographic coordinates.</li>
              <li><strong>Foursquare Places API:</strong> Used for activity discovery, venue details, and place categorization.</li>
              <li><strong>Visual Crossing:</strong> Delivers real-time and forecast weather data for Moroccan destinations.</li>
              <li><strong>Groq / OpenRouter:</strong> AI inference providers that process anonymized text prompts. No personally identifiable information is included in AI API calls.</li>
            </ul>
            <p className="text-stone-600 leading-relaxed">
              Each third-party service operates under its own privacy policy. We encourage you to review their respective policies.
            </p>
          </section>

          <div className="h-px bg-stone-200 dark:bg-stone-700" />

          <section>
            <h2 className="text-2xl font-bold text-on-surface font-headline flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600">lock</span>
              5. Authentication & Session Handling
            </h2>
            <p className="text-stone-600 leading-relaxed">
              SafarAI uses <strong>Supabase Authentication</strong> for secure user management:
            </p>
            <ul className="list-disc pl-6 text-stone-600 space-y-2">
              <li><strong>JWT Tokens:</strong> Upon login, a JSON Web Token (JWT) is issued and stored as an essential cookie. This token authenticates your session and enables Row-Level Security (RLS) in our PostgreSQL database.</li>
              <li><strong>Row-Level Security:</strong> Your data (saved places, chat history, profile) is protected at the database level. Each query is scoped to your authenticated user ID (<code>auth.uid()</code>), ensuring no user can access another's data.</li>
              <li><strong>Session Persistence:</strong> Sessions are maintained via Supabase's built-in session management. You may log out at any time to invalidate your session.</li>
            </ul>
          </section>

          <div className="h-px bg-stone-200 dark:bg-stone-700" />

          <section>
            <h2 className="text-2xl font-bold text-on-surface font-headline flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600">cookie</span>
              6. Cookies
            </h2>
            <p className="text-stone-600 leading-relaxed">We use three categories of cookies:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden">
                <thead className="bg-stone-100 dark:bg-stone-800">
                  <tr>
                    <th className="text-left p-3 font-bold text-on-surface">Category</th>
                    <th className="text-left p-3 font-bold text-on-surface">Purpose</th>
                    <th className="text-left p-3 font-bold text-on-surface">Can Disable?</th>
                  </tr>
                </thead>
                <tbody className="text-stone-600">
                  <tr className="border-t border-stone-200 dark:border-stone-700"><td className="p-3 font-medium">Essential</td><td className="p-3">JWT authentication, session management</td><td className="p-3">No</td></tr>
                  <tr className="border-t border-stone-200 dark:border-stone-700"><td className="p-3 font-medium">Analytics</td><td className="p-3">Usage patterns, feature adoption</td><td className="p-3">Yes</td></tr>
                  <tr className="border-t border-stone-200 dark:border-stone-700"><td className="p-3 font-medium">Personalization</td><td className="p-3">Location preferences, AI recommendation tuning</td><td className="p-3">Yes</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-stone-600 leading-relaxed mt-3">
              You can manage your cookie preferences at any time via the cookie settings banner at the bottom of the page.
            </p>
          </section>

          <div className="h-px bg-stone-200 dark:bg-stone-700" />

          <section>
            <h2 className="text-2xl font-bold text-on-surface font-headline flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600">gavel</span>
              7. Your Rights
            </h2>
            <h3 className="text-lg font-bold text-on-surface mt-4">GDPR (EU/UK Residents)</h3>
            <ul className="list-disc pl-6 text-stone-600 space-y-1">
              <li>Right of access to your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict or object to processing</li>
              <li>Right to data portability</li>
            </ul>
            <h3 className="text-lg font-bold text-on-surface mt-4">CCPA (California Residents)</h3>
            <ul className="list-disc pl-6 text-stone-600 space-y-1">
              <li>Right to know what personal information is collected</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of the sale of personal information</li>
              <li>Right to non-discrimination for exercising your rights</li>
            </ul>
            <p className="text-stone-600 leading-relaxed mt-3">
              To exercise any of these rights, contact us at <a href="mailto:privacy@safarai.ma" className="text-teal-700 font-medium hover:underline">privacy@safarai.ma</a>.
            </p>
          </section>

          <div className="h-px bg-stone-200 dark:bg-stone-700" />

          <section>
            <h2 className="text-2xl font-bold text-on-surface font-headline flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600">mail</span>
              8. Contact
            </h2>
            <p className="text-stone-600 leading-relaxed">
              For questions about this Privacy Policy, contact our Data Protection team at{' '}
              <a href="mailto:privacy@safarai.ma" className="text-teal-700 font-medium hover:underline">privacy@safarai.ma</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
