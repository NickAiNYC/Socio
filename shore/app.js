/* Application Logic for Shore Flowers Promo Pack Dashboard */

// --- DATA STRUCTURES ---

const EMAIL_TEMPLATES = {
  welcome: {
    name: "Welcome & First Order Discount",
    subject: "Welcome to Shore Flowers 🌸 (10% Off First Order)",
    desc: "Send to new subscribers immediately after signing up via the website or popup.",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Shore Flowers</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #faf8f5; color: #0f0a0d; margin: 0; padding: 0; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e8e2e5; }
    .header { padding: 32px; text-align: center; border-bottom: 1px solid #faf8f5; background-color: #0f0a0d; color: #faf8f5; }
    .logo { height: 45px; }
    .hero-content { padding: 40px 32px; text-align: center; }
    .title { font-family: Georgia, serif; font-size: 28px; line-height: 1.2; margin-bottom: 16px; font-weight: normal; }
    .subtitle { color: #d4a0b8; font-style: italic; font-size: 16px; margin-bottom: 24px; }
    .body-text { font-size: 14px; line-height: 1.6; color: #4a4548; margin-bottom: 32px; text-align: left; }
    .promo-box { background-color: #fcf8fa; border: 1px dashed #e8b4c8; border-radius: 8px; padding: 24px; margin-bottom: 32px; text-align: center; }
    .promo-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #8a7f8a; }
    .promo-code { font-family: monospace; font-size: 24px; font-weight: bold; color: #0f0a0d; margin: 12px 0; letter-spacing: 2px; }
    .promo-btn { display: inline-block; background-color: #0f0a0d; color: #faf8f5; text-decoration: none; padding: 14px 28px; border-radius: 24px; font-size: 14px; font-weight: bold; letter-spacing: 0.5px; }
    .products-section { padding: 0 32px 40px; }
    .products-title { font-family: Georgia, serif; font-size: 20px; border-bottom: 1px solid #e8e2e5; padding-bottom: 12px; margin-bottom: 24px; text-align: center; }
    .product-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .product-card { border: 1px solid #e8e2e5; border-radius: 8px; overflow: hidden; background: #ffffff; text-decoration: none; color: inherit; }
    .product-img { height: 140px; background-color: #f0ebe8; }
    .product-img img { width: 100%; height: 100%; object-fit: cover; }
    .product-details { padding: 12px; }
    .product-name { font-family: Georgia, serif; font-weight: bold; font-size: 14px; margin-bottom: 4px; }
    .product-price { color: #d4a0b8; font-size: 13px; font-weight: bold; }
    .footer { background-color: #0a0608; color: #8a7f8a; padding: 32px; text-align: center; font-size: 12px; line-height: 1.6; }
    .footer a { color: #e8b4c8; text-decoration: none; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h2 style="margin: 0; font-family: Georgia, serif; font-size: 24px; font-weight: normal; letter-spacing: 1px;">SHORE FLOWERS</h2>
      <div style="font-size: 9px; letter-spacing: 2px; color: #e8b4c8; text-transform: uppercase; margin-top: 4px;">Brooklyn, NYC</div>
    </div>
    
    <div class="hero-content">
      <h1 class="title">Fresh Daily, Delivered Free</h1>
      <div class="subtitle">Hand-picked bouquets direct from the Coney Island boardwalk stand</div>
      <p class="body-text">
        Hello there,<br><br>
        Welcome to Shore Flowers! We believe in keeping flowers simple, fresh, and close to home. Every single bouquet is hand-arranged early in the morning by our partners near the Coney Island boardwalk, and delivered right to your door anywhere in Brooklyn within 90 minutes. Since we don't have fancy retail markup, you get premium-grade flowers for half the price.
      </p>
      
      <div class="promo-box">
        <div class="promo-label">Your First Order Discount</div>
        <div class="promo-code">WELCOME10</div>
        <div style="font-size: 12px; color: #8a7f8a; margin-bottom: 16px;">Take 10% off any bouquet in our signature collection today.</div>
        <a href="https://shoreflowers.com" class="promo-btn">Shop Fresh Collection</a>
      </div>
    </div>
    
    <div class="products-section">
      <div class="products-title">Today's Fresh Picks</div>
      <div class="product-grid">
        <div class="product-card">
          <div class="product-img"><img src="assets/image (1).jpg" alt="Boardwalk Rose"></div>
          <div class="product-details">
            <div class="product-name">The Boardwalk Rose</div>
            <div class="product-price">$45</div>
          </div>
        </div>
        <div class="product-card">
          <div class="product-img"><img src="assets/unnamed (3).jpg" alt="Coney Island Sunflowers"></div>
          <div class="product-details">
            <div class="product-name">Coney Island Sunflowers</div>
            <div class="product-price">$40</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>Shore Flowers Stand • 123 Brighton Beach Ave, Brooklyn, NY 11235</p>
      <p>Same-day delivery within 10 miles of 11224. Average transit time: 90 minutes.</p>
      <p style="margin-top: 16px;">You received this because you signed up on our website. <a href="#">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`
  },
  abandoned: {
    name: "Cart Abandonment Recovery",
    subject: "Still thinking about those flowers? 🌸",
    desc: "Trigger automatically 30-60 minutes after a visitor abandons the checkout form.",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Complete Your Order</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #faf8f5; color: #0f0a0d; margin: 0; padding: 0; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e8e2e5; }
    .header { padding: 32px; text-align: center; border-bottom: 1px solid #faf8f5; background-color: #0f0a0d; color: #faf8f5; }
    .hero-content { padding: 40px 32px; text-align: center; }
    .title { font-family: Georgia, serif; font-size: 26px; line-height: 1.2; margin-bottom: 16px; font-weight: normal; }
    .subtitle { color: #d4a0b8; font-style: italic; font-size: 15px; margin-bottom: 24px; }
    .body-text { font-size: 14px; line-height: 1.6; color: #4a4548; margin-bottom: 32px; text-align: center; }
    .cart-summary { background-color: #fcf8fa; border: 1px solid #e8b4c8; border-radius: 8px; padding: 20px; margin-bottom: 32px; display: flex; align-items: center; justify-content: space-between; text-align: left; }
    .cart-left { display: flex; align-items: center; gap: 16px; }
    .cart-img { width: 60px; height: 60px; border-radius: 4px; overflow: hidden; background-color: #f0ebe8; }
    .cart-img img { width: 100%; height: 100%; object-fit: cover; }
    .cart-name { font-family: Georgia, serif; font-weight: bold; font-size: 15px; }
    .cart-price { color: #8a7f8a; font-size: 13px; margin-top: 2px; }
    .cart-btn { background-color: #0f0a0d; color: #faf8f5; text-decoration: none; padding: 10px 20px; border-radius: 18px; font-size: 12px; font-weight: bold; white-space: nowrap; }
    .urgency-badge { background-color: rgba(232, 180, 200, 0.1); border: 1px solid #e8b4c8; color: #d4a0b8; display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
    .footer { background-color: #0a0608; color: #8a7f8a; padding: 32px; text-align: center; font-size: 12px; line-height: 1.6; }
    .footer a { color: #e8b4c8; text-decoration: none; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h2 style="margin: 0; font-family: Georgia, serif; font-size: 24px; font-weight: normal; letter-spacing: 1px;">SHORE FLOWERS</h2>
    </div>
    
    <div class="hero-content">
      <div class="urgency-badge">Freshness Guaranteed</div>
      <h1 class="title">Don't leave them behind...</h1>
      <div class="subtitle">We've saved your fresh bouquet at our stand</div>
      <p class="body-text">
        We noticed you left before finishing your order. Since we cut and compile our signature bouquets every morning, we have a limited daily stock. Don't worry, we've set yours aside for the next hour to make sure you get the absolute freshest buds.
      </p>
      
      <div class="cart-summary">
        <div class="cart-left">
          <div class="cart-img"><img src="assets/image (1).jpg" alt="Boardwalk Rose"></div>
          <div>
            <div class="cart-name">The Boardwalk Rose</div>
            <div class="cart-price">1x Bouquet — $45.00</div>
          </div>
        </div>
        <a href="https://shoreflowers.com/order" class="cart-btn">Rescue Bouquet</a>
      </div>
      
      <div style="font-size: 12px; color: #8a7f8a;">
        <strong>Need it fast?</strong> Complete your order now and our courier will have it at your door in under 90 minutes.
      </div>
    </div>
    
    <div class="footer">
      <p>Shore Flowers • 123 Brighton Beach Ave, Brooklyn, NY 11235</p>
      <p>Need support? Reply directly to this email or call (718) 555-0147</p>
    </div>
  </div>
</body>
</html>`
  },
  summer: {
    name: "Summer Sunflowers Campaign",
    subject: "Brighten your room with Coney Island Sunflowers 🌻",
    desc: "Mass broadcast marketing campaign to send during summer peak seasons (June - August).",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Summer Sunflowers Special</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #faf8f5; color: #0f0a0d; margin: 0; padding: 0; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e8e2e5; }
    .header { padding: 32px; text-align: center; border-bottom: 1px solid #faf8f5; background-color: #0f0a0d; color: #faf8f5; }
    .hero-img { height: 320px; background-color: #f5f0eb; position: relative; overflow: hidden; }
    .hero-img img { width: 100%; height: 100%; object-fit: cover; }
    .hero-content { padding: 40px 32px; text-align: center; }
    .title { font-family: Georgia, serif; font-size: 30px; line-height: 1.2; margin-bottom: 16px; font-weight: normal; }
    .subtitle { color: #d4a0b8; font-style: italic; font-size: 16px; margin-bottom: 24px; }
    .body-text { font-size: 14px; line-height: 1.6; color: #4a4548; margin-bottom: 32px; text-align: left; }
    .promo-btn { display: inline-block; background-color: #0f0a0d; color: #faf8f5; text-decoration: none; padding: 14px 32px; border-radius: 24px; font-size: 14px; font-weight: bold; letter-spacing: 0.5px; }
    .feature-row { display: flex; justify-content: space-around; margin: 40px 0 20px; border-top: 1px solid #e8e2e5; padding-top: 24px; }
    .feature-item { text-align: center; width: 30%; }
    .feature-icon { font-size: 24px; margin-bottom: 8px; }
    .feature-title { font-weight: bold; font-size: 13px; margin-bottom: 4px; }
    .feature-desc { font-size: 11px; color: #8a7f8a; }
    .footer { background-color: #0a0608; color: #8a7f8a; padding: 32px; text-align: center; font-size: 12px; line-height: 1.6; }
    .footer a { color: #e8b4c8; text-decoration: none; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h2 style="margin: 0; font-family: Georgia, serif; font-size: 24px; font-weight: normal; letter-spacing: 1px;">SHORE FLOWERS</h2>
    </div>
    
    <div class="hero-img">
      <img src="assets/unnamed (3).jpg" alt="Coney Island Sunflowers">
    </div>
    
    <div class="hero-content">
      <h1 class="title">Bring the Coney Island Sunshine Indoors</h1>
      <div class="subtitle">Fresh daily sunflowers cut and delivered in 90 minutes</div>
      <p class="body-text">
        Summer is here, and the Coney Island boardwalk is glowing. Bring that same bright energy into your Brooklyn apartment with our signature <strong>Coney Island Sunflowers</strong>. 
        <br><br>
        We source our sunflowers fresh from local flower stands, pairing six massive, glowing heads with fresh, aromatic eucalyptus leaves. They aren't just beautiful—they are incredibly long-lasting and guaranteed to fill any room with instant warmth.
      </p>
      
      <a href="https://shoreflowers.com" class="promo-btn">Order Sunflowers — $40</a>
      
      <div class="feature-row">
        <div class="feature-item">
          <div class="feature-icon">🌻</div>
          <div class="feature-title">Fresh Daily</div>
          <div class="feature-desc">Assembled morning of delivery</div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">⚡</div>
          <div class="feature-title">90-Min Transit</div>
          <div class="feature-desc">Fastest delivery in Brooklyn</div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🏷️</div>
          <div class="feature-title">No Markup</div>
          <div class="feature-desc">Direct partnership pricing</div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>Shore Flowers Stand • 123 Brighton Beach Ave, Brooklyn, NY 11235</p>
      <p>Delivering daily from 9:00 AM to 8:00 PM across South Brooklyn. <a href="#">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`
  }
};

const COPY_BANK = {
  instagram: [
    { text: "Freshly cut, hand-arranged, and delivered to your Brooklyn door in under 90 minutes. 🌸 No retail markups, just pure boardwalk summer vibes.", label: "Primary Caption", desc: "Use for general product showcase posts." },
    { text: "Brought directly from our partner stand near the Coney Island boardwalk. 🌊 Keeping it local, fresh, and beautiful every single day.", label: "Local Origin Focus", desc: "Emphasize local Brooklyn roots." },
    { text: "Forgot an anniversary? Birthday? Or just because? ⚡ Order now, and we'll deliver a signature fresh bouquet within 90 minutes anywhere in South Brooklyn.", label: "Urgency / Delivery", desc: "Highlight fast same-day delivery." },
    { text: "Sunflowers and ocean breezes. 🌻 Bring the warmth of Coney Island into your apartment with our seasonal signature collection.", label: "Product Caption (Sunflowers)", desc: "Tailored specifically for Sunflowers." }
  ],
  metaAds: [
    { text: "Fresh Brooklyn Flower Delivery — Arranged Daily", label: "Headline Option A", desc: "Best for Google search or Meta feeds." },
    { text: "Flowers Delivered in 90 Minutes (Brooklyn, NYC)", label: "Headline Option B", desc: "Direct, benefit-oriented statement." },
    { text: "No Florist Markups. Fresh Daily from Coney Island.", label: "Headline Option C", desc: "Value-focused, competitive positioning." },
    { text: "Get beautiful, hand-tied bouquets delivered from our Coney Island stand to your door in 90 minutes. Same-day delivery across South Brooklyn. Order roses, sunflowers, and custom mixed arrangements fresh daily.", label: "Primary Ad Body Text", desc: "Detailed, benefits-first description." },
    { text: "High-quality arrangements at half the price of traditional florists. Cut and hand-arranged this morning. Order for yourself or send a quick gift today.", label: "Ad Body Text (Value Focus)", desc: "Highlighting pricing advantage." }
  ],
  whatsapp: [
    { text: "Hey! 🌸 Fresh bouquets just arrived at our stand near the Coney Island boardwalk. If you want to brighten up your apartment today, I can have a courier drop off one of our signature arrangements (roses, sunflowers, or mixed) at your door in under 90 mins. Delivery is free today! Let me know if you want to lock in a bouquet before today's stock sells out.", label: "Broadcast Broadcast Template", desc: "Send to warm leads or past clients." },
    { text: "Hi [Name]! Just a heads up, today's batch of Coney Island Sunflowers 🌻 are exceptionally bright. We only have 5 bundles left for same-day delivery. Let me know if you'd like me to grab one for you! I can send it right over.", label: "Direct Customer Follow-up", desc: "High-conversion personalized message." }
  ],
  sms: [
    { text: "Shore Flowers: Forgot a gift? 🌸 Order a signature bouquet by 6pm and get same-day delivery in under 90 mins anywhere in Brooklyn: shoreflowers.com", label: "Promo / Alert SMS", desc: "Kept under 160 characters." },
    { text: "Shore Flowers: Your order is on the way! ⚡ Track your delivery live: shoreflowers.com/track?id=[OrderID]", label: "Transactional / Out-for-delivery", desc: "Sent when courier departs." }
  ]
};

const PRESETS = {
  boardwalk: {
    name: "Boardwalk Rose Anniversary",
    headline: "The Boardwalk Rose — One Dozen Premium Roses",
    body: "Freshly cut premium long-stem roses hand-tied with eucalyptus accents. Available in red, blush pink, white, or mixed. Arranged this morning near the Coney Island boardwalk and delivered directly to your door in 90 minutes. Perfect for anniversaries, birthdays, or making someone's day special.",
    btnText: "Order Roses ($45)",
    discount: "10% OFF",
    code: "ROSE10",
    image: "assets/image (1).jpg",
    accent: "#e8b4c8",
    accentAlt: "#7eb8d8"
  },
  sunflowers: {
    name: "Coney Island Sunflowers Special",
    headline: "Coney Island Sunflowers — Summer Freshness",
    body: "Bring the sunshine inside! Six massive, glowing sunflowers paired with fresh baby eucalyptus. Cut this morning at our partner stand and delivered anywhere in South Brooklyn within 90 minutes. Incredible longevity, no retail florist markup, and guaranteed to brighten up any apartment room.",
    btnText: "Shop Sunflowers ($40)",
    discount: "FREE VASE",
    code: "SUNVASE",
    image: "assets/unnamed (3).jpg",
    accent: "#f4c55a",
    accentAlt: "#e8b4c8"
  },
  sameday: {
    name: "90-Min Same-Day Delivery",
    headline: "Same-Day Fresh Flowers Delivered in 90 Mins",
    body: "Left a gift to the last minute? We've got you covered. Get hand-arranged bouquets delivered to your door in under 90 minutes. Sourced from our local stand near Coney Island with zero florist markup. Same-day delivery available across Brighton Beach, Sea Gate, Bay Ridge, and Sheepshead Bay.",
    btnText: "Send Bouquet Today",
    discount: "90 MINS",
    code: "FASTDELIVERY",
    image: "assets/unnamed (2).jpg",
    accent: "#7eb8d8",
    accentAlt: "#e8b4c8"
  },
  welcome: {
    name: "10% Off Welcome Promotion",
    headline: "Welcome to Shore Flowers — Take 10% Off",
    body: "Fresh from the boardwalk to your Brooklyn apartment. No retail florist markups, no week-old display cases. Hand-tied bouquets compiled the morning of delivery and couriered to your door in under 90 minutes. Sign up today and get 10% off your very first order of roses, sunflowers, or seasonal mixes.",
    btnText: "Claim 10% Off Code",
    discount: "10% OFF",
    code: "WELCOME10",
    image: "assets/image (1).jpg",
    accent: "#e8b4c8",
    accentAlt: "#7eb8d8"
  }
};

// --- INITIALIZATION ---

document.addEventListener("DOMContentLoaded", () => {
  // Navigation
  initNavigation();
  
  // Brand Kit
  initBrandKit();
  
  // Ad Creator & Presets
  initAdCreator();
  
  // Email Workspace
  initEmailWorkspace();
  
  // Copy Bank
  initCopyBank();
  
  // Flyer Builder
  initFlyerBuilder();
});

// --- CORE FUNCTIONS ---

// Tab switching logic
function initNavigation() {
  const buttons = document.querySelectorAll(".nav-item button");
  const panels = document.querySelectorAll(".tab-panel");
  
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");
      
      // Update active nav state
      document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
      btn.parentElement.classList.add("active");
      
      // Update active panel state
      panels.forEach(panel => {
        panel.classList.remove("active");
        if (panel.id === `${targetTab}-panel`) {
          panel.classList.add("active");
        }
      });
      
      // If print tab selected, alert user
      if (targetTab === 'flyer') {
        showToast("💡 Customize settings, then hit CMD+P or Print to print!", "info");
      }
    });
  });
}

// Brand Kit copy hex values
function initBrandKit() {
  const colorCards = document.querySelectorAll(".color-card");
  colorCards.forEach(card => {
    card.addEventListener("click", () => {
      const hex = card.getAttribute("data-hex");
      navigator.clipboard.writeText(hex).then(() => {
        showToast(`Copied Hex: ${hex}`, "success");
      });
    });
  });
}

// Ad Creator input sync & preset loading
function initAdCreator() {
  const presetSelect = document.getElementById("ad-preset");
  const inputHeadline = document.getElementById("ad-input-headline");
  const inputBody = document.getElementById("ad-input-body");
  const inputBtn = document.getElementById("ad-input-btn");
  const inputPromo = document.getElementById("ad-input-promo");
  const inputDiscount = document.getElementById("ad-input-discount");
  const inputImg = document.getElementById("ad-input-img");
  
  // Mockup elements
  const mockFbText = document.getElementById("fb-mock-body");
  const mockFbImg = document.getElementById("fb-mock-img");
  const mockFbTitle = document.getElementById("fb-mock-title");
  const mockFbDesc = document.getElementById("fb-mock-desc");
  const mockFbCta = document.getElementById("fb-mock-cta");
  
  const mockIgImg = document.getElementById("ig-mock-img");
  const mockIgTag = document.getElementById("ig-mock-tag");
  const mockIgTitle = document.getElementById("ig-mock-title");
  const mockIgDesc = document.getElementById("ig-mock-desc");
  const mockIgCta = document.getElementById("ig-mock-cta");
  
  const mockWaBubble = document.getElementById("wa-mock-bubble");
  
  // Real-time synchronization
  function updatePreviews() {
    const headline = inputHeadline.value;
    const body = inputBody.value;
    const btnText = inputBtn.value;
    const promo = inputPromo.value;
    const discount = inputDiscount.value;
    const imgPath = inputImg.value;
    
    // Facebook Mockup
    if (mockFbText) mockFbText.textContent = body;
    if (mockFbImg) mockFbImg.src = imgPath;
    if (mockFbTitle) mockFbTitle.textContent = headline;
    if (mockFbDesc) mockFbDesc.textContent = `Get ${discount} off using code: ${promo}`;
    if (mockFbCta) mockFbCta.textContent = btnText;
    
    // Instagram Story Mockup
    if (mockIgImg) mockIgImg.src = imgPath;
    if (mockIgTag) mockIgTag.textContent = discount;
    if (mockIgTitle) mockIgTitle.textContent = headline;
    if (mockIgDesc) mockIgDesc.textContent = `Use code ${promo} for same-day delivery.`;
    if (mockIgCta) mockIgCta.textContent = btnText;
    
    // WhatsApp Mockup
    if (mockWaBubble) {
      mockWaBubble.innerHTML = `*${headline.toUpperCase()}* \n\n${body}\n\n🏷️ Code: *${promo}* (${discount})\n\n👉 Reply to order instantly!`;
    }
    
    // Also bind to print flyer preview
    updateFlyerMockup(headline, body, promo, discount, imgPath);
  }
  
  // Attach Event Listeners
  const inputs = [inputHeadline, inputBody, inputBtn, inputPromo, inputDiscount, inputImg];
  inputs.forEach(input => {
    if (input) input.addEventListener("input", updatePreviews);
  });
  
  // Load Presets
  presetSelect.addEventListener("change", (e) => {
    const key = e.target.value;
    const preset = PRESETS[key];
    if (preset) {
      inputHeadline.value = preset.headline;
      inputBody.value = preset.body;
      inputBtn.value = preset.btnText;
      inputPromo.value = preset.code;
      inputDiscount.value = preset.discount;
      inputImg.value = preset.image;
      
      updatePreviews();
      showToast(`Loaded Preset: ${preset.name}`, "info");
    }
  });
  
  // Tab selector inside Mockup output
  const mockupSelectors = document.querySelectorAll(".preview-selector button");
  const mockupDisplays = document.querySelectorAll(".mockup-display");
  
  mockupSelectors.forEach(btn => {
    btn.addEventListener("click", () => {
      mockupSelectors.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const targetMockup = btn.getAttribute("data-mockup");
      mockupDisplays.forEach(display => {
        display.classList.remove("active");
        if (display.id === `${targetMockup}-mockup`) {
          display.classList.add("active");
        }
      });
    });
  });
  
  // Load default preset first
  presetSelect.dispatchEvent(new Event("change"));
}

// Interactive Email Workspace
function initEmailWorkspace() {
  const emailList = document.getElementById("email-list-container");
  const iframe = document.getElementById("email-preview-frame");
  const codeArea = document.getElementById("email-code-textarea");
  const copyBtn = document.getElementById("copy-email-code-btn");
  const subjectVal = document.getElementById("email-subject-val");
  const triggerVal = document.getElementById("email-trigger-val");
  
  const viewToggleButtons = document.querySelectorAll(".email-workspace .preview-selector button");
  const previewWrapper = document.getElementById("email-iframe-wrapper");
  const codePanel = document.getElementById("email-code-panel");
  
  let currentEmailKey = "welcome";
  
  // Build Sidebar buttons
  emailList.innerHTML = Object.keys(EMAIL_TEMPLATES).map((key, idx) => `
    <button class="email-list-item ${idx === 0 ? 'active' : ''}" data-key="${key}">
      ${EMAIL_TEMPLATES[key].name}
    </button>
  `).join('');
  
  // Handle list selections
  const listItems = document.querySelectorAll(".email-list-item");
  listItems.forEach(item => {
    item.addEventListener("click", () => {
      listItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      
      const key = item.getAttribute("data-key");
      currentEmailKey = key;
      loadEmail(key);
    });
  });
  
  // Load email content into workspace
  function loadEmail(key) {
    const template = EMAIL_TEMPLATES[key];
    if (template) {
      subjectVal.textContent = template.subject;
      triggerVal.textContent = template.desc;
      codeArea.value = template.html;
      
      // Load HTML inside sandbox iframe
      iframe.srcdoc = template.html;
    }
  }
  
  // Handle view toggle (Preview vs Code)
  viewToggleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      viewToggleButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const mode = btn.getAttribute("data-mode");
      if (mode === "preview") {
        previewWrapper.style.display = "block";
        codePanel.classList.remove("active");
      } else {
        previewWrapper.style.display = "none";
        codePanel.classList.add("active");
      }
    });
  });
  
  // Copy Email HTML Code Action
  copyBtn.addEventListener("click", () => {
    codeArea.select();
    navigator.clipboard.writeText(codeArea.value).then(() => {
      showToast("Email HTML code copied!", "success");
    });
  });
  
  // Initialize with first template
  loadEmail("welcome");
}

// Copy Bank Tab Search & Copy functionality
function initCopyBank() {
  const container = document.getElementById("copy-bank-container");
  const searchInput = document.getElementById("copy-search");
  
  function renderCopyBank(filterQuery = "") {
    let html = "";
    
    // Check channels
    const channels = {
      instagram: "Instagram Captions",
      metaAds: "Meta & Google Ads Copy",
      whatsapp: "WhatsApp Message Templates",
      sms: "SMS Notifications"
    };
    
    Object.keys(channels).forEach(channelKey => {
      const items = COPY_BANK[channelKey];
      const filtered = items.filter(item => 
        item.text.toLowerCase().includes(filterQuery.toLowerCase()) || 
        item.label.toLowerCase().includes(filterQuery.toLowerCase())
      );
      
      if (filtered.length > 0) {
        html += `
          <div class="copy-group-section">
            <h3 class="card-heading">${channels[channelKey]}</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${filtered.map((item, idx) => `
                <div class="copy-card">
                  <div class="copy-text-area">
                    <span class="copy-tag">${item.label}</span>
                    <div class="copy-content ${channelKey === 'instagram' ? 'cormorant' : ''}">${item.text}</div>
                    <div class="copy-description">${item.desc}</div>
                  </div>
                  <button class="btn-action btn-secondary btn-sm" onclick="copyCopyText('${channelKey}', ${idx}, this)">
                    Copy
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }
    });
    
    if (!html) {
      html = `<div style="text-align: center; color: var(--muted); padding: 48px;">No copywriting matches found for "${filterQuery}".</div>`;
    }
    
    container.innerHTML = html;
  }
  
  // Search input binding
  searchInput.addEventListener("input", (e) => {
    renderCopyBank(e.target.value);
  });
  
  // Render default
  renderCopyBank();
}

// Global copy wrapper for dynamic onclick elements
window.copyCopyText = function(channel, idx, btn) {
  const text = COPY_BANK[channel][idx].text;
  navigator.clipboard.writeText(text).then(() => {
    showToast("Copy text copied to clipboard!", "success");
    const originalText = btn.textContent;
    btn.textContent = "Copied ✓";
    btn.style.color = "var(--success)";
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.color = "var(--fg)";
    }, 1500);
  });
};

// Printable Flyer Builder and Sync
function initFlyerBuilder() {
  const printBtn = document.getElementById("print-flyer-btn");
  
  // Print trigger
  printBtn.addEventListener("click", () => {
    window.print();
  });
}

function updateFlyerMockup(headline, body, promoCode, discountLabel, imgPath) {
  // Update Printable mock elements
  const flHeadline = document.getElementById("flyer-headline-el");
  const flBody = document.getElementById("flyer-body-el");
  const flPromoCode = document.getElementById("flyer-promo-code-el");
  const flPromoVal = document.getElementById("flyer-promo-val-el");
  const flProdImg1 = document.getElementById("flyer-prod-img-1");
  const flProdImg2 = document.getElementById("flyer-prod-img-2");
  
  if (flHeadline) {
    // Elegant formatting for flyer header: replace dash with line break
    flHeadline.innerHTML = headline.replace("—", "<br><em style='color: #d4a0b8;'>") + "</em>";
  }
  
  if (flBody) {
    // Keep body copy short and clear
    flBody.textContent = body.substring(0, 180) + "...";
  }
  
  if (flPromoCode) flPromoCode.textContent = promoCode;
  if (flPromoVal) flPromoVal.textContent = `${discountLabel} OFF YOUR ORDER`;
  
  // Sync flyer product images
  if (flProdImg1) flProdImg1.src = imgPath;
}

// Toast Alert System
function showToast(message, type = "success") {
  let toast = document.getElementById("toast-alert");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-alert";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  
  const icon = type === "success" 
    ? `<span class="toast-success-icon">✓</span>` 
    : `<span style="color: var(--accent-alt);">ℹ</span>`;
    
  toast.innerHTML = `${icon} <span>${message}</span>`;
  toast.classList.add("show");
  
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
