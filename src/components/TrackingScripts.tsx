import { useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

/**
 * Injeta scripts de tracking (GTM, GA4, Facebook Pixel) e meta-tags
 * de verificação configurados em /admin/seo. Roda no client após o
 * carregamento das configurações para não bloquear renderização.
 */
const TrackingScripts = () => {
  const { settings, loading } = useSiteSettings();

  useEffect(() => {
    if (loading) return;

    const head = document.head;
    const body = document.body;

    // Helper para criar/atualizar meta de verificação
    const upsertMeta = (name: string, content: string) => {
      if (!content) return;
      let el = head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.name = name;
        head.appendChild(el);
      }
      el.content = content;
    };

    upsertMeta("google-site-verification", settings.google_site_verification || "");
    upsertMeta("msvalidate.01", settings.bing_site_verification || "");
    upsertMeta("facebook-domain-verification", settings.facebook_domain_verification || "");

    // Google Tag Manager
    const gtmId = settings.gtm_id?.trim();
    if (gtmId && !document.getElementById("gtm-script")) {
      const script = document.createElement("script");
      script.id = "gtm-script";
      script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`;
      head.appendChild(script);

      const noscript = document.createElement("noscript");
      noscript.id = "gtm-noscript";
      noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      body.insertBefore(noscript, body.firstChild);
    }

    // Google Analytics 4
    const gaId = settings.ga_id?.trim();
    if (gaId && !document.getElementById("ga-script")) {
      const s1 = document.createElement("script");
      s1.id = "ga-script";
      s1.async = true;
      s1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      head.appendChild(s1);
      const s2 = document.createElement("script");
      s2.innerHTML = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${gaId}');`;
      head.appendChild(s2);
    }

    // Google Ads
    const adsId = settings.google_ads_id?.trim();
    if (adsId && !document.getElementById("ads-script")) {
      const s1 = document.createElement("script");
      s1.id = "ads-script";
      s1.async = true;
      s1.src = `https://www.googletagmanager.com/gtag/js?id=${adsId}`;
      head.appendChild(s1);
      const s2 = document.createElement("script");
      s2.innerHTML = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${adsId}');`;
      head.appendChild(s2);
    }

    // Facebook Pixel
    const fbId = settings.facebook_pixel_id?.trim();
    if (fbId && !document.getElementById("fb-pixel")) {
      const s = document.createElement("script");
      s.id = "fb-pixel";
      s.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${fbId}');fbq('track','PageView');`;
      head.appendChild(s);
    }
  }, [loading, settings]);

  return null;
};

export default TrackingScripts;
