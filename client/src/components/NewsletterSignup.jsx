import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend endpoint for this yet — just a visual confirmation for now.
    // Wire this to a real endpoint (or an email service like Mailchimp/Klaviyo)
    // once ready to actually collect signups.
    if (email) setSubmitted(true);
  };

  return (
    <section className="px-6 md:px-10 py-20 text-center bg-bone">
      <h2 className="font-display text-2xl md:text-3xl mb-3">Join The Crew</h2>
      <p className="text-stone mb-8 max-w-md mx-auto">
        Be first to know about new drops, restocks, and exclusive access.
      </p>

      {submitted ? (
        <p className="text-rust font-medium">You're on the list.</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 border border-ink px-4 py-3 text-sm bg-bone"
          />
          <button
            type="submit"
            className="bg-ink text-bone px-6 py-3 font-semibold uppercase tracking-wide text-sm hover:bg-rust transition-colors whitespace-nowrap"
          >
            Sign Up
          </button>
        </form>
      )}
    </section>
  );
}
