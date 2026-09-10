# Prüfungstrainer Logistiksysteme

Lern-App zur Vorbereitung auf die IHK-Fortbildungsprüfung **Geprüfte/r Fachwirt/in für
Logistiksysteme**. 250 Multiple-Choice-Fragen mit Erläuterung zu jeder Antwort sowie
40 mehrschrittige Rechenaufgaben im Prüfungsformat mit angezeigten Formeln, verteilt
auf die vier Handlungsbereiche der Prüfung.

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
| Rechentrainer | Verbundaufgaben im Prüfungsformat mit Teilaufgaben und immer neuen Zahlen |

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

## Rechentrainer

40 Verbundaufgaben mit insgesamt 153 Teilaufgaben und 135 Formeln, aufgebaut wie die
Aufgaben der schriftlichen Prüfung:

1. **Ausgangssituation** über mehrere Sätze mit Unternehmen, Anlass und
   Rahmenbedingungen (500 bis 700 Zeichen)
2. **Formeln**, die für die Lösung gebraucht werden – auf Wunsch ausblendbar
3. **Gegebene Werte** als Liste
4. **Teilaufgaben a), b), c) …**, die aufeinander aufbauen, mit eigener Eingabe je
   Teilaufgabe

Bei jedem Aufruf werden **neue Zahlen** erzeugt – geübt wird der Rechenweg, nicht das
Ergebnis. Nach dem Prüfen wird jede Teilaufgabe einzeln als richtig oder falsch
markiert und mit Lösung und vollständigem Rechenweg aufgelöst. Als gelöst zählt eine
Aufgabe nur, wenn alle Teilaufgaben stimmen.

### Abgedeckte Formelbereiche

| Bereich | Formeln |
|---|---|
| Bestand und Lager | durchschnittlicher Lagerbestand, Umschlagshäufigkeit, Lagerdauer, Lagerzinssatz, Lagerzinsen, Lagerreichweite, Meldebestand, Sicherheits- und Höchstbestand, Fehlmengenkosten |
| Beschaffung | optimale Bestellmenge nach Andler, Bestellhäufigkeit, Bezugspreis, Angebotsvergleich, Lieferantenbewertung mit Punktbewertung, ABC-Wertanteil |
| Kalkulation | Zuschlagskalkulation, Vorwärtskalkulation bis zum Listenverkaufspreis, Maschinenstundensatz, kalkulatorische Abschreibung und Zinsen, Prozesskostenrechnung, Deckungsbeitrag, Break-even |
| Investition und Finanzierung | Kostenvergleich mit kritischer Menge, Kapitalwert, Amortisation, Make-or-Buy, Skontoausnutzung und Lieferantenkredit, Bilanz- und Liquiditätskennzahlen, Cashflow, ROI |
| Produktion | Taktzeit und Linienauslegung, optimale Losgröße, Kanban-Regelkreis, Stücklistenauflösung mit Ausschuss, Nettobedarf, Trichterformel, OEE mit Einzelfaktoren |
| Lager und Transport | Stellplatz- und Flächenbedarf, Flächennutzungsgrad, Lademeter, Fahrzeugbedarf, Auslastungsgrad, Kosten je Tonnenkilometer und je Sendung, Luftfracht-Volumengewicht |
| Außenhandel | Zollwert, Zoll, Einfuhrumsatzsteuer, Wechselkursumrechnung im Global Sourcing, Umsatzsteuer-Zahllast |
| Personal | Personalbedarf aus Arbeitsvolumen, Nettopersonalbedarf, Schichtbesetzung, Personalkosten je produktiver Stunde, Fehlzeiten- und Fluktuationsquote |
| Qualität und Service | Lieferbereitschaftsgrad, Termintreue, OTIF, ppm-Fehlerquote, Qualitätskosten und Zehnerregel, Kommissionierleistung, CO2-Bilanz |

Die Eingabe wird deutsch gelesen: Nachkommastellen mit Komma. Geprüft wird mit einer
kleinen Toleranz, damit Zwischenrundungen nicht als Fehler zählen. Rechenaufgaben
zählen wie Fragen in den Lernfortschritt ihres Handlungsbereichs.

### Eine Rechenaufgabe ergänzen

Vorlagen stehen in `data/formulas.js`. `make()` erzeugt bei jedem Aufruf einen neuen
Satz Zahlen und liefert Situation, gegebene Werte und die Teilaufgaben:

```js
{
  id:       "RB-41",              // dauerhafte Kennung, NIE ändern
  cat:      "ums",                // Handlungsbereich
  topic:    "Logistikcontrolling",
  name:     "Bestandsanalyse einer Warengruppe",
  formulas: ["Umschlagshäufigkeit = Wareneinsatz ÷ durchschnittlicher Lagerbestand",
             "Durchschnittliche Lagerdauer = 360 ÷ Umschlagshäufigkeit"],
  make: function () {
    var uh = pick([4, 5, 6, 8]), bestand = ri(15, 45) * 10000;
    return {
      text:  "Die … GmbH betreibt … (mehrere Sätze Ausgangssituation)",
      given: [["Wareneinsatz im Jahr", eur(uh * bestand)],
              ["Durchschnittlicher Lagerbestand", eur(bestand)]],
      parts: [
        { ask: "Ermitteln Sie die Umschlagshäufigkeit.", unit: "Umschläge je Jahr",
          decimals: 1, value: uh, steps: ["… = " + nf(uh, 1)] },
        { ask: "Berechnen Sie die durchschnittliche Lagerdauer.", unit: "Tage",
          decimals: 0, value: 360 / uh, tol: 1, steps: ["360 ÷ … "] }
      ]
    };
  }
}
```

Wähle die Zufallswerte so, dass sich saubere Ergebnisse einstellen – am besten das
Ergebnis zuerst ziehen und die gegebenen Werte daraus ableiten. Achte darauf, dass
keine negativen oder sinnlosen Zwischenwerte entstehen können; ein Fuzz-Lauf über
alle Vorlagen deckt das zuverlässig auf.

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
data/questions.js       Fragenkatalog und Handlungsbereiche
data/formulas.js        Rechenaufgaben mit Zufallszahlen
build.js                erzeugt die Einzeldatei-Fassungen in dist/
manifest.webmanifest    Name, Icons und Startverhalten der installierten App
sw.js                   Service Worker für den Offlinebetrieb
icons/                  App-Icons einschließlich apple-touch-icon
.github/workflows/      Veröffentlichung über GitHub Pages
```
