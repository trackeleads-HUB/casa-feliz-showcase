# Architecture

- Keep canonical URL normalization in `src/lib/seo.ts`; all public metadata must identify the primary domain rather than the preview origin.
- Retain the existing build-time sitemap generator and dynamic sitemap function; both enumerate public listing URLs using page-specific update timestamps.