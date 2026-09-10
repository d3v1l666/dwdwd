/* Baut aus den Quelldateien zwei Einzeldateien in dist/:
 *   artifact.html          – Fragment zum Veröffentlichen als Claude-Artifact
 *   pruefungstrainer.html  – vollständige Einzeldatei, offline per Doppelklick nutzbar
 * Aufruf: node build.js
 */
const fs = require("fs");
const path = require("path");

const read = (f) => fs.readFileSync(path.join(__dirname, f), "utf8");

const TITLE = "Prüfungstrainer Logistiksysteme";

const css = read("styles.css");
const data = read("data/questions.js");
const app = read("app.js");

// </script> in Zeichenketten würde den umschließenden Block vorzeitig beenden.
const safe = (js) => js.replace(/<\/script>/gi, "<\\/script>");

const inner = [
  `<title>${TITLE}</title>`,
  `<style>\n${css}\n</style>`,
  '<div id="app"></div>',
  `<script>\n${safe(data)}\n</script>`,
  `<script>\n${safe(app)}\n</script>`
].join("\n");

const standalone = [
  "<!doctype html>",
  '<html lang="de">',
  "<head>",
  '<meta charset="utf-8">',
  '<meta name="viewport" content="width=device-width, initial-scale=1">',
  "<style>body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>",
  "</head>",
  "<body>",
  inner,
  "</body>",
  "</html>"
].join("\n");

fs.mkdirSync(path.join(__dirname, "dist"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "dist/artifact.html"), inner);
fs.writeFileSync(path.join(__dirname, "dist/pruefungstrainer.html"), standalone);

const kb = (s) => (Buffer.byteLength(s, "utf8") / 1024).toFixed(1) + " KB";
console.log("dist/artifact.html          " + kb(inner));
console.log("dist/pruefungstrainer.html  " + kb(standalone));
