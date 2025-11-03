function Detalle(){
const [h,setH]=React.useState(window.Router.current());
React.useEffect(()=>{const onHash=()=>setH(window.Router.current());window.addEventListener("hashchange",onHash);return()=>window.removeEventListener("hashchange",onHash)},[]);
const id=h.split("/")[2];
const p=window.Store.getState().productos.find(x=>x.id===id);
if(!p){return(<div className="container py-4"><h5>Producto no encontrado</h5><a className="btn btn-outline-secondary mt-3" href="#/productos">Volver</a></div>)}
return(
<div className="container py-4">
<div className="row g-4">
<div className="col-12 col-md-5">
<img src={p.portada} alt={p.nombre} className="img-fluid rounded"/>
</div>
<div className="col-12 col-md-7">
<h3 className="mb-1">{p.nombre}</h3>
<div className="text-muted mb-2">{p.sku} · {p.categoria}</div>
<h4 className="mb-3">{window.Utils.CLP(p.precio)}</h4>
<div className="d-flex gap-2 mb-4">
<button className="btn btn-primary" onClick={()=>window.Store.addToCart(p,1)}><i className="bi bi-cart-plus"></i> Agregar al carrito</button>
<a className="btn btn-outline-secondary" href="#/productos">Seguir comprando</a>
</div>
<p>Producto de colección. Imágenes referenciales.</p>
</div>
</div>
</div>
)}
