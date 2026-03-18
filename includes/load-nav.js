(function(){
  const NAV_PATH = 'includes/nav.html';
  let lastHtml = null;
  const POLL_MS = 2000;

  function insertNav(html){
    try{
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html.trim();
      const navEl = wrapper.firstElementChild;
      if(!navEl) return;

      const existing = document.getElementById('nav');
      if(existing){
        existing.className = navEl.className;
        existing.innerHTML = navEl.innerHTML;
      } else {
        document.body.prepend(navEl);
      }

      const evName = lastHtml === null ? 'nav-ready' : 'nav-updated';
      window.dispatchEvent(new CustomEvent(evName, { detail: { html } }));
    }catch(err){
      console.error('Failed to insert nav', err);
    }
  }

  function fetchNav(){
    return fetch(NAV_PATH, { cache: 'no-cache' }).then(r => {
      if(!r.ok) throw new Error('HTTP '+r.status);
      return r.text();
    });
  }

  fetchNav().then(html => {
    lastHtml = html;
    insertNav(html);

    try{
      setInterval(() => {
        fetchNav().then(newHtml => {
          if(!newHtml) return;
          if(newHtml !== lastHtml){
            lastHtml = newHtml;
            insertNav(newHtml);
            console.info('Nav updated from includes/nav.html');
          }
        }).catch(()=>{/* ignore transient fetch errors during dev */});
      }, POLL_MS);
    }catch(err){
      console.error('Failed to start nav polling', err);
    }
  }).catch(function(err){
    console.error('Failed to load nav include:', err);
  });
})();
