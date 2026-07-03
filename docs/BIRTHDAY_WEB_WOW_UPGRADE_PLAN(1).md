# BIRTHDAY_WEB_WOW_UPGRADE_PLAN.md

# Birthday Web - Kế Hoạch Nâng Cấp “WOW” Cho Website Sinh Nhật & Tỏ Tình

Repository dự án:

```txt
https://github.com/DinhTuanKhoiTB01696/Birthday_Web.git
```

File này là tài liệu yêu cầu chính để đưa cho Anti/Gemini/Codex triển khai.  
AI Coding Agent phải đọc file này trước khi sửa code.

---

## 1. Mục tiêu nâng cấp

Dự án hiện tại không chỉ là website chúc sinh nhật, mà phải trở thành một trải nghiệm bất ngờ giống một món quà được chuẩn bị rất kỹ.

Mục tiêu cảm xúc:

- Khi Ân mở web, cảm giác đầu tiên phải là tò mò.
- Khi đi qua từng cảnh, Ân thấy vui, bất ngờ và cảm nhận được Khôi đã bỏ nhiều công sức.
- Website phải có cảm giác cinematic, lộng lẫy, hiện đại và “wow”.
- Khi đến đoạn cuối, lời tỏ tình phải chân thành, rõ ràng nhưng không gây áp lực.
- Website phải kết nối được với món quà ngoài đời bằng mã QR.
- Website phải có nhạc nền được sync với chuyển động, đặc biệt là đoạn cao trào.

---

## 2. Bối cảnh

Website dành cho:

- Người nhận: **Trần Phạm Hồng Ân**
- Ngày sinh: **10/07/2008**
- Tuổi trong năm 2026: **18 tuổi**
- Người gửi: **Khôi**

Khôi đã thích Ân hơn một năm. Điều Khôi thấy đặc biệt ở Ân:

- Ân vui tươi.
- Có nụ cười rạng rỡ.
- Xinh đẹp.
- Chăm chỉ.
- Siêng năng đi lễ nhà thờ.
- Hay giúp đỡ nhà thờ.
- Mang lại cảm giác tích cực cho người xung quanh.

Website là món quà tinh thần đi kèm quà ngoài đời. Khôi dự định tặng hoa hoặc hộp quà ý nghĩa, kèm mã QR để Ân quét vào website.

Lưu ý quan trọng:

- Không tặng socola vì Ân dị ứng.
- Không làm phần tỏ tình quá ép buộc.
- Nút “Không đồng ý” có thể né vui, nhưng phải có giới hạn để không gây khó chịu.

---

## 3. Hướng kỹ thuật được chọn

Ưu tiên theo stack hiện tại của dự án. Nếu dự án đang dùng React/Vite thì tiếp tục dùng:

- React
- Vite
- Three.js
- JavaScript
- CSS thuần
- LocalStorage
- Optional: GSAP nếu cần timeline mượt hơn
- Optional: Vercel Middleware nếu muốn khóa thời gian nghiêm túc hơn

Không cần backend phức tạp ở MVP.

---

## 4. Flow trải nghiệm tổng thể

Flow mong muốn:

```txt
QR trong hộp quà
→ Cổng khóa thời gian / countdown
→ Mở món quà
→ Start Screen
→ Typing Intro
→ Vũ trụ 3D
→ Chòm sao những điều Khôi thích ở Ân
→ Viên nang ký ức / ảnh / caption
→ Đoạn cao trào theo nhạc
→ Tàu vũ trụ bay đến hành tinh trái tim
→ Video riêng của Khôi
→ Lá thư tỏ tình
→ Hai nút lựa chọn
→ Nhắn Zalo/Messenger cho Khôi
```

---

## 5. Locked Gift Gate - Cổng khóa thời gian

Trước ngày mở khóa, website không vào thẳng nội dung chính.

Hiển thị:

- Một hộp quà 3D hoặc cánh cổng vũ trụ bị khóa.
- Countdown đến thời điểm mở.
- Text chính:

```txt
Món quà này chưa đến lúc mở…
```

- Text phụ:

```txt
Hẹn Ân vào một khoảnh khắc đặc biệt.
```

Thời điểm mở đề xuất:

```txt
Soft unlock: 09/07/2026 lúc 18:00 theo giờ Việt Nam
Birthday mode: 10/07/2026 lúc 00:00 theo giờ Việt Nam
```

Ý nghĩa:

- Nếu Khôi tặng quà chiều/tối 09/07/2026, Ân quét QR vẫn có thể thấy teaser/countdown.
- Đến 18:00 ngày 09/07/2026 thì có thể mở web.
- Đến 00:00 ngày 10/07/2026 thì bật birthday mode đặc biệt.
- Sau ngày 10/07/2026 vẫn cho xem lại web, không khóa mất.

### 5.1. Client-side time gate

Bản đơn giản:

```js
const unlockAt = new Date("2026-07-09T18:00:00+07:00").getTime();
const now = Date.now();

if (now < unlockAt) {
  showLockedScreen();
} else {
  showMainExperience();
}
```

Nhược điểm:

- Người dùng có thể đổi giờ máy để mở sớm.

### 5.2. Server-side time gate

Bản nghiêm túc hơn nếu deploy Vercel/Netlify:

- Dùng middleware/server function kiểm tra thời gian.
- Nếu chưa đến giờ, trả về locked page.
- Nếu đến giờ, cho vào web chính.

Nếu dự án deploy GitHub Pages thì chỉ làm được client-side gate.

---

## 6. QR Entry Mode

Khi tạo QR, dùng link có query:

```txt
?from=gift
```

Ví dụ:

```txt
https://birthday-web-cua-khoi.vercel.app/?from=gift
```

Nếu URL có `?from=gift`, web hiển thị intro riêng:

```txt
Ân vừa mở một món quà nhỏ từ Khôi…
```

Nếu truy cập bình thường, hiển thị intro mặc định.

Yêu cầu:

- Tạo helper đọc query param.
- Không hard-code trong component.
- Config trong `src/data/content.js`.

---

## 7. QR Code dùng ngoài đời

Sau khi deploy web:

```txt
Deploy web
→ Lấy link public
→ Thêm ?from=gift
→ Tạo QR từ link đó
→ Xuất PNG chất lượng cao
→ In thành card nhỏ
→ Đặt trong hộp quà hoặc kẹp với hoa
```

Nội dung card gợi ý:

```txt
Một vũ trụ nhỏ dành cho Ân.
Quét khi Ân sẵn sàng mở món quà này.
```

Kích thước card gợi ý:

- 8x8 cm nếu chỉ in QR.
- 9x13 cm nếu có cả QR và lời nhắn ngắn.

---

## 8. Nhạc nền chính

Người dùng muốn dùng bài nhạc từ link YouTube sau:

```txt
https://youtu.be/gJAbDSse5WM?si=Uh9ZfpRNGtlu0q2T
```

Yêu cầu rất quan trọng:

- Không nhúng trực tiếp link YouTube này làm audio nền.
- Không dùng lyric bài hát trong text web.
- Người dùng sẽ tự chuẩn bị file audio local hợp pháp.
- File audio nền đặt tại:

```txt
public/assets/music/main-theme.mp3
```

Nếu dự án đang dùng thư mục khác, vẫn ưu tiên public path này để Vite phục vụ được file.

### 8.1. Music cue config

Tạo hệ thống cue để sync nhạc với cảnh. Không hard-code thời gian trong component.

Thêm vào `src/data/content.js`:

```js
music: {
  enabled: true,
  title: "Main Theme",
  sourceReference: "https://youtu.be/gJAbDSse5WM?si=Uh9ZfpRNGtlu0q2T",
  sourceNote: "User will provide a local audio file based on the selected song.",
  path: "/assets/music/main-theme.mp3",

  cues: {
    startAt: 0,
    typingIntroAt: 4,
    universeAt: 18,
    constellationAt: 30,
    memoryGalleryAt: 42,
    climaxAt: 58,
    spaceshipAt: 74,
    youtubeVideoAt: 88,
    finalLetterAt: 100,
    finalConfessionAt: 118
  },

  volume: 0.75,
  fadeInDuration: 2500,
  fadeOutDuration: 3000
}
```

Các mốc trên chỉ là mốc mẫu. Sau khi Khôi có file mp3 thật, chỉ cần chỉnh lại cue trong config để khớp đoạn cao trào.

### 8.2. Audio Manager / useAudio

Cần có `AudioManager` hoặc `useAudio` hook quản lý:

- Play sau khi người dùng bấm bắt đầu.
- Pause/resume.
- Mute/unmute.
- Volume.
- Fade in/fade out.
- Theo dõi `audio.currentTime`.
- Trigger scene/caption theo `music.cues`.
- Không crash nếu thiếu file nhạc.
- Nếu thiếu nhạc, console warning:

```txt
Music file not found. Experience continues without audio.
```

### 8.3. Sync cao trào với animation

Khi đến cue `climaxAt`:

- Memory Gallery sáng hơn.
- Ảnh bay nhanh hơn/mượt hơn.
- Glow tím/hồng mạnh hơn.
- Particle/star burst theo beat giả lập.
- Camera movement mạnh hơn nhưng không gây chóng mặt.
- Có thể xuất hiện nhiều meteor/sao băng hơn.
- Chuyển động phải tạo cảm giác “wow”.

Khi đến cue `spaceshipAt`:

- Tàu vũ trụ xuất hiện.
- Tàu bay đến heart planet.
- Trail ánh sáng theo nhạc.
- Camera follow tàu.

Khi đến cue `finalConfessionAt`:

- Nhạc dịu lại.
- Giảm animation mạnh.
- Background chậm hơn.
- Hiển thị lá thư/tỏ tình để Ân dễ đọc.

---

## 9. Start Screen

Màn hình mở đầu fullscreen.

Nội dung:

```txt
Một Vũ Trụ Nhỏ Dành Cho Ân
```

Subtitle:

```txt
Có một điều Khôi đã giữ trong lòng hơn một năm qua...
```

Nút:

```txt
Bắt đầu chuyến đi
```

Khi bấm:

- Phát nhạc local.
- Fade out.
- Vào Typing Intro.

Nếu vào từ QR `?from=gift`, có thể thêm câu:

```txt
Ân vừa mở một món quà nhỏ từ Khôi...
```

---

## 10. Typing Intro

Giao diện như terminal/code editor cinematic.

Text typing:

```txt
Initializing birthday universe...
Loading memories...
Searching for the brightest smile...
Found: Trần Phạm Hồng Ân
Preparing stars...
Preparing photos...
Preparing one honest message...
Syncing with the music...
Launching in 3...
2...
1...
```

Sau khi typing xong:

- Flash nhẹ.
- Camera đi vào vũ trụ.
- Chuyển sang universe scene.

---

## 11. Universe Scene 3D

Dùng Three.js.

Thành phần:

- Scene
- PerspectiveCamera
- WebGLRenderer
- Star field bằng BufferGeometry
- Particle stars
- Planets nhỏ bằng SphereGeometry
- Photo cards bằng PlaneGeometry
- AmbientLight
- PointLight
- Glow bằng material/emissive hoặc CSS overlay

Caption:

```txt
Anh không biết bắt đầu từ đâu...
Nhưng có lẽ là từ nụ cười của em.
Một nụ cười làm mọi thứ xung quanh trở nên nhẹ hơn.
Anh đã để ý điều đó lâu hơn em nghĩ.
```

---

## 12. Constellation Map - Chòm sao những điều Khôi thích ở Ân

Thay vì chỉ bay qua ảnh, thêm một bản đồ sao tương tác.

Mỗi ngôi sao là một điều Khôi thích ở Ân:

1. Nụ cười rạng rỡ.
2. Sự vui tươi.
3. Sự chăm chỉ.
4. Sự siêng năng đi lễ.
5. Sự tốt bụng khi giúp nhà thờ.
6. Cảm giác tích cực Ân mang lại.

Khi click/tap vào từng ngôi sao:

- Sao phát sáng.
- Hiện caption.
- Có âm thanh nhỏ nếu có.
- Lưu trạng thái đã mở.
- Sau khi mở đủ sao, mở khóa cảnh tiếp theo.

Caption gợi ý:

```txt
Có những nụ cười làm người khác nhớ rất lâu.
Anh thích cách em luôn vui tươi theo cách rất riêng.
Anh quý sự chăm chỉ của em.
Anh thấy em đặc biệt vì em luôn dành thời gian cho những điều tốt đẹp.
Có những điều nhỏ thôi, nhưng lại làm anh để ý rất lâu.
```

---

## 13. Memory Capsules - Viên nang ký ức

Nâng cấp gallery ảnh thành các capsule/meteor bay trong vũ trụ.

Mỗi capsule chứa:

- Ảnh placeholder hoặc ảnh thật.
- Caption.
- Một câu “điều Khôi chưa nói”.

Khi click/tap:

- Capsule mở ra.
- Ảnh hiện như hologram.
- Caption hiện bằng typewriter.
- Có glow và particle nhẹ.

Yêu cầu:

- Dùng ảnh từ config, không hard-code.
- Nếu thiếu ảnh, dùng fallback gradient card.
- Mobile phải bấm được dễ.

---

## 14. Music Drop & Memory Gallery

Đoạn này phải sync với `music.cues.climaxAt`.

Khi đến cao trào:

- Gallery ảnh chuyển động mạnh hơn.
- Card ảnh bay qua theo nhịp.
- Glow hồng/tím sáng hơn.
- Có star burst.
- Có thể thêm hiệu ứng sao băng.
- Camera zoom nhẹ vào ảnh chính.

Text:

```txt
Có những khoảnh khắc nhỏ thôi...
Nhưng lại khiến anh nhớ rất lâu.
Em vui tươi, chăm chỉ, siêng năng...
Và theo cách rất riêng, em trở nên đặc biệt.
```

---

## 15. Spaceship Journey

Sau memory gallery, hiện nút:

```txt
Đi đến điều cuối cùng
```

Khi bấm hoặc đến cue `spaceshipAt`:

- Tàu vũ trụ xuất hiện.
- Tàu bay qua các vì sao.
- Có trail ánh sáng.
- Camera follow tàu.
- Tàu bay đến hành tinh trái tim.

Tàu vũ trụ có thể dựng bằng geometry đơn giản:

- ConeGeometry cho đầu tàu.
- CylinderGeometry cho thân.
- BoxGeometry/ConeGeometry cho cánh.
- PointLight phía sau tạo glow.

Text lúc tàu bay:

```txt
Chuyến đi này không chỉ để chúc mừng sinh nhật...
Mà còn để nói một điều Khôi chưa từng đủ can đảm nói ra.
```

---

## 16. Heart Planet

Tạo hành tinh trái tim hoặc hành tinh có aura trái tim.

Yêu cầu:

- Màu hồng/tím.
- Glow nhẹ.
- Sao bay chậm.
- Không quá rối để còn đọc text.
- Có hiệu ứng heart particles.

---

## 17. YouTube Secret Video Scene

Khôi sẽ quay một video riêng, upload lên YouTube ở chế độ Không công khai/Unlisted.

Trong web:

- Hiện trước lá thư hoặc trước đoạn tỏ tình.
- Text:

```txt
Có một đoạn này Khôi muốn tự nói với Ân...
```

- Nhúng video bằng iframe.
- Không autoplay có tiếng.
- Người xem tự bấm play.
- URL lấy từ config.

Config:

```js
youtube: {
  enabled: false,
  embedUrl: "",
  title: "Có một đoạn này Khôi muốn tự nói với Ân...",
  description: "Nếu Ân muốn, hãy bấm play để nghe Khôi nói vài lời."
}
```

Khi Khôi có video thật:

- Upload YouTube dạng Unlisted.
- Lấy link embed dạng:

```txt
https://www.youtube.com/embed/VIDEO_ID
```

- Điền vào `embedUrl`.
- Đổi `enabled: true`.

Nếu `enabled = false` hoặc `embedUrl` rỗng:

- Bỏ qua scene video.
- Web vẫn chạy bình thường.

---

## 18. Interactive Letter - Lá thư tỏ tình

Trước lời tỏ tình cuối, thêm cảnh phong thư.

Hiệu ứng:

- Một phong thư bay đến.
- Nút:

```txt
Mở thư
```

- Khi bấm, phong thư mở ra.
- Nội dung hiện từng đoạn.
- Có nút:

```txt
Đọc tiếp
```

Không hiện toàn bộ thư một lần.

Nội dung thư:

```txt
Chúc mừng sinh nhật tuổi 18, Trần Phạm Hồng Ân.

Anh không biết mình có phải là người giỏi nói những lời thật đẹp hay không.

Nhưng anh biết một điều là anh đã thích em từ rất lâu rồi.

Anh thích nụ cười rạng rỡ của em, thích sự vui tươi của em, thích cách em chăm chỉ, siêng năng và luôn dành thời gian cho những điều tốt đẹp.

Có thể anh chưa hiểu nhiều về giáo xứ như em, cũng chưa giỏi thể hiện tình cảm của mình.

Nhưng hơn một năm qua, em vẫn luôn là người khiến anh để ý, khiến anh muốn trở nên tốt hơn, và khiến anh muốn một lần thật lòng nói ra:

Anh thích em.

Không phải là một cảm xúc nhất thời, mà là một tình cảm đã ở trong anh từ rất lâu.

Nếu em cho phép, anh muốn được tìm hiểu em nhiều hơn, theo cách chân thành và nghiêm túc nhất.

Một vũ trụ nhỏ này, Khôi dành tặng cho Ân.
```

---

## 19. Proposal Choice Scene - Hai nút lựa chọn

Sau khi đọc xong thư, hiện hai nút:

```txt
Em đồng ý
Không đồng ý
```

### 19.1. Nút “Em đồng ý”

Khi bấm:

- Confetti.
- Heart particles.
- Heart planet sáng mạnh hơn.
- Hiện text:

```txt
Cảm ơn Ân vì đã đọc đến đây.
Khôi chờ tin nhắn của Ân nha.
```

- Hiện nút Zalo/Messenger.

### 19.2. Nút “Không đồng ý”

Nút này là trò đùa nhẹ:

Desktop:

- Khi rê chuột đến gần thì nút né ra.
- Không cho bấm dễ dàng.

Mobile:

- Khi chạm vào thì nút nhảy sang vị trí khác.

Sau vài lần né, đổi text thành:

```txt
Thôi cho em suy nghĩ thêm cũng được...
```

Quan trọng:

- Không được gây khó chịu.
- Không được tạo cảm giác ép buộc.
- Sau khi né đủ số lần, vẫn giữ tone dễ thương và tôn trọng.
- Có thể hiện text:

```txt
Dù câu trả lời là gì, Khôi vẫn cảm ơn Ân vì đã đọc món quà này.
```

Config:

```js
proposal: {
  enabled: true,
  acceptText: "Em đồng ý",
  rejectText: "Không đồng ý",
  rejectEscapeText: "Thôi cho em suy nghĩ thêm cũng được...",
  maxRejectEscapes: 5
}
```

---

## 20. Contact Scene - Nhắn Zalo/Messenger cho Khôi

Sau đoạn cuối, có 2 nút:

```txt
Nhắn Zalo cho Khôi
Nhắn Messenger cho Khôi
```

Config:

```js
contact: {
  zaloUrl: "",
  messengerUrl: "",
  finalText: "Khi đọc xong, Ân có thể nhắn cho Khôi ở đây nha."
}
```

Cách điền:

```txt
zaloUrl: https://zalo.me/SO_DIEN_THOAI_CUA_KHOI
messengerUrl: https://m.me/USERNAME_FACEBOOK_CUA_KHOI
```

Nếu chưa có link:

- Disable nút.
- Hiện text:

```txt
Khôi sẽ thêm link sau.
```

---

## 21. One-Day Birthday Mode

Trong ngày 10/07/2026:

- Bật hiệu ứng đặc biệt.
- Pháo hoa nhẹ.
- Confetti.
- Birthday badge.
- Text:

```txt
Hôm nay là ngày của Ân.
```

Sau ngày đó:

- Web vẫn xem được.
- Text đổi thành:

```txt
Một món quà đã được mở vào ngày 10/07/2026.
```

Không khóa web sau sinh nhật.

---

## 22. Secret Easter Eggs

Thêm một vài bí mật nhỏ nếu không làm web nặng:

1. Gõ “AN” hoặc “ÂN”:
   - Sao bắn thành hình trái tim.

2. Click vào ngôi sao đặc biệt:
   - Hiện text:

```txt
Khôi thích Ân hơn Ân nghĩ đó.
```

3. Bấm vào heart planet 3 lần:
   - Mở mini message:

```txt
Có những điều nhỏ thôi, nhưng Khôi đã nhớ rất lâu.
```

---

## 23. Data config đề xuất

Tạo hoặc cập nhật:

```txt
src/data/content.js
```

Config đề xuất:

```js
export const birthdayConfig = {
  recipientName: "Trần Phạm Hồng Ân",
  shortName: "Ân",
  senderName: "Khôi",
  birthday: "2008-07-10",
  age: 18,

  unlock: {
    enabled: true,
    timezone: "Asia/Ho_Chi_Minh",
    softUnlockAt: "2026-07-09T18:00:00+07:00",
    birthdayAt: "2026-07-10T00:00:00+07:00",
    allowAfterBirthday: true
  },

  qr: {
    enabled: true,
    giftQueryKey: "from",
    giftQueryValue: "gift",
    giftIntroText: "Ân vừa mở một món quà nhỏ từ Khôi..."
  },

  music: {
    enabled: true,
    title: "Main Theme",
    sourceReference: "https://youtu.be/gJAbDSse5WM?si=Uh9ZfpRNGtlu0q2T",
    sourceNote: "User will provide a local audio file based on the selected song.",
    path: "/assets/music/main-theme.mp3",
    cues: {
      startAt: 0,
      typingIntroAt: 4,
      universeAt: 18,
      constellationAt: 30,
      memoryGalleryAt: 42,
      climaxAt: 58,
      spaceshipAt: 74,
      youtubeVideoAt: 88,
      finalLetterAt: 100,
      finalConfessionAt: 118
    },
    volume: 0.75,
    fadeInDuration: 2500,
    fadeOutDuration: 3000
  },

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
    "Syncing with the music...",
    "Launching in 3...",
    "2...",
    "1..."
  ],

  constellation: [
    {
      title: "Nụ cười rạng rỡ",
      message: "Có những nụ cười làm người khác nhớ rất lâu."
    },
    {
      title: "Sự vui tươi",
      message: "Anh thích cách em luôn vui tươi theo cách rất riêng."
    },
    {
      title: "Sự chăm chỉ",
      message: "Anh quý sự chăm chỉ của em."
    },
    {
      title: "Sự siêng năng",
      message: "Anh thấy em đặc biệt vì em luôn dành thời gian cho những điều tốt đẹp."
    },
    {
      title: "Sự tốt bụng",
      message: "Có những điều nhỏ thôi, nhưng lại làm anh để ý rất lâu."
    },
    {
      title: "Cảm giác tích cực",
      message: "Em làm mọi thứ xung quanh trở nên nhẹ nhàng hơn."
    }
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

  youtube: {
    enabled: false,
    embedUrl: "",
    title: "Có một đoạn này Khôi muốn tự nói với Ân...",
    description: "Nếu Ân muốn, hãy bấm play để nghe Khôi nói vài lời."
  },

  letter: {
    openButton: "Mở thư",
    nextButton: "Đọc tiếp",
    paragraphs: [
      "Chúc mừng sinh nhật tuổi 18, Trần Phạm Hồng Ân.",
      "Anh không biết mình có phải là người giỏi nói những lời thật đẹp hay không.",
      "Nhưng anh biết một điều là anh đã thích em từ rất lâu rồi.",
      "Anh thích nụ cười rạng rỡ của em, thích sự vui tươi của em, thích cách em chăm chỉ, siêng năng và luôn dành thời gian cho những điều tốt đẹp.",
      "Có thể anh chưa hiểu nhiều về giáo xứ như em, cũng chưa giỏi thể hiện tình cảm của mình.",
      "Nhưng hơn một năm qua, em vẫn luôn là người khiến anh để ý, khiến anh muốn trở nên tốt hơn, và khiến anh muốn một lần thật lòng nói ra:",
      "Anh thích em.",
      "Không phải là một cảm xúc nhất thời, mà là một tình cảm đã ở trong anh từ rất lâu.",
      "Nếu em cho phép, anh muốn được tìm hiểu em nhiều hơn, theo cách chân thành và nghiêm túc nhất.",
      "Một vũ trụ nhỏ này, Khôi dành tặng cho Ân."
    ]
  },

  proposal: {
    enabled: true,
    acceptText: "Em đồng ý",
    rejectText: "Không đồng ý",
    rejectEscapeText: "Thôi cho em suy nghĩ thêm cũng được...",
    maxRejectEscapes: 5,
    afterRejectText: "Dù câu trả lời là gì, Khôi vẫn cảm ơn Ân vì đã đọc món quà này.",
    acceptedText: "Cảm ơn Ân vì đã đọc đến đây. Khôi chờ tin nhắn của Ân nha."
  },

  contact: {
    zaloUrl: "",
    messengerUrl: "",
    finalText: "Khi đọc xong, Ân có thể nhắn cho Khôi ở đây nha."
  }
};
```

---

## 24. Asset cần có

Đường dẫn đề xuất:

```txt
public/assets/images/an-01.jpg
public/assets/images/an-02.jpg
public/assets/images/an-03.jpg
public/assets/images/memory-01.jpg
public/assets/images/memory-02.jpg
public/assets/images/placeholder.jpg

public/assets/music/main-theme.mp3

public/assets/textures/stars.png
public/assets/textures/planet.jpg
public/assets/textures/heart-planet.jpg
```

Nếu thiếu ảnh:

- Dùng fallback gradient card.
- Không để trắng màn hình.

Nếu thiếu nhạc:

- Website vẫn chạy.
- Console warning.

---

## 25. UI/UX bắt buộc

Website phải:

- Mobile-first.
- Chạy mượt trên điện thoại.
- Desktop vẫn đẹp.
- Canvas full screen.
- Text dễ đọc trên nền vũ trụ.
- Có overlay gradient sau text.
- Nút lớn, dễ bấm.
- Có nút bật/tắt nhạc.
- Có loading screen.
- Có fallback nếu WebGL không chạy.
- Không autoplay nhạc trước khi người dùng bấm.
- Không crash nếu thiếu ảnh, nhạc hoặc video.
- Không dùng lyric bài hát.
- Không gây áp lực quá mức ở phần tỏ tình.

Màu chủ đạo:

```txt
Đen vũ trụ: #030014
Tím sâu: #6d28d9
Xanh dương: #2563eb
Hồng glow: #ec4899
Trắng sao: #f8fafc
```

---

## 26. Prompt chính gửi Anti/Gemini

Copy nguyên prompt này:

```txt
Bạn là AI coding agent. Hãy đọc kỹ repository hiện tại trước khi sửa:
https://github.com/DinhTuanKhoiTB01696/Birthday_Web.git

Sau đó đọc file:
docs/BIRTHDAY_WEB_WOW_UPGRADE_PLAN.md

Không được code trước khi đọc repo và file .md.

Yêu cầu chính:
1. Không phá flow hiện tại nếu đã chạy được.
2. Ưu tiên giữ stack hiện tại của dự án. Nếu đang dùng React + Vite + Three.js thì tiếp tục dùng stack đó.
3. Tách toàn bộ text, ảnh, video, nhạc, link liên hệ, thời gian mở khóa vào src/data/content.js.
4. Thêm Locked Gift Gate với countdown đến 09/07/2026 18:00 +07:00.
5. Thêm Birthday Mode cho ngày 10/07/2026.
6. Thêm QR Entry Mode qua query ?from=gift.
7. Thêm nhạc nền local từ public/assets/music/main-theme.mp3.
8. Người dùng muốn dùng nhạc tham khảo từ link YouTube:
   https://youtu.be/gJAbDSse5WM?si=Uh9ZfpRNGtlu0q2T
   Không nhúng link này trực tiếp làm audio nền. Chỉ dùng file local main-theme.mp3.
9. Tạo music cue config trong src/data/content.js.
10. Scene transition phải đọc mốc thời gian từ music.cues, không hard-code thời gian trong component.
11. Tạo AudioManager hoặc useAudio hook quản lý play/pause/mute/volume/fade/currentTime.
12. Khi đến cue climaxAt, animation phải chuyển sang đoạn cao trào:
    - Memory Gallery sáng hơn.
    - Ảnh bay nhanh hơn/mượt hơn.
    - Glow tím/hồng mạnh hơn.
    - Particle/star burst theo beat giả lập.
13. Khi đến cue spaceshipAt, chuyển sang cảnh tàu vũ trụ bay đến heart planet.
14. Khi đến cue finalConfessionAt, nhạc dịu lại, animation chậm hơn để đọc thư.
15. Thêm Constellation Map để click/tap vào các ngôi sao hiện những điều Khôi thích ở Ân.
16. Nâng cấp gallery ảnh thành Memory Capsules tương tác.
17. Thêm Interactive Letter, lá thư mở ra từng đoạn.
18. Thêm YouTube Secret Video Scene bằng iframe, URL lấy từ config.
19. Thêm scene hai nút: “Em đồng ý” và “Không đồng ý”.
20. Nút “Không đồng ý” phải né chuột trên desktop và nhảy vị trí khi chạm trên mobile.
21. Sau vài lần né, đổi text thành “Thôi cho em suy nghĩ thêm cũng được...”
22. Không làm phần tỏ tình quá ép buộc. Nút không đồng ý chỉ là trò đùa nhẹ.
23. Thêm nút nhắn Zalo/Messenger cho Khôi.
24. Thêm Easter eggs nhỏ nếu không làm nặng web.
25. Mobile-first, chạy mượt trên điện thoại.
26. Không crash nếu thiếu ảnh, nhạc hoặc YouTube URL.
27. Không dùng lyric bài hát trong text web.

Sau khi làm xong, báo cáo:
1. File đã tạo/sửa.
2. Cách chạy project.
3. Cách thay ảnh.
4. Cách thay nhạc main-theme.mp3.
5. Cách chỉnh cue để khớp đoạn cao trào.
6. Cách thay video YouTube.
7. Cách tạo QR.
8. Cách chỉnh thời gian mở khóa.
9. Những điểm còn có thể nâng cấp.
```

---

## 27. Checklist hoàn thành

Dự án hoàn thành khi có đủ:

- Locked countdown trước giờ mở.
- QR Entry Mode `?from=gift`.
- Start Screen đẹp.
- Nhạc nền local `main-theme.mp3`.
- AudioManager/useAudio.
- Music cue config.
- Typing Intro.
- Universe 3D.
- Constellation Map tương tác.
- Memory Capsules tương tác.
- Music Drop sync với `climaxAt`.
- Spaceship Journey.
- Heart Planet.
- YouTube Secret Video Scene.
- Interactive Letter.
- Proposal Choice Scene.
- Nút “Không đồng ý” né được trên desktop/mobile.
- Nút “Em đồng ý” có confetti/heart effect.
- Link Zalo/Messenger.
- Birthday Mode riêng ngày 10/07/2026.
- Easter egg nhỏ.
- Hướng dẫn tạo QR.
- Web chạy tốt trên mobile.
