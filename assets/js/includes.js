function initLocaleSwitching() {
  const currentPath = window.location.pathname;
  const currentFile = currentPath.split('/').pop() || 'index.html';
  const locale = currentPath.includes('/en/') ? 'en' : currentPath.includes('/al/') ? 'al' : 'mk';
  const pageFile = currentFile.includes('.') ? currentFile : 'index.html';
  const currentIsNested = currentPath.includes('/en/') || currentPath.includes('/al/');

  const resolveAssetPath = (assetPath) => currentIsNested ? `../${assetPath}` : assetPath;

  const flagMap = {
    mk: 'flags/macedonia.png',
    en: 'flags/britain.png',
    al: 'flags/albania.png'
  };

  const defaultFlag = resolveAssetPath(flagMap[locale] || flagMap.mk);

  const buildLangTarget = (targetLocale) => {
    const samePage = pageFile;
    const rootTarget = `./${samePage}`;
    const enTarget = `./en/${samePage}`;
    const alTarget = `./al/${samePage}`;

    if (currentIsNested) {
      if (targetLocale === 'mk') return `../${samePage}`;
      return `../${targetLocale}/${samePage}`;
    }

    if (targetLocale === 'mk') return rootTarget;
    if (targetLocale === 'en') return enTarget;
    if (targetLocale === 'al') return alTarget;
    return rootTarget;
  };

  document.querySelectorAll('[data-lang-link]').forEach(link => {
    const targetLocale = link.dataset.langLink;
    link.href = buildLangTarget(targetLocale);
  });

  document.querySelectorAll('[data-current-lang-flag]').forEach(button => {
    const img = button.querySelector('img');
    if (img) {
      img.src = defaultFlag;
      if (locale === 'en') {
        img.alt = 'English';
      } else if (locale === 'al') {
        img.alt = 'Albanian';
      } else {
        img.alt = 'Macedonian';
      }
    }
  });
}

function executeFooterScripts(container) {
  const scripts = Array.from(container.querySelectorAll('script'));
  if (scripts.length === 0) return;

  scripts.forEach(oldScript => {
    try {
      const newScript = document.createElement('script');
      // copy attributes
      for (let i = 0; i < oldScript.attributes.length; i++) {
        const attr = oldScript.attributes[i];
        newScript.setAttribute(attr.name, attr.value);
      }
      if (oldScript.src) {
        // external script: load and wait
        newScript.src = oldScript.src;
        document.head.appendChild(newScript);
        oldScript.parentNode && oldScript.parentNode.removeChild(oldScript);
      } else {
        // inline script: copy content and execute
        newScript.textContent = oldScript.textContent;
        oldScript.parentNode && oldScript.parentNode.replaceChild(newScript, oldScript);
      }
    } catch (e) {
      console.error('Script exec error', e);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;
  const isEnglish = currentPath.includes('/en/');
  const isAlbanian = currentPath.includes('/al/');
  const isNestedLocale = isEnglish || isAlbanian;
  const basePath = isNestedLocale ? '../' : '';
  const locale = isEnglish ? 'en' : isAlbanian ? 'al' : '';
  const includesPath = locale
    ? basePath + locale + '/includes/'
    : 'includes/';

  // Load cart logic script early (before other includes that might need it)
  const cartScript = document.createElement('script');
  cartScript.src = basePath + 'assets/js/cart-logic.js';
  cartScript.onload = () => {
    if (typeof initializeCart === 'function') initializeCart();
  };
  document.head.appendChild(cartScript);

  // Fetch cart badge
  fetch(includesPath + "cart-badge.html")
    .then(res => {
      if (!res.ok) throw new Error("Failed to load cart badge");
      return res.text();
    })
    .then(html => {
      const container = document.getElementById("cart-badge-container");
      if (container) {
        container.innerHTML = html;
        updateCartBadge();
      }
    })
    .catch(err => console.warn("Error loading cart badge:", err));

  // Fetch cookie banner
  fetch(includesPath + "cookie-banner.html")
    .then(res => {
      if (!res.ok) throw new Error("Failed to load cookie banner");
      return res.text();
    })
    .then(html => {
      const container = document.getElementById("cookie-container");
      if (container) {
        container.innerHTML = html;
        if (typeof initializeCookieBanner === 'function') {
          initializeCookieBanner();
        }
      }
    })
    .catch(err => console.warn("Error loading cookie banner:", err));

  // Fetch nav
  fetch(includesPath + "nav.html")
    .then(res => {
      if (!res.ok) throw new Error("Failed to load nav");
      return res.text();
    })
    .then(html => {
      const container = document.getElementById("nav-container");
      if (container) {
        container.innerHTML = html;
        initLocaleSwitching();
        // Initialize nav scripts
        initNavScripts();
      }
    })
    .catch(err => console.warn("Error loading nav:", err));

  // Fetch mobile nav
  fetch(includesPath + "mobileNav.html")
    .then(res => {
      if (!res.ok) throw new Error("Failed to load mobileNav");
      return res.text();
    })
    .then(html => {
      const container = document.getElementById("mobile-nav-container");
      if (container) {
        container.innerHTML = html;
        initLocaleSwitching();
        // Initialize mobile nav scripts
        initMobileNavScripts();
      }
    })
    .catch(err => console.warn("Error loading mobileNav:", err));

  // Fetch footer
  fetch(includesPath + "footer.html")
    .then(res => {
      if (!res.ok) throw new Error("Failed to load footer");
      return res.text();
    })
    .then(html => {
      const container = document.getElementById("footer-container");
      if (container) {
        container.innerHTML = html;
        // Execute scripts in the injected HTML
        executeFooterScripts(container);
      }
    })
    .catch(err => console.warn("Error loading footer:", err));
});

// Initialize nav functionality
function initNavScripts() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  // Info Dropdown functionality for desktop nav
  const infoDropdownButton = document.getElementById('infoDropdownButton');
  const infoDropdownMenu = document.getElementById('infoDropdownMenu');
  const infoChevron = document.getElementById('infoChevron');

  if (infoDropdownButton && infoDropdownMenu) {
    infoDropdownButton.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = infoDropdownMenu.classList.toggle('opacity-0');
      infoDropdownMenu.classList.toggle('invisible');
      infoDropdownButton.classList.toggle('active');
      if (infoChevron) infoChevron.classList.toggle('rotated');
    });

    document.addEventListener('click', (e) => {
      if (!infoDropdownButton.contains(e.target) && !infoDropdownMenu.contains(e.target)) {
        infoDropdownMenu.classList.add('opacity-0', 'invisible');
        infoDropdownButton.classList.remove('active');
        if (infoChevron) infoChevron.classList.remove('rotated');
      }
    });
  }

  // User Dropdown functionality for desktop nav
  const userDropdownButton = document.getElementById('userDropdownButton');
  const userDropdownMenu = document.getElementById('userDropdownMenu');
  const userChevron = document.getElementById('userChevron');

  if (userDropdownButton && userDropdownMenu) {
    userDropdownButton.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = userDropdownMenu.classList.toggle('opacity-0');
      userDropdownMenu.classList.toggle('invisible');
      userDropdownButton.classList.toggle('active');
      if (userChevron) userChevron.classList.toggle('rotated');
    });

    document.addEventListener('click', (e) => {
      if (!userDropdownButton.contains(e.target) && !userDropdownMenu.contains(e.target)) {
        userDropdownMenu.classList.add('opacity-0', 'invisible');
        userDropdownButton.classList.remove('active');
        if (userChevron) userChevron.classList.remove('rotated');
      }
    });
  }

  // Language dropdown
  const langDropdownButton = document.getElementById('langDropdownButton');
  const langDropdownMenu = document.getElementById('langDropdownMenu');
  const langChevron = document.getElementById('langChevron');

  if (langDropdownButton && langDropdownMenu) {
    langDropdownButton.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = langDropdownMenu.classList.toggle('opacity-0');
      langDropdownMenu.classList.toggle('invisible');
      langDropdownMenu.classList.toggle('translate-y-2');
      if (langChevron) langChevron.classList.toggle('rotated');
    });

    document.addEventListener('click', (e) => {
      if (!langDropdownButton.contains(e.target) && !langDropdownMenu.contains(e.target)) {
        langDropdownMenu.classList.add('opacity-0', 'invisible', 'translate-y-2');
        if (langChevron) langChevron.classList.remove('rotated');
      }
    });
  }

  // Nav scroll hide/show
  let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop + 6) {
      nav.style.transform = 'translateY(-' + (nav.offsetHeight + 4) + 'px)';
      nav.style.opacity = '0';
    } else if (scrollTop < lastScrollTop - 6) {
      nav.style.transform = 'translateY(0)';
      nav.style.opacity = '1';
    } else {
      nav.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });
}

// Initialize mobile nav functionality
function initMobileNavScripts() {
  const mobileNav = document.getElementById('mobileNav');
  if (!mobileNav) return;

  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const triggeredMenu = document.getElementById('triggeredMenu');
  const mobileInfoDropdownButton = document.getElementById('mobileInfoDropdownButton');
  const mobileInfoDropdownMenu = document.getElementById('mobileInfoDropdownMenu');
  const mobileInfoChevron = document.getElementById('mobileInfoChevron');
  const mobileUserDropdownButton = document.getElementById('mobileUserDropdownButton');
  const mobileUserDropdownMenu = document.getElementById('mobileUserDropdownMenu');
  const mobileUserChevron = document.getElementById('mobileUserChevron');
  const mobileLangDropdownButton = document.getElementById('mobileLangDropdownButton');
  const mobileLangDropdownMenu = document.getElementById('mobileLangDropdownMenu');

  if (mobileMenuToggle && triggeredMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      triggeredMenu.classList.toggle('open');
    });
  }

  // Mobile info dropdown
  if (mobileInfoDropdownButton && mobileInfoDropdownMenu) {
    mobileInfoDropdownButton.addEventListener('click', () => {
      mobileInfoDropdownMenu.classList.toggle('open');
      if (mobileInfoChevron) mobileInfoChevron.classList.toggle('rotated');
    });
  }

  // Mobile user dropdown
  if (mobileUserDropdownButton && mobileUserDropdownMenu) {
    mobileUserDropdownButton.addEventListener('click', () => {
      mobileUserDropdownMenu.classList.toggle('open');
      if (mobileUserChevron) mobileUserChevron.classList.toggle('rotated');
    });
  }

  // Mobile language dropdown
  if (mobileLangDropdownButton && mobileLangDropdownMenu) {
    mobileLangDropdownButton.addEventListener('click', (e) => {
      e.preventDefault();
      mobileLangDropdownMenu.classList.toggle('open');
    });
  }

  // Close menu when a link is clicked
  const links = mobileNav.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (triggeredMenu) triggeredMenu.classList.remove('open');
    });
  });
}
