<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#5c2d42" />
    <title>{{TITULO}}</title>

    <meta
      name="description"
      content="{{DESCRIPCION}}"
    />
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />

    <meta property="og:locale" content="es_ES" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="{{SITE_NOMBRE}}" />
    <meta property="og:url" content="{{SITE}}/" />
    <meta property="og:title" content="{{TITULO}}" />
    <meta
      property="og:description"
      content="{{DESCRIPCION}}"
    />
    <!-- Vista previa social: og-share.jpg se genera en el build (1200×630) a partir de og-cover - no apuntar og:image a la foto 4K -->
    <meta property="og:image" content="{{SITE}}/imgs/og-share.jpg" />
    <meta property="og:image:secure_url" content="{{SITE}}/imgs/og-share.jpg" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="{{ALT_IMG}}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{{TITULO}}" />
    <meta
      name="twitter:description"
      content="{{DESCRIPCION}}"
    />
    <meta name="twitter:image" content="{{SITE}}/imgs/og-share.jpg" />
    <meta name="twitter:image:alt" content="{{ALT_IMG}}" />

    <link rel="canonical" href="{{SITE}}/" />
    <link
      rel="preload"
      as="image"
      href="{{FOTO_PRELOAD}}"
      fetchpriority="high"
    />

    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "{{LD_NOMBRE}}",
        "url": "{{SITE}}/",
        "description": "{{DESCRIPCION}}",
        "inLanguage": "es"
      }
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>