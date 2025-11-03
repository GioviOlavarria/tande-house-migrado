function BlogDetalle(){
const [h,setH]=React.useState(window.Router.current());
React.useEffect(()=>{const onHash=()=>setH(window.Router.current());window.addEventListener("hashchange",onHash);return()=>window.removeEventListener("hashchange",onHash)},[]);
const id=h.split("/")[2];
const post=(window.BLOG&&window.BLOG.posts||[]).find(x=>x.id===id);
if(!post){return(<div className="container py-4"><h5>Artículo no encontrado</h5><a className="btn btn-outline-secondary mt-3" href="#/blog">Volver al blog</a></div>)}
return(
<div className="container py-4">
<a className="btn btn-outline-secondary btn-sm mb-3" href="#/blog">← Volver</a>
<h2 className="mb-1">{post.titulo}</h2>
<div className="text-muted mb-4">{post.fecha}</div>
<div className="vstack gap-3">
{(post.contenido||[]).map((p,i)=><p key={i}>{p}</p>)}
</div>
</div>
)}
