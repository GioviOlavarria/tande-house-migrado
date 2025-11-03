document.addEventListener("DOMContentLoaded", () => {
  
  document.querySelectorAll("form.needs-validation").forEach((form) => {
    form.addEventListener("submit", (e) => {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add("was-validated");
    });
  });

  
  document.addEventListener("input", (e) => {
    const el = e.target;
    if (el.matches("[data-req]")) {
      if (el.value.trim() === "") {
        el.setCustomValidity("Este campo es obligatorio");
      } else {
        el.setCustomValidity("");
      }
      el.reportValidity();
    }
  });
});
