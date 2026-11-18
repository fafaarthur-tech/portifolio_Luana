# Portfólio · Luana Almeida

Site de uma página só, com rolagem animada que conta a trajetória dela, do começo ao contato.
HTML, CSS e JavaScript puros, sem build. As animações usam GSAP + ScrollTrigger e Lenis (rolagem suave), já incluídos em `vendor/`.

## Ver no computador

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

Também funciona em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel).

## Onde editar

| O que | Onde |
|---|---|
| Textos, capítulos, links do Instagram | `index.html` (cada projeto é um `<article class="chap">`) |
| Links "Ver no Instagram" / "Ver o reel" | o `href` dos `<a class="ig">` dentro de cada capítulo |
| Fotos | `assets/img/` (WebP). Trocar o arquivo mantém o mesmo nome no HTML |
| Cores e fontes | variáveis no topo de `css/style.css` (`--or` é o laranja) |
| Animações | `js/main.js` |

Para adicionar um novo projeto, copie um `<article class="chap">` inteiro. Use uma das classes `n1` a `n5` no `<div class="collage">` conforme a quantidade de fotos (1 a 5). A classe `flip` inverte o lado do texto.

## Privacidade

Os certificados do catálogo contêm CPF e data de nascimento, por isso **não foram incluídos**. A seção "Formação e cursos" mostra apenas o nome da competência, a instituição e a carga horária.

## Acessibilidade

Respeita `prefers-reduced-motion` (sem animações de rolagem), tem texto alternativo nas imagens e funciona sem JavaScript.
