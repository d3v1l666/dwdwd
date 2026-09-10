# Prüfungstrainer Logistiksysteme

Lern-App zur Vorbereitung auf die IHK-Fortbildungsprüfung **Geprüfte/r Fachwirt/in für
Logistiksysteme**. 250 Multiple-Choice-Fragen mit Erläuterung zu jeder Antwort,
verteilt auf die vier Handlungsbereiche der Prüfung.

Die Oberfläche folgt den iOS-Mustern – Systemschrift, gruppierte Listen, Segmented
Controls und die Systemfarben für hell und dunkel –, damit sie sich als
Home-Bildschirm-App auf dem iPhone wie eine native App anfühlt. Webfonts werden nicht
geladen; die App nutzt die Systemschrift des Geräts und startet dadurch sofort und
ohne Netz.

## Benutzen

Ohne Installation: `index.html` im Browser öffnen. Es gibt keinen Build-Schritt und
keine Abhängigkeiten – reines HTML, CSS und JavaScript.

Für unterwegs oder offline: `node build.js` erzeugt unter `dist/` zusätzlich
`pruefungstrainer.html`, eine einzelne Datei mit allem darin. Die lässt sich kopieren,
per Mail verschicken und per Doppelklick öffnen.

## Auf dem iPhone installieren

Die App ist eine PWA und lässt sich ohne App Store und ohne Entwicklerkonto auf den
Home-Bildschirm legen. Voraussetzung ist, dass sie über HTTPS erreichbar ist –
GitHub Pages übernimmt das (siehe unten).

1. Seite in **Safari** öffnen (nicht in Chrome – nur Safari kann unter iOS installieren)
2. Teilen-Symbol antippen
3. **Zum Home-Bildschirm** wählen, mit *Hinzufügen* bestätigen

Danach liegt sie mit eigenem Icon auf dem Home-Bildschirm, startet ohne Browserleiste
und funktioniert **offline** – der Service Worker legt Fragen, Programm und Schriften
im Gerät ab. Der Lernfortschritt dieser Home-Bildschirm-App ist ein eigener Speicher,
getrennt von dem in der normalen Safari-Ansicht.

Unter Android geht es genauso über *Menü → App installieren*.

## Veröffentlichen über GitHub Pages

Einmalig einzurichten, weil ein Workflow die Pages-Seite nicht selbst anlegen darf:

1. Im Repository auf **Settings → Pages**
2. Unter *Build and deployment* als **Source** den Eintrag **GitHub Actions** wählen
3. Unter **Actions → GitHub Pages** den Workflow einmal über *Run workflow* starten

Danach liegt die App unter `https://d3v1l666.github.io/dwdwd/` und wird bei jedem
weiteren Push automatisch aktualisiert. Bis Schritt 2 erledigt ist, scheitert der
Workflow mit *Get Pages site failed – Not Found*; das ist erwartbar.

Wer ohne Actions auskommen möchte, wählt unter *Source* stattdessen **Deploy from a
branch** mit dem Branch `claude/fachwirt-logistik-exam-app-y5z8io` und dem Ordner
`/ (root)` – die App liegt bereits im Wurzelverzeichnis. In dem Fall kann
`.github/workflows/pages.yml` gelöscht werden.

Nach Änderungen an Fragen oder Programmteilen genügt ein Push; der Service Worker
holt geänderte Dateien im Hintergrund nach und aktiviert sie beim übernächsten Start.

## Was die App kann

**Drei Modi**

| Modus | Verhalten |
|---|---|
| Lernmodus | Auflösung und Erläuterung direkt nach jeder Frage |
| Prüfungssimulation | auf Zeit (90 Sekunden je Frage), Auswertung erst am Ende |
| Fehlerspeicher | nur Fragen, die zuletzt falsch beantwortet wurden |

**Weiteres**

- Einfach- und Mehrfachauswahl; bei Mehrfachauswahl zählt die Antwort nur, wenn
  genau alle richtigen Aussagen angekreuzt sind
- Fragen und Antwortoptionen werden bei jedem Durchlauf neu gemischt
- Auswahl von Umfang (10, 20, 40, alle) und Handlungsbereichen
- Auswertung mit Notenstufe nach IHK-Bewertungsschlüssel und Aufschlüsselung
  nach Handlungsbereich
- Eigener Fortschritt je Handlungsbereich mit Balken und Trefferquote; eine Frage
  gilt als sicher, wenn sie zweimal hintereinander richtig beantwortet wurde
- Countdown bis zum eingetragenen Prüfungstermin
- Darstellung wahlweise automatisch (Systemeinstellung), hell oder dunkel
- Bedienung per Tastatur am Rechner (`1`–`9` auswählen, `Enter` weiter, `Esc` beenden)
- Auswahlvorgänge ändern nur die betroffenen Stellen der Seite; die
  Bildlaufposition bleibt dabei erhalten

Der Lernfortschritt liegt ausschließlich im `localStorage` des jeweiligen Browsers.
Er wird nicht übertragen und geht verloren, wenn die Browserdaten gelöscht werden
oder ein anderes Gerät verwendet wird.

## Handlungsbereiche

Die Fragen sind den vier Handlungsbereichen der Prüfung zugeordnet:

| | Handlungsbereich | Fragen |
|---|---|---|
| HB1 | Logistische Anforderungen ermitteln, analysieren und bewerten | 73 |
| HB2 | Logistische Lösungen entwickeln und planen | 70 |
| HB3 | Kommunikation, Führung und Zusammenarbeit | 46 |
| HB4 | Logistische Lösungen umsetzen, bewerten und weiterentwickeln | 61 |

Zusätzlich trägt jede Frage ihr Fachthema (`topic`) – etwa *Beschaffung und
Materialwirtschaft* oder *Transport und Distribution*. Es erscheint im Fragebogen
unter der Frage und lässt die fachliche Herkunft erkennen, ohne die Bereichsstruktur
aufzuweichen.

Jeder Handlungsbereich hat einen eigenen Fortschritt: Balken und Angabe zeigen, wie
viele Fragen des Bereichs bereits sicher beherrscht werden und wie hoch die
Trefferquote darin ist. Diese Werte werden aus den Fragestatistiken abgeleitet und
nicht getrennt gespeichert, können also nicht davon abweichen.

Gleiche den Zuschnitt mit dem Rahmenplan deiner Kammer ab.


## Fragen ergänzen

Alle Inhalte stehen in `data/questions.js`. Eine Frage sieht so aus:

```js
{
  id:    "LAG-21",           // dauerhafte Kennung, NIE ändern (siehe unten)
  cat:   "ums",              // id aus window.CATEGORIES
  topic: "Lager und Kommissionierung",   // Fachthema, frei wählbar
  q:     "Fragetext?",
  a:     ["Option A", "Option B", "Option C"],
  c:     [0, 2],             // Indizes der richtigen Optionen; mehr als einer => Mehrfachauswahl
  e:     "Erläuterung, warum das richtig ist und warum die Alternativen es nicht sind."
}
```

**Die `id` ist der Schlüssel des Lernfortschritts und darf sich nie ändern.** Sie ist
bewusst von Kategorie und Reihenfolge entkoppelt: Fragen lassen sich beliebig
umsortieren, umbenennen oder einem anderen Handlungsbereich zuordnen, ohne dass der
gespeicherte Fortschritt verloren geht. Das Präfix einer Kennung spiegelt nur ihre
Herkunft wider, nicht ihre heutige Zuordnung.

## Lernfortschritt und Aktualisierungen

Der Fortschritt liegt unter dem festen Schlüssel `fls-trainer` im `localStorage`:

```js
{ schema: 2,
  settings: { theme, examDate, mode, size, cats },
  stats:    { "<Frage-id>": { seen, right, wrong, streak } } }
```

Der Schlüssel enthält keine Versionsnummer mehr, die Fassung steht als `schema` im
Inhalt. Beim Start prüft `adopt()` jedes Feld einzeln und setzt Unbrauchbares auf den
Standard zurück, statt den ganzen Stand zu verwerfen. Konkret:

- Einstellungen werden einzeln auf Typ und zulässigen Wert geprüft
- Ausgewählte Handlungsbereiche, die es nicht mehr gibt, werden verworfen; bleibt
  nichts übrig, sind wieder alle ausgewählt statt einer leeren Auswahl
- Statistiken zu Fragen, die es nicht mehr gibt, fallen weg; alle übrigen bleiben
- Vor einer Umstellung wird der unveränderte alte Stand unter
  `fls-trainer-backup` gesichert, der alte Schlüssel `fls-trainer-v1` bleibt liegen

Für eine künftige Schemaänderung wird `SCHEMA` erhöht und `adopt()` um die
Umsetzung der alten Struktur ergänzt.

## Aufbau

```
index.html              Gerüst und Einbindung
styles.css              Gestaltung, helles und dunkles Farbschema
app.js                  Ablauf, Auswertung, Speicherung
data/questions.js       Fragenkatalog und Handlungsfelder
build.js                erzeugt die Einzeldatei-Fassungen in dist/
manifest.webmanifest    Name, Icons und Startverhalten der installierten App
sw.js                   Service Worker für den Offlinebetrieb
icons/                  App-Icons einschließlich apple-touch-icon
.github/workflows/      Veröffentlichung über GitHub Pages
```
