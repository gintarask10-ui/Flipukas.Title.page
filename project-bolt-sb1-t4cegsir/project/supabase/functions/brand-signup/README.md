# Registracijos el. laiškai per Brevo

`brand-signup` funkcija išsaugo registraciją `brand_leads` lentelėje, siunčia
patvirtinimo laišką registrantui ir registracijos duomenis į jūsų Gmail per
Brevo. Apribojimas: iki penkių pateikimų iš vieno IP per valandą; saugoma tik
IP maiša, o ne pats IP adresas. Registrantas gauna 15 % nuolaidos kodą
`FLIPUKAS15`, o pranešime jums nurodomas bendras užsiregistravusiųjų skaičius.

## Vienkartinis nustatymas

1. Brevo paskyroje atidarykite **Settings → Senders, domains, IPs → Domains**
   ir pridėkite `flipuks.eu`. Brevo parodys DNS įrašus. Nukopijuokite juos į
   domeno DNS valdymą kaip naujus įrašus. **Nešalinkite ir nekeiskite esamų
   svetainės A arba CNAME įrašų** - jie nukreipia svetainę į Vercel.
2. Palaukite, kol Brevo domeną pažymės kaip patvirtintą.
3. Brevo atidarykite **SMTP & API → API Keys**, sukurkite v3 API raktą ir
   nukopijuokite jį. Rakto niekam nesiųskite.
4. Supabase projekte, kurį naudoja ši svetainė, atidarykite
   **Edge Functions → Secrets** ir sukurkite šiuos slaptus nustatymus:
   - `BREVO_API_KEY` - Brevo v3 API raktas.
   - `EMAIL_FROM` - patvirtinto domeno siuntėjo adresas, pvz.
     `registrations@flipuks.eu`.
   - `EMAIL_FROM_NAME` - `Flipukas Atelier` (neprivalomas, tai numatytoji reikšmė).
   - `LEAD_NOTIFICATION_EMAIL` - jūsų Gmail adresas, į kurį turi ateiti naujos
     registracijos.
5. Vercel projekto aplinkos kintamuosiuose nustatykite
   `VITE_SUPABASE_URL` ir `VITE_SUPABASE_ANON_KEY`. **Nedėkite** ten Brevo API
   rakto arba Supabase `service_role` rakto.
6. Supabase projekte pritaikykite duomenų bazės migraciją ir įdiekite Edge
   Function:

   ```sh
   supabase db push
   supabase functions deploy brand-signup
   ```

Supabase Edge Function aplinka automatiškai pateikia `SUPABASE_URL` ir
`SUPABASE_SERVICE_ROLE_KEY`. `service_role` ir Brevo raktus laikykite tik
Supabase secrets nustatymuose.

Atlikę nustatymus, pateikite bandomąją registraciją ir patikrinkite, ar
registrantas gavo patvirtinimą, o jūsų Gmail - registracijos pranešimą.
Kai atidarysite parduotuvę, sukurkite joje 15 % nuolaidos kodą `FLIPUKAS15`,
kad registracijos laiške pažadėta nuolaida veiktų.
