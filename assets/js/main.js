(function() {
    'use strict';

    const scripts = document.getElementsByClassName('script');
    for (const script of scripts) {
        script.href = script.dataset.src;
        script.href = 'javascript:(function(){document.body.appendChild(document.createElement(\'script\')).src=\'' + script.href + '\';})();';
        script.addEventListener('click', function(event) {
            window.open(script.dataset.src, '_blank');
            event.preventDefault();
        });
    }
})();
