describe('State en formulario (Login)', () => {
  it('El input email refleja el texto ingresado (controlado por estado)', () => {
    const { host, unmount } = TestUtils.mount(Login);
    const email = host.querySelector('input[type="email"]');
    expect(email).not.toBeNull();
    TestUtils.input(email, 'user@demo.cl');
    expect(email.value).toBe('user@demo.cl');
    unmount();
  });

  it('Submit con datos ejecuta el flujo (no navega si espía) y no rompe', () => {
    // Guardamos el hash original y lo restauramos después
    const originalHash = window.location.hash;
    const { host, unmount } = TestUtils.mount(Login);
    const email = host.querySelector('input[type="email"]');
    const pass = host.querySelector('input[type="password"]');
    const submit = host.querySelector('button[type="submit"]');
    TestUtils.input(email, 'user@demo.cl');
    TestUtils.input(pass, '1234');
    // El flujo debe ejecutarse sin lanzar errores
    expect(() => TestUtils.click(submit)).not.toThrow();
    // Verificamos que se haya autenticado
    expect(window.Auth.getUser()).not.toBeNull();
    expect(window.Auth.getUser().email).toBe('user@demo.cl');
    unmount();
    // Restauramos el hash
    window.location.hash = originalHash;
  });
});
