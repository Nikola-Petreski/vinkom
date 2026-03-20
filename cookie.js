// Check consent on page load
document.addEventListener("DOMContentLoaded", () => {
  const consent = localStorage.getItem("cookieConsent");

  if (!consent) {
    const banner = document.getElementById("cookieBanner");
    if (banner) banner.classList.remove("hidden");
  }

  if (consent === "accepted") {
    loadAnalytics();
  }
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
