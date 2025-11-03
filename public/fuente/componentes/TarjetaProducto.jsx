function TarjetaProducto({product,onAdd}){
return(
<div className="card h-100 shadow-sm">
<img src={product.portada} className="card-img-top" alt={product.nombre} style={{objectFit:"cover",height:180}}/>
<div className="card-body d-flex flex-column">
<h6 className="card-title mb-1">{product.nombre}</h6>
<small className="text-muted">{product.sku}</small>
<div className="mt-auto d-flex align-items-center justify-content-between">
<strong>{window.Utils.CLP(product.precio)}</strong>
<div className="d-flex gap-2">
<button className="btn btn-outline-secondary btn-sm" onClick={()=>window.UI&&window.UI.showProduct(product)}>Detalle</button>
<button className="btn btn-primary btn-sm" onClick={()=>onAdd(product)}><i className="bi bi-cart-plus"></i> Agregar</button>
</div>
</div>
</div>
</div>
)}
