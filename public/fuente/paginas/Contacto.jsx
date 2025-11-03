function Contacto(){
const [f,setF]=React.useState({nombre:"",email:"",asunto:"",mensaje:""});
const [ok,setOk]=React.useState(false);
const onSubmit=e=>{e.preventDefault();setOk(true);setTimeout(()=>setOk(false),3500)};
return(
<div className="container py-4">
<h3 className="mb-3">Contacto</h3>
<div className="row g-4">
<div className="col-12 col-lg-7">
<form className="row g-3" onSubmit={onSubmit}>
<div className="col-md-6"><label className="form-label">Nombre</label><input className="form-control" required value={f.nombre} onChange={e=>setF({...f,nombre:e.target.value})}/></div>
<div className="col-md-6"><label className="form-label">Email</label><input type="email" className="form-control" required value={f.email} onChange={e=>setF({...f,email:e.target.value})}/></div>
<div className="col-12"><label className="form-label">Asunto</label><input className="form-control" required value={f.asunto} onChange={e=>setF({...f,asunto:e.target.value})}/></div>
<div className="col-12"><label className="form-label">Mensaje</label><textarea className="form-control" rows="5" required value={f.mensaje} onChange={e=>setF({...f,mensaje:e.target.value})}></textarea></div>
<div className="col-12 d-flex gap-2">
<button className="btn btn-primary" type="submit">Enviar</button>
<a className="btn btn-outline-secondary" href="#/">Volver</a>
</div>
{ok&&<div className="col-12"><div className="alert alert-success mb-0">Hemos recibido tu mensaje.</div></div>}
</form>
</div>
<div className="col-12 col-lg-5">
<div className="card h-100"><div className="card-body">
<h6>Información</h6>
<p className="mb-1">Correo: soporte@tandehouse.cl</p>
<p className="mb-1">Horario: Lun a Vie, 10:00–18:00</p>
<p className="mb-0">Redes: @tandehouse</p>
</div></div>
</div>
</div>
</div>
)}
