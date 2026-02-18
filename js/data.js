/* ═══════════════════════════════════════════
   作品資料集中管理
   ═══════════════════════════════════════════

   ★ 使用者操作說明 ★
   1. 將作品圖片放入對應的 assets/works/[分類]/ 資料夾
   2. 在下方對應的分類陣列中新增一筆資料
   3. 格式：{ images: ['圖1.jpg','圖2.jpg'], title: '作品名稱', tags: ['標籤1'], desc: '作品說明' }
   4. images[0] 為封面圖，其餘為圖集內圖片
   5. 影片類作品額外加 video: '影片路徑' 和 thumb: '縮圖路徑'
   ═══════════════════════════════════════════ */

const WORKS_DATA = {

  /* 藝術實踐 | 人文美學｜文化底蘊 */
  art: [
    {
      images: [
        'https://picsum.photos/id/1015/800/600',
        'https://picsum.photos/id/1018/800/600',
        'https://picsum.photos/id/1020/800/500'
      ],
      title: '山巒晨曦',
      tags: ['風景', '攝影'],
      desc: '以晨曦光影捕捉山巒層疊的靜謐之美，透過不同時段的自然光線變化，呈現大地從沉睡到甦醒的過渡瞬間。'
    },
    {
      images: [
        'https://picsum.photos/id/1040/600/900',
        'https://picsum.photos/id/1025/600/800',
        'https://picsum.photos/id/1074/600/900'
      ],
      title: '光影肖像',
      tags: ['人像', '光影'],
      desc: '探索自然光與人物情緒的交融，以側光、逆光等手法勾勒出人物內在的情感層次與性格特質。'
    },
    {
      images: [
        'https://picsum.photos/id/1069/800/600',
        'https://picsum.photos/id/1067/800/500'
      ],
      title: '城市脈絡',
      tags: ['建築', '文化'],
      desc: '記錄城市紋理中的設計語彙，從街角轉彎到天際線輪廓，觀察建築與人文環境的對話關係。'
    },
    {
      images: [
        'https://picsum.photos/id/1080/600/600',
        'https://picsum.photos/id/1079/600/700',
        'https://picsum.photos/id/1060/600/800',
        'https://picsum.photos/id/1057/600/600'
      ],
      title: '抽象構成',
      tags: ['插畫', '抽象'],
      desc: '透過色彩與形體的解構重組，在二維平面上創造出具有空間張力的視覺語言，挑戰觀者的感知邊界。'
    },
    {
      images: [
        'https://picsum.photos/id/110/800/700',
        'https://picsum.photos/id/106/800/600',
        'https://picsum.photos/id/1036/700/900'
      ],
      title: '自然紋理',
      tags: ['風景', '光影'],
      desc: '微距視角下的自然細節，從葉脈走向到水面波紋，捕捉肉眼容易忽略的精微之美。'
    },
  ],

  /* 行銷宣傳 | 遊戲廣告｜視覺張力 */
  marketing: [
    // { images: ['assets/works/marketing/001.jpg'], title: '作品名稱', tags: ['廣告', '遊戲'], desc: '說明' },
  ],

  /* 影音相關 | 動態感官｜敘事影像 */
  video: [
    // { images: ['assets/works/video/001.jpg'], title: '作品名稱', tags: ['MV', '短片'], desc: '說明', video: 'assets/videos/001.mp4' },
  ],

  /* 電商相關 | 商業敘事｜品牌轉化 */
  ecommerce: [
    // { images: ['assets/works/ecommerce/001.jpg'], title: '作品名稱', tags: ['品牌', '電商'], desc: '說明' },
  ],

  /* 宮廟傳統 | 民俗底蘊｜文化傳承 */
  temple: [
    // { images: ['assets/works/temple/001.jpg'], title: '作品名稱', tags: ['宮廟', '傳統'], desc: '說明' },
  ],

  /* 流程專業 | 數位實驗｜AI研究 */
  digital: [
    // { images: ['assets/works/digital/001.jpg'], title: '作品名稱', tags: ['AI', '流程'], desc: '說明' },
  ]
};

/* 分類資訊 */
const CATEGORY_INFO = {
  art:        { title: '藝術實踐', subtitle: 'Art Practice', tagline: '人文美學｜文化底蘊' },
  marketing:  { title: '行銷宣傳', subtitle: 'Marketing & Game Ads', tagline: '遊戲廣告｜視覺張力' },
  video:      { title: '影音相關', subtitle: 'Video & Motion', tagline: '動態感官｜敘事影像' },
  ecommerce:  { title: '電商相關', subtitle: 'E-Commerce & Branding', tagline: '商業敘事｜品牌轉化' },
  temple:     { title: '宮廟傳統', subtitle: 'Temple & Folk Heritage', tagline: '民俗底蘊｜文化傳承' },
  digital:    { title: '流程專業', subtitle: 'Digital Lab & AI Research', tagline: '數位實驗｜AI研究' }
};

/* 首頁卡片懸停用的預覽圖片 (藝術實踐專用) */
const HOVER_PREVIEW_IMAGES = [
  // 'assets/hover-preview/001.jpg',
  // 'assets/hover-preview/002.jpg',
  // 'assets/hover-preview/003.jpg',
];

/* 行銷宣傳卡片懸停用的輪播圖片 */
const MARKETING_SLIDES = [
  // 'assets/works/marketing/slide1.jpg',
  // 'assets/works/marketing/slide2.jpg',
  // 'assets/works/marketing/slide3.jpg',
];

/* 影音卡片懸停用的短影片 */
const VIDEO_HOVER_SRC = 'assets/videos/hover-preview.mp4';
