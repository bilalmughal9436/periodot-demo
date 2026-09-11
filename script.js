const products=[
 {id:1,brand:'Sapphire',name:'Faith & Elegance',price:4800,img:'assets/product-1.jpg',tags:['new']},
 {id:2,brand:'Mahnoor',name:'Midnight & Plum',price:6500,img:'assets/product-2.jpg',tags:['new']},
 {id:3,brand:'Sapphire',name:'The Botanical Story',price:4800,img:'assets/product-3.jpg',tags:['new']},
 {id:4,brand:'The Print Edit',name:'A Pop of Colour',price:3900,img:'assets/product-4.jpg',tags:['new']},
 {id:5,brand:'The Floral Edit',name:'Blue Bloom',price:6200,img:'assets/product-5.jpg',tags:[]},
 {id:6,brand:'The Floral Edit',name:'Softly in Bloom',price:4400,img:'assets/product-6.jpg',tags:[]},
 {id:7,brand:'Meraki',name:'The Slate Edit',price:6800,img:'assets/product-7.jpg',tags:[]},
 {id:8,brand:'Embroidered Edit',name:'Crimson & Gold',price:6500,img:'assets/product-8.jpg',tags:[]}
];
let activeFilter='all',query='',cart=JSON.parse(localStorage.getItem('peridot-cart')||'[]');
const grid=document.querySelector('#productGrid'),count=document.querySelector('#cartCount'),drawer=document.querySelector('#cartDrawer'),scrim=document.querySelector('#scrim'),toast=document.querySelector('#toast');
const money=n=>'Rs. '+n.toLocaleString('en-PK');
function renderProducts(){let items=products.filter(p=>(activeFilter==='all'||p.brand===activeFilter||p.tags.includes(activeFilter))&&(p.name+' '+p.brand).toLowerCase().includes(query));const sort=document.querySelector('#sortSelect').value;if(sort==='low')items.sort((a,b)=>a.price-b.price);if(sort==='high')items.sort((a,b)=>b.price-a.price);grid.innerHTML=items.map(p=>`<article class="product-card"><div class="product-image"><img src="${p.img}" alt="${p.name} by ${p.brand}"><button class="heart" aria-label="Save ${p.name}">♡</button></div><p class="product-brand">${p.brand}</p><h3>${p.name}</h3><p class="price">${money(p.price)}</p><p class="meta">Unstitched &nbsp; • &nbsp; 3 Piece</p><button class="add-cart" data-id="${p.id}">▢ &nbsp; Add to Bag</button></article>`).join('');document.querySelector('#emptyState').hidden=!!items.length;bindProductActions()}
function bindProductActions(){document.querySelectorAll('.add-cart').forEach(b=>b.onclick=()=>addToCart(+b.dataset.id));document.querySelectorAll('.heart').forEach(b=>b.onclick=()=>{b.classList.toggle('active');b.textContent=b.classList.contains('active')?'♥':'♡';showToast(b.classList.contains('active')?'Saved to favourites':'Removed from favourites')})}
function addToCart(id){cart.push(id);localStorage.setItem('peridot-cart',JSON.stringify(cart));renderCart();showToast('Added to your bag')}
function renderCart(){count.textContent=cart.length;const grouped=cart.reduce((a,id)=>(a[id]=(a[id]||0)+1,a),{});document.querySelector('#cartItems').innerHTML=cart.length?Object.entries(grouped).map(([id,qty])=>{const p=products.find(x=>x.id==id);return `<div class="cart-line"><img src="${p.img}" alt=""><div><h4>${p.name}</h4><small>${qty} × ${money(p.price)}</small></div><button class="remove" data-id="${id}" aria-label="Remove ${p.name}">×</button></div>`}).join(''):'<p style="color:#777;padding:25px 0">Your bag is waiting for something beautiful.</p>';document.querySelector('#cartTotal').textContent=money(cart.reduce((s,id)=>s+products.find(p=>p.id===id).price,0));document.querySelectorAll('.remove').forEach(b=>b.onclick=()=>{const i=cart.indexOf(+b.dataset.id);cart.splice(i,1);localStorage.setItem('peridot-cart',JSON.stringify(cart));renderCart()})}
function openCart(open=true){drawer.classList.toggle('open',open);scrim.classList.toggle('show',open);drawer.setAttribute('aria-hidden',String(!open));document.body.style.overflow=open?'hidden':''}
let toastTimer;function showToast(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),1800)}
document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-filter]').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeFilter=b.dataset.filter;renderProducts()});
document.querySelectorAll('[data-brand]').forEach(b=>b.onclick=()=>{activeFilter=b.dataset.brand;document.querySelector('#collection').scrollIntoView();renderProducts()});
document.querySelector('#sortSelect').onchange=renderProducts;document.querySelector('#searchInput').oninput=e=>{query=e.target.value.toLowerCase().trim();renderProducts()};
document.querySelector('.cart-button').onclick=()=>openCart();document.querySelector('.close-cart').onclick=()=>openCart(false);scrim.onclick=()=>openCart(false);document.addEventListener('keydown',e=>{if(e.key==='Escape')openCart(false)});
document.querySelector('.menu-toggle').onclick=e=>{const nav=document.querySelector('.site-header nav');nav.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',nav.classList.contains('open'))};
document.querySelector('#newsletterForm').onsubmit=e=>{e.preventDefault();document.querySelector('#newsletterMessage').textContent='Thank you — you’re on the list.';e.currentTarget.reset()};
document.querySelector('.checkout').onclick=()=>showToast('Checkout is ready for store integration');document.querySelector('#viewAll').onclick=()=>{activeFilter='all';query='';document.querySelector('#searchInput').value='';renderProducts();showToast('Showing the complete collection')};
renderProducts();renderCart();
