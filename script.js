
const mobileMenu = document.querySelector('[data-mobile-menu]');
const openButtons = document.querySelectorAll('[data-menu-open]');
const closeButtons = document.querySelectorAll('[data-menu-close]');

function openMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.add('is-open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove('is-open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

openButtons.forEach((btn) => btn.addEventListener('click', openMenu));
closeButtons.forEach((btn) => btn.addEventListener('click', closeMenu));

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

const track = document.querySelector('[data-carousel-track]');
const prevBtn = document.querySelector('[data-carousel-prev]');
const nextBtn = document.querySelector('[data-carousel-next]');
const dotsWrap = document.querySelector('[data-carousel-dots]');

if (track && dotsWrap) {
  const cards = Array.from(track.children);

  function cardsPerView() {
    return window.matchMedia('(max-width: 980px)').matches ? 1 : 2;
  }

  function pageCount() {
    return Math.ceil(cards.length / cardsPerView());
  }

  let page = 0;

  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < pageCount(); i += 1) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to project page ${i + 1}`);
      dot.addEventListener('click', () => goToPage(i));
      dotsWrap.appendChild(dot);
    }
    updateDots();
  }

  function updateDots() {
    Array.from(dotsWrap.children).forEach((dot, i) => {
      dot.classList.toggle('is-active', i === page);
    });
  }

  function goToPage(index) {
    const total = pageCount();
    page = (index + total) % total;
    const card = cards[page * cardsPerView()];
    if (card) {
      track.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
    }
    updateDots();
  }

  prevBtn?.addEventListener('click', () => goToPage(page - 1));
  nextBtn?.addEventListener('click', () => goToPage(page + 1));

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      page = 0;
      buildDots();
    }, 200);
  });

  buildDots();
}

window.dataLayer = window.dataLayer || [];

function trackEvent(eventName, label) {
  window.dataLayer.push({
    event: 'click_tracking',
    event_name: eventName,
    event_label: label,
    page_title: document.title,
  });

  if (window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'engagement',
      event_label: label,
    });
  }
}

document.querySelectorAll('[data-track]').forEach((element) => {
  element.addEventListener('click', () => {
    trackEvent(element.dataset.track, element.textContent.trim() || element.dataset.track);
  });
});