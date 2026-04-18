export type Product = {
  id: string;
  name: string;
  category: "kadin" | "erkek";
  type: "ayakkabi" | "canta";
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  isNew?: boolean;
  badge?: string;
};

export const products: Product[] = [
  // ── KADIN · AYAKKABI ──────────────────────────────────────────
  {
    id: "1", name: "Pembe İnci Detaylı Stiletto", category: "kadin", type: "ayakkabi",
    price: 2275, originalPrice: 3250,
    image: "/images/kadin/9.jpg",
    description: "Hakiki deri inci kordınlu, 8 cm topuklu premium stiletto. Zarif kesimi ve pastel rengiyle özel gecelerin vazgeçilmezi.",
    badge: "KAMpANYA",
    isNew: true,
  },
  {
    id: "5", name: "Bej Sivri Burun Stiletto", category: "kadin", type: "ayakkabi",
    price: 2950,
    image: "/images/kadin/12.jpg",
    description: "Sivri burunlu bej stiletto. Sade ama etkileyici tasarımıyla her kombinin tamamlayıcısı.",
    isNew: true,
  },
   {
    id: "6", name: "Siyah Klasik Topuklu", category: "kadin", type: "ayakkabi",
    price: 2750,
    image: "/images/kadin/13.jpg",
    description: "Siyah rugan klasik topuklu ayakkabı. Kalıp konforu ve premium derisiyle uzun kullanım için ideal.",
    isNew: false,
  },
  {
    id: "18", name: "Yeşil Süet Topuklu", category: "kadin", type: "ayakkabi",
    price: 2600,
    image: "/images/kadin/14.jpg",
    description: "Klasik yeşil süet topuklu. Modern kadın için tasarlanmış.",
    isNew: false,
  },
  {
    id: "7", name: "Kırmızı Klasik Ayakkabı", category: "kadin", type: "ayakkabi",
    price: 2650,
    image: "/images/kadin/10.jpg",
    description: "Kırmızı klasik stiletto kadın ayakkabısı. Profesyonel ve günlük kullanıma uygun.",
  },
  {
    id: "8", name: "Rose Gold Zincirli Çanta", category: "kadin", type: "canta",
    price: 1715, originalPrice: 2450,
    image: "/images/kadin/3.jpg",
    description: "Gold zincir detaylı deri çapraz çanta. Lüks rengi ve şık tasarımıyla koleksiyonun yıldızı.",
    badge: "KAMpANYA",
  },
  {
    id: "9", name: "Deri Postacı Çanta", category: "kadin", type: "canta",
    price: 2350,
    image: "/images/kadin/8.jpg",
    description: "Kahve rengi, deri çapraz kadın çantası. Gün boyu şıklık ve zarafeti bir arada sunar.",
    isNew: true,
  },
  {
    id: "17", name: "Bej Stiletto", category: "kadin", type: "ayakkabi",
    price: 2100, originalPrice: 2800,
    image: "/images/kadin/bej-stiletto.jpg",
    description: "Klasik bej stiletto, zamansız zarafetin simgesi.",
    badge: "KAMpANYA",
  },

  // ── KADIN · ÇANTA ─────────────────────────────────────────────
  {
    id: "2", name: "Taba Omuz Çantası", category: "kadin", type: "canta",
    price: 3150, originalPrice: 4500,
    image: "/images/kadin/bag3.jpg",
    description: "El işçiliği taba rengi deri omuz çantası. Geniş iç hacmi ve sağlam metal detaylarıyla uzun yıllar yanınızda.",
    badge: "KAMpANYA",
  },
  {
    id: "10", name: "Kahve Deri Çanta", category: "kadin", type: "canta",
    price: 3200,
    image: "/images/kadin/kahve-mini.jpg",
    description: "Kahve renkli deri çanta. Kompakt tasarımı ve altın metal aksesuarlarıyla şıklığın simgesi.",
    isNew: false,
  },
  {
    id: "11", name: "Gümüş El Çanta", category: "kadin", type: "canta",
    price: 1960, originalPrice: 2800,
    image: "/images/kadin/gumus-clutch.jpg",
    description: "Gümüş deri, aksesuarlı çanta. Her tarzın vazgeçilmez tamamlayıcısı.",
    badge: "KAMpANYA",
  },
  {
    id: "12", name: "Bordo Deri Çanta", category: "kadin", type: "canta",
    price: 3600,
    image: "/images/kadin/1.jpg",
    description: "Premium kadife kumaş ve zincir detaylı omuz çantası. Lüks dokusu ile özel anlar için.",
    isNew: true,
  },
  {
    id: "19", name: "Krem&Kahve Deri Çanta", category: "kadin", type: "canta",
    price: 3900,
    image: "/images/kadin/4.jpg",
    description: "Geniş hacimli üç renkli deri çanta. Günlük kullanım için ideal.",
    isNew: true,
  },
  // ── ERKEK · AYAKKABI ──────────────────────────────────────────
  {
    id: "3", name: "Klasik Oxford", category: "erkek", type: "ayakkabi",
    price: 2660, originalPrice: 3800,
    image: "/images/erkek/2.jpg",
    description: "İtalyan kesim hakiki deri siyah oxford. Resmi kıyafetlerinizin en asil tamamlayıcısı.",
    badge: "KAMpANYA",
  },
  {
    id: "13", name: "Kahve Deri Loafer", category: "erkek", type: "ayakkabi",
    price: 3400,
    image: "/images/erkek/ipli.jpg",
    description: "Kahve rengi hakiki deri loafer. Hem şık hem konforlu, iş dünyasının tercihi.",
    isNew: true,
  },
  {
    id: "14", name: "Siyah Deri Bot", category: "erkek", type: "ayakkabi",
    price: 2520, originalPrice: 3600,
    image: "/images/erkek/bot.jpg",
    description: "Fermuarlı hakiki deri premium erkek ayakkabısı.",
    badge: "KAMpANYA",
  },
  {
    id: "15", name: "Kahve Brogue", category: "erkek", type: "ayakkabi",
    price: 4100,
    image: "/images/erkek/5.jpg",
    description: "Perforasyon detaylı brogue model erkek ayakkabısı. Klasik İngiliz şıklığının modern yorumu.",
    isNew: true,
  },
  {
    id: "20", name: "Siyah Oxford Derby", category: "erkek", type: "ayakkabi",
    price: 3200,
    image: "/images/erkek/6.jpg",
    description: "Derby kesim siyah deri ayakkabı. Minimal çizgileri ile modern ofis şıklığı.",
    isNew: true,
  },
  // ── ERKEK · ÇANTA ─────────────────────────────────────────────
  {
    id: "4", name: "Deri Evrak Çantası", category: "erkek", type: "canta",
    price: 3640, originalPrice: 5200,
    image: "/images/erkek/14.png",
    description: "15 inç laptop bölmeli su geçirmez deri çanta. Modern iş insanının vazgeçilmezi.",
    badge: "KAMpANYA",
  },
  {
    id: "16", name: "Deri Sırt Çantası", category: "erkek", type: "canta",
    price: 4800,
    image: "/images/erkek/13.png",
    description: "Premium deri sırt çantası. Ergonomik tasarımı ve geniş hacmiyle her ortama uygun.",
    isNew: true,
  },
];

export const kampanyaUrunleri = products.filter(p => p.originalPrice);
export const yeniUrunler = products.filter(p => p.isNew);
export const indirimOrani = (p: Product) =>
  p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
