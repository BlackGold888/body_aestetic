/* ============================================================
   AIURU Tashkent — main interactions
   Vanilla JS. No jQuery, no Bootstrap.
   - Smooth scroll for in-page links
   - Scroll-spy active state for sidebar nav
   - Mobile drawer open/close
   - Case modals (data-case-open triggers)
   - Intersection observer reveal-on-scroll
   - Hero stats counter
   - Pointer-tracked glow on glass cards
   ============================================================ */

(function () {
    'use strict';

    const doc = document;
    const body = doc.body;
    const root = doc.documentElement;

    /* ---------- Preloader ---------- */
    const preloader = doc.getElementById('preloader');
    const preloaderBar = doc.getElementById('preloaderBar');
    if (preloader && preloaderBar) {
        let progress = 0;
        let pageLoaded = false;
        const tick = setInterval(() => {
            const cap = pageLoaded ? 100 : 85;
            const step = pageLoaded ? 6 : (cap - progress) * 0.08 + 0.5;
            progress = Math.min(cap, progress + step);
            preloaderBar.style.width = progress + '%';
            if (progress >= 100) {
                clearInterval(tick);
                setTimeout(() => {
                    preloader.classList.add('is-hidden');
                    body.classList.remove('is-loading');
                    body.classList.add('is-loaded');
                }, 250);
            }
        }, 80);

        const finish = () => { pageLoaded = true; };
        if (doc.readyState === 'complete') finish();
        else window.addEventListener('load', finish);
        // Safety fallback — never leave preloader stuck
        setTimeout(finish, 6000);
    } else {
        body.classList.remove('is-loading');
        body.classList.add('is-loaded');
    }

    /* ---------- Smooth scroll ---------- */
    function smoothScrollTo(targetY) {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
    }

    function getOffsetTop(el) {
        let y = 0;
        while (el) { y += el.offsetTop; el = el.offsetParent; }
        return y;
    }

    function handleAnchorClick(e) {
        const a = e.currentTarget;
        const href = a.getAttribute('href');
        if (!href || href === '#' || !href.startsWith('#')) return;
        const target = doc.getElementById(href.slice(1));
        if (!target) return;
        e.preventDefault();
        const isMobile = window.matchMedia('(max-width: 767px)').matches;
        const offset = isMobile ? 64 : 0;
        smoothScrollTo(getOffsetTop(target) - offset);
        closeMobileDrawer();
    }

    doc.querySelectorAll('a.click-scroll, a.smoothscroll').forEach((a) => {
        a.addEventListener('click', handleAnchorClick);
    });

    /* ---------- Scroll-spy ---------- */
    const navLinks = Array.from(doc.querySelectorAll('#sidebarMenu .nav-link.click-scroll[href^="#"]'));
    const sections = navLinks
        .map((link) => {
            const id = link.getAttribute('href');
            const el = doc.getElementById(id.slice(1));
            return el ? { id, el, link } : null;
        })
        .filter(Boolean);

    function setActiveByScroll() {
        const pos = window.scrollY + 140;
        let currentId = null;
        for (const s of sections) {
            if (pos >= getOffsetTop(s.el)) currentId = s.id;
        }
        if (!currentId && sections.length) currentId = sections[0].id;
        navLinks.forEach((l) => l.classList.remove('active'));
        if (currentId) {
            const active = navLinks.find((l) => l.getAttribute('href') === currentId);
            if (active) active.classList.add('active');
        }
    }

    window.addEventListener('scroll', setActiveByScroll, { passive: true });
    window.addEventListener('load', setActiveByScroll);
    window.addEventListener('resize', setActiveByScroll);

    /* ---------- Mobile drawer ---------- */
    const drawer = doc.getElementById('mobileDrawer');
    const menuBtn = doc.getElementById('mobileMenuBtn');
    const menuClose = doc.getElementById('mobileMenuClose');

    function openMobileDrawer() {
        if (!drawer) return;
        drawer.classList.add('is-open');
        body.classList.add('no-scroll');
    }
    function closeMobileDrawer() {
        if (!drawer) return;
        drawer.classList.remove('is-open');
        body.classList.remove('no-scroll');
    }

    if (menuBtn) menuBtn.addEventListener('click', openMobileDrawer);
    if (menuClose) menuClose.addEventListener('click', closeMobileDrawer);
    if (drawer) {
        drawer.querySelector('.drawer-backdrop').addEventListener('click', closeMobileDrawer);
        drawer.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', closeMobileDrawer));
    }

    /* ---------- Case modals ---------- */
    function openModal(id) {
        const m = doc.getElementById(`caseModal${id}`);
        if (!m) return;
        m.classList.add('is-open');
        body.classList.add('no-scroll');
    }
    function closeAllModals() {
        doc.querySelectorAll('.case-modal.is-open').forEach((m) => m.classList.remove('is-open'));
        body.classList.remove('no-scroll');
    }

    doc.querySelectorAll('[data-case-open]').forEach((el) => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(el.getAttribute('data-case-open'));
        });
    });
    doc.querySelectorAll('.case-modal').forEach((m) => {
        m.querySelector('.case-modal__backdrop').addEventListener('click', closeAllModals);
        m.querySelector('.case-modal__close').addEventListener('click', closeAllModals);
    });
    doc.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAllModals(); });

    /* ---------- Reveal on scroll ---------- */
    const revealEls = doc.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
        revealEls.forEach((el) => io.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('is-visible'));
    }

    /* ---------- Hero stats counter ---------- */
    const counters = doc.querySelectorAll('[data-count]');
    if ('IntersectionObserver' in window && counters.length) {
        const co = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'), 10) || 0;
                const duration = 1400;
                const start = performance.now();
                function step(now) {
                    const t = Math.min(1, (now - start) / duration);
                    const eased = 1 - Math.pow(1 - t, 3);
                    el.textContent = Math.round(target * eased).toString();
                    if (t < 1) requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
                co.unobserve(el);
            });
        }, { threshold: 0.4 });
        counters.forEach((c) => co.observe(c));
    }

    /* ---------- Pointer-tracked glow on glass cards ---------- */
    doc.querySelectorAll('.glass-card').forEach((card) => {
        card.addEventListener('pointermove', (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${e.clientX - r.left}px`);
            card.style.setProperty('--my', `${e.clientY - r.top}px`);
        });
    });

    /* ---------- Hero parallax ---------- */
    const heroImg = doc.querySelector('.hero-bg-img');
    if (heroImg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (y < window.innerHeight) {
                heroImg.style.transform = `translateY(${y * 0.15}px) scale(${1.05 + y * 0.00015})`;
            }
        }, { passive: true });
    }

    /* ---------- Theme toggle ---------- */
    const THEME_KEY = 'aiuru-theme';
    const saved = localStorage.getItem(THEME_KEY);
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const initialTheme = saved || (prefersLight ? 'light' : 'dark');
    if (initialTheme === 'light') root.setAttribute('data-theme', 'light');

    function toggleTheme() {
        const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        if (next === 'light') root.setAttribute('data-theme', 'light');
        else root.removeAttribute('data-theme');
        localStorage.setItem(THEME_KEY, next);
    }
    doc.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
        btn.addEventListener('click', toggleTheme);
    });
})();
