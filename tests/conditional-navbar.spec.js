describe('Renderizado condicional (Navbar)', () => {
  it('Muestra "Login" cuando no hay usuario', () => {
    window.Auth.logout && window.Auth.logout();
    const { host, unmount } = TestUtils.mount(Navbar);
    const loginBtn = host.querySelector('a.btn.btn-primary[href="#/login"]');
    const saludo = host.querySelector('.dropdown-toggle');
    expect(loginBtn).not.toBeNull();
    expect(saludo).toBeNull();
    unmount();
  });

  it('Muestra "Hola, {nombre}" cuando hay usuario logueado', () => {
    window.Auth.login && window.Auth.login('tester@tande.cl', 'x');
    const { host, unmount } = TestUtils.mount(Navbar);
    const saludo = host.querySelector('.dropdown-toggle');
    const loginBtn = host.querySelector('a.btn.btn-primary[href="#/login"]');
    expect(saludo).not.toBeNull();
    expect(saludo.textContent).toContain('Hola');
    expect(loginBtn).toBeNull();
    unmount();
  });
});
