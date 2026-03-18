(function(){
  // Show modal overlay and box with animation classes
  window.showModal = function(overlayId, boxId){
    const overlay = document.getElementById(overlayId);
    const box = boxId ? document.getElementById(boxId) : null;
    if(!overlay) return;
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '99999';
    // force reflow so transition reliably runs
    void overlay.offsetWidth;
    overlay.classList.add('visible');
    if(box) setTimeout(()=> box.classList.add('show'), 10);
  };

  // Hide modal overlay/box with reverse animation
  window.hideModal = function(overlayId, boxId){
    const overlay = document.getElementById(overlayId);
    const box = boxId ? document.getElementById(boxId) : null;
    if(!overlay) return;
    if(box) box.classList.remove('show');
    overlay.classList.remove('visible');
    // wait for CSS transition to finish then hide
    setTimeout(function(){ overlay.style.display = 'none'; overlay.style.zIndex = ''; }, 240);
  };

  // Wire standard handlers: click outside + close button + Escape
  window.initModal = function(overlayId, boxId, closeButtonId){
    const overlay = document.getElementById(overlayId);
    const box = boxId ? document.getElementById(boxId) : null;
    const closeBtn = closeButtonId ? document.getElementById(closeButtonId) : null;
    if(!overlay) return;
    overlay.addEventListener('click', function(e){ if(e.target === overlay) hideModal(overlayId, boxId); });
    if(closeBtn) closeBtn.addEventListener('click', function(){ hideModal(overlayId, boxId); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') hideModal(overlayId, boxId); });
  };
})();
