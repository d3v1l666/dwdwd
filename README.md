# Prüfungstrainer Logistiksysteme

Lern-App zur Vorbereitung auf die IHK-Fortbildungsprüfung **Geprüfte/r Fachwirt/in für
Logistiksysteme**. 224 Multiple-Choice-Fragen mit Erläuterung zu jeder Antwort,
verteilt auf 13 Handlungsfelder.

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

`.github/workflows/pages.yml` veröffentlicht bei jedem Push automatisch. Falls die
Seite noch nicht erreichbar ist, einmalig unter **Settings → Pages** als Quelle
*GitHub Actions* auswählen und den Workflow unter *Actions* erneut starten.

Nach dem Umbenennen von Fragen oder Programmteilen genügt ein Push; der Service
Worker holt geänderte Dateien im Hintergrund nach und aktiviert sie beim
übernächsten Start.

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
- Auswahl von Umfang (10, 20, 40, alle) und Handlungsfeldern
- Auswertung mit Notenstufe nach IHK-Bewertungsschlüssel und Aufschlüsselung
  nach Handlungsfeld
- Beherrschungsgrad je Handlungsfeld: eine Frage gilt als sicher, wenn sie zweimal
  hintereinander richtig beantwortet wurde
- Countdown bis zum eingetragenen Prüfungstermin
- Helles und dunkles Erscheinungsbild, Bedienung per Tastatur
  (`1`–`9` auswählen, `Enter` weiter, `Esc` beenden)

Der Lernfortschritt liegt ausschließlich im `localStorage` des jeweiligen Browsers.
Er wird nicht übertragen und geht verloren, wenn die Browserdaten gelöscht werden
oder ein anderes Gerät verwendet wird.

## Handlungsfelder

**Wirtschaftsbezogene Qualifikationen** – Volks- und Betriebswirtschaft (18),
Rechnungswesen (18), Recht und Steuern (18), Unternehmensführung (16)

**Handlungsspezifische Qualifikationen** – Logistikkonzeption und Supply Chain
Management (18), Beschaffung und Materialwirtschaft (18), Produktionslogistik (14),
Lager/Kommissionierung/Materialfluss (20), Transport und Distribution (20),
Logistikcontrolling und Kennzahlen (16), IT-Systeme und Digitalisierung (14),
Qualität/Umwelt/Gefahrgut/Arbeitsschutz (18), Führung und Zusammenarbeit (16)

Die Zuordnung orientiert sich an den üblichen IHK-Prüfungsinhalten. Der genaue
Zuschnitt der Prüfungsteile steht im Rahmenplan der zuständigen Kammer und sollte
damit abgeglichen werden.

## Fragen ergänzen

Alle Inhalte stehen in `data/questions.js`. Eine Frage sieht so aus:

```js
{
  id: "LAG-21",              // eindeutig, Präfix = Handlungsfeld
  cat: "lag",                // id aus window.CATEGORIES
  q:  "Fragetext?",
  a:  ["Option A", "Option B", "Option C"],
  c:  [0, 2],                // Indizes der richtigen Optionen; mehr als einer => Mehrfachauswahl
  e:  "Erläuterung, warum das richtig ist und warum die Alternativen es nicht sind."
}
```

Neue Handlungsfelder werden in `window.CATEGORIES` ergänzt und über `mod` einem
der beiden Prüfungsteile in `window.MODULES` zugeordnet.

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
