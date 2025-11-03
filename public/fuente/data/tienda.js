const LS_KEY="th_products_v1";
const LS_CART="th_cart_v1";
const LS_USER="th_user_v1";
const listeners=new Set();
const notify=(t,p)=>listeners.forEach(f=>f({type:t,payload:p}));
const persist={load:(k,f)=>{try{const r=localStorage.getItem(k);return r?JSON.parse(r):f}catch{return f}},save:(k,v)=>localStorage.setItem(k,JSON.stringify(v))};
let state={productos:persist.load(LS_KEY,window.SEED.productos),categorias:window.SEED.categorias,cart:persist.load(LS_CART,[]),user:persist.load(LS_USER,null)};
window.Utils={CLP(n){return new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(n)}};
window.Store={
subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn)},
getState(){return JSON.parse(JSON.stringify(state))},
getByCategory(c){return state.productos.filter(p=>p.categoria===c)},
getOffers(){return state.productos.filter(p=>p.oferta)},
createProduct(prod){state.productos=[...state.productos,prod];persist.save(LS_KEY,state.productos);notify("products:changed",state.productos)},
updateProduct(id,patch){state.productos=state.productos.map(p=>p.id===id?{...p,...patch}:p);persist.save(LS_KEY,state.productos);notify("products:changed",state.productos)},
deleteProduct(id){state.productos=state.productos.filter(p=>p.id!==id);persist.save(LS_KEY,state.productos);notify("products:changed",state.productos)},
addToCart(item,qty=1){const i=state.cart.findIndex(x=>x.id===item.id);if(i>=0)state.cart[i].qty+=qty;else state.cart.push({...item,qty});persist.save(LS_CART,state.cart);notify("cart:changed",state.cart)},
setQty(id,qty){state.cart=state.cart.map(x=>x.id===id?{...x,qty:Math.max(0,qty)}:x).filter(x=>x.qty>0);persist.save(LS_CART,state.cart);notify("cart:changed",state.cart)},
removeFromCart(id){state.cart=state.cart.filter(x=>x.id!==id);persist.save(LS_CART,state.cart);notify("cart:changed",state.cart)},
clearCart(){state.cart=[];persist.save(LS_CART,state.cart);notify("cart:changed",state.cart)}
};
window.Auth={
getUser(){return state.user},
login(email,password){const u={nombre:email.split("@")[0],email};state.user=u;persist.save(LS_USER,u);notify("auth:changed",u)},
register({nombre,email,password}){const u={nombre,email};state.user=u;persist.save(LS_USER,u);notify("auth:changed",u)},
logout(){state.user=null;persist.save(LS_USER,null);notify("auth:changed",null)}
};
