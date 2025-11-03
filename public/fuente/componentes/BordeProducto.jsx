function BordeProducto({ children }) {
  return (
    <div className="p-2">
      <div className="border rounded-3 h-100">{children}</div>
    </div>
  );
}
