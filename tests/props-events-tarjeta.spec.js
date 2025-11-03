describe('Props y eventos (TarjetaProducto)', () => {
  it('El botón "Agregar" ejecuta onAdd(product)', () => {
    const prod = { id: 'p1', nombre: 'Carta Test', precio: 1000, portada: '', sku: 'SKU1', categoria: 'base' };
    const onAdd = jasmine.createSpy('onAdd');
    const { host, unmount } = TestUtils.mount(TarjetaProducto, { product: prod, onAdd });
    const addBtn = host.querySelector('button.btn.btn-primary');
    expect(addBtn).not.toBeNull();
    TestUtils.click(addBtn);
    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith(prod);
    unmount();
  });
});
