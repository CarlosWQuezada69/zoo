document.documentElement.classList.add("js");
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
  const contenedor = visor.closest(".card-media") || visor.parentElement;
  const avisar = (texto) => {
    if (contenedor.querySelector(".aviso-3d")) return;
    const p = document.createElement("p");
    p.className = "aviso-3d";
    p.textContent = texto;
    contenedor.appendChild(p);
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


const botones3d = document.querySelectorAll(".animal-card .btn-3d, .cards .card .btn-3d");
botones3d.forEach((boton) => {
  const cuerpo = boton.closest("article")?.querySelector(".card-body, .animal-body");
  if (cuerpo) cuerpo.appendChild(boton);
});

document.querySelectorAll(".btn-3d").forEach((boton) => {
  boton.addEventListener("click", () => {
    const medio = boton.closest("article")?.querySelector(".card-media");
    if (!medio) return;
    const visor = medio.querySelector("model-viewer");
    if (!visor) return;
    const activo = medio.classList.toggle("media-3d");
    boton.setAttribute("aria-pressed", String(activo));
    boton.textContent = activo ? "Ver foto" : "Ver en 3D";
    if (activo && !visor.getAttribute("src")) {
      visor.setAttribute("src", visor.dataset.src);
    }
  });
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


const tarjetas = Array.from(document.querySelectorAll(".animal-card"));

function igualaTarjetas() {
  tarjetas.forEach((t) => (t.style.minHeight = ""));
  if (tarjetas.length === 0) return;
  const alto = Math.max(...tarjetas.map((t) => t.offsetHeight));
  tarjetas.forEach((t) => (t.style.minHeight = Math.ceil(alto) + "px"));
}

if (tarjetas.length > 0) {
  window.addEventListener("load", igualaTarjetas);
  let temporizador;
  window.addEventListener("resize", () => {
    clearTimeout(temporizador);
    temporizador = setTimeout(igualaTarjetas, 120);
  });
}


const fotosTarjeta = document.querySelectorAll(".card-media > img, .event-card > img");

fotosTarjeta.forEach((img) => {
  const ajustar = () => {
    const marco = img.parentElement;
    if (!marco || img.clientWidth === 0 || !img.naturalWidth) return;
    if (img.naturalWidth / img.naturalHeight < (img.clientWidth / img.clientHeight) * 0.95) {
      marco.classList.add("foto-vertical");
      marco.style.backgroundImage = 'url("' + img.currentSrc + '")';
    }
  };
  img.complete ? ajustar() : img.addEventListener("load", ajustar);
});


const NIVELES_CONSERVACION = [
  [/peligro cr[ií]tico|cr[ií]ticamente amenazad/i, "estado-cr"],
  [/en peligro/i, "estado-en"],
  [/vulnerable/i, "estado-vu"],
  [/casi amenazad/i, "estado-nt"],
  [/preocupaci[oó]n menor|estable/i, "estado-lc"],
  [/invasor/i, "estado-inv"],
  [/insuficient/i, "estado-dd"]
];

document.querySelectorAll(".card-datos li").forEach((li) => {
  const etiqueta = li.querySelector("span");
  if (!etiqueta || !/^conservaci[oó]n$/i.test(etiqueta.textContent.trim())) return;
  const valor = li.textContent.slice(etiqueta.textContent.length);
  const nivel = NIVELES_CONSERVACION.find(([re]) => re.test(valor));
  if (nivel) li.classList.add(nivel[1]);
});
