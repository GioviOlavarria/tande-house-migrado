function Login(){
const [f,setF]=React.useState({email:"",password:""});
const onSubmit=e=>{e.preventDefault();window.Auth.login(f.email,f.password);location.hash="#/";};
return(
<div className="container py-4" style={{maxWidth:520}}>
<h3 className="mb-3">Iniciar sesión</h3>
<form className="row g-3" onSubmit={onSubmit}>
<div className="col-12"><label className="form-label">Email</label><input type="email" className="form-control" required value={f.email} onChange={e=>setF({...f,email:e.target.value})}/></div>
<div className="col-12"><label className="form-label">Contraseña</label><input type="password" className="form-control" required value={f.password} onChange={e=>setF({...f,password:e.target.value})}/></div>
<div className="col-12 d-flex gap-2 align-items-center">
<button className="btn btn-primary" type="submit">Entrar</button>
<a className="btn btn-outline-secondary" href="#/">Cancelar</a>
<a className="ms-auto" href="#/registro">Crear cuenta</a>
</div>
</form>
</div>
)}
