/* ===========================
   MLIJOAN — UI Components
   =========================== */

// ─── Toast ───
let toastTimer;
function showToast(msg, type = 'default', duration = 2800) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = '';
  const icon = { success: '✅', error: '❌', warning: '⚠️', default: 'ℹ️' }[type] || 'ℹ️';
  const iconEl = document.createElement('span');
  iconEl.textContent = icon;
  const textEl = document.createElement('span');
  textEl.textContent = msg;
  toast.appendChild(iconEl);
  toast.appendChild(textEl);
  toast.className = 'toast ' + (type !== 'default' ? type : '');
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

// ─── Navigation ───
function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) {
    target.classList.add('active');
    target.scrollTop = 0;
    window.scrollTo({ top: 0 });
  }
  const navItem = document.querySelector('[data-nav="' + page + '"]');
  if (navItem) navItem.classList.add('active');
  AppState.currentPage = page;
  if (page === 'cart')     renderCart();
  if (page === 'orders')   renderOrders();
  if (page === 'favorite') renderFavorites();
  if (page === 'admin')    renderAdmin();
}

// ─── Auth-gated Navigation ───
// Protected pages that require login
const PROTECTED_PAGES = ['cart', 'orders', 'checkout', 'account', 'favorite'];

function requireAuthNav(page) {
  const savedUser = JSON.parse(localStorage.getItem('mlj_user') || 'null');
  if (!savedUser) {
    // Not logged in → show brief toast then redirect to auth
    showToast('Silakan login terlebih dahulu', 'warning', 1800);
    setTimeout(() => {
      window.location.href = 'auth.html?redirect=' + page;
    }, 800);
    return;
  }
  // Logged in → navigate normally
  navigateTo(page);
}

// ─── Banner Carousel ───
let bannerIndex = 0;
let bannerInterval;
function initBannerCarousel() {
  const slides = document.querySelectorAll('.banner-slide');
  const dots = document.querySelectorAll('.banner-dot');
  function showSlide(i) {
    slides.forEach((s, idx) => {
      s.classList.toggle('active', idx === i);
    });
    dots.forEach((d, idx) => {
      d.classList.toggle('active', idx === i);
    });
    bannerIndex = i;
  }
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { showSlide(i); clearInterval(bannerInterval); });
  });
  clearInterval(bannerInterval);
  bannerInterval = setInterval(() => {
    showSlide((bannerIndex + 1) % slides.length);
  }, 4000);
  showSlide(0);
}

// ─── Category Filter ───
let activeCategory = 'all';
function filterProducts(catId) {
  activeCategory = catId;
  document.querySelectorAll('.category-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.cat === catId);
  });
  renderProductGrid();
}

// ─── Product Card HTML ───
function productCardHTML(product, size = 'normal') {
  const isFav    = AppState.favorites.has(product.id);
  const outOfStock = product.stock <= 0;
  return `
    <div class="product-card ${outOfStock ? 'out-of-stock' : ''}" onclick="${outOfStock ? `showToast('Stok ${product.name} sedang habis', 'warning')` : `openProductDetail(${product.id})`}" style="${outOfStock ? 'opacity:.7' : ''}">
      ${outOfStock
        ? `<div class="product-badge" style="background:#ef4444">Stok Habis</div>`
        : (product.badge ? `<div class="product-badge">${product.badge}</div>` : '')
      }
      <div class="product-img-wrap">
        <img src="${product.img}" alt="${product.name}" loading="lazy" style="${outOfStock?'filter:grayscale(60%)':''}">
        ${outOfStock ? `<div style="position:absolute;inset:0;background:rgba(255,255,255,0.5);display:flex;align-items:center;justify-content:center;border-radius:var(--radius-md)"><span style="background:#ef4444;color:white;font-size:11px;font-weight:800;padding:4px 10px;border-radius:20px">HABIS</span></div>` : ''}
      </div>
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-weight">${product.weight}</div>
        <div class="stars">
          ${'⭐'.repeat(Math.floor(product.rating))}
          <span class="text-xs text-muted" style="margin-left:4px">(${product.reviews})</span>
        </div>
        <div class="product-price">${formatRupiah(product.price)}<span class="text-xs text-muted font-normal">${product.unit}</span></div>
      </div>
      <button class="product-add-btn" ${outOfStock ? 'disabled style="opacity:.4;cursor:not-allowed;background:#9ca3af"' : `onclick="handleAddToCart(event, ${product.id})"`}>
        ${outOfStock
          ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
          : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`
        }
      </button>
    </div>`;
}


// ─── PWA Banner: dismiss persists for the session ───
function dismissInstallBanner() {
  const banner = document.getElementById('install-banner');
  if (!banner) return;
  // Animate out
  banner.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
  banner.style.transform = 'translateY(100%)';
  banner.style.opacity = '0';
  setTimeout(() => {
    banner.classList.remove('show');
    banner.style.transform = '';
    banner.style.opacity = '';
  }, 320);
  // Remember dismissed for this browser session (cleared on tab close)
  try { sessionStorage.setItem('mlj_banner_dismissed', '1'); } catch(e) {}
}

function handleAddToCart(e, productId) {
  e.stopPropagation();
  // Open quantity + notes sheet instead of directly adding
  openAddToCartSheet(productId);
}

// ─── Render Product Grid ───
function renderProductGrid() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  const filtered = activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory);
  grid.innerHTML = filtered.map(p => productCardHTML(p)).join('');
}

// ─── Product Detail ───
function openProductDetail(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const modal = document.getElementById('product-detail-sheet');
  const isFav = AppState.favorites.has(productId);
  modal.innerHTML = `
    <div class="modal-handle"></div>
    <div style="position:relative">
      <img src="${product.img}" alt="${product.name}" style="width:100%;height:260px;object-fit:cover;">
      <button onclick="closeModal('product-detail-modal')" style="position:absolute;top:16px;left:16px;width:38px;height:38px;background:rgba(255,255,255,0.9);border:none;border-radius:50%;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.15);">←</button>
      <button id="fav-btn-${productId}" onclick="handleFavorite(${productId})" style="position:absolute;top:16px;right:16px;width:38px;height:38px;background:rgba(255,255,255,0.9);border:none;border-radius:50%;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.15);">${isFav ? '❤️' : '🤍'}</button>
      ${product.badge ? `<div class="product-badge" style="top:auto;bottom:16px;left:16px;">${product.badge}</div>` : ''}
    </div>
    <div style="padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div style="flex:1">
          <h2 style="font-size:20px;font-weight:800;color:var(--neutral-800)">${product.name}</h2>
          <p style="font-size:13px;color:var(--neutral-500);margin-top:4px">± ${product.weight} · Stok: ${product.stock}</p>
        </div>
        <div style="text-align:right">
          <div style="font-size:22px;font-weight:800;color:var(--primary)">${formatRupiah(product.price)}</div>
          <div style="font-size:12px;color:var(--neutral-500)">${product.unit}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:12px;margin:12px 0;padding:12px;background:var(--neutral-100);border-radius:var(--radius-md)">
        <div>
          <div class="stars">${'⭐'.repeat(Math.floor(product.rating))}<span style="font-size:13px;font-weight:700;margin-left:4px">${product.rating}</span></div>
          <div style="font-size:12px;color:var(--neutral-500)">${product.reviews} ulasan · ${product.sold} terjual</div>
        </div>
        <div style="margin-left:auto;text-align:right">
          <div style="font-size:12px;color:var(--neutral-500)">Dijual oleh</div>
          <div style="font-size:13px;font-weight:700;color:var(--primary)">Toko Mlijoan</div>
        </div>
      </div>
      
      <div style="display:flex;gap:0;border-bottom:2px solid var(--neutral-200);margin-bottom:14px" id="detail-tabs">
        <button onclick="switchDetailTab('desc')" id="tab-desc" style="padding:10px 16px;border:none;background:transparent;font-size:14px;font-weight:700;color:var(--primary);border-bottom:2px solid var(--primary);margin-bottom:-2px;cursor:pointer">Detail</button>
        <button onclick="switchDetailTab('info')" id="tab-info" style="padding:10px 16px;border:none;background:transparent;font-size:14px;font-weight:600;color:var(--neutral-500);cursor:pointer">Support</button>
        <button onclick="switchDetailTab('reviews')" id="tab-reviews" style="padding:10px 16px;border:none;background:transparent;font-size:14px;font-weight:600;color:var(--neutral-500);cursor:pointer">Ulasan</button>
      </div>
      <div id="detail-content">
        <div id="tab-content-desc">
          <p style="font-size:14px;color:var(--neutral-600);line-height:1.7">Produk segar pilihan langsung dari petani/supplier lokal terpercaya Mlijoan. Dipetik/dipilih setiap hari untuk menjamin kesegaran dan kualitas terbaik. Tersedia dalam kemasan bersih dan higienis.</p>
          <div class="info-box" style="margin-top:14px">
            <span class="info-box-icon">🌿</span>
            <span class="info-box-text">Produk ini dijamin segar dan lolos quality check oleh tim Mlijoan sebelum dikirimkan.</span>
          </div>
        </div>
        <div id="tab-content-info" style="display:none">
          <div class="info-box" style="margin-bottom:12px">
            <span class="info-box-icon">🛡️</span>
            <span class="info-box-text"><strong>Garansi Kesegaran:</strong> Jika produk tidak segar saat tiba, kami jamin penggantian atau refund 100%.</span>
          </div>
          <div class="info-box" style="background:var(--neutral-50);border-color:var(--neutral-200)">
            <span class="info-box-icon">📱</span>
            <div class="info-box-text">Hubungi CS kami: <strong>WhatsApp 0812-3456-7890</strong><br>Jam layanan: 07.00–21.00 WIB</div>
          </div>
        </div>
        <div id="tab-content-reviews" style="display:none">
          <div style="display:flex;flex-direction:column;gap:14px">
            ${[
              { user: 'Siti R.', text: 'Produknya segar banget, sesuai foto. Pengiriman cepat!', rating: 5, date: '28 Okt 2026' },
              { user: 'Ahmad F.', text: 'Harga terjangkau, kualitas premium. Recommended banget!', rating: 5, date: '27 Okt 2026' },
              { user: 'Dewi K.', text: 'Sudah langganan rutin. Selalu puas!', rating: 4, date: '25 Okt 2026' },
            ].map(r => `
              <div style="padding:12px;background:var(--neutral-50);border-radius:var(--radius-md)">
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <span style="font-size:13px;font-weight:700">${r.user}</span>
                  <span style="font-size:11px;color:var(--neutral-400)">${r.date}</span>
                </div>
                <div class="stars" style="margin:4px 0">${'⭐'.repeat(r.rating)}</div>
                <p style="font-size:13px;color:var(--neutral-600)">${r.text}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div style="margin-top:20px">
        <div class="section-header"><span class="section-title" style="font-size:15px">Mungkin Kamu Suka</span></div>
        <div class="products-scroll">
          ${PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0,4).map(p => productCardHTML(p)).join('')}
        </div>
      </div>

      <div style="position:sticky;bottom:0;background:white;padding-top:16px;padding-bottom:8px">
        <button class="btn btn-primary" onclick="handleAddToCart(event, ${product.id}); closeModal('product-detail-modal')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  `;
  openModal('product-detail-modal');
}

function switchDetailTab(tab) {
  ['desc','info','reviews'].forEach(t => {
    const btn = document.getElementById('tab-' + t);
    const content = document.getElementById('tab-content-' + t);
    if (!btn || !content) return;
    const active = t === tab;
    btn.style.color = active ? 'var(--primary)' : 'var(--neutral-500)';
    btn.style.borderBottom = active ? '2px solid var(--primary)' : 'none';
    btn.style.fontWeight = active ? '700' : '600';
    content.style.display = active ? 'block' : 'none';
  });
}

function handleFavorite(productId) {
  const added = toggleFavorite(productId);
  const btn = document.getElementById('fav-btn-' + productId);
  if (btn) btn.textContent = added ? '❤️' : '🤍';
  showToast(added ? 'Ditambahkan ke favorit ❤️' : 'Dihapus dari favorit', added ? 'success' : 'default');
}

// ─── Modal ───
function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.add('open');
}
function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.remove('open');
}

// ─── Cart ───
function renderCart() {
  const container = document.getElementById('cart-items');
  const empty = document.getElementById('cart-empty');
  const summary = document.getElementById('cart-summary');
  if (!container) return;
  if (AppState.cart.length === 0) {
    container.innerHTML = '';
    empty.style.display = 'flex';
    summary.style.display = 'none';
    return;
  }
  empty.style.display = 'none';
  summary.style.display = 'block';
  container.innerHTML = AppState.cart.map(item => `
    <div class="cart-item" id="cart-item-${item.id}">
      <img class="cart-item-img" src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-desc">${item.weight}</div>
        <div class="cart-item-price">${formatRupiah(item.price)}</div>
        <div class="qty-control">
          <button class="qty-btn minus" onclick="changeQty(${item.id}, -1)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
          <span class="qty-count" id="qty-${item.id}">${item.qty}</span>
          <button class="qty-btn plus" onclick="changeQty(${item.id}, 1)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>
        <!-- Keterangan per item -->
        <div style="margin-top:8px">
          <input
            type="text"
            id="note-${item.id}"
            placeholder="+ Keterangan (potong kecil, tanpa kulit, dll)"
            value="${item.note || ''}"
            onchange="updateItemNote(${item.id}, this.value)"
            style="width:100%;padding:7px 10px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:11.5px;font-family:inherit;color:#374151;outline:none;background:#fafafa;"
            onfocus="this.style.borderColor='var(--primary)'"
            onblur="this.style.borderColor='#e5e7eb'"
          >
        </div>
      </div>
      <button class="cart-delete-btn" onclick="deleteCartItem(${item.id})">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"></path></svg>
      </button>
    </div>
  `).join('');
  updateCartSummary();
}

function changeQty(productId, delta) {
  updateQty(productId, delta);
  const el = document.getElementById('qty-' + productId);
  const item = AppState.cart.find(c => c.id === productId);
  if (el && item) el.textContent = item.qty;
  updateCartSummary();
}

function deleteCartItem(productId) {
  const el = document.getElementById('cart-item-' + productId);
  if (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateX(100%)';
    el.style.transition = 'all 0.25s ease';
  }
  setTimeout(() => {
    removeFromCart(productId);
    renderCart();
  }, 250);
}

function updateCartSummary() {
  const subtotal = cartTotal();
  const fee = AppState.deliveryFee;
  let discount = 0;
  if (AppState.appliedPromo) {
    const promo = AppState.appliedPromo;
    if (promo.type === 'percent') discount = Math.round(subtotal * promo.value / 100);
    else if (promo.type === 'shipping') discount = Math.min(promo.value * 1000, fee);
  }
  const total = subtotal + fee - discount;
  const el = id => document.getElementById(id);
  if (el('cart-subtotal')) el('cart-subtotal').textContent = formatRupiah(subtotal);
  if (el('cart-fee')) el('cart-fee').textContent = fee > 0 ? formatRupiah(fee) : (AppState.deliveryAddress ? 'Rp 0' : '— (atur alamat)');
  if (el('cart-discount')) {
    el('cart-discount').textContent = discount > 0 ? '- ' + formatRupiah(discount) : '-';
    el('cart-discount').className = 'summary-value ' + (discount > 0 ? 'green' : '');
  }
  if (el('cart-total')) el('cart-total').textContent = formatRupiah(total);
}

function applyPromoCode() {
  const input = document.getElementById('promo-input');
  const code = input.value.trim().toUpperCase();
  const promo = PROMO_CODES[code];
  if (!promo) {
    showToast('Kode promo tidak valid', 'error');
    return;
  }
  AppState.appliedPromo = promo;
  showToast('Promo ' + promo.label + ' berhasil diterapkan! 🎉', 'success');
  updateCartSummary();
}

// ─── Orders ───
let orderTab = 'inprogress';
function renderOrders() {
  const container = document.getElementById('orders-container');
  if (!container) return;
  const inProgress = ['pending', 'processing', 'delivery'];
  const filtered = orderTab === 'inprogress'
    ? MOCK_ORDERS.filter(o => inProgress.includes(o.status))
    : MOCK_ORDERS.filter(o => o.status === 'completed');
  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">📦</div><div class="empty-title">Tidak ada pesanan</div><div class="empty-desc">Belum ada pesanan ${orderTab === 'inprogress' ? 'aktif' : 'selesai'}</div></div>`;
    return;
  }
  const config = s => getStatusConfig(s);
  container.innerHTML = filtered.map(order => `
    <div class="order-card" onclick="openOrderDetail('${order.id}')">
      <img class="order-img" src="${order.img}" alt="Order">
      <div class="order-info">
        <div style="display:flex;align-items:center;gap:8px">
          <div class="order-id">#${order.id}</div>
          <span class="status-badge ${config(order.status).class}">${config(order.status).icon} ${config(order.status).label}</span>
        </div>
        <div class="order-date">📅 ${order.scheduled}</div>
        <div class="order-total">${formatRupiah(order.total)}</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--neutral-400)" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
    </div>
  `).join('');
}

function switchOrderTab(tab) {
  orderTab = tab;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  renderOrders();
}

function openOrderDetail(orderId) {
  const order = MOCK_ORDERS.find(o => o.id === orderId);
  if (!order) return;
  const config = getStatusConfig(order.status);
  const isDelivery  = order.status === 'delivery';
  const isCompleted = order.status === 'completed';

  const steps = [
    { label: 'Pesanan Dibuat',    done: true,                                                         time: order.date },
    { label: 'Menunggu Transfer', done: order.status !== 'pending',                                   time: order.status !== 'pending' ? 'Pembayaran diterima' : '' },
    { label: 'Diproses',          done: ['processing','delivery','completed'].includes(order.status), time: order.status === 'processing' ? 'Sedang dikemas' : '' },
    { label: 'Dalam Pengiriman',  done: ['delivery','completed'].includes(order.status),              time: isDelivery ? 'Kurir sedang mengantar' : (isCompleted ? 'Telah diterima' : '') },
    { label: 'Selesai',           done: isCompleted,                                                  time: isCompleted ? (order.completedAt || '') : '' },
  ];

  const modal = document.getElementById('order-detail-modal');
  modal.innerHTML = `
    <div class="modal-handle"></div>
    <div class="modal-title">Detail Pesanan #${order.id}</div>
    <div style="padding:0 20px 20px">

      <!-- Status Banner -->
      <div style="background:${isDelivery ? 'linear-gradient(135deg,#0f5c2e,#1E9E4E)' : 'var(--primary-50)'};border-radius:var(--radius-lg);padding:14px;display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <span style="font-size:28px">${config.icon}</span>
        <div style="flex:1">
          <div style="font-size:14px;font-weight:700;color:${isDelivery?'white':'var(--neutral-800)'}">${config.label}</div>
          <div style="font-size:12px;color:${isDelivery?'rgba(255,255,255,0.75)':'var(--neutral-500)'}">Estimasi: ${order.scheduled}</div>
        </div>
        ${isDelivery ? `<button onclick="openTrackingView('${order.id}')"
          style="background:white;color:var(--primary);border:none;border-radius:20px;padding:7px 14px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:5px;flex-shrink:0">
          📍 Lacak Kurir
        </button>` : ''}
      </div>

      <!-- Timeline -->
      <div style="position:relative;padding-left:24px;margin-bottom:20px">
        ${steps.map((s, i) => `
          <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:${i < steps.length-1 ? '16px' : '0'};position:relative">
            <div style="position:absolute;left:-20px;top:4px;width:12px;height:12px;border-radius:50%;
              background:${s.done ? 'var(--primary)' : 'var(--neutral-200)'};
              border:2px solid ${s.done ? 'var(--primary)' : 'var(--neutral-200)'};
              z-index:1;flex-shrink:0
              ${s.done && !steps[i+1]?.done && i < steps.length-1 ? ';animation:pulseDot 1.5s ease-in-out infinite' : ''}">
            </div>
            ${i < steps.length-1 ? `<div style="position:absolute;left:-15px;top:16px;width:2px;height:20px;background:${steps[i+1].done ? 'var(--primary)' : 'var(--neutral-200)'}"></div>` : ''}
            <div>
              <div style="font-size:13px;font-weight:${s.done ? '700' : '500'};color:${s.done ? 'var(--neutral-800)' : 'var(--neutral-400)'}">${s.label}</div>
              ${s.time ? `<div style="font-size:11px;color:var(--neutral-400);margin-top:1px">${s.time}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Delivery Info if on delivery -->
      ${isDelivery ? `
      <div id="courier-quick-info" style="background:#f0fdf4;border:1.5px solid #a7f3d0;border-radius:var(--radius-lg);padding:12px 14px;margin-bottom:16px;display:flex;align-items:center;gap:12px">
        <div style="font-size:28px">🛵</div>
        <div style="flex:1">
          <div style="font-size:13px;font-weight:700;color:#065f46">Budi Kurniawan</div>
          <div style="font-size:11px;color:#059669">Kurir Mlijoan · Nopol B 2345 RCK</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px" id="courier-eta-text">Estimasi tiba: <strong style="color:var(--primary)">~15 menit</strong></div>
        </div>
        <a href="tel:081298765432" style="background:var(--primary);color:white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">📞</a>
      </div>` : ''}

      <!-- Items -->
      <div style="background:var(--neutral-50);border-radius:var(--radius-lg);padding:14px;margin-bottom:16px">
        <div style="font-size:13px;font-weight:700;color:var(--neutral-700);margin-bottom:10px">Item Pesanan</div>
        ${order.items.map(item => `
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
            <img src="${item.img}" style="width:50px;height:50px;border-radius:var(--radius-md);object-fit:cover">
            <div style="flex:1">
              <div style="font-size:13px;font-weight:600">${item.name}</div>
              <div style="font-size:12px;color:var(--neutral-500)">${item.weight}</div>
            </div>
            <div style="font-size:13px;font-weight:700;color:var(--primary)">${formatRupiah(item.price)}</div>
          </div>
        `).join('')}
      </div>

      <!-- Total -->
      <div class="summary-row"><span class="summary-label">Total Pembayaran</span><span class="summary-value" style="color:var(--primary);font-size:16px;font-weight:800">${formatRupiah(order.total)}</span></div>

      <!-- Actions -->
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:16px">
        ${isDelivery ? `
        <button class="btn btn-primary" onclick="confirmOrderReceived('${order.id}')" style="background:var(--primary);font-weight:700">
          ✅ Pesanan Sudah Diterima
        </button>` : ''}
        ${isCompleted && !order.rating ? `
        <button class="btn btn-primary" onclick="openRatingModal('${order.id}')" style="background:linear-gradient(135deg,#f59e0b,#f97316);border:none;font-weight:700">
          ⭐ Beri Ulasan & Rating
        </button>` : ''}
        ${isCompleted && order.rating ? `
        <div style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:var(--radius-lg);padding:12px;text-align:center">
          <div style="font-size:18px;margin-bottom:4px">${'⭐'.repeat(order.rating)}</div>
          <div style="font-size:12px;color:#92400e;font-weight:600">Ulasan sudah dikirim. Terima kasih!</div>
          ${order.review ? `<div style="font-size:12px;color:#6b7280;margin-top:4px;font-style:italic">"${order.review}"</div>` : ''}
        </div>` : ''}
        <button class="btn btn-outline" onclick="closeModal('order-detail-modal-overlay')">Tutup</button>
      </div>
    </div>
  `;
  openModal('order-detail-modal-overlay');

  // Start courier ETA countdown if delivery
  if (isDelivery) startEtaCountdown();
}

// ─── Favorites ───
function renderFavorites() {
  const container = document.getElementById('favorites-container');
  if (!container) return;
  const favProducts = PRODUCTS.filter(p => AppState.favorites.has(p.id));
  if (favProducts.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">❤️</div><div class="empty-title">Belum ada favorit</div><div class="empty-desc">Tambahkan produk ke favorit dari halaman detail produk</div><button class="btn btn-primary" style="max-width:200px;margin-top:8px" onclick="navigateTo('home')">Belanja Sekarang</button></div>`;
    return;
  }
  container.innerHTML = `<div class="products-grid">${favProducts.map(p => productCardHTML(p)).join('')}</div>`;
}

// ─── Checkout Flow ───
function proceedToCheckout() {
  if (AppState.cart.length === 0) return;
  navigateTo('checkout');
  renderCheckout();
}

function renderCheckout() {
  document.getElementById('checkout-address-display').textContent =
    AppState.deliveryAddress ? AppState.deliveryAddress.label : 'Belum diatur';
  const feeEl = document.getElementById('checkout-fee-display');
  if (feeEl) feeEl.textContent = AppState.deliveryFee > 0 ? formatRupiah(AppState.deliveryFee) : '— ';
  renderCheckoutItems();
}

function renderCheckoutItems() {
  const container = document.getElementById('checkout-items');
  if (!container) return;
  container.innerHTML = AppState.cart.map(item => `
    <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px dashed var(--neutral-200)">
      <img src="${item.img}" style="width:44px;height:44px;border-radius:var(--radius-md);object-fit:cover">
      <div style="flex:1">
        <div style="font-size:13px;font-weight:600">${item.name}</div>
        <div style="font-size:12px;color:var(--neutral-500)">× ${item.qty}</div>
      </div>
      <div style="font-size:13px;font-weight:700;color:var(--primary)">${formatRupiah(item.price * item.qty)}</div>
    </div>
  `).join('');
}

// ─── Update item note ───
function updateItemNote(productId, note) {
  const item = AppState.cart.find(c => c.id === productId);
  if (item) item.note = note;
}

// ─── Google Maps Init ───
let googleMapsReady = false;
let autocompleteInstance = null;

function initGoogleMaps() {
  googleMapsReady = true;
  console.log('Google Maps Places API siap');
}

// ─── Detect Location with Google Maps Geocoding ───
function detectLocationGoogle() {
  const addrBtn  = document.getElementById('address-detect-btn');
  const addrDisp = document.getElementById('address-display-text');

  if (addrBtn) {
    addrBtn.innerHTML = '⏳ Mendeteksi...';
    addrBtn.disabled = true;
  }

  if (!navigator.geolocation) {
    showToast('Browser tidak mendukung GPS', 'error');
    if (addrBtn) { addrBtn.innerHTML = '📍 Deteksi Lokasi'; addrBtn.disabled = false; }
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude: lat, longitude: lng } = pos.coords;

      // Try Google Geocoding API first
      if (googleMapsReady && window.google?.maps?.Geocoder) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng }, language: 'id' }, (results, status) => {
          if (status === 'OK' && results[0]) {
            _applyDetectedAddress(results[0].formatted_address, lat, lng);
          } else {
            // Fallback: OpenStreetMap Nominatim (free, no key needed)
            _fallbackNominatim(lat, lng);
          }
          if (addrBtn) { addrBtn.innerHTML = '📍 Perbarui Lokasi'; addrBtn.disabled = false; }
        });
      } else {
        // Fallback: Nominatim
        _fallbackNominatim(lat, lng);
      }
    },
    err => {
      const msgs = { 1:'Izin lokasi ditolak. Aktifkan GPS di browser.', 2:'Sinyal GPS lemah, coba lagi.', 3:'Timeout GPS, coba lagi.' };
      showToast(msgs[err.code] || 'Gagal deteksi lokasi', 'error', 4000);
      if (addrBtn) { addrBtn.innerHTML = '📍 Deteksi Lokasi'; addrBtn.disabled = false; }
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
  );
}

function _fallbackNominatim(lat, lng) {
  const addrBtn = document.getElementById('address-detect-btn');
  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=id&addressdetails=1`)
    .then(r => r.json())
    .then(data => {
      const addr = data.address;
      // Build Indonesian-style address from components
      const parts = [
        addr.road || addr.pedestrian || addr.footway,
        addr.house_number ? 'No.' + addr.house_number : null,
        addr.suburb || addr.neighbourhood || addr.quarter,
        addr.city_district || addr.town || addr.village,
        addr.city || addr.county,
        addr.state,
      ].filter(Boolean);
      const label = parts.join(', ') || data.display_name;
      _applyDetectedAddress(label, lat, lng);
    })
    .catch(() => {
      showToast('Gagal mendapatkan alamat. Cek koneksi internet.', 'error');
    })
    .finally(() => {
      if (addrBtn) { addrBtn.innerHTML = '📍 Perbarui Lokasi'; addrBtn.disabled = false; }
    });
}

function _applyDetectedAddress(label, lat, lng) {
  const dLat = lat - STORE_COORDS.lat;
  const dLng = lng - STORE_COORDS.lng;
  const dist  = Math.round(Math.sqrt(dLat*dLat + dLng*dLng) * 111 * 10) / 10;
  const fee   = calcShipping(dist);

  if (fee === -1) {
    showToast('Lokasi di luar jangkauan pengiriman (> 12 km)', 'error', 4000);
    return;
  }

  AppState.deliveryAddress  = { label, lat, lng };
  AppState.deliveryDistance = dist;
  AppState.deliveryFee      = fee;

  // Update address display in cart
  const addrDisp = document.getElementById('address-display-text');
  if (addrDisp) addrDisp.textContent = label;

  const mapEl = document.getElementById('map-display');
  if (mapEl) {
    mapEl.innerHTML = `
      <div class="distance-card">
        <div class="distance-icon">📍</div>
        <div class="distance-info">
          <p style="font-weight:700">${label}</p>
          <small>Jarak: <strong>${dist} km</strong> · Ongkir: <strong>${formatRupiah(fee)}</strong></small>
        </div>
      </div>
    `;
  }

  updateCartSummary();
  if (AppState.currentPage === 'checkout') renderCheckout();
  showToast('📍 Lokasi berhasil terdeteksi! Jarak: ' + dist + ' km', 'success', 4000);

  // If Google Maps is ready, also open Places autocomplete for manual correction
  if (googleMapsReady) _initPlacesAutocomplete(label);
}

// ─── Google Places Autocomplete for manual address input ───
function _initPlacesAutocomplete(currentLabel) {
  const input = document.getElementById('address-manual-input');
  if (!input || !window.google?.maps?.places) return;

  input.value = currentLabel;
  input.style.display = 'block';

  if (autocompleteInstance) return; // already initialized
  autocompleteInstance = new google.maps.places.Autocomplete(input, {
    componentRestrictions: { country: 'id' },
    fields: ['formatted_address', 'geometry', 'name'],
    types: ['address'],
  });
  autocompleteInstance.addListener('place_changed', () => {
    const place = autocompleteInstance.getPlace();
    if (!place.geometry) return;
    const lat  = place.geometry.location.lat();
    const lng  = place.geometry.location.lng();
    const addr = place.formatted_address || place.name;
    _applyDetectedAddress(addr, lat, lng);
  });
}

// ─── Keep simulateLocation as legacy fallback ───
function simulateLocation() {
  detectLocationGoogle();
}

// ─── Admin Panel ───
function renderAdmin() {
  renderAdminOrders();
  renderAdminSuppliers();
  if (typeof renderAdminStockBars === 'function') renderAdminStockBars();
}

function renderAdminOrders() {
  const tbody = document.getElementById('admin-orders-tbody');
  if (!tbody) return;
  tbody.innerHTML = MOCK_ORDERS.map(order => {
    const config = getStatusConfig(order.status);
    return `
      <tr>
        <td><strong>#${order.id}</strong></td>
        <td style="max-width:120px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${order.items[0].name}</td>
        <td><strong>${formatRupiah(order.total)}</strong></td>
        <td><span class="status-badge ${config.class}">${config.label}</span></td>
        <td>
          <select onchange="updateOrderStatus('${order.id}', this.value)" style="font-size:12px;padding:4px 8px;border-radius:6px;border:1px solid var(--neutral-300);background:white;cursor:pointer">
            <option value="pending" ${order.status==='pending'?'selected':''}>Pending</option>
            <option value="processing" ${order.status==='processing'?'selected':''}>Diproses</option>
            <option value="delivery" ${order.status==='delivery'?'selected':''}>Dikirim</option>
            <option value="completed" ${order.status==='completed'?'selected':''}>Selesai</option>
            <option value="cancelled" ${order.status==='cancelled'?'selected':''}>Batal</option>
          </select>
        </td>
      </tr>
    `;
  }).join('');
}

function updateOrderStatus(orderId, status) {
  const order = MOCK_ORDERS.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    showToast('Status pesanan #' + orderId + ' diperbarui!', 'success');
    renderAdminOrders();
  }
}

function renderAdminSuppliers() {
  const tbody = document.getElementById('admin-suppliers-tbody');
  if (!tbody) return;
  tbody.innerHTML = SUPPLIERS.map(s => {
    const statusConfig = {
      pending:  { class: 'status-pending',   label: 'Pending' },
      approved: { class: 'status-completed', label: 'Approved' },
      rejected: { class: 'status-cancelled', label: 'Rejected' },
    }[s.status];
    return `
      <tr>
        <td>
          <div style="font-size:13px;font-weight:600">${s.name}</div>
          <div style="font-size:11px;color:var(--neutral-500)">${s.category}</div>
        </td>
        <td><span class="status-badge ${statusConfig.class}">${statusConfig.label}</span></td>
        <td style="font-size:12px">
          ${s.status === 'pending' ? `
            <div style="display:flex;gap:6px">
              <button onclick="updateSupplierStatus('${s.id}','approved')" style="padding:5px 12px;background:var(--primary);color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;font-weight:600">✓ Approve</button>
              <button onclick="promptReject('${s.id}')" style="padding:5px 12px;background:var(--error);color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;font-weight:600">✕ Reject</button>
            </div>` :
            `<button onclick="viewSupplierDetail('${s.id}')" style="padding:5px 12px;background:var(--neutral-100);border:1px solid var(--neutral-300);border-radius:6px;font-size:12px;cursor:pointer">Detail</button>`
          }
        </td>
      </tr>
    `;
  }).join('');
}

function updateSupplierStatus(supplierId, status, reason) {
  const supplier = SUPPLIERS.find(s => s.id === supplierId);
  if (supplier) {
    supplier.status = status;
    if (reason) supplier.reason = reason;
    showToast(`Mitra ${supplier.name} ${status === 'approved' ? 'disetujui' : 'ditolak'}!`, status === 'approved' ? 'success' : 'error');
    renderAdminSuppliers();
  }
}

function promptReject(supplierId) {
  const reason = prompt('Masukkan alasan penolakan:');
  if (reason) updateSupplierStatus(supplierId, 'rejected', reason);
}

function viewSupplierDetail(supplierId) {
  const s = SUPPLIERS.find(s => s.id === supplierId);
  if (!s) return;
  alert(`Mitra: ${s.name}\nKategori: ${s.category}\nHP: ${s.phone}\nAlamat: ${s.address}\nStatus: ${s.status}${s.reason ? '\nAlasan: ' + s.reason : ''}`);
}

// ─── Supplier Registration ───
function submitSupplierForm(e) {
  e.preventDefault();
  const name = document.getElementById('supplier-name').value;
  const phone = document.getElementById('supplier-phone').value;
  const address = document.getElementById('supplier-address').value;
  const category = document.getElementById('supplier-category').value;
  if (!name || !phone || !address || !category) {
    showToast('Lengkapi semua data terlebih dahulu', 'error');
    return;
  }
  const newSupplier = {
    id: 'S' + String(SUPPLIERS.length + 1).padStart(3, '0'),
    name, phone, address, category, status: 'pending',
    date: new Date().toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })
  };
  SUPPLIERS.unshift(newSupplier);
  showToast('Pendaftaran mitra berhasil! Sedang dalam proses verifikasi 📋', 'success', 4000);
  e.target.reset();
  setTimeout(() => navigateTo('home'), 1500);
}

// ─── PWA Install ───
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Only show banner if user hasn't dismissed it this session
  setTimeout(() => {
    if (!sessionStorage.getItem('mlj_banner_dismissed')) {
      document.getElementById('install-banner')?.classList.add('show');
    }
  }, 3000);
});

function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choice => {
      if (choice.outcome === 'accepted') showToast('Mlijoan berhasil diinstall! 🎉', 'success');
      deferredPrompt = null;
      document.getElementById('install-banner')?.classList.remove('show');
    });
  }
}

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const loader = document.getElementById('app-loader');
    if (loader) loader.classList.add('hidden');
  }, 1500);

  initBannerCarousel();
  renderProductGrid();
  updateCartBadge();

  // Greeting: pull from localStorage if user is logged in
  const greet = document.getElementById('user-greeting');
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Selamat Pagi' : hour < 17 ? 'Selamat Siang' : 'Selamat Malam';
  const savedUser = JSON.parse(localStorage.getItem('mlj_user') || 'null');
  const displayName = savedUser?.name || AppState.user.name;
  if (greet) greet.textContent = greeting + ', ' + displayName.split(' ')[0] + '! 👋';
  // Update AppState with real user data
  if (savedUser) AppState.user = { ...AppState.user, ...savedUser };

  // ── Hash-based redirect after auth login ──
  // When auth.html redirects to index.html#cart, open that page automatically
  const _hash = location.hash.replace('#', '').trim();
  const _authPages = ['cart', 'orders', 'favorite', 'account'];
  if (_hash && _authPages.includes(_hash)) {
    if (savedUser) {
      // Small delay to let app render first
      setTimeout(() => navigateTo(_hash), 100);
    }
    // Clean hash from URL without reloading
    history.replaceState(null, '', location.pathname);
  }

  // Search
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(function() {
      const q = this.value.toLowerCase().trim();
      if (!q) { renderProductGrid(); return; }
      const grid = document.getElementById('products-grid');
      const filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
      grid.innerHTML = filtered.length ? filtered.map(p => productCardHTML(p)).join('') :
        `<div class="empty-state" style="grid-column:span 2"><div class="empty-icon">🔍</div><div class="empty-title">Tidak ditemukan</div><div class="empty-desc">Coba kata kunci lain</div></div>`;
    }, 300));
  }
});

function debounce(fn, delay) {
  let t;
  return function(...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), delay);
  };
}

function placeOrder() {
  if (!AppState.deliveryAddress) {
    showToast('Silakan atur alamat pengiriman terlebih dahulu', 'error');
    return;
  }
  if (!AppState.selectedPayment) {
    showToast('Pilih metode pembayaran terlebih dahulu', 'error');
    return;
  }
  const orderId = generateOrderId();
  const total = cartTotal() + AppState.deliveryFee;
  const newOrder = {
    id: orderId,
    date: new Date().toLocaleDateString('id-ID'),
    scheduled: new Date(Date.now() + 86400000).toLocaleDateString('id-ID') + ', 09:00',
    status: 'pending',
    total,
    items: [...AppState.cart],
    img: AppState.cart[0]?.img || 'images/sembako.png',
  };
  MOCK_ORDERS.unshift(newOrder);
  AppState.cart = [];
  AppState.appliedPromo = null;
  AppState.deliveryAddress = null;
  AppState.deliveryFee = 0;
  updateCartBadge();
  showToast('Pesanan #' + orderId + ' berhasil dibuat! 🎉', 'success', 4000);
  navigateTo('orders');
}

// ═══════════════════════════════════════════════════
// REALTIME DELIVERY TRACKING
// ═══════════════════════════════════════════════════

let etaInterval = null;
let trackingInterval = null;
let courierProgress = 0; // 0..100

function startEtaCountdown() {
  clearInterval(etaInterval);
  let etaSecs = 15 * 60; // 15 minutes
  const etaEl = () => document.getElementById('courier-eta-text');
  etaInterval = setInterval(() => {
    etaSecs = Math.max(0, etaSecs - 5);
    const m = Math.floor(etaSecs / 60);
    const s = etaSecs % 60;
    const el = etaEl();
    if (el) el.innerHTML = `Estimasi tiba: <strong style="color:var(--primary)">~${m}m ${s}s</strong>`;
    if (etaSecs === 0) clearInterval(etaInterval);
  }, 5000);
}

function openTrackingView(orderId) {
  const order = MOCK_ORDERS.find(o => o.id === orderId);
  if (!order) return;

  // Build tracking overlay
  let overlay = document.getElementById('tracking-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'tracking-overlay';
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <style>
      #tracking-overlay {
        position:fixed;inset:0;z-index:9999;
        background:#f0fdf4;
        display:flex;flex-direction:column;
        font-family:'Plus Jakarta Sans',-apple-system,sans-serif;
        animation:slideUpFull .3s ease;
      }
      @keyframes slideUpFull{from{transform:translateY(100%)}to{transform:translateY(0)}}
      @keyframes pulseDot{0%,100%{box-shadow:0 0 0 0 rgba(30,158,78,.4)}50%{box-shadow:0 0 0 8px rgba(30,158,78,0)}}
      @keyframes moveCourier{
        0%  {left:8%}
        25% {left:30%}
        50% {left:55%}
        75% {left:72%}
        100%{left:82%}
      }
      @keyframes routePulse{0%,100%{opacity:1}50%{opacity:.5}}
      .trk-header{
        background:var(--primary);
        padding:14px 20px;
        display:flex;align-items:center;gap:12px;
        color:white;
      }
      .trk-back{background:rgba(255,255,255,.2);border:none;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:white;font-size:18px;flex-shrink:0}
      .trk-map{
        flex:1;
        background:linear-gradient(160deg,#e8f5e9 0%,#f1f8e9 40%,#e3f2fd 100%);
        position:relative;
        overflow:hidden;
        min-height:0;
      }
      /* Road */
      .trk-road{
        position:absolute;
        top:48%;left:5%;right:5%;height:12px;
        background:#cfd8dc;
        border-radius:6px;
        transform:translateY(-50%);
      }
      .trk-road-line{
        position:absolute;
        top:48%;left:5%;right:5%;height:2px;
        background:white;
        transform:translateY(-50%);
        z-index:1;
        background:repeating-linear-gradient(90deg,white 0,white 18px,transparent 18px,transparent 32px);
      }
      /* Route highlight */
      .trk-route{
        position:absolute;
        top:48%;left:5%;height:12px;
        background:var(--primary);
        border-radius:6px 0 0 6px;
        transform:translateY(-50%);
        transition:width 0.8s ease;
        z-index:2;
      }
      /* Courier icon */
      .trk-courier{
        position:absolute;
        top:calc(48% - 22px);
        transform:translateX(-50%);
        font-size:32px;
        z-index:5;
        transition:left 0.8s cubic-bezier(.25,.8,.25,1);
        filter:drop-shadow(0 4px 8px rgba(0,0,0,.2));
      }
      /* Origin / Dest markers */
      .trk-marker{
        position:absolute;
        top:calc(48% - 28px);
        display:flex;flex-direction:column;align-items:center;
        z-index:4;
      }
      .trk-marker-icon{
        width:36px;height:36px;border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        font-size:18px;
        box-shadow:0 4px 12px rgba(0,0,0,.15);
      }
      .trk-marker-label{
        font-size:9px;font-weight:700;
        background:white;
        padding:2px 6px;border-radius:10px;
        box-shadow:0 1px 4px rgba(0,0,0,.1);
        margin-top:4px;
        white-space:nowrap;
      }
      /* Buildings decoration */
      .trk-bldg{position:absolute;bottom:30%;font-size:28px;opacity:.45;}
      .trk-tree{position:absolute;font-size:22px;opacity:.5;}
      /* Info panel */
      .trk-info{
        background:white;
        border-radius:24px 24px 0 0;
        padding:20px 20px 0;
        box-shadow:0 -6px 24px rgba(0,0,0,.10);
      }
      .trk-courier-card{
        display:flex;align-items:center;gap:14px;
        padding:14px;
        background:#f0fdf4;
        border:1.5px solid #a7f3d0;
        border-radius:var(--radius-lg);
        margin-bottom:16px;
      }
      .trk-courier-avatar{
        width:48px;height:48px;border-radius:50%;
        background:linear-gradient(135deg,var(--primary),#2ecc70);
        display:flex;align-items:center;justify-content:center;
        font-size:22px;color:white;flex-shrink:0;
      }
      .trk-progress-bar{
        background:#e5e7eb;border-radius:6px;height:8px;
        overflow:hidden;margin:10px 0;
      }
      .trk-progress-fill{
        height:100%;background:var(--primary);border-radius:6px;
        transition:width .8s ease;
      }
      .trk-steps-mini{
        display:flex;justify-content:space-between;
        margin-bottom:16px;
      }
      .trk-step-mini{
        display:flex;flex-direction:column;align-items:center;gap:4px;
        font-size:10px;font-weight:600;color:var(--neutral-400);
        flex:1;
      }
      .trk-step-mini.done{color:var(--primary);}
      .trk-step-mini-dot{
        width:10px;height:10px;border-radius:50%;
        background:var(--neutral-200);
      }
      .trk-step-mini.done .trk-step-mini-dot{background:var(--primary);}
      .trk-step-mini.active .trk-step-mini-dot{background:var(--primary);animation:pulseDot 1.2s ease-in-out infinite;}
      .trk-step-mini.active{color:var(--primary);}
    </style>

    <!-- Header -->
    <div class="trk-header">
      <button class="trk-back" onclick="closeTrackingView()">←</button>
      <div style="flex:1">
        <div style="font-size:15px;font-weight:800">Lacak Pesanan #${order.id}</div>
        <div style="font-size:12px;opacity:.8">Realtime • Diperbarui setiap 5 detik</div>
      </div>
      <div style="font-size:11px;background:rgba(255,255,255,.2);padding:5px 10px;border-radius:20px;animation:routePulse 2s ease-in-out infinite">🔴 LIVE</div>
    </div>

    <!-- Map Area -->
    <div class="trk-map" id="trk-map">
      <!-- Road -->
      <div class="trk-road"></div>
      <div class="trk-road-line"></div>
      <!-- Route fill -->
      <div class="trk-route" id="trk-route" style="width:0%"></div>

      <!-- Decorations -->
      <div class="trk-tree" style="top:20%;left:15%">🌳</div>
      <div class="trk-tree" style="top:60%;left:38%">🌿</div>
      <div class="trk-tree" style="top:18%;left:62%">🌳</div>
      <div class="trk-tree" style="top:65%;left:78%">🌿</div>
      <div class="trk-bldg" style="left:20%">🏘️</div>
      <div class="trk-bldg" style="left:45%">🏪</div>
      <div class="trk-bldg" style="left:68%">🏠</div>

      <!-- Origin marker -->
      <div class="trk-marker" style="left:7%">
        <div class="trk-marker-icon" style="background:#1E9E4E;color:white">🏪</div>
        <div class="trk-marker-label" style="color:var(--primary)">Toko Mlijoan</div>
      </div>

      <!-- Courier -->
      <div class="trk-courier" id="trk-courier" style="left:8%">🛵</div>

      <!-- Destination marker -->
      <div class="trk-marker" style="left:88%;transform:translateX(-50%)">
        <div class="trk-marker-icon" style="background:#EF4444;color:white">🏠</div>
        <div class="trk-marker-label" style="color:#EF4444">Rumah Anda</div>
      </div>

      <!-- ETA chip -->
      <div id="trk-eta-chip" style="position:absolute;top:16px;left:50%;transform:translateX(-50%);
        background:white;padding:8px 16px;border-radius:20px;
        box-shadow:0 4px 16px rgba(0,0,0,.12);
        font-size:13px;font-weight:700;color:var(--primary);
        display:flex;align-items:center;gap:6px;white-space:nowrap">
        ⏱ Tiba dalam <span id="trk-eta-val" style="color:#f97316">~15 menit</span>
      </div>
    </div>

    <!-- Info Panel -->
    <div class="trk-info">
      <!-- Mini steps -->
      <div class="trk-steps-mini">
        <div class="trk-step-mini done"><div class="trk-step-mini-dot"></div>Dikemas</div>
        <div class="trk-step-mini done"><div class="trk-step-mini-dot"></div>Diambil</div>
        <div class="trk-step-mini active" id="trk-step-otw"><div class="trk-step-mini-dot"></div>Dalam Jalan</div>
        <div class="trk-step-mini" id="trk-step-near"><div class="trk-step-mini-dot"></div>Hampir Tiba</div>
        <div class="trk-step-mini" id="trk-step-done"><div class="trk-step-mini-dot"></div>Selesai</div>
      </div>

      <!-- Progress bar -->
      <div class="trk-progress-bar">
        <div class="trk-progress-fill" id="trk-prog-fill" style="width:0%"></div>
      </div>

      <!-- Courier card -->
      <div class="trk-courier-card">
        <div class="trk-courier-avatar">👨</div>
        <div style="flex:1">
          <div style="font-size:14px;font-weight:800;color:#065f46">Budi Kurniawan</div>
          <div style="font-size:12px;color:#059669">Kurir Mlijoan • Motor Nopol B 2345 RCK</div>
          <div id="trk-status-text" style="font-size:11px;color:#6b7280;margin-top:3px">Sedang menuju lokasi Anda...</div>
        </div>
        <a href="tel:081298765432" style="background:var(--primary);color:white;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;text-decoration:none">📞</a>
      </div>

      <!-- Confirm received button -->
      <button id="trk-confirm-btn" onclick="confirmOrderReceived('${order.id}')" style="width:100%;padding:14px;background:var(--primary);color:white;border:none;border-radius:var(--radius-lg);font-size:15px;font-weight:700;cursor:pointer;margin-bottom:16px;display:flex;align-items:center;justify-content:center;gap:8px;font-family:inherit;opacity:.5;pointer-events:none">
        ✅ Pesanan Sudah Diterima
      </button>
    </div>
  `;

  // Start animation
  courierProgress = 0;
  animateCourier(orderId);
}

function animateCourier(orderId) {
  clearInterval(trackingInterval);
  courierProgress = 0;

  const totalSteps = 100;
  const stepMs = 800; // advance every 0.8s

  trackingInterval = setInterval(() => {
    courierProgress = Math.min(courierProgress + 1, totalSteps);
    const pct = courierProgress; // 0..100

    // Move courier icon: from 8% to 82% (left of destination)
    const leftPct = 8 + (pct / 100) * 74; // 8 → 82
    const courier = document.getElementById('trk-courier');
    if (!courier) { clearInterval(trackingInterval); return; }
    courier.style.left = leftPct + '%';

    // Route fill (same range, but on road element which is 5% → 88%)
    const routeEl = document.getElementById('trk-route');
    if (routeEl) routeEl.style.width = (pct * 0.83) + '%'; // fills across road

    // Progress bar
    const progEl = document.getElementById('trk-prog-fill');
    if (progEl) progEl.style.width = pct + '%';

    // ETA update
    const etaEl = document.getElementById('trk-eta-val');
    const remaining = Math.ceil((100 - pct) * 0.15); // minutes
    if (etaEl) etaEl.textContent = remaining > 0 ? `~${remaining} menit` : 'Hampir tiba!';

    // Step milestones
    if (pct >= 55) {
      const nearEl = document.getElementById('trk-step-near');
      const otwEl  = document.getElementById('trk-step-otw');
      if (nearEl) { nearEl.classList.add('active'); nearEl.classList.remove('done'); }
      if (otwEl)  { otwEl.classList.add('done');    otwEl.classList.remove('active'); }
    }
    if (pct >= 80) {
      const statusEl = document.getElementById('trk-status-text');
      if (statusEl) statusEl.textContent = 'Hampir tiba di lokasi Anda! 🎉';
    }
    if (pct >= 100) {
      clearInterval(trackingInterval);
      // Change courier to arrived
      if (courier) courier.textContent = '🏠';
      const nearEl = document.getElementById('trk-step-near');
      const doneEl = document.getElementById('trk-step-done');
      if (nearEl) { nearEl.classList.add('done'); nearEl.classList.remove('active'); }
      if (doneEl) { doneEl.classList.add('active'); }
      const etaChip = document.getElementById('trk-eta-chip');
      if (etaChip) etaChip.innerHTML = '✅ Kurir sudah tiba!';
      const statusEl = document.getElementById('trk-status-text');
      if (statusEl) statusEl.textContent = 'Kurir sudah tiba! Silakan terima pesanan Anda.';
      // Enable confirm button
      const btn = document.getElementById('trk-confirm-btn');
      if (btn) {
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
        btn.style.background = 'linear-gradient(135deg,#059669,#1E9E4E)';
        btn.style.animation = 'pulseDot 1.5s ease-in-out infinite';
      }
    }
  }, stepMs);
}

function closeTrackingView() {
  clearInterval(trackingInterval);
  clearInterval(etaInterval);
  const overlay = document.getElementById('tracking-overlay');
  if (overlay) overlay.remove();
}

// ═══════════════════════════════════════════════════
// CONFIRM ORDER RECEIVED
// ═══════════════════════════════════════════════════
function confirmOrderReceived(orderId) {
  const order = MOCK_ORDERS.find(o => o.id === orderId);
  if (!order) return;

  // Close tracking if open
  closeTrackingView();
  closeModal('order-detail-modal-overlay');

  order.status = 'completed';
  order.completedAt = new Date().toLocaleDateString('id-ID', {day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'});

  showToast('🎉 Pesanan berhasil diterima! Silakan beri ulasan.', 'success', 4000);

  // Refresh orders page then open rating
  renderOrders();
  setTimeout(() => openRatingModal(orderId), 800);
}

// ═══════════════════════════════════════════════════
// RATING MODAL
// ═══════════════════════════════════════════════════
let _ratingOrderId  = null;
let _ratingSelected = 0;

function openRatingModal(orderId) {
  _ratingOrderId  = orderId;
  _ratingSelected = 5;

  const order = MOCK_ORDERS.find(o => o.id === orderId);
  if (!order) return;

  let modal = document.getElementById('rating-modal-overlay');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'rating-modal-overlay';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:flex-end;z-index:9000';
    modal.onclick = e => { if(e.target===modal) closeRatingModal(); };
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <style>
      @keyframes starPop{0%{transform:scale(1)}40%{transform:scale(1.35)}100%{transform:scale(1)}}
      .star-btn{font-size:36px;cursor:pointer;transition:transform .15s;border:none;background:none;padding:2px 6px;}
      .star-btn.lit{animation:starPop .2s ease;}
      .rating-sheet{
        background:white;border-radius:24px 24px 0 0;
        width:100%;padding:24px 24px 40px;
        animation:slideUp .3s ease;
      }
      @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
      .rating-tag{
        display:inline-block;padding:7px 14px;
        border-radius:20px;border:1.5px solid #e5e7eb;
        font-size:12px;font-weight:600;color:#6b7280;
        cursor:pointer;transition:all .15s;
        background:white;
      }
      .rating-tag.active{background:var(--primary);color:white;border-color:var(--primary);}
    </style>
    <div class="rating-sheet">
      <div style="text-align:center;margin-bottom:20px">
        <div style="font-size:48px;margin-bottom:8px">⭐</div>
        <div style="font-size:18px;font-weight:800;color:#111827">Bagaimana pengalaman Anda?</div>
        <div style="font-size:13px;color:#6b7280;margin-top:4px">Pesanan #${order.id} · ${order.items[0]?.name || 'Produk'}</div>
      </div>

      <!-- Star rating -->
      <div style="display:flex;justify-content:center;gap:4px;margin-bottom:12px" id="star-row">
        ${[1,2,3,4,5].map(i => `
          <button class="star-btn" id="star-${i}" onclick="selectStar(${i})">${i <= _ratingSelected ? '⭐' : '☆'}</button>
        `).join('')}
      </div>
      <div id="rating-label" style="text-align:center;font-size:14px;font-weight:700;color:var(--primary);margin-bottom:20px">Sangat Puas 🎉</div>

      <!-- Quick tags -->
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:16px" id="rating-tags">
        <button class="rating-tag active" onclick="toggleTag(this)">🌿 Produk Segar</button>
        <button class="rating-tag active" onclick="toggleTag(this)">⚡ Pengiriman Cepat</button>
        <button class="rating-tag"        onclick="toggleTag(this)">📦 Kemasan Rapi</button>
        <button class="rating-tag"        onclick="toggleTag(this)">💰 Harga Terjangkau</button>
        <button class="rating-tag"        onclick="toggleTag(this)">😊 Kurir Ramah</button>
        <button class="rating-tag"        onclick="toggleTag(this)">🔄 Akan Pesan Lagi</button>
      </div>

      <!-- Review text -->
      <textarea id="rating-review-text"
        style="width:100%;padding:12px 14px;border:1.5px solid #e5e7eb;border-radius:12px;
               font-size:13px;font-family:inherit;resize:none;min-height:80px;
               outline:none;line-height:1.6;color:#374151;"
        placeholder="Ceritakan pengalaman belanja Anda... (opsional)"
        onfocus="this.style.borderColor='var(--primary)'"
        onblur="this.style.borderColor='#e5e7eb'"
      ></textarea>

      <!-- Submit -->
      <button onclick="submitRating()" style="width:100%;margin-top:14px;padding:14px;
        background:linear-gradient(135deg,#f59e0b,#f97316);color:white;
        border:none;border-radius:14px;font-size:15px;font-weight:700;
        cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px">
        ⭐ Kirim Ulasan
      </button>
      <button onclick="closeRatingModal()" style="width:100%;margin-top:10px;padding:11px;
        background:#f3f4f6;color:#6b7280;border:none;border-radius:14px;
        font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">
        Lewati
      </button>
    </div>
  `;

  modal.style.display = 'flex';
  // init stars
  updateStarDisplay(5);
}

function selectStar(n) {
  _ratingSelected = n;
  updateStarDisplay(n);
}

function updateStarDisplay(n) {
  [1,2,3,4,5].forEach(i => {
    const btn = document.getElementById('star-'+i);
    if (btn) {
      btn.textContent = i <= n ? '⭐' : '☆';
      if (i === n) btn.classList.add('lit');
    }
  });
  const labels = {1:'Sangat Kecewa 😞',2:'Kurang Memuaskan 😕',3:'Cukup 😐',4:'Bagus 👍',5:'Sangat Puas 🎉'};
  const lbl = document.getElementById('rating-label');
  if (lbl) lbl.textContent = labels[n] || '';
}

function toggleTag(el) {
  el.classList.toggle('active');
}

function submitRating() {
  const order = MOCK_ORDERS.find(o => o.id === _ratingOrderId);
  if (!order) return;

  order.rating = _ratingSelected;
  order.review = document.getElementById('rating-review-text')?.value.trim() || '';

  // Collect active tags
  const tags = [...document.querySelectorAll('#rating-tags .rating-tag.active')].map(t => t.textContent.trim());
  if (tags.length) order.reviewTags = tags;

  closeRatingModal();
  showToast(`⭐ Ulasan berhasil dikirim! Terima kasih, ${order.rating} bintang!`, 'success', 3000);
  renderOrders();
}

function closeRatingModal() {
  const m = document.getElementById('rating-modal-overlay');
  if (m) m.style.display = 'none';
}

// ═══════════════════════════════════════════════════
// ADD TO CART BOTTOM SHEET (Quantity + Notes)
// ═══════════════════════════════════════════════════
let _atcProductId = null;
let _atcQty       = 1;

function openAddToCartSheet(productId) {
  _atcProductId = productId;
  _atcQty       = 1;
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  let sheet = document.getElementById('atc-sheet-overlay');
  if (!sheet) {
    sheet = document.createElement('div');
    sheet.id = 'atc-sheet-overlay';
    sheet.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:flex-end;z-index:8000;backdrop-filter:blur(2px)';
    sheet.onclick = e => { if (e.target === sheet) closeAtcSheet(); };
    document.body.appendChild(sheet);
  }

  sheet.innerHTML = `
    <style>
      .atc-sheet {
        background: white;
        border-radius: 24px 24px 0 0;
        width: 100%;
        padding: 0 0 32px;
        animation: slideUpSheet .3s cubic-bezier(.32,1.2,.6,1);
        max-height: 90vh;
        overflow-y: auto;
      }
      @keyframes slideUpSheet { from{transform:translateY(100%)} to{transform:translateY(0)} }
      .atc-handle { width:40px;height:4px;background:#e5e7eb;border-radius:2px;margin:14px auto 0; }
      .atc-qty-btn {
        width: 38px; height: 38px;
        border-radius: 50%;
        border: 2px solid var(--primary);
        background: white;
        color: var(--primary);
        font-size: 20px;
        font-weight: 700;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
        transition: all .15s;
        flex-shrink: 0;
      }
      .atc-qty-btn:hover { background: var(--primary); color: white; }
      .atc-qty-btn:disabled { border-color:#e5e7eb;color:#d1d5db;cursor:not-allowed; }
      .atc-qty-btn:disabled:hover { background:white; }
      .atc-note-input {
        width: 100%;
        padding: 11px 14px;
        border: 1.5px solid #e5e7eb;
        border-radius: 12px;
        font-size: 13px;
        font-family: inherit;
        resize: none;
        outline: none;
        color: #374151;
        line-height: 1.6;
        background: #fafafa;
        min-height: 70px;
      }
      .atc-note-input:focus { border-color: var(--primary); background: white; }
      .atc-confirm-btn {
        width: 100%;
        padding: 14px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 14px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        font-family: inherit;
        display: flex; align-items: center; justify-content: center; gap: 8px;
        transition: background .15s;
      }
      .atc-confirm-btn:hover { background: var(--primary-dark,#166B36); }
    </style>
    <div class="atc-sheet">
      <div class="atc-handle"></div>

      <!-- Product header -->
      <div style="display:flex;align-items:center;gap:14px;padding:18px 20px 0">
        <img src="${product.img}" alt="${product.name}"
          style="width:70px;height:70px;border-radius:14px;object-fit:cover;flex-shrink:0;border:1.5px solid #f3f4f6">
        <div style="flex:1;min-width:0">
          <div style="font-size:15px;font-weight:800;color:#111827;margin-bottom:3px">${product.name}</div>
          <div style="font-size:12px;color:#6b7280">${product.weight} · Stok: ${product.stock}</div>
          <div style="font-size:17px;font-weight:800;color:var(--primary);margin-top:4px">${formatRupiah(product.price)}<span style="font-size:11px;font-weight:500;color:#9ca3af"> /${product.unit||'item'}</span></div>
        </div>
      </div>

      <div style="height:1px;background:#f3f4f6;margin:16px 0"></div>

      <!-- Quantity selector -->
      <div style="padding:0 20px">
        <div style="font-size:13px;font-weight:700;color:#374151;margin-bottom:12px">Jumlah</div>
        <div style="display:flex;align-items:center;justify-content:space-between;background:#f9fafb;border-radius:14px;padding:12px 16px">
          <button class="atc-qty-btn" id="atc-minus" onclick="atcChangeQty(-1)" ${_atcQty<=1?'disabled':''}>−</button>
          <div style="text-align:center">
            <div style="font-size:26px;font-weight:800;color:#111827;line-height:1" id="atc-qty-display">${_atcQty}</div>
            <div style="font-size:11px;color:#9ca3af;margin-top:2px" id="atc-subtotal-display">${formatRupiah(product.price * _atcQty)}</div>
          </div>
          <button class="atc-qty-btn" id="atc-plus" onclick="atcChangeQty(1)" ${_atcQty>=product.stock?'disabled':''}>+</button>
        </div>

        <!-- Quick qty chips -->
        <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
          ${[1,2,3,5,10].filter(n=>n<=product.stock).map(n=>`
            <button onclick="atcSetQty(${n})"
              style="padding:5px 14px;border-radius:20px;border:1.5px solid ${n===1?'var(--primary)':'#e5e7eb'};
                     background:${n===1?'var(--primary-50)':'white'};
                     font-size:12px;font-weight:700;cursor:pointer;color:${n===1?'var(--primary)':'#6b7280'};
                     transition:all .15s" id="atc-chip-${n}">${n}</button>
          `).join('')}
        </div>
      </div>

      <div style="height:1px;background:#f3f4f6;margin:16px 0"></div>

      <!-- Notes / Keterangan -->
      <div style="padding:0 20px">
        <div style="font-size:13px;font-weight:700;color:#374151;margin-bottom:8px">
          📝 Keterangan <span style="font-size:11px;font-weight:500;color:#9ca3af">(opsional)</span>
        </div>
        <textarea class="atc-note-input" id="atc-note"
          placeholder="Contoh: potong kecil-kecil, tanpa lemak, dipilihkan yang matang, dll..."></textarea>
        <div style="font-size:11px;color:#9ca3af;margin-top:4px">Keterangan akan diteruskan ke penjual</div>
      </div>

      <!-- Confirm button -->
      <div style="padding:16px 20px 0">
        <button class="atc-confirm-btn" onclick="confirmAddToCart()">
          🛒 Tambah ke Keranjang &nbsp;·&nbsp; <span id="atc-total-price">${formatRupiah(product.price)}</span>
        </button>
      </div>
    </div>
  `;

  sheet.style.display = 'flex';
}

function atcChangeQty(delta) {
  const product = PRODUCTS.find(p => p.id === _atcProductId);
  if (!product) return;
  _atcQty = Math.max(1, Math.min(_atcQty + delta, product.stock));
  _atcRefreshQtyDisplay(product);
}

function atcSetQty(n) {
  const product = PRODUCTS.find(p => p.id === _atcProductId);
  if (!product) return;
  _atcQty = Math.max(1, Math.min(n, product.stock));
  _atcRefreshQtyDisplay(product);
}

function _atcRefreshQtyDisplay(product) {
  const qtyEl      = document.getElementById('atc-qty-display');
  const subEl      = document.getElementById('atc-subtotal-display');
  const totalEl    = document.getElementById('atc-total-price');
  const minusBtn   = document.getElementById('atc-minus');
  const plusBtn    = document.getElementById('atc-plus');

  if (qtyEl)    qtyEl.textContent   = _atcQty;
  if (subEl)    subEl.textContent   = formatRupiah(product.price * _atcQty);
  if (totalEl)  totalEl.textContent = formatRupiah(product.price * _atcQty);
  if (minusBtn) minusBtn.disabled   = _atcQty <= 1;
  if (plusBtn)  plusBtn.disabled    = _atcQty >= product.stock;

  // Update chips highlight
  [1,2,3,5,10].forEach(n => {
    const chip = document.getElementById('atc-chip-'+n);
    if (!chip) return;
    const active = n === _atcQty;
    chip.style.borderColor  = active ? 'var(--primary)' : '#e5e7eb';
    chip.style.background   = active ? 'var(--primary-50)' : 'white';
    chip.style.color        = active ? 'var(--primary)' : '#6b7280';
  });
}

function confirmAddToCart() {
  const product = PRODUCTS.find(p => p.id === _atcProductId);
  if (!product) return;
  const note = document.getElementById('atc-note')?.value.trim() || '';

  // Check if already in cart
  const existing = AppState.cart.find(c => c.id === _atcProductId);
  if (existing) {
    existing.qty = Math.min(existing.qty + _atcQty, product.stock);
    if (note) existing.note = note; // update note if provided
  } else {
    AppState.cart.push({ ...product, qty: _atcQty, note });
  }

  updateCartBadge();
  closeAtcSheet();
  showToast(`✅ ${product.name} ×${_atcQty} ditambahkan ke keranjang!`, 'success', 2500);
}

function closeAtcSheet() {
  const sheet = document.getElementById('atc-sheet-overlay');
  if (sheet) sheet.style.display = 'none';
}
