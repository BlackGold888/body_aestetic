// jquery-click-scroll (fixed to use real href targets)
// by syamsul'isul' Arifin — adapted

(function ($) {
    const $menu = $('#sidebarMenu');
    const $links = $menu.find('.nav-link[href^="#"]');

    // прокрутка по клику
    $links.on('click', function (e) {
        const target = $(this).attr('href');
        if (!target || target === '#') return;
        const $el = $(target);
        if (!$el.length) return;

        e.preventDefault();
        $('html, body').animate({ scrollTop: $el.offset().top }, 350);
    });

    // подсветка активного пункта при прокрутке
    const sections = $links
        .map(function () {
            const id = $(this).attr('href');
            const $el = $(id);
            return $el.length ? { id, $el } : null;
        })
        .get();

    function setActiveByScroll() {
        const scrollPos = $(document).scrollTop();
        const offset = 100; // порог активации
        let currentId = null;

        for (let i = 0; i < sections.length; i++) {
            const top = sections[i].$el.offset().top - offset;
            if (scrollPos >= top) currentId = sections[i].id;
        }

        if (currentId) {
            $links.removeClass('active').addClass('inactive');
            $links.filter(`[href="${currentId}"]`).addClass('active').removeClass('inactive');
        }
    }

    // стартовые классы
    $links.addClass('inactive');
    $links.first().addClass('active').removeClass('inactive');

    // события
    $(document).on('scroll', setActiveByScroll);
    $(window).on('load resize', setActiveByScroll);
})(jQuery);
