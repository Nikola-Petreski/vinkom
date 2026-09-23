const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const siteUrl = 'https://vinkom.com.mk';
const pageDirs = [
  { dir: rootDir, locale: 'mk', hreflang: 'mk', ogLocale: 'mk_MK', imagePath: 'logos/LOGO ZAEDNO7.png' },
  { dir: path.join(rootDir, 'en'), locale: 'en', hreflang: 'en', ogLocale: 'en_US', imagePath: '../logos/LOGO ZAEDNO7.png' },
  { dir: path.join(rootDir, 'al'), locale: 'al', hreflang: 'sq', ogLocale: 'sq_AL', imagePath: '../logos/LOGO ZAEDNO7.png' }
];

const metadataMarker = /\n?\s*<!-- SEO metadata -->[\s\S]*?<!-- End SEO metadata -->\n?/i;
const googleTag = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-2THZBHNVLC"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-2THZBHNVLC');
</script>`;
const socialProfiles = [
  'https://www.facebook.com/p/Vinkom-Dooel-Kirby-100057307614536/?locale=mk_MK',
  'https://www.instagram.com/vinkom_dooelkirby/',
  'https://www.youtube.com/@kirbyvacuums',
  'https://www.linkedin.com/company/vinkom-dooel/'
];

function escapeAttribute(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getPageUrl(locale, pageName) {
  if (pageName === 'index.html') {
    return locale === 'mk' ? `${siteUrl}/` : `${siteUrl}/${locale}/`;
  }
  return locale === 'mk'
    ? `${siteUrl}/${pageName}`
    : `${siteUrl}/${locale}/${pageName}`;
}

function getPageFiles(pageDir) {
  return fs.readdirSync(pageDir.dir)
    .filter(fileName => fileName.toLowerCase().endsWith('.html'))
    .map(fileName => path.join(pageDir.dir, fileName));
}

function getHeadValue(html, expression, label, filePath) {
  const match = html.match(expression);
  if (!match) {
    throw new Error(`Missing ${label} in ${path.relative(rootDir, filePath)}`);
  }
  return match[1].trim();
}

function buildMetadata(pageDir, filePath, html) {
  const pageName = path.basename(filePath);
  const title = getHeadValue(html, /<title>([\s\S]*?)<\/title>/i, 'title', filePath);
  const description = getHeadValue(html, /<meta\s+name=["']description["'][^>]*content=["']([^"']*)["']/i, 'description', filePath);
  const mkUrl = getPageUrl('mk', pageName);
  const enUrl = getPageUrl('en', pageName);
  const sqUrl = getPageUrl('al', pageName);
  const canonicalUrl = getPageUrl(pageDir.locale, pageName);
  const escapedTitle = escapeAttribute(title);
  const escapedDescription = escapeAttribute(description);
  const escapedCanonical = escapeAttribute(canonicalUrl);
  const escapedImagePath = escapeAttribute(pageDir.imagePath);

  const tags = [
    '<!-- SEO metadata -->',
    `  <link rel="alternate" hreflang="mk" href="${mkUrl}" />`,
    `  <link rel="alternate" hreflang="en" href="${enUrl}" />`,
    `  <link rel="alternate" hreflang="sq" href="${sqUrl}" />`,
    `  <link rel="alternate" hreflang="x-default" href="${mkUrl}" />`,
    `  <link rel="canonical" href="${escapedCanonical}">`,
    `  <meta property="og:title" content="${escapedTitle}">`,
    `  <meta property="og:description" content="${escapedDescription}">`,
    `  <meta property="og:image" content="${escapedImagePath}">`,
    `  <meta property="og:url" content="${escapedCanonical}">`,
    '  <meta property="og:type" content="website">',
    `  <meta property="og:locale" content="${pageDir.ogLocale}">`,
    '  <meta name="twitter:card" content="summary_large_image">',
    `  <meta name="twitter:title" content="${escapedTitle}">`,
    `  <meta name="twitter:description" content="${escapedDescription}">`,
    `  <meta name="twitter:image" content="${escapedImagePath}">`
  ];

  if (pageName === 'index.html') {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'ВИНКОМ ДООЕЛ',
      telephone: ['+38922461144', '+38970383953'],
      email: 'customercare@vinkom.com.mk',
      url: siteUrl,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Булевар Партизански Одреди 165',
        addressLocality: 'Скопје',
        postalCode: '1000',
        addressCountry: 'MK'
      },
      areaServed: pageDir.locale === 'mk' ? 'Северна Македонија' : pageDir.locale === 'en' ? 'North Macedonia' : 'Maqedonia e Veriut',
      sameAs: socialProfiles
    };
    tags.push('  <script type="application/ld+json">');
    tags.push(JSON.stringify(structuredData, null, 2).split('\n').map(line => `  ${line}`).join('\n'));
    tags.push('  </script>');
  }

  tags.push('<!-- End SEO metadata -->');
  return `\n${tags.join('\n')}\n`;
}

function main() {
  let pageCount = 0;
  for (const pageDir of pageDirs) {
    for (const filePath of getPageFiles(pageDir)) {
      const original = fs.readFileSync(filePath, 'utf8');
      const withoutMetadata = original.replace(metadataMarker, '\n');
      const metadata = buildMetadata(pageDir, filePath, withoutMetadata);
      const withoutGoogleTag = withoutMetadata.replace(/\s*<!-- Google tag \(gtag\.js\) -->[\s\S]*?<script>[\s\S]*?<\/script>\s*/i, '');
      const withGoogleTag = withoutGoogleTag.replace(/<head\s*>/i, `<head>\n${googleTag}\n`);
      const updated = /<\/head>/i.test(withGoogleTag)
        ? withGoogleTag.replace(/<\/head>/i, `${metadata}</head>`)
        : withGoogleTag.replace(/<body\b/i, `${metadata}</head>\n\n<body`);
      if (updated === withoutMetadata) {
        throw new Error(`Missing </head> or <body> in ${path.relative(rootDir, filePath)}`);
      }
      fs.writeFileSync(filePath, updated, 'utf8');
      pageCount += 1;
    }
  }
  console.log(`Added SEO metadata to ${pageCount} HTML pages.`);
}

main();
