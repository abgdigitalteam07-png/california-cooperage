'use client';

import { useState } from 'react';

export default function DealerForm() {
  const [form, setForm] = useState({ name: '', email: '', postalCode: '', model: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', postalCode: '', model: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const inputClass = "w-full px-4 py-3 border border-[#EDE8DC] rounded bg-white font-body text-[#1E1E1E] text-sm focus:outline-none focus:border-[#3A5F35] transition-colors";
  const labelClass = "block text-xs font-body font-bold uppercase tracking-widest text-[#6B6560] mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Full Name *</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={e => setForm({...form, name: e.target.value})}
          placeholder="Your full name"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Email Address *</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={e => setForm({...form, email: e.target.value})}
          placeholder="your@email.com"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Zip / Postal Code *</label>
        <input
          type="text"
          required
          value={form.postalCode}
          onChange={e => setForm({...form, postalCode: e.target.value})}
          placeholder="e.g. 90210"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Model of Interest</label>
        <select
          value={form.model}
          onChange={e => setForm({...form, model: e.target.value})}
          className={inputClass}
        >
          <option value="">Select a model...</option>
          <option value="CR1">CR1 — The Classic (5-Person Rectangular)</option>
          <option value="CR2">CR2 — The Entertainer (7-Person Square)</option>
          <option value="CR3">CR3 — The Social (6-Person Round)</option>
          <option value="unsure">Not sure — need guidance</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>Message</label>
        <textarea
          value={form.message}
          onChange={e => setForm({...form, message: e.target.value})}
          rows={4}
          placeholder="Tell us about your space, timeline, or any questions..."
          className={inputClass}
        />
      </div>

      {status === 'success' && (
        <div className="p-4 bg-[#D6E8D2] rounded text-[#3A5F35] font-body font-bold text-sm">
          ✓ Thank you! A dealer will be in touch soon.
        </div>
      )}
      {status === 'error' && (
        <div className="p-4 bg-[#FDEAEA] rounded text-[#C0392B] font-body font-bold text-sm">
          Something went wrong. Please try again or email us directly.
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-4 bg-[#3A5F35] hover:bg-[#2C4A28] text-white font-body font-bold text-sm rounded-sm transition-colors disabled:opacity-60"
      >
        {status === 'loading' ? 'Sending...' : 'Send Inquiry →'}
      </button>
    </form>
  );
}
