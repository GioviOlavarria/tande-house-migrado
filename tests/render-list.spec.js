describe('Renderizado de listas', () => {
  it('Productos renderiza una tarjeta por cada producto del SEED', () => {
    const total = window.SEED.productos.length;
    const { host, unmount } = TestUtils.mount(Productos);
    const cards = host.querySelectorAll('.card');
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.length).toBe(total);
    unmount();
  });
});
