function Navbar(){
const sum=arr=>arr.reduce((a,b)=>a+b.qty,0);
const [count,setCount]=React.useState(sum(window.Store.getState().cart));
const [user,setUser]=React.useState(window.Auth.getUser());
React.useEffect(()=>window.Store.subscribe(e=>{
if(e.type==="cart:changed"){setCount(sum(e.payload))}
if(e.type==="auth:changed"){setUser(e.payload)}
}),[]);
return(
<nav className="navbar navbar-expand-lg bg-body-tertiary">
<div className="container">
<a className="navbar-brand d-flex align-items-center gap-2" href="#/"><img src="assets/logo.png" alt="" width="28" height="28"/><span>TandeHouse</span></a>
<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav"><span className="navbar-toggler-icon"></span></button>
<div className="collapse navbar-collapse" id="nav">
<ul className="navbar-nav ms-auto align-items-lg-center">
<li className="nav-item"><a className="nav-link" href="#/productos">Productos</a></li>
<li className="nav-item"><a className="nav-link" href="#/categorias">Categorías</a></li>
<li className="nav-item"><a className="nav-link" href="#/ofertas">Ofertas</a></li>
<li className="nav-item"><a className="nav-link" href="#/sobre">Sobre nosotros</a></li>
<li className="nav-item"><a className="nav-link" href="#/blog">Blog</a></li>
<li className="nav-item"><a className="nav-link" href="#/contacto">Contacto</a></li>
<li className="nav-item ms-lg-3 me-lg-2">
<a className="btn btn-outline-primary position-relative" href="#/carrito"><i className="bi bi-cart3"></i>{count>0&&<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{count}</span>}</a>
</li>
{!user?(
<li className="nav-item">
<a className="btn btn-primary" href="#/login"><i className="bi bi-person"></i> Login</a>
</li>
):(
<li className="nav-item dropdown">
<a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Hola, {user.nombre}</a>
<ul className="dropdown-menu dropdown-menu-end">
<li><a className="dropdown-item" href="#/">Mi cuenta</a></li>
<li><hr className="dropdown-divider"/></li>
<li><button className="dropdown-item" onClick={()=>window.Auth.logout()}>Cerrar sesión</button></li>
</ul>
</li>
)}
</ul>
</div>
</div>
</nav>
)}
