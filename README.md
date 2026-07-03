# 🌌 Một Vũ Trụ Nhỏ Dành Cho Ân

> Website trải nghiệm 3D cinematic chúc mừng sinh nhật tuổi 18 và tỏ tình lãng mạn dành cho **Trần Phạm Hồng Ân**, gửi từ **Khôi**.

Dự án được phát triển bằng React + Vite + Three.js (React Three Fiber) + CSS thuần, với giao diện responsive trên cả **desktop** lẫn **điện thoại**.

---

## 🎬 Dòng Chảy 11 Cảnh (Scene Flow)

| # | Cảnh | Mô tả |
|---|------|-------|
| 1 | **Start Screen** | Màn hình chờ tối giản với tiêu đề "Một Vũ Trụ Nhỏ Dành Cho Ân". Nhấn nút → nhạc phát & bắt đầu hành trình. |
| 2 | **Typing Intro** | Giả lập terminal gõ tự động: tải vũ trụ, tìm nụ cười Ân, đếm ngược phóng tàu. |
| 3 | **3D Universe** | Camera bay chậm qua không gian ngân hà lấp lánh, hiển thị lời tự sự nhẹ nhàng (8 giây). |
| 4 | **Constellation Map** | Bản đồ chòm sao tương tác — 6 ngôi sao, mỗi ngôi sao là 1 điều Khôi thích ở Ân. |
| 5 | **Những Khoảnh Khắc Đáng Nhớ** | 5 ngôi sao ký ức bay 3D (Polaroid cards) — nhấp lần lượt để xem ảnh & caption kỷ niệm. |
| 6 | **Climax Warp** | Hiệu ứng tăng tốc sao bay, chuyển tiếp cảm xúc mạnh (5 giây). |
| 7 | **Spaceship Journey** | Tàu vũ trụ 3D bay xuyên không gian với lời tự sự cuối cùng (10 giây). |
| 8 | **YouTube Video** *(tùy chọn)* | Embed video YouTube cá nhân — hiện tắt, bật trong `content.js` nếu muốn. |
| 9 | **Interactive Letter** | Bức thư tình phong cách nhật ký tay viết — lật từng đoạn, có polaroid ảnh, chữ Dancing Script. |
| 10 | **Proposal Choice** | Câu hỏi "Em đồng ý không?" — nút "Không đồng ý" chạy trốn tối đa 5 lần 😄. |
| 11 | **Final Message** | Lời cảm ơn + nút liên lạc Zalo & Messenger. |

### 🎵 Âm nhạc
- Nhạc nền: **Tìm Em – Hngle ft. Bảo Anh** (stream từ YouTube qua IFrame API ẩn).
- Nhạc phát **liên tục mượt mà từ đầu đến cuối**, không bị tua hay ngắt quãng.
- Chuyển cảnh tự động bằng **bộ đếm thời gian riêng** (timer-based), độc lập khỏi audio stream.

---

## 🛠️ Công Nghệ

| Công nghệ | Vai trò |
|-----------|---------|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server siêu nhanh |
| **Three.js / R3F / Drei** | Đồ họa 3D (ngân hà, tàu vũ trụ, hành tinh trái tim, Polaroid cards) |
| **CSS thuần** | Thiết kế glassmorphism, responsive, animation |
| **YouTube IFrame API** | Phát nhạc nền từ YouTube mà không cần file local |
| **Google Fonts** | Dancing Script, Playfair Display, Inter, Poppins |

---

## 🚀 Cách Chạy

### Cách 1: Click đúp `run.bat` (Windows — Khuyên dùng)
File `run.bat` tự động kiểm tra & cài thư viện (`npm install`), rồi khởi chạy server Vite.

### Cách 2: Chạy thủ công
```bash
npm install
npm run dev
```
Truy cập: **http://localhost:3000**

---

## 🎨 Tùy Chỉnh Nội Dung

Tất cả nội dung text, ảnh, nhạc, liên lạc đều nằm trong **1 file duy nhất**:

👉 `src/data/content.js`

### Thay ảnh của Ân
Lưu ảnh vào `public/assets/images/` với tên:
- `an-01.jpg`, `an-02.jpg`, `an-03.jpg` — Ảnh Polaroid
- `memory-01.jpg`, `memory-02.jpg` — Ảnh kỷ niệm

> Nếu thiếu file ảnh, hệ thống tự vẽ Polaroid nền gradient hồng-tím thay thế.

### Sửa lời thư tình
Chỉnh mảng `letter.paragraphs` trong `content.js`. Bọc text bằng `*dấu sao*` để **in đậm màu hồng**.

### Thay nhạc nền
Đổi `music.sourceReference` thành link YouTube mới. Hook `useAudio.js` tự extract video ID.

### Cập nhật liên lạc
```js
contact: {
  zaloUrl: "https://zalo.me/0397839394",
  messengerUrl: "https://www.facebook.com/messages/t/100066946030514",
  finalText: "Khi đọc xong, Ân có thể nhắn cho Khôi ở đây nha."
}
```

---

## 📁 Cấu Trúc Mã Nguồn

```
Birthday_Web/
├── index.html                    # Entry HTML + Google Fonts imports
├── package.json
├── vite.config.js
├── run.bat                       # Click chạy nhanh (Windows)
│
├── public/assets/
│   ├── images/                   # Ảnh của Ân (.jpg)
│   └── music/                    # File nhạc backup (.weba)
│
└── src/
    ├── main.jsx                  # Entry point React
    ├── App.jsx                   # State trung tâm & điều phối 11 cảnh
    │
    ├── data/
    │   └── content.js            # ⭐ File cấu hình tất cả nội dung
    │
    ├── hooks/
    │   └── useAudio.js           # Hook phát nhạc YouTube IFrame API
    │
    ├── styles/
    │   └── global.css            # CSS: typography, glassmorphism, responsive
    │
    ├── components/               # Giao diện overlay & tương tác
    │   ├── StartScreen.jsx       # Màn hình bắt đầu
    │   ├── TypingIntro.jsx       # Terminal gõ chữ tự động
    │   ├── ConstellationMap.jsx  # Bản đồ chòm sao tương tác
    │   ├── UniverseScene.jsx     # Canvas 3D + Camera controller
    │   ├── InteractiveLetter.jsx # Bức thư tình nhật ký tay viết
    │   ├── ProposalChoice.jsx    # Câu hỏi đồng ý / không đồng ý
    │   ├── FinalMessage.jsx      # Màn hình kết thúc
    │   ├── Confetti.jsx          # Hiệu ứng confetti ăn mừng
    │   ├── LockedGate.jsx        # Cổng khóa countdown (tùy chọn)
    │   ├── AudioToggle.jsx       # Nút bật/tắt nhạc
    │   └── ...
    │
    └── three/                    # Đối tượng 3D (React Three Fiber)
        ├── StarField.jsx         # Trường sao ngân hà
        ├── PhotoCards.jsx        # Ảnh Polaroid bay 3D
        ├── Planets.jsx           # Hành tinh quay
        ├── Spaceship.jsx         # Tàu vũ trụ
        └── HeartPlanet.jsx       # Hành tinh hình trái tim
```

---

## 📱 Responsive

Website hỗ trợ đầy đủ trên:
- ✅ Desktop (1920px+)
- ✅ Tablet (768px)
- ✅ Mobile (400px — 360px)

Sử dụng `clamp()`, `min()`, media queries `@media (max-width: 768px)` và `@media (max-width: 400px)` để co giãn font, padding, layout tự động.

---

## 💌 Liên Lạc Sau Khi Xem

Sau khi cô ấy đọc xong bức thư và trả lời, màn hình cuối sẽ hiện 2 nút:
- 🔵 **Nhắn Zalo cho Khôi** → `https://zalo.me/0397839394`
- 🔵 **Nhắn Messenger cho Khôi** → `https://www.facebook.com/messages/t/100066946030514`

---

*Made with 💕 by Khôi — Dành tặng Ân nhân dịp sinh nhật tuổi 18, ngày 10/07/2026.*
