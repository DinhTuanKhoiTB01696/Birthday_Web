# BIRTHDAY_UNIVERSE_CONTEXT_AND_SCRIPT.md

# Website 3D Sinh Nhật & Tỏ Tình - “Một Vũ Trụ Nhỏ Dành Cho Ân”

## 1. Quy định bắt buộc cho AI Coding Agent

AI Coding Agent phải làm đúng quy trình sau trước khi viết code:

1. Đọc repository tham khảo 3D website:
   `https://github.com/deveshpunjabi/3d-website-skill.git`

2. Đọc repository tham khảo cách tổ chức agent skills và quy trình làm việc:
   `https://github.com/addyosmani/agent-skills.git`

3. Đọc file mô tả ngữ cảnh và kịch bản này:
   `docs/BIRTHDAY_UNIVERSE_CONTEXT_AND_SCRIPT.md`

Chỉ sau khi đọc xong cả 3 nguồn trên mới được bắt đầu triển khai code.

Nếu file `docs/BIRTHDAY_UNIVERSE_CONTEXT_AND_SCRIPT.md` chưa tồn tại trong dự án, phải tạo file này trước, ghi đầy đủ nội dung, sau đó đọc lại file rồi mới code.

---

## 2. Quyết định kỹ thuật được đề xuất

Tự chọn hướng triển khai chính:

**Chọn: React + Vite + Three.js + CSS thuần**

Lý do:
- React giúp chia cảnh thành component rõ ràng.
- Vite giúp chạy nhanh, build gọn.
- Three.js phù hợp nhất để dựng vũ trụ 3D, sao, hành tinh, tàu vũ trụ, card ảnh bay.
- CSS thuần giúp dễ chỉnh giao diện, không phụ thuộc UI library.
- Dễ deploy lên Vercel, Netlify hoặc GitHub Pages.

Không cần backend ở phiên bản đầu tiên. Node.js chỉ dùng để chạy môi trường dev/build thông qua Vite.

Công nghệ sử dụng:
- React
- Vite
- JavaScript
- Three.js
- CSS thuần
- GSAP nếu cần animation timeline mượt hơn

---

## 3. Mục tiêu dự án

Xây dựng một website trải nghiệm 3D cinematic chủ đề vũ trụ để chúc sinh nhật tuổi 18 và tỏ tình với **Trần Phạm Hồng Ân**.

Thông tin nhân vật chính:
- Tên: Trần Phạm Hồng Ân
- Tên gọi trong web: Ân
- Sinh nhật: 10/07/2008
- Tuổi: 18
- Người gửi: Khôi

Bối cảnh cảm xúc:
Khôi đã thích Ân hơn một năm. Khôi thấy Ân đặc biệt vì cô ấy vui tươi, có nụ cười rạng rỡ, xinh đẹp, chăm chỉ, siêng năng đi lễ nhà thờ, hay giúp đỡ nhà thờ và luôn tạo cảm giác tích cực cho người xung quanh.

Website này không chỉ là lời chúc sinh nhật, mà là một chuyến du hành cảm xúc để Khôi nói ra tình cảm thật lòng của mình.

---

## 4. Tên concept

Tên chính:

> Một Vũ Trụ Nhỏ Dành Cho Ân

Tên phụ có thể dùng trong title hoặc loading:

> A Little Universe For Ân

Thông điệp trung tâm:

> Có những điều không dễ nói bằng lời, nên Khôi tạo ra một vũ trụ nhỏ để gửi đến Ân.

---

## 5. Tone cảm xúc

Tone chính:
- Lãng mạn
- Chân thành
- Dễ thương
- Cinematic
- Không quá sến
- Không gây áp lực cho người nhận

Cách xưng hô được chọn:
- Dùng **anh/em** trong lời tỏ tình cuối để rõ cảm xúc.
- Dùng **Khôi/Ân** ở các đoạn đầu để tự nhiên, nhẹ nhàng.

Mức tỏ tình được chọn:
- Mức 2: rõ ràng, chân thành, nhưng không ép buộc.
- Câu chủ đạo: “Anh thích em. Nếu em cho phép, anh muốn được tìm hiểu em nhiều hơn.”

Không làm nút “Đồng ý / Không đồng ý”. Cuối website chỉ có nút nhẹ nhàng như:
- “Nhắn cho Khôi”
- “Em đã đọc rồi”

---

## 6. Cấu trúc dự án đề xuất

```txt
/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── assets/
│       ├── images/
│       │   ├── an-01.jpg
│       │   ├── an-02.jpg
│       │   ├── an-03.jpg
│       │   ├── memory-01.jpg
│       │   ├── memory-02.jpg
│       │   └── placeholder.jpg
│       ├── music/
│       │   └── tim-em.mp3
│       └── textures/
│           ├── stars.png
│           ├── planet.jpg
│           └── heart-planet.jpg
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── data/
│   │   └── content.js
│   ├── components/
│   │   ├── StartScreen.jsx
│   │   ├── TypingIntro.jsx
│   │   ├── UniverseScene.jsx
│   │   ├── MemoryGallery.jsx
│   │   ├── SpaceshipJourney.jsx
│   │   ├── FinalMessage.jsx
│   │   └── AudioToggle.jsx
│   ├── three/
│   │   ├── createStarField.js
│   │   ├── createPhotoCards.js
│   │   ├── createPlanets.js
│   │   ├── createSpaceship.js
│   │   └── createHeartPlanet.js
│   ├── hooks/
│   │   └── useAudio.js
│   └── styles/
│       └── global.css
└── docs/
    └── BIRTHDAY_UNIVERSE_CONTEXT_AND_SCRIPT.md
```

---

## 7. Data config bắt buộc

Tạo file:

`src/data/content.js`

Nội dung đề xuất:

```js
export const birthdayConfig = {
  recipientName: "Trần Phạm Hồng Ân",
  shortName: "Ân",
  senderName: "Khôi",
  birthday: "2008-07-10",
  age: 18,
  musicPath: "/assets/music/tim-em.mp3",

  intro: {
    title: "Một Vũ Trụ Nhỏ Dành Cho Ân",
    subtitle: "Có một điều Khôi đã giữ trong lòng hơn một năm qua...",
    buttonText: "Bắt đầu chuyến đi"
  },

  typingLines: [
    "Initializing birthday universe...",
    "Loading memories...",
    "Searching for the brightest smile...",
    "Found: Trần Phạm Hồng Ân",
    "Preparing stars...",
    "Preparing photos...",
    "Preparing one honest message...",
    "Launching in 3...",
    "2...",
    "1..."
  ],

  universeCaptions: [
    "Anh không biết bắt đầu từ đâu...",
    "Nhưng có lẽ là từ nụ cười của em.",
    "Một nụ cười làm mọi thứ xung quanh trở nên nhẹ hơn.",
    "Anh đã để ý điều đó lâu hơn em nghĩ."
  ],

  memoryCaptions: [
    "Có những khoảnh khắc nhỏ thôi...",
    "Nhưng lại khiến anh nhớ rất lâu.",
    "Em vui tươi, chăm chỉ, siêng năng...",
    "Và theo cách rất riêng, em trở nên đặc biệt."
  ],

  journeyCaptions: [
    "Chuyến đi này không chỉ để chúc mừng sinh nhật...",
    "Mà còn để nói một điều Khôi chưa từng đủ can đảm nói ra."
  ],

  photos: [
    {
      src: "/assets/images/an-01.jpg",
      caption: "Nụ cười rạng rỡ nhất trong vũ trụ nhỏ này."
    },
    {
      src: "/assets/images/an-02.jpg",
      caption: "Có những khoảnh khắc nhỏ nhưng làm anh nhớ rất lâu."
    },
    {
      src: "/assets/images/an-03.jpg",
      caption: "Một ánh nhìn, một nụ cười, cũng đủ làm ngày hôm đó đặc biệt."
    },
    {
      src: "/assets/images/memory-01.jpg",
      caption: "Một kỷ niệm nhỏ dành riêng cho chuyến đi này."
    },
    {
      src: "/assets/images/memory-02.jpg",
      caption: "Sau này có ảnh thật, Khôi chỉ cần thay vào đây."
    }
  ],

  finalMessage: {
    birthdayWish: "Chúc mừng sinh nhật tuổi 18, Trần Phạm Hồng Ân.",
    paragraphs: [
      "Anh không biết mình có phải là người giỏi nói những lời thật đẹp hay không.",
      "Nhưng anh biết một điều là anh đã thích em từ rất lâu rồi.",
      "Anh thích nụ cười rạng rỡ của em, thích sự vui tươi của em, thích cách em chăm chỉ, siêng năng và luôn dành thời gian cho những điều tốt đẹp.",
      "Có thể anh chưa hiểu nhiều về giáo xứ như em, cũng chưa giỏi thể hiện tình cảm của mình.",
      "Nhưng hơn một năm qua, em vẫn luôn là người khiến anh để ý, khiến anh muốn trở nên tốt hơn, và khiến anh muốn một lần thật lòng nói ra:",
      "Anh thích em.",
      "Không phải là một cảm xúc nhất thời, mà là một tình cảm đã ở trong anh từ rất lâu.",
      "Nếu em cho phép, anh muốn được tìm hiểu em nhiều hơn, theo cách chân thành và nghiêm túc nhất."
    ],
    closing: "Một vũ trụ nhỏ này, Khôi dành tặng cho Ân.",
    finalButton: "Nhắn cho Khôi"
  }
};
```

---

## 8. Kịch bản trải nghiệm chi tiết

### Scene 1: Start Screen

Màn hình mở đầu fullscreen.

Hình ảnh:
- Nền đen vũ trụ.
- Sao nhỏ chuyển động nhẹ.
- Ánh tím/xanh/hồng mờ phía sau.
- Tiêu đề phát sáng nhẹ.

Text:

> Một Vũ Trụ Nhỏ Dành Cho Ân

Subtitle:

> Có một điều Khôi đã giữ trong lòng hơn một năm qua...

Nút:

> Bắt đầu chuyến đi

Khi bấm nút:
- Phát nhạc từ `public/assets/music/tim-em.mp3`.
- Nếu thiếu nhạc, vẫn cho website chạy bình thường và báo warning trong console.
- Fade out start screen.
- Chuyển sang Scene 2.

---

### Scene 2: Typing Code Intro

Giao diện như code editor/terminal cinematic.

Hiệu ứng:
- Từng dòng code tự gõ.
- Cursor nhấp nháy.
- Có glow nhẹ.
- Có âm thanh typing nhẹ nếu muốn, nhưng không bắt buộc.

Text typing:

```txt
Initializing birthday universe...
Loading memories...
Searching for the brightest smile...
Found: Trần Phạm Hồng Ân
Preparing stars...
Preparing photos...
Preparing one honest message...
Launching in 3...
2...
1...
```

Sau khi typing xong:
- Màn hình flash nhẹ.
- Camera đi vào không gian.
- Chuyển sang Scene 3.

---

### Scene 3: 3D Universe

Dùng Three.js.

Thành phần 3D:
- PerspectiveCamera
- WebGLRenderer
- Scene
- Star field bằng BufferGeometry
- Particle stars
- Một vài hành tinh nhỏ bằng SphereGeometry
- Photo cards bằng PlaneGeometry có texture ảnh
- AmbientLight và PointLight
- Glow bằng material/emissive hoặc CSS overlay

Camera:
- Di chuyển chậm như đang bay qua vũ trụ.
- Không xoay quá nhanh để tránh chóng mặt trên mobile.
- Có parallax nhẹ theo chuột trên desktop và theo touch/gyro giả lập trên mobile nếu dễ làm.

Caption xuất hiện lần lượt:

> Anh không biết bắt đầu từ đâu...

> Nhưng có lẽ là từ nụ cười của em.

> Một nụ cười làm mọi thứ xung quanh trở nên nhẹ hơn.

> Anh đã để ý điều đó lâu hơn em nghĩ.

Thời lượng đề xuất:
- 20 đến 30 giây.

---

### Scene 4: Memory Gallery

Mục tiêu:
Tạo đoạn cao trào cảm xúc, giống một gallery ảnh kỷ niệm bay giữa không gian.

Hiệu ứng:
- Các ảnh/card lớn hơn Scene 3.
- Ảnh lướt ngang, xoay nhẹ, phóng to chậm.
- Có ánh sáng hồng/tím theo nhạc.
- Caption xuất hiện từng câu.

Text:

> Có những khoảnh khắc nhỏ thôi...

> Nhưng lại khiến anh nhớ rất lâu.

> Em vui tươi, chăm chỉ, siêng năng...

> Và theo cách rất riêng, em trở nên đặc biệt.

Lưu ý:
- Không dùng lyric bài hát trong website.
- Chỉ phát nhạc local do người dùng tự thêm.
- Dùng placeholder ảnh trước, nhưng code phải dễ thay ảnh.

---

### Scene 5: Spaceship Journey

Sau memory gallery, hiện nút:

> Đi đến điều cuối cùng

Khi người dùng bấm:
- Một tàu vũ trụ nhỏ xuất hiện.
- Tàu bay qua các vì sao.
- Có trail ánh sáng phía sau.
- Camera follow tàu.
- Tàu bay đến hành tinh trái tim.

Tàu vũ trụ có thể dựng bằng Three.js geometry đơn giản:
- ConeGeometry cho đầu tàu.
- CylinderGeometry cho thân.
- BoxGeometry hoặc ConeGeometry nhỏ cho cánh.
- PointLight nhỏ phía sau để tạo trail/glow.

Text trong lúc tàu bay:

> Chuyến đi này không chỉ để chúc mừng sinh nhật...

> Mà còn để nói một điều Khôi chưa từng đủ can đảm nói ra.

---

### Scene 6: Heart Planet & Final Message

Hình ảnh:
- Một hành tinh hồng/tím phát sáng.
- Có trái tim glow ở trung tâm hoặc hành tinh có aura hình trái tim.
- Sao bay chậm.
- Nhạc dịu lại.
- Text xuất hiện từng đoạn, không hiện một cục quá dài ngay lập tức.

Lời chúc:

> Chúc mừng sinh nhật tuổi 18, Trần Phạm Hồng Ân.

Lời tỏ tình:

> Anh không biết mình có phải là người giỏi nói những lời thật đẹp hay không.
>
> Nhưng anh biết một điều là anh đã thích em từ rất lâu rồi.
>
> Anh thích nụ cười rạng rỡ của em, thích sự vui tươi của em, thích cách em chăm chỉ, siêng năng và luôn dành thời gian cho những điều tốt đẹp.
>
> Có thể anh chưa hiểu nhiều về giáo xứ như em, cũng chưa giỏi thể hiện tình cảm của mình.
>
> Nhưng hơn một năm qua, em vẫn luôn là người khiến anh để ý, khiến anh muốn trở nên tốt hơn, và khiến anh muốn một lần thật lòng nói ra:
>
> **Anh thích em.**
>
> Không phải là một cảm xúc nhất thời, mà là một tình cảm đã ở trong anh từ rất lâu.
>
> Nếu em cho phép, anh muốn được tìm hiểu em nhiều hơn, theo cách chân thành và nghiêm túc nhất.

Kết:

> Một vũ trụ nhỏ này, Khôi dành tặng cho Ân.

Nút cuối:
- “Nhắn cho Khôi”
- Có thể dùng link Messenger/Zalo sau này.
- Trước mắt để `href="#"` hoặc config trong data.

---

## 9. UI/UX bắt buộc

Website phải:
- Mobile-first.
- Desktop đẹp, mobile mượt.
- Không để chữ quá nhỏ.
- Canvas full screen.
- Có overlay gradient để text dễ đọc.
- Có nút bật/tắt nhạc.
- Có loading screen.
- Có fallback nếu WebGL không chạy.
- Không autoplay nhạc trước khi người dùng bấm.
- Không crash nếu thiếu ảnh hoặc nhạc.
- Dễ thay ảnh và nhạc trong thư mục asset.
- Tránh hiệu ứng quá nặng trên điện thoại.

Màu chủ đạo:
- Đen vũ trụ: `#030014`
- Tím sâu: `#6d28d9`
- Xanh dương: `#2563eb`
- Hồng glow: `#ec4899`
- Trắng sao: `#f8fafc`

Font đề xuất:
- Heading: `Playfair Display`, `Cormorant Garamond`, hoặc fallback serif.
- Body: `Inter`, `Poppins`, hoặc sans-serif.

---

## 10. Asset placeholder

Vì hiện tại chưa có nhiều ảnh thật của Ân, dùng placeholder trước.

Đường dẫn bắt buộc:
- `public/assets/images/an-01.jpg`
- `public/assets/images/an-02.jpg`
- `public/assets/images/an-03.jpg`
- `public/assets/images/memory-01.jpg`
- `public/assets/images/memory-02.jpg`
- `public/assets/images/placeholder.jpg`
- `public/assets/music/tim-em.mp3`
- `public/assets/textures/stars.png`
- `public/assets/textures/planet.jpg`
- `public/assets/textures/heart-planet.jpg`

Nếu thiếu ảnh:
- Dùng fallback CSS card gradient.
- Không để lỗi làm trắng màn hình.

Nếu thiếu nhạc:
- Console warning: `Music file not found. Experience continues without audio.`
- Website vẫn chạy.

---

## 11. Prompt triển khai cho Anti/Gemini

Copy prompt này cho AI Coding Agent:

```txt
Bạn là AI coding agent phụ trách triển khai website 3D cinematic chủ đề vũ trụ để chúc sinh nhật và tỏ tình.

BẮT BUỘC đọc 3 nguồn sau trước khi code:
1. https://github.com/deveshpunjabi/3d-website-skill.git
2. https://github.com/addyosmani/agent-skills.git
3. docs/BIRTHDAY_UNIVERSE_CONTEXT_AND_SCRIPT.md

Sau khi đọc xong 3 nguồn trên, hãy triển khai theo đúng nội dung trong file docs/BIRTHDAY_UNIVERSE_CONTEXT_AND_SCRIPT.md.

Tôi chọn hướng triển khai:
- React
- Vite
- JavaScript
- Three.js
- CSS thuần
- Không cần backend ở MVP

Yêu cầu chính:
- Start Screen fullscreen.
- Bấm nút thì phát nhạc local và bắt đầu trải nghiệm.
- Typing code intro.
- Universe 3D bằng Three.js.
- Star field, particles, planets, floating photo cards.
- Memory gallery cinematic.
- Spaceship journey bay đến heart planet.
- Final birthday message và confession message.
- Mobile-first responsive.
- Dễ thay ảnh, thay nhạc, thay text qua src/data/content.js.
- Không crash nếu thiếu asset.
- Không dùng lyric bài hát.
- Không làm nút ép buộc Đồng ý / Không đồng ý.
- Code sạch, chia component/module rõ ràng.

Sau khi làm xong, báo cáo:
1. Đã tạo/sửa file nào.
2. Cách chạy project.
3. Cách thay ảnh.
4. Cách thay nhạc.
5. Cách sửa lời tỏ tình.
6. Những điểm có thể nâng cấp.
```

---

## 12. Tiêu chí hoàn thành

Website được xem là hoàn thành khi:

- Mở trang thấy màn hình “Một Vũ Trụ Nhỏ Dành Cho Ân”.
- Bấm “Bắt đầu chuyến đi” thì nhạc phát hoặc fallback không crash.
- Có hiệu ứng typing code.
- Có vũ trụ 3D bằng Three.js.
- Có card ảnh/placeholder bay trong vũ trụ.
- Có gallery kỷ niệm.
- Có nút “Đi đến điều cuối cùng”.
- Có tàu vũ trụ bay đến hành tinh trái tim.
- Có lời chúc sinh nhật tuổi 18.
- Có lời tỏ tình cuối.
- Chạy tốt trên điện thoại và desktop.
- Dễ thay ảnh, nhạc và lời nhắn.
