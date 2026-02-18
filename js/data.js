/* ═══════════════════════════════════════════
   作品資料集中管理
   ═══════════════════════════════════════════

   ★ 使用者操作說明 ★
   1. 將作品圖片放入對應的 assets/works/[分類]/ 資料夾
   2. 在下方對應的分類陣列中新增一筆資料
   3. 格式：{ src: '圖片路徑', title: '作品名稱', tags: ['標籤1', '標籤2'] }
   4. 影片類作品額外加 video: '影片路徑' 和 thumb: '縮圖路徑'
   ═══════════════════════════════════════════ */

const WORKS_DATA = {

  /* 藝術實踐 | 人文美學｜文化底蘊 */
  art: [
    // { src: 'assets/works/art/001.jpg', title: '作品名稱', tags: ['插畫', '文化'] },
  ],

  /* 行銷宣傳 | 遊戲廣告｜視覺張力 */
  marketing: [
    // { src: 'assets/works/marketing/001.jpg', title: '作品名稱', tags: ['廣告', '遊戲'] },
  ],

  /* 影音相關 | 動態感官｜敘事影像 */
  video: [
    // { src: 'assets/works/video/001.jpg', title: '作品名稱', tags: ['MV', '短片'], video: 'assets/videos/001.mp4' },
  ],

  /* 電商相關 | 商業敘事｜品牌轉化 */
  ecommerce: [
    // { src: 'assets/works/ecommerce/001.jpg', title: '作品名稱', tags: ['品牌', '電商'] },
  ],

  /* 宮廟傳統 | 民俗底蘊｜文化傳承 */
  temple: [
    // { src: 'assets/works/temple/001.jpg', title: '作品名稱', tags: ['宮廟', '傳統'] },
  ],

  /* 流程專業 | 數位實驗｜AI研究 */
  digital: [
    // { src: 'assets/works/digital/001.jpg', title: '作品名稱', tags: ['AI', '流程'] },
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
