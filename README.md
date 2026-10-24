# Piyush Aggarwal — Personal Portfolio

Personal developer portfolio for **Piyush Aggarwal**, based in Delhi and currently studying at **SRM University, Sonepat**.

The site is designed to present:

- Developer identity
- Education
- Technical stack
- Selected projects
- Building philosophy
- Current direction
- Contact information

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
npm start
```

## Deploy

The project is ready for deployment on a Next.js-compatible platform such as Vercel.

## Before publishing

Update:

- Previous school details in `src/data/profile.ts`
- Personal philosophy in `src/data/profile.ts`
- Project links in `src/data/projects.ts`
- Optional profile image at `public/profile.jpg`
- LinkedIn URL when available

GitHub:
https://github.com/piyushaggarwal1322009-bit

## GitHub activity data

The activity route uses GitHub's public REST API for public repository count, stars, and repository languages. The contribution calendar comes from [github-contributions-api](https://github.com/grubersjoe/github-contributions-api), whose documented JSON response is validated server-side; its upstream results are cached for one hour. The route also caches its response and the browser keeps a last-known-good copy for offline or upstream-error states.

No GitHub token is required or configured. A scheduled daily refresh is not configured; refreshes happen when the route is requested and its cache expires. The contribution service is an external dependency and may be unavailable, in which case saved activity is shown when available.

## Verified project links

- Grillr source: https://github.com/Sarthak-madan334/Grillr. No public live frontend URL was found in its repository configuration.
- Synkro source: https://github.com/Sarthak-madan334/collab-workspace; live workspace: https://collab-workspace-three.vercel.app.
