import { anPhotoManifest } from './photoManifest.js';

const anecdotesOnly = (arr) => arr.filter(p => p.type !== 'video');

export const birthdayConfig = {
  recipientName: "Tran Pham Hong An",
  displayName: "Trần Phạm Hồng Ân",
  shortName: "Ân",
  senderName: "Khôi",
  birthday: "2008-07-10",
  age: 18,

  storySteps: [
    { id: 1, label: "Bắt đầu", shortLabel: "Start" },
    { id: 2, label: "Code", shortLabel: "Code" },
    { id: 3, label: "Vũ trụ", shortLabel: "Vũ trụ" },
    { id: 4, label: "Chòm sao", shortLabel: "Sao" },
    { id: 5, label: "Ký ức", shortLabel: "Ký ức" },
    { id: 8, label: "Trái tim", shortLabel: "Tim" },
    { id: 9, label: "Thư", shortLabel: "Thư" },
    { id: 10, label: "Kết", shortLabel: "Kết" }
  ],

  universeCaptions: [
    "Tui không biết bắt đầu từ đâu.",
    "Có lẽ là từ nụ cười của bà.",
    "Một nụ cười làm mọi thứ xung quanh dịu lại hơn một chút.",
    "Và tui đã để ý điều đó lâu hơn bà nghĩ."
  ],

  journeyCaptions: [
    "Chuyến đi này không chỉ để chúc mừng sinh nhật bà.",
    "Nó còn là cách tui gom hết can đảm để nói một điều đã để trong lòng rất lâu."
  ],

  unlock: {
    enabled: false,
    timezone: "Asia/Ho_Chi_Minh",
    softUnlockAt: "2026-07-09T18:00:00+07:00",
    birthdayAt: "2026-07-10T00:00:00+07:00",
    allowAfterBirthday: true
  },

  qr: {
    enabled: true,
    giftQueryKey: "from",
    giftQueryValue: "gift",
    giftIntroText: "Bà vừa mở một món quà nhỏ từ Khôi..."
  },

  music: {
    enabled: true,
    title: "Tìm Em - Hngle ft. Bảo Anh",
    sourceReference: "https://youtu.be/gJAbDSse5WM?si=Uh9ZfpRNGtlu0q2T",
    sourceNote: "User provided a local WebA audio file.",
    path: "/assets/music/videoplayback.weba",
    cues: {
      startAt: 0,
      typingIntroAt: 4,
      universeAt: 14,
      constellationAt: 30,
      memoryGalleryAt: 48,
      climaxAt: 58,
      spaceshipAt: 76,
      heartAt: 92,
      finalLetterAt: 106,
      finalConfessionAt: 122
    },
    volume: 0.72,
    fadeInDuration: 1800
  },

  intro: {
    title: "Một vũ trụ nhỏ dành cho Ân",
    subtitle: "Có vài điều tui nói ngoài đời hơi vụng. Nên tui làm một chuyến đi nhỏ này để bà đọc chậm thôi, nghe nhạc, rồi biết lòng tui một chút.",
    buttonText: "Bắt đầu chuyến đi"
  },

  typingLines: [
    "Initializing birthday universe...",
    "Loading tiny memories...",
    "Searching for the brightest smile...",
    "Found: Trần Phạm Hồng Ân",
    "Saving courage...",
    "Preparing stars...",
    "Preparing one honest message...",
    "Keeping the music alive...",
    "Launching in 3...",
    "2...",
    "1..."
  ],

  constellation: [
    {
      title: "Nụ cười",
      message: "Nụ cười của bà có cái kiểu làm ngày bình thường tự nhiên sáng hơn."
    },
    {
      title: "Sự vui tươi",
      message: "Tui thích cách bà vui tươi, không ồn ào quá, nhưng đủ làm người khác thấy nhẹ lòng."
    },
    {
      title: "Sự chăm chỉ",
      message: "Bà chăm chỉ theo cách rất riêng. Tui để ý điều đó nhiều hơn bà tưởng."
    },
    {
      title: "Sự siêng năng",
      message: "Có những lúc nhìn bà cố gắng, tui thấy bà đáng quý thật sự."
    },
    {
      title: "Sự tốt bụng",
      message: "Những điều nhỏ bà làm cho người khác, tui vẫn nhớ."
    },
    {
      title: "Lớp phó dễ thương",
      message: "Chi tiết này chỉ nhắc một lần thôi nha, nhưng đúng là tui thấy bà dễ thương từ mấy điều nhỏ như vậy."
    }
  ],

  photos: [
    {
      src: "/assets/images/anh_an/framed/IMG_4822.JPG_framed.webp",
      cleanSrc: "/assets/images/anh_an/clean/IMG_4822.JPG_clean.webp",
      caption: "Nụ cười rạng rỡ nhất trong vũ trụ nhỏ này.",
      original: "/assets/images/anh_an/raw/IMG_4822.JPG"
    },
    {
      src: "/assets/images/anh_an/33_cropped.png",
      cleanSrc: "/assets/images/anh_an/33_cropped.png",
      caption: "Có những khoảnh khắc nhỏ mà tui nhớ lâu hơn bà nghĩ.",
      original: "/assets/images/anh_an/33_cropped.png"
    },
    {
      src: "/assets/images/anh_an/34_cropped.png",
      cleanSrc: "/assets/images/anh_an/34_cropped.png",
      caption: "Một ánh nhìn, một nụ cười, cũng đủ làm hôm đó đặc biệt.",
      original: "/assets/images/anh_an/34_cropped.png"
    },
    {
      src: "/assets/images/anh_an/framed/IMG_1081_framed.webp",
      cleanSrc: "/assets/images/anh_an/clean/IMG_1081_clean.webp",
      caption: "Một kỷ niệm nhỏ tui cất riêng cho chuyến đi này.",
      original: "/assets/images/anh_an/raw/IMG_1081.heic"
    },
    {
      src: "/assets/images/anh_an/framed/IMG_2497_framed.webp",
      cleanSrc: "/assets/images/anh_an/clean/IMG_2497_clean.webp",
      caption: "Từng mảnh ký ức về Ân đều lấp lánh theo cách rất riêng.",
      original: "/assets/images/anh_an/raw/IMG_2497.heic"
    }
  ],

  heart: {
    lead: "Có một đoạn tui muốn để bà tự mở.",
    sublead: "Không vội. Cứ để tim hiện ra hết rồi chạm vào nó nha.",
    hint: "Chạm vào trái tim để mở điều tui muốn nói..."
  },

  letter: {
    openButton: "Mở thư",
    nextButton: "Đọc tiếp",
    backButton: "Quay lại",
    autoDelayMs: 3600,
    paragraphs: [
      "Chúc mừng sinh nhật tuổi 18, Trần Phạm Hồng Ân.",
      "Tui không biết mình có phải là người giỏi nói những lời thật đẹp hay không.",
      "Nhưng tui biết một điều là tui đã *thích bà từ rất lâu rồi*.",
      "Tui thích nụ cười rạng rỡ của bà, thích sự vui tươi của bà, thích cách bà chăm chỉ, siêng năng và luôn dành thời gian cho những điều tốt đẹp.",
      "Có thể tui chưa hiểu nhiều về giáo xứ như bà, cũng chưa giỏi thể hiện tình cảm của mình.",
      "Nhưng hơn một năm qua, bà vẫn luôn là người khiến tui để ý, khiến tui muốn trở nên tốt hơn, và khiến tui muốn một lần thật lòng nói ra:",
      "Tui thích bà.",
      "Không phải là một cảm xúc nhất thời, mà là một tình cảm đã ở trong tui từ rất lâu.",
      "Nếu bà cho phép, tui muốn được tìm hiểu bà nhiều hơn, theo cách *chân thành và nghiêm túc nhất*.",
      "Một vũ trụ nhỏ này, Khôi dành tặng cho Ân."
    ]
  },

  proposal: {
    enabled: true,
    acceptText: "Bà đồng ý",
    rejectText: "Chưa đồng ý",
    rejectEscapeText: "Để bà suy nghĩ thêm cũng được...",
    maxRejectEscapes: 4,
    afterRejectText: "Dù câu trả lời là gì, tui vẫn cảm ơn bà vì đã đọc hết món quà này.",
    acceptedText: "Cảm ơn bà vì đã đọc đến đây. Tui chờ tin nhắn của bà nha."
  },

  contact: {
    zaloUrl: "https://zalo.me/0397839394",
    messengerUrl: "https://www.facebook.com/messages/t/100066946030514",
    finalText: "Khi đọc xong, bà có thể nhắn cho tui ở đây nha."
  }
};
