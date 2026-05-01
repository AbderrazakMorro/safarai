import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TermsOfService() {
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
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight font-headline">Terms of Service</h1>
          <p className="text-white/70 mt-3 text-sm">Last updated: May 1, 2026</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <div className="prose prose-stone dark:prose-invert max-w-none space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-on-surface font-headline flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600">handshake</span>
              1. Acceptance of Terms
            </h2>
            <p className="text-stone-600 leading-relaxed">
              By creating an account or using SafarAI, you agree to be bound by these Terms of Service ("Terms"). If you do not agree, you may not use the service. We reserve the right to update these Terms at any time, and continued use constitutes acceptance of any changes.
            </p>
          </section>

          <div className="h-px bg-stone-200 dark:bg-stone-700" />

          <section>
            <h2 className="text-2xl font-bold text-on-surface font-headline flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600">description</span>
              2. Description of Service
            </h2>
            <p className="text-stone-600 leading-relaxed">
              SafarAI is an AI-powered travel concierge platform that helps users discover destinations, plan itineraries, and explore Morocco. The service includes AI-generated recommendations, real-time weather data, points of interest from third-party APIs, and chat-based travel assistance.
            </p>
          </section>

          <div className="h-px bg-stone-200 dark:bg-stone-700" />

          <section>
            <h2 className="text-2xl font-bold text-on-surface font-headline flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600">person</span>
              3. User Accounts
            </h2>
            <ul className="list-disc pl-6 text-stone-600 space-y-2">
              <li>You must provide accurate and complete information when creating an account.</li>
              <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
              <li>You must be at least 16 years old to create an account.</li>
              <li>You agree not to share your account or allow unauthorized access.</li>
              <li>SafarAI reserves the right to suspend or terminate accounts that violate these Terms.</li>
            </ul>
          </section>

          <div className="h-px bg-stone-200 dark:bg-stone-700" />

          <section>
            <h2 className="text-2xl font-bold text-on-surface font-headline flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600">auto_awesome</span>
              4. AI-Generated Content
            </h2>
            <p className="text-stone-600 leading-relaxed">
              SafarAI uses artificial intelligence models (including Groq, OpenRouter, and Gemini) to generate travel recommendations, itineraries, and conversational responses. You acknowledge that:
            </p>
            <ul className="list-disc pl-6 text-stone-600 space-y-2">
              <li>AI-generated content is <strong>informational only</strong> and does not constitute professional travel advice.</li>
              <li>Recommendations may contain inaccuracies, outdated information, or errors. Always verify critical details (pricing, availability, safety) independently.</li>
              <li>SafarAI is not liable for decisions made based on AI-generated content.</li>
              <li>AI responses are not cached or reused across users — each generation is unique to your session context.</li>
            </ul>
          </section>

          <div className="h-px bg-stone-200 dark:bg-stone-700" />

          <section>
            <h2 className="text-2xl font-bold text-on-surface font-headline flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600">api</span>
              5. Third-Party Services & Data Attribution
            </h2>
            <p className="text-stone-600 leading-relaxed">
              SafarAI integrates data from third-party providers. By using the service, you agree to the respective terms of:
            </p>
            <ul className="list-disc pl-6 text-stone-600 space-y-1">
              <li><strong>OpenTripMap</strong> — Points of interest and cultural data</li>
              <li><strong>Foursquare</strong> — Venue information and activity discovery</li>
              <li><strong>Visual Crossing</strong> — Weather information</li>
              <li><strong>Supabase</strong> — Authentication and database services</li>
            </ul>
            <p className="text-stone-600 leading-relaxed mt-2">
              We attribute all third-party data to its original source. SafarAI does not claim ownership of data provided by third-party APIs.
            </p>
          </section>

          <div className="h-px bg-stone-200 dark:bg-stone-700" />

          <section>
            <h2 className="text-2xl font-bold text-on-surface font-headline flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600">block</span>
              6. Prohibited Conduct
            </h2>
            <ul className="list-disc pl-6 text-stone-600 space-y-2">
              <li>Attempting to reverse-engineer, scrape, or exploit the AI models or API integrations.</li>
              <li>Using the service for any unlawful or fraudulent purpose.</li>
              <li>Submitting abusive, harmful, or deliberately misleading input to the AI concierge.</li>
              <li>Circumventing authentication or Row-Level Security mechanisms.</li>
              <li>Sharing content generated by SafarAI as professional travel advice without disclaimers.</li>
            </ul>
          </section>

          <div className="h-px bg-stone-200 dark:bg-stone-700" />

          <section>
            <h2 className="text-2xl font-bold text-on-surface font-headline flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600">shield</span>
              7. Limitation of Liability
            </h2>
            <p className="text-stone-600 leading-relaxed">
              To the fullest extent permitted by applicable law, SafarAI and its affiliates shall not be liable for any indirect, incidental, consequential, or punitive damages arising from your use of the service. This includes, but is not limited to, losses from travel decisions made based on AI recommendations, third-party service outages, or data inaccuracies.
            </p>
            <p className="text-stone-600 leading-relaxed">
              The service is provided <strong>"as is"</strong> and <strong>"as available"</strong> without warranties of any kind.
            </p>
          </section>

          <div className="h-px bg-stone-200 dark:bg-stone-700" />

          <section>
            <h2 className="text-2xl font-bold text-on-surface font-headline flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600">gavel</span>
              8. Governing Law
            </h2>
            <p className="text-stone-600 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the <strong>Kingdom of Morocco</strong>. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Casablanca, Morocco.
            </p>
          </section>

          <div className="h-px bg-stone-200 dark:bg-stone-700" />

          <section>
            <h2 className="text-2xl font-bold text-on-surface font-headline flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600">mail</span>
              9. Contact
            </h2>
            <p className="text-stone-600 leading-relaxed">
              For questions about these Terms, contact us at{' '}
              <a href="mailto:legal@safarai.ma" className="text-teal-700 font-medium hover:underline">legal@safarai.ma</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
