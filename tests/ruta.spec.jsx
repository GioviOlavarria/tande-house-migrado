describe("Rutas", function () {
  it("navega a /productos", function (done) {
    location.hash = "#/productos";
    setTimeout(function () {
      expect(location.hash).toBe("#/productos");
      done();
    }, 100);
  });
});
