window.Router = {
  current() {
    const path = location.pathname;
    if (path !== '/' && path !== '/index.html') {
      return path;
    }
    return location.hash.replace(/^#/, "") || "/";
  },
};