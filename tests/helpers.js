// Montaje simple en DOM real para componentes UMD globales
// Usamos ReactDOM.render (legacy) para que el render sea sincrónico en tests
window.TestUtils = {
  mount(Component, props = {}) {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const el = React.createElement(Component, props);
    // React 18 aún soporta ReactDOM.render para roots legacy (sincrónico)
    ReactDOM.render(el, host);
    return {
      host,
      unmount: () => {
        ReactDOM.unmountComponentAtNode(host);
        host.remove();
      }
    };
  },
  click(el) {
    el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  },
  input(el, value) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set;
    nativeInputValueSetter.call(el, value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }
};
