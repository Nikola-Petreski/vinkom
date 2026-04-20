(function(){
  function executeAndReplaceScripts(container){
    const scripts = Array.from(container.querySelectorAll('script'));
    if(scripts.length === 0) return Promise.resolve();

    // Process scripts sequentially and wait for external ones to load
    return scripts.reduce((chain, oldScript) => {
      return chain.then(() => new Promise((res, rej) => {
        try {
          const newScript = document.createElement('script');
          // copy attributes
          for(let i=0;i<oldScript.attributes.length;i++){
            const attr = oldScript.attributes[i];
            newScript.setAttribute(attr.name, attr.value);
          }
          if(oldScript.src){
            // external script: load and wait
            newScript.src = oldScript.src;
            newScript.onload = () => { res(); };
            newScript.onerror = () => { console.warn('Failed to load script', oldScript.src); res(); };
            // append to head to allow proper loading
            document.head.appendChild(newScript);
            // remove old script tag
            oldScript.parentNode && oldScript.parentNode.removeChild(oldScript);
          } else {
            // inline script: copy content and execute immediately
            newScript.textContent = oldScript.textContent;
            // replace old script with new one so it executes in place
            oldScript.parentNode && oldScript.parentNode.replaceChild(newScript, oldScript);
            res();
          }
        } catch(e){
          console.error('Script exec error', e);
          res();
        }
      }));
    }, Promise.resolve());
  }

  function loadPartial(selector, path){
    const container = document.querySelector(selector);
    if(!container) return Promise.reject('Container ' + selector + ' not found');
    return fetch(path)
      .then(r => r.ok ? r.text() : Promise.reject('Failed to load ' + path))
      .then(async html => {
        // inject HTML
        container.innerHTML = html;
        // execute any scripts found inside the injected HTML
        await executeAndReplaceScripts(container);
      })
      .catch(e => { console.error('Partial load error:', e); throw e; });
  }

  // Load nav and footer partials, then attach nav-scroll behavior
  Promise.all([
    loadPartial('#nav-container', 'includes/nav.html'),
    loadPartial('#footer-container', 'includes/footer.html')
  ]).then(() => {
    // After partials loaded and their inline scripts executed, load nav-scroll behavior
    const script = document.createElement('script');
    script.src = 'includes/nav-scroll.js';
    document.body.appendChild(script);
  }).catch(e => console.warn('Some partials failed to load', e));
})();


