# Arquitectura del proyecto

Organización inspirada en **Clean Architecture**, adaptada a un sitio estático
(HTML + CSS + JS vanilla) sin procesos de build.

## Estructura

```
zoo/
└── docs/                          ← raíz pública servida por GitHub Pages
    ├── index.html … eventos.html  ← PRESENTACIÓN: interfaces y contenido
    ├── presentacion/
    │   ├── css/styles.css         ← PRESENTACIÓN: estilos visuales
    │   └── js/script.js           ← APLICACIÓN: casos de uso de la interfaz
    ├── infraestructura/
    │   ├── img/                   ← INFRAESTRUCTURA: fotografías y créditos
    │   └── modelos/               ← INFRAESTRUCTURA: modelos 3D (.glb)
    ├── robots.txt                 ← SEO / indexación
    └── sitemap.xml                ← SEO / mapa del sitio
```

> Las páginas viven en la raíz de `docs/` para preservar las URLs públicas
> (`/zoo/mamiferos.html`, etc.) y con ello el SEO ya posicionado.

## Mapeo de capas

| Clean Architecture | En este proyecto | Justificación |
|---|---|---|
| **Dominio** | Contenido semántico de las páginas: entidades (especies, tarifas, horarios) y sus reglas, expresadas en HTML semántico y datos estructurados JSON-LD (`schema.org`) | Entidades puras sin dependencia de frameworks ni librerías |
| **Aplicación** | `presentacion/js/script.js` | Casos de uso de la interfaz: navegación móvil, animaciones de aparición, diagnóstico del visor 3D. Orquesta el DOM pero no conoce dónde viven los archivos |
| **Presentación** | Páginas `*.html` + `presentacion/css/styles.css` | Interfaz visible; depende hacia adentro (enlaza el JS de aplicación y presenta el dominio) |
| **Infraestructura** | `infraestructura/img/`, `infraestructura/modelos/` | Recursos externos intercambiables (fotografías, modelos glTF) con su procedencia documentada |

## Regla de dependencia

Las dependencias siempre apuntan **hacia adentro**:

```
PRESENTACIÓN  →  APLICACIÓN  →  DOMINIO
      ↓
INFRAESTRUCTURA (consumida por las capas internas, nunca al revés)
```

En la práctica esto significa:

- Cambiar una foto o un modelo `.glb` **no requiere tocar** `script.js`.
- El dominio (contenido y datos de especies) no depende de tecnologías:
  migrar a otro framework mantendría intacto el contenido semántico.
- La lógica de aplicación solo habla con el DOM estándar, no con recursos
  concretos de infraestructura.
