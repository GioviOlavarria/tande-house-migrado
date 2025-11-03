function ModalProducto(){
const [p,setP]=React.useState(null);
React.useEffect(()=>{window.UI=Object.assign(window.UI||{},{
showProduct:function(prod){
setP(prod);
const el=document.getElementById('modalProducto');
const m=new bootstrap.Modal(el);
m.show();
}
})},[]);
return(
<div className="modal fade" id="modalProducto" tabIndex="-1" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered modal-lg">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">{p?p.nombre:''}</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        {p&&(
          <div className="row g-4">
            <div className="col-12 col-md-5">
              <img src={p.portada} alt={p.nombre} className="img-fluid rounded"/>
            </div>
            <div className="col-12 col-md-7">
              <div className="text-muted mb-2">{p.sku} · {p.categoria}</div>
              <h4 className="mb-3">{window.Utils.CLP(p.precio)}</h4>
              <p>Producto de colección. Imágenes referenciales.</p>
            </div>
          </div>
        )}
      </div>
      <div className="modal-footer">
        {p&&<button className="btn btn-primary" onClick={()=>window.Store.addToCart(p,1)}><i className="bi bi-cart-plus"></i> Agregar al carrito</button>}
        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>
)}
