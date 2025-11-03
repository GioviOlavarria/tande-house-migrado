describe("TarjetaProducto", function () {
  it("renderiza nombre y botón", function () {
    var p = {
      id: "x",
      nombre: "Carta X",
      precio: 1000,
      portada: "assets/cartas/dipplin.png",
      sku: "X-1",
    };
    const { host, unmount } = TestUtils.mount(TarjetaProducto, { product: p, onAdd: function () {} });
    expect(host.textContent).toContain("Carta X");
    expect(host.querySelector("button")).not.toBeNull();
    unmount();
  });
});
