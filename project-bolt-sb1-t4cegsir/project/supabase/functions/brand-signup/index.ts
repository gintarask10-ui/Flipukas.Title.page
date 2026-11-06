import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const PURPOSE_LABELS: Record<string, string> = {
  new_brand: 'Start a clothing brand',
  online_store: 'Set up an online store',
  production_fulfillment: 'Get production or fulfillment support',
  other: 'Something else',
};

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MAX_EMAIL_LENGTH = 254;
const MAX_BRAND_LENGTH = 80;
const MAX_DETAILS_LENGTH = 1000;
const DISCOUNT_CODE = 'FLIPUKAS15';
const DISCOUNT_PERCENT = 15;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function respond(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}

async function sendEmail(
  apiKey: string,
  from: string,
  fromName: string,
  to: string,
  subject: string,
  text: string,
): Promise<boolean> {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { email: from, name: fromName },
        to: [{ email: to }],
        subject,
        htmlContent: `<p>${escapeHtml(text).replace(/\n/g, '<br>')}</p>`,
        textContent: text,
      }),
    });

    if (!response.ok) {
      console.error(`Email provider returned status ${response.status}`);
    }

    return response.ok;
  } catch {
    console.error('Email provider request failed');
    return false;
  }
}

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return respond({ error: 'Method not allowed' }, 405);
  }

  const brevoApiKey = Deno.env.get('BREVO_API_KEY');
  const notificationEmail = Deno.env.get('LEAD_NOTIFICATION_EMAIL');
  const emailFrom = Deno.env.get('EMAIL_FROM');
  const emailFromName = Deno.env.get('EMAIL_FROM_NAME') ?? 'Flipukas Atelier';
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!brevoApiKey || !notificationEmail || !emailFrom || !supabaseUrl || !serviceRoleKey) {
    console.error('Brand signup function is missing required environment configuration');
    return respond({ error: 'Registration is temporarily unavailable' }, 503);
  }

  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return respond({ error: 'Invalid request body' }, 400);
  }

  if (!isRecord(requestBody)) {
    return respond({ error: 'Invalid request body' }, 400);
  }

  const payload = requestBody;
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const brandName = typeof payload.brandName === 'string' ? payload.brandName.trim() : '';
  const purpose = typeof payload.purpose === 'string' ? payload.purpose : '';
  const details = typeof payload.details === 'string' ? payload.details.trim() : '';

  if (
    email.length > MAX_EMAIL_LENGTH ||
    !EMAIL_PATTERN.test(email) ||
    brandName.length > MAX_BRAND_LENGTH ||
    details.length > MAX_DETAILS_LENGTH ||
    !Object.hasOwn(PURPOSE_LABELS, purpose) ||
    payload.contactConsent !== true
  ) {
    return respond({ error: 'Please check the submitted registration details' }, 400);
  }

  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim();
  if (!clientIp) {
    console.error('Could not determine signup request IP for rate limiting');
    return respond({ error: 'Registration is temporarily unavailable' }, 503);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const ipHashBytes = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`${clientIp}:${serviceRoleKey}`),
  );
  const ipHash = Array.from(new Uint8Array(ipHashBytes), (byte) =>
    byte.toString(16).padStart(2, '0')
  ).join('');
  const { data: requestAllowed, error: rateLimitError } = await supabase.rpc(
    'consume_brand_signup_rate_limit',
    { p_ip_hash: ipHash },
  );

  if (rateLimitError) {
    console.error('Could not check signup rate limit');
    return respond({ error: 'Registration is temporarily unavailable' }, 503);
  }

  if (!requestAllowed) {
    return respond({ error: 'Too many registration attempts. Please try again later.' }, 429);
  }

  const { error: insertError } = await supabase.from('brand_leads').insert({
    email,
    brand_name: brandName || null,
    purpose,
    details: details || null,
    contact_consent: true,
  });

  if (insertError) {
    console.error('Could not save brand signup');
    return respond({ error: 'Could not save registration' }, 500);
  }

  const { count: totalRegistrations, error: countError } = await supabase
    .from('brand_leads')
    .select('id', { count: 'exact', head: true });

  if (countError) {
    console.error('Could not count brand signups');
  }

  const purposeLabel = PURPOSE_LABELS[purpose];
  const brandLine = brandName || 'Not provided';
  const detailsLine = details || 'Not provided';
  const [confirmationEmailSent, ownerNotificationSent] = await Promise.all([
    sendEmail(
      brevoApiKey,
      emailFrom,
      emailFromName,
      email,
      'We received your Flipukas Atelier request',
      [
        'Thanks for signing up for Flipukas Atelier updates.',
        '',
        `Your early signup reward: ${DISCOUNT_PERCENT}% off when our shop opens.`,
        `Your discount code: ${DISCOUNT_CODE}`,
        '',
        'Keep this code and use it when the shop opens.',
        `What you are looking for: ${purposeLabel}`,
      ].join('\n'),
    ),
    sendEmail(
      brevoApiKey,
      emailFrom,
      emailFromName,
      notificationEmail,
      'New Flipukas Atelier registration',
      [
        'A new registration was submitted.',
        '',
        `Email: ${email}`,
        `Brand name: ${brandLine}`,
        `Purpose: ${purposeLabel}`,
        `Details: ${detailsLine}`,
        'Contact consent: yes',
        `Total registrations: ${totalRegistrations ?? 'Unavailable'}`,
      ].join('\n'),
    ),
  ]);

  return respond({
    success: true,
    confirmationEmailSent,
    ownerNotificationSent,
    discountCode: DISCOUNT_CODE,
    discountPercent: DISCOUNT_PERCENT,
    totalRegistrations: totalRegistrations ?? null,
  });
});
