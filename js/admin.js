/* ===========================
   MLIJOAN — Admin Data & Logic
   =========================== */

// ─── Shared Data (mirrors index.html) ───
const STORE_COORDS = { lat: -6.9147, lng: 107.6098 };

const PRODUCTS = [
  { id:1,  name:'Beras Premium Pandan Wangi', category:'sembako', price:15000,  unit:'/Kg',   weight:'1 Kg',    stock:150, maxStock:200, sold:234, rating:4.8, reviews:42, img:'images/sembako.png',       badge:'Populer',  active:true  },
  { id:2,  name:'Tomat Segar Pilihan',        category:'sayur',   price:8000,   unit:'/Kg',   weight:'1 Kg',    stock:80,  maxStock:150, sold:189, rating:4.7, reviews:31, img:'images/fresh_produce.png', badge:null,       active:true  },
  { id:3,  name:'Bayam Organik Segar',        category:'sayur',   price:5000,   unit:'/Ikat', weight:'±250 g',  stock:15,  maxStock:100, sold:156, rating:4.6, reviews:28, img:'images/fresh_produce.png', badge:'-20%',     active:true  },
  { id:4,  name:'Telur Ayam Kampung',         category:'sembako', price:32000,  unit:'/12pcs',weight:'12 Butir',stock:200, maxStock:200, sold:312, rating:4.9, reviews:67, img:'images/sembako.png',       badge:'Terlaris', active:true  },
  { id:5,  name:'Mangga Harum Manis',         category:'buah',    price:18000,  unit:'/Kg',   weight:'1 Kg',    stock:12,  maxStock:80,  sold:98,  rating:4.7, reviews:19, img:'images/fresh_produce.png', badge:null,       active:true  },
  { id:6,  name:'Minyak Goreng Bimoli 2L',   category:'sembako', price:38000,  unit:'/Btl',  weight:'2 Liter', stock:120, maxStock:150, sold:201, rating:4.8, reviews:45, img:'images/sembako.png',       badge:null,       active:true  },
  { id:7,  name:'Wortel Lokal Segar',         category:'sayur',   price:7500,   unit:'/Kg',   weight:'1 Kg',    stock:8,   maxStock:100, sold:134, rating:4.5, reviews:22, img:'images/fresh_produce.png', badge:null,       active:true  },
  { id:8,  name:'Daging Sapi Segar (Has Dalam)',category:'daging',price:140000, unit:'/Kg',   weight:'1 Kg',    stock:30,  maxStock:50,  sold:78,  rating:4.9, reviews:35, img:'images/sembako.png',       badge:'Premium',  active:true  },
  { id:9,  name:'Apel Malang Merah',          category:'buah',    price:22000,  unit:'/Kg',   weight:'1 Kg',    stock:70,  maxStock:100, sold:115, rating:4.6, reviews:24, img:'images/fresh_produce.png', badge:null,       active:true  },
  { id:10, name:'Bawang Merah Brebes',        category:'bumbu',   price:28000,  unit:'/Kg',   weight:'1 Kg',    stock:95,  maxStock:120, sold:176, rating:4.7, reviews:38, img:'images/sembako.png',       badge:null,       active:true  },
  { id:11, name:'Gula Pasir Putih',           category:'sembako', price:16000,  unit:'/Kg',   weight:'1 Kg',    stock:180, maxStock:200, sold:245, rating:4.8, reviews:52, img:'images/sembako.png',       badge:null,       active:true  },
  { id:12, name:'Brokoli Segar',              category:'sayur',   price:14000,  unit:'/Kg',   weight:'±500 g',  stock:5,   maxStock:60,  sold:87,  rating:4.5, reviews:16, img:'images/fresh_produce.png', badge:'-15%',     active:false },
];

const ORDERS = [
  { id:'A23B567K', customer:'Siti Rahayu',    phone:'08111111111', address:'Jl. Sudirman No.45',      date:'29 Okt 2026', scheduled:'30 Okt, 09:00', status:'delivery',   total:127500, items:[{name:'Beras Premium',qty:3,price:15000},{name:'Tomat Segar',qty:2,price:8000}],  payment:'BCA', proof:true  },
  { id:'B98C342J', customer:'Ahmad Fauzi',    phone:'08222222222', address:'Jl. Dago Atas No.12',     date:'27 Okt 2026', scheduled:'28 Okt, 14:00', status:'completed',  total:235000, items:[{name:'Telur Kampung',qty:2,price:32000},{name:'Minyak Goreng',qty:4,price:38000}],payment:'GoPay',proof:true  },
  { id:'C71D891M', customer:'Dewi Kusuma',    phone:'08333333333', address:'Jl. Buah Batu No.88',     date:'25 Okt 2026', scheduled:'26 Okt, 10:00', status:'pending',    total:85000,  items:[{name:'Bayam Organik',qty:5,price:5000},{name:'Wortel',qty:6,price:7500}],         payment:'BNI', proof:true  },
  { id:'D44E123N', customer:'Budi Santoso',   phone:'08444444444', address:'Jl. Riau No.20',          date:'22 Okt 2026', scheduled:'23 Okt, 11:00', status:'processing', total:178000, items:[{name:'Daging Sapi',qty:1,price:140000},{name:'Bawang Merah',qty:1,price:28000}],  payment:'OVO', proof:false },
  { id:'E55F456P', customer:'Nurul Hidayah',  phone:'08555555555', address:'Jl. Cihampelas No.30',    date:'29 Okt 2026', scheduled:'29 Okt, 16:00', status:'pending',    total:62000,  items:[{name:'Mangga',qty:2,price:18000},{name:'Apel Malang',qty:1,price:22000}],         payment:'BCA', proof:true  },
  { id:'F66G789Q', customer:'Rini Wulandari', phone:'08666666666', address:'Jl. Pasteur No.55',       date:'28 Okt 2026', scheduled:'29 Okt, 10:00', status:'processing', total:193000, items:[{name:'Beras Premium',qty:5,price:15000},{name:'Minyak Goreng',qty:2,price:38000}], payment:'BNI', proof:true  },
  { id:'G77H012R', customer:'Hendra Gunawan', phone:'08777777777', address:'Jl. Soekarno Hatta No.4', date:'28 Okt 2026', scheduled:'30 Okt, 09:00', status:'cancelled',  total:56000,  items:[{name:'Brokoli',qty:2,price:14000},{name:'Tomat',qty:3,price:8000}],              payment:'GoPay',proof:false },
];

const SUPPLIERS = [
  { id:'S001', name:'Pak Budi Setiawan',   biz:'Kebun Sayur Lembang',       category:'Sayuran',        phone:'08123456789', address:'Jl. Maribaya No.12, Lembang, Bandung Barat', status:'approved', date:'15 Okt 2026', products:'Bayam, Kangkung, Tomat, Cabai', capacity:'100 Kg/hari', notes:'Sudah 2 tahun berlangganan. Kualitas baik.', hasFiles:true  },
  { id:'S002', name:'CV Makmur Jaya',      biz:'Distributor Sembako',        category:'Sembako',        phone:'08234567890', address:'Jl. Industri No.45, Cimahi',                  status:'pending',  date:'27 Okt 2026', products:'Beras, Gula, Minyak, Tepung',  capacity:'500 Kg/hari', notes:'',                                         hasFiles:true  },
  { id:'S003', name:'Bu Sari Handayani',   biz:'Peternakan Ayam Sari',       category:'Daging & Telur', phone:'08345678901', address:'Jl. Raya Pangalengan Km.5, Bandung',          status:'approved', date:'10 Okt 2026', products:'Telur Ayam, Daging Ayam',      capacity:'200 Butir/hari', notes:'Telur segar, diambil tiap hari.',        hasFiles:false },
  { id:'S004', name:'PT Agro Nusantara',   biz:'Distributor Bumbu & Rempah', category:'Bumbu & Rempah', phone:'08456789012', address:'Jl. Kiaracondong No.88, Bandung',             status:'rejected', date:'20 Okt 2026', products:'Bawang, Jahe, Kunyit, Kemiri',  capacity:'50 Kg/hari',  notes:'',                                         hasFiles:true,  reason:'Dokumen SIUP tidak lengkap dan alamat gudang tidak sesuai.' },
  { id:'S005', name:'Pak Dedi Kurnia',     biz:'Kebun Buah Ciwidey',         category:'Buah-buahan',    phone:'08567890123', address:'Jl. Raya Ciwidey No.3, Bandung Selatan',      status:'pending',  date:'28 Okt 2026', products:'Stroberi, Apel, Jeruk, Alpukat',capacity:'80 Kg/hari',  notes:'',                                         hasFiles:true  },
  { id:'S006', name:'UD Segar Selalu',     biz:'Sayuran & Buah Organik',     category:'Sayuran',        phone:'08678901234', address:'Jl. Kolonel Masturi No.20, Cimahi',           status:'approved', date:'5 Okt 2026',  products:'Selada, Brokoli, Wortel Organik',capacity:'60 Kg/hari',  notes:'Produk organik bersertifikat.',              hasFiles:true  },
];

const PROMO_CODES = [
  { id:'PC01', code:'MLIJOAN10', type:'percent', value:10,  minOrder:50000,  used:34,  maxUse:100, active:true,  expiry:'31 Des 2026' },
  { id:'PC02', code:'SEGAR20',   type:'percent', value:20,  minOrder:100000, used:12,  maxUse:50,  active:true,  expiry:'15 Nov 2026' },
  { id:'PC03', code:'GRATIS5KM', type:'shipping',value:10,  minOrder:75000,  used:56,  maxUse:200, active:true,  expiry:'30 Nov 2026' },
  { id:'PC04', code:'NEWUSER50', type:'flat',    value:50,  minOrder:150000, used:8,   maxUse:30,  active:false, expiry:'1 Nov 2026'  },
];

const REVENUE_DATA = {
  labels: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'],
  revenue: [1250000, 980000, 1640000, 1380000, 1920000, 2450000, 1870000],
  orders:  [18, 14, 23, 19, 27, 34, 26],
};

const CATEGORY_SALES = [
  { label:'Sembako', value:42, color:'#1E9E4E' },
  { label:'Sayuran', value:28, color:'#2ECC70' },
  { label:'Buah',    value:16, color:'#F7C948' },
  { label:'Daging',  value:9,  color:'#FF6B35' },
  { label:'Bumbu',   value:5,  color:'#A0AEC0' },
];

// ─── State ───
const AdminState = {
  activeSection: 'dashboard',
  orderFilter: 'all',
  supplierFilter: 'all',
  productFilter: 'all',
  editingProduct: null,
  editingPromo: null,
  selectedOrderId: null,
  selectedSupplierId: null,
};

// ─── Utility ───
function fmt(n) { return 'Rp ' + Number(n).toLocaleString('id-ID'); }
function fmtNum(n) { return Number(n).toLocaleString('id-ID'); }
function pct(used, max) { return max > 0 ? Math.round(used/max*100) : 0; }
function stockColor(stock, max) {
  const p = pct(stock, max);
  if (p <= 15) return 'var(--error)';
  if (p <= 30) return 'var(--warning)';
  return 'var(--primary)';
}
function stockBadge(stock, max) {
  const p = pct(stock, max);
  if (p <= 15) return '<span class="badge badge-cancelled">Kritis</span>';
  if (p <= 30) return '<span class="badge badge-low">Rendah</span>';
  return '<span class="badge badge-ok">Normal</span>';
}
function statusBadge(status) {
  const map = {
    pending:    ['badge-pending',    '⏳ Menunggu Transfer'],
    processing: ['badge-processing', '⚙️ Diproses'],
    delivery:   ['badge-delivery',   '🚚 Dikirim'],
    completed:  ['badge-completed',  '✅ Selesai'],
    cancelled:  ['badge-cancelled',  '❌ Batal'],
    approved:   ['badge-approved',   '✅ Disetujui'],
    rejected:   ['badge-rejected',   '❌ Ditolak'],
  };
  const [cls, label] = map[status] || ['badge-info', status];
  return `<span class="badge ${cls}">${label}</span>`;
}
function timeAgo(dateStr) {
  const d = new Date(dateStr.replace(' ', 'T').replace('Okt', 'Oct').replace('Nov','Nov').replace('Des','Dec'));
  const diff = Date.now() - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins + 'm lalu';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'j lalu';
  return Math.floor(hrs/24) + 'h lalu';
}

let toastTimer;
function showToast(msg, type = 'default', dur = 3000) {
  const t = document.getElementById('admin-toast');
  if (!t) return;
  const icons = { success:'✅', error:'❌', warning:'⚠️', default:'ℹ️' };
  t.innerHTML = `<span>${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
  t.className = `admin-toast ${type === 'default' ? '' : type}`;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), dur);
}

function openModal(id) { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

// ─── Navigation ───
function navigateTo(section) {
  AdminState.activeSection = section;
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.getElementById('section-' + section)?.classList.add('active');
  document.querySelector(`[data-section="${section}"]`)?.classList.add('active');

  // Update header title
  const titles = {
    dashboard:  { title: 'Dashboard', sub: 'Ringkasan aktivitas & performa hari ini' },
    orders:     { title: 'Manajemen Pesanan', sub: 'Kelola dan update status pesanan pelanggan' },
    transfer:   { title: 'Verifikasi Transfer', sub: 'Periksa dan konfirmasi bukti pembayaran' },
    pos:        { title: 'Kasir POS', sub: 'Transaksi penjualan langsung di toko (Point of Sale)' },
    customers:  { title: 'Data Pelanggan', sub: 'Riwayat dan informasi semua pelanggan toko' },
    products:   { title: 'Inventori Produk', sub: 'Kelola produk dan stok gudang' },
    suppliers:  { title: 'Mitra Supplier', sub: 'Verifikasi dan kelola mitra pemasok' },
    promos:     { title: 'Kode Promo', sub: 'Buat dan kelola promo diskon' },
    reports:    { title: 'Laporan & Analitik', sub: 'Performa penjualan dan analisis data' },
    settings:   { title: 'Pengaturan', sub: 'Konfigurasi toko dan sistem' },
  };
  const t = titles[section] || { title: section, sub: '' };
  document.getElementById('header-title').textContent = t.title;
  document.getElementById('header-subtitle').textContent = t.sub;
  document.getElementById('breadcrumb-current').textContent = t.title;

  // Render section
  const renders = {
    dashboard:  renderDashboard,
    orders:     renderOrders,
    transfer:   renderTransfer,
    pos:        renderPos,
    customers:  renderCustomers,
    products:   renderProducts,
    suppliers:  renderSuppliers,
    promos:     renderPromos,
    reports:    renderReports,
    settings:   renderSettings,
  };
  renders[section]?.();

  // Close mobile sidebar
  closeSidebar();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('open');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
}

// ─── DASHBOARD ───
function renderDashboard() {
  updateKPIs();
  renderRevenueChart();
  renderDonutChart();
  renderRecentActivity();
  renderLowStockAlerts();
}

function updateKPIs() {
  const pendingOrders = ORDERS.filter(o => o.status === 'pending').length;
  const pendingTransfer = ORDERS.filter(o => o.status === 'pending' && o.proof).length;
  const todayRevenue = ORDERS.filter(o => o.status !== 'cancelled').reduce((s,o) => s + o.total, 0);
  const pendingSuppliers = SUPPLIERS.filter(s => s.status === 'pending').length;

  document.getElementById('kpi-revenue').textContent = 'Rp ' + (todayRevenue/1000).toFixed(0) + 'K';
  document.getElementById('kpi-orders').textContent = ORDERS.length;
  document.getElementById('kpi-pending').textContent = pendingOrders;
  document.getElementById('kpi-transfer').textContent = pendingTransfer;
  document.getElementById('kpi-suppliers').textContent = pendingSuppliers;
  document.getElementById('kpi-products').textContent = PRODUCTS.filter(p => p.active).length;

  // Update sidebar nav badges
  document.getElementById('badge-orders').textContent = pendingOrders;
  document.getElementById('badge-transfer').textContent = pendingTransfer;
  document.getElementById('badge-suppliers').textContent = pendingSuppliers;
}

function renderRevenueChart() {
  const canvas = document.getElementById('revenue-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.parentElement.offsetWidth - 40;
  const H = canvas.height = 220;

  ctx.clearRect(0, 0, W, H);
  const data = REVENUE_DATA.revenue;
  const labels = REVENUE_DATA.labels;
  const orders = REVENUE_DATA.orders;
  const max = Math.max(...data) * 1.15;
  const padL = 70, padR = 16, padT = 20, padB = 40;
  const gW = W - padL - padR, gH = H - padT - padB;
  const barW = gW / data.length;

  // Grid lines
  ctx.strokeStyle = '#F0F2F5';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padT + gH - (i/4) * gH;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
    ctx.fillStyle = '#A0AEC0';
    ctx.font = '10px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Rp' + ((max*i/4)/1000000).toFixed(1) + 'M', padL - 6, y + 4);
  }

  // Bars
  data.forEach((val, i) => {
    const x = padL + i * barW + barW * 0.2;
    const bW = barW * 0.6;
    const bH = (val / max) * gH;
    const y = padT + gH - bH;
    const isMax = val === Math.max(...data);

    const grad = ctx.createLinearGradient(x, y, x, padT + gH);
    grad.addColorStop(0, isMax ? '#2ECC70' : '#1E9E4E');
    grad.addColorStop(1, isMax ? '#1E9E4E' : '#166B36');
    ctx.fillStyle = grad;
    ctx.beginPath();
    const r = 4;
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + bW - r, y);
    ctx.quadraticCurveTo(x + bW, y, x + bW, y + r);
    ctx.lineTo(x + bW, padT + gH);
    ctx.lineTo(x, padT + gH);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.fill();

    // Label X axis
    ctx.fillStyle = '#718096';
    ctx.font = '11px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + bW / 2, H - padB + 18);
  });

  // Line chart for orders
  ctx.strokeStyle = '#FF6B35';
  ctx.lineWidth = 2;
  ctx.setLineDash([]);
  ctx.beginPath();
  const oMax = Math.max(...orders);
  orders.forEach((val, i) => {
    const x = padL + i * barW + barW / 2;
    const y = padT + gH - (val / oMax) * gH * 0.6 - gH * 0.1;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Dots on line
  orders.forEach((val, i) => {
    const x = padL + i * barW + barW / 2;
    const y = padT + gH - (val / oMax) * gH * 0.6 - gH * 0.1;
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#FF6B35';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

function renderDonutChart() {
  const canvas = document.getElementById('donut-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = Math.min(canvas.parentElement.offsetWidth - 40, 200);
  canvas.width = size;
  canvas.height = size;
  ctx.clearRect(0, 0, size, size);

  const cx = size / 2, cy = size / 2, r = size * 0.38, rInner = size * 0.24;
  let startAngle = -Math.PI / 2;
  const total = CATEGORY_SALES.reduce((s, c) => s + c.value, 0);

  CATEGORY_SALES.forEach(cat => {
    const sweep = (cat.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, startAngle + sweep);
    ctx.closePath();
    ctx.fillStyle = cat.color;
    ctx.fill();
    startAngle += sweep;
  });

  // Inner circle (donut hole)
  ctx.beginPath();
  ctx.arc(cx, cy, rInner, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();

  // Center text
  ctx.fillStyle = '#1C2333';
  ctx.font = `700 ${size * 0.12}px Plus Jakarta Sans, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(total + '%', cx, cy - 4);
  ctx.font = `500 ${size * 0.07}px Plus Jakarta Sans, sans-serif`;
  ctx.fillStyle = '#718096';
  ctx.fillText('Total', cx, cy + size * 0.09);
}

function renderRecentActivity() {
  const el = document.getElementById('recent-activity');
  if (!el) return;
  const activities = [
    { icon:'🛒', bg:'var(--primary-50)', text:'Pesanan <strong>#A23B567K</strong> dari Siti Rahayu dalam pengiriman', time:'2 menit lalu' },
    { icon:'💳', bg:'#FFF3E0',           text:'Transfer BCA Rp 127.500 dari Siti Rahayu <strong>perlu verifikasi</strong>', time:'5 menit lalu' },
    { icon:'🤝', bg:'#EBF8FF',           text:'Pendaftaran mitra baru: <strong>Pak Dedi Kurnia - Kebun Buah</strong>', time:'32 menit lalu' },
    { icon:'⚠️', bg:'#FFF5F5',           text:'Stok <strong>Brokoli Segar</strong> kritis: hanya 5 unit tersisa', time:'1 jam lalu' },
    { icon:'✅', bg:'var(--primary-50)', text:'Pesanan <strong>#B98C342J</strong> Ahmad Fauzi selesai', time:'2 jam lalu' },
    { icon:'📦', bg:'#F0FFF4',           text:'Pesanan baru masuk dari <strong>Nurul Hidayah</strong> — Rp 62.000', time:'3 jam lalu' },
  ];
  el.innerHTML = activities.map(a => `
    <div class="activity-item">
      <div class="activity-dot" style="background:${a.bg}">${a.icon}</div>
      <div class="activity-text">
        <p>${a.text}</p>
        <small>${a.time}</small>
      </div>
    </div>
  `).join('');
}

function renderLowStockAlerts() {
  const el = document.getElementById('low-stock-list');
  if (!el) return;
  const low = PRODUCTS.filter(p => pct(p.stock, p.maxStock) <= 30).sort((a,b) => a.stock - b.stock);
  if (!low.length) { el.innerHTML = '<div class="empty-state" style="padding:30px"><div class="empty-icon">✅</div><div class="empty-title">Stok Aman</div></div>'; return; }
  el.innerHTML = low.map(p => `
    <div style="padding:12px 20px;border-bottom:1px solid var(--neutral-100);display:flex;align-items:center;gap:12px">
      <img src="${p.img}" style="width:36px;height:36px;border-radius:6px;object-fit:cover;flex-shrink:0">
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:600;color:var(--neutral-800);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name}</div>
        <div style="margin-top:4px">
          <div class="progress-bar"><div class="progress-fill" style="width:${pct(p.stock,p.maxStock)}%;background:${stockColor(p.stock,p.maxStock)}"></div></div>
        </div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-size:13px;font-weight:700;color:${stockColor(p.stock,p.maxStock)}">${p.stock}</div>
        <div style="font-size:11px;color:var(--neutral-400)">/ ${p.maxStock}</div>
      </div>
    </div>
  `).join('');
}

// ─── ORDERS ───
function renderOrders(filter = AdminState.orderFilter) {
  AdminState.orderFilter = filter;
  const tbody = document.getElementById('orders-tbody');
  if (!tbody) return;

  let data = [...ORDERS];
  if (filter !== 'all') data = data.filter(o => o.status === filter);

  const search = document.getElementById('order-search')?.value?.toLowerCase() || '';
  if (search) data = data.filter(o =>
    o.id.toLowerCase().includes(search) ||
    o.customer.toLowerCase().includes(search)
  );

  document.getElementById('orders-count').textContent = data.length + ' pesanan';
  document.querySelectorAll('[data-order-filter]').forEach(b =>
    b.classList.toggle('active', b.dataset.orderFilter === filter)
  );

  if (!data.length) {
    tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">📋</div><div class="empty-title">Tidak ada pesanan</div></div></td></tr>';
    return;
  }
  tbody.innerHTML = data.map(o => `
    <tr>
      <td class="td-id">#${o.id}</td>
      <td>
        <div style="font-size:13px;font-weight:600;color:var(--neutral-800)">${o.customer}</div>
        <div style="font-size:11px;color:var(--neutral-500)">${o.phone}</div>
      </td>
      <td>
        <div style="font-size:12px;color:var(--neutral-700)">${o.items.map(i=>i.name).join(', ').substring(0,30)}${o.items[0]?.name?.length > 30 ? '…' : ''}</div>
        <div style="font-size:11px;color:var(--neutral-500)">${o.items.length} item</div>
      </td>
      <td class="num-green">${fmt(o.total)}</td>
      <td>${statusBadge(o.status)}</td>
      <td>
        <div style="font-size:12px">${o.scheduled}</div>
        <div style="font-size:11px;color:var(--neutral-500)">${o.payment} ${o.proof ? '✅' : '❌'}</div>
      </td>
      <td>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="btn btn-ghost btn-xs" onclick="openOrderDetail('${o.id}')">Detail</button>
          <select onchange="updateOrderStatus('${o.id}',this.value)" style="font-size:11px;padding:4px 8px;border:1px solid var(--neutral-200);border-radius:6px;background:white;cursor:pointer;color:var(--neutral-700)">
            <option value="pending" ${o.status==='pending'?'selected':''}>⏳ Pending</option>
            <option value="processing" ${o.status==='processing'?'selected':''}>⚙️ Proses</option>
            <option value="delivery" ${o.status==='delivery'?'selected':''}>🚚 Kirim</option>
            <option value="completed" ${o.status==='completed'?'selected':''}>✅ Selesai</option>
            <option value="cancelled" ${o.status==='cancelled'?'selected':''}>❌ Batal</option>
          </select>
        </div>
      </td>
    </tr>
  `).join('');
}

function updateOrderStatus(orderId, status) {
  const o = ORDERS.find(o => o.id === orderId);
  if (o) {
    o.status = status;
    showToast(`Status #${orderId} → ${status}`, 'success');
    renderOrders();
    updateKPIs();
  }
}

function openOrderDetail(orderId) {
  const o = ORDERS.find(o => o.id === orderId);
  if (!o) return;
  AdminState.selectedOrderId = orderId;
  const content = document.getElementById('order-detail-content');
  const steps = [
    { label:'Pesanan Dibuat',    done:true },
    { label:'Menunggu Transfer', done:o.status !== 'pending' },
    { label:'Diproses',          done:['processing','delivery','completed'].includes(o.status) },
    { label:'Dalam Pengiriman',  done:['delivery','completed'].includes(o.status) },
    { label:'Selesai',           done:o.status === 'completed' },
  ];
  content.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
      <div>
        ${[
          ['ID Pesanan', '#' + o.id],
          ['Pelanggan', o.customer],
          ['Telepon', o.phone],
          ['Alamat', o.address],
          ['Pembayaran', o.payment],
          ['Dijadwalkan', o.scheduled],
        ].map(([l,v]) => `<div class="info-row"><span class="info-row-label">${l}</span><span class="info-row-value">${v}</span></div>`).join('')}
      </div>
      <div>
        <div style="font-size:12px;font-weight:700;color:var(--neutral-500);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px">Status Pengiriman</div>
        <div style="position:relative;padding-left:20px">
          ${steps.map((s,i) => `
            <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:${i<steps.length-1?'16px':'0'};position:relative">
              <div style="position:absolute;left:-16px;top:3px;width:10px;height:10px;border-radius:50%;background:${s.done?'var(--primary)':'var(--neutral-300)'};border:2px solid ${s.done?'var(--primary)':'var(--neutral-300)'};z-index:1"></div>
              ${i<steps.length-1?`<div style="position:absolute;left:-12px;top:13px;width:2px;height:16px;background:${steps[i+1].done?'var(--primary)':'var(--neutral-200)'}"></div>`:''}
              <span style="font-size:13px;font-weight:${s.done?'600':'400'};color:${s.done?'var(--neutral-800)':'var(--neutral-400)'}">${s.label}</span>
            </div>
          `).join('')}
        </div>
        <div style="margin-top:16px">${statusBadge(o.status)}</div>
      </div>
    </div>
    <div class="divider"></div>
    <div style="font-size:13px;font-weight:700;color:var(--neutral-700);margin-bottom:10px">Item Pesanan</div>
    ${o.items.map(item => `
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px dashed var(--neutral-100)">
        <span style="font-size:13px;color:var(--neutral-700)">${item.name} × ${item.qty}</span>
        <span class="num-green">${fmt(item.price * item.qty)}</span>
      </div>
    `).join('')}
    <div style="display:flex;justify-content:space-between;padding:12px 0;font-weight:700;font-size:15px">
      <span>Total Pembayaran</span>
      <span class="num-green">${fmt(o.total)}</span>
    </div>
    ${o.proof ? `
    <div class="divider"></div>
    <div style="font-size:13px;font-weight:700;color:var(--neutral-700);margin-bottom:10px">Bukti Transfer</div>
    <div class="proof-img-wrap">
      <img src="images/sembako.png" alt="Bukti Transfer" style="opacity:0.4">
      <div style="position:absolute;font-size:12px;color:var(--neutral-500)">[Preview bukti transfer]</div>
    </div>
    <div style="margin-top:10px;display:flex;gap:8px">
      ${o.status === 'pending' ? `
        <button class="btn btn-primary w-full" onclick="updateOrderStatus('${o.id}','processing');closeModal('order-detail-modal')">✅ Konfirmasi Transfer & Proses</button>
        <button class="btn btn-danger" onclick="updateOrderStatus('${o.id}','cancelled');closeModal('order-detail-modal')">❌ Tolak</button>
      ` : '<div style="font-size:12px;color:var(--primary);font-weight:600">✅ Transfer sudah dikonfirmasi</div>'}
    </div>` : `<div class="info-box" style="margin-top:12px;background:#FFF5F5;border-color:#FED7D7"><span style="color:var(--error)">⚠️</span><span style="font-size:13px;color:var(--error)">Bukti transfer belum diupload pelanggan</span></div>`}
  `;
  document.getElementById('order-detail-title').textContent = 'Pesanan #' + o.id;
  openModal('order-detail-modal');
}

// ─── TRANSFER VERIFICATION ───
function renderTransfer() {
  const container = document.getElementById('transfer-list');
  if (!container) return;
  const pending = ORDERS.filter(o => o.status === 'pending');
  if (!pending.length) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">✅</div><div class="empty-title">Semua transfer sudah diverifikasi</div><div class="empty-desc">Tidak ada yang menunggu konfirmasi</div></div>';
    return;
  }
  container.innerHTML = pending.map(o => `
    <div style="background:white;border-radius:var(--radius-lg);box-shadow:var(--shadow-card);overflow:hidden;margin-bottom:16px">
      <div style="padding:16px 20px;border-bottom:1px solid var(--neutral-100);display:flex;align-items:center;justify-content:space-between">
        <div>
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:14px;font-weight:700;color:var(--neutral-800)">#${o.id}</span>
            ${statusBadge(o.status)}
            ${o.proof ? '<span class="badge badge-info">📸 Bukti Ada</span>' : '<span class="badge badge-cancelled">❌ No Bukti</span>'}
          </div>
          <div style="font-size:13px;color:var(--neutral-600);margin-top:4px">${o.customer} · ${o.phone} · ${o.payment}</div>
        </div>
        <div style="text-align:right">
          <div class="num-green" style="font-size:16px">${fmt(o.total)}</div>
          <div style="font-size:12px;color:var(--neutral-500)">${o.date}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0">
        <div style="padding:16px 20px;border-right:1px solid var(--neutral-100)">
          <div style="font-size:12px;font-weight:700;color:var(--neutral-500);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Detail Pesanan</div>
          ${o.items.map(i => `<div style="font-size:13px;color:var(--neutral-700);margin-bottom:4px">• ${i.name} × ${i.qty} = ${fmt(i.price*i.qty)}</div>`).join('')}
          <div style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--neutral-200);font-size:13px;font-weight:700;color:var(--neutral-800)">Total: ${fmt(o.total)}</div>
        </div>
        <div style="padding:16px 20px">
          <div style="font-size:12px;font-weight:700;color:var(--neutral-500);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Bukti Transfer</div>
          ${o.proof
            ? `<div class="proof-img-wrap" style="max-height:120px;position:relative;margin-bottom:12px">
                <img src="images/sembako.png" style="opacity:0.3;max-height:120px;width:100%;object-fit:cover">
                <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--neutral-500)">[Preview Bukti Transfer]</div>
               </div>`
            : `<div style="background:var(--neutral-100);border-radius:var(--radius-md);padding:16px;text-align:center;color:var(--neutral-400);font-size:12px;margin-bottom:12px">Belum ada bukti</div>`}
          <div style="display:flex;gap:8px">
            <button class="btn btn-primary flex-1" onclick="confirmTransfer('${o.id}')">✅ Konfirmasi</button>
            <button class="btn btn-danger flex-1" onclick="rejectTransfer('${o.id}')">❌ Tolak</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function confirmTransfer(orderId) {
  const o = ORDERS.find(o => o.id === orderId);
  if (o) { o.status = 'processing'; showToast('Transfer #' + orderId + ' dikonfirmasi! Pesanan diproses.', 'success'); renderTransfer(); updateKPIs(); }
}
function rejectTransfer(orderId) {
  const reason = prompt('Alasan penolakan transfer:');
  if (!reason) return;
  const o = ORDERS.find(o => o.id === orderId);
  if (o) { o.status = 'cancelled'; showToast('Transfer #' + orderId + ' ditolak.', 'error'); renderTransfer(); updateKPIs(); }
}

// ─── PRODUCTS ───
function renderProducts(filter = AdminState.productFilter) {
  AdminState.productFilter = filter;
  const tbody = document.getElementById('products-tbody');
  if (!tbody) return;

  let data = [...PRODUCTS];
  if (filter === 'low')  data = data.filter(p => pct(p.stock,p.maxStock) <= 30);
  if (filter === 'active') data = data.filter(p => p.active);
  if (filter === 'inactive') data = data.filter(p => !p.active);

  const search = document.getElementById('product-search')?.value?.toLowerCase() || '';
  if (search) data = data.filter(p =>
    p.name.toLowerCase().includes(search) || p.category.toLowerCase().includes(search)
  );

  document.getElementById('products-count').textContent = data.length + ' produk';
  document.querySelectorAll('[data-product-filter]').forEach(b =>
    b.classList.toggle('active', b.dataset.productFilter === filter)
  );

  if (!data.length) {
    tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">📦</div><div class="empty-title">Tidak ada produk</div></div></td></tr>';
    return;
  }
  tbody.innerHTML = data.map(p => `
    <tr>
      <td>
        <div class="td-product">
          <img src="${p.img}" alt="${p.name}">
          <div class="td-product-info">
            <p>${p.name}</p>
            <small>${p.category} · ${p.weight}</small>
          </div>
        </div>
      </td>
      <td class="num-green">${fmt(p.price)}<span style="font-size:11px;color:var(--neutral-400)">${p.unit}</span></td>
      <td>
        <div class="stock-level">
          <div class="stock-level-label">
            <span style="font-weight:700;color:${stockColor(p.stock,p.maxStock)}">${p.stock}</span>
            <span style="color:var(--neutral-400)">/ ${p.maxStock}</span>
          </div>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct(p.stock,p.maxStock)}%;background:${stockColor(p.stock,p.maxStock)}"></div></div>
        </div>
      </td>
      <td>${stockBadge(p.stock,p.maxStock)}</td>
      <td>⭐ ${p.rating} <span style="font-size:11px;color:var(--neutral-400)">(${p.reviews})</span></td>
      <td>
        <label class="switch">
          <input type="checkbox" ${p.active?'checked':''} onchange="toggleProduct(${p.id},this.checked)">
          <span class="slider"></span>
        </label>
      </td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost btn-xs" onclick="openEditProduct(${p.id})">✏️ Edit</button>
          <button class="btn btn-ghost btn-xs" onclick="openStockModal(${p.id})">📦 Stok</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function toggleProduct(id, active) {
  const p = PRODUCTS.find(p => p.id === id);
  if (p) { p.active = active; showToast(p.name + (active ? ' diaktifkan' : ' dinonaktifkan'), active ? 'success' : 'warning'); }
}

function openAddProduct() {
  AdminState.editingProduct = null;
  document.getElementById('product-modal-title').textContent = '➕ Tambah Produk';
  document.getElementById('product-form').reset();
  openModal('product-modal');
}

function openEditProduct(id) {
  const p = PRODUCTS.find(p => p.id === id);
  if (!p) return;
  AdminState.editingProduct = id;
  document.getElementById('product-modal-title').textContent = '✏️ Edit Produk';
  document.getElementById('pf-name').value = p.name;
  document.getElementById('pf-category').value = p.category;
  document.getElementById('pf-price').value = p.price;
  document.getElementById('pf-unit').value = p.unit;
  document.getElementById('pf-weight').value = p.weight;
  document.getElementById('pf-stock').value = p.stock;
  document.getElementById('pf-maxstock').value = p.maxStock;
  openModal('product-modal');
}

function saveProduct(e) {
  e.preventDefault();
  const name = document.getElementById('pf-name').value;
  const price = Number(document.getElementById('pf-price').value);
  const stock = Number(document.getElementById('pf-stock').value);
  const maxStock = Number(document.getElementById('pf-maxstock').value);

  if (AdminState.editingProduct) {
    const p = PRODUCTS.find(p => p.id === AdminState.editingProduct);
    if (p) {
      p.name = name;
      p.category = document.getElementById('pf-category').value;
      p.price = price;
      p.unit = document.getElementById('pf-unit').value;
      p.weight = document.getElementById('pf-weight').value;
      p.stock = stock;
      p.maxStock = maxStock;
      showToast('Produk "' + name + '" berhasil diperbarui!', 'success');
    }
  } else {
    const newP = {
      id: PRODUCTS.length + 1,
      name, price, stock, maxStock,
      category: document.getElementById('pf-category').value,
      unit: document.getElementById('pf-unit').value,
      weight: document.getElementById('pf-weight').value,
      sold: 0, rating: 0, reviews: 0,
      img: 'images/sembako.png', badge: null, active: true
    };
    PRODUCTS.push(newP);
    showToast('Produk "' + name + '" berhasil ditambahkan!', 'success');
  }
  closeModal('product-modal');
  renderProducts();
}

function openStockModal(id) {
  const p = PRODUCTS.find(p => p.id === id);
  if (!p) return;
  AdminState.editingProduct = id;
  document.getElementById('stock-product-name').textContent = p.name;
  document.getElementById('stock-current').textContent = p.stock;
  document.getElementById('stock-max').textContent = p.maxStock;
  document.getElementById('stock-adj').value = '';
  openModal('stock-modal');
}

function adjustStock() {
  const adj = Number(document.getElementById('stock-adj').value);
  const type = document.getElementById('stock-adj-type').value;
  const p = PRODUCTS.find(p => p.id === AdminState.editingProduct);
  if (!p || isNaN(adj) || adj <= 0) { showToast('Masukkan jumlah yang valid', 'error'); return; }
  const prev = p.stock;
  if (type === 'add') p.stock = Math.min(p.maxStock, p.stock + adj);
  if (type === 'subtract') p.stock = Math.max(0, p.stock - adj);
  if (type === 'set') p.stock = Math.min(p.maxStock, Math.max(0, adj));
  showToast(`Stok ${p.name}: ${prev} → ${p.stock}`, 'success');
  closeModal('stock-modal');
  renderProducts();
  renderDashboard();
}

// ─── SUPPLIERS ───
function renderSuppliers(filter = AdminState.supplierFilter) {
  AdminState.supplierFilter = filter;
  const tbody = document.getElementById('suppliers-tbody');
  if (!tbody) return;

  let data = [...SUPPLIERS];
  if (filter !== 'all') data = data.filter(s => s.status === filter);

  const search = document.getElementById('supplier-search')?.value?.toLowerCase() || '';
  if (search) data = data.filter(s => s.name.toLowerCase().includes(search) || s.category.toLowerCase().includes(search));

  document.getElementById('suppliers-count').textContent = data.length + ' mitra';
  document.querySelectorAll('[data-supplier-filter]').forEach(b =>
    b.classList.toggle('active', b.dataset.supplierFilter === filter)
  );

  if (!data.length) {
    tbody.innerHTML = '<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">🤝</div><div class="empty-title">Tidak ada mitra</div></div></td></tr>';
    return;
  }
  tbody.innerHTML = data.map(s => `
    <tr>
      <td>
        <div style="font-size:13px;font-weight:700;color:var(--neutral-800)">${s.name}</div>
        <div style="font-size:11px;color:var(--neutral-500)">${s.biz}</div>
      </td>
      <td><span class="badge badge-info">${s.category}</span></td>
      <td style="font-size:12px;color:var(--neutral-700)">${s.phone}</td>
      <td style="font-size:12px;color:var(--neutral-700);max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.address}</td>
      <td>${statusBadge(s.status)}</td>
      <td>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="btn btn-ghost btn-xs" onclick="openSupplierDetail('${s.id}')">👁 Detail</button>
          ${s.status === 'pending' ? `
            <button class="btn btn-primary btn-xs" onclick="approveSupplier('${s.id}')">✓ Setuju</button>
            <button class="btn btn-danger btn-xs" onclick="openRejectModal('${s.id}')">✕ Tolak</button>
          ` : ''}
          ${s.status === 'approved' ? `<a href="https://wa.me/${s.phone}" target="_blank" class="btn btn-ghost btn-xs" style="background:#DCF8C6;color:#128C7E">💬 WA</a>` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

function approveSupplier(id) {
  const s = SUPPLIERS.find(s => s.id === id);
  if (s) { s.status = 'approved'; showToast('Mitra ' + s.name + ' disetujui! Notifikasi WA terkirim.', 'success'); renderSuppliers(); updateKPIs(); }
}
function openRejectModal(id) {
  AdminState.selectedSupplierId = id;
  const s = SUPPLIERS.find(s => s.id === id);
  document.getElementById('reject-supplier-name').textContent = s?.name || '';
  document.getElementById('reject-reason').value = '';
  openModal('reject-modal');
}
function confirmReject() {
  const reason = document.getElementById('reject-reason').value.trim();
  if (!reason) { showToast('Tulis alasan penolakan terlebih dahulu', 'error'); return; }
  const s = SUPPLIERS.find(s => s.id === AdminState.selectedSupplierId);
  if (s) { s.status = 'rejected'; s.reason = reason; showToast('Mitra ' + s.name + ' ditolak.', 'error'); closeModal('reject-modal'); renderSuppliers(); updateKPIs(); }
}
function openSupplierDetail(id) {
  const s = SUPPLIERS.find(s => s.id === id);
  if (!s) return;
  AdminState.selectedSupplierId = id;
  const content = document.getElementById('supplier-detail-content');
  content.innerHTML = `
    <div style="background:var(--primary-50);border-radius:var(--radius-lg);padding:16px;display:flex;align-items:center;gap:14px;margin-bottom:20px">
      <div style="width:52px;height:52px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;font-size:22px;color:white;flex-shrink:0">🤝</div>
      <div>
        <div style="font-size:16px;font-weight:700;color:var(--neutral-800)">${s.name}</div>
        <div style="font-size:13px;color:var(--neutral-600)">${s.biz}</div>
        <div style="margin-top:4px">${statusBadge(s.status)}</div>
      </div>
    </div>
    ${[
      ['Kategori Pasokan', s.category],
      ['WhatsApp', s.phone],
      ['Alamat Gudang/Kebun', s.address],
      ['Produk Ditawarkan', s.products],
      ['Kapasitas', s.capacity],
      ['Tgl Daftar', s.date],
    ].map(([l,v]) => `<div class="info-row"><span class="info-row-label">${l}</span><span class="info-row-value">${v}</span></div>`).join('')}
    ${s.notes ? `<div style="margin-top:14px;background:var(--neutral-50);border-radius:var(--radius-md);padding:12px;font-size:13px;color:var(--neutral-600)">📝 <strong>Catatan:</strong> ${s.notes}</div>` : ''}
    ${s.reason ? `<div style="margin-top:14px;background:#FFF5F5;border-radius:var(--radius-md);padding:12px;font-size:13px;color:var(--error)">❌ <strong>Alasan Penolakan:</strong> ${s.reason}</div>` : ''}
    ${s.hasFiles ? `<div style="margin-top:14px;background:var(--neutral-50);border-radius:var(--radius-md);padding:12px;font-size:13px;color:var(--neutral-600)">📎 File dokumen sudah diupload</div>` : ''}
  `;
  const footer = document.getElementById('supplier-detail-footer');
  footer.innerHTML = s.status === 'pending' ? `
    <button class="btn btn-ghost" onclick="closeModal('supplier-detail-modal')">Tutup</button>
    <button class="btn btn-danger" onclick="closeModal('supplier-detail-modal');openRejectModal('${s.id}')">✕ Tolak</button>
    <button class="btn btn-primary" onclick="approveSupplier('${s.id}');closeModal('supplier-detail-modal')">✓ Setujui Mitra</button>
  ` : `
    <button class="btn btn-ghost" onclick="closeModal('supplier-detail-modal')">Tutup</button>
    ${s.status === 'approved' ? `<a href="https://wa.me/${s.phone}" target="_blank" class="btn btn-primary" style="background:#25D366">💬 Hubungi WA</a>` : ''}
  `;
  openModal('supplier-detail-modal');
}

// ─── PROMOS ───
function renderPromos() {
  const tbody = document.getElementById('promos-tbody');
  if (!tbody) return;
  tbody.innerHTML = PROMO_CODES.map(pc => `
    <tr>
      <td><span style="font-family:monospace;font-weight:700;font-size:14px;color:var(--primary);background:var(--primary-50);padding:3px 10px;border-radius:6px">${pc.code}</span></td>
      <td style="font-size:13px">${pc.type==='percent'?`Diskon ${pc.value}%`:pc.type==='shipping'?`Ongkir Gratis s.d Rp ${pc.value}K`:`Flat Rp ${pc.value}K`}</td>
      <td class="num">${fmt(pc.minOrder)}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="progress-bar" style="width:80px"><div class="progress-fill" style="width:${pct(pc.used,pc.maxUse)}%;background:var(--primary)"></div></div>
          <span style="font-size:12px;color:var(--neutral-500)">${pc.used}/${pc.maxUse}</span>
        </div>
      </td>
      <td style="font-size:12px">${pc.expiry}</td>
      <td>
        <label class="switch">
          <input type="checkbox" ${pc.active?'checked':''} onchange="togglePromo('${pc.id}',this.checked)">
          <span class="slider"></span>
        </label>
      </td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost btn-xs" onclick="openEditPromo('${pc.id}')">✏️ Edit</button>
          <button class="btn btn-danger btn-xs" onclick="deletePromo('${pc.id}')">🗑</button>
        </div>
      </td>
    </tr>
  `).join('');
}
function togglePromo(id, active) {
  const p = PROMO_CODES.find(p => p.id === id);
  if (p) { p.active = active; showToast('Promo ' + p.code + (active ? ' diaktifkan' : ' dinonaktifkan'), active?'success':'warning'); }
}
function deletePromo(id) {
  if (!confirm('Hapus kode promo ini?')) return;
  const i = PROMO_CODES.findIndex(p => p.id === id);
  if (i >= 0) { PROMO_CODES.splice(i,1); showToast('Promo dihapus', 'warning'); renderPromos(); }
}
function openAddPromo() {
  document.getElementById('promo-form').reset();
  AdminState.editingPromo = null;
  document.getElementById('promo-modal-title').textContent = '➕ Tambah Kode Promo';
  openModal('promo-modal');
}
function openEditPromo(id) {
  const pc = PROMO_CODES.find(p => p.id === id);
  if (!pc) return;
  AdminState.editingPromo = id;
  document.getElementById('promo-modal-title').textContent = '✏️ Edit Kode Promo';
  document.getElementById('prom-code').value = pc.code;
  document.getElementById('prom-type').value = pc.type;
  document.getElementById('prom-value').value = pc.value;
  document.getElementById('prom-min').value = pc.minOrder;
  document.getElementById('prom-max').value = pc.maxUse;
  document.getElementById('prom-expiry').value = pc.expiry;
  openModal('promo-modal');
}
function savePromo(e) {
  e.preventDefault();
  const code = document.getElementById('prom-code').value.toUpperCase();
  const type = document.getElementById('prom-type').value;
  const value = Number(document.getElementById('prom-value').value);
  const minOrder = Number(document.getElementById('prom-min').value);
  const maxUse = Number(document.getElementById('prom-max').value);
  const expiry = document.getElementById('prom-expiry').value;
  if (AdminState.editingPromo) {
    const p = PROMO_CODES.find(p => p.id === AdminState.editingPromo);
    if (p) Object.assign(p, {code,type,value,minOrder,maxUse,expiry});
    showToast('Promo ' + code + ' diperbarui!', 'success');
  } else {
    PROMO_CODES.push({ id:'PC'+Date.now(), code, type, value, minOrder, used:0, maxUse, active:true, expiry });
    showToast('Promo ' + code + ' ditambahkan!', 'success');
  }
  closeModal('promo-modal');
  renderPromos();
}

// ─── REPORTS ───
function renderReports() {
  setTimeout(() => {
    renderRevenueChartFull();
    renderCategoryBar();
  }, 100);
}
function renderRevenueChartFull() {
  const canvas = document.getElementById('report-revenue-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.parentElement.offsetWidth - 48;
  const H = canvas.height = 260;
  ctx.clearRect(0,0,W,H);
  const data = [1250000,980000,1640000,1380000,1920000,2450000,1870000,2100000,1780000,2300000,1950000,2600000,2200000,1900000];
  const labels = ['Sen','Sel','Rab','Kam','Jum','Sab','Min','Sen','Sel','Rab','Kam','Jum','Sab','Min'];
  const max = Math.max(...data)*1.2;
  const padL=70,padR=20,padT=20,padB=40;
  const gW=W-padL-padR, gH=H-padT-padB;
  ctx.strokeStyle='#F0F2F5'; ctx.lineWidth=1;
  for(let i=0;i<=4;i++){
    const y=padT+gH-(i/4)*gH;
    ctx.beginPath();ctx.moveTo(padL,y);ctx.lineTo(W-padR,y);ctx.stroke();
    ctx.fillStyle='#A0AEC0';ctx.font='10px Plus Jakarta Sans';ctx.textAlign='right';
    ctx.fillText('Rp'+(max*i/4/1000000).toFixed(1)+'M',padL-6,y+4);
  }
  const grad=ctx.createLinearGradient(0,padT,0,padT+gH);
  grad.addColorStop(0,'rgba(30,158,78,0.3)');
  grad.addColorStop(1,'rgba(30,158,78,0)');
  ctx.beginPath();
  data.forEach((v,i)=>{
    const x=padL+i*(gW/(data.length-1));
    const y=padT+gH-(v/max)*gH;
    if(i===0){ctx.moveTo(x,y);}else{ctx.lineTo(x,y);}
  });
  const lastX=padL+(data.length-1)*(gW/(data.length-1));
  ctx.lineTo(lastX,padT+gH);ctx.lineTo(padL,padT+gH);ctx.closePath();
  ctx.fillStyle=grad;ctx.fill();
  ctx.beginPath();ctx.strokeStyle='#1E9E4E';ctx.lineWidth=2.5;
  data.forEach((v,i)=>{
    const x=padL+i*(gW/(data.length-1));
    const y=padT+gH-(v/max)*gH;
    if(i===0){ctx.moveTo(x,y);}else{ctx.lineTo(x,y);}
  });
  ctx.stroke();
  data.forEach((v,i)=>{
    const x=padL+i*(gW/(data.length-1));
    const y=padT+gH-(v/max)*gH;
    ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);
    ctx.fillStyle='white';ctx.fill();ctx.strokeStyle='#1E9E4E';ctx.lineWidth=2;ctx.stroke();
    if(i%2===0){
      ctx.fillStyle='#718096';ctx.font='10px Plus Jakarta Sans';ctx.textAlign='center';
      ctx.fillText(labels[i],x,H-padB+18);
    }
  });
}
function renderCategoryBar() {
  const el = document.getElementById('category-report');
  if (!el) return;
  const colors = ['#1E9E4E','#2ECC70','#F7C948','#FF6B35','#A0AEC0'];
  el.innerHTML = CATEGORY_SALES.map((c,i) => `
    <div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;margin-bottom:5px">
        <span style="font-size:13px;font-weight:600;color:var(--neutral-700)">${c.label}</span>
        <span style="font-size:13px;font-weight:700;color:${colors[i]}">${c.value}%</span>
      </div>
      <div class="progress-bar" style="height:10px"><div class="progress-fill" style="width:${c.value}%;background:${colors[i]}"></div></div>
    </div>
  `).join('');
}

// ─── SETTINGS ───
function renderSettings() {
  // Already rendered in HTML, just show/enable
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  navigateTo('dashboard');

  // Order search live filter
  document.getElementById('order-search')?.addEventListener('input', debounce(() => renderOrders(), 300));
  document.getElementById('product-search')?.addEventListener('input', debounce(() => renderProducts(), 300));
  document.getElementById('supplier-search')?.addEventListener('input', debounce(() => renderSuppliers(), 300));

  // Re-render charts on resize
  window.addEventListener('resize', debounce(() => {
    if (AdminState.activeSection === 'dashboard') { renderRevenueChart(); renderDonutChart(); }
    if (AdminState.activeSection === 'reports') renderRevenueChartFull();
  }, 300));
});

function debounce(fn, delay) {
  let t;
  return function(...args) { clearTimeout(t); t = setTimeout(() => fn.apply(this,args), delay); };
}

// ═══════════════════════════════════════════════════
// POS — POINT OF SALE (Kasir Offline)
// ═══════════════════════════════════════════════════
const PosState = {
  cart: [],          // [{ product, qty, note }]
  category: 'all',
  payment: 'cash',
  discount: 0,
};

const POS_TAX_RATE = 0.11; // PPN 11%

const POS_CATS = [
  { id:'all',     label:'Show all',  icon:'' },
  { id:'sembako', label:'Sembako',   icon:'' },
  { id:'sayur',   label:'Sayuran',   icon:'' },
  { id:'buah',    label:'Buah',      icon:'' },
  { id:'daging',  label:'Daging',    icon:'' },
  { id:'bumbu',   label:'Bumbu',     icon:'' },
];

function renderPos() {
  _syncStockFromStorage();
  _posRenderCategoryTabs();
  posRenderProducts();
  posRenderCart();
  posSetPayment('cash');
  posCalcTotal();
}

/* ─ Category tabs ─ */
function _posRenderCategoryTabs() {
  const tabs = document.getElementById('pos-cat-tabs');
  if (!tabs) return;
  tabs.innerHTML = POS_CATS.map(c => {
    const active = c.id === PosState.category;
    return `<button id="pos-cat-${c.id}" onclick="posSetCategory('${c.id}')"
      style="padding:7px 18px;border-radius:20px;border:1.5px solid ${active ? 'var(--primary)' : '#e5e7eb'};
             background:${active ? 'var(--primary)' : 'white'};color:${active ? 'white' : '#6b7280'};
             font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap;
             transition:all .15s;flex-shrink:0">${c.label}</button>`;
  }).join('');
}

/* ─ Sync stock from localStorage ─ */
function _syncStockFromStorage() {
  try {
    const saved = JSON.parse(localStorage.getItem('mlj_stock') || '{}');
    PRODUCTS.forEach(p => {
      if (saved[p.id] !== undefined) p.stock = saved[p.id];
      if (saved['sold_' + p.id] !== undefined) p.sold = saved['sold_' + p.id];
    });
  } catch {}
}

function _saveStockToStorage() {
  const snap = {};
  PRODUCTS.forEach(p => { snap[p.id] = p.stock; snap['sold_' + p.id] = p.sold; });
  localStorage.setItem('mlj_stock', JSON.stringify(snap));
}

/* ─ Stock status badge ─ */
function _posStockBadge(p) {
  if (p.stock <= 0)  return `<div style="position:absolute;top:8px;left:8px;background:#ef4444;color:white;font-size:10px;font-weight:700;padding:3px 8px;border-radius:6px;letter-spacing:.3px">Sold out</div>`;
  if (p.stock <= 5)  return `<div style="position:absolute;top:8px;left:8px;background:#f59e0b;color:white;font-size:10px;font-weight:700;padding:3px 8px;border-radius:6px">Last ${p.stock} items</div>`;
  return `<div style="position:absolute;top:8px;left:8px;background:#22c55e;color:white;font-size:10px;font-weight:700;padding:3px 8px;border-radius:6px">Available</div>`;
}

/* ─ Product grid ─ */
/* ─ Card click helper (avoids complex inline template literals) ─ */
function posCardClick(productId) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p) return;
  if (p.stock <= 0) { showToast('Stok ' + p.name.split(' ').slice(0,2).join(' ') + ' habis', 'warning'); return; }
  posAddItem(productId);
}

function posRenderProducts(searchQ = '') {
  _syncStockFromStorage();
  const grid = document.getElementById('pos-products');
  if (!grid) return;

  let list = PRODUCTS.filter(p => p.active !== false);
  if (PosState.category !== 'all') list = list.filter(p => p.category === PosState.category);
  if (searchQ) list = list.filter(p => p.name.toLowerCase().includes(searchQ.toLowerCase()));

  if (!list.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 0;color:#9ca3af">
      <div style="font-size:36px;margin-bottom:8px">🔍</div>
      <div style="font-size:14px;font-weight:600">Produk tidak ditemukan</div></div>`;
    return;
  }

  grid.innerHTML = list.map(p => {
    const outOfStock = p.stock <= 0;
    const lowStock   = !outOfStock && p.stock <= 5;
    const badgeBg    = outOfStock ? '#ef4444' : lowStock ? '#f59e0b' : '#22c55e';
    const badgeTxt   = outOfStock ? 'Sold out' : lowStock ? `Last ${p.stock} items` : 'Available';
    return `
      <div onclick="posCardClick(${p.id})"
           style="background:white;border-radius:14px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,.07);
                  transition:transform .18s,box-shadow .18s;cursor:${outOfStock ? 'not-allowed' : 'pointer'};
                  border:1.5px solid #f3f4f6;opacity:${outOfStock ? '.65' : '1'}"
           onmouseover="this.style.boxShadow='0 8px 24px rgba(0,0,0,.13)';${outOfStock ? '' : "this.style.transform='translateY(-3px)'"}"
           onmouseout="this.style.boxShadow='0 1px 6px rgba(0,0,0,.07)';this.style.transform=''">
        <div style="position:relative;height:110px;overflow:hidden">
          <img src="${p.img}" style="width:100%;height:100%;object-fit:cover;${outOfStock ? 'filter:grayscale(60%)' : ''}" loading="lazy">
          <div style="position:absolute;top:8px;left:8px;background:${badgeBg};color:white;font-size:10px;font-weight:700;padding:3px 8px;border-radius:6px">${badgeTxt}</div>
        </div>
        <div style="padding:10px">
          <div style="font-size:12px;font-weight:700;color:#111827;line-height:1.3;margin-bottom:2px;min-height:32px">${p.name}</div>
          <div style="font-size:11px;color:#9ca3af;margin-bottom:6px">${p.weight}</div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:4px">
            <div style="font-size:14px;font-weight:800;color:#111827">${fmt(p.price)}</div>
            <div style="font-size:10px;font-weight:600;color:${outOfStock ? '#9ca3af' : 'var(--primary)'};background:${outOfStock ? '#f9fafb' : '#f0fdf4'};padding:3px 8px;border-radius:6px;white-space:nowrap;display:flex;align-items:center;gap:3px">
              ${outOfStock ? '' : '<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>'}
              ${outOfStock ? 'Habis' : 'Add'}
            </div>
          </div>
        </div>
      </div>`;
  }).join('');
}

function posFilterProducts(q) { posRenderProducts(q); }

function posSetCategory(cat) {
  PosState.category = cat;
  POS_CATS.forEach(c => {
    const btn = document.getElementById('pos-cat-' + c.id);
    if (!btn) return;
    const active = c.id === cat;
    btn.style.background  = active ? 'var(--primary)' : 'white';
    btn.style.color       = active ? 'white' : '#6b7280';
    btn.style.borderColor = active ? 'var(--primary)' : '#e5e7eb';
  });
  posRenderProducts(document.getElementById('pos-search')?.value || '');
}

/* ─ Cart ─ */
function posAddItem(productId) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p || p.stock <= 0) { showToast('Stok habis!', 'error'); return; }
  const existing = PosState.cart.find(c => c.product.id === productId);
  if (existing) {
    if (existing.qty >= p.stock) { showToast('Melebihi stok tersedia (' + p.stock + ')', 'warning'); return; }
    existing.qty++;
  } else {
    PosState.cart.push({ product: p, qty: 1, note: '' });
  }
  posRenderCart();
  posCalcTotal();
  showToast(p.name.split(' ').slice(0,2).join(' ') + ' ditambahkan', 'success', 1400);
}

function posRenderCart() {
  const container = document.getElementById('pos-cart-items');
  const empty     = document.getElementById('pos-cart-empty');
  if (!container) return;

  const totalItems = PosState.cart.reduce((s, c) => s + c.qty, 0);
  const countEl = document.getElementById('pos-items-count');
  if (countEl) countEl.textContent = totalItems + ' item dipilih';

  if (PosState.cart.length === 0) {
    empty.style.display = 'block';
    [...container.children].forEach(c => { if (c !== empty) c.remove(); });
    posCalcTotal();
    return;
  }
  empty.style.display = 'none';

  const existingIds = new Set();
  PosState.cart.forEach(({ product: p, qty, note }) => {
    existingIds.add('pos-item-' + p.id);
    let row = document.getElementById('pos-item-' + p.id);
    if (!row) {
      row = document.createElement('div');
      row.id = 'pos-item-' + p.id;
      container.appendChild(row);
    }
    row.style.cssText = 'background:#f9fafb;border-radius:12px;padding:12px;border:1px solid #f3f4f6';
    row.innerHTML = `
      <div style="display:flex;gap:10px;align-items:flex-start">
        <img src="${p.img}" style="width:46px;height:46px;border-radius:8px;object-fit:cover;flex-shrink:0">
        <div style="flex:1;min-width:0">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:6px">
            <div style="font-size:12px;font-weight:700;color:#111827;line-height:1.3">${p.name}</div>
            <button onclick="posRemoveItem(${p.id})"
              style="flex-shrink:0;background:none;border:none;cursor:pointer;color:#d1d5db;padding:0;line-height:1"
              onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#d1d5db'">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          ${note ? `<div style="margin-top:4px;display:flex;gap:4px;flex-wrap:wrap">
            <span style="font-size:10px;background:#e0f2fe;color:#0369a1;padding:2px 8px;border-radius:20px;font-weight:600">${note}</span>
          </div>` : ''}
        </div>
      </div>
      <!-- Qty + price row -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px">
        <div style="display:flex;align-items:center;gap:0;background:#e5e7eb;border-radius:8px;overflow:hidden">
          <button onclick="posChangeQty(${p.id},-1)"
            style="width:28px;height:28px;background:none;border:none;cursor:pointer;font-size:16px;font-weight:700;color:#374151;display:flex;align-items:center;justify-content:center">−</button>
          <span style="font-size:13px;font-weight:800;min-width:22px;text-align:center;color:#111827">${qty}</span>
          <button onclick="posChangeQty(${p.id},1)"
            style="width:28px;height:28px;background:var(--primary);border:none;cursor:pointer;font-size:16px;font-weight:700;color:white;display:flex;align-items:center;justify-content:center">+</button>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <button onclick="posEditNote(${p.id})"
            style="font-size:11px;color:#6b7280;background:none;border:none;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:3px"
            onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='#6b7280'">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit
          </button>
          <div style="font-size:14px;font-weight:800;color:#111827">${fmt(p.price * qty)}</div>
        </div>
      </div>`;
  });

  [...container.children].forEach(c => {
    if (c !== empty && !existingIds.has(c.id)) c.remove();
  });

  posCalcTotal();
}

function posChangeQty(productId, delta) {
  const item = PosState.cart.find(c => c.product.id === productId);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  if (item.qty > item.product.stock) { item.qty = item.product.stock; showToast('Melebihi stok tersedia', 'warning'); }
  posRenderCart();
}

function posRemoveItem(productId) {
  PosState.cart = PosState.cart.filter(c => c.product.id !== productId);
  posRenderCart();
}

function posEditNote(productId) {
  const item = PosState.cart.find(c => c.product.id === productId);
  if (!item) return;
  const note = prompt('Catatan untuk ' + item.product.name + ':', item.note || '');
  if (note === null) return;
  item.note = note.trim();
  posRenderCart();
}

function posClearCart() {
  PosState.cart = [];
  PosState.selectedCustomerId = null;
  const ids = ['pos-search','pos-discount','pos-cash-input'];
  ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  posDeselectCustomer();
  posRenderCart();
  posRenderProducts();
}

/* ─ Promo toggle ─ */
function posOpenPromo() {
  const row = document.getElementById('pos-promo-row');
  if (!row) return;
  const open = row.style.display !== 'flex';
  row.style.display = open ? 'flex' : 'none';
  if (open) document.getElementById('pos-discount')?.focus();
}

/* ─ Totals with PPN ─ */
function posCalcTotal() {
  const subtotal = PosState.cart.reduce((s, c) => s + c.product.price * c.qty, 0);
  const discPct  = Math.min(100, Math.max(0, Number(document.getElementById('pos-discount')?.value) || 0));
  const discAmt  = Math.round(subtotal * discPct / 100);
  const afterDisc = subtotal - discAmt;
  const tax      = Math.round(afterDisc * POS_TAX_RATE);
  const total    = afterDisc + tax;

  const $  = id => document.getElementById(id);
  if ($('pos-subtotal'))      $('pos-subtotal').textContent      = fmt(subtotal);
  if ($('pos-tax'))           $('pos-tax').textContent           = fmt(tax);
  if ($('pos-total'))         $('pos-total').textContent         = fmt(total);

  // Discount row visibility
  const discRow = $('pos-discount-row');
  if (discRow)   discRow.style.display = discAmt > 0 ? 'flex' : 'none';
  if ($('pos-discount-amount')) $('pos-discount-amount').textContent = '− ' + fmt(discAmt);

  // Discount label in promo banner
  const lbl1 = $('pos-discount-label');
  const lbl2 = $('pos-discount-label2');
  if (lbl1) lbl1.textContent = discPct > 0 ? discPct + '%' : '—';
  if (lbl2) lbl2.textContent = 'Diskon ' + discPct + '%';

  PosState.discount = discAmt;
  PosState.tax = tax;
  posCalcChange();
  return total;
}

function posCalcChange() {
  if (PosState.payment !== 'cash') return;
  const total = posCalcTotal();
  const cash  = Number(document.getElementById('pos-cash-input')?.value) || 0;
  const el = document.getElementById('pos-change');
  if (!el) return;
  if (cash <= 0) { el.textContent = '—'; el.style.color = 'var(--primary)'; return; }
  const change = cash - total;
  el.textContent = change >= 0 ? fmt(change) : '⚠️ Kurang ' + fmt(Math.abs(change));
  el.style.color = change >= 0 ? 'var(--primary)' : '#ef4444';
}

/* ─ Payment method ─ */
function posSetPayment(method) {
  PosState.payment = method;
  ['cash','qris','edc'].forEach(m => {
    const btn = document.getElementById('pos-pay-' + m);
    if (!btn) return;
    const active = m === method;
    btn.style.background  = active ? 'var(--primary)' : 'white';
    btn.style.color       = active ? 'white' : '#374151';
    btn.style.borderColor = active ? 'var(--primary)' : '#e5e7eb';
  });
  const cashSec = document.getElementById('pos-cash-section');
  if (cashSec) cashSec.style.display = method === 'cash' ? 'block' : 'none';
}

/* ─ Process sale ─ */
function posProcessSale() {
  if (PosState.cart.length === 0) { showToast('Keranjang kosong!', 'error'); return; }
  if (PosState.payment === 'cash') {
    const total = posCalcTotal();
    const cash  = Number(document.getElementById('pos-cash-input')?.value) || 0;
    if (cash < total) { showToast('Uang yang diterima kurang!', 'error'); return; }
  }
  PosState.cart.forEach(({ product: p, qty }) => {
    p.stock = Math.max(0, p.stock - qty);
    p.sold  = (p.sold || 0) + qty;
  });
  _saveStockToStorage();

  // Record transaction on customer record
  if (PosState.selectedCustomerId) {
    const customers = loadCustomers();
    const c = customers.find(x => x.id === PosState.selectedCustomerId);
    if (c) {
      const total = posCalcTotal();
      c.transactions = (c.transactions || 0) + 1;
      c.totalAmount  = (c.totalAmount  || 0) + total;
      saveCustomers(customers);
    }
  }

  _showPosReceipt();
}

function _showPosReceipt() {
  const subtotal   = PosState.cart.reduce((s, c) => s + c.product.price * c.qty, 0);
  const discAmt    = PosState.discount || 0;
  const tax        = PosState.tax || 0;
  const total      = subtotal - discAmt + tax;
  const cash       = Number(document.getElementById('pos-cash-input')?.value) || 0;
  const change     = PosState.payment === 'cash' ? cash - total : 0;
  const customer   = document.getElementById('pos-customer')?.value || 'Umum';
  const orderType  = document.getElementById('pos-order-type')?.value || 'Dine in';
  const now        = new Date();
  const timeStr    = now.toLocaleString('id-ID', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
  const txId       = 'POS-' + now.getFullYear() + String(now.getMonth()+1).padStart(2,'0') + String(now.getDate()).padStart(2,'0') + '-' + String(Math.floor(Math.random()*9000)+1000);
  const payLabel   = { cash:'Tunai', qris:'QRIS', edc:'EDC/Debit' }[PosState.payment];

  let receipt = document.getElementById('pos-receipt-overlay');
  if (!receipt) {
    receipt = document.createElement('div');
    receipt.id = 'pos-receipt-overlay';
    receipt.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;z-index:9000;backdrop-filter:blur(6px)';
    document.body.appendChild(receipt);
  }
  receipt.innerHTML = `
    <div style="background:white;border-radius:20px;padding:28px 26px;max-width:380px;width:90%;max-height:90vh;overflow-y:auto">
      <div style="text-align:center;margin-bottom:18px">
        <div style="width:52px;height:52px;background:var(--primary);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;font-size:24px">🧾</div>
        <div style="font-size:17px;font-weight:900;color:#111827">TOKO MLIJOAN</div>
        <div style="font-size:11px;color:#9ca3af;margin-top:2px">Jl. Soekarno Hatta No.1, Bandung · 0812-3456-7890</div>
        <div style="border-top:2px dashed #f3f4f6;margin:12px 0"></div>
        <div style="font-size:11px;color:#6b7280">${timeStr} · ${txId}</div>
        <div style="font-size:11px;color:#6b7280;margin-top:2px">Kasir: Admin · Pelanggan: <strong>${customer}</strong> · ${orderType}</div>
        <div style="border-top:2px dashed #f3f4f6;margin:12px 0"></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
        ${PosState.cart.map(({ product: p, qty, note }) => `
          <div style="display:flex;gap:10px;align-items:center">
            <img src="${p.img}" style="width:36px;height:36px;border-radius:6px;object-fit:cover;flex-shrink:0">
            <div style="flex:1;min-width:0">
              <div style="font-size:12px;font-weight:700;color:#111827">${p.name}</div>
              ${note ? `<div style="font-size:10px;color:#9ca3af">${note}</div>` : ''}
              <div style="font-size:11px;color:#9ca3af">${qty} × ${fmt(p.price)}</div>
            </div>
            <div style="font-size:13px;font-weight:800">${fmt(p.price * qty)}</div>
          </div>`).join('')}
      </div>
      <div style="border-top:2px dashed #f3f4f6;padding-top:10px;display:flex;flex-direction:column;gap:5px;margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#6b7280"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#6b7280"><span>PPN (11%)</span><span>${fmt(tax)}</span></div>
        ${discAmt > 0 ? `<div style="display:flex;justify-content:space-between;font-size:12px;color:#ef4444"><span>Diskon</span><span>− ${fmt(discAmt)}</span></div>` : ''}
        <div style="display:flex;justify-content:space-between;font-size:15px;font-weight:900;color:#111827;border-top:1.5px solid #f3f4f6;padding-top:8px;margin-top:4px"><span>TOTAL</span><span style="color:var(--primary)">${fmt(total)}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#6b7280"><span>Bayar (${payLabel})</span><span>${PosState.payment === 'cash' ? fmt(cash) : '—'}</span></div>
        ${PosState.payment === 'cash' ? `<div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700;color:var(--primary)"><span>Kembalian</span><span>${fmt(change)}</span></div>` : ''}
      </div>
      <div style="text-align:center;font-size:11px;color:#9ca3af;margin-bottom:14px">Terima kasih telah berbelanja di Mlijoan! 🌿</div>
      <div style="display:flex;gap:10px">
        <button onclick="window.print()" style="flex:1;padding:12px;background:#f3f4f6;border:none;border-radius:12px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">🖨️ Cetak</button>
        <button onclick="posCloseSale()" style="flex:1;padding:12px;background:var(--primary);color:white;border:none;border-radius:12px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">✅ Selesai</button>
      </div>
    </div>`;
  receipt.style.display = 'flex';
}

function posCloseSale() {
  const receipt = document.getElementById('pos-receipt-overlay');
  if (receipt) receipt.style.display = 'none';
  posClearCart();
  posRenderProducts();
  renderProducts();
  showToast('🎉 Transaksi berhasil! Stok diperbarui.', 'success', 4000);
}

// ═══════════════════════════════════════════════════════
// CUSTOMER SYSTEM
// ═══════════════════════════════════════════════════════
PosState.selectedCustomerId = null;

function loadCustomers() {
  try { return JSON.parse(localStorage.getItem('mlj_customers') || '[]'); } catch { return []; }
}
function saveCustomers(list) {
  localStorage.setItem('mlj_customers', JSON.stringify(list));
}

/* ─ Render customer table (section: Pelanggan) ─ */
function renderCustomers() {
  const tbody = document.getElementById('customers-table-body');
  if (!tbody) return;
  const q    = (document.getElementById('customer-search')?.value || '').toLowerCase();
  let   list = loadCustomers();
  if (q) list = list.filter(c => c.name.toLowerCase().includes(q) || (c.wa||'').includes(q));

  const badge = document.getElementById('badge-customers');
  const total = loadCustomers().length;
  if (badge) { badge.textContent = total; badge.style.display = total > 0 ? 'inline-flex' : 'none'; }

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:#9ca3af">
      <div style="font-size:32px;margin-bottom:8px">👤</div>
      <div style="font-weight:600">${q ? 'Tidak ditemukan' : 'Belum ada pelanggan'}</div>
      <div style="font-size:12px;margin-top:4px">${q ? 'Coba kata kunci lain' : 'Tambah pelanggan pertama'}</div>
    </td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(c => {
    const initials = (c.name||'?').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
    const waFmt    = c.wa ? ('0' + c.wa.replace(/^0/,'')) : '—';
    const waLink   = c.wa ? `https://wa.me/62${c.wa.replace(/^0/,'')}` : '#';
    const joinDate = c.createdAt ? new Date(c.createdAt).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'}) : '—';
    return `<tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:36px;height:36px;border-radius:50%;background:var(--primary);color:white;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0">${initials}</div>
          <div>
            <div style="font-weight:700;color:#111827">${c.name}</div>
            <div style="font-size:11px;color:#9ca3af">#CUST-${String(c.id).slice(-4)}</div>
          </div>
        </div>
      </td>
      <td>${c.wa ? `<a href="${waLink}" target="_blank" style="color:var(--primary);font-weight:600;text-decoration:none;font-size:13px">${waFmt}</a>` : '<span style="color:#9ca3af">—</span>'}</td>
      <td style="font-size:13px;color:#374151;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.address||'<span style="color:#9ca3af">—</span>'}</td>
      <td style="text-align:center">
        <span style="background:#f0fdf4;color:var(--primary);font-weight:800;font-size:13px;padding:3px 12px;border-radius:20px">${c.transactions||0}x</span>
      </td>
      <td style="text-align:right;font-weight:700;color:#111827">${fmt(c.totalAmount||0)}</td>
      <td style="font-size:12px;color:#6b7280">${joinDate}</td>
      <td style="text-align:center">
        <div style="display:flex;gap:6px;justify-content:center">
          <button onclick="editCustomer(${c.id})" style="padding:5px 10px;border:1.5px solid #e5e7eb;background:white;border-radius:7px;font-size:11px;font-weight:600;cursor:pointer;color:#374151;font-family:inherit">Edit</button>
          <button onclick="deleteCustomer(${c.id})" style="padding:5px 10px;border:1.5px solid #fee2e2;background:#fff5f5;border-radius:7px;font-size:11px;font-weight:600;cursor:pointer;color:#ef4444;font-family:inherit">Hapus</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

/* ─ Modal: full add/edit ─ */
function openAddCustomerModal(id) {
  const customers = loadCustomers();
  const c = id ? customers.find(x => x.id === id) : null;
  document.getElementById('customer-modal-title').textContent = c ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru';
  document.getElementById('cm-id').value      = c ? c.id : '';
  document.getElementById('cm-name').value    = c ? c.name : '';
  document.getElementById('cm-wa').value      = c ? c.wa : '';
  document.getElementById('cm-address').value = c ? (c.address||'') : '';
  const ov = document.getElementById('customer-modal-overlay');
  ov.style.display = 'flex';
  setTimeout(() => document.getElementById('cm-name')?.focus(), 100);
}
function closeCustomerModal() {
  document.getElementById('customer-modal-overlay').style.display = 'none';
}
function saveCustomerModal() {
  const name = document.getElementById('cm-name').value.trim();
  const wa   = document.getElementById('cm-wa').value.trim().replace(/\D/g,'');
  const addr = document.getElementById('cm-address').value.trim();
  const id   = document.getElementById('cm-id').value;
  if (!name) { showToast('Nama tidak boleh kosong','error'); return; }
  if (!wa)   { showToast('No. WA tidak boleh kosong','error'); return; }
  const customers = loadCustomers();
  if (id) {
    const c = customers.find(x => x.id === Number(id));
    if (c) { c.name = name; c.wa = wa; c.address = addr; }
  } else {
    customers.push({ id: Date.now(), name, wa, address: addr, transactions:0, totalAmount:0, createdAt: new Date().toISOString() });
  }
  saveCustomers(customers);
  closeCustomerModal();
  renderCustomers();
  showToast(id ? 'Data pelanggan diperbarui' : 'Pelanggan baru ditambahkan 🎉','success');
}
function editCustomer(id) { openAddCustomerModal(id); }
function deleteCustomer(id) {
  if (!confirm('Hapus data pelanggan ini?')) return;
  saveCustomers(loadCustomers().filter(c => c.id !== id));
  renderCustomers();
  showToast('Pelanggan dihapus','success');
}

/* ─ POS Customer Picker ─ */
function posShowCustomerDropdown() { posSearchCustomer(document.getElementById('pos-customer-search')?.value||''); }
function posHideCustomerDropdown() { const dd=document.getElementById('pos-customer-dropdown'); if(dd) dd.style.display='none'; }

function posSearchCustomer(q) {
  const dd = document.getElementById('pos-customer-dropdown');
  if (!dd) return;
  let list = loadCustomers();
  if (q) list = list.filter(c => c.name.toLowerCase().includes(q.toLowerCase()) || (c.wa||'').includes(q));
  if (!list.length) {
    dd.innerHTML = `<div style="padding:14px;text-align:center;color:#9ca3af;font-size:12px">Tidak ditemukan.
      <button onclick="posShowAddCustomer()" style="display:block;margin:6px auto 0;color:var(--primary);background:none;border:none;cursor:pointer;font-size:12px;font-weight:700;font-family:inherit">+ Tambah Customer Baru</button></div>`;
  } else {
    dd.innerHTML = list.slice(0,8).map(c => {
      const init = (c.name||'?').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
      return `<div onclick="posSelectCustomer(${c.id})" style="display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=''">
        <div style="width:30px;height:30px;border-radius:50%;background:var(--primary);color:white;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0">${init}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:700;color:#111827">${c.name}</div>
          <div style="font-size:11px;color:#9ca3af">${c.wa?'0'+c.wa.replace(/^0/,''):'No WA'} · ${c.transactions||0}x transaksi</div>
        </div>
      </div>`;
    }).join('');
  }
  dd.style.display = 'block';
}

function posSelectCustomer(id) {
  const c = loadCustomers().find(x => x.id === id);
  if (!c) return;
  PosState.selectedCustomerId = id;
  document.getElementById('pos-customer').value = c.name;
  const chip   = document.getElementById('pos-customer-chip');
  const avatar = document.getElementById('pos-customer-avatar');
  const nameEl = document.getElementById('pos-customer-name-display');
  const search = document.getElementById('pos-customer-search');
  if (chip)   chip.style.display   = 'flex';
  if (avatar) avatar.textContent   = (c.name||'?').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  if (nameEl) nameEl.textContent   = c.name;
  if (search) search.style.opacity = '0';
  posHideCustomerDropdown();
}

function posDeselectCustomer() {
  PosState.selectedCustomerId = null;
  const chip   = document.getElementById('pos-customer-chip');
  const search = document.getElementById('pos-customer-search');
  if (chip)   chip.style.display   = 'none';
  if (search) { search.style.opacity='1'; search.value=''; }
  document.getElementById('pos-customer').value = '';
}

/* ─ POS Quick Add Customer ─ */
function posShowAddCustomer() {
  posHideCustomerDropdown();
  const ov = document.getElementById('pos-add-customer-overlay');
  ov.style.display = 'flex';
  const q = document.getElementById('pos-customer-search')?.value||'';
  const nameEl = document.getElementById('pac-name');
  if (nameEl) { nameEl.value = q; nameEl.focus(); }
}
function posCloseAddCustomer() {
  document.getElementById('pos-add-customer-overlay').style.display = 'none';
  ['pac-name','pac-wa','pac-address'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
}
function posSaveNewCustomer() {
  const name = document.getElementById('pac-name')?.value.trim();
  const wa   = document.getElementById('pac-wa')?.value.trim().replace(/\D/g,'');
  const addr = document.getElementById('pac-address')?.value.trim();
  if (!name) { showToast('Nama tidak boleh kosong','error'); return; }
  const newC = { id:Date.now(), name, wa:wa||'', address:addr||'', transactions:0, totalAmount:0, createdAt:new Date().toISOString() };
  const customers = loadCustomers();
  customers.push(newC);
  saveCustomers(customers);
  posCloseAddCustomer();
  posSelectCustomer(newC.id);
  showToast('Customer baru ditambahkan & dipilih!','success');
}
