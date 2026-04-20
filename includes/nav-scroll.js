(function(){
    const nav = document.getElementById('nav');
    const spacer = document.getElementById('nav-spacer');
    if(!nav) return;

    // ensure smooth transition
    nav.style.transition = nav.style.transition || 'transform 360ms cubic-bezier(0.2,0,0.2,1), opacity 300ms linear backdrop-filter 300ms ease';
    nav.style.willChange = 'transform, opacity';
    nav.style.transform = nav.style.transform || 'translateY(0)';
    nav.style.opacity = nav.style.opacity || '1';

    // compute and set spacer height (px) so layout doesn't jump
    function recompute(){
        try{
            const h = Math.ceil(nav.getBoundingClientRect().height);
            if(spacer) spacer.style.height = h + 'px';
        }catch(e){}
    }
    recompute();
    window.addEventListener('resize', recompute, {passive:true});

    let lastScroll = window.pageYOffset || document.documentElement.scrollTop;
    let ticking = false;

    function hideNav(){
        const h = Math.ceil(nav.getBoundingClientRect().height) + 4;
        nav.style.transform = 'translateY(-' + h + 'px)';
        nav.style.opacity = '0';
    }
    function showNav(){
        nav.style.transform = 'translateY(0)';
        nav.style.opacity = '1';
    }

    function onScroll(){
        const current = window.pageYOffset || document.documentElement.scrollTop;
        if(current > lastScroll + 6){
            hideNav();
        } else if(current < lastScroll - 6){
            showNav();
        }
        lastScroll = current <= 0 ? 0 : current;
        ticking = false;
    }

    window.addEventListener('scroll', function(){
        if(!ticking){ window.requestAnimationFrame(onScroll); ticking = true; }
    }, {passive:true});
})();


