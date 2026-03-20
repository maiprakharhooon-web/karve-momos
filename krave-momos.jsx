import { useState, useEffect } from "react";

/* ─── MENU DATA ─────────────────────────────────────────────── */
const MENU = [
  {
    category: "🥟 Steamed Momos",
    items: [
      { id: 1,  name: "Veg Steamed Momos",      price: 80,  desc: "Classic steamed dumplings with spiced vegetable filling", badge: "Bestseller" },
      { id: 2,  name: "Chicken Steamed Momos",  price: 100, desc: "Juicy chicken filling wrapped in soft dough",              badge: "" },
      { id: 3,  name: "Paneer Steamed Momos",   price: 110, desc: "Cottage cheese with herbs and spices",                    badge: "Chef's Pick" },
      { id: 4,  name: "Mushroom Steamed Momos", price: 90,  desc: "Earthy mushrooms with garlic and ginger",                 badge: "" },
    ],
  },
  {
    category: "🔥 Fried Momos",
    items: [
      { id: 5,  name: "Veg Fried Momos",     price: 90,  desc: "Golden crispy fried with spiced veggie filling", badge: "Bestseller" },
      { id: 6,  name: "Chicken Fried Momos", price: 120, desc: "Crispy outside, succulent chicken inside",        badge: "" },
      { id: 7,  name: "Paneer Fried Momos",  price: 130, desc: "Paneer stuffed golden dumplings",                 badge: "" },
      { id: 8,  name: "Mix Fried Momos",     price: 140, desc: "A mix of veg & chicken fried momos",             badge: "Popular" },
    ],
  },
  {
    category: "🍳 Pan Fried Momos",
    items: [
      { id: 9,  name: "Veg Pan Fried Momos",     price: 95,  desc: "Crisp bottom, soft top — best of both worlds", badge: "" },
      { id: 10, name: "Chicken Pan Fried Momos",  price: 120, desc: "Char-kissed chicken dumplings",               badge: "Chef's Pick" },
      { id: 11, name: "Paneer Pan Fried Momos",   price: 130, desc: "Pan seared with herbs and sesame",            badge: "" },
    ],
  },
  {
    category: "🌶️ Tandoori Momos",
    items: [
      { id: 12, name: "Veg Tandoori Momos",     price: 110, desc: "Smoky tandoori spiced vegetable dumplings", badge: "Spicy" },
      { id: 13, name: "Chicken Tandoori Momos", price: 140, desc: "Smoky char with aromatic chicken",          badge: "Spicy" },
      { id: 14, name: "Paneer Tandoori Momos",  price: 150, desc: "Rich paneer with tandoor char",             badge: "" },
    ],
  },
  {
    category: "🍜 Soup Momos",
    items: [
      { id: 15, name: "Veg Soup Momos",    price: 100, desc: "Steamed dumplings in aromatic clear soup", badge: "" },
      { id: 16, name: "Chicken Soup Momos",price: 130, desc: "Warm brothy goodness with chicken momos",   badge: "Bestseller" },
      { id: 17, name: "Spicy Momo Soup",   price: 140, desc: "Fiery red broth with momos",               badge: "Spicy" },
    ],
  },
  {
    category: "🔮 Jhol Momos",
    items: [
      { id: 18, name: "Veg Jhol Momos",     price: 110, desc: "Momos swimming in rich tomato-sesame jhol", badge: "Popular" },
      { id: 19, name: "Chicken Jhol Momos", price: 140, desc: "Chicken momos in spicy jhol sauce",         badge: "Bestseller" },
      { id: 20, name: "Paneer Jhol Momos",  price: 150, desc: "Creamy paneer momos with tangy jhol",       badge: "" },
    ],
  },
  {
    category: "🥤 Drinks & Sides",
    items: [
      { id: 21, name: "Masala Chai",         price: 30, desc: "Spiced milk tea",                            badge: "" },
      { id: 22, name: "Cold Coffee",         price: 60, desc: "Chilled blended coffee with ice cream",      badge: "" },
      { id: 23, name: "Fresh Lime Soda",     price: 40, desc: "Zesty and refreshing",                       badge: "" },
      { id: 24, name: "Extra Chutney Plate", price: 20, desc: "Our signature red & white chutney",          badge: "" },
      { id: 25, name: "Choco Lava Momo",     price: 90, desc: "Dessert momo with molten chocolate inside",  badge: "New!" },
    ],
  },
];

const MAP_LINK  = "https://maps.app.goo.gl/DAARckDNUjEqN5o36";
const OWNER_PIN = "1234";
const BADGE_COLORS = { "Bestseller":"#e8500a", "Chef's Pick":"#7c3aed", "Popular":"#059669", "Spicy":"#dc2626", "New!":"#d97706" };

/* ── BADGE ── */
function Badge({ text }) {
  if (!text) return null;
  return (
    <span style={{ background: BADGE_COLORS[text]||"#e8500a", color:"#fff", fontSize:"10px", fontWeight:700,
      padding:"2px 8px", borderRadius:"20px", textTransform:"uppercase", letterSpacing:"0.5px" }}>
      {text}
    </span>
  );
}

/* ─────────────────── ROOT APP ──────────────────────────────── */
export default function KraveMomos() {
  const [page,         setPage]        = useState("home");
  const [cart,         setCart]        = useState([]);
  const [tableNum,     setTableNum]    = useState("");
  const [orders,       setOrders]      = useState([]);
  const [lastTable,    setLastTable]   = useState("");   // kept for confirm screen
  const [orderPlaced,  setOrderPlaced] = useState(false);
  const [activeCat,    setActiveCat]   = useState(0);
  const [ownerPin,     setOwnerPin]    = useState("");
  const [ownerAuth,    setOwnerAuth]   = useState(false);
  const [pinError,     setPinError]    = useState(false);
  const [cartAnim,     setCartAnim]    = useState(false);
  const [menuOpen,     setMenuOpen]    = useState(false);

  /* ── storage ── */
  useEffect(() => { loadOrders(); }, []);
  async function loadOrders() {
    try { const r = await window.storage.get("krave_orders"); if (r) setOrders(JSON.parse(r.value)); } catch {}
  }
  async function saveOrders(o) {
    try { await window.storage.set("krave_orders", JSON.stringify(o)); } catch {}
  }

  /* ── cart ── */
  function addToCart(item) {
    setCart(prev => {
      const ex = prev.find(i => i.id === item.id);
      return ex ? prev.map(i => i.id===item.id ? {...i, qty:i.qty+1} : i) : [...prev, {...item, qty:1}];
    });
    setCartAnim(true); setTimeout(() => setCartAnim(false), 500);
  }
  function removeFromCart(id) {
    setCart(prev => {
      const ex = prev.find(i => i.id===id); if (!ex) return prev;
      return ex.qty===1 ? prev.filter(i => i.id!==id) : prev.map(i => i.id===id ? {...i, qty:i.qty-1} : i);
    });
  }
  const cartQty   = id => cart.find(i => i.id===id)?.qty || 0;
  const cartTotal = cart.reduce((s,i) => s + i.price*i.qty, 0);
  const cartCount = cart.reduce((s,i) => s + i.qty, 0);

  /* ── place order ── */
  async function placeOrder() {
    if (!tableNum || !cart.length) return;
    const order = {
      id: Date.now(), table: tableNum, items: cart, total: cartTotal,
      time: new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}),
      date: new Date().toLocaleDateString("en-IN"), status:"Preparing",
    };
    const fresh = [order, ...orders];
    setOrders(fresh); await saveOrders(fresh);
    setLastTable(tableNum);       // save before clearing
    setCart([]); setTableNum("");
    setOrderPlaced(true);
    setTimeout(() => { setOrderPlaced(false); setPage("home"); }, 3500);
  }

  /* ── owner ── */
  function updateStatus(id, status) {
    const u = orders.map(o => o.id===id ? {...o, status} : o);
    setOrders(u); saveOrders(u);
  }
  function clearOrders() { setOrders([]); saveOrders([]); }

  const statusColors = { Preparing:"#f59e0b", Ready:"#10b981", Served:"#6b7280" };

  /* ── nav helper ── */
  function navGo(p) {
    setMenuOpen(false);
    if (p==="owner" && !ownerAuth) { setPage("ownerlogin"); return; }
    setPage(p);
  }

  /* ── ORDER PLACED SPLASH ── */
  if (orderPlaced) return (
    <div style={{fontFamily:"'Playfair Display',Georgia,serif",background:"#0d0500",minHeight:"100vh",
      color:"#fff5e6",display:"flex",alignItems:"center",justifyContent:"center",
      flexDirection:"column",gap:"20px",textAlign:"center",padding:"24px"}}>
      <div style={{fontSize:"76px"}}>🎉</div>
      <div style={{fontSize:"clamp(24px,6vw,40px)",fontWeight:900,color:"#ff6b1a"}}>Order Placed!</div>
      <div style={{color:"rgba(255,245,230,0.75)",fontSize:"18px"}}>
        Table {lastTable} — Your momos are being prepared!
      </div>
      <div style={{color:"rgba(255,245,230,0.4)",fontSize:"14px"}}>Returning to home…</div>
    </div>
  );

  /* ── NAV ITEMS ── */
  const navItems = [
    {key:"home",     label:"🏠 Home"},
    {key:"menu",     label:"📋 Menu"},
    {key:"location", label:"📍 Location"},
    {key:"qr",       label:"🔲 QR Code"},
    {key:"owner",    label:"👨‍🍳 Owner"},
  ];
  const isOwnerActive = page==="owner" || page==="ownerlogin";

  /* ── MAIN RENDER ── */
  return (
    <div style={{fontFamily:"'Playfair Display',Georgia,serif",background:"#0d0500",
      minHeight:"100vh",color:"#fff5e6",overflowX:"hidden"}}>

      {/* ──────── NAV ──────── */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,
        background:"rgba(13,5,0,0.97)",backdropFilter:"blur(16px)",
        borderBottom:"1px solid rgba(232,80,10,0.2)",height:"60px",
        display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",gap:"12px"}}>

        {/* Logo */}
        <div onClick={() => { setPage("home"); setMenuOpen(false); }}
          style={{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",flexShrink:0}}>
          <span style={{fontSize:"26px"}}>🥟</span>
          <span style={{fontSize:"20px",fontWeight:900,color:"#ff6b1a",
            textShadow:"0 0 20px rgba(255,107,26,0.5)",letterSpacing:"-0.5px",whiteSpace:"nowrap"}}>
            Krave Momos
          </span>
        </div>

        {/* Desktop links — hidden on very narrow via overflow */}
        <div style={{display:"flex",gap:"4px",alignItems:"center",overflow:"hidden",flex:1,justifyContent:"flex-end"}}>
          <div style={{display:"flex",gap:"4px",alignItems:"center",flexShrink:0}}>
            {navItems.map(({key,label}) => {
              const active = key==="owner" ? isOwnerActive : page===key;
              return (
                <button key={key} onClick={() => navGo(key)} style={{
                  padding:"7px 11px",
                  background:active?"rgba(232,80,10,0.2)":"transparent",
                  border:active?"1px solid rgba(232,80,10,0.4)":"1px solid transparent",
                  borderRadius:"8px",color:active?"#ff6b1a":"rgba(255,245,230,0.7)",
                  cursor:"pointer",fontSize:"12px",fontFamily:"inherit",fontWeight:active?700:400,
                  transition:"all 0.2s",whiteSpace:"nowrap",
                  display: menuOpen ? "none" : undefined,
                }}>{label}</button>
              );
            })}
            {/* Cart button — always visible */}
            <button onClick={() => navGo("cart")} style={{
              padding:"7px 13px",background:"linear-gradient(135deg,#e8500a,#c73d00)",
              border:"none",borderRadius:"8px",color:"#fff",cursor:"pointer",
              fontSize:"13px",fontWeight:700,fontFamily:"inherit",
              display:"flex",alignItems:"center",gap:"5px",flexShrink:0,
              transform:cartAnim?"scale(1.12)":"scale(1)",
              transition:"transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              boxShadow:"0 4px 16px rgba(232,80,10,0.4)",
            }}>
              🛒 Cart
              {cartCount>0 && (
                <span style={{background:"#fff",color:"#e8500a",borderRadius:"50%",
                  width:"19px",height:"19px",display:"flex",alignItems:"center",
                  justifyContent:"center",fontSize:"11px",fontWeight:900}}>
                  {cartCount}
                </span>
              )}
            </button>
            {/* Hamburger */}
            <button onClick={() => setMenuOpen(m => !m)} style={{
              padding:"7px 10px",background:"rgba(255,107,26,0.12)",
              border:"1px solid rgba(255,107,26,0.25)",borderRadius:"8px",
              color:"#ff6b1a",cursor:"pointer",fontSize:"18px",lineHeight:1,flexShrink:0,
            }}>{menuOpen ? "✕" : "☰"}</button>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{position:"fixed",top:"60px",left:0,right:0,zIndex:190,
          background:"rgba(13,5,0,0.98)",borderBottom:"1px solid rgba(232,80,10,0.2)",
          padding:"12px",display:"flex",flexDirection:"column",gap:"6px"}}>
          {navItems.map(({key,label}) => {
            const active = key==="owner" ? isOwnerActive : page===key;
            return (
              <button key={key} onClick={() => navGo(key)} style={{
                padding:"12px 16px",
                background:active?"rgba(232,80,10,0.2)":"transparent",
                border:active?"1px solid rgba(232,80,10,0.4)":"1px solid rgba(255,107,26,0.1)",
                borderRadius:"10px",color:active?"#ff6b1a":"rgba(255,245,230,0.8)",
                cursor:"pointer",fontSize:"15px",fontFamily:"inherit",fontWeight:active?700:400,
                textAlign:"left",
              }}>{label}</button>
            );
          })}
        </div>
      )}

      {/* ──────── PAGE CONTENT ──────── */}
      <div style={{paddingTop:"60px"}}>
        {page==="home"       && <HomePage      setPage={p => { setPage(p); setMenuOpen(false); }} />}
        {page==="menu"       && <MenuPage      menu={MENU} addToCart={addToCart} removeFromCart={removeFromCart}
                                               cartQty={cartQty} activeCat={activeCat} setActiveCat={setActiveCat}
                                               setPage={p => { setPage(p); setMenuOpen(false); }} />}
        {page==="cart"       && <CartPage      cart={cart} addToCart={addToCart} removeFromCart={removeFromCart}
                                               cartTotal={cartTotal} tableNum={tableNum} setTableNum={setTableNum}
                                               placeOrder={placeOrder} setPage={p => { setPage(p); setMenuOpen(false); }} />}
        {page==="location"   && <LocationPage />}
        {page==="qr"         && <QRPage />}
        {page==="ownerlogin" && <OwnerLogin    ownerPin={ownerPin} setOwnerPin={setOwnerPin} pinError={pinError}
                                               tryLogin={() => {
                                                 if (ownerPin===OWNER_PIN) { setOwnerAuth(true); setPinError(false); setPage("owner"); }
                                                 else setPinError(true);
                                               }} />}
        {page==="owner" && ownerAuth &&
          <OwnerDashboard orders={orders} updateStatus={updateStatus}
                          clearOrders={clearOrders} statusColors={statusColors} />}
      </div>
    </div>
  );
}

/* ─────────────────── HOME ──────────────────────────────────── */
function HomePage({ setPage }) {
  return (
    <div>
      {/* Hero */}
      <div style={{minHeight:"92vh",
        background:"radial-gradient(ellipse at 30% 40%,rgba(232,80,10,0.28) 0%,transparent 60%),radial-gradient(ellipse at 75% 65%,rgba(180,40,0,0.18) 0%,transparent 55%),linear-gradient(180deg,#0d0500 0%,#1a0800 100%)",
        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        textAlign:"center",padding:"40px 20px",position:"relative",overflow:"hidden"}}>

        <div style={{position:"absolute",top:"8%",right:"4%",width:"260px",height:"260px",
          borderRadius:"50%",border:"1px solid rgba(232,80,10,0.1)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"12%",left:"3%",width:"160px",height:"160px",
          borderRadius:"50%",border:"1px solid rgba(232,80,10,0.08)",pointerEvents:"none"}}/>

        <div style={{fontSize:"70px",marginBottom:"12px",filter:"drop-shadow(0 0 30px rgba(255,107,26,0.7))"}}>🥟</div>
        <div style={{fontSize:"clamp(11px,2.5vw,14px)",fontWeight:600,color:"#e8500a",
          letterSpacing:"6px",textTransform:"uppercase",marginBottom:"12px"}}>
          Prayagraj's Finest
        </div>
        <h1 style={{fontSize:"clamp(42px,10vw,96px)",fontWeight:900,lineHeight:1.0,margin:"0 0 18px",color:"#fff5e6"}}>
          Krave<br/>
          <span style={{color:"#ff6b1a",textShadow:"0 0 40px rgba(255,107,26,0.5)"}}>Momos</span>
        </h1>
        <p style={{fontSize:"clamp(14px,2.5vw,17px)",color:"rgba(255,245,230,0.6)",
          maxWidth:"420px",lineHeight:1.8,marginBottom:"34px"}}>
          Handcrafted dumplings with soul. Steamed, fried, tandoori — every bite is an experience.
        </p>
        <div style={{display:"flex",gap:"12px",flexWrap:"wrap",justifyContent:"center"}}>
          <button onClick={() => setPage("menu")} style={{padding:"13px 30px",
            background:"linear-gradient(135deg,#e8500a,#c73d00)",border:"none",borderRadius:"12px",
            color:"#fff",fontSize:"16px",fontWeight:800,cursor:"pointer",
            fontFamily:"'Playfair Display',Georgia,serif",
            boxShadow:"0 8px 32px rgba(232,80,10,0.5)"}}>
            Order Now 🥟
          </button>
          <button onClick={() => setPage("location")} style={{padding:"13px 30px",
            background:"transparent",border:"2px solid rgba(255,245,230,0.2)",borderRadius:"12px",
            color:"#fff5e6",fontSize:"15px",fontWeight:600,cursor:"pointer",
            fontFamily:"'Playfair Display',Georgia,serif"}}>
            📍 Find Us
          </button>
        </div>

        <div style={{display:"flex",gap:"40px",marginTop:"52px",flexWrap:"wrap",justifyContent:"center"}}>
          {[["25+","Menu Items"],["⭐ 4.8","Rating"],["100%","Fresh Daily"]].map(([n,l]) => (
            <div key={l} style={{textAlign:"center"}}>
              <div style={{fontSize:"26px",fontWeight:900,color:"#ff6b1a"}}>{n}</div>
              <div style={{fontSize:"11px",color:"rgba(255,245,230,0.5)",letterSpacing:"1px"}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{padding:"52px 20px",background:"#0d0500"}}>
        <div style={{maxWidth:"920px",margin:"0 auto"}}>
          <h2 style={{textAlign:"center",fontSize:"clamp(24px,5vw,34px)",fontWeight:900,
            marginBottom:"36px",color:"#ff6b1a"}}>
            How It Works
          </h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:"16px"}}>
            {[
              {icon:"📋",title:"Browse Menu",    desc:"Explore our full range of handcrafted momos & drinks"},
              {icon:"🛒",title:"Add to Cart",    desc:"Pick your favourites and adjust quantities freely"},
              {icon:"🪑",title:"Pick Your Table",desc:"Choose your table number from the grid"},
              {icon:"🥟",title:"Get Served!",    desc:"Fresh hot momos delivered right to your table"},
            ].map((f,i) => (
              <div key={i} style={{background:"linear-gradient(135deg,rgba(255,107,26,0.09),rgba(255,107,26,0.03))",
                border:"1px solid rgba(255,107,26,0.15)",borderRadius:"16px",padding:"24px 16px",textAlign:"center"}}>
                <div style={{fontSize:"36px",marginBottom:"10px"}}>{f.icon}</div>
                <div style={{fontSize:"14px",fontWeight:700,marginBottom:"6px",color:"#fff5e6"}}>{f.title}</div>
                <div style={{fontSize:"12px",color:"rgba(255,245,230,0.5)",lineHeight:1.65}}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── MENU ──────────────────────────────────── */
function MenuPage({ menu, addToCart, removeFromCart, cartQty, activeCat, setActiveCat, setPage }) {
  return (
    <div style={{maxWidth:"1100px",margin:"0 auto",padding:"26px 16px"}}>
      <h2 style={{fontSize:"clamp(26px,6vw,38px)",fontWeight:900,color:"#ff6b1a",marginBottom:"6px"}}>Our Menu</h2>
      <p style={{color:"rgba(255,245,230,0.5)",marginBottom:"22px",fontSize:"13px"}}>
        All momos served with our signature red & white chutney
      </p>

      {/* Category tabs */}
      <div style={{display:"flex",gap:"8px",overflowX:"auto",paddingBottom:"12px",marginBottom:"24px",
        scrollbarWidth:"none",msOverflowStyle:"none"}}>
        {menu.map((cat,i) => (
          <button key={i} onClick={() => setActiveCat(i)} style={{
            padding:"7px 14px",flexShrink:0,
            background:activeCat===i?"linear-gradient(135deg,#e8500a,#c73d00)":"rgba(255,107,26,0.08)",
            border:activeCat===i?"none":"1px solid rgba(255,107,26,0.2)",
            borderRadius:"20px",color:activeCat===i?"#fff":"rgba(255,245,230,0.7)",
            cursor:"pointer",fontFamily:"inherit",fontSize:"12px",fontWeight:activeCat===i?700:400,
            whiteSpace:"nowrap",transition:"all 0.2s",
          }}>
            {cat.category}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <h3 style={{fontSize:"18px",fontWeight:800,color:"#ff6b1a",marginBottom:"16px",
        borderBottom:"1px solid rgba(255,107,26,0.15)",paddingBottom:"10px"}}>
        {menu[activeCat].category}
      </h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:"12px"}}>
        {menu[activeCat].items.map(item => {
          const qty = cartQty(item.id);
          return (
            <div key={item.id} style={{
              background:"linear-gradient(135deg,rgba(255,107,26,0.08),rgba(13,5,0,0.9))",
              border:"1px solid rgba(255,107,26,0.15)",borderRadius:"14px",padding:"16px",
              display:"flex",flexDirection:"column",gap:"10px",
            }}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:"14px",fontWeight:700,color:"#fff5e6",marginBottom:"5px"}}>{item.name}</div>
                  <Badge text={item.badge}/>
                </div>
                <span style={{fontSize:"16px",fontWeight:900,color:"#ff6b1a",marginLeft:"10px",flexShrink:0}}>
                  ₹{item.price}
                </span>
              </div>
              <p style={{fontSize:"12px",color:"rgba(255,245,230,0.5)",margin:0,lineHeight:1.6}}>{item.desc}</p>
              {qty===0 ? (
                <button onClick={() => addToCart(item)} style={{
                  padding:"9px",background:"linear-gradient(135deg,#e8500a,#c73d00)",
                  border:"none",borderRadius:"9px",color:"#fff",
                  fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",
                }}>
                  + Add to Cart
                </button>
              ) : (
                <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                  <button onClick={() => removeFromCart(item.id)} style={{
                    width:"34px",height:"34px",background:"rgba(255,107,26,0.2)",
                    border:"1px solid rgba(255,107,26,0.3)",borderRadius:"8px",
                    color:"#ff6b1a",fontSize:"20px",cursor:"pointer",fontWeight:900,
                    display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1,
                  }}>−</button>
                  <span style={{flex:1,textAlign:"center",fontSize:"17px",fontWeight:800,color:"#ff6b1a"}}>{qty}</span>
                  <button onClick={() => addToCart(item)} style={{
                    width:"34px",height:"34px",background:"linear-gradient(135deg,#e8500a,#c73d00)",
                    border:"none",borderRadius:"8px",color:"#fff",fontSize:"20px",cursor:"pointer",
                    fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1,
                  }}>+</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={() => setPage("cart")} style={{
        marginTop:"26px",padding:"12px 26px",
        background:"linear-gradient(135deg,#e8500a,#c73d00)",border:"none",borderRadius:"12px",
        color:"#fff",fontSize:"15px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",
        boxShadow:"0 8px 24px rgba(232,80,10,0.4)",
      }}>
        🛒 View Cart
      </button>
    </div>
  );
}

/* ─────────────────── CART ──────────────────────────────────── */
function CartPage({ cart, addToCart, removeFromCart, cartTotal, tableNum, setTableNum, placeOrder, setPage }) {
  const hasItems = cart.length > 0;
  const hasTable = tableNum.trim() !== "";
  const canOrder = hasItems && hasTable;

  return (
    <div style={{maxWidth:"660px",margin:"0 auto",padding:"26px 16px"}}>
      <h2 style={{fontSize:"clamp(26px,6vw,38px)",fontWeight:900,color:"#ff6b1a",marginBottom:"20px"}}>Your Cart</h2>

      {!hasItems ? (
        <div style={{textAlign:"center",padding:"56px 0"}}>
          <div style={{fontSize:"60px",marginBottom:"12px"}}>🥟</div>
          <p style={{color:"rgba(255,245,230,0.5)",fontSize:"16px",marginBottom:"20px"}}>
            Your cart is empty — let's fix that!
          </p>
          <button onClick={() => setPage("menu")} style={{padding:"11px 24px",
            background:"linear-gradient(135deg,#e8500a,#c73d00)",border:"none",borderRadius:"10px",
            color:"#fff",fontSize:"14px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            Browse Menu
          </button>
        </div>
      ) : (
        <>
          {/* Items */}
          <div style={{display:"flex",flexDirection:"column",gap:"9px",marginBottom:"20px"}}>
            {cart.map(item => (
              <div key={item.id} style={{background:"rgba(255,107,26,0.07)",
                border:"1px solid rgba(255,107,26,0.15)",borderRadius:"12px",
                padding:"13px",display:"flex",alignItems:"center",gap:"10px"}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:"13px",fontWeight:700,color:"#fff5e6"}}>{item.name}</div>
                  <div style={{fontSize:"11px",color:"rgba(255,245,230,0.5)"}}>₹{item.price} each</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                  <button onClick={() => removeFromCart(item.id)} style={{
                    width:"30px",height:"30px",background:"rgba(255,107,26,0.2)",
                    border:"1px solid rgba(255,107,26,0.3)",borderRadius:"6px",color:"#ff6b1a",
                    fontSize:"18px",cursor:"pointer",display:"flex",alignItems:"center",
                    justifyContent:"center",lineHeight:1,
                  }}>−</button>
                  <span style={{width:"24px",textAlign:"center",fontSize:"15px",fontWeight:800,color:"#ff6b1a"}}>
                    {item.qty}
                  </span>
                  <button onClick={() => addToCart(item)} style={{
                    width:"30px",height:"30px",background:"linear-gradient(135deg,#e8500a,#c73d00)",
                    border:"none",borderRadius:"6px",color:"#fff",fontSize:"18px",cursor:"pointer",
                    display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1,
                  }}>+</button>
                </div>
                <div style={{width:"55px",textAlign:"right",fontSize:"13px",fontWeight:800,color:"#ff6b1a"}}>
                  ₹{item.price*item.qty}
                </div>
              </div>
            ))}
          </div>

          {/* Summary + table picker */}
          <div style={{background:"rgba(255,107,26,0.07)",border:"1px solid rgba(255,107,26,0.2)",
            borderRadius:"14px",padding:"20px",marginBottom:"20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"19px",fontWeight:900,
              color:"#fff5e6",marginBottom:"20px"}}>
              <span>Total</span>
              <span style={{color:"#ff6b1a"}}>₹{cartTotal}</span>
            </div>

            <div style={{fontSize:"12px",fontWeight:700,color:"rgba(255,245,230,0.6)",
              marginBottom:"10px",letterSpacing:"1px",textTransform:"uppercase"}}>
              🪑 Select Your Table Number
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"7px"}}>
              {Array.from({length:12},(_,i)=>i+1).map(n => (
                <button key={n} onClick={() => setTableNum(String(n))} style={{
                  width:"44px",height:"44px",
                  background:tableNum===String(n)?"linear-gradient(135deg,#e8500a,#c73d00)":"rgba(255,107,26,0.1)",
                  border:tableNum===String(n)?"none":"1px solid rgba(255,107,26,0.2)",
                  borderRadius:"10px",color:tableNum===String(n)?"#fff":"rgba(255,245,230,0.7)",
                  fontSize:"15px",fontWeight:800,cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s",
                }}>{n}</button>
              ))}
            </div>
            {hasTable && (
              <div style={{marginTop:"10px",fontSize:"13px",color:"#10b981",fontWeight:600}}>
                ✅ Table {tableNum} selected
              </div>
            )}
          </div>

          <button onClick={placeOrder} disabled={!canOrder} style={{
            width:"100%",padding:"15px",fontSize:"17px",fontWeight:900,fontFamily:"inherit",
            background:canOrder?"linear-gradient(135deg,#e8500a,#c73d00)":"rgba(255,255,255,0.07)",
            border:"none",borderRadius:"12px",
            color:canOrder?"#fff":"rgba(255,245,230,0.3)",
            cursor:canOrder?"pointer":"not-allowed",
            boxShadow:canOrder?"0 8px 32px rgba(232,80,10,0.5)":"none",
            transition:"all 0.2s",
          }}>
            {!hasTable ? "⚠️ Please select a table number first" : "Place Order 🥟"}
          </button>
        </>
      )}
    </div>
  );
}

/* ─────────────────── LOCATION ──────────────────────────────── */
function LocationPage() {
  const [locating, setLocating] = useState(false);
  const [navDone,  setNavDone]  = useState(false);
  const [locError, setLocError] = useState("");

  function getDirections() {
    setLocating(true); setLocError(""); setNavDone(false);
    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported on this device.");
      setLocating(false); return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        const url = `https://www.google.com/maps/dir/${latitude},${longitude}/25.4002868,81.867685`;
        window.open(url, "_blank");
        setNavDone(true); setLocating(false);
      },
      () => {
        setLocError("Location access denied. Please allow location permission and try again.");
        setLocating(false);
      },
      { timeout: 10000 }
    );
  }

  return (
    <div style={{maxWidth:"840px",margin:"0 auto",padding:"26px 16px"}}>
      <h2 style={{fontSize:"clamp(26px,6vw,38px)",fontWeight:900,color:"#ff6b1a",marginBottom:"6px"}}>Find Us</h2>
      <p style={{color:"rgba(255,245,230,0.5)",marginBottom:"26px",fontSize:"13px"}}>
        Visit Krave Momos in Prayagraj — best momos in town!
      </p>



      {/* ── RESTAURANT POSTER ── */}
      <div style={{marginBottom:"28px",borderRadius:"24px",overflow:"hidden",
        border:"1px solid rgba(255,107,26,0.25)",boxShadow:"0 0 60px rgba(255,107,26,0.18)"}}>
        <RestaurantPoster />
      </div>

      {/* Info cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",
        gap:"10px",marginBottom:"22px"}}>
        {[
          {icon:"📍",title:"Address",  desc:"Prayagraj, Uttar Pradesh 211001"},
          {icon:"🕐",title:"Hours",    desc:"Mon–Sun: 11 AM – 10:30 PM"},
          {icon:"📞",title:"Call Us",  desc:"+91 XXXXX XXXXX"},
          {icon:"🛵",title:"Delivery", desc:"Available on Zomato & Swiggy"},
          {icon:"🅿️",title:"Parking", desc:"Street parking available nearby"},
          {icon:"🥟",title:"Dine-In", desc:"Order directly from this app!"},
        ].map((info,i) => (
          <div key={i} style={{background:"rgba(255,107,26,0.07)",
            border:"1px solid rgba(255,107,26,0.15)",borderRadius:"12px",
            padding:"14px",display:"flex",gap:"10px",alignItems:"flex-start"}}>
            <span style={{fontSize:"22px",flexShrink:0}}>{info.icon}</span>
            <div>
              <div style={{fontSize:"10px",fontWeight:700,color:"rgba(255,245,230,0.45)",
                letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"2px"}}>{info.title}</div>
              <div style={{fontSize:"12px",fontWeight:600,color:"#fff5e6",lineHeight:1.5}}>{info.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
        <button onClick={getDirections} disabled={locating} style={{
          display:"inline-flex",alignItems:"center",gap:"8px",padding:"12px 20px",
          background:locating?"rgba(255,107,26,0.3)":"linear-gradient(135deg,#e8500a,#c73d00)",
          border:"none",borderRadius:"11px",color:"#fff",fontSize:"13px",fontWeight:700,
          cursor:locating?"not-allowed":"pointer",fontFamily:"inherit",
          boxShadow:"0 6px 20px rgba(232,80,10,0.4)",transition:"all 0.2s",
        }}>
          {locating ? "📡 Locating you…" : "🧭 Navigate from My Location"}
        </button>

        <a href={MAP_LINK} target="_blank" rel="noreferrer" style={{
          display:"inline-flex",alignItems:"center",gap:"8px",padding:"12px 20px",
          background:"rgba(255,107,26,0.1)",border:"1px solid rgba(255,107,26,0.35)",
          borderRadius:"11px",color:"#ff6b1a",textDecoration:"none",fontSize:"13px",fontWeight:700,
        }}>
          📌 Open in Google Maps
        </a>

        <button onClick={() => { try { navigator.clipboard.writeText("25.4002868, 81.867685"); } catch {} }}
          style={{display:"inline-flex",alignItems:"center",gap:"8px",padding:"12px 20px",
            background:"rgba(255,107,26,0.07)",border:"1px solid rgba(255,107,26,0.2)",
            borderRadius:"11px",color:"rgba(255,245,230,0.7)",fontSize:"13px",fontWeight:600,
            cursor:"pointer",fontFamily:"inherit"}}>
          📋 Copy Coordinates
        </button>
      </div>

      {locError && (
        <div style={{marginTop:"12px",padding:"11px 14px",background:"rgba(239,68,68,0.12)",
          border:"1px solid rgba(239,68,68,0.3)",borderRadius:"9px",color:"#f87171",fontSize:"12px"}}>
          ⚠️ {locError}
        </div>
      )}
      {navDone && !locError && (
        <div style={{marginTop:"12px",padding:"11px 14px",background:"rgba(16,185,129,0.1)",
          border:"1px solid rgba(16,185,129,0.3)",borderRadius:"9px",color:"#10b981",fontSize:"12px"}}>
          ✅ Navigation opened! Follow Google Maps to reach Krave Momos.
        </div>
      )}
    </div>
  );
}

/* ── RESTAURANT SCENE ILLUSTRATION ── */
function RestaurantPoster() {
  return (
    <div style={{position:"relative",background:"#1a0800",fontFamily:"'Playfair Display',Georgia,serif"}}>
      <svg viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
        <defs>
          {/* Warm restaurant ambient gradient */}
          <radialGradient id="ambientGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%"  stopColor="#7a2e00" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#0d0500" stopOpacity="1"/>
          </radialGradient>
          {/* Candle light glow */}
          <radialGradient id="candle1" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#ffb347" stopOpacity="0.55"/>
            <stop offset="100%" stopColor="#ffb347" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="candle2" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#ffb347" stopOpacity="0.45"/>
            <stop offset="100%" stopColor="#ffb347" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="candle3" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#ffb347" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#ffb347" stopOpacity="0"/>
          </radialGradient>
          {/* Overhead lamp */}
          <radialGradient id="lamp1" cx="50%" cy="0%" r="80%">
            <stop offset="0%"  stopColor="#ff8c00" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#ff8c00" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="lamp2" cx="50%" cy="0%" r="80%">
            <stop offset="0%"  stopColor="#ff8c00" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#ff8c00" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="lamp3" cx="50%" cy="0%" r="80%">
            <stop offset="0%"  stopColor="#ff8c00" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#ff8c00" stopOpacity="0"/>
          </radialGradient>
          {/* Steam */}
          <filter id="blur2">
            <feGaussianBlur stdDeviation="2"/>
          </filter>
          <filter id="blur4">
            <feGaussianBlur stdDeviation="4"/>
          </filter>
          <filter id="blur1">
            <feGaussianBlur stdDeviation="1.5"/>
          </filter>
          {/* Wood grain */}
          <linearGradient id="woodGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#3b1a08"/>
            <stop offset="40%" stopColor="#2a1205"/>
            <stop offset="100%" stopColor="#1e0d03"/>
          </linearGradient>
          <linearGradient id="woodGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#2e1506"/>
            <stop offset="100%" stopColor="#1a0a02"/>
          </linearGradient>
          <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#1a0a03"/>
            <stop offset="100%" stopColor="#0d0500"/>
          </linearGradient>
          <linearGradient id="plateGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#f5f0e8"/>
            <stop offset="100%" stopColor="#ddd5c0"/>
          </linearGradient>
          <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#1c0a03"/>
            <stop offset="100%" stopColor="#2a1005"/>
          </linearGradient>
          {/* Skin tones */}
          <linearGradient id="skin1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#c68642"/>
            <stop offset="100%" stopColor="#a0622a"/>
          </linearGradient>
          <linearGradient id="skin2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#d4956a"/>
            <stop offset="100%" stopColor="#b5713a"/>
          </linearGradient>
          <linearGradient id="skin3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#b87040"/>
            <stop offset="100%" stopColor="#8a4e28"/>
          </linearGradient>
        </defs>

        {/* ── BACKGROUND WALL ── */}
        <rect width="900" height="520" fill="url(#wallGrad)"/>
        <rect width="900" height="520" fill="url(#ambientGlow)"/>

        {/* Wall panels / wainscoting */}
        <rect x="0" y="0" width="900" height="280" fill="none" stroke="rgba(255,107,26,0.06)" strokeWidth="1"/>
        {[0,180,360,540,720,900].map(x => (
          <line key={x} x1={x} y1="0" x2={x} y2="280" stroke="rgba(255,107,26,0.05)" strokeWidth="0.5"/>
        ))}
        {/* Horizontal chair rail */}
        <rect x="0" y="270" width="900" height="4" fill="rgba(180,80,10,0.25)" rx="2"/>

        {/* ── FLOOR ── */}
        <rect x="0" y="360" width="900" height="160" fill="url(#floorGrad)"/>
        {/* Floor tiles */}
        {[0,90,180,270,360,450,540,630,720,810].map(x => (
          <g key={x}>
            <rect x={x} y="360" width="90" height="80" fill="none" stroke="rgba(255,107,26,0.07)" strokeWidth="0.5"/>
            <rect x={x} y="440" width="90" height="80" fill="none" stroke="rgba(255,107,26,0.07)" strokeWidth="0.5"/>
          </g>
        ))}

        {/* ── DECORATIVE WALL ART ── */}
        {/* Left wall frame */}
        <rect x="30" y="40" width="120" height="80" rx="4" fill="rgba(255,107,26,0.06)" stroke="rgba(255,107,26,0.2)" strokeWidth="1.5"/>
        <rect x="36" y="46" width="108" height="68" rx="2" fill="rgba(255,107,26,0.04)" stroke="rgba(255,107,26,0.1)" strokeWidth="0.8"/>
        <text x="90" y="84" textAnchor="middle" fontSize="22" fill="rgba(255,107,26,0.5)">🥟</text>
        <text x="90" y="104" textAnchor="middle" fontSize="8" fill="rgba(255,245,230,0.25)" fontFamily="Georgia">KRAVE</text>

        {/* Right wall sign */}
        <rect x="750" y="35" width="130" height="90" rx="4" fill="rgba(255,107,26,0.07)" stroke="rgba(255,107,26,0.2)" strokeWidth="1.5"/>
        <text x="815" y="68" textAnchor="middle" fontSize="10" fill="rgba(255,107,26,0.7)" fontWeight="bold" letterSpacing="2">KRAVE MOMOS</text>
        <line x1="765" y1="75" x2="875" y2="75" stroke="rgba(255,107,26,0.25)" strokeWidth="0.8"/>
        <text x="815" y="90" textAnchor="middle" fontSize="8" fill="rgba(255,245,230,0.35)" fontFamily="Georgia,serif">Est. 2024 · Prayagraj</text>
        <text x="815" y="108" textAnchor="middle" fontSize="16" fill="rgba(255,107,26,0.4)">✦ ✦ ✦</text>

        {/* String lights along top */}
        {[60,130,200,270,340,410,480,550,620,690,760,830].map((x,i) => (
          <g key={i}>
            <line x1={x-60} y1="0" x2={x} y2="22" stroke="rgba(255,200,80,0.3)" strokeWidth="0.8"/>
            <ellipse cx={x} cy="22" rx="5" ry="7" fill={i%3===0?"#ffcc44":i%3===1?"#ff8c44":"#ff5533"} opacity="0.75"/>
            <ellipse cx={x} cy="22" rx="8" ry="10" fill="none" filter="url(#blur2)" stroke={i%3===0?"#ffcc44":i%3===1?"#ff8c44":"#ff5533"} strokeOpacity="0.4"/>
          </g>
        ))}

        {/* ── OVERHEAD PENDANT LAMPS ── */}
        {/* Lamp 1 - above left table */}
        <line x1="195" y1="0" x2="195" y2="95" stroke="rgba(255,200,100,0.3)" strokeWidth="1.5"/>
        <ellipse cx="195" cy="90" rx="22" ry="10" fill="#2a1408" stroke="rgba(255,140,0,0.5)" strokeWidth="1.5"/>
        <ellipse cx="195" cy="92" rx="14" ry="6" fill="#ff8c00" opacity="0.3"/>
        <ellipse cx="195" cy="250" rx="130" ry="160" fill="url(#lamp1)" opacity="0.6"/>

        {/* Lamp 2 - above center table */}
        <line x1="450" y1="0" x2="450" y2="85" stroke="rgba(255,200,100,0.3)" strokeWidth="1.5"/>
        <ellipse cx="450" cy="80" rx="24" ry="11" fill="#2a1408" stroke="rgba(255,140,0,0.5)" strokeWidth="1.5"/>
        <ellipse cx="450" cy="82" rx="16" ry="7" fill="#ff8c00" opacity="0.3"/>
        <ellipse cx="450" cy="240" rx="140" ry="165" fill="url(#lamp2)" opacity="0.55"/>

        {/* Lamp 3 - above right table */}
        <line x1="710" y1="0" x2="710" y2="90" stroke="rgba(255,200,100,0.3)" strokeWidth="1.5"/>
        <ellipse cx="710" cy="85" rx="22" ry="10" fill="#2a1408" stroke="rgba(255,140,0,0.5)" strokeWidth="1.5"/>
        <ellipse cx="710" cy="87" rx="14" ry="6" fill="#ff8c00" opacity="0.3"/>
        <ellipse cx="710" cy="245" rx="130" ry="160" fill="url(#lamp3)" opacity="0.55"/>

        {/* ── TABLE 1 (left) ── */}
        {/* Table surface */}
        <ellipse cx="195" cy="355" rx="105" ry="20" fill="#2a1208" stroke="rgba(255,107,26,0.2)" strokeWidth="1"/>
        <rect x="100" y="348" width="190" height="18" rx="8" fill="url(#woodGrad)"/>
        <ellipse cx="195" cy="348" rx="95" ry="16" fill="url(#woodGrad)"/>
        {/* Table leg */}
        <rect x="185" y="365" width="20" height="55" rx="4" fill="#1a0a03"/>
        <ellipse cx="195" cy="420" rx="35" ry="8" fill="#150802" opacity="0.8"/>
        {/* Table highlight */}
        <ellipse cx="175" cy="345" rx="40" ry="7" fill="rgba(255,200,100,0.08)"/>

        {/* Candle glow table 1 */}
        <ellipse cx="195" cy="340" rx="80" ry="80" fill="url(#candle1)"/>

        {/* Plate 1 on table */}
        <ellipse cx="175" cy="350" rx="28" ry="10" fill="url(#plateGrad)" stroke="rgba(200,180,150,0.5)" strokeWidth="0.8"/>
        <ellipse cx="175" cy="349" rx="22" ry="8" fill="rgba(255,245,230,0.15)"/>
        {/* Momos on plate */}
        {[{x:168,y:349},{x:180,y:346},{x:172,y:354}].map((p,i)=>(
          <g key={i}>
            <ellipse cx={p.x} cy={p.y} rx="6" ry="4" fill="#e8c89a" stroke="#c49a5a" strokeWidth="0.5"/>
            <path d={`M${p.x-4},${p.y} Q${p.x},${p.y-5} ${p.x+4},${p.y}`} fill="none" stroke="#b07840" strokeWidth="0.5"/>
          </g>
        ))}
        {/* Steam from plate */}
        <path d="M170,338 Q172,330 170,322" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none" filter="url(#blur1)"/>
        <path d="M176,336 Q179,328 176,320" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none" filter="url(#blur1)"/>
        <path d="M182,337 Q184,329 182,321" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" fill="none" filter="url(#blur1)"/>

        {/* Cup on table 1 */}
        <rect x="212" y="339" width="14" height="16" rx="2" fill="#3d1a08" stroke="rgba(255,107,26,0.3)" strokeWidth="0.8"/>
        <rect x="213" y="340" width="12" height="6" rx="1" fill="rgba(80,30,5,0.8)"/>
        <ellipse cx="219" cy="340" rx="7" ry="2.5" fill="#4a2010"/>

        {/* Candle on table 1 */}
        <rect x="225" y="328" width="7" height="20" rx="2" fill="#f5f0e0"/>
        <ellipse cx="228.5" cy="328" rx="4" ry="2" fill="#f5f0e0"/>
        <path d="M228,320 Q231,315 228,310 Q225,315 228,320" fill="#ffcc44"/>
        <ellipse cx="228.5" cy="316" rx="5" ry="7" fill="url(#candle1)" opacity="0.8"/>

        {/* ── TABLE 2 (center) ── */}
        <ellipse cx="450" cy="365" rx="115" ry="21" fill="#2a1208" stroke="rgba(255,107,26,0.2)" strokeWidth="1"/>
        <rect x="350" y="358" width="200" height="18" rx="8" fill="url(#woodGrad)"/>
        <ellipse cx="450" cy="358" rx="100" ry="17" fill="url(#woodGrad)"/>
        <rect x="440" y="375" width="20" height="55" rx="4" fill="#1a0a03"/>
        <ellipse cx="450" cy="430" rx="38" ry="9" fill="#150802" opacity="0.8"/>
        <ellipse cx="425" cy="355" rx="45" ry="8" fill="rgba(255,200,100,0.08)"/>

        <ellipse cx="450" cy="350" rx="90" ry="90" fill="url(#candle2)"/>

        {/* Two plates on center table */}
        <ellipse cx="420" cy="360" rx="30" ry="11" fill="url(#plateGrad)" stroke="rgba(200,180,150,0.5)" strokeWidth="0.8"/>
        <ellipse cx="420" cy="359" rx="24" ry="8.5" fill="rgba(255,245,230,0.12)"/>
        {[{x:412,y:359},{x:424,y:356},{x:416,y:364},{x:427,y:363}].map((p,i)=>(
          <g key={i}>
            <ellipse cx={p.x} cy={p.y} rx="5.5" ry="3.5" fill="#e8c89a" stroke="#c49a5a" strokeWidth="0.4"/>
            <path d={`M${p.x-3.5},${p.y} Q${p.x},${p.y-4.5} ${p.x+3.5},${p.y}`} fill="none" stroke="#b07840" strokeWidth="0.5"/>
          </g>
        ))}
        <path d="M415,346 Q417,337 415,328" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" filter="url(#blur1)"/>
        <path d="M422,344 Q425,335 422,326" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" fill="none" filter="url(#blur1)"/>

        <ellipse cx="478" cy="361" rx="28" ry="10" fill="url(#plateGrad)" stroke="rgba(200,180,150,0.5)" strokeWidth="0.8"/>
        {[{x:472,y:361},{x:482,y:358},{x:475,y:365}].map((p,i)=>(
          <g key={i}>
            <ellipse cx={p.x} cy={p.y} rx="5" ry="3.5" fill="#e8c89a" stroke="#c49a5a" strokeWidth="0.4"/>
          </g>
        ))}

        {/* Candle center table */}
        <rect x="450" y="336" width="7" height="22" rx="2" fill="#f5f0e0"/>
        <path d="M453,328 Q456,323 453,318 Q450,323 453,328" fill="#ffcc44"/>
        <ellipse cx="453.5" cy="324" rx="6" ry="8" fill="url(#candle2)" opacity="0.7"/>

        {/* ── TABLE 3 (right) ── */}
        <ellipse cx="710" cy="358" rx="105" ry="20" fill="#2a1208" stroke="rgba(255,107,26,0.2)" strokeWidth="1"/>
        <rect x="618" y="351" width="186" height="18" rx="8" fill="url(#woodGrad)"/>
        <ellipse cx="710" cy="351" rx="93" ry="16" fill="url(#woodGrad)"/>
        <rect x="700" y="368" width="20" height="55" rx="4" fill="#1a0a03"/>
        <ellipse cx="710" cy="423" rx="35" ry="8" fill="#150802" opacity="0.8"/>

        <ellipse cx="710" cy="343" rx="80" ry="80" fill="url(#candle3)"/>

        <ellipse cx="695" cy="353" rx="28" ry="10" fill="url(#plateGrad)" stroke="rgba(200,180,150,0.5)" strokeWidth="0.8"/>
        {[{x:688,y:352},{x:699,y:349},{x:693,y:357}].map((p,i)=>(
          <g key={i}>
            <ellipse cx={p.x} cy={p.y} rx="6" ry="4" fill="#e8c89a" stroke="#c49a5a" strokeWidth="0.4"/>
            <path d={`M${p.x-4},${p.y} Q${p.x},${p.y-5} ${p.x+4},${p.y}`} fill="none" stroke="#b07840" strokeWidth="0.5"/>
          </g>
        ))}
        <path d="M690,340 Q692,331 690,322" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none" filter="url(#blur1)"/>
        <path d="M696,338 Q699,329 696,320" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" fill="none" filter="url(#blur1)"/>

        {/* Candle right table */}
        <rect x="724" y="332" width="7" height="20" rx="2" fill="#f5f0e0"/>
        <path d="M727,324 Q730,319 727,314 Q724,319 727,324" fill="#ffcc44"/>
        <ellipse cx="727.5" cy="320" rx="5" ry="7" fill="url(#candle3)" opacity="0.7"/>

        {/* ── CHAIRS ── */}
        {/* Table 1 chairs */}
        <g opacity="0.9">
          <rect x="130" y="370" width="38" height="10" rx="4" fill="#2a1208" stroke="rgba(255,107,26,0.15)" strokeWidth="0.8"/>
          <rect x="133" y="380" width="8" height="30" rx="3" fill="#1e0d04"/>
          <rect x="157" y="380" width="8" height="30" rx="3" fill="#1e0d04"/>
          <rect x="133" y="380" width="32" height="18" rx="3" fill="#3a1a08"/>
          <rect x="130" y="355" width="38" height="5" rx="2" fill="#4a2510"/>
        </g>
        <g opacity="0.9">
          <rect x="222" y="370" width="38" height="10" rx="4" fill="#2a1208" stroke="rgba(255,107,26,0.15)" strokeWidth="0.8"/>
          <rect x="225" y="380" width="8" height="30" rx="3" fill="#1e0d04"/>
          <rect x="248" y="380" width="8" height="30" rx="3" fill="#1e0d04"/>
          <rect x="225" y="380" width="32" height="18" rx="3" fill="#3a1a08"/>
          <rect x="222" y="355" width="38" height="5" rx="2" fill="#4a2510"/>
        </g>

        {/* Table 2 chairs */}
        <g opacity="0.9">
          <rect x="375" y="375" width="42" height="11" rx="4" fill="#2a1208" stroke="rgba(255,107,26,0.15)" strokeWidth="0.8"/>
          <rect x="378" y="386" width="9" height="32" rx="3" fill="#1e0d04"/>
          <rect x="405" y="386" width="9" height="32" rx="3" fill="#1e0d04"/>
          <rect x="378" y="386" width="36" height="20" rx="3" fill="#3a1a08"/>
          <rect x="375" y="360" width="42" height="5" rx="2" fill="#4a2510"/>
        </g>
        <g opacity="0.9">
          <rect x="483" y="375" width="42" height="11" rx="4" fill="#2a1208" stroke="rgba(255,107,26,0.15)" strokeWidth="0.8"/>
          <rect x="486" y="386" width="9" height="32" rx="3" fill="#1e0d04"/>
          <rect x="513" y="386" width="9" height="32" rx="3" fill="#1e0d04"/>
          <rect x="486" y="386" width="36" height="20" rx="3" fill="#3a1a08"/>
          <rect x="483" y="360" width="42" height="5" rx="2" fill="#4a2510"/>
        </g>

        {/* ── PERSON 1 — left table, woman eating ── */}
        {/* Body */}
        <ellipse cx="155" cy="330" rx="26" ry="38" fill="#c0392b" opacity="0.85"/>
        {/* Neck */}
        <rect x="149" y="288" width="14" height="16" rx="6" fill="url(#skin2)"/>
        {/* Head */}
        <ellipse cx="156" cy="278" rx="22" ry="24" fill="url(#skin2)"/>
        {/* Hair - long */}
        <ellipse cx="156" cy="268" rx="22" ry="14" fill="#2c1a0e"/>
        <path d="M134,270 Q128,295 132,315" stroke="#2c1a0e" strokeWidth="10" fill="none" strokeLinecap="round"/>
        <path d="M178,270 Q184,295 180,315" stroke="#2c1a0e" strokeWidth="10" fill="none" strokeLinecap="round"/>
        {/* Face */}
        <ellipse cx="150" cy="280" rx="3" ry="3.5" fill="#1a0a00" opacity="0.8"/>
        <ellipse cx="162" cy="280" rx="3" ry="3.5" fill="#1a0a00" opacity="0.8"/>
        <path d="M150,290 Q156,296 162,290" stroke="#8a4030" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* Nose */}
        <ellipse cx="156" cy="286" rx="2.5" ry="1.5" fill="rgba(160,80,40,0.3)"/>
        {/* Arm reaching for momo */}
        <path d="M140,320 Q150,335 165,345" stroke="url(#skin2)" strokeWidth="10" fill="none" strokeLinecap="round"/>
        {/* Chopsticks */}
        <line x1="164" y1="342" x2="178" y2="352" stroke="#8B6914" strokeWidth="1.5"/>
        <line x1="167" y1="340" x2="181" y2="350" stroke="#8B6914" strokeWidth="1.5"/>
        {/* Momo held */}
        <ellipse cx="180" cy="351" rx="5" ry="3.5" fill="#e8c89a" stroke="#c49a5a" strokeWidth="0.5"/>
        {/* Earring */}
        <circle cx="134" cy="283" r="3" fill="#ffcc44" opacity="0.8"/>
        <circle cx="134" cy="289" r="2" fill="#ffcc44" opacity="0.6"/>

        {/* ── PERSON 2 — left table, man laughing ── */}
        {/* Body */}
        <ellipse cx="235" cy="328" rx="28" ry="36" fill="#1a3a6e" opacity="0.85"/>
        {/* Neck */}
        <rect x="229" y="287" width="14" height="14" rx="6" fill="url(#skin1)"/>
        {/* Head */}
        <ellipse cx="236" cy="276" rx="21" ry="23" fill="url(#skin1)"/>
        {/* Hair - short */}
        <ellipse cx="236" cy="261" rx="21" ry="10" fill="#1a0e06"/>
        {/* Face - laughing */}
        <ellipse cx="229" cy="279" rx="3" ry="3" fill="#1a0a00" opacity="0.8"/>
        <ellipse cx="242" cy="279" rx="3" ry="3" fill="#1a0a00" opacity="0.8"/>
        {/* Happy squinting eyes */}
        <path d="M226,277 Q229,275 232,277" stroke="#1a0a00" strokeWidth="1.5" fill="none"/>
        <path d="M239,277 Q242,275 245,277" stroke="#1a0a00" strokeWidth="1.5" fill="none"/>
        {/* Big smile */}
        <path d="M227,288 Q236,298 245,288" stroke="#5a1a10" strokeWidth="2" fill="rgba(200,80,60,0.5)" strokeLinecap="round"/>
        {/* Arm with cup */}
        <path d="M222,315 Q218,328 215,340" stroke="url(#skin1)" strokeWidth="10" fill="none" strokeLinecap="round"/>
        <rect x="207" y="337" width="12" height="14" rx="2" fill="#3d1a08" stroke="rgba(255,107,26,0.3)" strokeWidth="0.8"/>

        {/* ── PERSON 3 — center table, couple sharing ── */}
        {/* Person 3a — woman left */}
        <ellipse cx="400" cy="325" rx="25" ry="36" fill="#8B1a3a" opacity="0.85"/>
        <rect x="394" y="285" width="13" height="14" rx="6" fill="url(#skin3)"/>
        <ellipse cx="400" cy="274" rx="21" ry="23" fill="url(#skin3)"/>
        {/* Bun hair */}
        <ellipse cx="400" cy="262" rx="21" ry="10" fill="#1a0e06"/>
        <circle cx="400" cy="257" r="12" fill="#1a0e06"/>
        {/* Face */}
        <ellipse cx="393" cy="276" rx="2.8" ry="3" fill="#1a0a00" opacity="0.8"/>
        <ellipse cx="406" cy="276" rx="2.8" ry="3" fill="#1a0a00" opacity="0.8"/>
        <path d="M394,286 Q400,291 406,286" stroke="#7a2828" strokeWidth="1.5" fill="none"/>
        {/* Arm pointing to dish */}
        <path d="M388,312 Q395,325 412,355" stroke="url(#skin3)" strokeWidth="9" fill="none" strokeLinecap="round"/>

        {/* Person 3b — man right */}
        <ellipse cx="498" cy="325" rx="27" ry="36" fill="#2d4a1a" opacity="0.85"/>
        <rect x="492" y="286" width="13" height="14" rx="6" fill="url(#skin1)"/>
        <ellipse cx="498" cy="275" rx="22" ry="23" fill="url(#skin1)"/>
        <ellipse cx="498" cy="262" rx="22" ry="10" fill="#1a0e06"/>
        {/* Slight beard stubble */}
        <ellipse cx="498" cy="286" rx="14" ry="7" fill="rgba(40,20,5,0.15)"/>
        {/* Face */}
        <ellipse cx="490" cy="277" rx="3" ry="3.2" fill="#1a0a00" opacity="0.8"/>
        <ellipse cx="505" cy="277" rx="3" ry="3.2" fill="#1a0a00" opacity="0.8"/>
        <path d="M491,288 Q498,293 505,288" stroke="#7a3020" strokeWidth="1.5" fill="none"/>
        {/* Arm gesture */}
        <path d="M510,312 Q500,328 488,355" stroke="url(#skin1)" strokeWidth="9" fill="none" strokeLinecap="round"/>
        <ellipse cx="487" cy="356" rx="6" ry="4" fill="url(#skin1)"/>

        {/* ── PERSON 4 — right table, solo diner enjoying ── */}
        <ellipse cx="695" cy="325" rx="26" ry="36" fill="#4a1a6e" opacity="0.85"/>
        <rect x="689" y="285" width="13" height="14" rx="6" fill="url(#skin2)"/>
        <ellipse cx="695" cy="275" rx="22" ry="24" fill="url(#skin2)"/>
        {/* Hair */}
        <ellipse cx="695" cy="262" rx="22" ry="11" fill="#1a0e06"/>
        <path d="M673,265 Q668,280 670,300" stroke="#1a0e06" strokeWidth="9" fill="none" strokeLinecap="round"/>
        {/* Face - content eating expression */}
        <ellipse cx="687" cy="276" rx="3" ry="3.2" fill="#1a0a00" opacity="0.8"/>
        <ellipse cx="702" cy="276" rx="3" ry="3.2" fill="#1a0a00" opacity="0.8"/>
        {/* Closed happy eyes */}
        <path d="M684,274 Q687,272 690,274" stroke="#1a0a00" strokeWidth="1.5" fill="none"/>
        <path d="M699,274 Q702,272 705,274" stroke="#1a0a00" strokeWidth="1.5" fill="none"/>
        <path d="M686,286 Q695,293 703,286" stroke="#7a2820" strokeWidth="1.8" fill="none"/>
        {/* Arm with fork/chopstick */}
        <path d="M680,314 Q675,330 676,345" stroke="url(#skin2)" strokeWidth="9" fill="none" strokeLinecap="round"/>
        <line x1="672" y1="342" x2="680" y2="355" stroke="#8B6914" strokeWidth="1.5"/>
        <line x1="677" y1="340" x2="685" y2="353" stroke="#8B6914" strokeWidth="1.5"/>
        {/* Small speech bubble of satisfaction */}
        <ellipse cx="722" cy="258" rx="20" ry="14" fill="rgba(255,107,26,0.15)" stroke="rgba(255,107,26,0.3)" strokeWidth="0.8"/>
        <text x="722" y="263" textAnchor="middle" fontSize="14">😋</text>

        {/* ── WAITER in background ── */}
        <ellipse cx="570" cy="290" rx="18" ry="30" fill="#1a1a1a" opacity="0.8"/>
        <rect x="564" y="260" width="12" height="12" rx="5" fill="url(#skin1)"/>
        <ellipse cx="570" cy="256" rx="16" ry="17" fill="url(#skin1)"/>
        <ellipse cx="570" cy="247" rx="16" ry="8" fill="#1a0e06"/>
        {/* White collar/tie */}
        <path d="M563,263 L567,275 L570,270 L573,275 L577,263" fill="white" opacity="0.9"/>
        {/* Tray with momos */}
        <ellipse cx="590" cy="270" rx="26" ry="8" fill="#3a1a08" stroke="rgba(255,107,26,0.3)" strokeWidth="1"/>
        <ellipse cx="590" cy="267" rx="20" ry="6" fill="url(#plateGrad)" opacity="0.8"/>
        {[{x:584,y:266},{x:592,y:264},{x:587,y:270}].map((p,i)=>(
          <ellipse key={i} cx={p.x} cy={p.y} rx="4" ry="2.8" fill="#e8c89a" stroke="#c49a5a" strokeWidth="0.4"/>
        ))}
        {/* Arm holding tray */}
        <path d="M575,278 Q582,272 590,270" stroke="url(#skin1)" strokeWidth="7" fill="none" strokeLinecap="round"/>
        {/* Waiter face */}
        <ellipse cx="565" cy="257" rx="2.5" ry="2.5" fill="#1a0a00" opacity="0.8"/>
        <ellipse cx="575" cy="257" rx="2.5" ry="2.5" fill="#1a0a00" opacity="0.8"/>
        <path d="M565,263 Q570,267 575,263" stroke="#7a2820" strokeWidth="1.2" fill="none"/>

        {/* ── FOREGROUND TABLE EDGE ── */}
        <rect x="0" y="460" width="900" height="60" fill="url(#woodGrad2)" rx="4"/>
        <ellipse cx="450" cy="460" rx="900" ry="12" fill="rgba(0,0,0,0.3)"/>

        {/* ── POSTER TEXT OVERLAY ── */}
        {/* Bottom banner */}
        <rect x="0" y="462" width="900" height="58" fill="rgba(13,5,0,0.7)"/>
        <line x1="20" y1="472" x2="880" y2="472" stroke="rgba(255,107,26,0.3)" strokeWidth="0.8"/>
        <line x1="20" y1="508" x2="880" y2="508" stroke="rgba(255,107,26,0.3)" strokeWidth="0.8"/>

        <text x="450" y="493" textAnchor="middle" fontSize="13" fontWeight="bold"
          fill="#ff8c44" letterSpacing="6" fontFamily="Georgia,serif">
          COME DINE WITH US · PRAYAGRAJ
        </text>
        <text x="310" y="505" textAnchor="middle" fontSize="9" fill="rgba(255,245,230,0.4)" letterSpacing="3">
          🥟 STEAMED
        </text>
        <text x="450" y="505" textAnchor="middle" fontSize="9" fill="rgba(255,245,230,0.4)" letterSpacing="3">
          🔥 FRIED
        </text>
        <text x="590" y="505" textAnchor="middle" fontSize="9" fill="rgba(255,245,230,0.4)" letterSpacing="3">
          🌶️ TANDOORI
        </text>

        {/* Subtle vignette overlay */}
        <defs>
          <radialGradient id="vignette" cx="50%" cy="50%" r="60%">
            <stop offset="0%"  stopColor="transparent"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0.55)"/>
          </radialGradient>
        </defs>
        <rect width="900" height="520" fill="url(#vignette)"/>
      </svg>

      {/* Caption strip below SVG */}
      <div style={{
        background:"linear-gradient(135deg,rgba(232,80,10,0.12),rgba(180,40,0,0.08))",
        borderTop:"1px solid rgba(255,107,26,0.15)",
        padding:"18px 28px",
        display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"12px",
      }}>
        <div>
          <div style={{fontSize:"17px",fontWeight:900,color:"#ff6b1a",letterSpacing:"0.5px"}}>
            Krave Momos · Dine-In Experience
          </div>
          <div style={{fontSize:"12px",color:"rgba(255,245,230,0.5)",marginTop:"3px"}}>
            Warm ambiance · Candlelit tables · Handcrafted momos served fresh
          </div>
        </div>
        <div style={{display:"flex",gap:"20px",flexWrap:"wrap"}}>
          {[["🥟","25+ Varieties"],["⭐","4.8 Rating"],["🕐","Open Daily"]].map(([icon,text]) => (
            <div key={text} style={{textAlign:"center"}}>
              <div style={{fontSize:"16px"}}>{icon}</div>
              <div style={{fontSize:"10px",color:"rgba(255,245,230,0.5)",marginTop:"2px",whiteSpace:"nowrap"}}>{text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── QR PAGE ───────────────────────────────── */
function QRPage() {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(MAP_LINK)}&color=1a0800&bgcolor=fff8f0&margin=18&qzone=2`;
  const [copied, setCopied] = useState(false);
  const [imgOk,  setImgOk]  = useState(true);

  function handlePrint() {
    const w = window.open("","_blank");
    w.document.write(`
      <html><head><title>Krave Momos QR Code</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#fff; display:flex; align-items:center; justify-content:center; min-height:100vh; font-family:Georgia,serif; }
        .poster { width:420px; border:3px solid #e8500a; border-radius:20px; overflow:hidden; }
        .top { background:#0d0500; padding:28px 20px 18px; text-align:center; }
        .emoji { font-size:52px; }
        .brand { font-size:34px; font-weight:900; color:#ff6b1a; margin:8px 0 4px; letter-spacing:-1px; }
        .sub { font-size:12px; color:rgba(255,245,230,0.55); letter-spacing:4px; text-transform:uppercase; }
        .qr-wrap { background:#fff8f0; padding:28px; text-align:center; }
        .qr-wrap img { width:240px; height:240px; border-radius:8px; display:block; margin:0 auto; }
        .scan { font-size:13px; color:#e8500a; font-weight:700; margin-top:14px; letter-spacing:1px; }
        .bottom { background:#0d0500; padding:16px 20px; text-align:center; }
        .loc { font-size:11px; color:rgba(255,245,230,0.45); letter-spacing:2px; text-transform:uppercase; margin-bottom:4px; }
        .addr { font-size:13px; color:rgba(255,245,230,0.75); }
        .divider { border:none; border-top:1px solid rgba(255,107,26,0.2); margin:10px 0; }
        .cats { font-size:11px; color:rgba(255,107,26,0.6); letter-spacing:2px; }
      </style></head><body>
      <div class="poster">
        <div class="top">
          <div class="emoji">🥟</div>
          <div class="brand">Krave Momos</div>
          <div class="sub">Prayagraj's Finest</div>
        </div>
        <div class="qr-wrap">
          <img src="${qrUrl}" alt="QR Code"/>
          <div class="scan">📲 Scan to Find Us on Maps</div>
        </div>
        <div class="bottom">
          <div class="loc">Visit Us At</div>
          <div class="addr">Prayagraj, Uttar Pradesh</div>
          <hr class="divider"/>
          <div class="cats">🥟 Steamed &nbsp;·&nbsp; 🔥 Fried &nbsp;·&nbsp; 🌶️ Tandoori</div>
        </div>
      </div>
      </body></html>
    `);
    w.document.close();
    setTimeout(() => w.print(), 800);
  }

  return (
    <div style={{maxWidth:"600px",margin:"0 auto",padding:"26px 16px"}}>
      <h2 style={{fontSize:"clamp(26px,6vw,38px)",fontWeight:900,color:"#ff6b1a",marginBottom:"6px"}}>QR Code</h2>
      <p style={{color:"rgba(255,245,230,0.5)",marginBottom:"28px",fontSize:"13px"}}>
        Scan to find us on Google Maps · Print & place on tables for easy access
      </p>

      {/* Poster card */}
      <div style={{border:"2px solid rgba(255,107,26,0.35)",borderRadius:"24px",overflow:"hidden",
        boxShadow:"0 0 60px rgba(255,107,26,0.2)",marginBottom:"24px",background:"#0d0500"}}>

        {/* Top branding */}
        <div style={{background:"linear-gradient(180deg,#1a0800 0%,#0d0500 100%)",
          padding:"32px 24px 20px",textAlign:"center",borderBottom:"1px solid rgba(255,107,26,0.15)"}}>
          <div style={{fontSize:"52px",marginBottom:"8px",filter:"drop-shadow(0 0 20px rgba(255,107,26,0.6))"}}>🥟</div>
          <div style={{fontSize:"32px",fontWeight:900,color:"#ff6b1a",letterSpacing:"-1px",
            textShadow:"0 0 30px rgba(255,107,26,0.4)"}}>Krave Momos</div>
          <div style={{fontSize:"11px",color:"rgba(255,245,230,0.45)",letterSpacing:"5px",
            textTransform:"uppercase",marginTop:"6px"}}>Prayagraj's Finest</div>
        </div>

        {/* QR code area */}
        <div style={{background:"#fff8f0",padding:"32px 24px",textAlign:"center"}}>
          {imgOk ? (
            <div style={{display:"inline-block",padding:"16px",background:"#fff",
              borderRadius:"16px",boxShadow:"0 4px 24px rgba(232,80,10,0.15)"}}>
              <img src={qrUrl} alt="Krave Momos QR Code" width="220" height="220"
                style={{display:"block",borderRadius:"6px"}} onError={()=>setImgOk(false)}/>
            </div>
          ) : (
            <div style={{width:"220px",height:"220px",margin:"0 auto",background:"#f0e8d8",
              borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",
              border:"2px dashed rgba(232,80,10,0.3)"}}>
              <div style={{textAlign:"center",padding:"16px"}}>
                <div style={{fontSize:"32px",marginBottom:"8px"}}>🔲</div>
                <div style={{fontSize:"11px",color:"#8a5020",lineHeight:1.5}}>QR loads when<br/>internet is available</div>
              </div>
            </div>
          )}
          <div style={{marginTop:"16px",fontSize:"13px",fontWeight:700,color:"#e8500a",letterSpacing:"1px"}}>
            📲 Scan with your camera
          </div>
          <div style={{fontSize:"11px",color:"rgba(100,60,20,0.6)",marginTop:"4px"}}>
            Opens Google Maps · Krave Momos, Prayagraj
          </div>
        </div>

        {/* Bottom strip */}
        <div style={{background:"linear-gradient(180deg,#0d0500 0%,#1a0800 100%)",
          padding:"18px 24px",textAlign:"center",borderTop:"1px solid rgba(255,107,26,0.15)"}}>
          <div style={{fontSize:"10px",color:"rgba(255,245,230,0.4)",letterSpacing:"2px",
            textTransform:"uppercase",marginBottom:"4px"}}>Visit Us At</div>
          <div style={{fontSize:"13px",color:"rgba(255,245,230,0.75)",fontWeight:600,marginBottom:"12px"}}>
            📍 Prayagraj, Uttar Pradesh
          </div>
          <div style={{height:"1px",background:"rgba(255,107,26,0.15)",marginBottom:"12px"}}/>
          <div style={{display:"flex",justifyContent:"center",gap:"20px",flexWrap:"wrap"}}>
            {["🥟 Steamed","🔥 Fried","🍳 Pan Fried","🌶️ Tandoori"].map(t=>(
              <span key={t} style={{fontSize:"10px",color:"rgba(255,107,26,0.6)",letterSpacing:"1px"}}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{display:"flex",gap:"10px",flexWrap:"wrap",marginBottom:"24px"}}>
        <button onClick={handlePrint} style={{display:"inline-flex",alignItems:"center",gap:"8px",
          padding:"12px 22px",background:"linear-gradient(135deg,#e8500a,#c73d00)",border:"none",
          borderRadius:"11px",color:"#fff",fontSize:"13px",fontWeight:700,cursor:"pointer",
          fontFamily:"inherit",boxShadow:"0 6px 20px rgba(232,80,10,0.4)"}}>
          🖨️ Print QR Poster
        </button>
        <button onClick={()=>{try{navigator.clipboard.writeText(MAP_LINK);setCopied(true);setTimeout(()=>setCopied(false),2500);}catch{}}}
          style={{display:"inline-flex",alignItems:"center",gap:"8px",padding:"12px 22px",
            background:copied?"rgba(16,185,129,0.15)":"rgba(255,107,26,0.1)",
            border:`1px solid ${copied?"rgba(16,185,129,0.4)":"rgba(255,107,26,0.3)"}`,
            borderRadius:"11px",color:copied?"#10b981":"#ff6b1a",fontSize:"13px",fontWeight:700,
            cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s"}}>
          {copied?"✅ Link Copied!":"📋 Copy Maps Link"}
        </button>
        <a href={MAP_LINK} target="_blank" rel="noreferrer" style={{display:"inline-flex",
          alignItems:"center",gap:"8px",padding:"12px 22px",background:"rgba(255,107,26,0.07)",
          border:"1px solid rgba(255,107,26,0.2)",borderRadius:"11px",color:"rgba(255,245,230,0.7)",
          textDecoration:"none",fontSize:"13px",fontWeight:600}}>
          📌 Open Maps
        </a>
      </div>

      {/* How-to steps */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"10px"}}>
        {[
          {step:"1",icon:"🖨️",title:"Print the poster",  desc:"Use Print QR button & place on each table"},
          {step:"2",icon:"📲",title:"Customer scans",    desc:"They open camera and point at the QR code"},
          {step:"3",icon:"📍",title:"Google Maps opens", desc:"Finds Krave Momos location instantly"},
          {step:"4",icon:"🥟",title:"They visit & order",desc:"Walk in, sit down, order from this app!"},
        ].map(({step,icon,title,desc})=>(
          <div key={step} style={{background:"rgba(255,107,26,0.06)",border:"1px solid rgba(255,107,26,0.12)",
            borderRadius:"12px",padding:"14px",display:"flex",gap:"12px",alignItems:"flex-start"}}>
            <div style={{width:"26px",height:"26px",background:"linear-gradient(135deg,#e8500a,#c73d00)",
              borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:"11px",fontWeight:900,color:"#fff",flexShrink:0}}>{step}</div>
            <div>
              <div style={{fontSize:"13px",fontWeight:700,color:"#fff5e6",marginBottom:"3px"}}>{icon} {title}</div>
              <div style={{fontSize:"11px",color:"rgba(255,245,230,0.5)",lineHeight:1.55}}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────── OWNER LOGIN ───────────────────────────── */
function OwnerLogin({ ownerPin, setOwnerPin, pinError, tryLogin }) {
  return (
    <div style={{maxWidth:"380px",margin:"52px auto",padding:"0 16px"}}>
      <div style={{background:"rgba(255,107,26,0.07)",border:"1px solid rgba(255,107,26,0.2)",
        borderRadius:"22px",padding:"32px 28px"}}>
        <div style={{textAlign:"center",marginBottom:"26px"}}>
          <div style={{fontSize:"42px",marginBottom:"8px"}}>👨‍🍳</div>
          <h2 style={{fontSize:"24px",fontWeight:900,color:"#ff6b1a",margin:0}}>Owner Dashboard</h2>
          <p style={{color:"rgba(255,245,230,0.5)",marginTop:"6px",fontSize:"12px"}}>
            Enter PIN to manage orders
          </p>
        </div>
        <div style={{display:"flex",marginBottom:"14px"}}>
          <input type="password" value={ownerPin} onChange={e => setOwnerPin(e.target.value)}
            placeholder="Enter PIN (hint: 1234)"
            onKeyDown={e => e.key==="Enter" && tryLogin()}
            style={{flex:1,padding:"12px 13px",background:"rgba(255,245,230,0.05)",
              border:"1px solid rgba(255,107,26,0.2)",borderRight:"none",
              borderRadius:"9px 0 0 9px",color:"#fff5e6",fontSize:"15px",
              fontFamily:"inherit",outline:"none"}}/>
          <button onClick={tryLogin} style={{padding:"12px 16px",
            background:"linear-gradient(135deg,#e8500a,#c73d00)",border:"none",
            borderRadius:"0 9px 9px 0",color:"#fff",fontSize:"16px",fontWeight:700,cursor:"pointer"}}>
            →
          </button>
        </div>
        {pinError && (
          <div style={{color:"#ef4444",fontSize:"12px",textAlign:"center"}}>
            ❌ Incorrect PIN. Try again.
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────── OWNER DASHBOARD ──────────────────────── */
function OwnerDashboard({ orders, updateStatus, clearOrders, statusColors }) {
  const [filter,       setFilter]       = useState("All");
  const [confirmClear, setConfirmClear] = useState(false);

  const filtered = filter==="All" ? orders : orders.filter(o => o.status===filter);
  const counts   = orders.reduce((acc,o) => { acc[o.status]=(acc[o.status]||0)+1; return acc; }, {});
  const revenue  = orders.filter(o => o.status==="Served").reduce((s,o) => s+o.total, 0);

  return (
    <div style={{maxWidth:"1100px",margin:"0 auto",padding:"26px 16px"}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",
        marginBottom:"24px",flexWrap:"wrap",gap:"12px"}}>
        <div>
          <h2 style={{fontSize:"clamp(24px,5vw,36px)",fontWeight:900,color:"#ff6b1a",margin:"0 0 4px"}}>
            Kitchen Dashboard
          </h2>
          <p style={{color:"rgba(255,245,230,0.5)",margin:0,fontSize:"12px"}}>Real-time order management</p>
        </div>
        {!confirmClear ? (
          <button onClick={() => setConfirmClear(true)} style={{padding:"9px 16px",
            background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.3)",
            borderRadius:"9px",color:"#ef4444",cursor:"pointer",fontFamily:"inherit",
            fontWeight:600,fontSize:"12px"}}>
            🗑 Clear All Orders
          </button>
        ) : (
          <div style={{display:"flex",gap:"7px",alignItems:"center"}}>
            <span style={{fontSize:"12px",color:"rgba(255,245,230,0.6)"}}>Are you sure?</span>
            <button onClick={() => { clearOrders(); setConfirmClear(false); }} style={{padding:"7px 12px",
              background:"rgba(239,68,68,0.2)",border:"1px solid rgba(239,68,68,0.4)",borderRadius:"7px",
              color:"#ef4444",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:"12px"}}>
              Yes, Clear
            </button>
            <button onClick={() => setConfirmClear(false)} style={{padding:"7px 12px",
              background:"rgba(255,107,26,0.1)",border:"1px solid rgba(255,107,26,0.2)",borderRadius:"7px",
              color:"rgba(255,245,230,0.7)",cursor:"pointer",fontFamily:"inherit",fontWeight:600,fontSize:"12px"}}>
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",
        gap:"10px",marginBottom:"24px"}}>
        {[
          {icon:"📋",label:"Total",     val:orders.length,          color:"#94a3b8"},
          {icon:"⏳",label:"Preparing", val:counts["Preparing"]||0, color:"#f59e0b"},
          {icon:"✅",label:"Ready",     val:counts["Ready"]||0,     color:"#10b981"},
          {icon:"🍽",label:"Served",    val:counts["Served"]||0,    color:"#6b7280"},
          {icon:"💰",label:"Revenue",   val:`₹${revenue}`,          color:"#ff6b1a"},
        ].map(({icon,label,val,color}) => (
          <div key={label} style={{background:"rgba(255,107,26,0.06)",
            border:"1px solid rgba(255,107,26,0.12)",borderRadius:"12px",padding:"16px",textAlign:"center"}}>
            <div style={{fontSize:"24px",marginBottom:"5px"}}>{icon}</div>
            <div style={{fontSize:"clamp(18px,4vw,26px)",fontWeight:900,color}}>{val}</div>
            <div style={{fontSize:"10px",color:"rgba(255,245,230,0.5)",letterSpacing:"1px",
              textTransform:"uppercase",marginTop:"2px"}}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{display:"flex",gap:"7px",marginBottom:"18px",flexWrap:"wrap"}}>
        {["All","Preparing","Ready","Served"].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding:"7px 15px",
            background:filter===s?"linear-gradient(135deg,#e8500a,#c73d00)":"rgba(255,107,26,0.08)",
            border:filter===s?"none":"1px solid rgba(255,107,26,0.2)",
            borderRadius:"20px",color:filter===s?"#fff":"rgba(255,245,230,0.7)",
            cursor:"pointer",fontFamily:"inherit",fontSize:"12px",fontWeight:filter===s?700:400,
          }}>
            {s}{s!=="All" && counts[s] ? ` (${counts[s]})` : ""}
          </button>
        ))}
      </div>

      {/* Orders */}
      {filtered.length===0 ? (
        <div style={{textAlign:"center",padding:"52px 0"}}>
          <div style={{fontSize:"52px",marginBottom:"12px"}}>📋</div>
          <p style={{color:"rgba(255,245,230,0.4)",fontSize:"15px"}}>
            {filter==="All"
              ? "No orders yet. Share the QR code with customers!"
              : `No ${filter.toLowerCase()} orders right now.`}
          </p>
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"12px"}}>
          {filtered.map(order => (
            <div key={order.id} style={{background:"rgba(255,107,26,0.06)",
              border:`1px solid ${statusColors[order.status]}40`,borderRadius:"14px",padding:"16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
                <div>
                  <div style={{fontSize:"19px",fontWeight:900,color:"#ff6b1a"}}>Table {order.table}</div>
                  <div style={{fontSize:"10px",color:"rgba(255,245,230,0.4)"}}>{order.date} · {order.time}</div>
                </div>
                <span style={{padding:"4px 11px",
                  background:`${statusColors[order.status]}20`,
                  border:`1px solid ${statusColors[order.status]}50`,
                  borderRadius:"20px",color:statusColors[order.status],
                  fontSize:"11px",fontWeight:700}}>
                  {order.status}
                </span>
              </div>

              <div style={{marginBottom:"12px"}}>
                {order.items.map(item => (
                  <div key={item.id} style={{display:"flex",justifyContent:"space-between",
                    padding:"4px 0",borderBottom:"1px solid rgba(255,107,26,0.08)",fontSize:"11px"}}>
                    <span style={{color:"rgba(255,245,230,0.8)"}}>{item.qty}× {item.name}</span>
                    <span style={{color:"#ff6b1a",fontWeight:700}}>₹{item.price*item.qty}</span>
                  </div>
                ))}
              </div>

              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontWeight:900,fontSize:"15px",color:"#fff5e6"}}>Total: ₹{order.total}</span>
                <div style={{display:"flex",gap:"5px"}}>
                  {order.status==="Preparing" && (
                    <button onClick={() => updateStatus(order.id,"Ready")} style={{
                      padding:"5px 10px",background:"rgba(16,185,129,0.18)",
                      border:"1px solid rgba(16,185,129,0.4)",borderRadius:"7px",
                      color:"#10b981",cursor:"pointer",fontFamily:"inherit",fontSize:"11px",fontWeight:700}}>
                      Ready ✅
                    </button>
                  )}
                  {order.status==="Ready" && (
                    <button onClick={() => updateStatus(order.id,"Served")} style={{
                      padding:"5px 10px",background:"rgba(107,114,128,0.18)",
                      border:"1px solid rgba(107,114,128,0.4)",borderRadius:"7px",
                      color:"#9ca3af",cursor:"pointer",fontFamily:"inherit",fontSize:"11px",fontWeight:700}}>
                      Served 🍽
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
