import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Sliders, 
  ShoppingCart, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Edit3, 
  Code2, 
  Coins, 
  Globe, 
  Search, 
  X, 
  Copy, 
  Check, 
  UserCheck, 
  Sparkles,
  Layers,
  Terminal,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';

// Initial Product Catalog Data
const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    titleZh: 'Modular Combat & Stamina System (戰鬥與體力核心系統)',
    titleEn: 'Modular Combat & Stamina System',
    descZh: '包含 5 種職業連段、Hitbox 傷害判定與伺服器端 Raycast 驗證防作弊邏輯。',
    descEn: 'Full combat combo system with server-side Raycast hitboxes & exploit guard.',
    categoryId: 'systems',
    priceRobux: 1200,
    priceTwd: 450,
    rating: 4.9,
    status: 'approved',
    author: 'TW_StudioMaster',
    studioVer: 'v5.1+',
    tags: ['Combat', 'Hitbox', 'Raycast'],
    iconBg: 'from-cyan-500 to-blue-600',
    luauTemplate: `-- Modular Combat Config
local CombatConfig = {}
CombatConfig.MaxStamina = 100
CombatConfig.RegenRate = 5
CombatConfig.EnableHitboxVisuals = false
return CombatConfig`
  },
  {
    id: 'prod-2',
    titleZh: 'Cyberpunk Sci-Fi HUD Interface (賽博霓虹 UI 全套)',
    titleEn: 'Cyberpunk Sci-Fi HUD Interface',
    descZh: '含背包、商店、玩家卡與設定選單，全響應式向量動畫與音效觸發。',
    descEn: 'Complete HUD pack with inventory, shop, and animated UI elements.',
    categoryId: 'ui',
    priceRobux: 800,
    priceTwd: 300,
    rating: 4.8,
    status: 'approved',
    author: 'NeonDesign_TW',
    studioVer: 'v5.0+',
    tags: ['UI', 'HUD', 'TweenService'],
    iconBg: 'from-purple-500 to-pink-600',
    luauTemplate: `-- Sci-Fi HUD Config
local UIConfig = {}
UIConfig.Theme = "CyberCyan"
UIConfig.SoundEffectsEnabled = true
return UIConfig`
  },
  {
    id: 'prod-3',
    titleZh: 'Custom Vehicle Physics Framework (載具物理動力學框架)',
    titleEn: 'Custom Vehicle Physics Framework',
    descZh: '高擬真懸吊、防翻車物理演算、支援手排/自排切換與變速箱調校。',
    descEn: 'Advanced chassis physics with customizable suspension & manual gear ratios.',
    categoryId: 'systems',
    priceRobux: 1500,
    priceTwd: 550,
    rating: 5.0,
    status: 'approved',
    author: 'RBLX_Mechanic',
    studioVer: 'v5.2',
    tags: ['Physics', 'Chassis', 'Vehicles'],
    iconBg: 'from-amber-500 to-red-600',
    luauTemplate: `-- Vehicle Physics Config
local VehicleConfig = {}
VehicleConfig.Horsepower = 450
VehicleConfig.SuspensionStiffness = 45
return VehicleConfig`
  },
  {
    id: 'prod-4',
    titleZh: 'Advanced DataStore v2 Saver Module (ProfileService 存檔模組)',
    titleEn: 'Advanced DataStore v2 Saver Module',
    descZh: 'Session Locking 機制、自動回溯備份、全防刷物品與離線數據寫入。',
    descEn: 'Session-locked ProfileService wrapper preventing data loss & dupe exploits.',
    categoryId: 'scripts',
    priceRobux: 600,
    priceTwd: 220,
    rating: 4.7,
    status: 'approved',
    author: 'Luau_Dev_HK',
    studioVer: 'v5.1+',
    tags: ['DataStore', 'Security', 'ProfileService'],
    iconBg: 'from-emerald-500 to-teal-600',
    luauTemplate: `-- ProfileService Module Config
local DataConfig = {}
DataConfig.AutoSaveInterval = 300
DataConfig.BackupOnStudioClose = true
return DataConfig`
  }
];

const CATEGORIES = [
  { id: 'all', nameZh: '全部模組', nameEn: 'All Assets' },
  { id: 'systems', nameZh: '核心系統', nameEn: 'Core Systems' },
  { id: 'models', nameZh: '3D 模型與地圖', nameEn: '3D Models & Builds' },
  { id: 'ui', nameZh: 'UI / UX 介面', nameEn: 'UI & UX Packs' },
  { id: 'scripts', nameZh: '腳本與工具', nameEn: 'Scripts & Utilities' },
  { id: 'ugc', nameZh: 'UGC 服飾裝備', nameEn: 'UGC & Gear' }
];

const THEME_COLORS = [
  { id: 'cyan', name: 'Cyber Cyan', hex: '#00f0ff', rgb: '0, 240, 255' },
  { id: 'purple', name: 'Neon Purple', hex: '#a855f7', rgb: '168, 85, 247' },
  { id: 'emerald', name: 'Toxic Emerald', hex: '#10b981', rgb: '16, 185, 129' },
  { id: 'amber', name: 'Solar Amber', hex: '#f59e0b', rgb: '245, 158, 11' }
];

const LICENSE_TYPES = [
  { id: 'personal', nameZh: '單一伺服器授權 (Personal)', nameEn: 'Single Server License', mult: 1.0 },
  { id: 'commercial', nameZh: '多遊戲商業授權 (Commercial)', nameEn: 'Multi-Game Commercial License', mult: 1.8 },
  { id: 'source', nameZh: '全源碼開放授權 (Source Code)', nameEn: 'Full Source Code License', mult: 2.5 }
];

const ADDONS_LIST = [
  { id: 'exploitGuard', nameZh: '伺服器端防作弊校驗 (Exploit Guard)', nameEn: 'Server Exploit Guard Check', priceRobux: 200, priceTwd: 75 },
  { id: 'discordLogs', nameZh: 'Discord 日誌 Webhook 串接', nameEn: 'Discord Audit Webhook', priceRobux: 150, priceTwd: 50 },
  { id: 'autoSave', nameZh: 'DataStore2 / ProfileService 整合存檔', nameEn: 'ProfileService Auto-Save', priceRobux: 250, priceTwd: 90 }
];

export default function App() {
  // Global Controls
  const [lang, setLang] = useState('zh'); // 'zh' | 'en'
  const [currency, setCurrency] = useState('R$'); // 'R$' | 'NT$'
  const [userRole, setUserRole] = useState('visitor'); // 'visitor' | 'dev' | 'owner'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Dynamic Product Store
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  // Cart Drawer & Orders
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('alipay'); // 'alipay' | 'fps'

  // Modals & Panels
  const [configModalItem, setConfigModalItem] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Configurator Options state
  const [configOptions, setConfigOptions] = useState({
    color: THEME_COLORS[0],
    license: LICENSE_TYPES[0],
    selectedAddons: []
  });
  const [codeCopied, setCodeCopied] = useState(false);

  // New Developer Product Form
  const [newProductForm, setNewProductForm] = useState({
    titleZh: '',
    titleEn: '',
    descZh: '',
    descEn: '',
    categoryId: 'systems',
    priceRobux: 500,
    priceTwd: 180,
    tags: 'Luau, Modular',
    luauTemplate: `-- Custom Luau Config\nlocal Config = {}\nreturn Config`
  });

  // Localization Text Helper
  const t = (zh, en) => (lang === 'zh' ? zh : en);

  // Currency Converter & Formatter
  const formatPrice = (robux, twd) => {
    if (currency === 'R$') return `R$ ${robux.toLocaleString()}`;
    return `NT$ ${twd.toLocaleString()}`;
  };

  // Filtered Products Calculation
  const approvedProducts = useMemo(() => {
    return products.filter(p => p.status === 'approved' && (
      selectedCategory === 'all' || p.categoryId === selectedCategory
    ) && (
      !searchQuery.trim() || 
      p.titleZh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    ));
  }, [products, selectedCategory, searchQuery]);

  const pendingProducts = useMemo(() => {
    return products.filter(p => p.status === 'pending_approval');
  }, [products]);

  // Open Configurator Modal
  const handleOpenConfigurator = (product) => {
    setConfigModalItem(product);
    setConfigOptions({
      color: THEME_COLORS[0],
      license: LICENSE_TYPES[0],
      selectedAddons: []
    });
  };

  // Calculated Price inside Configurator
  const modalCalculatedPrice = useMemo(() => {
    if (!configModalItem) return { robux: 0, twd: 0 };
    const baseR = configModalItem.priceRobux * configOptions.license.mult;
    const baseT = configModalItem.priceTwd * configOptions.license.mult;

    const addonsR = configOptions.selectedAddons.reduce((sum, id) => {
      const addon = ADDONS_LIST.find(a => a.id === id);
      return sum + (addon ? addon.priceRobux : 0);
    }, 0);

    const addonsT = configOptions.selectedAddons.reduce((sum, id) => {
      const addon = ADDONS_LIST.find(a => a.id === id);
      return sum + (addon ? addon.priceTwd : 0);
    }, 0);

    return {
      robux: Math.round(baseR + addonsR),
      twd: Math.round(baseT + addonsT)
    };
  }, [configModalItem, configOptions]);

  // Copy Luau Code Snippet
  const handleCopyLuau = () => {
    if (!configModalItem) return;
    const luauSnippet = `-- Generated by TW Roblox Developer Studio
local Config = {}
Config.ItemName = "${configModalItem.titleEn}"
Config.License = "${configOptions.license.id}"
Config.ThemeColorRGB = Vector3.new(${configOptions.color.rgb})
Config.Addons = {
${configOptions.selectedAddons.map(id => `    ["${id}"] = true,`).join('\n')}
}

${configModalItem.luauTemplate || ''}
return Config`;

    navigator.clipboard.writeText(luauSnippet);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  // Cart Operations
  const handleAddToCart = () => {
    if (!configModalItem) return;
    const newItem = {
      cartId: Date.now() + Math.random(),
      product: configModalItem,
      config: { ...configOptions },
      finalPriceRobux: modalCalculatedPrice.robux,
      finalPriceTwd: modalCalculatedPrice.twd
    };
    setCart([...cart, newItem]);
    setConfigModalItem(null);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  // Apply Coupon
  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'TWRBLX') {
      setDiscount(0.15); // 15% discount
    } else {
      setDiscount(0);
    }
  };

  // Cart Total Calculation
  const cartTotals = useMemo(() => {
    const robuxRaw = cart.reduce((sum, i) => sum + i.finalPriceRobux, 0);
    const twdRaw = cart.reduce((sum, i) => sum + i.finalPriceTwd, 0);
    return {
      robux: Math.round(robuxRaw * (1 - discount)),
      twd: Math.round(twdRaw * (1 - discount))
    };
  }, [cart, discount]);

  // Developer Submission Handler
  const handleDeveloperSubmit = (e) => {
    e.preventDefault();
    const isOwner = userRole === 'owner';
    const newProduct = {
      id: `prod-${Date.now()}`,
      titleZh: newProductForm.titleZh || '自訂未命名模組',
      titleEn: newProductForm.titleEn || 'Custom Roblox Asset',
      descZh: newProductForm.descZh || '暫無詳細描述。',
      descEn: newProductForm.descEn || 'No description provided.',
      categoryId: newProductForm.categoryId,
      priceRobux: Number(newProductForm.priceRobux),
      priceTwd: Number(newProductForm.priceTwd),
      rating: 5.0,
      status: isOwner ? 'approved' : 'pending_approval',
      author: userRole === 'owner' ? 'OwnerAdmin' : 'TW_CommunityDev',
      studioVer: 'v5.2+',
      tags: newProductForm.tags.split(',').map(s => s.trim()).filter(Boolean),
      iconBg: 'from-cyan-600 to-indigo-700',
      luauTemplate: newProductForm.luauTemplate
    };

    setProducts([newProduct, ...products]);
    setIsSubmitModalOpen(false);
    // Reset Form
    setNewProductForm({
      titleZh: '',
      titleEn: '',
      descZh: '',
      descEn: '',
      categoryId: 'systems',
      priceRobux: 500,
      priceTwd: 180,
      tags: 'Luau, Modular',
      luauTemplate: `-- Custom Luau Config\nlocal Config = {}\nreturn Config`
    });
  };

  // Owner Approval / Rejection Action
  const handleOwnerApprove = (productId, approve) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        return { ...p, status: approve ? 'approved' : 'rejected' };
      }
      return p;
    }));
  };

  // Owner Inline Price Update
  const handleSaveInlinePrice = (product) => {
    if (!editingProduct) return;
    setProducts(products.map(p => {
      if (p.id === product.id) {
        return {
          ...p,
          priceRobux: Number(editingProduct.priceRobux),
          priceTwd: Number(editingProduct.priceTwd)
        };
      }
      return p;
    }));
    setEditingProduct(null);
  };

  // Owner Delete Product Action
  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  // Generate Discord Payload Link
  const handleDiscordCheckout = () => {
    const itemsSummary = cart.map(c => `• ${c.product.titleEn} (${c.config.license.id})`).join('\n');
    const msg = `[TW RBLX Order Ticket]\nRole: ${userRole}\nPayMethod: ${paymentMethod}\nTotal: ${formatPrice(cartTotals.robux, cartTotals.twd)}\nItems:\n${itemsSummary}`;
    window.open(`https://discord.gg?order=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black pb-12">
      
      {/* TOP STATUS BAR & ROLE SIMULATOR ACCESS */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 px-4 py-2 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{t('台灣 Roblox 開發者系統與資產市集', 'TW Roblox Dev System & Asset Portal')}</span>
            <span className="bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/20 text-[10px]">
              Luau v5.2 Ready
            </span>
          </div>

          {/* SIMULATED ROLE SWITCHER PANEL */}
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg p-1">
            <span className="text-slate-500 px-2 flex items-center gap-1">
              <UserCheck size={13} className="text-cyan-400" />
              <span>{t('身份切換 (Role):', 'Current Role:')}</span>
            </span>

            <button
              onClick={() => setUserRole('visitor')}
              className={`px-2.5 py-0.5 rounded transition ${
                userRole === 'visitor' 
                  ? 'bg-slate-700 text-white font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('一般買家', 'Visitor / Buyer')}
            </button>

            <button
              onClick={() => setUserRole('dev')}
              className={`px-2.5 py-0.5 rounded transition ${
                userRole === 'dev' 
                  ? 'bg-cyan-500 text-black font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('創作者 (Dev)', 'Developer')}
            </button>

            <button
              onClick={() => setUserRole('owner')}
              className={`px-2.5 py-0.5 rounded transition ${
                userRole === 'owner' 
                  ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-900/50' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('站長 (Owner/Admin)', 'Owner / Admin')}
            </button>
          </div>

        </div>
      </div>

      {/* HEADER / NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#0A0E17]/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#090D14] rounded-[10px] flex items-center justify-center">
                <Terminal className="text-cyan-400" size={20} />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg lg:text-xl tracking-wider text-white font-mono">
                  TW RBLX<span className="text-cyan-400">.STUDIO</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal">
                {t('模組系統 • Luau 腳本 • 3D 資源', 'Modular Systems • Luau Scripts • 3D Assets')}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-2 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('搜尋模組、系統、Luau 關鍵字...', 'Search systems, scripts, tags...')}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-9 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-mono"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Controls & Actions */}
          <div className="flex items-center space-x-3">
            
            {/* Currency Toggle */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-1 flex items-center text-xs font-mono">
              <button
                onClick={() => setCurrency('R$')}
                className={`px-2.5 py-1 rounded transition flex items-center space-x-1 ${
                  currency === 'R$' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Coins size={12} />
                <span>R$</span>
              </button>
              <button
                onClick={() => setCurrency('NT$')}
                className={`px-2.5 py-1 rounded transition flex items-center space-x-1 ${
                  currency === 'NT$' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>NT$</span>
              </button>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className="bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-300 px-2.5 py-1.5 rounded-lg text-xs font-mono transition flex items-center space-x-1.5"
            >
              <Globe size={13} className="text-cyan-400" />
              <span>{lang === 'zh' ? 'EN' : '繁中'}</span>
            </button>

            {/* Developer Submit Asset Button (Dev & Owner) */}
            {(userRole === 'dev' || userRole === 'owner') && (
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500 hover:text-black px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center space-x-1.5"
              >
                <PlusCircle size={14} />
                <span className="hidden sm:inline">{t('上架資產', 'Submit Asset')}</span>
              </button>
            )}

            {/* Shopping Cart Drawer Toggle */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-slate-900 border border-slate-800 hover:border-cyan-500 text-white px-3 py-1.5 rounded-lg text-xs transition flex items-center space-x-2 font-mono"
            >
              <ShoppingCart size={15} className="text-cyan-400" />
              <span className="hidden md:inline">{t('購物車', 'Cart')}</span>
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-400 text-black font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {cart.length}
                </span>
              )}
            </button>

          </div>

        </div>
      </header>

      {/* HERO BANNER */}
      <section className="relative py-10 px-4 lg:px-8 bg-gradient-to-b from-[#0D1322] via-[#07090E] to-[#07090E] border-b border-slate-800/50 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          
          <div className="max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center space-x-2 bg-slate-900/80 border border-cyan-500/30 px-3 py-1 rounded-full mb-4 text-xs font-mono text-cyan-400">
              <Sparkles size={13} />
              <span>{t('台灣頂級 Roblox Studio 開發資源庫', 'Taiwan Premier Roblox Studio Asset Hub')}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3 leading-tight">
              {t('模組化系統 & ', 'Modular Systems & ')} 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400">
                {t('可設定 Luau 腳本框架', 'Configurable Luau Frameworks')}
              </span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
              {t(
                '專為台灣與華人 Roblox 開發團隊量身打造。所有系統皆包含實時參數設定器、伺服器防作弊驗證與 Discord 快速開通交貨。',
                'Tailored for Roblox developers in Taiwan. Includes real-time parameter configuration, server exploit guards, and fast Discord ticket delivery.'
              )}
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs font-mono">
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center space-x-2 text-slate-300">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>{t('防作弊校驗保護', 'Exploit Guard Verified')}</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center space-x-2 text-slate-300">
                <Sliders size={14} className="text-cyan-400" />
                <span>{t('線上程式碼即時配置', 'Online Code Generator')}</span>
              </div>
            </div>
          </div>

          {/* Profile Role Badge Card */}
          <div className="w-full md:w-80 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center font-bold text-black text-xs">
                  {userRole.toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <div className="text-xs font-bold text-white font-mono">Discord Auth User</div>
                  <div className="text-[10px] text-slate-400">ID: 84920491029402941</div>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                userRole === 'owner' ? 'bg-purple-900/80 text-purple-300 border border-purple-500' :
                userRole === 'dev' ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/40' :
                'bg-slate-800 text-slate-300'
              }`}>
                {userRole}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">{t('權限等級:', 'Permissions:')}</span>
                <span className="text-white">
                  {userRole === 'owner' ? t('最高管理權 (Full Admin)', 'Full Admin') : 
                   userRole === 'dev' ? t('資產提交 (Developer)', 'Asset Creator') : 
                   t('一般瀏覽 (Visitor)', 'Browse Only')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('待審核項目:', 'Pending Review:')}</span>
                <span className="text-amber-400 font-bold">{pendingProducts.length} {t('件', 'items')}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* OWNER ADMIN DASHBOARD PANEL (OWNER ONLY) */}
      {userRole === 'owner' && (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-6">
          <div className="bg-purple-950/30 border border-purple-500/40 rounded-2xl p-5 backdrop-blur">
            <div className="flex items-center justify-between mb-4 border-b border-purple-800/40 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="text-purple-400" size={18} />
                <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  {t('站長管理儀表板 (Owner Approval & Management)', 'Owner Approval & Management Panel')}
                </h2>
              </div>
              <span className="text-xs bg-purple-900/60 text-purple-300 px-2.5 py-1 rounded-full font-mono">
                {t('待審核總數:', 'Pending Queue:')} {pendingProducts.length}
              </span>
            </div>

            {pendingProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingProducts.map((product) => (
                  <div key={product.id} className="bg-slate-900 border border-purple-500/30 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-purple-300 mb-1">
                        <span>{t('創作者:', 'Creator:')} @{product.author}</span>
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] px-2 py-0.5 rounded">
                          {t('待審核 (Pending)', 'Pending Review')}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">{lang === 'zh' ? product.titleZh : product.titleEn}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-3">{lang === 'zh' ? product.descZh : product.descEn}</p>
                      <div className="text-xs font-mono text-cyan-400 font-bold mb-3">
                        {formatPrice(product.priceRobux, product.priceTwd)}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => handleOwnerApprove(product.id, true)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs py-1.5 rounded-lg font-bold flex items-center justify-center space-x-1 transition"
                      >
                        <CheckCircle2 size={14} />
                        <span>{t('批准上架', 'Approve & Publish')}</span>
                      </button>
                      <button
                        onClick={() => handleOwnerApprove(product.id, false)}
                        className="flex-1 bg-rose-600/80 hover:bg-rose-500 text-white font-mono text-xs py-1.5 rounded-lg font-bold flex items-center justify-center space-x-1 transition"
                      >
                        <XCircle size={14} />
                        <span>{t('退回申請', 'Reject')}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs font-mono text-purple-300/70 text-center py-4 bg-slate-900/50 rounded-xl border border-purple-900/30">
                {t('目前沒有待審核的創作者提交項目。', 'No pending developer submissions in queue.')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MAIN CONTENT: CATEGORY FILTERS & PRODUCT MARKETPLACE */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        
        {/* Category Selector */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono border whitespace-nowrap transition-all flex items-center space-x-2 ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-black font-bold border-cyan-400 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <Filter size={12} />
              <span>{lang === 'zh' ? cat.nameZh : cat.nameEn}</span>
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {approvedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/60 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
              >
                {/* Thumbnail & Header */}
                <div className="relative aspect-video bg-slate-950 overflow-hidden flex items-center justify-center">
                  <div className={`w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br ${product.iconBg}`}>
                    <Layers size={44} className="text-white drop-shadow-md mb-2" />
                    <span className="text-[10px] font-mono text-white/80 font-bold uppercase tracking-wider">
                      {product.studioVer}
                    </span>
                  </div>

                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur border border-slate-800 text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded-md flex items-center space-x-1">
                    <ShieldCheck size={12} className="text-emerald-400" />
                    <span>Verified</span>
                  </div>

                  {/* Owner Controls on Live Products */}
                  {userRole === 'owner' && (
                    <div className="absolute top-3 right-3 flex items-center space-x-1">
                      <button
                        onClick={() => setEditingProduct({ id: product.id, priceRobux: product.priceRobux, priceTwd: product.priceTwd })}
                        className="p-1.5 rounded-md bg-slate-900/90 text-slate-300 hover:text-cyan-400 border border-slate-700"
                        title="Edit Price"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-1.5 rounded-md bg-slate-900/90 text-rose-400 hover:text-rose-300 border border-slate-700"
                        title="Delete Product"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Body Details */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-2">
                      <span>@{product.author}</span>
                      <span className="text-amber-400 font-bold">★ {product.rating}</span>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {lang === 'zh' ? product.titleZh : product.titleEn}
                    </h3>

                    <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                      {lang === 'zh' ? product.descZh : product.descEn}
                    </p>
                  </div>

                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.tags.map((tag) => (
                        <span key={tag} className="bg-slate-950 text-slate-400 border border-slate-800 text-[10px] font-mono px-2 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Price & Actions */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      {/* Inline Price Editor Form for Owner */}
                      {editingProduct && editingProduct.id === product.id ? (
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            value={editingProduct.priceRobux}
                            onChange={(e) => setEditingProduct({ ...editingProduct, priceRobux: e.target.value })}
                            className="w-16 bg-slate-950 border border-cyan-500 rounded px-1.5 py-1 text-xs text-white font-mono"
                          />
                          <button onClick={() => handleSaveInlinePrice(product)} className="text-emerald-400 text-xs font-mono font-bold px-1.5 py-1 bg-slate-800 rounded">
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="font-mono">
                          <span className="text-[10px] text-slate-500 block">{t('建議售價', 'Base Price')}</span>
                          <span className="text-sm font-extrabold text-white">
                            {formatPrice(product.priceRobux, product.priceTwd)}
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => handleOpenConfigurator(product)}
                        className="bg-cyan-500/10 hover:bg-cyan-500 hover:text-black border border-cyan-500/40 text-cyan-400 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center space-x-1.5"
                      >
                        <Sliders size={13} />
                        <span>{t('設定與購買', 'Configure')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <Terminal size={40} className="text-slate-600 mb-3 mx-auto" />
            <h4 className="text-sm font-bold text-slate-300 mb-1">{t('找不到相關資產模組', 'No products found')}</h4>
            <p className="text-xs text-slate-500 mb-4">{t('請嘗試切換其他標籤或搜尋關鍵字。', 'Try searching for different keywords or category tags.')}</p>
            <button onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }} className="bg-cyan-500 text-black px-4 py-2 rounded-xl text-xs font-mono font-bold">
              {t('重置所有搜尋', 'Reset Filters')}
            </button>
          </div>
        )}
      </main>

      {/* CONFIGURATOR & LUAU GENERATOR MODAL */}
      {configModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#090D14] border border-cyan-500/50 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col relative my-auto">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900 sticky top-0 z-10">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${configModalItem.iconBg} flex items-center justify-center text-white`}>
                  <Code2 size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">
                    {lang === 'zh' ? configModalItem.titleZh : configModalItem.titleEn}
                  </h3>
                  <span className="text-[10px] text-cyan-400 font-mono">Luau Interactive Configurator</span>
                </div>
              </div>
              <button onClick={() => setConfigModalItem(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Form Configurations */}
              <div className="space-y-5">
                
                {/* 1. Theme Selection */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-2">
                    1. {t('主體配色主題 (Theme Preset)', 'Theme Preset')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {THEME_COLORS.map((col) => (
                      <button
                        key={col.id}
                        onClick={() => setConfigOptions({ ...configOptions, color: col })}
                        className={`p-2 rounded-xl flex items-center space-x-2 bg-slate-900 border text-xs font-mono transition ${
                          configOptions.color.id === col.id ? 'border-cyan-400 text-white' : 'border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: col.hex }}></span>
                        <span>{col.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. License Tier */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-2">
                    2. {t('授權層級 (License Tier)', 'License Tier')}
                  </label>
                  <div className="space-y-2">
                    {LICENSE_TYPES.map((lic) => (
                      <button
                        key={lic.id}
                        onClick={() => setConfigOptions({ ...configOptions, license: lic })}
                        className={`w-full text-left p-2.5 rounded-xl border text-xs font-mono transition flex justify-between items-center ${
                          configOptions.license.id === lic.id ? 'border-purple-500 bg-purple-950/30 text-white' : 'border-slate-800 bg-slate-900 text-slate-400'
                        }`}
                      >
                        <span>{lang === 'zh' ? lic.nameZh : lic.nameEn}</span>
                        <span className="text-purple-400 font-bold">{lic.mult === 1 ? '1.0x' : `${lic.mult}x`}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Addon Modules */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-2">
                    3. {t('選配擴充模組 (Add-ons)', 'Add-on Modules')}
                  </label>
                  <div className="space-y-2">
                    {ADDONS_LIST.map((addon) => {
                      const isSelected = configOptions.selectedAddons.includes(addon.id);
                      return (
                        <button
                          key={addon.id}
                          onClick={() => {
                            const updated = isSelected 
                              ? configOptions.selectedAddons.filter(id => id !== addon.id)
                              : [...configOptions.selectedAddons, addon.id];
                            setConfigOptions({ ...configOptions, selectedAddons: updated });
                          }}
                          className={`w-full text-left p-2.5 rounded-xl border text-xs font-mono transition flex justify-between items-center ${
                            isSelected ? 'border-emerald-500 bg-emerald-950/30 text-white' : 'border-slate-800 bg-slate-900 text-slate-400'
                          }`}
                        >
                          <span>{lang === 'zh' ? addon.nameZh : addon.nameEn}</span>
                          <span className="text-emerald-400 font-bold">+{formatPrice(addon.priceRobux, addon.priceTwd)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Code Snippet & Checkout Action */}
              <div className="flex flex-col justify-between space-y-4">
                
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex-grow font-mono text-[11px] text-slate-300 flex flex-col">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-2">
                    <span className="text-cyan-400 flex items-center gap-1"><Terminal size={12} /> Config.luau</span>
                    <button onClick={handleCopyLuau} className="hover:text-white text-slate-400 flex items-center gap-1">
                      {codeCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{codeCopied ? t('已複製', 'Copied') : t('複製程式碼', 'Copy Code')}</span>
                    </button>
                  </div>
                  <pre className="overflow-x-auto text-slate-400 flex-grow select-all leading-relaxed">
<span className="text-slate-600">-- Generated Luau Config</span>
local Config = {}
Config.ItemName = "{configModalItem.titleEn}"
Config.License = "{configOptions.license.id}"
Config.ColorRGB = Vector3.new({configOptions.color.rgb})
Config.Modules = &#123;
{configOptions.selectedAddons.map(id => `  ["${id}"] = true,\n`).join('')}&#125;
return Config</pre>
                </div>

                <div className="bg-slate-900 border border-cyan-500/30 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-xs text-slate-400">{t('計算後總價:', 'Calculated Total:')}</span>
                    <span className="text-lg font-bold text-cyan-400">
                      {formatPrice(modalCalculatedPrice.robux, modalCalculatedPrice.twd)}
                    </span>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs py-2.5 rounded-xl font-extrabold transition flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart size={14} />
                    <span>{t('加入購物車', 'Add to Cart')}</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* DEVELOPER ASSET SUBMISSION MODAL */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#090D14] border border-cyan-500/50 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative my-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <PlusCircle size={16} className="text-cyan-400" />
                <span>{t('提交 Roblox Studio 資產模組', 'Submit Roblox Asset')}</span>
              </h3>
              <button onClick={() => setIsSubmitModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleDeveloperSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-slate-400 mb-1">{t('中文標題:', 'Title (ZH):')}</label>
                <input
                  type="text"
                  required
                  value={newProductForm.titleZh}
                  onChange={(e) => setNewProductForm({ ...newProductForm, titleZh: e.target.value })}
                  placeholder="例：全自動背包與交易系統"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">{t('英文標題:', 'Title (EN):')}</label>
                <input
                  type="text"
                  required
                  value={newProductForm.titleEn}
                  onChange={(e) => setNewProductForm({ ...newProductForm, titleEn: e.target.value })}
                  placeholder="e.g. Advanced Inventory & Trade Framework"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">{t('Robux 價格 (R$):', 'Robux Price (R$):')}</label>
                  <input
                    type="number"
                    required
                    value={newProductForm.priceRobux}
                    onChange={(e) => setNewProductForm({ ...newProductForm, priceRobux: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{t('台幣價格 (NT$):', 'TWD Price (NT$):')}</label>
                  <input
                    type="number"
                    required
                    value={newProductForm.priceTwd}
                    onChange={(e) => setNewProductForm({ ...newProductForm, priceTwd: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">{t('分類類型:', 'Category:')}</label>
                <select
                  value={newProductForm.categoryId}
                  onChange={(e) => setNewProductForm({ ...newProductForm, categoryId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{lang === 'zh' ? c.nameZh : c.nameEn}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">{t('Luau 範例腳本模板:', 'Luau Config Template:')}</label>
                <textarea
                  rows="3"
                  value={newProductForm.luauTemplate}
                  onChange={(e) => setNewProductForm({ ...newProductForm, luauTemplate: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-300 focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2.5 rounded-xl transition"
                >
                  {userRole === 'owner' ? t('直接發布至市集', 'Publish Directly') : t('提交至站長審核 (Submit)', 'Submit for Review')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SHOPPING CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
          <div className="bg-[#090D14] border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl relative">
            
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="text-cyan-400" size={18} />
                  <h3 className="text-sm font-bold text-white font-mono">{t('您的購物車', 'Your Shopping Cart')}</h3>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              {cart.length > 0 ? (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {cart.map((cartItem) => (
                    <div key={cartItem.cartId} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between font-mono text-xs">
                      <div>
                        <h4 className="font-bold text-white mb-0.5">{lang === 'zh' ? cartItem.product.titleZh : cartItem.product.titleEn}</h4>
                        <div className="text-[10px] text-slate-400">
                          License: {cartItem.config.license.id} | Color: {cartItem.config.color.name}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-cyan-400 font-bold">{formatPrice(cartItem.finalPriceRobux, cartItem.finalPriceTwd)}</div>
                        <button onClick={() => handleRemoveFromCart(cartItem.cartId)} className="text-[10px] text-rose-400 hover:underline">
                          {t('移除', 'Remove')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 font-mono text-xs">
                  {t('購物車內無物品', 'Your cart is empty')}
                </div>
              )}
            </div>

            {/* Checkout Options */}
            {cart.length > 0 && (
              <div className="border-t border-slate-800 pt-4 space-y-4 font-mono">
                {/* Coupon input */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="PROMO CODE (e.g. TWRBLX)"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 uppercase"
                  />
                  <button onClick={handleApplyCoupon} className="bg-slate-800 hover:bg-slate-700 text-xs px-3 py-1.5 rounded-lg text-white">
                    {t('套用', 'Apply')}
                  </button>
                </div>

                {/* Payment Option Picker */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 block">{t('選擇付款方式:', 'Payment Method:')}</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => setPaymentMethod('alipay')}
                      className={`p-2 rounded-lg border text-center transition ${paymentMethod === 'alipay' ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300' : 'border-slate-800 bg-slate-900 text-slate-400'}`}
                    >
                      AlipayHK / 支付寶
                    </button>
                    <button
                      onClick={() => setPaymentMethod('fps')}
                      className={`p-2 rounded-lg border text-center transition ${paymentMethod === 'fps' ? 'border-purple-500 bg-purple-950/40 text-purple-300' : 'border-slate-800 bg-slate-900 text-slate-400'}`}
                    >
                      FPS 轉數快 / Robux
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-slate-800">
                  <span className="text-slate-300">{t('結帳總計:', 'Total:')}</span>
                  <span className="text-cyan-400 text-base">{formatPrice(cartTotals.robux, cartTotals.twd)}</span>
                </div>

                <button
                  onClick={handleDiscordCheckout}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-purple-900/40 flex items-center justify-center space-x-2"
                >
                  <ExternalLink size={14} />
                  <span>{t('開通 Discord Ticket 結帳', 'Checkout via Discord Ticket')}</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}