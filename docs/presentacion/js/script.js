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

document.querySelectorAll("model-viewer").forEach((visor) => {
  const avisar = (texto) => {
    if (visor.parentElement.querySelector(".aviso-3d")) return;
    const p = document.createElement("p");
    p.className = "aviso-3d";
    p.textContent = texto;
    visor.after(p);
  };

  if (location.protocol === "file:") {
    avisar("Estás abriendo una copia local del archivo. Abre el sitio publicado: https://carloswquezada69.github.io/zoo/");
  } else {
    const prueba = document.createElement("canvas");
    if (!(prueba.getContext("webgl2") || prueba.getContext("webgl"))) {
      avisar("Tu navegador tiene WebGL desactivado. Activa la aceleración por hardware en la configuración y recarga.");
    }
    visor.addEventListener("error", () => {
      avisar("No se pudo cargar el modelo 3D. Actualiza tu navegador o prueba en otro (Chrome, Edge o Firefox al día).");
    });
  }
});

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
