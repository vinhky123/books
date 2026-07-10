# Book Page Structure Guide

Tài liệu này mô tả **backbone** (cấu trúc xương sống) cho mọi trang tóm tắt sách.
Khi thêm một cuốn sách mới, dùng nó làm bản đồ — còn `_template/index.html`
là bộ khung sẵn để copy.

> **TL;DR** — Mỗi trang sách = 6 phần cố định theo thứ tự:
> **Hero → Frame → Concepts → Application → Lens → Closing.**
> Điểm khác biệt với bản cũ: khái niệm giờ là **Concept Card** có ô cố định
> (WHAT / WHY / EVIDENCE / LINK) thay vì văn xuôi tự do.

---

## 1. Cấu trúc tệp & thư mục

```
books/
├── index.html              # landing page (kệ sách)
├── css/landing.css
├── js/landing.js           # ← mảng BOOKS (registry/catalog)
├── assets/
│   ├── book.css            # ★ CSS dùng chung cho MỌI trang sách
│   └── book.js             # ★ JS dùng chung (sidebar, progress, scroll-spy)
├── _template/
│   └── index.html          # ★ bộ khung để copy khi tạo sách mới
├── STRUCTURE.md            # ← file này
└── books/
    └── <slug>/
        └── index.html      # nội dung duy nhất mỗi cuốn — KHÔNG có css/js riêng
```

**Quy tắc:**
- Mỗi cuốn sách là **một folder** `books/<slug>/` chứa **chỉ một file** `index.html`.
- CSS và JS **dùng chung** ở `assets/` — link bằng `../../assets/book.css`
  và `../../assets/book.js`.
- **Không** tạo `css/` hay `js/` riêng cho từng sách nữa. Tất cả block style
  đã có sẵn trong `book.css`.

---

## 2. Thêm một cuốn sách mới — 5 bước

1. **Copy** `_template/` → `books/<slug>/` (vd: `books/atomic-habits/`).
2. **Mở** `books/<slug>/index.html`, thay từng marker `[SLOT: ...]` bằng nội dung thật.
   - Đặt `<title>`, `meta description`.
   - (Tuỳ chọn) đổi màu nhấn trong khối `<style>` ở `<head>`.
3. **Cập nhật sidebar** (`<nav class="tree">`) cho khớp với số Concept và id.
4. **Đăng ký** cuốn sách vào `js/landing.js` — thêm một object vào mảng `BOOKS`
   (đặt `ready: true` khi xong, `false` khi đang viết dở).
5. **Xoá** khối comment hướng dẫn ở đầu file.

Xong. Không cần build step, không cần dependency.

---

## 3. Backbone — 6 phần của một trang sách

Mỗi trang **bắt buộc** có đủ 6 phần theo thứ tự. Đây là cốt lõi của format mới:

```
┌─────────────────────────────────────────────────────────┐
│ 0 · IDENTITY HERO          ← nhận diện + luận điểm trung tâm │
├─────────────────────────────────────────────────────────┤
│ 1 · 30-SECOND FRAME        ← bản đồ ý tưởng, quét nhanh    │
├─────────────────────────────────────────────────────────┤
│ 2 · CONCEPT DEEP-DIVES     ★ PHẦN LÕN — một card/khái niệm  │
├─────────────────────────────────────────────────────────┤
│ 3 · APPLICATION LAB        ← hành động cụ thể, checklist     │
├─────────────────────────────────────────────────────────┤
│ 4 · CRITICAL LENS          ← phản biện, đính chính nguồn     │
├─────────────────────────────────────────────────────────┤
│ 5 · CLOSING                ← câu chốt + nguồn                │
└─────────────────────────────────────────────────────────┘
```

### 3.0 · IDENTITY HERO (`.hero`)

Phần đầu trang. Nhỏ gọn, định danh cuốn sách + luận điểm trung tâm.

| Ô | Lớp | Nội dung |
|---|---|---|
| Kicker | `.hero__kicker` | nhãn nhỏ, vd "Tổng hợp · đã cross-check" |
| Tiêu đề gốc | `.hero__title` | tên gốc (English) |
| Tiêu đề VN | `.hero__titlevi` | tên tiếng Việt |
| Tagline | `.hero__sub` | câu hứa hẹn/lời dẫn trung tâm |
| Meta | `.hero__meta` | Tác giả · Năm · Thể loại |
| **Luận điểm trung tâm** | `.hero__formula` | ★ **một câu** tóm cả cuốn sách |
| Intro | `.hero__intro` | 2–3 câu giải thích cách trang tổ chức |

> **Luận điểm trung tâm** là quan trọng nhất — phải cô đặc thành một câu
> (hoặc một phương trình). Nếu không thu được thành một câu, bạn chưa hiểu rõ sách.

### 3.1 · 30-SECOND FRAME (`.frame`) — MỚI

Bản đồ ý tưởng để quét nhanh. Đây là phần giải quyết khiếu nại "không scan được".

```html
<ol class="frame__list">
  <li>
    <div class="frame__main">
      <b><a href="#concept-1">Tên khái niệm</a></b>
      <span>Một dòng cốt yếu (≤ 14 từ)</span>
    </div>
    <span class="frame__tag">nhãn (vd: Cơ chế)</span>
  </li>
</ol>
```

**Quy tắc:**
- **Một `<li>` = một ý chính.** Mỗi ý link tới Concept Card tương ứng (`#concept-n`).
- Giữ **≤ 6 dòng** để quét được trong 30 giây.
- Dòng cốt yếu phải đứng độc lập — đọc riêng vẫn hiểu được gist.

### 3.2 · CONCEPT DEEP-DIVES (`.concept`) — ★ PHẦN LÕN

Đây là **phần lớn nhất** và là điểm khác biệt cốt lõi với format cũ. Mỗi khái niệm
là một **Concept Card** với **ô cố định** — không cho phép viết văn xuôi tự do lan man.

```html
<section id="concept-1" class="concept">
  <div class="concept__head">
    <span class="concept__no">1</span>
    <div>
      <p class="concept__part">[nhãn cụm/phần]</p>
      <h2>Tên khái niệm</h2>
    </div>
  </div>
  <p class="concept__def">[MỘT câu định nghĩa — giới hạn chặt nhất có thể]</p>

  <div class="concept__rows">
    <div class="concept__row">
      <span class="concept__label">What</span>
      <p>Ý tưởng LÀ gì — giới hạn chính xác, đối lập với những gì nó KHÔNG phải.</p>
    </div>
    <div class="concept__row">
      <span class="concept__label concept__label--why">Vì sao</span>
      <p>CƠ CHẾ — vì sao nó hoạt động. Nêu tên quá trình nền tảng (thần kinh, kinh tế, tâm lý).</p>
    </div>
    <div class="concept__row">
      <span class="concept__label concept__label--evidence">Bằng chứng</span>
      <p>Nghiên cứu, ví dụ cụ thể, hoặc con số. Trích nguồn, cross-check phân quyền.</p>
    </div>
    <div class="concept__row">
      <span class="concept__label concept__label--link">Liên kết</span>
      <p>Cách khái niệm NỐI — với luận điểm, khái niệm khác, hoặc ứng dụng.</p>
    </div>
  </div>
</section>
```

**Vì sao có ô cố định?** Đây là **cơ chế chống văn xuôi**. Khi bạn bắt buộc điền
"What / Vì sao / Bằng chứng / Liên kết", bạn không thể viết một đoạn lan man được —
mỗi ý phải có cơ chế + bằng chứng + vị trí trong bức tranh lớn.

**Quy tắc:**
- **Một `<section class="concept">` = một khái niệm.** Lặp cho mỗi concept.
- Xen kẽ `.concept` / `.concept--alt` để tạo nhịp nền (trắng / off-white).
- `.concept__def` phải là **một câu duy nhất**.
- Nếu khái niệm thực sự cần bảng so sánh (vd "Deep vs Shallow"), có thể bỏ block
  `.compare` vào ô `What` thay vì văn xuôi.
- Nếu sách có nhiều phần, dùng `.part-banner` (banner tối) để chia.

### 3.3 · APPLICATION LAB (`.sec` + ticks/timeline)

Gom **hành động cụ thể**. Đây là phần "Tác dụng thực tế" — biến ý tưởng thành việc làm.

| Block | Dùng khi |
|---|---|
| `.ticks` + `.tick` | quy tắc/hành động — `tên : cách làm + Tác dụng` |
| `.callout` | thử nghiệm (vd "30 ngày ngừng MXH") |
| `.timeline` + `.tl` | lộ trình từng bước / từng tuần |
| `.bonus-grid` + `.bonus` | nguyên tắc bổ trợ (3 cột) |
| `.odx` + `.odx__i` | danh sách numbered (vd 4DX) |

> **Bắt buộc** mỗi hành động phải có `<i>Tác dụng:</i>` — giải thích vì sao nó có tác dụng.
> Đây là DNA biên tập, không tuỳ chọn.

### 3.4 · CRITICAL LENS (`.crit`) — BẮT BUỘC

Phần **phản biện trung thực**. Mỗi cuốn sách phải có — không có là chưa hoàn thành.

```html
<div class="crit-grid">
  <div class="crit"><span class="crit__n">01</span><p>Điểm hạn chế / bằng chứng ngược.</p></div>
</div>
```

Bao gồm:
- Hạn chế của luận điểm sách.
- Trường hợp lời khuyên thất bại.
- Đính chính nguồn / thống kê bị trích dẫn sai.
- Giai đoạn sự nghiệp/hoàn cảnh khi advice không áp dụng được.

### 3.5 · CLOSING (`.closing`)

- `.closing__q` — câu chốt gốc (English).
- `.closing__t` — bản dịch tiếng Việt.
- `.sources` (`<details>`) — nguồn tham khảo, collapsible.

---

## 4. Thư viện Block (tóm tắt)

Tất cả block đã có style sẵn trong `assets/book.css`. Bảng tra nhanh:

| Block | Mục đích |
|---|---|
| `.hero` + con | phần đầu, luận điểm trung tâm |
| `.frame` + `.frame__list` | ★ bản đồ 30 giây |
| `.concept` + `.concept__rows` | ★ card khái niệm (ô cố định) |
| `.compare` + `.compare__col` | so sánh hai cột (A vs B) |
| `.vrm` + `.vrm__item` | đa góc nhìn (3 cột) |
| `.eqbox` | phương trình / công thức |
| `.why` | giải thích cơ chế (prose có cấu trúc) |
| `.insight` | callout "💡 Vì sao..." (nền tint) |
| `.alert` | cảnh báo / đính chính nguồn (nền vàng) |
| `.ticks` + `.tick` | danh sách hành động (tên : cách + Tác dụng) |
| `.odx` + `.odx__i` | numbered list (vd 4DX) |
| `.philo-table` + `.philo-row` | bảng hairline (vd 4 triết lý) |
| `.callout` | callout nhẹ (vd thử nghiệm 30 ngày) |
| `.bonus-grid` + `.bonus` | 3 nguyên tắc bổ trợ |
| `.timeline` + `.tl` | timeline dọc (lộ trình) |
| `.part-banner` | banner tối chia phần sách |
| `.crit-grid` + `.crit` | danh sách phản biện (numbered, đỏ) |
| `.closing` + `.sources` | câu chốt + nguồn |

---

## 5. DNA biên tập — giữ cho mọi sách

3 nguyên tắc định hình phong cách, **phải có** trong mọi trang:

1. **"Vì sao" (Why)** — mọi khái niệm/hành động phải giải thích *cơ chế*,
   không chỉ bảo "hãy làm vậy". Ô `WHY` trong Concept Card, hoặc `<i>Tác dụng:</i>`.
2. **Cross-check & đính chính** — nếu sách trích nguồn sai (vd Newport trộn
   Leroy/Mark), phải có `.alert` trong Concept + `.crit` ở phần phản biện.
3. **Song ngữ VN + EN** — tiếng Việt là chính, thuật ngữ gốc đi kèm
   (vd `.philo-row__vn` "Nhịp nhàng" + `.philo-row__en` "Rhythmic").

---

## 6. Tuỳ biến màu nhấn (tuỳ chọn)

Mỗi sách có thể đổi màu nhấn mà không cần CSS riêng — chỉ cần một `<style>` trong `<head>`:

```html
<style>
  :root {
    --accent: #0f766e;      /* teal cho Atomic Habits */
    --accent-d: #115e59;
    --accent-tint: #ccfbf1;
  }
</style>
```

Mọi block dùng `--accent` sẽ tự đổi màu. Không động tới `book.css`.

---

## 7. Tránh văn xuôi lan man — checklist

Trước khi coi một trang sách là xong, kiểm tra:

- [ ] Mỗi Concept Card điền đủ 4 ô (What / Vì sao / Bằng chứng / Liên kết)?
- [ ] `.concept__def` đúng **một câu**?
- [ ] 30-Second Frame có **≤ 6 dòng**, mỗi dòng link tới Concept?
- [ ] Mỗi hành động trong Application có `<i>Tác dụng:</i>`?
- [ ] Có phần Critical Lens (≥ 3 điểm phản biện)?
- [ ] Nguồn đã cross-check? Có `.alert` nếu phát hiện trích dẫn sai?
- [ ] Sidebar tree khớp với các `id` của section?
- [ ] Đăng ký trong `js/landing.js` (`ready: true` khi hoàn thành)?

Nếu tất cả ✓ → sách đã tuân thủ backbone.
