ALTER TABLE brand_leads
  ADD COLUMN IF NOT EXISTS purpose text,
  ADD COLUMN IF NOT EXISTS details text,
  ADD COLUMN IF NOT EXISTS contact_consent boolean NOT NULL DEFAULT false;

ALTER TABLE brand_leads
  ADD CONSTRAINT brand_leads_purpose_check
    CHECK (purpose IS NULL OR purpose IN ('new_brand', 'online_store', 'production_fulfillment', 'other')),
  ADD CONSTRAINT brand_leads_details_length_check
    CHECK (details IS NULL OR char_length(details) <= 1000);

DROP POLICY IF EXISTS "anon_insert_brand_leads" ON brand_leads;
REVOKE INSERT ON brand_leads FROM anon, authenticated;
GRANT SELECT, INSERT ON brand_leads TO service_role;

CREATE TABLE IF NOT EXISTS brand_signup_rate_limits (
  ip_hash text PRIMARY KEY CHECK (char_length(ip_hash) = 64),
  window_started_at timestamptz NOT NULL DEFAULT now(),
  attempts integer NOT NULL DEFAULT 1
);

ALTER TABLE brand_signup_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON brand_signup_rate_limits FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.consume_brand_signup_rate_limit(p_ip_hash text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_attempts integer;
BEGIN
  IF p_ip_hash IS NULL OR char_length(p_ip_hash) <> 64 THEN
    RETURN false;
  END IF;

  DELETE FROM public.brand_signup_rate_limits
  WHERE window_started_at < now() - interval '1 day';

  INSERT INTO public.brand_signup_rate_limits (ip_hash)
  VALUES (p_ip_hash)
  ON CONFLICT (ip_hash) DO UPDATE
    SET window_started_at = CASE
          WHEN public.brand_signup_rate_limits.window_started_at < now() - interval '1 hour'
            THEN now()
          ELSE public.brand_signup_rate_limits.window_started_at
        END,
        attempts = CASE
          WHEN public.brand_signup_rate_limits.window_started_at < now() - interval '1 hour'
            THEN 1
          ELSE public.brand_signup_rate_limits.attempts + 1
        END
  RETURNING attempts INTO current_attempts;

  RETURN current_attempts <= 5;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_brand_signup_rate_limit(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_brand_signup_rate_limit(text) TO service_role;
