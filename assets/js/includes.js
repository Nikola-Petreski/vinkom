document.addEventListener("DOMContentLoaded", () => {
  // Determine the path to the includes based on current page location
  let basePath = "";
  const currentPath = window.location.pathname;
  
  // If we're in a subdirectory, adjust the path
  if (currentPath.includes("/")) {
    const depth = (currentPath.match(/\//g) || []).length - 1;
    if (depth > 1) {
      // We're in a subdirectory, go up
      for (let i = 1; i < depth; i++) {
        basePath += "../";
      }
    }
  }
  
  // Fetch nav
  fetch(basePath + "includes/nav.html")
    .then(res => {
      if (!res.ok) throw new Error("Failed to load nav");
      return res.text();
    })
    .then(html => {
      const container = document.getElementById("nav-container");
      if (container) {
        container.innerHTML = html;
        // Initialize nav scripts
        initNavScripts();
      }
    })
    .catch(err => console.warn("Error loading nav:", err));

  // Fetch mobile nav
  fetch(basePath + "includes/mobileNav.html")
    .then(res => {
      if (!res.ok) throw new Error("Failed to load mobileNav");
      return res.text();
    })
    .then(html => {
      const container = document.getElementById("mobile-nav-container");
      if (container) {
        container.innerHTML = html;
        // Initialize mobile nav scripts
        initMobileNavScripts();
      }
    })
    .catch(err => console.warn("Error loading mobileNav:", err));

  // Fetch footer
  fetch(basePath + "includes/footer.html")
    .then(res => {
      if (!res.ok) throw new Error("Failed to load footer");
      return res.text();
    })
    .then(html => {
      const container = document.getElementById("footer-container");
      if (container) {
        container.innerHTML = html;
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
