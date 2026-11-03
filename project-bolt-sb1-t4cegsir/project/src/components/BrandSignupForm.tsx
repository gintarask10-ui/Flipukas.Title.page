import { useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, LoaderCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MAX_EMAIL_LENGTH = 254;
const MAX_BRAND_LENGTH = 80;

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function BrandSignupForm() {
  const [email, setEmail] = useState('');
  const [brandName, setBrandName] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedBrand = brandName.trim();

    if (trimmedEmail.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(trimmedEmail)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!supabase) {
      setStatus('error');
      setErrorMessage('Sign-ups are temporarily unavailable. Please try again later.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    const { error } = await supabase
      .from('brand_leads')
      .insert({ email: trimmedEmail, brand_name: trimmedBrand || null });

    if (error) {
      setStatus('error');
      setErrorMessage('We could not save your details. Please try again in a moment.');
      return;
    }

    setStatus('success');
    setEmail('');
    setBrandName('');
  };

  const isSubmitting = status === 'submitting';

  if (status === 'success') {
    return (
      <div
        id="start"
        role="status"
        className="flex scroll-mt-28 flex-col items-start gap-4 rounded-3xl border border-white/30 bg-zinc-900 p-8 shadow-2xl sm:p-10"
      >
        <CheckCircle2 className="h-10 w-10 text-white" />
        <p className="text-2xl font-bold text-white">You are on the list</p>
        <p className="text-base leading-[1.5] text-zinc-400">
          Thanks for starting with Flipukas Atelier. Our team will be in touch shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-2 text-sm font-medium text-white underline underline-offset-4 transition-colors hover:text-zinc-300"
        >
          Submit another brand
        </button>
      </div>
    );
  }

  return (
    <form
      id="start"
      onSubmit={handleSubmit}
      noValidate
      className="scroll-mt-28 space-y-5 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl sm:p-10"
    >
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-400">Get started</p>
        <h2 className="mt-3 text-3xl font-bold leading-[1.2] tracking-tight text-white">Start your brand</h2>
        <p className="mt-3 text-base leading-[1.5] text-zinc-400">
          Tell us who you are and we will reach out to plan your first collection.
        </p>
      </div>

      <div>
        <label htmlFor="brand-name" className="mb-2 block text-sm font-medium text-zinc-300">
          Brand name <span className="text-zinc-500">(optional)</span>
        </label>
        <input
          id="brand-name"
          type="text"
          maxLength={MAX_BRAND_LENGTH}
          value={brandName}
          onChange={(event) => setBrandName(event.target.value)}
          disabled={isSubmitting}
          placeholder="Your brand idea"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3.5 text-white placeholder:text-zinc-500 transition-colors focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-60"
        />
      </div>

      <div>
        <label htmlFor="brand-email" className="mb-2 block text-sm font-medium text-zinc-300">
          Email address
        </label>
        <input
          id="brand-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isSubmitting}
          placeholder="you@example.com"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3.5 text-white placeholder:text-zinc-500 transition-colors focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-60"
        />
      </div>

      {status === 'error' && errorMessage && (
        <p role="alert" className="text-sm text-red-300">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="group flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-medium text-zinc-950 transition-all hover:bg-zinc-200 hover:shadow-[0_0_40px_-8px_rgba(255,255,255,0.5)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="h-5 w-5 animate-spin" />
            Sending
          </>
        ) : (
          <>
            Start Your Brand
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}
