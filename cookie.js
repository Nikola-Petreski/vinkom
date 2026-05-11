// Check consent on page load
document.addEventListener("DOMContentLoaded", () => {
  const consent = localStorage.getItem("cookieConsent");
  const banner = document.getElementById("cookieBanner");
  if (!banner) return;

  // If already in localStorage, don't show banner
  if (consent) {
    banner.classList.add("hidden");
    if (consent === "accepted") {
      loadAnalytics();
    }
    return;
  }

  // On index.html and platinum.html, show banner only after scrolling past hero section
  if (window.location.pathname.includes("index.html") || window.location.pathname.includes("platinum.html") || window.location.pathname === "/") {
    const heroSection = document.getElementById("hero") || document.getElementById("mobileHero");
    if (heroSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting && !localStorage.getItem("cookieConsent")) {
            banner.classList.remove("hidden");
            observer.disconnect();
          }
        });
      }, { threshold: 0 });
      observer.observe(heroSection);
      return;
    }
  }

  // On other pages, show banner immediately
  banner.classList.remove("hidden");
});

// Accept cookies
function acceptCookies() {
  localStorage.setItem("cookieConsent", "accepted");
  const banner = document.getElementById("cookieBanner");
  if (banner) banner.classList.add("hidden");
  loadAnalytics();
}

// Reject cookies
function rejectCookies() {
  localStorage.setItem("cookieConsent", "rejected");
  const banner = document.getElementById("cookieBanner");
  if (banner) banner.classList.add("hidden");
}

// Load Google Analytics ONLY after consent
function loadAnalytics() {
  if (window.analyticsLoaded) return; // prevent double load
  window.analyticsLoaded = true;

  const script = document.createElement("script");
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-K37BZSHPZ6";
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}    
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', 'G-K37BZSHPZ6');
  };
}


