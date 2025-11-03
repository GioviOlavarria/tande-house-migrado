function Blog(){
if(!window.BLOG){window.BLOG={posts:[
{id:"b1",titulo:"Cómo guardar tus cartas",fecha:"2025-10-01",resumen:"Fundas, top loaders y tips para conservar el valor.",contenido:["Usa fundas de calidad y evita PVC.","Guarda en top loaders o cajas rígidas.","Controla humedad y temperatura."]},
{id:"b2",titulo:"Arquetipos del meta",fecha:"2025-09-15",resumen:"Qué se juega hoy y por qué funciona.",contenido:["Conoce el plan de juego de cada arquetipo.","Practica líneas de juego contra matchups comunes.","Ajusta tu lista al metajuego local."]},
{id:"b3",titulo:"Checklist de compra",fecha:"2025-08-20",resumen:"Qué revisar antes de adquirir cartas usadas.",contenido:["Verifica bordes y surface a contraluz.","Confirma edición y rareza.","Compara precios en fuentes confiables."]}
]};}
const posts=window.BLOG.posts;
return(
<div className="container py-4">
<h3 className="mb-3">Blog</h3>
<div className="list-group">
{posts.map(p=>(
<a key={p.id} href={"#/blog/"+p.id} className="list-group-item list-group-item-action">
<div className="d-flex w-100 justify-content-between">
<h6 className="mb-1">{p.titulo}</h6>
<small className="text-muted">{p.fecha}</small>
</div>
<p className="mb-1">{p.resumen}</p>
<small className="text-primary">Leer detalle</small>
</a>
))}
</div>
</div>
)}
