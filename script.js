const toggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("menu");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const abierto = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", abierto);
  });

  menu.querySelectorAll("a").forEach((enlace) => {
    enlace.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

const header = document.querySelector(".site-header");

if (header) {
  const actualizar = () => {
    header.classList.toggle("scrolled", window.scrollY > 10);
  };
  window.addEventListener("scroll", actualizar, { passive: true });
  actualizar();
}

const revelables = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revelables.length > 0) {
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visible");
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revelables.forEach((el) => observador.observe(el));
} else {
  revelables.forEach((el) => el.classList.add("visible"));
}
