# Một Vũ Trụ Nhỏ Dành Cho Ân (A Little Universe For Ân)

Website trải nghiệm 3D cinematic chúc mừng sinh nhật tuổi 18 và tỏ tình lãng mạn dành cho **Trần Phạm Hồng Ân** gửi từ **Khôi**. Dự án được phát triển bằng React, Vite, Three.js (thông qua React Three Fiber) và CSS thuần, hướng đến trải nghiệm mượt mà trên mobile và ấn tượng trên desktop.

---

## 🌌 6 Phân cảnh Trải nghiệm (Scene Flow)

Dự án được thiết kế theo cấu trúc dòng chảy cảm xúc đi qua 6 cảnh:
1. **Scene 1 (Start Screen):** Màn hình chờ tối giản với lời giới thiệu bí ẩn. Người dùng nhấn nút thì nhạc phát và bắt đầu hành trình.
2. **Scene 2 (Typing Intro):** Trình giả lập dòng lệnh terminal gõ tự động quá trình tải vũ trụ dữ liệu, tìm kiếm nụ cười rạng rỡ nhất của Ân và bắt đầu đếm ngược phóng tàu.
3. **Scene 3 (3D Universe):** Camera bay chậm qua không gian ngân hà lấp lánh với dải ngân hà sao và các hành tinh quay chậm, hiển thị các câu kể tự sự nhẹ nhàng.
4. **Scene 4 (Memory Gallery):** Máy ảnh zoom cận cảnh các bức ảnh kỷ niệm (Polaroid bay) xoay chuyển ngay trước mắt người xem đồng bộ theo dòng nội dung hồi ức.
5. **Scene 5 (Spaceship Journey):** Ngôi sao kéo vệt sáng dài (tốc độ warp speed) khi một chiếc tàu vũ trụ 3D xuất hiện và bay vượt qua không gian hướng đến hành tinh trung tâm.
6. **Scene 6 (Heart Planet & Confession):** Landing trực diện tại một hành tinh hình trái tim 3D phát sáng hồng rực rỡ, đi kèm bức thư thổ lộ tình cảm chân thành với thiết kế biên tập chữ (editorial layout) cao cấp.

---

## 🛠️ Công nghệ Sử dụng (Tech Stack)

* **Core:** React 18, Vite (môi trường dev siêu nhanh).
* **3D Graphics:** Three.js, React Three Fiber (R3F) & `@react-three/drei` (quản lý camera, ánh sáng, vật thể 3D).
* **Styling:** CSS thuần (Visual Taste tối giản, thanh lịch, chống "AI slop" đại trà).
* **Audio:** HTML5 Audio API tích hợp trình quản lý trạng thái an toàn chống crash do chính sách chặn phát nhạc tự động của trình duyệt.

---

## 🚀 Cách Chạy Dự Án

### Cách 1: Sử dụng File Tự Động (Khuyên dùng trên Windows)
Nhấp đúp chuột trực tiếp vào file **[run.bat](file:///c:/Users/phucl/OneDrive/Desktop/Birthday_Web/run.bat)** ở thư mục gốc. 
* *File bat này tự động kiểm tra và cài đặt thư viện (`npm install`) nếu chưa có, sau đó tự khởi chạy server Vite.*
* *Đã được fix lỗi hiển thị tiếng Việt có dấu trong CMD.*

### Cách 2: Chạy Thủ Công Qua Terminal
1. Mở terminal tại thư mục dự án và cài đặt thư viện:
   ```bash
   npm install
   ```
2. Khởi chạy server phát triển local:
   ```bash
   npm run dev
   ```
3. Truy cập liên kết: `http://localhost:3000` trên trình duyệt.

---

## 🎨 Hướng Dẫn Thay Đổi Dữ Liệu (Customize)

Dự án được thiết kế cấu trúc sạch sẽ để Khôi dễ dàng tùy chỉnh mọi thứ thông qua việc chỉnh sửa file cấu hình ở đường dẫn:
👉 **[src/data/content.js](file:///c:/Users/phucl/OneDrive/Desktop/Birthday_Web/src/data/content.js)**

### 1. Thay thế hình ảnh của Ân
Để chèn hình ảnh thực tế của Ân vào thay cho ảnh mẫu, hãy lưu ảnh vào thư mục `public/assets/images/` với các tên tệp tương ứng:
* `an-01.jpg` (Ảnh thẻ polaroid số 1)
* `an-02.jpg` (Ảnh thẻ polaroid số 2)
* `an-03.jpg` (Ảnh thẻ polaroid số 3)
* `memory-01.jpg` (Ảnh thẻ polaroid số 4)
* `memory-02.jpg` (Ảnh thẻ polaroid số 5)

*Lưu ý: Nếu thiếu file ảnh, hệ thống sẽ tự động vẽ một tấm ảnh Polaroid nền gradient hồng-tím và điền dòng chú thích tương ứng để trang web không bị lỗi.*

### 2. Thay nhạc nền
Lưu tệp âm thanh của bạn (khuyên dùng tệp nhẹ định dạng `.mp3`) vào thư mục `public/assets/music/` với tên tệp:
* `tim-em.mp3`

### 3. Sửa lời tỏ tình & văn bản
Chỉnh sửa trực tiếp nội dung chuỗi ký tự trong biến cấu hình tại `src/data/content.js`:
* `finalMessage.birthdayWish`: Câu tiêu đề chúc mừng sinh nhật.
* `finalMessage.paragraphs`: Danh sách các đoạn văn của bức thư tình.
* `finalMessage.closing`: Dòng chữ ký cuối thư.
* `finalMessage.finalButton`: Chữ trên nút liên kết (ví dụ: "Nhắn cho Khôi").

---

## 📁 Cấu Trúc Mã Nguồn

```txt
c:\Users\phucl\OneDrive\Desktop\Birthday_Web/
├── index.html
├── package.json
├── vite.config.js
├── run.bat                     # File click chạy nhanh dự án
├── public/
│   └── assets/
│       ├── images/             # Nơi lưu ảnh của Ân (.jpg)
│       ├── music/              # Nơi lưu nhạc nền (.mp3)
│       └── textures/           # Các map kết cấu 3D (nếu có)
└── src/
    ├── main.jsx                # Entry point gắn app
    ├── App.jsx                 # Quản lý State trung tâm & Transition thời gian thực
    ├── data/
    │   └── content.js          # File cấu hình nội dung text, nhạc, ảnh chính
    ├── hooks/
    │   └── useAudio.js         # Custom hook quản lý phát nhạc an toàn
    ├── styles/
    │   └── global.css          # Quy chuẩn typography, bảng màu, glassmorphism, nút
    ├── components/             # Các lớp giao diện phủ (overlay)
    │   ├── StartScreen.jsx
    │   ├── TypingIntro.jsx
    │   ├── MemoryGallery.jsx
    │   ├── FinalMessage.jsx
    │   ├── AudioToggle.jsx
    │   └── UniverseScene.jsx   # Khung Canvas 3D & CameraController lerp
    └── three/                  # Các đối tượng hình học 3D trong R3F
        ├── StarField.jsx
        ├── PhotoCards.jsx
        ├── Planets.jsx
        ├── Spaceship.jsx
        └── HeartPlanet.jsx
```
