/* ============================================================
   THƯ VIỆN TRI THỨC — data-driven book shelf
   ------------------------------------------------------------
   CÁCH THÊM MỘT CUỐN SÁCH MỚI (chỉ 2 bước):
   1) Tạo folder  books/<slug>/index.html  (trang chi tiết)
   2) Thêm 1 object vào mảng BOOKS bên dưới
   ============================================================ */

const BOOKS = [
  {
    slug: 'deep-work',
    title: 'Deep Work',
    titleVi: 'Làm việc sâu',
    author: 'Cal Newport',
    year: 2016,
    tag: 'Năng suất',
    glyph: '🧠',
    blurb: 'Tập trung sâu là siêu năng lực thế kỷ 21 — và nó ngày càng quý, càng hiếm.',
    cover: { from: '#4f46e5', to: '#7c3aed' },
    ready: true,
  },

  {
    slug: 'hyperfocus',
    title: 'Hyperfocus',
    titleVi: 'Siêu tập trung',
    author: 'Chris Bailey',
    year: 2018,
    tag: 'Năng suất',
    glyph: '🎯',
    blurb: 'Quản lý sự chú ý, không phải thời gian — Hyperfocus + Scatterfocus, hai chế độ não cần rèn.',
    cover: { from: '#0d9488', to: '#0891b2' },
    ready: true,
  },

  {
    slug: 'atomic-habits',
    title: 'Atomic Habits',
    titleVi: 'Thói quen nguyên tử',
    author: 'James Clear',
    year: 2018,
    tag: 'Phát triển bản thân',
    glyph: '🔁',
    blurb: '4 Quy luật thói quen — dễ áp dụng, nhưng nhiều tuyên bố khoa học bị thổi phồng (bản sắc, 1%=37×) và giai thoại mang thiên kiến sống sót.',
    cover: { from: '#16a34a', to: '#15803d' },
    ready: true,
  },

  {
    slug: 'four-thousand-weeks',
    title: 'Four Thousand Weeks',
    titleVi: 'Bốn nghìn tuần',
    author: 'Oliver Burkeman',
    year: 2021,
    tag: 'Triết lý',
    glyph: '⏳',
    blurb: 'Một đời chỉ ≈ 4000 tuần — hữu hạn không phải lỗi, mà là điều kiện của ý nghĩa. "Làm hết mọi việc" bất khả thi về cấu trúc.',
    cover: { from: '#c2410c', to: '#9a3412' },
    ready: true,
  },

  /* ---------- Mẫu: thêm sách mới theo cấu trúc này ----------
  {
    slug: 'atomic-habits',
    title: 'Atomic Habits',
    titleVi: 'Thói quen nguyên tử',
    author: 'James Clear',
    year: 2018,
    tag: 'Phát triển bản thân',
    glyph: '🔁',
    blurb: 'TINY gains compound thành kết quả lớn.',
    cover: { from: '#0d9488', to: '#0891b2' },
    ready: false,                       // false = "sắp ra mắt", không click được
  },
  ---------------------------------------------------------- */

  // Phần demo "sắp ra mắt" — xoá khi có nội dung thật:
  {
    slug: 'thinking-fast-slow',
    title: 'Thinking, Fast and Slow',
    titleVi: 'Tư duy nhanh và chậm',
    author: 'Daniel Kahneman',
    year: 2011,
    tag: 'Tâm lý học',
    glyph: '⚖️',
    blurb: 'Hai hệ thống tư duy chi phối mọi quyết định của ta.',
    cover: { from: '#334155', to: '#475569' },
    ready: false,
  },
  {
    slug: 'the-almanack',
    title: 'The Almanack of Naval Ravikant',
    titleVi: 'Cẩm nang Naval',
    author: 'Eric Jorgenson',
    year: 2020,
    tag: 'Đầu tư',
    glyph: '💎',
    blurb: 'Về sự giàu có và hạnh phúc — theo cách Naval.',
    cover: { from: '#b45309', to: '#d97706' },
    ready: false,
  },
];

/* ============================================================
   Render + filter logic
   ============================================================ */
(function () {
  'use strict';

  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');
  const search = document.getElementById('search');
  const tagFilter = document.getElementById('tagFilter');
  const statBooks = document.getElementById('statBooks');
  const statReady = document.getElementById('statReady');

  let activeTag = 'Tất cả';

  /* ---- tags ---- */
  const tags = ['Tất cả', ...new Set(BOOKS.map(b => b.tag))];
  tagFilter.innerHTML = tags.map(t =>
    `<button class="tag${t === 'Tất cả' ? ' active' : ''}" data-tag="${t}">${t}</button>`
  ).join('');
  tagFilter.addEventListener('click', e => {
    const btn = e.target.closest('.tag');
    if (!btn) return;
    activeTag = btn.dataset.tag;
    tagFilter.querySelectorAll('.tag').forEach(t => t.classList.toggle('active', t === btn));
    render();
  });

  /* ---- card builder ---- */
  function card(b) {
    const cover = `linear-gradient(150deg, ${b.cover.from}, ${b.cover.to})`;
    const href = `books/${b.slug}/index.html`;
    const coverInner = `
      <div class="book__glyph">${b.glyph}</div>
      <div class="book__coverTitle">${b.title}</div>
      <div class="book__author">${b.author}</div>`;

    if (b.ready) {
      return `
        <a class="book" href="${href}">
          <div class="book__cover" style="background:${cover}">${coverInner}</div>
          <div class="book__body">
            <div class="book__row">
              <span class="book__tag">${b.tag}</span>
              <span class="book__year">${b.year}</span>
            </div>
            <h3 class="book__title">${b.titleVi}</h3>
            <p class="book__blurb">${b.blurb}</p>
            <span class="book__cta">Đọc bản trực quan →</span>
          </div>
        </a>`;
    }
    return `
      <div class="book book--soon" aria-disabled="true">
        <div class="book__cover" style="background:${cover}">${coverInner}</div>
        <div class="book__body">
          <div class="book__row">
            <span class="book__tag">${b.tag}</span>
            <span class="book__year">${b.year}</span>
          </div>
          <h3 class="book__title">${b.titleVi}</h3>
          <p class="book__blurb">${b.blurb}</p>
          <span class="book__status">⏳ Sắp ra mắt</span>
        </div>
      </div>`;
  }

  /* ---- render with filter ---- */
  function render() {
    const q = search.value.trim().toLowerCase();
    const list = BOOKS.filter(b => {
      const matchTag = activeTag === 'Tất cả' || b.tag === activeTag;
      const matchQ = !q || [b.title, b.titleVi, b.author, b.tag, b.blurb]
        .some(s => String(s).toLowerCase().includes(q));
      return matchTag && matchQ;
    });

    // sắp xếp: đã ready lên trước
    list.sort((a, b) => (b.ready === true) - (a.ready === true));

    grid.innerHTML = list.map(card).join('');
    empty.hidden = list.length > 0;
  }

  search.addEventListener('input', render);

  /* ---- stats ---- */
  statBooks.textContent = BOOKS.length;
  statReady.textContent = BOOKS.filter(b => b.ready).length;

  render();
})();
