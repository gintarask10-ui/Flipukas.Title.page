/*
# Create brand_leads table (public waitlist sign-ups)

1. New Tables
- `brand_leads`
  - `id` (uuid, primary key)
  - `email` (text, required, basic format and length checked)
  - `brand_name` (text, optional, max 80 characters)
  - `created_at` (timestamp, defaults to now)

2. Security
- Row level security is enabled on `brand_leads`.
- Visitors (anon) and signed-in users may only INSERT rows. There is no sign-in in this app.
- No SELECT, UPDATE or DELETE access is granted, so submitted emails cannot be read back from the public site.

3. Important notes
- Email format and length are enforced by a CHECK constraint so invalid data is rejected even if the frontend is bypassed.
*/

CREATE TABLE IF NOT EXISTS brand_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL CHECK (char_length(email) <= 254 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  brand_name text CHECK (brand_name IS NULL OR char_length(brand_name) <= 80),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE brand_leads ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON brand_leads TO anon, authenticated;

DROP POLICY IF EXISTS "anon_insert_brand_leads" ON brand_leads;
CREATE POLICY "anon_insert_brand_leads" ON brand_leads FOR INSERT
  TO anon, authenticated WITH CHECK (true);
