# Roman Titov — portfolio

Next.js App Router portfolio with English at `/` and Russian at `/ru`.

## Run locally

```sh
npm install
npm run dev
```

Open `http://localhost:3000/` or `http://localhost:3000/ru`.

## Public origin

Set `SITE_URL` to the canonical HTTPS origin before deployment (see `.env.example`). It is used for canonical URLs, language alternates, sitemap, robots and structured data. No analytics provider is configured.

The robots policy permits `OAI-SearchBot` and disallows `GPTBot`, as agreed for this migration. Hosting/CDN bot access must also permit public crawling.
