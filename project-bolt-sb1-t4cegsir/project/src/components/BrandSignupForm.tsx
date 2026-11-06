import { useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, LoaderCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MAX_EMAIL_LENGTH = 254;
const MAX_BRAND_LENGTH = 80;
const MAX_DETAILS_LENGTH = 1000;

const PURPOSE_OPTIONS = [
  { value: 'new_brand', label: 'Start a clothing brand' },
  { value: 'online_store', label: 'Set up an online store' },
  { value: 'production_fulfillment', label: 'Get production or fulfillment support' },
  { value: 'other', label: 'Something else' },
] as const;

type SignupPurpose = (typeof PURPOSE_OPTIONS)[number]['value'];

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function BrandSignupForm() {
  const [email, setEmail] = useState('');
  const [brandName, setBrandName] = useState('');
  const [purpose, setPurpose] = useState<SignupPurpose | ''>('');
  const [details, setDetails] = useState('');
  const [contactConsent, setContactConsent] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [emailDeliverySucceeded, setEmailDeliverySucceeded] = useState(false);
  const [discountCode, setDiscountCode] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedBrand = brandName.trim();
    const trimmedDetails = details.trim();

    if (trimmedEmail.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(trimmedEmail)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!purpose) {
      setStatus('error');
      setErrorMessage('Please choose what you are looking for.');
      return;
    }

    if (trimmedDetails.length > MAX_DETAILS_LENGTH) {
      setStatus('error');
      setErrorMessage(`Please keep your message under ${MAX_DETAILS_LENGTH} characters.`);
      return;
    }

    if (!contactConsent) {
      setStatus('error');
      setErrorMessage('Please agree to be contacted about your request.');
      return;
    }

    if (!supabase) {
      setStatus('error');
      setErrorMessage('Sign-up is temporarily unavailable. Please try again later.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const { data, error } = await supabase.functions.invoke('brand-signup', {
        body: {
          email: trimmedEmail,
          brandName: trimmedBrand || null,
          purpose,
          details: trimmedDetails || null,
          contactConsent,
        },
      });

      if (error) {
        setStatus('error');
        setErrorMessage('We could not submit your request. Please try again in a moment.');
        return;
      }

      setSubmittedEmail(trimmedEmail);
      setEmailDeliverySucceeded(
        data?.confirmationEmailSent === true && data?.ownerNotificationSent === true,
      );
      setDiscountCode(typeof data?.discountCode === 'string' ? data.discountCode : '');
      setEmail('');
      setBrandName('');
      setPurpose('');
      setDetails('');
      setContactConsent(false);
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMessage('We could not submit your request. Please try again in a moment.');
    }
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
        <p className="text-2xl font-bold text-white">Thanks for reaching out</p>
        <p className="text-base leading-[1.5] text-zinc-400">
          {emailDeliverySucceeded
            ? `Your request is saved. A confirmation and your 15% shop-opening discount code have been sent to ${submittedEmail}.`
            : 'Your request is saved, but one or more email notifications could not be sent. Please contact us if you do not hear back.'}
        </p>
        {discountCode && (
          <p className="rounded-xl bg-white/10 px-4 py-3 text-sm text-zinc-200">
            Your 15% discount code: <strong className="text-white">{discountCode}</strong>
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            setSubmittedEmail('');
            setDiscountCode('');
            setStatus('idle');
          }}
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

      <div>
        <label htmlFor="signup-purpose" className="mb-2 block text-sm font-medium text-zinc-300">
          What are you looking for?
        </label>
        <select
          id="signup-purpose"
          value={purpose}
          onChange={(event) =>
            setPurpose(PURPOSE_OPTIONS.find((option) => option.value === event.target.value)?.value ?? '')
          }
          disabled={isSubmitting}
          required
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3.5 text-white transition-colors focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-60"
        >
          <option value="" disabled>
            Choose one
          </option>
          {PURPOSE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="signup-details" className="mb-2 block text-sm font-medium text-zinc-300">
          Tell us a little more <span className="text-zinc-500">(optional)</span>
        </label>
        <textarea
          id="signup-details"
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          disabled={isSubmitting}
          maxLength={MAX_DETAILS_LENGTH}
          rows={3}
          placeholder="What are you hoping to create?"
          className="w-full resize-y rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3.5 text-white placeholder:text-zinc-500 transition-colors focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-60"
        />
      </div>

      <label className="flex items-start gap-3 text-sm leading-6 text-zinc-400">
        <input
          type="checkbox"
          checked={contactConsent}
          onChange={(event) => setContactConsent(event.target.checked)}
          disabled={isSubmitting}
          className="mt-1 h-4 w-4 shrink-0 accent-white"
        />
        <span>I agree to be contacted about this request.</span>
      </label>

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
