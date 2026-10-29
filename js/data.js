/* ===========================
   MLIJOAN — Data Store
   =========================== */

const STORE_COORDS = { lat: -6.9147, lng: 107.6098 }; // Bandung default

const CATEGORIES = [
  { id: 'all',       name: 'Semua',   icon: '🏪' },
  { id: 'sayur',     name: 'Sayuran', icon: '🥦' },
  { id: 'buah',      name: 'Buah',    icon: '🍊' },
  { id: 'daging',    name: 'Daging',  icon: '🥩' },
  { id: 'sembako',   name: 'Sembako', icon: '🛒' },
  { id: 'bumbu',     name: 'Bumbu',   icon: '🌶️' },
  { id: 'minuman',   name: 'Minuman', icon: '🥤' },
];

// ─── Shared Stock Store (persisted via localStorage across all pages) ───
const PRODUCTS_BASE = [
  { id: 1,  name: 'Beras Premium Pandan Wangi',    category: 'sembako', price: 15000,  unit: '/Kg',    weight: '1 Kg',    stock: 150, maxStock: 200, sold: 234, rating: 4.8, reviews: 42, img: 'images/sembako.png',       badge: 'Populer' },
  { id: 2,  name: 'Tomat Segar Pilihan',            category: 'sayur',   price: 8000,   unit: '/Kg',    weight: '1 Kg',    stock: 80,  maxStock: 150, sold: 189, rating: 4.7, reviews: 31, img: 'images/fresh_produce.png', badge: null },
  { id: 3,  name: 'Bayam Organik Segar',            category: 'sayur',   price: 5000,   unit: '/Ikat',  weight: '±250 g',  stock: 15,  maxStock: 100, sold: 156, rating: 4.6, reviews: 28, img: 'images/fresh_produce.png', badge: '-20%' },
  { id: 4,  name: 'Telur Ayam Kampung',             category: 'sembako', price: 32000,  unit: '/12pcs', weight: '12 Butir', stock: 200, maxStock: 200, sold: 312, rating: 4.9, reviews: 67, img: 'images/sembako.png',       badge: 'Terlaris' },
  { id: 5,  name: 'Mangga Harum Manis',             category: 'buah',    price: 18000,  unit: '/Kg',    weight: '1 Kg',    stock: 12,  maxStock: 80,  sold: 98,  rating: 4.7, reviews: 19, img: 'images/fresh_produce.png', badge: null },
  { id: 6,  name: 'Minyak Goreng Bimoli 2L',       category: 'sembako', price: 38000,  unit: '/Btl',   weight: '2 Liter', stock: 120, maxStock: 150, sold: 201, rating: 4.8, reviews: 45, img: 'images/sembako.png',       badge: null },
  { id: 7,  name: 'Wortel Lokal Segar',             category: 'sayur',   price: 7500,   unit: '/Kg',    weight: '1 Kg',    stock: 8,   maxStock: 100, sold: 134, rating: 4.5, reviews: 22, img: 'images/fresh_produce.png', badge: null },
  { id: 8,  name: 'Daging Sapi Segar (Has Dalam)', category: 'daging',  price: 140000, unit: '/Kg',    weight: '1 Kg',    stock: 30,  maxStock: 50,  sold: 78,  rating: 4.9, reviews: 35, img: 'images/sembako.png',       badge: 'Premium' },
  { id: 9,  name: 'Apel Malang Merah',              category: 'buah',    price: 22000,  unit: '/Kg',    weight: '1 Kg',    stock: 70,  maxStock: 120, sold: 115, rating: 4.6, reviews: 24, img: 'images/fresh_produce.png', badge: null },
  { id: 10, name: 'Bawang Merah Brebes',            category: 'bumbu',   price: 28000,  unit: '/Kg',    weight: '1 Kg',    stock: 95,  maxStock: 150, sold: 176, rating: 4.7, reviews: 38, img: 'images/sembako.png',       badge: null },
  { id: 11, name: 'Gula Pasir Putih',               category: 'sembako', price: 16000,  unit: '/Kg',    weight: '1 Kg',    stock: 180, maxStock: 250, sold: 245, rating: 4.8, reviews: 52, img: 'images/sembako.png',       badge: null },
  { id: 12, name: 'Brokoli Segar',                  category: 'sayur',   price: 14000,  unit: '/Kg',    weight: '±500 g',  stock: 40,  maxStock: 80,  sold: 87,  rating: 4.5, reviews: 16, img: 'images/fresh_produce.png', badge: '-15%' },
];

function _loadProducts() {
  try {
    const saved = JSON.parse(localStorage.getItem('mlj_stock') || '{}');
    return PRODUCTS_BASE.map(p => ({
      ...p,
      stock: saved[p.id] !== undefined ? saved[p.id] : p.stock,
      sold:  saved['sold_' + p.id] !== undefined ? saved['sold_' + p.id] : p.sold,
    }));
  } catch { return PRODUCTS_BASE.map(p => ({...p})); }
}

const PRODUCTS = _loadProducts();

// Save current stock to localStorage (call after every stock change)
function saveStock() {
  const snap = {};
  PRODUCTS.forEach(p => { snap[p.id] = p.stock; snap['sold_' + p.id] = p.sold; });
  localStorage.setItem('mlj_stock', JSON.stringify(snap));
}

// Deduct stock (online order or POS sale)
function deductStock(productId, qty) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p) return;
  p.stock = Math.max(0, p.stock - qty);
  p.sold  = (p.sold || 0) + qty;
  saveStock();
}

// Restock a product (admin)
function restockProduct(productId, qty) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p) return;
  p.stock = Math.min(p.stock + qty, p.maxStock || 9999);
  saveStock();
}


const PROMOS = [
  { id: 1, tag: '🔥 PROMO HARI INI', title: 'Diskon 35%\nSembako Pilihan', subtitle: '100% Terjamin Segar & Berkualitas', cta: 'Belanja Sekarang', bg: 'linear-gradient(135deg,#1E9E4E,#2ECC70)', img: 'images/promo_banner.png' },
  { id: 2, tag: '🎉 SPECIAL WEEKEND', title: 'Gratis Ongkir\nRadius 5 Km', subtitle: 'Minimal transaksi Rp 100.000', cta: 'Gunakan Sekarang', bg: 'linear-gradient(135deg,#FF6B35,#FF8C5A)', img: 'images/fresh_produce.png' },
  { id: 3, tag: '🌿 PRODUK LOKAL', title: 'Sayuran Petani\nLokal Bandung', subtitle: 'Langsung dari kebun, dipetik hari ini', cta: 'Lihat Produk', bg: 'linear-gradient(135deg,#166B36,#1E9E4E)', img: 'images/fresh_produce.png' },
];

const PROMO_CODES = {
  'MLIJOAN10': { type: 'percent', value: 10, label: '10% off' },
  'GRATIS5KM': { type: 'shipping', value: 100, label: 'Gratis ongkir hingga Rp 10.000' },
  'SEGAR20':   { type: 'percent', value: 20, label: '20% off' },
};

const MOCK_ORDERS = [
  { id: 'A23B567K', date: '29 Okt 2026', scheduled: '30 Okt 2026, 09:00', status: 'delivery',   total: 127500, items: [PRODUCTS[0], PRODUCTS[1]], img: 'images/fresh_produce.png' },
  { id: 'B98C342J', date: '27 Okt 2026', scheduled: '27 Okt 2026, 14:00', status: 'completed',  total: 235000, items: [PRODUCTS[3], PRODUCTS[5]], img: 'images/sembako.png' },
  { id: 'C71D891M', date: '25 Okt 2026', scheduled: '26 Okt 2026, 10:00', status: 'pending',    total: 85000,  items: [PRODUCTS[2], PRODUCTS[6]], img: 'images/fresh_produce.png' },
  { id: 'D44E123N', date: '22 Okt 2026', scheduled: '23 Okt 2026, 11:00', status: 'processing', total: 178000, items: [PRODUCTS[7]],              img: 'images/sembako.png' },
];

const SUPPLIERS = [
  { id: 'S001', name: 'Pak Budi - Petani Sayur',   category: 'Sayuran',           phone: '08123456789', address: 'Lembang, Bandung Barat', status: 'approved',  date: '15 Okt 2026' },
  { id: 'S002', name: 'CV Makmur Jaya',            category: 'Sembako',           phone: '08234567890', address: 'Cimahi, Bandung',        status: 'pending',   date: '27 Okt 2026' },
  { id: 'S003', name: 'Bu Sari - Peternak Ayam',   category: 'Daging & Telur',    phone: '08345678901', address: 'Pangalengan, Bandung',   status: 'approved',  date: '10 Okt 2026' },
  { id: 'S004', name: 'PT Agro Nusantara',         category: 'Bumbu & Rempah',    phone: '08456789012', address: 'Ujungberung, Bandung',   status: 'rejected',  date: '20 Okt 2026', reason: 'Dokumen izin usaha tidak lengkap' },
  { id: 'S005', name: 'Pak Dedi - Kebun Buah',     category: 'Buah-buahan',       phone: '08567890123', address: 'Ciwidey, Bandung',       status: 'pending',   date: '28 Okt 2026' },
];

// ─── App State ───
const AppState = {
  cart: [],
  favorites: new Set(),
  currentPage: 'home',
  user: { name: 'Budi Santoso', email: 'budi@email.com', phone: '08123456789', avatar: '👤' },
  isAdmin: false,
  deliveryAddress: null,
  deliveryDistance: null,
  deliveryFee: 0,
  appliedPromo: null,
  selectedPayment: null,
  proofUpload: null,
};

// ─── Helpers ───
function formatRupiah(n) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function calcShipping(distKm) {
  if (distKm <= 0) return 0;
  if (distKm > 12) return -1; // out of range
  const base = 5000;
  const extra = distKm > 2 ? Math.ceil(distKm - 2) * 2000 : 0;
  return base + extra;
}

function cartTotal() {
  return AppState.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function cartCount() {
  return AppState.cart.reduce((sum, item) => sum + item.qty, 0);
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const existing = AppState.cart.find(c => c.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    AppState.cart.push({ ...product, qty: 1 });
  }
  updateCartBadge();
  return product;
}

function removeFromCart(productId) {
  AppState.cart = AppState.cart.filter(c => c.id !== productId);
  updateCartBadge();
}

function updateQty(productId, delta) {
  const item = AppState.cart.find(c => c.id === productId);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
}

function updateCartBadge() {
  const count = cartCount();
  const badge = document.getElementById('cart-badge');
  const navBadge = document.getElementById('nav-cart-badge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
  if (navBadge) {
    navBadge.textContent = count;
    navBadge.style.display = count > 0 ? 'flex' : 'none';
  }
}

function toggleFavorite(productId) {
  if (AppState.favorites.has(productId)) {
    AppState.favorites.delete(productId);
    return false;
  } else {
    AppState.favorites.add(productId);
    return true;
  }
}

function generateOrderId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({length: 8}, () => chars[Math.floor(Math.random()*chars.length)]).join('');
}

function getStatusConfig(status) {
  const map = {
    pending:    { label: 'Menunggu Transfer',  class: 'status-pending',    icon: '⏳' },
    processing: { label: 'Diproses',           class: 'status-processing', icon: '⚙️' },
    delivery:   { label: 'Dalam Pengiriman',   class: 'status-delivery',   icon: '🚚' },
    completed:  { label: 'Selesai',            class: 'status-completed',  icon: '✅' },
    cancelled:  { label: 'Dibatalkan',         class: 'status-cancelled',  icon: '❌' },
  };
  return map[status] || map.pending;
}
