/* ============================================================
   Dafoof Books — site script
   1. bilingual toggle (EN / AR with RTL)
   2. renders the shared product card everywhere
   3. shop filters + product detail page
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'dafoof-lang';

  /* ---------------- language ---------------- */

  function preferred() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'ar') return saved;
    } catch (e) { /* storage unavailable — fall through */ }
    var nav = (navigator.language || 'en').toLowerCase();
    return nav.indexOf('ar') === 0 ? 'ar' : 'en';
  }

  function apply(lang) {
    var root = document.documentElement;
    var isAr = lang === 'ar';

    root.lang = lang;
    root.dir = isAr ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-en]').forEach(function (el) {
      var value = el.getAttribute(isAr ? 'data-ar' : 'data-en');
      if (value) el.textContent = value;
    });

    document.querySelectorAll('[data-en-src]').forEach(function (el) {
      var src = el.getAttribute(isAr ? 'data-ar-src' : 'data-en-src');
      if (src) el.setAttribute('src', src);
    });

    document.querySelectorAll('.lang-toggle button').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === lang));
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }

    // page title follows the language too (each page can override via body data)
    var body = document.body;
    var tAr = body.getAttribute('data-title-ar');
    var tEn = body.getAttribute('data-title-en');
    if (tAr && tEn) document.title = isAr ? tAr : tEn;

    document.dispatchEvent(new CustomEvent('dafoof:lang', { detail: { lang: lang } }));
  }

  /* ---------------- catalogue helpers ---------------- */

  var D = window.DAOFOOF || { books: [], tags: {} };

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function priceHTML(book) {
    if (book.price === 0) {
      return '<span class="card__price free" data-en="Free" data-ar="مجاني">Free</span>';
    }
    var txt = '$' + book.price.toFixed(2);
    return '<span class="card__price" dir="ltr" data-en="' + txt + '" data-ar="' + txt + '">' + txt + '</span>';
  }

  function tagLabel(tag) {
    var t = D.tags[tag] || { en: tag, ar: tag };
    return '<span class="card__tag" data-en="' + esc(t.en) + '" data-ar="' + esc(t.ar) + '">' + esc(t.en) + '</span>';
  }

  var ARROW = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';

  function cardHTML(book) {
    var titleEn = esc(book.title.en);
    var titleAr = esc(book.title.ar);
    var href = 'product.html?id=' + encodeURIComponent(book.id);
    var ctaEn = book.price === 0 ? 'Download free' : 'Get this book';
    var ctaAr = book.price === 0 ? 'تحميل مجاني' : 'احصل على الكتاب';

    return '' +
      '<article class="card" data-tag="' + esc(book.tag) + '" data-id="' + esc(book.id) + '">' +
        '<a class="card__media" href="' + href + '" aria-label="' + titleEn + '">' +
          '<img src="' + esc(book.cover) + '" alt="' + titleEn + ' cover" loading="lazy">' +
        '</a>' +
        '<div class="card__body">' +
          tagLabel(book.tag) +
          '<h3 class="card__title"><a href="' + href + '" data-en="' + titleEn + '" data-ar="' + titleAr + '">' + titleEn + '</a></h3>' +
          priceHTML(book) +
          '<a class="card__link" href="' + esc(book.url) + '">' +
            '<span data-en="' + ctaEn + '" data-ar="' + ctaAr + '">' + ctaEn + '</span>' + ARROW +
          '</a>' +
        '</div>' +
      '</article>';
  }

  function booksFor(limit) {
    var list = D.books.slice();
    if (limit) list = list.slice(0, limit);
    return list;
  }

  /* ---------------- render: product grids ---------------- */

  function renderGrids() {
    document.querySelectorAll('[data-books-grid]').forEach(function (grid) {
      var limit = parseInt(grid.getAttribute('data-limit'), 10) || 0;
      grid.innerHTML = booksFor(limit).map(cardHTML).join('');
    });
  }

  /* ---------------- render: shop page ---------------- */

  function renderShop() {
    var grid = document.querySelector('[data-shop-grid]');
    if (!grid) return;

    var filters = document.querySelector('[data-shop-filters]');
    var count = document.querySelector('[data-shop-count]');
    var active = 'all';

    // build chips: All / each category / Free
    if (filters) {
      var chips = [];
      chips.push({ key: 'all', en: 'All books', ar: 'كل الكتب' });
      Object.keys(D.tags).forEach(function (key) {
        chips.push({ key: key, en: D.tags[key].en, ar: D.tags[key].ar });
      });
      chips.push({ key: 'free', en: 'Free', ar: 'مجاني' });

      filters.innerHTML = chips.map(function (c, i) {
        return '<button type="button" class="chip" data-filter="' + c.key + '" aria-pressed="' + (i === 0) + '"' +
          ' data-en="' + esc(c.en) + '" data-ar="' + esc(c.ar) + '">' + esc(c.en) + '</button>';
      }).join('');

      filters.addEventListener('click', function (ev) {
        var btn = ev.target.closest('[data-filter]');
        if (!btn) return;
        active = btn.getAttribute('data-filter');
        filters.querySelectorAll('.chip').forEach(function (c) {
          c.setAttribute('aria-pressed', String(c === btn));
        });
        paint();
      });
    }

    function matches(book) {
      if (active === 'all') return true;
      if (active === 'free') return book.price === 0;
      return book.tag === active;
    }

    function paint() {
      grid.innerHTML = D.books.filter(matches).map(cardHTML).join('');
      if (count) {
        var n = grid.children.length;
        count.setAttribute('data-en', n + (n === 1 ? ' book' : ' books'));
        count.setAttribute('data-ar', n + ' كتب');
        count.textContent = count.getAttribute(document.documentElement.lang === 'ar' ? 'data-ar' : 'data-en');
      }
      apply(document.documentElement.lang || 'en');
    }

    paint();
  }

  /* ---------------- render: product page ---------------- */

  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 12.5 5 5L20 6.5"/></svg>';

  function renderProduct() {
    var root = document.querySelector('[data-product-root]');
    if (!root) return;

    var id = new URLSearchParams(location.search).get('id');
    var book = D.byId(id) || D.books[0];
    if (!book) return;

    var isFree = book.price === 0;
    var priceBlock = isFree
      ? '<p class="product__price free" data-en="Free" data-ar="مجاني">Free</p>'
      : (function () {
          var txt = '$' + book.price.toFixed(2);
          return '<p class="product__price" dir="ltr" data-en="' + txt + '" data-ar="' + txt + '">' + txt + '</p>';
        })();

    var buyEn = isFree ? 'Download free on Payhip' : 'Buy on Payhip';
    var buyAr = isFree ? 'حمّل مجانًا من Payhip' : 'اشترِ عبر Payhip';

    root.innerHTML = '' +
      '<div class="product">' +
        '<div class="product__media">' +
          '<img src="' + esc(book.cover) + '" alt="' + esc(book.title.en) + ' cover">' +
        '</div>' +
        '<div class="product__info">' +
          '<span class="card__tag" data-en="' + esc((D.tags[book.tag] || {}).en || '') + '" data-ar="' + esc((D.tags[book.tag] || {}).ar || '') + '">' + esc((D.tags[book.tag] || {}).en || '') + '</span>' +
          '<h1 data-en="' + esc(book.title.en) + '" data-ar="' + esc(book.title.ar) + '">' + esc(book.title.en) + '</h1>' +
          priceBlock +
          '<p class="product__blurb" data-en="' + esc(book.blurb.en) + '" data-ar="' + esc(book.blurb.ar) + '">' + esc(book.blurb.en) + '</p>' +
          '<ul class="points">' +
            book.points.map(function (p) {
              return '<li>' + CHECK + '<span data-en="' + esc(p.en) + '" data-ar="' + esc(p.ar) + '">' + esc(p.en) + '</span></li>';
            }).join('') +
          '</ul>' +
          '<div class="product__cta">' +
            '<a class="btn ' + (isFree ? 'btn--gold' : 'btn--primary') + '" href="' + esc(book.url) + '" data-en="' + buyEn + '" data-ar="' + buyAr + '">' + buyEn + '</a>' +
            '<a class="btn btn--ghost" href="shop.html" data-en="Back to the shelf" data-ar="العودة إلى الرفّ">Back to the shelf</a>' +
          '</div>' +
          '<div class="trust trust--product">' +
            '<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M4 21h16"/></svg><span data-en="Instant download" data-ar="تحميل فوري">Instant download</span></span>' +
            '<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="10" width="18" height="11" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/></svg><span data-en="Secure checkout by Payhip" data-ar="دفع آمن عبر Payhip">Secure checkout by Payhip</span></span>' +
            '<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v18H6.5A2.5 2.5 0 0 1 4 18.5z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v18h5.5a2.5 2.5 0 0 0 2.5-2.5z"/></svg><span data-en="Yours to keep" data-ar="يملكه إلى الأبد">Yours to keep</span></span>' +
          '</div>' +
        '</div>' +
      '</div>';

    // breadcrumb tail = current title
    var crumb = document.querySelector('[data-crumb-current]');
    if (crumb) {
      crumb.setAttribute('data-en', book.title.en);
      crumb.setAttribute('data-ar', book.title.ar);
      crumb.textContent = book.title.en;
    }

    // page title
    document.body.setAttribute('data-title-en', book.title.en + ' — Dafoof Books');
    document.body.setAttribute('data-title-ar', book.title.ar + ' — كتب دفوف');

    // related: same tag first, then the rest, three in total
    var related = D.books.filter(function (b) { return b.id !== book.id && b.tag === book.tag; });
    D.books.forEach(function (b) {
      if (b.id !== book.id && related.indexOf(b) === -1) related.push(b);
    });
    var relGrid = document.querySelector('[data-related-grid]');
    if (relGrid) relGrid.innerHTML = related.slice(0, 3).map(cardHTML).join('');
  }

  /* ---------------- boot ---------------- */

  document.querySelectorAll('.lang-toggle button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      apply(btn.getAttribute('data-lang'));
    });
  });

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  renderGrids();
  renderShop();
  renderProduct();

  apply(preferred());

  // keep dynamically injected copy in sync when the language flips
  document.addEventListener('dafoof:lang', function () { /* apply() already rewrites [data-en] */ });
})();
