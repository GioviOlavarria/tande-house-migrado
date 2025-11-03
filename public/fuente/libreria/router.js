window.Router = {
  current() {
    return location.hash.replace(/^#/, "") || "/";
  },
};
