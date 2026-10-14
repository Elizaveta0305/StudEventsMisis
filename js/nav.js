(function(){
    function initMobileNav(){
        const navToggle = document.getElementById('navToggle');
        const headerLinks = document.querySelector('.header_links');
        if(!navToggle || !headerLinks) return;

        navToggle.addEventListener('click', function(){
            const isOpen = headerLinks.classList.contains('open');
            navToggle.classList.toggle('open');
            headerLinks.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', !isOpen);
        });

        document.addEventListener('click', function(event){
            if(!navToggle.contains(event.target) && !headerLinks.contains(event.target)){
                navToggle.classList.remove('open');
                headerLinks.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    document.addEventListener('DOMContentLoaded', initMobileNav);
})();