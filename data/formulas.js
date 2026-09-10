/* Rechenaufgaben im Format der IHK-Prüfung.
 *
 * Aufbau je Aufgabe: eine ausführliche Ausgangssituation, die benötigten Formeln
 * und mehrere aufeinander aufbauende Teilaufgaben a), b), c) … Jede Vorlage
 * erzeugt über make() bei jedem Aufruf neue Zahlen, damit der Rechenweg geübt
 * wird und nicht das Ergebnis.
 *
 * Feld id ist die dauerhafte Kennung für den Lernfortschritt und ändert sich nie.
 */
(function () {
  "use strict";

  function ri(min, max, step) {
    step = step || 1;
    return min + Math.floor(Math.random() * (Math.floor((max - min) / step) + 1)) * step;
  }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function nf(n, d) {
    return n.toLocaleString("de-DE", {
      minimumFractionDigits: d || 0,
      maximumFractionDigits: d === undefined ? 2 : d
    });
  }
  function eur(n, d) { return nf(n, d === undefined ? 0 : d) + " Euro"; }
  function stk(n) { return nf(n, 0) + " Stück"; }
  function pz(n, d) { return nf(n, d === undefined ? 1 : d) + " %"; }

  window.FORMULAS = [

  /* ================= HB1: Anforderungen ermitteln, analysieren, bewerten ============ */

  {
    id: "RB-01", cat: "anf", topic: "Logistikcontrolling",
    name: "Bestandsanalyse einer Warengruppe",
    formulas: [
      "Durchschnittlicher Lagerbestand = (Anfangsbestand + Endbestand) ÷ 2",
      "Umschlagshäufigkeit = Wareneinsatz ÷ durchschnittlicher Lagerbestand",
      "Durchschnittliche Lagerdauer = 360 ÷ Umschlagshäufigkeit",
      "Lagerzinssatz = Jahreszinssatz × durchschnittliche Lagerdauer ÷ 360"
    ],
    make: function () {
      var uh = pick([4, 5, 6, 8, 9, 10, 12]);
      var mittel = ri(15, 45) * 10000;
      var ab = mittel - ri(2, 8) * 10000, eb = 2 * mittel - ab;
      var einsatz = uh * mittel, zins = pick([4, 5, 6, 7, 8]);
      var dauer = 360 / uh, lzs = zins * dauer / 360;
      return {
        text: "Die Nordfracht Logistik GmbH betreibt in Bremen ein Zentrallager für Ersatzteile des " +
          "Nutzfahrzeughandels. Nach mehreren Jahren mit wachsendem Sortiment ist die Kapitalbindung " +
          "im Lager deutlich gestiegen, ohne dass der Umsatz im gleichen Maß zugenommen hat. Die " +
          "Geschäftsführung hat deshalb ein Bestandsprojekt angestoßen und Sie als Fachwirt mit der " +
          "Auswertung beauftragt. Für die Warengruppe Bremsen liegen aus der Lagerbuchhaltung die " +
          "Bestände zu Beginn und zum Ende des Geschäftsjahres sowie der Wareneinsatz vor. Für die " +
          "Bewertung der Kapitalbindung gibt das Rechnungswesen einen kalkulatorischen Zinssatz vor. " +
          "Im Unternehmen wird einheitlich mit einem Geschäftsjahr von 360 Tagen gerechnet.",
        given: [["Anfangsbestand", eur(ab)], ["Endbestand", eur(eb)],
                ["Wareneinsatz im Geschäftsjahr", eur(einsatz)], ["Kalkulatorischer Jahreszinssatz", pz(zins, 0)]],
        parts: [
          { ask: "Ermitteln Sie den durchschnittlichen Lagerbestand.", unit: "Euro", decimals: 0, value: mittel,
            steps: ["(" + eur(ab) + " + " + eur(eb) + ") ÷ 2 = " + eur(mittel)] },
          { ask: "Berechnen Sie die Umschlagshäufigkeit.", unit: "Umschläge je Jahr", decimals: 1, value: uh,
            steps: [eur(einsatz) + " ÷ " + eur(mittel) + " = " + nf(uh, 1)] },
          { ask: "Ermitteln Sie die durchschnittliche Lagerdauer.", unit: "Tage", decimals: 0, value: dauer,
            steps: ["360 ÷ " + nf(uh, 1) + " = " + nf(dauer, 0) + " Tage"] },
          { ask: "Berechnen Sie den Lagerzinssatz.", unit: "%", decimals: 2, value: lzs,
            steps: [pz(zins, 0) + " × " + nf(dauer, 0) + " ÷ 360 = " + pz(lzs, 2)] }
        ]
      };
    }
  },

  {
    id: "RB-02", cat: "anf", topic: "Beschaffung",
    name: "Angebotsvergleich zweier Lieferanten",
    formulas: [
      "Listenpreis − Rabatt = Zieleinkaufspreis",
      "Zieleinkaufspreis − Skonto = Bareinkaufspreis",
      "Bareinkaufspreis + Bezugskosten = Bezugspreis (Einstandspreis)"
    ],
    make: function () {
      var m = ri(2, 12) * 500;
      var lpA = ri(20, 45) / 10, rabA = pick([5, 10, 15]), skA = pick([2, 3]), bkA = ri(20, 90) * 10;
      var lpB = ri(20, 45) / 10, rabB = pick([8, 12, 20]), skB = pick([2, 3]), bkB = ri(20, 90) * 10;
      var A = lpA * m * (1 - rabA / 100) * (1 - skA / 100) + bkA;
      var B = lpB * m * (1 - rabB / 100) * (1 - skB / 100) + bkB;
      return {
        text: "Die Süd-Distribution GmbH & Co. KG beschafft für ihr Distributionszentrum in Ingolstadt " +
          "Kunststoffpaletten als Ersatz für die bisher eingesetzten Holzpaletten. Zwei Lieferanten haben " +
          "angeboten. Die Angebote sind unterschiedlich aufgebaut: Lieferant A gewährt einen niedrigeren " +
          "Rabatt, berechnet aber geringere Frachtkosten, Lieferant B wirbt mit einem höheren Rabatt bei " +
          "höheren Bezugskosten. Beide Angebote beziehen sich auf dieselbe Menge und dieselbe Qualität, " +
          "die Zahlungsziele sind identisch. Damit die Einkaufsleitung entscheiden kann, sind beide " +
          "Angebote einheitlich auf den Einstandspreis zurückzurechnen.",
        given: [["Bestellmenge", stk(m)],
                ["Angebot A: Listenpreis je Stück", eur(lpA, 2)], ["Angebot A: Rabatt", pz(rabA, 0)],
                ["Angebot A: Skonto", pz(skA, 0)], ["Angebot A: Bezugskosten", eur(bkA)],
                ["Angebot B: Listenpreis je Stück", eur(lpB, 2)], ["Angebot B: Rabatt", pz(rabB, 0)],
                ["Angebot B: Skonto", pz(skB, 0)], ["Angebot B: Bezugskosten", eur(bkB)]],
        parts: [
          { ask: "Ermitteln Sie den Bezugspreis des Angebots A für die gesamte Bestellmenge.",
            unit: "Euro", decimals: 2, value: A,
            steps: ["Listenpreis gesamt: " + stk(m) + " × " + eur(lpA, 2) + " = " + eur(lpA * m, 2),
                    "Ziel: " + eur(lpA * m, 2) + " − " + pz(rabA, 0) + " = " + eur(lpA * m * (1 - rabA / 100), 2),
                    "Bar: − " + pz(skA, 0) + " = " + eur(lpA * m * (1 - rabA / 100) * (1 - skA / 100), 2),
                    "+ Bezugskosten " + eur(bkA) + " = " + eur(A, 2)] },
          { ask: "Ermitteln Sie den Bezugspreis des Angebots B für die gesamte Bestellmenge.",
            unit: "Euro", decimals: 2, value: B,
            steps: ["Listenpreis gesamt: " + stk(m) + " × " + eur(lpB, 2) + " = " + eur(lpB * m, 2),
                    "Ziel: − " + pz(rabB, 0) + " = " + eur(lpB * m * (1 - rabB / 100), 2),
                    "Bar: − " + pz(skB, 0) + " = " + eur(lpB * m * (1 - rabB / 100) * (1 - skB / 100), 2),
                    "+ Bezugskosten " + eur(bkB) + " = " + eur(B, 2)] },
          { ask: "Berechnen Sie den Preisvorteil des günstigeren Angebots als Betrag.",
            unit: "Euro", decimals: 2, value: Math.abs(A - B),
            steps: ["Günstiger ist Angebot " + (A < B ? "A" : "B"),
                    "Differenz: " + eur(Math.max(A, B), 2) + " − " + eur(Math.min(A, B), 2) + " = " + eur(Math.abs(A - B), 2)] }
        ]
      };
    }
  },

  {
    id: "RB-03", cat: "anf", topic: "Beschaffung",
    name: "Lieferantenbewertung mit Punktbewertung",
    formulas: [
      "Gewichtete Punktzahl je Kriterium = Punktwert × Gewichtung",
      "Gesamtpunktzahl = Summe der gewichteten Punktzahlen",
      "Zielerreichung = Gesamtpunktzahl ÷ maximal erreichbare Punktzahl × 100"
    ],
    make: function () {
      var g = [40, 25, 20, 15];
      var pA = [ri(60, 95), ri(55, 95), ri(60, 100), ri(50, 90)];
      var pB = [ri(60, 95), ri(55, 95), ri(60, 100), ri(50, 90)];
      var sum = function (p) { return (p[0] * g[0] + p[1] * g[1] + p[2] * g[2] + p[3] * g[3]) / 100; };
      var A = sum(pA), B = sum(pB);
      return {
        text: "Die Rheinlager Kontraktlogistik GmbH schreibt die Belieferung mit Verpackungsmaterial neu aus. " +
          "Nach mehreren Qualitätsproblemen beim bisherigen Lieferanten soll die Auswahl künftig nicht mehr " +
          "allein über den Preis erfolgen, sondern über eine nachvollziehbare Punktbewertung. Die " +
          "Einkaufsleitung hat gemeinsam mit der Qualitätssicherung vier Kriterien mit unterschiedlicher " +
          "Gewichtung festgelegt. Je Kriterium werden bis zu 100 Punkte vergeben. Für die beiden " +
          "verbliebenen Lieferanten liegen die Bewertungen der Fachbereiche vor. Sie sollen die Auswertung " +
          "erstellen und die Entscheidung vorbereiten.",
        given: [["Gewichtung Preis / Qualität / Liefertreue / Service", "40 % / 25 % / 20 % / 15 %"],
                ["Lieferant A: Punkte", pA.join(" / ")],
                ["Lieferant B: Punkte", pB.join(" / ")]],
        parts: [
          { ask: "Ermitteln Sie die gewichtete Gesamtpunktzahl des Lieferanten A.",
            unit: "Punkte", decimals: 2, value: A,
            steps: [pA[0] + " × 40 % + " + pA[1] + " × 25 % + " + pA[2] + " × 20 % + " + pA[3] + " × 15 %",
                    "= " + nf(A, 2) + " Punkte"] },
          { ask: "Ermitteln Sie die gewichtete Gesamtpunktzahl des Lieferanten B.",
            unit: "Punkte", decimals: 2, value: B,
            steps: [pB[0] + " × 40 % + " + pB[1] + " × 25 % + " + pB[2] + " × 20 % + " + pB[3] + " × 15 %",
                    "= " + nf(B, 2) + " Punkte"] },
          { ask: "Berechnen Sie die Zielerreichung des besseren Lieferanten bei maximal 100 Punkten.",
            unit: "%", decimals: 2, value: Math.max(A, B),
            steps: ["Besser ist Lieferant " + (A > B ? "A" : "B") + " mit " + nf(Math.max(A, B), 2) + " Punkten",
                    nf(Math.max(A, B), 2) + " ÷ 100 × 100 = " + pz(Math.max(A, B), 2)] }
        ]
      };
    }
  },

  {
    id: "RB-04", cat: "anf", topic: "Beschaffung",
    name: "ABC-Analyse des Artikelsortiments",
    formulas: [
      "Verbrauchswert = Jahresverbrauchsmenge × Einstandspreis",
      "Wertanteil = Verbrauchswert ÷ Gesamtverbrauchswert × 100",
      "Kumulierter Wertanteil = Summe der Wertanteile bis einschließlich dieser Position"
    ],
    make: function () {
      var m1 = ri(20, 60) * 100, p1 = ri(30, 90);
      var m2 = ri(40, 120) * 100, p2 = ri(8, 25);
      var rest = ri(20, 60) * 10000;
      var w1 = m1 * p1, w2 = m2 * p2, ges = w1 + w2 + rest;
      return {
        text: "Im Ersatzteillager der Elbe Industriemontage GmbH werden rund 4.000 Artikel geführt. Alle " +
          "Artikel werden bislang gleich disponiert, was in der Materialwirtschaft erheblichen Aufwand " +
          "verursacht und zugleich bei hochwertigen Teilen zu unnötig hohen Beständen führt. Sie sollen " +
          "eine ABC-Analyse einführen, damit die Dispositionsverfahren künftig nach der Wertigkeit der " +
          "Artikel gestaffelt werden können. Für zwei Artikel, die im Verdacht stehen, zur A-Gruppe zu " +
          "gehören, liegen Jahresverbrauch und Einstandspreis vor. Der Verbrauchswert aller übrigen " +
          "Artikel des Lagers ist bekannt.",
        given: [["Artikel 1: Jahresverbrauch", stk(m1)], ["Artikel 1: Einstandspreis", eur(p1)],
                ["Artikel 2: Jahresverbrauch", stk(m2)], ["Artikel 2: Einstandspreis", eur(p2)],
                ["Verbrauchswert aller übrigen Artikel", eur(rest)]],
        parts: [
          { ask: "Ermitteln Sie den Verbrauchswert des Artikels 1.", unit: "Euro", decimals: 0, value: w1,
            steps: [stk(m1) + " × " + eur(p1) + " = " + eur(w1)] },
          { ask: "Berechnen Sie den Gesamtverbrauchswert des Lagers.", unit: "Euro", decimals: 0, value: ges,
            steps: [eur(w1) + " + " + eur(w2) + " + " + eur(rest) + " = " + eur(ges)] },
          { ask: "Ermitteln Sie den Wertanteil des Artikels 1 am Gesamtverbrauchswert.",
            unit: "%", decimals: 2, value: w1 / ges * 100,
            steps: [eur(w1) + " ÷ " + eur(ges) + " × 100 = " + pz(w1 / ges * 100, 2)] },
          { ask: "Ermitteln Sie den kumulierten Wertanteil beider Artikel zusammen.",
            unit: "%", decimals: 2, value: (w1 + w2) / ges * 100,
            steps: ["(" + eur(w1) + " + " + eur(w2) + ") ÷ " + eur(ges) + " × 100 = " + pz((w1 + w2) / ges * 100, 2)] }
        ]
      };
    }
  },

  {
    id: "RB-05", cat: "anf", topic: "Logistikcontrolling",
    name: "Bewertung des Lieferservice",
    formulas: [
      "Lieferbereitschaftsgrad = sofort erfüllte Positionen ÷ Positionen gesamt × 100",
      "Termintreue = termingerechte Lieferungen ÷ Lieferungen gesamt × 100",
      "OTIF = vollständig und termingerecht gelieferte Aufträge ÷ Aufträge gesamt × 100"
    ],
    make: function () {
      var pos = ri(40, 120) * 100, fehl = ri(2, 40) * 10;
      var lief = ri(20, 90) * 10, spaet = ri(5, 80);
      var auf = ri(15, 70) * 10, otif = auf - ri(10, 120);
      return {
        text: "Die MediLog Pharmadistribution GmbH beliefert Apotheken und Krankenhäuser im gesamten " +
          "Bundesgebiet. In den vergangenen Monaten haben sich Beschwerden über nicht lieferbare " +
          "Positionen und verspätete Zustellungen gehäuft. Ein Großkunde hat angekündigt, den " +
          "Rahmenvertrag zu überprüfen, falls die vereinbarten Servicewerte weiter unterschritten werden. " +
          "Die Geschäftsleitung möchte den Lieferservice des vergangenen Monats vollständig bewertet " +
          "sehen, bevor über zusätzliche Sicherheitsbestände oder eine zweite Tourenwelle entschieden " +
          "wird. Aus dem Auftragssystem liegen die Zahlen des Monats vor.",
        given: [["Auftragspositionen gesamt", nf(pos, 0)], ["Davon nicht sofort lieferbar", nf(fehl, 0)],
                ["Lieferungen gesamt", nf(lief, 0)], ["Davon verspätet", nf(spaet, 0)],
                ["Aufträge gesamt", nf(auf, 0)], ["Davon vollständig und pünktlich", nf(otif, 0)]],
        parts: [
          { ask: "Ermitteln Sie den Lieferbereitschaftsgrad.", unit: "%", decimals: 2, value: (pos - fehl) / pos * 100,
            steps: ["Sofort erfüllt: " + nf(pos, 0) + " − " + nf(fehl, 0) + " = " + nf(pos - fehl, 0),
                    nf(pos - fehl, 0) + " ÷ " + nf(pos, 0) + " × 100 = " + pz((pos - fehl) / pos * 100, 2)] },
          { ask: "Berechnen Sie die Termintreue.", unit: "%", decimals: 2, value: (lief - spaet) / lief * 100,
            steps: [nf(lief - spaet, 0) + " ÷ " + nf(lief, 0) + " × 100 = " + pz((lief - spaet) / lief * 100, 2)] },
          { ask: "Ermitteln Sie die OTIF-Quote.", unit: "%", decimals: 2, value: otif / auf * 100,
            steps: [nf(otif, 0) + " ÷ " + nf(auf, 0) + " × 100 = " + pz(otif / auf * 100, 2)] }
        ]
      };
    }
  },

  {
    id: "RB-06", cat: "anf", topic: "Kosten und Kalkulation",
    name: "Wirtschaftlichkeit, Produktivität und Rentabilität",
    formulas: [
      "Wirtschaftlichkeit = Leistung (Ertrag) ÷ Kosten (Aufwand)",
      "Produktivität = Ausbringungsmenge ÷ Faktoreinsatzmenge",
      "Umsatzrentabilität = Gewinn ÷ Umsatz × 100",
      "Return on Investment = Gewinn ÷ Gesamtkapital × 100"
    ],
    make: function () {
      var umsatz = ri(40, 120) * 100000, kosten = Math.round(umsatz * ri(80, 94) / 100);
      var gewinn = umsatz - kosten;
      var kapital = ri(30, 90) * 100000;
      var pos = ri(200, 900) * 1000, std = ri(20, 60) * 1000;
      return {
        text: "Die Rheinlager Kontraktlogistik GmbH betreibt für einen Handelskonzern ein " +
          "Distributionszentrum. Der Vertrag läuft zum Jahresende aus und soll neu verhandelt werden. " +
          "Die Geschäftsführung will für die Verhandlung belastbare Zahlen zur Wirtschaftlichkeit des " +
          "Standorts vorliegen haben, weil der Auftraggeber eine Preissenkung fordert. Neben den " +
          "Erträgen und Kosten des Geschäftsjahres sind auch die erbrachte Kommissionierleistung und " +
          "das im Standort gebundene Kapital bekannt. Sie bereiten die Kennzahlen für die " +
          "Geschäftsführung auf.",
        given: [["Umsatz des Standorts", eur(umsatz)], ["Gesamtkosten des Standorts", eur(kosten)],
                ["Im Standort gebundenes Kapital", eur(kapital)],
                ["Kommissionierte Positionen", nf(pos, 0)], ["Geleistete Arbeitsstunden", nf(std, 0)]],
        parts: [
          { ask: "Ermitteln Sie die Wirtschaftlichkeit des Standorts.", unit: "", decimals: 3, value: umsatz / kosten,
            steps: [eur(umsatz) + " ÷ " + eur(kosten) + " = " + nf(umsatz / kosten, 3)] },
          { ask: "Berechnen Sie die Arbeitsproduktivität in Positionen je Stunde.",
            unit: "Positionen je Stunde", decimals: 2, value: pos / std,
            steps: [nf(pos, 0) + " ÷ " + nf(std, 0) + " = " + nf(pos / std, 2)] },
          { ask: "Ermitteln Sie die Umsatzrentabilität.", unit: "%", decimals: 2, value: gewinn / umsatz * 100,
            steps: ["Gewinn: " + eur(umsatz) + " − " + eur(kosten) + " = " + eur(gewinn),
                    eur(gewinn) + " ÷ " + eur(umsatz) + " × 100 = " + pz(gewinn / umsatz * 100, 2)] },
          { ask: "Berechnen Sie den Return on Investment.", unit: "%", decimals: 2, value: gewinn / kapital * 100,
            steps: [eur(gewinn) + " ÷ " + eur(kapital) + " × 100 = " + pz(gewinn / kapital * 100, 2)] }
        ]
      };
    }
  },

  {
    id: "RB-07", cat: "anf", topic: "Finanzierung",
    name: "Skontoausnutzung und Lieferantenkredit",
    formulas: [
      "Skontobetrag = Rechnungsbetrag × Skontosatz ÷ 100",
      "Jahreszinssatz des Lieferantenkredits = Skontosatz × 360 ÷ (Zahlungsziel − Skontofrist)",
      "Zinsersparnis = Skontobetrag − Zinsen für die Zwischenfinanzierung"
    ],
    make: function () {
      var betrag = ri(20, 90) * 1000, sk = pick([2, 3]), ziel = pick([30, 45, 60]), frist = pick([8, 10, 14]);
      var kredit = pick([7, 8, 9, 10]);
      var skb = betrag * sk / 100;
      var jz = sk * 360 / (ziel - frist);
      var zinsen = (betrag - skb) * kredit / 100 * (ziel - frist) / 360;
      return {
        text: "Der Ostsee Verpackungswerk GmbH liegt eine Eingangsrechnung über die Lieferung von " +
          "Wellpappzuschnitten vor. Der Lieferant räumt bei Zahlung innerhalb der Skontofrist einen " +
          "Skontoabzug ein, andernfalls ist der volle Betrag am Ende des Zahlungsziels fällig. Das " +
          "Geschäftskonto weist derzeit kein Guthaben aus, sodass eine Zahlung innerhalb der Skontofrist " +
          "über den eingeräumten Kontokorrentkredit finanziert werden müsste. Die kaufmännische Leitung " +
          "möchte wissen, ob sich die Skontoausnutzung trotz der Kreditzinsen lohnt, und bittet Sie um " +
          "eine nachvollziehbare Rechnung.",
        given: [["Rechnungsbetrag", eur(betrag)], ["Skontosatz", pz(sk, 0)],
                ["Skontofrist", frist + " Tage"], ["Zahlungsziel", ziel + " Tage"],
                ["Zinssatz des Kontokorrentkredits", pz(kredit, 0)]],
        parts: [
          { ask: "Ermitteln Sie den Skontobetrag.", unit: "Euro", decimals: 2, value: skb,
            steps: [eur(betrag) + " × " + pz(sk, 0) + " = " + eur(skb, 2)] },
          { ask: "Berechnen Sie den Jahreszinssatz des Lieferantenkredits.", unit: "%", decimals: 2, value: jz,
            steps: [pz(sk, 0) + " × 360 ÷ (" + ziel + " − " + frist + ") = " + pz(jz, 2)] },
          { ask: "Ermitteln Sie die Zinsen für die Zwischenfinanzierung des Rechnungsbetrags.",
            unit: "Euro", decimals: 2, value: zinsen,
            steps: ["Zu finanzieren: " + eur(betrag) + " − " + eur(skb, 2) + " = " + eur(betrag - skb, 2),
                    eur(betrag - skb, 2) + " × " + pz(kredit, 0) + " × " + (ziel - frist) + " ÷ 360 = " + eur(zinsen, 2)] },
          { ask: "Berechnen Sie den Vorteil der Skontoausnutzung als Betrag.",
            unit: "Euro", decimals: 2, value: skb - zinsen,
            steps: [eur(skb, 2) + " − " + eur(zinsen, 2) + " = " + eur(skb - zinsen, 2)] }
        ]
      };
    }
  },

  {
    id: "RB-08", cat: "anf", topic: "Rechnungswesen",
    name: "Bilanz- und Liquiditätskennzahlen",
    formulas: [
      "Eigenkapitalquote = Eigenkapital ÷ Gesamtkapital × 100",
      "Liquidität 2. Grades = (flüssige Mittel + kurzfristige Forderungen) ÷ kurzfristige Verbindlichkeiten × 100",
      "Cashflow = Jahresüberschuss + Abschreibungen + Zuführung zu langfristigen Rückstellungen"
    ],
    make: function () {
      var ek = ri(15, 60) * 10000, fk = ri(30, 120) * 10000, gk = ek + fk;
      var fluessig = ri(5, 30) * 10000, ford = ri(10, 50) * 10000, kurzfr = ri(20, 70) * 10000;
      var ueber = ri(8, 40) * 10000, afa = ri(10, 50) * 10000, rueck = ri(2, 15) * 10000;
      return {
        text: "Die Hansa Teile-Service GmbH plant den Bau eines zweiten Lagerstandorts und benötigt dafür " +
          "Fremdkapital. Die Hausbank hat Unterlagen zur Beurteilung der Bonität angefordert und dabei " +
          "ausdrücklich nach Eigenkapitalausstattung, kurzfristiger Zahlungsfähigkeit und " +
          "Innenfinanzierungskraft gefragt. Die Geschäftsführung möchte die Kennzahlen kennen, bevor die " +
          "Unterlagen das Haus verlassen, um im Bankgespräch nicht überrascht zu werden. Aus dem " +
          "Jahresabschluss stehen Ihnen die folgenden Werte zur Verfügung.",
        given: [["Eigenkapital", eur(ek)], ["Fremdkapital", eur(fk)],
                ["Flüssige Mittel", eur(fluessig)], ["Kurzfristige Forderungen", eur(ford)],
                ["Kurzfristige Verbindlichkeiten", eur(kurzfr)],
                ["Jahresüberschuss", eur(ueber)], ["Abschreibungen", eur(afa)],
                ["Zuführung zu langfristigen Rückstellungen", eur(rueck)]],
        parts: [
          { ask: "Ermitteln Sie die Eigenkapitalquote.", unit: "%", decimals: 2, value: ek / gk * 100,
            steps: ["Gesamtkapital: " + eur(ek) + " + " + eur(fk) + " = " + eur(gk),
                    eur(ek) + " ÷ " + eur(gk) + " × 100 = " + pz(ek / gk * 100, 2)] },
          { ask: "Berechnen Sie die Liquidität 2. Grades.", unit: "%", decimals: 2,
            value: (fluessig + ford) / kurzfr * 100,
            steps: ["(" + eur(fluessig) + " + " + eur(ford) + ") ÷ " + eur(kurzfr) + " × 100 = " +
                    pz((fluessig + ford) / kurzfr * 100, 2)] },
          { ask: "Ermitteln Sie den Cashflow.", unit: "Euro", decimals: 0, value: ueber + afa + rueck,
            steps: [eur(ueber) + " + " + eur(afa) + " + " + eur(rueck) + " = " + eur(ueber + afa + rueck)] }
        ]
      };
    }
  },

  {
    id: "RB-09", cat: "anf", topic: "Logistikcontrolling",
    name: "Kommissionierleistung und Qualität",
    formulas: [
      "Kommissionierleistung = Positionen ÷ eingesetzte Arbeitsstunden",
      "Fehlerquote in ppm = Fehler ÷ Positionen × 1.000.000",
      "Kosten je Position = Personalkosten ÷ kommissionierte Positionen"
    ],
    make: function () {
      var pos = ri(120, 480) * 1000, std = ri(6, 24) * 1000, fehl = ri(3, 90) * 10;
      var satz = ri(240, 340) / 10;
      var pk = std * satz;
      return {
        text: "Im Quartalsgespräch mit einem Automobilzulieferer muss die Rheinlager Kontraktlogistik GmbH " +
          "die Leistung ihrer Kommissionierung nachweisen. Im Kontrakt sind sowohl eine Mindestleistung " +
          "je Stunde als auch eine Obergrenze für Kommissionierfehler in Teilen je Million vereinbart; " +
          "bei Überschreitung werden Malusregelungen wirksam. Zusätzlich hat der Auftraggeber " +
          "angekündigt, die Kosten je Position mit denen eines Wettbewerbers zu vergleichen. Aus der " +
          "Betriebsdatenerfassung des Quartals liegen die folgenden Werte vor, der durchschnittliche " +
          "Personalkostensatz je Stunde ist aus der Kostenrechnung bekannt.",
        given: [["Kommissionierte Positionen", nf(pos, 0)], ["Eingesetzte Arbeitsstunden", nf(std, 0)],
                ["Fehlerhafte Positionen", nf(fehl, 0)], ["Personalkostensatz je Stunde", eur(satz, 2)]],
        parts: [
          { ask: "Ermitteln Sie die Kommissionierleistung.", unit: "Positionen je Stunde", decimals: 2,
            value: pos / std,
            steps: [nf(pos, 0) + " ÷ " + nf(std, 0) + " = " + nf(pos / std, 2)] },
          { ask: "Berechnen Sie die Fehlerquote in ppm.", unit: "ppm", decimals: 0, value: fehl / pos * 1000000,
            steps: [nf(fehl, 0) + " ÷ " + nf(pos, 0) + " × 1.000.000 = " + nf(Math.round(fehl / pos * 1000000), 0) + " ppm"] },
          { ask: "Ermitteln Sie die Personalkosten je kommissionierter Position.",
            unit: "Euro", decimals: 4, value: pk / pos,
            steps: ["Personalkosten: " + nf(std, 0) + " × " + eur(satz, 2) + " = " + eur(pk, 2),
                    eur(pk, 2) + " ÷ " + nf(pos, 0) + " = " + eur(pk / pos, 4)] }
        ]
      };
    }
  },

  {
    id: "RB-10", cat: "anf", topic: "Beschaffung",
    name: "Lagerreichweite und Fehlmengenkosten",
    formulas: [
      "Lagerreichweite = Lagerbestand ÷ durchschnittlicher Verbrauch je Periode",
      "Fehlmenge = Bedarf im Zeitraum − verfügbarer Bestand",
      "Fehlmengenkosten = Fehlmenge × Fehlmengenkostensatz je Stück"
    ],
    make: function () {
      var tv = ri(20, 90) * 10, bestand = ri(30, 90) * 100;
      var ausfall = ri(20, 60), satz = ri(15, 90) / 10;
      var reichweite = bestand / tv;
      var bedarf = tv * ausfall;
      var fehl = Math.max(0, bedarf - bestand);
      return {
        text: "Die Hansa Teile-Service GmbH beliefert Nutzfahrzeugwerkstätten mit Ersatzteilen. Der " +
          "Vorlieferant einer wichtigen Bremsscheibenserie hat kurzfristig mitgeteilt, dass seine " +
          "Fertigung wegen eines Maschinenschadens für längere Zeit stillsteht. Ein Ersatzlieferant " +
          "steht nicht zur Verfügung, weil das Teil freigabepflichtig ist. Bleibt eine Werkstatt " +
          "unversorgt, entstehen dem Unternehmen vertraglich vereinbarte Ausgleichszahlungen je nicht " +
          "geliefertem Stück. Bevor über eine teure Eilbeschaffung entschieden wird, sollen Sie die " +
          "Lage rechnerisch darstellen.",
        given: [["Vorhandener Lagerbestand", stk(bestand)], ["Durchschnittlicher Tagesverbrauch", stk(tv)],
                ["Dauer des Lieferausfalls", ausfall + " Tage"],
                ["Fehlmengenkostensatz je Stück", eur(satz, 2)]],
        parts: [
          { ask: "Ermitteln Sie die Lagerreichweite in Tagen.", unit: "Tage", decimals: 1, value: reichweite,
            steps: [stk(bestand) + " ÷ " + stk(tv) + " je Tag = " + nf(reichweite, 1) + " Tage"] },
          { ask: "Berechnen Sie den Bedarf während des Lieferausfalls.", unit: "Stück", decimals: 0, value: bedarf,
            steps: [stk(tv) + " × " + ausfall + " Tage = " + stk(bedarf)] },
          { ask: "Ermitteln Sie die zu erwartende Fehlmenge.", unit: "Stück", decimals: 0, value: fehl,
            steps: [stk(bedarf) + " − " + stk(bestand) + " = " + stk(fehl)] },
          { ask: "Berechnen Sie die drohenden Fehlmengenkosten.", unit: "Euro", decimals: 2, value: fehl * satz,
            steps: [stk(fehl) + " × " + eur(satz, 2) + " = " + eur(fehl * satz, 2)] }
        ]
      };
    }
  },
  /* ================= HB2: Lösungen entwickeln und planen ========================== */

  {
    id: "RB-11", cat: "loes", topic: "Beschaffung",
    name: "Optimierung der Bestellmenge",
    formulas: [
      "Optimale Bestellmenge = Wurzel aus (200 × Jahresbedarf × Bestellkosten je Bestellung) ÷ (Einstandspreis × Lagerhaltungskostensatz in %)",
      "Bestellhäufigkeit = Jahresbedarf ÷ Bestellmenge",
      "Durchschnittlicher Lagerbestand = Bestellmenge ÷ 2",
      "Gesamtkosten = Bestellkosten je Jahr + Lagerhaltungskosten je Jahr"
    ],
    make: function () {
      var m = ri(20, 90) * 1000, kf = pick([50, 60, 80, 100, 120]),
          p = pick([4, 5, 8, 10, 12, 20]), lhs = pick([10, 12, 15, 20, 25]);
      var q = Math.sqrt(200 * m * kf / (p * lhs));
      var haeuf = m / q, mittel = q / 2;
      var bestellk = haeuf * kf, lagerk = mittel * p * lhs / 100;
      return {
        text: "Die Ostsee Verpackungswerk GmbH bezieht Wellpappzuschnitte bislang in zwölf gleich großen " +
          "Monatslieferungen. Nach einer Preisrunde beim Vorlieferanten und gestiegenen Zinsen hat die " +
          "kaufmännische Leitung angeordnet, die Beschaffungsstrategie zu überprüfen. Sowohl die " +
          "Bestellkosten je Bestellvorgang als auch der Lagerhaltungskostensatz sind neu ermittelt " +
          "worden. Der Jahresbedarf ist über das Jahr gleichmäßig verteilt, Mengenrabatte gewährt der " +
          "Lieferant nicht, und die Lieferung erfolgt jeweils vollständig zum vereinbarten Termin. Es " +
          "gelten damit die vereinfachenden Annahmen der klassischen Bestellmengenformel.",
        given: [["Jahresbedarf", stk(m)], ["Bestellkosten je Bestellung", eur(kf)],
                ["Einstandspreis je Stück", eur(p)], ["Lagerhaltungskostensatz", pz(lhs, 0)]],
        parts: [
          { ask: "Ermitteln Sie die optimale Bestellmenge.", unit: "Stück", decimals: 0, value: q, tol: 2,
            steps: ["Zähler: 200 × " + nf(m, 0) + " × " + nf(kf, 0) + " = " + nf(200 * m * kf, 0),
                    "Nenner: " + nf(p, 0) + " × " + nf(lhs, 0) + " = " + nf(p * lhs, 0),
                    "Wurzel aus " + nf(200 * m * kf / (p * lhs), 0) + " = rund " + nf(Math.round(q), 0) + " Stück"] },
          { ask: "Berechnen Sie die Anzahl der Bestellungen je Jahr.", unit: "Bestellungen", decimals: 2,
            value: haeuf, tol: 0.05,
            steps: [stk(m) + " ÷ " + nf(Math.round(q), 0) + " Stück = " + nf(haeuf, 2) + " Bestellungen"] },
          { ask: "Ermitteln Sie den durchschnittlichen Lagerbestand.", unit: "Stück", decimals: 0,
            value: mittel, tol: 2,
            steps: [nf(Math.round(q), 0) + " Stück ÷ 2 = " + nf(Math.round(mittel), 0) + " Stück"] },
          { ask: "Berechnen Sie die Summe aus Bestell- und Lagerhaltungskosten je Jahr.",
            unit: "Euro", decimals: 2, value: bestellk + lagerk, tol: 5,
            steps: ["Bestellkosten: " + nf(haeuf, 2) + " × " + eur(kf) + " = " + eur(bestellk, 2),
                    "Lagerkosten: " + nf(Math.round(mittel), 0) + " × " + eur(p) + " × " + pz(lhs, 0) + " = " + eur(lagerk, 2),
                    "Summe: " + eur(bestellk + lagerk, 2)] }
        ]
      };
    }
  },

  {
    id: "RB-12", cat: "loes", topic: "Beschaffung",
    name: "Dispositionsparameter festlegen",
    formulas: [
      "Sicherheitsbestand = Tagesverbrauch × Sicherheitszeit",
      "Meldebestand = (Tagesverbrauch × Wiederbeschaffungszeit) + Sicherheitsbestand",
      "Höchstbestand = Sicherheitsbestand + Bestellmenge",
      "Durchschnittlicher Lagerbestand = Sicherheitsbestand + Bestellmenge ÷ 2"
    ],
    make: function () {
      var jahr = ri(24, 90) * 1000, tage = 250;
      var tv = Math.round(jahr / tage / 10) * 10;
      var wbz = ri(3, 15), sz = ri(2, 8), q = ri(20, 90) * 100;
      var sb = tv * sz, mb = tv * wbz + sb, hb = sb + q, mittel = sb + q / 2;
      return {
        text: "In der Montage der Elbe Industriemontage GmbH kam es im letzten Quartal dreimal zu " +
          "Bandstillständen, weil Verbindungselemente nicht rechtzeitig verfügbar waren. Die " +
          "Materialwirtschaft steuerte den Artikel bisher nach Erfahrungswerten ohne festgelegte " +
          "Parameter. Künftig soll das Bestellpunktverfahren eingesetzt werden. Der Lieferant hat eine " +
          "verbindliche Wiederbeschaffungszeit zugesagt, für Schwankungen in Verbrauch und Lieferzeit " +
          "gibt die Betriebsleitung eine Sicherheitszeit vor. Die Bestellmenge wurde bereits festgelegt. " +
          "Das Werk arbeitet an 250 Arbeitstagen im Jahr bei gleichmäßigem Verbrauch.",
        given: [["Jahresbedarf", stk(jahr)], ["Arbeitstage je Jahr", nf(tage, 0)],
                ["Wiederbeschaffungszeit", wbz + " Arbeitstage"], ["Sicherheitszeit", sz + " Arbeitstage"],
                ["Festgelegte Bestellmenge", stk(q)]],
        parts: [
          { ask: "Ermitteln Sie den Tagesverbrauch (gerundet auf volle 10 Stück).", unit: "Stück", decimals: 0,
            value: tv, tol: 5,
            steps: [stk(jahr) + " ÷ " + nf(tage, 0) + " Tage = rund " + stk(tv) + " je Tag"] },
          { ask: "Berechnen Sie den Sicherheitsbestand.", unit: "Stück", decimals: 0, value: sb,
            steps: [stk(tv) + " × " + sz + " Tage = " + stk(sb)] },
          { ask: "Ermitteln Sie den Meldebestand.", unit: "Stück", decimals: 0, value: mb,
            steps: ["Verbrauch in der Wiederbeschaffungszeit: " + stk(tv) + " × " + wbz + " = " + stk(tv * wbz),
                    stk(tv * wbz) + " + " + stk(sb) + " = " + stk(mb)] },
          { ask: "Berechnen Sie den Höchstbestand.", unit: "Stück", decimals: 0, value: hb,
            steps: [stk(sb) + " + " + stk(q) + " = " + stk(hb)] },
          { ask: "Ermitteln Sie den durchschnittlichen Lagerbestand.", unit: "Stück", decimals: 0, value: mittel,
            steps: [stk(sb) + " + " + stk(q) + " ÷ 2 = " + stk(mittel)] }
        ]
      };
    }
  },

  {
    id: "RB-13", cat: "loes", topic: "Kosten und Kalkulation",
    name: "Zuschlagskalkulation eines Auftrags",
    formulas: [
      "Materialeinzelkosten + Materialgemeinkosten = Materialkosten",
      "Fertigungseinzelkosten + Fertigungsgemeinkosten = Fertigungskosten",
      "Materialkosten + Fertigungskosten = Herstellkosten",
      "Herstellkosten + Verwaltungsgemeinkosten + Vertriebsgemeinkosten = Selbstkosten"
    ],
    make: function () {
      var mek = ri(40, 180) * 100, fek = ri(30, 150) * 100;
      var mgk = pick([8, 10, 12, 15]), fgk = pick([80, 100, 120, 150]);
      var vw = pick([6, 8, 10]), vt = pick([4, 5, 7]);
      var mk = mek * (1 + mgk / 100), fk = fek * (1 + fgk / 100);
      var hk = mk + fk, sk = hk * (1 + (vw + vt) / 100);
      return {
        text: "Die Elbe Industriemontage GmbH hat eine Anfrage über die Fertigung einer Sonderbaugruppe " +
          "erhalten. Der Vertrieb benötigt kurzfristig eine belastbare Kalkulation, weil der Kunde " +
          "gleichzeitig bei einem Wettbewerber anfragt. Aus der Arbeitsvorbereitung liegen die " +
          "Materialeinzelkosten und die Fertigungseinzelkosten des Auftrags vor. Die Zuschlagssätze für " +
          "Material-, Fertigungs-, Verwaltungs- und Vertriebsgemeinkosten stammen aus dem aktuellen " +
          "Betriebsabrechnungsbogen. Verwaltungs- und Vertriebsgemeinkosten werden jeweils auf die " +
          "Herstellkosten bezogen. Sondereinzelkosten fallen nicht an.",
        given: [["Materialeinzelkosten", eur(mek)], ["Materialgemeinkostenzuschlag", pz(mgk, 0)],
                ["Fertigungseinzelkosten", eur(fek)], ["Fertigungsgemeinkostenzuschlag", pz(fgk, 0)],
                ["Verwaltungsgemeinkostenzuschlag", pz(vw, 0)], ["Vertriebsgemeinkostenzuschlag", pz(vt, 0)]],
        parts: [
          { ask: "Ermitteln Sie die Materialkosten.", unit: "Euro", decimals: 2, value: mk,
            steps: [eur(mek) + " + " + pz(mgk, 0) + " = " + eur(mk, 2)] },
          { ask: "Ermitteln Sie die Fertigungskosten.", unit: "Euro", decimals: 2, value: fk,
            steps: [eur(fek) + " + " + pz(fgk, 0) + " = " + eur(fk, 2)] },
          { ask: "Berechnen Sie die Herstellkosten.", unit: "Euro", decimals: 2, value: hk,
            steps: [eur(mk, 2) + " + " + eur(fk, 2) + " = " + eur(hk, 2)] },
          { ask: "Ermitteln Sie die Selbstkosten des Auftrags.", unit: "Euro", decimals: 2, value: sk,
            steps: ["Verwaltung: " + eur(hk, 2) + " × " + pz(vw, 0) + " = " + eur(hk * vw / 100, 2),
                    "Vertrieb: " + eur(hk, 2) + " × " + pz(vt, 0) + " = " + eur(hk * vt / 100, 2),
                    eur(hk, 2) + " + " + eur(hk * vw / 100, 2) + " + " + eur(hk * vt / 100, 2) + " = " + eur(sk, 2)] }
        ]
      };
    }
  },

  {
    id: "RB-14", cat: "loes", topic: "Kosten und Kalkulation",
    name: "Vorwärtskalkulation bis zum Listenverkaufspreis",
    formulas: [
      "Selbstkosten + Gewinnzuschlag = Barverkaufspreis",
      "Zielverkaufspreis = Barverkaufspreis ÷ (100 − Skontosatz) × 100",
      "Listenverkaufspreis = Zielverkaufspreis ÷ (100 − Rabattsatz) × 100"
    ],
    make: function () {
      var sk = ri(200, 900) * 10, gw = pick([8, 10, 12, 15, 20]);
      var skonto = pick([2, 3]), rabatt = pick([5, 10, 15, 20]);
      var bar = sk * (1 + gw / 100);
      var ziel = bar / (1 - skonto / 100);
      var liste = ziel / (1 - rabatt / 100);
      return {
        text: "Die Rheinlager Kontraktlogistik GmbH bietet erstmals das Konfektionieren von " +
          "Verkaufsdisplays als eigenständige Dienstleistung an. Die Selbstkosten je Display wurden in " +
          "der Kostenrechnung bereits ermittelt. Die Geschäftsführung gibt einen Gewinnzuschlag vor. " +
          "Gegenüber dem Handel sind marktübliche Konditionen zu gewähren: Der Kunde erhält bei Zahlung " +
          "innerhalb der Skontofrist einen Skontoabzug, außerdem ist ein Wiederverkäuferrabatt " +
          "einzuräumen. Beide Abzüge sind vom jeweils höheren Wert zu rechnen, sie sind also im Hundert " +
          "zu berücksichtigen. Sie ermitteln den Listenverkaufspreis für die Preisliste.",
        given: [["Selbstkosten je Display", eur(sk, 2)], ["Gewinnzuschlag", pz(gw, 0)],
                ["Kundenskonto", pz(skonto, 0)], ["Wiederverkäuferrabatt", pz(rabatt, 0)]],
        parts: [
          { ask: "Ermitteln Sie den Barverkaufspreis.", unit: "Euro", decimals: 2, value: bar,
            steps: [eur(sk, 2) + " + " + pz(gw, 0) + " = " + eur(bar, 2)] },
          { ask: "Berechnen Sie den Zielverkaufspreis.", unit: "Euro", decimals: 2, value: ziel,
            steps: ["Der Barverkaufspreis entspricht " + nf(100 - skonto, 0) + " % des Zielverkaufspreises",
                    eur(bar, 2) + " ÷ " + nf(100 - skonto, 0) + " × 100 = " + eur(ziel, 2)] },
          { ask: "Ermitteln Sie den Listenverkaufspreis.", unit: "Euro", decimals: 2, value: liste,
            steps: ["Der Zielverkaufspreis entspricht " + nf(100 - rabatt, 0) + " % des Listenverkaufspreises",
                    eur(ziel, 2) + " ÷ " + nf(100 - rabatt, 0) + " × 100 = " + eur(liste, 2)] }
        ]
      };
    }
  },

  {
    id: "RB-15", cat: "loes", topic: "Kosten und Kalkulation",
    name: "Maschinenstundensatz einer Anlage",
    formulas: [
      "Kalkulatorische Abschreibung = Wiederbeschaffungswert ÷ Nutzungsdauer",
      "Kalkulatorische Zinsen = (Wiederbeschaffungswert ÷ 2) × Zinssatz ÷ 100",
      "Maschinenstundensatz = Summe der maschinenabhängigen Kosten ÷ Maschinenlaufstunden je Jahr"
    ],
    make: function () {
      var wbw = ri(18, 60) * 10000, nd = pick([5, 8, 10]), zins = pick([5, 6, 7, 8]);
      var raum = ri(20, 80) * 100, energie = ri(40, 160) * 100, instand = ri(30, 120) * 100;
      var std = ri(12, 20) * 100;
      var afa = wbw / nd, kz = wbw / 2 * zins / 100;
      var summe = afa + kz + raum + energie + instand;
      return {
        text: "Die Süd-Distribution GmbH & Co. KG hat in ihrem Distributionszentrum eine automatische " +
          "Sortieranlage in Betrieb genommen. Um die Leistungen künftig verursachungsgerecht auf die " +
          "Auftraggeber umlegen zu können, soll ein Maschinenstundensatz gebildet werden. Die " +
          "Kostenrechnung setzt die kalkulatorische Abschreibung vom Wiederbeschaffungswert an und " +
          "verzinst das durchschnittlich gebundene Kapital, also die Hälfte des Wiederbeschaffungswerts. " +
          "Raumkosten, Energiekosten und Instandhaltungskosten der Anlage sind aus der " +
          "Kostenstellenrechnung bekannt. Die geplanten Laufstunden ergeben sich aus dem Schichtmodell.",
        given: [["Wiederbeschaffungswert", eur(wbw)], ["Nutzungsdauer", nd + " Jahre"],
                ["Kalkulatorischer Zinssatz", pz(zins, 0)], ["Raumkosten je Jahr", eur(raum)],
                ["Energiekosten je Jahr", eur(energie)], ["Instandhaltung je Jahr", eur(instand)],
                ["Maschinenlaufstunden je Jahr", nf(std, 0)]],
        parts: [
          { ask: "Ermitteln Sie die kalkulatorische Abschreibung je Jahr.", unit: "Euro", decimals: 2, value: afa,
            steps: [eur(wbw) + " ÷ " + nd + " Jahre = " + eur(afa, 2)] },
          { ask: "Berechnen Sie die kalkulatorischen Zinsen je Jahr.", unit: "Euro", decimals: 2, value: kz,
            steps: ["Durchschnittlich gebundenes Kapital: " + eur(wbw) + " ÷ 2 = " + eur(wbw / 2),
                    eur(wbw / 2) + " × " + pz(zins, 0) + " = " + eur(kz, 2)] },
          { ask: "Ermitteln Sie die maschinenabhängigen Kosten je Jahr insgesamt.",
            unit: "Euro", decimals: 2, value: summe,
            steps: [eur(afa, 2) + " + " + eur(kz, 2) + " + " + eur(raum) + " + " + eur(energie) +
                    " + " + eur(instand) + " = " + eur(summe, 2)] },
          { ask: "Berechnen Sie den Maschinenstundensatz.", unit: "Euro je Stunde", decimals: 2,
            value: summe / std,
            steps: [eur(summe, 2) + " ÷ " + nf(std, 0) + " Stunden = " + eur(summe / std, 2) + " je Stunde"] }
        ]
      };
    }
  },

  {
    id: "RB-16", cat: "loes", topic: "Investition",
    name: "Kostenvergleich und kritische Menge",
    formulas: [
      "Gesamtkosten je Verfahren = Fixkosten + variable Stückkosten × Menge",
      "Kritische Menge = (Fixkosten 1 − Fixkosten 2) ÷ (variable Stückkosten 2 − variable Stückkosten 1)",
      "Stückkosten = Gesamtkosten ÷ Menge"
    ],
    make: function () {
      var kf2 = ri(20, 60) * 1000, kf1 = kf2 + ri(20, 80) * 1000;
      var kv1 = ri(20, 80) / 10, kv2 = kv1 + ri(5, 40) / 10;
      var krit = (kf1 - kf2) / (kv2 - kv1);
      var menge = Math.round(krit * ri(120, 180) / 100 / 100) * 100;
      var g1 = kf1 + kv1 * menge, g2 = kf2 + kv2 * menge;
      return {
        text: "Die Süd-Distribution GmbH & Co. KG muss entscheiden, wie die Kommissionierung im neuen " +
          "Distributionszentrum ausgeführt wird. Verfahren 1 ist eine weitgehend automatisierte Lösung " +
          "mit hoher Investition und dadurch hohen Fixkosten, aber niedrigen Kosten je Kommissionierung. " +
          "Verfahren 2 arbeitet überwiegend manuell, verursacht geringe Fixkosten, dafür aber höhere " +
          "Kosten je Kommissionierung. Die Geschäftsführung will wissen, ab welcher Jahresmenge sich die " +
          "Automatisierung rechnet und wie die Kosten bei der derzeit geplanten Menge ausfallen. " +
          "Qualitäts- und Flexibilitätsunterschiede bleiben in dieser Rechnung außer Betracht.",
        given: [["Verfahren 1: Fixkosten je Jahr", eur(kf1)], ["Verfahren 1: variable Kosten je Kommissionierung", eur(kv1, 2)],
                ["Verfahren 2: Fixkosten je Jahr", eur(kf2)], ["Verfahren 2: variable Kosten je Kommissionierung", eur(kv2, 2)],
                ["Geplante Jahresmenge", nf(menge, 0) + " Kommissionierungen"]],
        parts: [
          { ask: "Ermitteln Sie die kritische Menge.", unit: "Kommissionierungen", decimals: 0, value: krit, tol: 2,
            steps: ["(" + eur(kf1) + " − " + eur(kf2) + ") ÷ (" + eur(kv2, 2) + " − " + eur(kv1, 2) + ")",
                    "= " + eur(kf1 - kf2) + " ÷ " + eur(kv2 - kv1, 2) + " = " + nf(Math.round(krit), 0)] },
          { ask: "Berechnen Sie die Gesamtkosten des Verfahrens 1 bei der geplanten Jahresmenge.",
            unit: "Euro", decimals: 2, value: g1,
            steps: [eur(kf1) + " + " + eur(kv1, 2) + " × " + nf(menge, 0) + " = " + eur(g1, 2)] },
          { ask: "Berechnen Sie die Gesamtkosten des Verfahrens 2 bei der geplanten Jahresmenge.",
            unit: "Euro", decimals: 2, value: g2,
            steps: [eur(kf2) + " + " + eur(kv2, 2) + " × " + nf(menge, 0) + " = " + eur(g2, 2)] },
          { ask: "Ermitteln Sie die Stückkosten des günstigeren Verfahrens bei dieser Menge.",
            unit: "Euro je Kommissionierung", decimals: 4, value: Math.min(g1, g2) / menge,
            steps: ["Günstiger ist Verfahren " + (g1 < g2 ? "1" : "2") + " mit " + eur(Math.min(g1, g2), 2),
                    eur(Math.min(g1, g2), 2) + " ÷ " + nf(menge, 0) + " = " + eur(Math.min(g1, g2) / menge, 4)] }
        ]
      };
    }
  },

  {
    id: "RB-17", cat: "loes", topic: "Investition",
    name: "Kapitalwert einer Investition",
    formulas: [
      "Barwert eines Rückflusses = Rückfluss ÷ (1 + Kalkulationszinssatz) hoch Jahr",
      "Kapitalwert = Summe der Barwerte − Anschaffungsauszahlung",
      "Eine Investition ist vorteilhaft, wenn der Kapitalwert größer oder gleich null ist"
    ],
    make: function () {
      var i = pick([5, 6, 8, 10]) / 100;
      var r1 = ri(30, 90) * 1000, r2 = ri(30, 90) * 1000, r3 = ri(30, 90) * 1000;
      var b1 = r1 / (1 + i), b2 = r2 / Math.pow(1 + i, 2), b3 = r3 / Math.pow(1 + i, 3);
      var a0 = Math.round((b1 + b2 + b3) * ri(80, 115) / 100 / 1000) * 1000;
      return {
        text: "Die Nordfracht Logistik GmbH prüft die Anschaffung eines fahrerlosen Transportsystems für " +
          "den innerbetrieblichen Materialfluss. Die Anlage soll drei Jahre genutzt und danach ohne " +
          "Restwert ersetzt werden. Aus der Wirtschaftlichkeitsbetrachtung liegen die jährlichen " +
          "Rückflüsse aus eingesparten Personal- und Instandhaltungskosten vor; sie fallen jeweils am " +
          "Jahresende an. Die Geschäftsführung verlangt eine dynamische Beurteilung, weil die Rückflüsse " +
          "über die Jahre unterschiedlich hoch sind. Der Kalkulationszinssatz entspricht der geforderten " +
          "Mindestverzinsung des eingesetzten Kapitals.",
        given: [["Anschaffungsauszahlung", eur(a0)], ["Rückfluss Jahr 1", eur(r1)],
                ["Rückfluss Jahr 2", eur(r2)], ["Rückfluss Jahr 3", eur(r3)],
                ["Kalkulationszinssatz", pz(i * 100, 0)]],
        parts: [
          { ask: "Ermitteln Sie den Barwert des Rückflusses aus Jahr 1.", unit: "Euro", decimals: 2, value: b1,
            steps: [eur(r1) + " ÷ " + nf(1 + i, 2) + " = " + eur(b1, 2)] },
          { ask: "Ermitteln Sie den Barwert des Rückflusses aus Jahr 3.", unit: "Euro", decimals: 2, value: b3,
            steps: [eur(r3) + " ÷ " + nf(1 + i, 2) + " hoch 3 = " + eur(r3, 0) + " ÷ " +
                    nf(Math.pow(1 + i, 3), 4) + " = " + eur(b3, 2)] },
          { ask: "Berechnen Sie die Summe aller drei Barwerte.", unit: "Euro", decimals: 2,
            value: b1 + b2 + b3,
            steps: [eur(b1, 2) + " + " + eur(b2, 2) + " + " + eur(b3, 2) + " = " + eur(b1 + b2 + b3, 2)] },
          { ask: "Ermitteln Sie den Kapitalwert der Investition.", unit: "Euro", decimals: 2,
            value: Math.abs(b1 + b2 + b3 - a0),
            steps: [eur(b1 + b2 + b3, 2) + " − " + eur(a0) + " = " +
                    eur(b1 + b2 + b3 - a0, 2) + " (Betrag angeben)",
                    (b1 + b2 + b3 - a0 >= 0 ? "Kapitalwert positiv, die Investition ist vorteilhaft"
                                            : "Kapitalwert negativ, die Investition ist nicht vorteilhaft")] }
        ]
      };
    }
  },

  {
    id: "RB-18", cat: "loes", topic: "Investition",
    name: "Make-or-Buy in der Lagerhaltung",
    formulas: [
      "Kosten Eigenlager = Fixkosten + variable Kosten je Palette × Menge",
      "Kosten Fremdlager = Preis je Palette und Monat × Menge",
      "Kritische Menge = Fixkosten ÷ (Preis Fremdlager − variable Kosten Eigenlager)"
    ],
    make: function () {
      var kf = ri(15, 60) * 1000, kv = ri(30, 90) / 10;
      var preis = kv + ri(15, 60) / 10;
      var krit = kf / (preis - kv);
      var menge = Math.round(krit * ri(70, 140) / 100 / 100) * 100;
      var eigen = kf + kv * menge, fremd = preis * menge;
      return {
        text: "Die Hansa Teile-Service GmbH stößt mit ihrem Lager an die Kapazitätsgrenze. Zur Auswahl " +
          "stehen der Ausbau des eigenen Lagers und die Auslagerung an einen Kontraktlogistiker. Beim " +
          "Eigenausbau entstehen unabhängig von der Auslastung jährliche Fixkosten für Miete, " +
          "Abschreibung und Grundbesetzung, hinzu kommen variable Kosten je eingelagerter Palette. Der " +
          "Kontraktlogistiker rechnet ausschließlich mengenabhängig je Palette ab, sodass dort keine " +
          "Fixkosten anfallen. Die Geschäftsführung möchte wissen, ab welcher Menge das eigene Lager " +
          "günstiger ist, und wie die beiden Lösungen bei der erwarteten Menge abschneiden.",
        given: [["Eigenlager: Fixkosten je Jahr", eur(kf)],
                ["Eigenlager: variable Kosten je Palette", eur(kv, 2)],
                ["Fremdlager: Preis je Palette", eur(preis, 2)],
                ["Erwartete Jahresmenge", nf(menge, 0) + " Paletten"]],
        parts: [
          { ask: "Ermitteln Sie die kritische Menge.", unit: "Paletten", decimals: 0, value: krit, tol: 2,
            steps: [eur(kf) + " ÷ (" + eur(preis, 2) + " − " + eur(kv, 2) + ")",
                    "= " + eur(kf) + " ÷ " + eur(preis - kv, 2) + " = " + nf(Math.round(krit), 0) + " Paletten"] },
          { ask: "Berechnen Sie die Kosten des Eigenlagers bei der erwarteten Menge.",
            unit: "Euro", decimals: 2, value: eigen,
            steps: [eur(kf) + " + " + eur(kv, 2) + " × " + nf(menge, 0) + " = " + eur(eigen, 2)] },
          { ask: "Berechnen Sie die Kosten des Fremdlagers bei der erwarteten Menge.",
            unit: "Euro", decimals: 2, value: fremd,
            steps: [eur(preis, 2) + " × " + nf(menge, 0) + " = " + eur(fremd, 2)] },
          { ask: "Ermitteln Sie den Kostenvorteil der günstigeren Lösung als Betrag.",
            unit: "Euro", decimals: 2, value: Math.abs(eigen - fremd),
            steps: ["Günstiger ist das " + (eigen < fremd ? "Eigenlager" : "Fremdlager"),
                    eur(Math.max(eigen, fremd), 2) + " − " + eur(Math.min(eigen, fremd), 2) + " = " +
                    eur(Math.abs(eigen - fremd), 2)] }
        ]
      };
    }
  },
  {
    id: "RB-19", cat: "loes", topic: "Produktionslogistik",
    name: "Auslegung einer Montagelinie",
    formulas: [
      "Taktzeit = verfügbare Arbeitszeit ÷ Kundenbedarf im gleichen Zeitraum",
      "Mindestanzahl Stationen = Summe der Arbeitsinhalte ÷ Taktzeit, aufgerundet",
      "Kapazität je Schicht = verfügbare Arbeitszeit ÷ Taktzeit"
    ],
    make: function () {
      var brutto = pick([480, 510, 540]), pause = pick([30, 45, 60]);
      var zeit = brutto - pause, bedarf = ri(60, 300, 10);
      var inhalt = ri(80, 400) / 10;
      var takt = zeit / bedarf;
      return {
        text: "Die Elbe Industriemontage GmbH richtet für eine neue Baugruppe eine Montagelinie ein. Der " +
          "Kunde ruft die Baugruppe in gleichmäßigen Tagesmengen ab, die Linie soll deshalb genau im " +
          "Kundentakt arbeiten. Aus der Arbeitsvorbereitung liegt der gesamte Arbeitsinhalt je Baugruppe " +
          "vor, also die Summe aller Arbeitsschritte in Minuten. Die Schicht dauert brutto die " +
          "angegebene Zeit, davon sind die gesetzlichen und tariflichen Pausen abzuziehen; geplante " +
          "Rüstzeiten fallen nicht an. Sie legen Takt, Stationszahl und Kapazität fest.",
        given: [["Schichtdauer brutto", brutto + " Minuten"], ["Pausen je Schicht", pause + " Minuten"],
                ["Kundenbedarf je Schicht", stk(bedarf)],
                ["Arbeitsinhalt je Baugruppe", nf(inhalt, 1) + " Minuten"]],
        parts: [
          { ask: "Ermitteln Sie die verfügbare Arbeitszeit je Schicht.", unit: "Minuten", decimals: 0, value: zeit,
            steps: [brutto + " − " + pause + " = " + zeit + " Minuten"] },
          { ask: "Berechnen Sie die Kundentaktzeit.", unit: "Minuten je Stück", decimals: 2, value: takt,
            steps: [zeit + " Minuten ÷ " + stk(bedarf) + " = " + nf(takt, 2) + " Minuten je Stück"] },
          { ask: "Ermitteln Sie die Mindestanzahl der Stationen (aufgerundet).", unit: "Stationen", decimals: 0,
            value: Math.ceil(inhalt / takt),
            steps: [nf(inhalt, 1) + " ÷ " + nf(takt, 2) + " = " + nf(inhalt / takt, 2),
                    "aufgerundet: " + Math.ceil(inhalt / takt) + " Stationen"] },
          { ask: "Berechnen Sie die Kapazität der Linie je Schicht.", unit: "Stück", decimals: 0, value: bedarf,
            steps: [zeit + " Minuten ÷ " + nf(takt, 2) + " Minuten je Stück = " + stk(bedarf)] }
        ]
      };
    }
  },

  {
    id: "RB-20", cat: "loes", topic: "Produktionslogistik",
    name: "Optimale Losgröße in der Fertigung",
    formulas: [
      "Optimale Losgröße = Wurzel aus (200 × Jahresbedarf × Rüstkosten je Los) ÷ (Herstellkosten je Stück × Lagerkostensatz in %)",
      "Anzahl Lose je Jahr = Jahresbedarf ÷ Losgröße",
      "Rüstkosten je Jahr = Anzahl Lose × Rüstkosten je Los"
    ],
    make: function () {
      var m = ri(20, 120) * 1000, ruest = pick([200, 250, 300, 400, 500]);
      var hk = pick([5, 8, 10, 15, 20]), lks = pick([10, 12, 15, 20, 25]);
      var q = Math.sqrt(200 * m * ruest / (hk * lks));
      var lose = m / q;
      return {
        text: "In der Fertigung der Elbe Industriemontage GmbH werden auf einer Presse mehrere Varianten " +
          "eines Blechteils hergestellt. Jeder Wechsel zwischen den Varianten erfordert einen " +
          "aufwendigen Werkzeugwechsel und verursacht Rüstkosten. Bisher wurde in großen Losen gefertigt, " +
          "um selten rüsten zu müssen; dadurch sind die Bestände an Halbfertigerzeugnissen stark " +
          "gestiegen. Die Fertigungssteuerung soll die Losgröße neu bestimmen und dabei Rüst- und " +
          "Lagerkosten gegeneinander abwägen. Der Jahresbedarf verteilt sich gleichmäßig, die Fertigung " +
          "erfolgt jeweils vollständig in einem Zug.",
        given: [["Jahresbedarf", stk(m)], ["Rüstkosten je Los", eur(ruest)],
                ["Herstellkosten je Stück", eur(hk)], ["Lagerkostensatz", pz(lks, 0)]],
        parts: [
          { ask: "Ermitteln Sie die optimale Losgröße.", unit: "Stück", decimals: 0, value: q, tol: 3,
            steps: ["Zähler: 200 × " + nf(m, 0) + " × " + nf(ruest, 0) + " = " + nf(200 * m * ruest, 0),
                    "Nenner: " + nf(hk, 0) + " × " + nf(lks, 0) + " = " + nf(hk * lks, 0),
                    "Wurzel aus " + nf(200 * m * ruest / (hk * lks), 0) + " = rund " + nf(Math.round(q), 0)] },
          { ask: "Berechnen Sie die Anzahl der Lose je Jahr.", unit: "Lose", decimals: 2, value: lose, tol: 0.05,
            steps: [stk(m) + " ÷ " + nf(Math.round(q), 0) + " Stück = " + nf(lose, 2) + " Lose"] },
          { ask: "Ermitteln Sie die Rüstkosten je Jahr.", unit: "Euro", decimals: 2, value: lose * ruest, tol: 10,
            steps: [nf(lose, 2) + " Lose × " + eur(ruest) + " = " + eur(lose * ruest, 2)] }
        ]
      };
    }
  },

  {
    id: "RB-21", cat: "loes", topic: "Produktionslogistik",
    name: "Auslegung eines Kanban-Regelkreises",
    formulas: [
      "Anzahl Kanban-Karten = (Tagesverbrauch × Wiederbeschaffungszeit × (1 + Sicherheitsfaktor)) ÷ Behälterinhalt, aufgerundet",
      "Bestand im Regelkreis = Anzahl Karten × Behälterinhalt",
      "Reichweite des Regelkreises = Bestand im Regelkreis ÷ Tagesverbrauch"
    ],
    make: function () {
      var tv = ri(30, 200) * 10, wbz = ri(1, 6), sf = pick([10, 15, 20, 25]) / 100;
      var inhalt = pick([50, 100, 200, 250]);
      var karten = Math.ceil(tv * wbz * (1 + sf) / inhalt);
      var bestand = karten * inhalt;
      return {
        text: "Die Elbe Industriemontage GmbH stellt die Versorgung der Endmontage mit Normteilen auf " +
          "Kanban um. Bisher wurden die Teile zentral disponiert, was zu Beständen an der Linie und " +
          "gleichzeitig zu Fehlteilen führte. Künftig soll der Verbrauch selbst den Nachschub auslösen. " +
          "Der Verbrauch an der Linie ist über die Woche stabil. Die Wiederbeschaffungszeit umfasst " +
          "Rückgabe der Karte, Bereitstellung im Supermarkt und Transport an die Linie. Für Schwankungen " +
          "gibt die Fertigungssteuerung einen Sicherheitsfaktor vor. Der Behälterinhalt ist durch das " +
          "eingesetzte Ladehilfsmittel vorgegeben.",
        given: [["Tagesverbrauch an der Linie", stk(tv)], ["Wiederbeschaffungszeit", wbz + " Tage"],
                ["Sicherheitsfaktor", pz(sf * 100, 0)], ["Behälterinhalt", stk(inhalt)]],
        parts: [
          { ask: "Ermitteln Sie die Anzahl der Kanban-Karten (aufgerundet).", unit: "Karten", decimals: 0,
            value: karten,
            steps: [stk(tv) + " × " + wbz + " Tage × " + nf(1 + sf, 2) + " = " + nf(tv * wbz * (1 + sf), 0) + " Stück",
                    nf(tv * wbz * (1 + sf), 0) + " ÷ " + stk(inhalt) + " = " + nf(tv * wbz * (1 + sf) / inhalt, 2),
                    "aufgerundet: " + karten + " Karten"] },
          { ask: "Berechnen Sie den Bestand im Regelkreis.", unit: "Stück", decimals: 0, value: bestand,
            steps: [karten + " Karten × " + stk(inhalt) + " = " + stk(bestand)] },
          { ask: "Ermitteln Sie die Reichweite des Regelkreises.", unit: "Tage", decimals: 2,
            value: bestand / tv,
            steps: [stk(bestand) + " ÷ " + stk(tv) + " je Tag = " + nf(bestand / tv, 2) + " Tage"] }
        ]
      };
    }
  },

  {
    id: "RB-22", cat: "loes", topic: "Produktionslogistik",
    name: "Bedarfsermittlung über die Stückliste",
    formulas: [
      "Sekundärbedarf = Primärbedarf × Mengenkoeffizient der Stückliste",
      "Bruttobedarf = Sekundärbedarf ÷ (100 − Ausschussquote) × 100",
      "Nettobedarf = Bruttobedarf − verfügbarer Bestand",
      "Bestellmenge = Nettobedarf aufgerundet auf volle Verpackungseinheiten"
    ],
    make: function () {
      var primaer = ri(8, 40) * 100, koeff = pick([2, 3, 4, 6, 8]);
      var aus = pick([2, 3, 5]), lb = ri(10, 60) * 100, res = ri(0, 20) * 100, sb = ri(2, 15) * 100;
      var sek = primaer * koeff;
      var brutto = sek / (1 - aus / 100);
      var verf = lb - res - sb;
      var netto = Math.max(0, brutto - verf);
      var ve = pick([100, 250, 500]);
      return {
        text: "Für die kommende Fertigungsperiode der Elbe Industriemontage GmbH steht das " +
          "Produktionsprogramm fest. Aus der Stückliste ist bekannt, wie oft ein Normteil je Erzeugnis " +
          "benötigt wird. Erfahrungsgemäß ist ein Teil des Materials wegen Beschädigungen und " +
          "Einrichtverlusten nicht verwendbar, weshalb ein Ausschlagsatz einzurechnen ist. Aus dem " +
          "Dispositionssystem sind Lagerbestand, bereits reservierte Mengen und der Sicherheitsbestand " +
          "ersichtlich; offene Bestellungen bestehen nicht. Der Lieferant liefert ausschließlich in " +
          "vollen Verpackungseinheiten.",
        given: [["Primärbedarf Erzeugnisse", stk(primaer)], ["Mengenkoeffizient je Erzeugnis", koeff + " Stück"],
                ["Ausschussquote", pz(aus, 0)], ["Lagerbestand", stk(lb)],
                ["Reservierungen", stk(res)], ["Sicherheitsbestand", stk(sb)],
                ["Verpackungseinheit", stk(ve)]],
        parts: [
          { ask: "Ermitteln Sie den Sekundärbedarf.", unit: "Stück", decimals: 0, value: sek,
            steps: [stk(primaer) + " × " + koeff + " = " + stk(sek)] },
          { ask: "Berechnen Sie den Bruttobedarf unter Berücksichtigung des Ausschusses.",
            unit: "Stück", decimals: 0, value: brutto, tol: 1,
            steps: [stk(sek) + " ÷ " + nf(100 - aus, 0) + " × 100 = " + nf(brutto, 0) + " Stück"] },
          { ask: "Ermitteln Sie den verfügbaren Bestand.", unit: "Stück", decimals: 0, value: Math.abs(verf),
            steps: [stk(lb) + " − " + stk(res) + " − " + stk(sb) + " = " + stk(verf)] },
          { ask: "Berechnen Sie den Nettobedarf.", unit: "Stück", decimals: 0, value: netto, tol: 1,
            steps: [nf(brutto, 0) + " − " + stk(verf) + " = " + nf(netto, 0) + " Stück"] },
          { ask: "Ermitteln Sie die Bestellmenge in vollen Verpackungseinheiten.", unit: "Stück", decimals: 0,
            value: Math.ceil(netto / ve) * ve,
            steps: [nf(netto, 0) + " ÷ " + stk(ve) + " = " + nf(netto / ve, 2) + " Einheiten",
                    "aufgerundet " + Math.ceil(netto / ve) + " Einheiten × " + stk(ve) + " = " +
                    stk(Math.ceil(netto / ve) * ve)] }
        ]
      };
    }
  },

  {
    id: "RB-23", cat: "loes", topic: "Lager und Kommissionierung",
    name: "Dimensionierung eines Palettenlagers",
    formulas: [
      "Palettenanzahl = Bestand ÷ Stück je Palette, aufgerundet",
      "Stellplatzbedarf = Palettenanzahl × (1 + Reservefaktor), aufgerundet",
      "Anzahl Regalfelder = Stellplätze ÷ (Ebenen × Stellplätze je Ebene und Feld), aufgerundet",
      "Grundfläche = Anzahl Regalfelder × Feldbreite × Regaltiefe"
    ],
    make: function () {
      var bestand = ri(60, 400) * 1000, jePal = pick([200, 250, 400, 500]);
      var reserve = pick([10, 15, 20]) / 100, ebenen = pick([3, 4, 5]);
      var jeFeld = 3, breite = 2.7, tiefe = 1.1;
      var pal = Math.ceil(bestand / jePal);
      var stell = Math.ceil(pal * (1 + reserve));
      var felder = Math.ceil(stell / (ebenen * jeFeld));
      return {
        text: "Die Süd-Distribution GmbH & Co. KG plant ein zusätzliches Palettenregallager, weil die " +
          "vorhandene Fläche nicht mehr ausreicht. Der zu lagernde Bestand einer Warengruppe ist aus der " +
          "Bestandsplanung bekannt, ebenso die Anzahl Stück je Palette. Für saisonale Spitzen und für " +
          "die Einlagerfähigkeit soll ein Reservefaktor auf den reinen Bedarf aufgeschlagen werden, " +
          "damit das Lager nicht dauerhaft an der Grenze arbeitet. Das gewählte Regalsystem nimmt je " +
          "Feld und Ebene drei Europaletten auf. Feldbreite und Regaltiefe sind durch das System " +
          "vorgegeben; Verkehrs- und Funktionsflächen bleiben in dieser Rechnung außer Betracht.",
        given: [["Zu lagernder Bestand", stk(bestand)], ["Stück je Palette", stk(jePal)],
                ["Reservefaktor", pz(reserve * 100, 0)], ["Ebenen je Regalfeld", nf(ebenen, 0)],
                ["Stellplätze je Ebene und Feld", nf(jeFeld, 0)],
                ["Feldbreite", nf(breite, 2) + " m"], ["Regaltiefe", nf(tiefe, 2) + " m"]],
        parts: [
          { ask: "Ermitteln Sie die benötigte Palettenanzahl.", unit: "Paletten", decimals: 0, value: pal,
            steps: [stk(bestand) + " ÷ " + stk(jePal) + " = " + nf(bestand / jePal, 2),
                    "aufgerundet: " + nf(pal, 0) + " Paletten"] },
          { ask: "Berechnen Sie den Stellplatzbedarf einschließlich Reserve.", unit: "Stellplätze", decimals: 0,
            value: stell,
            steps: [nf(pal, 0) + " × " + nf(1 + reserve, 2) + " = " + nf(pal * (1 + reserve), 2),
                    "aufgerundet: " + nf(stell, 0) + " Stellplätze"] },
          { ask: "Ermitteln Sie die Anzahl der benötigten Regalfelder.", unit: "Regalfelder", decimals: 0,
            value: felder,
            steps: ["Stellplätze je Feld: " + ebenen + " × " + jeFeld + " = " + (ebenen * jeFeld),
                    nf(stell, 0) + " ÷ " + (ebenen * jeFeld) + " = " + nf(stell / (ebenen * jeFeld), 2),
                    "aufgerundet: " + nf(felder, 0) + " Felder"] },
          { ask: "Berechnen Sie die reine Regalgrundfläche.", unit: "m²", decimals: 2,
            value: felder * breite * tiefe,
            steps: [nf(felder, 0) + " × " + nf(breite, 2) + " m × " + nf(tiefe, 2) + " m = " +
                    nf(felder * breite * tiefe, 2) + " m²"] }
        ]
      };
    }
  },

  {
    id: "RB-24", cat: "loes", topic: "Transport und Distribution",
    name: "Fahrzeugdisposition nach Lademetern",
    formulas: [
      "Lademeter = Anzahl Europaletten × 0,4 (drei Paletten nebeneinander auf 1,2 m Tiefe)",
      "Anzahl Fahrzeuge = benötigte Lademeter ÷ Lademeter je Fahrzeug, aufgerundet",
      "Auslastungsgrad = benötigte Lademeter ÷ (Anzahl Fahrzeuge × Lademeter je Fahrzeug) × 100"
    ],
    make: function () {
      var pal = ri(40, 400), ldmFzg = pick([13.6, 15.0, 7.2]);
      var ldm = pal * 0.4;
      var fzg = Math.ceil(ldm / ldmFzg);
      return {
        text: "Die Alpin Transport GmbH übernimmt für einen Möbelhersteller die Auslieferung an den " +
          "Fachhandel. Die Ware steht auf Europaletten bereit und ist nicht stapelbar, sodass die " +
          "Auslastung allein über die Ladefläche und nicht über das Gewicht bestimmt wird. Die Paletten " +
          "werden mit der schmalen Seite quer verladen, sodass drei Paletten nebeneinander stehen und je " +
          "Palette 0,4 Lademeter zu rechnen sind. Für die Disposition steht ein einheitlicher " +
          "Fahrzeugtyp zur Verfügung. Angefangene Fahrzeuge müssen voll bezahlt werden, weshalb die " +
          "Auslastung für die Nachkalkulation von Bedeutung ist.",
        given: [["Zu befördernde Europaletten", nf(pal, 0)], ["Lademeter je Palette", nf(0.4, 1) + " m"],
                ["Verfügbare Lademeter je Fahrzeug", nf(ldmFzg, 1) + " m"]],
        parts: [
          { ask: "Ermitteln Sie die benötigten Lademeter.", unit: "Lademeter", decimals: 1, value: ldm,
            steps: [nf(pal, 0) + " Paletten × 0,4 m = " + nf(ldm, 1) + " Lademeter"] },
          { ask: "Berechnen Sie die Anzahl der benötigten Fahrzeuge.", unit: "Fahrzeuge", decimals: 0, value: fzg,
            steps: [nf(ldm, 1) + " ÷ " + nf(ldmFzg, 1) + " = " + nf(ldm / ldmFzg, 2),
                    "aufgerundet: " + fzg + " Fahrzeuge"] },
          { ask: "Ermitteln Sie den Auslastungsgrad der eingesetzten Fahrzeuge.", unit: "%", decimals: 2,
            value: ldm / (fzg * ldmFzg) * 100,
            steps: ["Bereitgestellt: " + fzg + " × " + nf(ldmFzg, 1) + " = " + nf(fzg * ldmFzg, 1) + " Lademeter",
                    nf(ldm, 1) + " ÷ " + nf(fzg * ldmFzg, 1) + " × 100 = " + pz(ldm / (fzg * ldmFzg) * 100, 2)] }
        ]
      };
    }
  },

  {
    id: "RB-25", cat: "loes", topic: "Transport und Distribution",
    name: "Kalkulation einer Luftfrachtsendung",
    formulas: [
      "Volumengewicht = Länge × Breite × Höhe in cm ÷ 6.000",
      "Frachtpflichtiges Gewicht = höherer Wert aus Realgewicht und Volumengewicht",
      "Luftfracht = frachtpflichtiges Gewicht × Frachtrate je Kilogramm",
      "Gesamtkosten = Luftfracht + Nebengebühren"
    ],
    make: function () {
      var l = ri(60, 130, 10), b = ri(60, 110, 10), h = ri(50, 110, 10), colli = ri(1, 4);
      var vol = colli * l * b * h / 6000;
      var real = ri(40, 200, 10) * colli;
      var rate = ri(28, 62) / 10, geb = ri(60, 260);
      var pflicht = Math.max(vol, real);
      return {
        text: "Wegen eines Produktionsstillstands beim Kunden in Singapur muss die Hansa Teile-Service " +
          "GmbH Ersatzteile per Luftfracht versenden. Die Sendung besteht aus mehreren gleich großen " +
          "Packstücken. Die Airline rechnet nach dem frachtpflichtigen Gewicht ab und setzt für die " +
          "Umrechnung des Volumens 6.000 Kubikzentimeter je Kilogramm an. Neben der eigentlichen " +
          "Luftfracht fallen Nebengebühren für Abfertigung, Sicherheitskontrolle und Dokumente an. Der " +
          "Kunde hat um eine verbindliche Kostenangabe gebeten, bevor der Transport beauftragt wird.",
        given: [["Anzahl Packstücke", nf(colli, 0)], ["Maße je Packstück", l + " × " + b + " × " + h + " cm"],
                ["Gesamtes Realgewicht", nf(real, 0) + " kg"],
                ["Frachtrate", eur(rate, 2) + " je kg"], ["Nebengebühren", eur(geb)]],
        parts: [
          { ask: "Ermitteln Sie das Volumengewicht der Sendung.", unit: "Kilogramm", decimals: 2, value: vol,
            steps: ["Volumen je Packstück: " + l + " × " + b + " × " + h + " = " + nf(l * b * h, 0) + " cm³",
                    "Gesamt: " + nf(colli, 0) + " × " + nf(l * b * h, 0) + " = " + nf(colli * l * b * h, 0) + " cm³",
                    nf(colli * l * b * h, 0) + " ÷ 6.000 = " + nf(vol, 2) + " kg"] },
          { ask: "Bestimmen Sie das frachtpflichtige Gewicht.", unit: "Kilogramm", decimals: 2, value: pflicht,
            steps: ["Realgewicht " + nf(real, 0) + " kg gegenüber Volumengewicht " + nf(vol, 2) + " kg",
                    "Maßgeblich ist der höhere Wert: " + nf(pflicht, 2) + " kg"] },
          { ask: "Berechnen Sie die reine Luftfracht.", unit: "Euro", decimals: 2, value: pflicht * rate,
            steps: [nf(pflicht, 2) + " kg × " + eur(rate, 2) + " = " + eur(pflicht * rate, 2)] },
          { ask: "Ermitteln Sie die Gesamtkosten der Sendung.", unit: "Euro", decimals: 2,
            value: pflicht * rate + geb,
            steps: [eur(pflicht * rate, 2) + " + " + eur(geb) + " = " + eur(pflicht * rate + geb, 2)] }
        ]
      };
    }
  },

  {
    id: "RB-26", cat: "loes", topic: "Außenhandel und Zoll",
    name: "Einfuhrabgaben einer Drittlandsendung",
    formulas: [
      "Zollwert = Warenwert + Beförderungs- und Versicherungskosten bis zur EU-Außengrenze",
      "Zoll = Zollwert × Zollsatz ÷ 100",
      "Bemessungsgrundlage der Einfuhrumsatzsteuer = Zollwert + Zoll + Beförderungskosten bis zum Bestimmungsort",
      "Einfuhrumsatzsteuer = Bemessungsgrundlage × 19 ÷ 100"
    ],
    make: function () {
      var ware = ri(20, 90) * 1000, fracht = ri(15, 60) * 100, vers = ri(2, 15) * 100;
      var zollsatz = pick([2.7, 4, 5.5, 6.5]), inland = ri(4, 20) * 100;
      var zw = ware + fracht + vers;
      var zoll = zw * zollsatz / 100;
      var bmg = zw + zoll + inland;
      var eust = bmg * 0.19;
      return {
        text: "Die Weser Elektro-Großhandel KG importiert erstmals Installationsmaterial aus einem " +
          "Drittland. Die Ware wird per Seefracht bis Hamburg befördert und von dort per Lkw zum " +
          "Zentrallager in Bremen weitertransportiert. Die Kosten für den Seetransport und die " +
          "Transportversicherung bis zur EU-Außengrenze sind in der Rechnung des Spediteurs gesondert " +
          "ausgewiesen, ebenso die Kosten des Nachlaufs im Inland. Für die Warenart gilt der genannte " +
          "Drittlandszollsatz, eine Präferenz kann nicht in Anspruch genommen werden. Die " +
          "Einfuhrumsatzsteuer beträgt 19 Prozent. Sie ermitteln die Einfuhrabgaben für die " +
          "Zollanmeldung.",
        given: [["Warenwert", eur(ware)], ["Seefracht bis EU-Außengrenze", eur(fracht)],
                ["Transportversicherung bis EU-Außengrenze", eur(vers)],
                ["Zollsatz", pz(zollsatz, 1)], ["Nachlauf Hamburg bis Bremen", eur(inland)]],
        parts: [
          { ask: "Ermitteln Sie den Zollwert.", unit: "Euro", decimals: 2, value: zw,
            steps: [eur(ware) + " + " + eur(fracht) + " + " + eur(vers) + " = " + eur(zw, 2)] },
          { ask: "Berechnen Sie den Zollbetrag.", unit: "Euro", decimals: 2, value: zoll,
            steps: [eur(zw, 2) + " × " + pz(zollsatz, 1) + " = " + eur(zoll, 2)] },
          { ask: "Ermitteln Sie die Bemessungsgrundlage der Einfuhrumsatzsteuer.", unit: "Euro", decimals: 2,
            value: bmg,
            steps: [eur(zw, 2) + " + " + eur(zoll, 2) + " + " + eur(inland) + " = " + eur(bmg, 2)] },
          { ask: "Berechnen Sie die Einfuhrumsatzsteuer.", unit: "Euro", decimals: 2, value: eust,
            steps: [eur(bmg, 2) + " × 19 % = " + eur(eust, 2)] },
          { ask: "Ermitteln Sie die gesamten Einfuhrabgaben aus Zoll und Einfuhrumsatzsteuer.",
            unit: "Euro", decimals: 2, value: zoll + eust,
            steps: [eur(zoll, 2) + " + " + eur(eust, 2) + " = " + eur(zoll + eust, 2)] }
        ]
      };
    }
  },

  {
    id: "RB-27", cat: "loes", topic: "Außenhandel und Zoll",
    name: "Global Sourcing mit Wechselkursumrechnung",
    formulas: [
      "Preis in Euro = Preis in Fremdwährung ÷ Wechselkurs (Fremdwährung je Euro)",
      "Einstandspreis = Warenwert + Transport + Zoll + sonstige Beschaffungsnebenkosten",
      "Kostenvorteil = Einstandspreis der teureren Quelle − Einstandspreis der günstigeren Quelle"
    ],
    make: function () {
      var menge = ri(5, 40) * 1000;
      var usd = ri(180, 900) / 100, kurs = ri(102, 122) / 100;
      var transport = ri(30, 120) * 100, zollsatz = pick([2.7, 4, 6.5]);
      var inland = ri(35, 120) / 10;
      var warenwertEur = usd * menge / kurs;
      var zoll = (warenwertEur + transport) * zollsatz / 100;
      var importEur = warenwertEur + transport + zoll;
      var inlandGes = inland * menge;
      return {
        text: "Die Ostsee Verpackungswerk GmbH prüft, ob eine Komponente künftig aus Asien statt von " +
          "einem Lieferanten aus dem Inland bezogen werden soll. Das Angebot aus Asien lautet auf " +
          "US-Dollar je Stück ab Werk. Hinzu kommen Transportkosten bis zum eigenen Werk sowie Zoll auf " +
          "Warenwert und Fracht. Der inländische Lieferant nennt einen Preis frei Haus in Euro, weitere " +
          "Nebenkosten fallen dort nicht an. Die Geschäftsführung will den reinen Preisvergleich sehen, " +
          "bevor Qualitäts-, Bestands- und Wechselkursrisiken bewertet werden.",
        given: [["Jahresmenge", stk(menge)], ["Angebot Asien je Stück", nf(usd, 2) + " USD"],
                ["Wechselkurs", nf(kurs, 2) + " USD je Euro"],
                ["Transportkosten gesamt", eur(transport)], ["Zollsatz", pz(zollsatz, 1)],
                ["Angebot Inland je Stück frei Haus", eur(inland, 2)]],
        parts: [
          { ask: "Ermitteln Sie den Warenwert des Angebots aus Asien in Euro.", unit: "Euro", decimals: 2,
            value: warenwertEur,
            steps: ["Warenwert in USD: " + stk(menge) + " × " + nf(usd, 2) + " = " + nf(usd * menge, 2) + " USD",
                    nf(usd * menge, 2) + " USD ÷ " + nf(kurs, 2) + " = " + eur(warenwertEur, 2)] },
          { ask: "Berechnen Sie den Zollbetrag.", unit: "Euro", decimals: 2, value: zoll,
            steps: ["(" + eur(warenwertEur, 2) + " + " + eur(transport) + ") × " + pz(zollsatz, 1) + " = " + eur(zoll, 2)] },
          { ask: "Ermitteln Sie den Einstandspreis der Importmenge insgesamt.", unit: "Euro", decimals: 2,
            value: importEur,
            steps: [eur(warenwertEur, 2) + " + " + eur(transport) + " + " + eur(zoll, 2) + " = " + eur(importEur, 2)] },
          { ask: "Berechnen Sie den Kostenvorteil der günstigeren Bezugsquelle als Betrag.",
            unit: "Euro", decimals: 2, value: Math.abs(importEur - inlandGes),
            steps: ["Inland gesamt: " + stk(menge) + " × " + eur(inland, 2) + " = " + eur(inlandGes, 2),
                    "Günstiger ist " + (importEur < inlandGes ? "der Import" : "der Inlandslieferant"),
                    eur(Math.max(importEur, inlandGes), 2) + " − " + eur(Math.min(importEur, inlandGes), 2) +
                    " = " + eur(Math.abs(importEur - inlandGes), 2)] }
        ]
      };
    }
  },

  /* ================= HB3: Kommunikation, Führung und Zusammenarbeit =============== */

  {
    id: "RB-28", cat: "komm", topic: "Personalmanagement",
    name: "Personalbedarfsplanung eines Lagerbereichs",
    formulas: [
      "Arbeitsvolumen = Leistungsmenge × Zeitbedarf je Einheit",
      "Bruttopersonalbedarf = Arbeitsvolumen ÷ Jahresarbeitszeit je Person",
      "Nettopersonalbedarf = Bruttopersonalbedarf − (Personalbestand + Zugänge − Abgänge)"
    ],
    make: function () {
      var pos = ri(300, 900) * 1000, zeit = ri(15, 60) / 100;
      var jahr = pick([1600, 1650, 1700]), reserve = pick([8, 10, 12]);
      var bestand = ri(60, 200), zu = ri(0, 12), ab = ri(2, 20);
      var volumen = pos * zeit / 60;
      var brutto = volumen / jahr * (1 + reserve / 100);
      var fort = bestand + zu - ab;
      return {
        text: "Die Rheinlager Kontraktlogistik GmbH übernimmt zum kommenden Geschäftsjahr einen " +
          "zusätzlichen Auftraggeber und muss die Personalausstattung des Lagers neu planen. Aus dem " +
          "Mengengerüst des Auftrags ergibt sich die Zahl der Kommissionierpositionen je Jahr, aus der " +
          "Zeitwirtschaft der durchschnittliche Zeitbedarf je Position in Minuten. Für Urlaub, Krankheit " +
          "und Qualifizierung ist auf den reinen Bedarf ein Reservezuschlag zu rechnen. Aus der " +
          "Personalabteilung sind der aktuelle Bestand sowie bereits feststehende Zu- und Abgänge " +
          "bekannt. Sie erstellen die Bedarfsrechnung für die Geschäftsführung.",
        given: [["Kommissionierpositionen je Jahr", nf(pos, 0)],
                ["Zeitbedarf je Position", nf(zeit, 2) + " Minuten"],
                ["Jahresarbeitszeit je Person", nf(jahr, 0) + " Stunden"],
                ["Reservezuschlag", pz(reserve, 0)],
                ["Aktueller Personalbestand", nf(bestand, 0)],
                ["Feststehende Zugänge", nf(zu, 0)], ["Feststehende Abgänge", nf(ab, 0)]],
        parts: [
          { ask: "Ermitteln Sie das jährliche Arbeitsvolumen in Stunden.", unit: "Stunden", decimals: 2,
            value: volumen,
            steps: [nf(pos, 0) + " × " + nf(zeit, 2) + " Minuten = " + nf(pos * zeit, 0) + " Minuten",
                    nf(pos * zeit, 0) + " ÷ 60 = " + nf(volumen, 2) + " Stunden"] },
          { ask: "Berechnen Sie den Bruttopersonalbedarf einschließlich Reservezuschlag.",
            unit: "Mitarbeitende", decimals: 2, value: brutto,
            steps: [nf(volumen, 2) + " ÷ " + nf(jahr, 0) + " = " + nf(volumen / jahr, 2) + " Personen",
                    nf(volumen / jahr, 2) + " × " + nf(1 + reserve / 100, 2) + " = " + nf(brutto, 2)] },
          { ask: "Ermitteln Sie den fortgeschriebenen Personalbestand.", unit: "Mitarbeitende", decimals: 0,
            value: fort,
            steps: [nf(bestand, 0) + " + " + nf(zu, 0) + " − " + nf(ab, 0) + " = " + nf(fort, 0)] },
          { ask: "Berechnen Sie den Nettopersonalbedarf.", unit: "Mitarbeitende", decimals: 2,
            value: Math.abs(brutto - fort),
            steps: [nf(brutto, 2) + " − " + nf(fort, 0) + " = " + nf(brutto - fort, 2),
                    (brutto - fort >= 0 ? "Es besteht Einstellungsbedarf" : "Es besteht Freisetzungsbedarf")] }
        ]
      };
    }
  },

  {
    id: "RB-29", cat: "komm", topic: "Personalmanagement",
    name: "Personalkennzahlen im Quartalsgespräch",
    formulas: [
      "Fehlzeitenquote = Fehltage ÷ Solltage × 100",
      "Fluktuationsquote = Abgänge ÷ durchschnittlicher Personalbestand × 100",
      "Produktivität je Mitarbeitendem = Leistungsmenge ÷ Anzahl Mitarbeitende"
    ],
    make: function () {
      var mitarb = ri(30, 120), tage = pick([220, 225, 230]);
      var soll = mitarb * tage, fehl = ri(4, 14) * mitarb;
      var ab = ri(2, 25), pos = ri(200, 900) * 1000;
      return {
        text: "Im Quartalsgespräch mit der Bereichsleitung sollen Sie die Personalsituation Ihres " +
          "Lagerbereichs darstellen. Die Geschäftsführung hat für das laufende Jahr Zielwerte für " +
          "Fehlzeiten und Fluktuation vorgegeben, weil beide Größen die Leistungsfähigkeit des Bereichs " +
          "und die Einarbeitungskosten erheblich beeinflussen. Gleichzeitig soll die erbrachte Leistung " +
          "je Mitarbeitendem dargestellt werden, um die Diskussion nicht allein auf Ausfälle zu " +
          "verengen. Aus Zeitwirtschaft und Personalabteilung liegen die Zahlen des Jahres vor.",
        given: [["Durchschnittlicher Personalbestand", nf(mitarb, 0)],
                ["Solltage je Person und Jahr", nf(tage, 0)], ["Fehltage gesamt", nf(fehl, 0)],
                ["Abgänge im Jahr", nf(ab, 0)], ["Kommissionierte Positionen im Jahr", nf(pos, 0)]],
        parts: [
          { ask: "Ermitteln Sie die Solltage des Bereichs insgesamt.", unit: "Tage", decimals: 0, value: soll,
            steps: [nf(mitarb, 0) + " × " + nf(tage, 0) + " = " + nf(soll, 0) + " Tage"] },
          { ask: "Berechnen Sie die Fehlzeitenquote.", unit: "%", decimals: 2, value: fehl / soll * 100,
            steps: [nf(fehl, 0) + " ÷ " + nf(soll, 0) + " × 100 = " + pz(fehl / soll * 100, 2)] },
          { ask: "Ermitteln Sie die Fluktuationsquote.", unit: "%", decimals: 2, value: ab / mitarb * 100,
            steps: [nf(ab, 0) + " ÷ " + nf(mitarb, 0) + " × 100 = " + pz(ab / mitarb * 100, 2)] },
          { ask: "Berechnen Sie die Leistung je Mitarbeitendem im Jahr.", unit: "Positionen", decimals: 0,
            value: pos / mitarb,
            steps: [nf(pos, 0) + " ÷ " + nf(mitarb, 0) + " = " + nf(pos / mitarb, 0) + " Positionen"] }
        ]
      };
    }
  },

  {
    id: "RB-30", cat: "komm", topic: "Personalmanagement",
    name: "Personalkosten je produktiver Stunde",
    formulas: [
      "Jahresbruttoentgelt = Monatsentgelt × 12 + Sonderzahlungen",
      "Personalzusatzkosten = Jahresbruttoentgelt × Zusatzkostensatz ÷ 100",
      "Personalkosten je produktiver Stunde = gesamte Personalkosten ÷ produktive Jahresstunden"
    ],
    make: function () {
      var monat = ri(2600, 4200, 50), sonder = ri(0, 2) * monat;
      var satz = pick([22, 25, 28, 30]);
      var jahresstd = pick([1600, 1650, 1700]), unprod = pick([8, 10, 12, 15]);
      var brutto = monat * 12 + sonder;
      var zusatz = brutto * satz / 100;
      var gesamt = brutto + zusatz;
      var prod = jahresstd * (1 - unprod / 100);
      return {
        text: "Für die Kalkulation eines neuen Kontraktlogistikauftrags benötigt die Rheinlager " +
          "Kontraktlogistik GmbH belastbare Personalkosten je Stunde. Bisher wurde mit dem tariflichen " +
          "Stundenlohn gerechnet, was zu einer deutlichen Unterdeckung geführt hat. Künftig sollen " +
          "Sonderzahlungen sowie die gesetzlichen und tariflichen Personalzusatzkosten einbezogen " +
          "werden. Außerdem ist zu berücksichtigen, dass ein Teil der bezahlten Jahresarbeitszeit auf " +
          "Unterweisungen, Betriebsversammlungen und Rüstzeiten entfällt und damit nicht direkt " +
          "verrechenbar ist. Sie ermitteln den Verrechnungssatz je produktiver Stunde.",
        given: [["Monatsentgelt", eur(monat, 2)], ["Sonderzahlungen je Jahr", eur(sonder, 2)],
                ["Personalzusatzkostensatz", pz(satz, 0)],
                ["Bezahlte Jahresarbeitszeit", nf(jahresstd, 0) + " Stunden"],
                ["Anteil unproduktiver Zeiten", pz(unprod, 0)]],
        parts: [
          { ask: "Ermitteln Sie das Jahresbruttoentgelt.", unit: "Euro", decimals: 2, value: brutto,
            steps: [eur(monat, 2) + " × 12 + " + eur(sonder, 2) + " = " + eur(brutto, 2)] },
          { ask: "Berechnen Sie die Personalzusatzkosten.", unit: "Euro", decimals: 2, value: zusatz,
            steps: [eur(brutto, 2) + " × " + pz(satz, 0) + " = " + eur(zusatz, 2)] },
          { ask: "Ermitteln Sie die produktiven Jahresstunden.", unit: "Stunden", decimals: 0, value: prod,
            steps: [nf(jahresstd, 0) + " × " + nf(100 - unprod, 0) + " % = " + nf(prod, 0) + " Stunden"] },
          { ask: "Berechnen Sie die Personalkosten je produktiver Stunde.", unit: "Euro je Stunde",
            decimals: 2, value: gesamt / prod,
            steps: ["Gesamtkosten: " + eur(brutto, 2) + " + " + eur(zusatz, 2) + " = " + eur(gesamt, 2),
                    eur(gesamt, 2) + " ÷ " + nf(prod, 0) + " = " + eur(gesamt / prod, 2) + " je Stunde"] }
        ]
      };
    }
  },

  {
    id: "RB-31", cat: "komm", topic: "Personalmanagement",
    name: "Besetzung eines Mehrschichtbetriebs",
    formulas: [
      "Benötigte Arbeitsstunden je Tag = Leistungsmenge × Zeitbedarf je Einheit",
      "Mitarbeitende je Schicht = Stunden je Schicht ÷ Arbeitszeit je Person und Schicht, aufgerundet",
      "Gesamtbesetzung = Mitarbeitende je Schicht × Anzahl Schichten × (1 + Ausfallfaktor), aufgerundet"
    ],
    make: function () {
      var menge = ri(30, 120) * 100, zeit = ri(20, 90) / 100;
      var schichten = pick([2, 3]), stdSchicht = pick([7, 7.5, 8]);
      var ausfall = pick([15, 18, 20, 25]) / 100;
      var stdTag = menge * zeit / 60;
      var stdJeSchicht = stdTag / schichten;
      var jeSchicht = Math.ceil(stdJeSchicht / stdSchicht);
      var gesamt = Math.ceil(jeSchicht * schichten * (1 + ausfall));
      return {
        text: "Die Süd-Distribution GmbH & Co. KG nimmt ein neues Distributionszentrum in Betrieb und " +
          "muss die Grundbesetzung festlegen. Der Wareneingang wird im Mehrschichtbetrieb abgewickelt, " +
          "damit die angelieferten Mengen noch am Anlieferungstag vereinnahmt werden. Aus dem " +
          "Mengengerüst ergibt sich die Zahl der täglich zu bearbeitenden Paletten, aus der " +
          "Zeitwirtschaft der Zeitbedarf je Palette in Minuten. Die Menge verteilt sich gleichmäßig auf " +
          "die Schichten. Für Urlaub, Krankheit und Qualifizierung ist ein Ausfallfaktor einzurechnen, " +
          "damit die Besetzung auch bei Abwesenheiten trägt.",
        given: [["Paletten je Tag", nf(menge, 0)], ["Zeitbedarf je Palette", nf(zeit, 2) + " Minuten"],
                ["Anzahl Schichten", nf(schichten, 0)],
                ["Arbeitszeit je Person und Schicht", nf(stdSchicht, 1) + " Stunden"],
                ["Ausfallfaktor", pz(ausfall * 100, 0)]],
        parts: [
          { ask: "Ermitteln Sie die benötigten Arbeitsstunden je Tag.", unit: "Stunden", decimals: 2,
            value: stdTag,
            steps: [nf(menge, 0) + " × " + nf(zeit, 2) + " Minuten = " + nf(menge * zeit, 0) + " Minuten",
                    nf(menge * zeit, 0) + " ÷ 60 = " + nf(stdTag, 2) + " Stunden"] },
          { ask: "Berechnen Sie die benötigten Stunden je Schicht.", unit: "Stunden", decimals: 2,
            value: stdJeSchicht,
            steps: [nf(stdTag, 2) + " ÷ " + nf(schichten, 0) + " = " + nf(stdJeSchicht, 2) + " Stunden"] },
          { ask: "Ermitteln Sie die Zahl der Mitarbeitenden je Schicht (aufgerundet).",
            unit: "Mitarbeitende", decimals: 0, value: jeSchicht,
            steps: [nf(stdJeSchicht, 2) + " ÷ " + nf(stdSchicht, 1) + " = " + nf(stdJeSchicht / stdSchicht, 2),
                    "aufgerundet: " + jeSchicht + " Mitarbeitende"] },
          { ask: "Berechnen Sie die Gesamtbesetzung einschließlich Ausfallfaktor (aufgerundet).",
            unit: "Mitarbeitende", decimals: 0, value: gesamt,
            steps: [jeSchicht + " × " + nf(schichten, 0) + " = " + (jeSchicht * schichten) + " Mitarbeitende",
                    (jeSchicht * schichten) + " × " + nf(1 + ausfall, 2) + " = " +
                    nf(jeSchicht * schichten * (1 + ausfall), 2) + ", aufgerundet " + gesamt] }
        ]
      };
    }
  },
  /* ================= HB4: Umsetzen, bewerten und weiterentwickeln ================= */

  {
    id: "RB-32", cat: "ums", topic: "Logistikcontrolling",
    name: "Wirkung eines Bestandssenkungsprojekts",
    formulas: [
      "Kapitalbindung = durchschnittlicher Lagerbestand zum Einstandspreis",
      "Zinskosten = Kapitalbindung × Zinssatz ÷ 100",
      "Einsparung = Zinskosten vorher − Zinskosten nachher",
      "Umschlagshäufigkeit = Wareneinsatz ÷ durchschnittlicher Lagerbestand"
    ],
    make: function () {
      var vorher = ri(80, 300) * 10000, senkung = pick([10, 15, 20, 25]);
      var nachher = vorher * (1 - senkung / 100);
      var zins = pick([5, 6, 7, 8]);
      var lagerkosten = pick([8, 10, 12]);
      var einsatz = vorher * pick([5, 6, 8, 10]);
      return {
        text: "Die Nordfracht Logistik GmbH hat vor einem Jahr ein Bestandssenkungsprojekt gestartet. " +
          "Durch engere Lieferantenanbindung, kleinere Bestellmengen und die Bereinigung von " +
          "Ladenhütern konnte der durchschnittliche Lagerbestand deutlich verringert werden, ohne dass " +
          "die Lieferbereitschaft gelitten hat. Die Geschäftsführung erwartet nun einen Nachweis, " +
          "welchen wirtschaftlichen Nutzen das Projekt gebracht hat, weil weitere Mittel für die " +
          "Fortsetzung bereitgestellt werden sollen. Neben den Zinskosten der Kapitalbindung sind auch " +
          "die bestandsabhängigen Lagerkosten zu berücksichtigen. Der Wareneinsatz blieb unverändert.",
        given: [["Durchschnittlicher Lagerbestand vorher", eur(vorher)],
                ["Erreichte Bestandssenkung", pz(senkung, 0)],
                ["Kalkulatorischer Zinssatz", pz(zins, 0)],
                ["Bestandsabhängiger Lagerkostensatz", pz(lagerkosten, 0)],
                ["Wareneinsatz je Jahr", eur(einsatz)]],
        parts: [
          { ask: "Ermitteln Sie den durchschnittlichen Lagerbestand nach dem Projekt.",
            unit: "Euro", decimals: 2, value: nachher,
            steps: [eur(vorher) + " × " + nf(100 - senkung, 0) + " % = " + eur(nachher, 2)] },
          { ask: "Berechnen Sie die jährliche Zinsersparnis.", unit: "Euro", decimals: 2,
            value: (vorher - nachher) * zins / 100,
            steps: ["Bestandsreduzierung: " + eur(vorher) + " − " + eur(nachher, 2) + " = " + eur(vorher - nachher, 2),
                    eur(vorher - nachher, 2) + " × " + pz(zins, 0) + " = " + eur((vorher - nachher) * zins / 100, 2)] },
          { ask: "Ermitteln Sie die gesamte jährliche Einsparung aus Zins- und Lagerkosten.",
            unit: "Euro", decimals: 2, value: (vorher - nachher) * (zins + lagerkosten) / 100,
            steps: [eur(vorher - nachher, 2) + " × (" + pz(zins, 0) + " + " + pz(lagerkosten, 0) + ")",
                    "= " + eur(vorher - nachher, 2) + " × " + pz(zins + lagerkosten, 0) + " = " +
                    eur((vorher - nachher) * (zins + lagerkosten) / 100, 2)] },
          { ask: "Berechnen Sie die Umschlagshäufigkeit nach dem Projekt.", unit: "Umschläge je Jahr",
            decimals: 2, value: einsatz / nachher,
            steps: [eur(einsatz) + " ÷ " + eur(nachher, 2) + " = " + nf(einsatz / nachher, 2)] }
        ]
      };
    }
  },

  {
    id: "RB-33", cat: "ums", topic: "Produktionslogistik",
    name: "Analyse der Gesamtanlageneffektivität",
    formulas: [
      "Verfügbarkeit = tatsächliche Laufzeit ÷ geplante Belegungszeit × 100",
      "Leistungsgrad = tatsächliche Menge ÷ (Laufzeit × Sollleistung je Stunde) × 100",
      "Qualitätsrate = Gutmenge ÷ tatsächliche Menge × 100",
      "OEE = Verfügbarkeit × Leistungsgrad × Qualitätsrate"
    ],
    make: function () {
      var belegung = pick([420, 450, 480]);
      var stillstand = ri(20, 90);
      var laufzeit = belegung - stillstand;
      var soll = ri(600, 1400, 50);
      var menge = Math.round(laufzeit / 60 * soll * ri(78, 97) / 100);
      var ausschuss = Math.round(menge * ri(1, 8) / 100);
      var gut = menge - ausschuss;
      var v = laufzeit / belegung * 100;
      var l = menge / (laufzeit / 60 * soll) * 100;
      var q = gut / menge * 100;
      return {
        text: "Im Umschlagzentrum der CityBox KEP-Dienst GmbH bleibt die Sortieranlage seit Monaten " +
          "hinter der geplanten Leistung zurück. Die Betriebsleitung führt das auf häufige " +
          "Störungsstillstände zurück, die Instandhaltung vermutet dagegen eine zu niedrige " +
          "Durchsatzgeschwindigkeit, und die Qualitätssicherung verweist auf Fehlausschleusungen. Bevor " +
          "über Investitionen entschieden wird, soll die Gesamtanlageneffektivität als Ausgangswert " +
          "ermittelt und in ihre drei Bestandteile zerlegt werden, damit der wirkliche Verlusttreiber " +
          "sichtbar wird. Die Daten einer Schicht wurden lückenlos erfasst.",
        given: [["Geplante Belegungszeit", belegung + " Minuten"],
                ["Stillstandszeit", stillstand + " Minuten"],
                ["Sollleistung", nf(soll, 0) + " Sendungen je Stunde"],
                ["Tatsächlich sortierte Sendungen", nf(menge, 0)],
                ["Davon Fehlausschleusungen", nf(ausschuss, 0)]],
        parts: [
          { ask: "Ermitteln Sie die Verfügbarkeit.", unit: "%", decimals: 2, value: v,
            steps: ["Laufzeit: " + belegung + " − " + stillstand + " = " + laufzeit + " Minuten",
                    laufzeit + " ÷ " + belegung + " × 100 = " + pz(v, 2)] },
          { ask: "Berechnen Sie den Leistungsgrad.", unit: "%", decimals: 2, value: l,
            steps: ["Mögliche Menge: " + laufzeit + " ÷ 60 × " + nf(soll, 0) + " = " +
                    nf(laufzeit / 60 * soll, 2) + " Sendungen",
                    nf(menge, 0) + " ÷ " + nf(laufzeit / 60 * soll, 2) + " × 100 = " + pz(l, 2)] },
          { ask: "Ermitteln Sie die Qualitätsrate.", unit: "%", decimals: 2, value: q,
            steps: ["Gutmenge: " + nf(menge, 0) + " − " + nf(ausschuss, 0) + " = " + nf(gut, 0),
                    nf(gut, 0) + " ÷ " + nf(menge, 0) + " × 100 = " + pz(q, 2)] },
          { ask: "Berechnen Sie die Gesamtanlageneffektivität.", unit: "%", decimals: 2,
            value: v * l * q / 10000,
            steps: [pz(v, 2) + " × " + pz(l, 2) + " × " + pz(q, 2) + " = " + pz(v * l * q / 10000, 2)] }
        ]
      };
    }
  },

  {
    id: "RB-34", cat: "ums", topic: "Produktionslogistik",
    name: "Bestand und Durchlaufzeit nach dem Trichtermodell",
    formulas: [
      "Mittlere Durchlaufzeit = mittlerer Bestand ÷ mittlere Leistung",
      "Mittlerer Bestand = mittlere Leistung × mittlere Durchlaufzeit",
      "Bestandsveränderung = Bestand vorher − Bestand nachher"
    ],
    make: function () {
      var leistung = ri(6, 40) * 10, tage = ri(20, 90) / 10;
      var bestand = Math.round(leistung * tage);
      var ziel = Math.round(tage * pick([50, 60, 70]) / 100 * 10) / 10;
      var neuBestand = Math.round(leistung * ziel);
      return {
        text: "In der Fertigung der Elbe Industriemontage GmbH sind die zugesagten Liefertermine zuletzt " +
          "mehrfach nicht zu halten gewesen. Eine Analyse hat ergeben, dass vor dem Engpassarbeitssystem " +
          "erhebliche Warteschlangen entstanden sind. Die Fertigungssteuerung will den Zusammenhang " +
          "zwischen Bestand und Durchlaufzeit belegen, bevor eine bestandsregelnde Auftragsfreigabe " +
          "eingeführt wird. Mittlerer Bestand und mittlere Leistung wurden über acht Wochen aus dem " +
          "Durchlaufdiagramm ermittelt. Die Geschäftsführung hat eine Zielvorgabe für die Durchlaufzeit " +
          "gemacht, die Leistung des Arbeitssystems bleibt dabei unverändert.",
        given: [["Mittlerer Bestand", stk(bestand)], ["Mittlere Leistung", stk(leistung) + " je Tag"],
                ["Zielvorgabe für die Durchlaufzeit", nf(ziel, 1) + " Tage"]],
        parts: [
          { ask: "Ermitteln Sie die derzeitige mittlere Durchlaufzeit.", unit: "Tage", decimals: 2,
            value: bestand / leistung,
            steps: [stk(bestand) + " ÷ " + stk(leistung) + " je Tag = " + nf(bestand / leistung, 2) + " Tage"] },
          { ask: "Berechnen Sie den Bestand, der zur Zielvorgabe gehört.", unit: "Stück", decimals: 0,
            value: neuBestand, tol: 2,
            steps: [stk(leistung) + " je Tag × " + nf(ziel, 1) + " Tage = " + stk(neuBestand)] },
          { ask: "Ermitteln Sie die notwendige Bestandssenkung.", unit: "Stück", decimals: 0,
            value: bestand - neuBestand, tol: 2,
            steps: [stk(bestand) + " − " + stk(neuBestand) + " = " + stk(bestand - neuBestand)] }
        ]
      };
    }
  },

  {
    id: "RB-35", cat: "ums", topic: "Transport und Distribution",
    name: "Kostenanalyse einer Transportrelation",
    formulas: [
      "Tonnenkilometer = transportierte Tonnen × gefahrene Kilometer",
      "Kosten je Tonnenkilometer = Gesamtkosten ÷ Tonnenkilometer",
      "Kosten je Sendung = Gesamtkosten ÷ Anzahl Sendungen",
      "Auslastungsgrad = tatsächliche Ladung ÷ Nutzlast × 100"
    ],
    make: function () {
      var nutz = pick([12, 18, 24, 25]);
      var t = Math.round(nutz * ri(55, 96) / 100 * 10) / 10;
      var km = ri(20, 90) * 10, sendungen = ri(8, 45);
      var fix = ri(80, 220) * 10, variabel = ri(35, 90) / 100;
      var kosten = fix + variabel * km;
      return {
        text: "Die Alpin Transport GmbH führt für einen Industriekunden eine feste Relation im " +
          "Werkverkehr durch. Der Kunde hat angekündigt, die Leistung auszuschreiben, und ein " +
          "Wettbewerber hat bereits einen Preis je Tonnenkilometer genannt. Bevor die Geschäftsführung " +
          "ein Gegenangebot abgibt, müssen die eigenen Kosten der Relation bekannt sein. Für eine " +
          "typische Fahrt liegen die entfernungsunabhängigen Fixkosten je Fahrt und die " +
          "entfernungsabhängigen Kosten je Kilometer vor. Auf der Fahrt werden mehrere Sendungen " +
          "gemeinsam befördert. Volumenbedingte Einschränkungen bestehen nicht.",
        given: [["Nutzlast des Fahrzeugs", nf(nutz, 0) + " Tonnen"],
                ["Tatsächliche Ladung", nf(t, 1) + " Tonnen"],
                ["Gefahrene Strecke", nf(km, 0) + " km"],
                ["Fixkosten je Fahrt", eur(fix, 2)],
                ["Variable Kosten je Kilometer", eur(variabel, 2)],
                ["Anzahl Sendungen auf der Fahrt", nf(sendungen, 0)]],
        parts: [
          { ask: "Ermitteln Sie die Gesamtkosten der Fahrt.", unit: "Euro", decimals: 2, value: kosten,
            steps: [eur(fix, 2) + " + " + eur(variabel, 2) + " × " + nf(km, 0) + " km = " + eur(kosten, 2)] },
          { ask: "Berechnen Sie die geleisteten Tonnenkilometer.", unit: "tkm", decimals: 1, value: t * km,
            steps: [nf(t, 1) + " t × " + nf(km, 0) + " km = " + nf(t * km, 1) + " tkm"] },
          { ask: "Ermitteln Sie die Kosten je Tonnenkilometer.", unit: "Euro je tkm", decimals: 4,
            value: kosten / (t * km),
            steps: [eur(kosten, 2) + " ÷ " + nf(t * km, 1) + " tkm = " + eur(kosten / (t * km), 4)] },
          { ask: "Berechnen Sie die Kosten je Sendung.", unit: "Euro", decimals: 2, value: kosten / sendungen,
            steps: [eur(kosten, 2) + " ÷ " + nf(sendungen, 0) + " = " + eur(kosten / sendungen, 2)] },
          { ask: "Ermitteln Sie den Auslastungsgrad des Fahrzeugs.", unit: "%", decimals: 2,
            value: t / nutz * 100,
            steps: [nf(t, 1) + " ÷ " + nf(nutz, 0) + " × 100 = " + pz(t / nutz * 100, 2)] }
        ]
      };
    }
  },

  {
    id: "RB-36", cat: "ums", topic: "Kosten und Kalkulation",
    name: "Prozesskostenrechnung im Wareneingang",
    formulas: [
      "Prozesskostensatz (leistungsmengeninduziert) = Prozesskosten ÷ Prozessmenge",
      "Umlagesatz für leistungsmengenneutrale Kosten = lmn-Kosten ÷ lmi-Kosten × 100",
      "Gesamtprozesskostensatz = lmi-Satz × (1 + Umlagesatz ÷ 100)",
      "Prozesskosten je Auftrag = Gesamtprozesskostensatz × Anzahl Vorgänge je Auftrag"
    ],
    make: function () {
      var lmi = ri(80, 300) * 1000, lmn = Math.round(lmi * ri(8, 25) / 100);
      var menge = ri(20, 90) * 1000, vorgaenge = ri(2, 8);
      var satz = lmi / menge;
      var umlage = lmn / lmi * 100;
      var gesamt = satz * (1 + umlage / 100);
      return {
        text: "Die Rheinlager Kontraktlogistik GmbH rechnet die Wareneingangsabwicklung bisher pauschal " +
          "über einen Gemeinkostenzuschlag ab. Ein Auftraggeber mit vielen kleinen Anlieferungen hat " +
          "beanstandet, dass er dadurch mit den Kosten großer Anlieferungen belastet werde. Die " +
          "Kostenrechnung soll auf die Prozesskostenrechnung umgestellt werden. Für die Kostenstelle " +
          "Wareneingang sind die leistungsmengeninduzierten Kosten, also die mengenabhängigen Kosten, " +
          "sowie die leistungsmengenneutralen Kosten für Leitung und Verwaltung getrennt erfasst. Der " +
          "Kostentreiber ist die Zahl der bearbeiteten Anlieferpositionen.",
        given: [["Leistungsmengeninduzierte Kosten", eur(lmi)],
                ["Leistungsmengenneutrale Kosten", eur(lmn)],
                ["Prozessmenge je Jahr", nf(menge, 0) + " Positionen"],
                ["Positionen je Kundenauftrag", nf(vorgaenge, 0)]],
        parts: [
          { ask: "Ermitteln Sie den leistungsmengeninduzierten Prozesskostensatz je Position.",
            unit: "Euro", decimals: 4, value: satz,
            steps: [eur(lmi) + " ÷ " + nf(menge, 0) + " = " + eur(satz, 4)] },
          { ask: "Berechnen Sie den Umlagesatz für die leistungsmengenneutralen Kosten.",
            unit: "%", decimals: 2, value: umlage,
            steps: [eur(lmn) + " ÷ " + eur(lmi) + " × 100 = " + pz(umlage, 2)] },
          { ask: "Ermitteln Sie den Gesamtprozesskostensatz je Position.", unit: "Euro", decimals: 4,
            value: gesamt,
            steps: [eur(satz, 4) + " × " + nf(1 + umlage / 100, 4) + " = " + eur(gesamt, 4)] },
          { ask: "Berechnen Sie die Prozesskosten je Kundenauftrag.", unit: "Euro", decimals: 2,
            value: gesamt * vorgaenge,
            steps: [eur(gesamt, 4) + " × " + nf(vorgaenge, 0) + " Positionen = " + eur(gesamt * vorgaenge, 2)] }
        ]
      };
    }
  },

  {
    id: "RB-37", cat: "ums", topic: "Qualität und Prozesse",
    name: "Qualitätskosten und Zehnerregel",
    formulas: [
      "Fehlerquote = fehlerhafte Einheiten ÷ geprüfte Einheiten × 100",
      "Interne Fehlerkosten = interne Fehler × Kostensatz je internem Fehler",
      "Externe Fehlerkosten = externe Fehler × Kostensatz je externem Fehler",
      "Zehnerregel: Die Fehlerkosten steigen je Wertschöpfungsstufe etwa um den Faktor 10"
    ],
    make: function () {
      var geprueft = ri(50, 300) * 1000;
      var intern = ri(20, 200) * 10, extern = ri(5, 80) * 10;
      var kiIntern = ri(30, 180) / 10;
      var kiExtern = kiIntern * 10;
      return {
        text: "Ein Automobilzulieferer, für den die Rheinlager Kontraktlogistik GmbH die " +
          "Sequenzkommissionierung übernimmt, hat für das Folgejahr eine Qualitätsvereinbarung " +
          "vorgelegt. Fehler, die im eigenen Haus vor dem Versand entdeckt werden, verursachen " +
          "überschaubare Nacharbeitskosten. Fehler, die erst beim Kunden auffallen, führen dagegen zu " +
          "Sonderfahrten, Bandstillständen und Pönalen und kosten nach den Erfahrungswerten der " +
          "vergangenen Jahre etwa das Zehnfache. Vor der Verhandlung will die Geschäftsführung wissen, " +
          "wie sich die Fehlerkosten derzeit verteilen und was eine Verlagerung der Prüfung nach vorn " +
          "bringen würde.",
        given: [["Geprüfte Positionen", nf(geprueft, 0)],
                ["Intern entdeckte Fehler", nf(intern, 0)],
                ["Beim Kunden entdeckte Fehler", nf(extern, 0)],
                ["Kosten je intern entdecktem Fehler", eur(kiIntern, 2)],
                ["Kosten je extern entdecktem Fehler", eur(kiExtern, 2)]],
        parts: [
          { ask: "Ermitteln Sie die gesamte Fehlerquote.", unit: "%", decimals: 4,
            value: (intern + extern) / geprueft * 100,
            steps: ["(" + nf(intern, 0) + " + " + nf(extern, 0) + ") ÷ " + nf(geprueft, 0) + " × 100 = " +
                    pz((intern + extern) / geprueft * 100, 4)] },
          { ask: "Berechnen Sie die internen Fehlerkosten.", unit: "Euro", decimals: 2, value: intern * kiIntern,
            steps: [nf(intern, 0) + " × " + eur(kiIntern, 2) + " = " + eur(intern * kiIntern, 2)] },
          { ask: "Berechnen Sie die externen Fehlerkosten.", unit: "Euro", decimals: 2, value: extern * kiExtern,
            steps: [nf(extern, 0) + " × " + eur(kiExtern, 2) + " = " + eur(extern * kiExtern, 2)] },
          { ask: "Ermitteln Sie die Einsparung, wenn die Hälfte der externen Fehler künftig intern entdeckt wird.",
            unit: "Euro", decimals: 2, value: extern / 2 * (kiExtern - kiIntern),
            steps: ["Verlagerte Fehler: " + nf(extern, 0) + " ÷ 2 = " + nf(extern / 2, 0),
                    "Ersparnis je Fehler: " + eur(kiExtern, 2) + " − " + eur(kiIntern, 2) + " = " +
                    eur(kiExtern - kiIntern, 2),
                    nf(extern / 2, 0) + " × " + eur(kiExtern - kiIntern, 2) + " = " +
                    eur(extern / 2 * (kiExtern - kiIntern), 2)] }
        ]
      };
    }
  },

  {
    id: "RB-38", cat: "ums", topic: "Nachhaltigkeit",
    name: "CO2-Bilanz einer Relation im Verkehrsträgervergleich",
    formulas: [
      "Tonnenkilometer = transportierte Tonnen × gefahrene Kilometer",
      "Emissionen = Tonnenkilometer × Emissionsfaktor je Tonnenkilometer",
      "Einsparung = Emissionen des bisherigen Verkehrsträgers − Emissionen der Alternative"
    ],
    make: function () {
      var t = ri(12, 25), km = ri(40, 90) * 10, fahrten = ri(80, 300);
      var lkw = ri(60, 90), bahn = ri(14, 26);
      var tkm = t * km * fahrten;
      return {
        text: "Die Alpin Transport GmbH bedient für einen Industriekunden eine feste Relation bislang " +
          "ausschließlich per Lkw. Der Kunde hat sich zu Klimazielen in der Lieferkette verpflichtet und " +
          "verlangt von seinen Dienstleistern einen Nachweis über die verursachten Emissionen sowie " +
          "Vorschläge zu deren Verringerung. Für den Hauptlauf käme der kombinierte Verkehr auf der " +
          "Schiene in Betracht; Vor- und Nachlauf blieben unverändert und bleiben in dieser Rechnung " +
          "außer Betracht. Die Emissionsfaktoren stammen aus einer anerkannten Datenbank und werden je " +
          "Tonnenkilometer angegeben.",
        given: [["Ladung je Fahrt", nf(t, 0) + " Tonnen"], ["Strecke je Fahrt", nf(km, 0) + " km"],
                ["Fahrten je Jahr", nf(fahrten, 0)],
                ["Emissionsfaktor Lkw", nf(lkw, 0) + " g CO2 je tkm"],
                ["Emissionsfaktor Schiene", nf(bahn, 0) + " g CO2 je tkm"]],
        parts: [
          { ask: "Ermitteln Sie die Tonnenkilometer je Jahr.", unit: "tkm", decimals: 0, value: tkm,
            steps: [nf(t, 0) + " t × " + nf(km, 0) + " km × " + nf(fahrten, 0) + " Fahrten = " + nf(tkm, 0) + " tkm"] },
          { ask: "Berechnen Sie die jährlichen Emissionen beim Lkw-Transport in Tonnen CO2.",
            unit: "Tonnen CO2", decimals: 3, value: tkm * lkw / 1000000,
            steps: [nf(tkm, 0) + " tkm × " + nf(lkw, 0) + " g = " + nf(tkm * lkw, 0) + " g",
                    nf(tkm * lkw, 0) + " g ÷ 1.000.000 = " + nf(tkm * lkw / 1000000, 3) + " Tonnen"] },
          { ask: "Berechnen Sie die jährlichen Emissionen bei Verlagerung auf die Schiene in Tonnen CO2.",
            unit: "Tonnen CO2", decimals: 3, value: tkm * bahn / 1000000,
            steps: [nf(tkm, 0) + " tkm × " + nf(bahn, 0) + " g ÷ 1.000.000 = " +
                    nf(tkm * bahn / 1000000, 3) + " Tonnen"] },
          { ask: "Ermitteln Sie die mögliche Einsparung in Prozent.", unit: "%", decimals: 2,
            value: (lkw - bahn) / lkw * 100,
            steps: ["(" + nf(lkw, 0) + " − " + nf(bahn, 0) + ") ÷ " + nf(lkw, 0) + " × 100 = " +
                    pz((lkw - bahn) / lkw * 100, 2)] }
        ]
      };
    }
  },

  {
    id: "RB-39", cat: "ums", topic: "Lager und Kommissionierung",
    name: "Inventurdifferenz und Bestandsgenauigkeit",
    formulas: [
      "Inventurdifferenz = Buchbestand − gezählter Bestand",
      "Wert der Inventurdifferenz = Mengendifferenz × Einstandspreis",
      "Bestandsgenauigkeit = fehlerfreie Lagerplätze ÷ geprüfte Lagerplätze × 100",
      "Flächennutzungsgrad = genutzte Lagerfläche ÷ gesamte Lagerfläche × 100"
    ],
    make: function () {
      var buch = ri(40, 200) * 100, diff = ri(5, 90) * 10;
      var gezaehlt = buch - diff, preis = ri(25, 400) / 10;
      var plaetze = ri(15, 60) * 100, fehler = ri(10, 200);
      var flaeche = ri(30, 150) * 100, genutzt = Math.round(flaeche * ri(55, 92) / 100);
      return {
        text: "Nach der Stichtagsinventur im Zentrallager der Weser Elektro-Großhandel KG weichen bei " +
          "mehreren Warengruppen die gezählten Bestände von den Buchbeständen ab. Die Geschäftsführung " +
          "hat eine Untersuchung angeordnet, weil die Differenzen das dritte Jahr in Folge zunehmen und " +
          "der Wirtschaftsprüfer die Ordnungsmäßigkeit der Lagerbuchführung infrage stellt. Für eine " +
          "Warengruppe liegen Buchbestand, gezählter Bestand und Einstandspreis vor. Zusätzlich wurde " +
          "eine Stichprobe von Lagerplätzen auf Übereinstimmung geprüft. Weil zugleich über eine " +
          "Hallenerweiterung diskutiert wird, soll auch die Flächennutzung bewertet werden.",
        given: [["Buchbestand", stk(buch)], ["Gezählter Bestand", stk(gezaehlt)],
                ["Einstandspreis je Stück", eur(preis, 2)],
                ["Geprüfte Lagerplätze", nf(plaetze, 0)], ["Davon mit Abweichung", nf(fehler, 0)],
                ["Gesamte Lagerfläche", nf(flaeche, 0) + " m²"],
                ["Davon für Lagerung genutzt", nf(genutzt, 0) + " m²"]],
        parts: [
          { ask: "Ermitteln Sie die Inventurdifferenz in Stück.", unit: "Stück", decimals: 0, value: diff,
            steps: [stk(buch) + " − " + stk(gezaehlt) + " = " + stk(diff)] },
          { ask: "Berechnen Sie den Wert der Inventurdifferenz.", unit: "Euro", decimals: 2,
            value: diff * preis,
            steps: [stk(diff) + " × " + eur(preis, 2) + " = " + eur(diff * preis, 2)] },
          { ask: "Ermitteln Sie die Bestandsgenauigkeit der Stichprobe.", unit: "%", decimals: 2,
            value: (plaetze - fehler) / plaetze * 100,
            steps: ["Fehlerfrei: " + nf(plaetze, 0) + " − " + nf(fehler, 0) + " = " + nf(plaetze - fehler, 0),
                    nf(plaetze - fehler, 0) + " ÷ " + nf(plaetze, 0) + " × 100 = " +
                    pz((plaetze - fehler) / plaetze * 100, 2)] },
          { ask: "Berechnen Sie den Flächennutzungsgrad.", unit: "%", decimals: 2,
            value: genutzt / flaeche * 100,
            steps: [nf(genutzt, 0) + " ÷ " + nf(flaeche, 0) + " × 100 = " + pz(genutzt / flaeche * 100, 2)] }
        ]
      };
    }
  },

  {
    id: "RB-40", cat: "ums", topic: "Recht und Steuern",
    name: "Umsatzsteuer-Voranmeldung eines Monats",
    formulas: [
      "Umsatzsteuer = Nettoumsatz × Steuersatz ÷ 100",
      "Vorsteuer = Nettoeinkäufe × Steuersatz ÷ 100",
      "Zahllast = Umsatzsteuer − Vorsteuer"
    ],
    make: function () {
      var u19 = ri(200, 900) * 1000, u7 = ri(20, 150) * 1000;
      var e19 = ri(150, 700) * 1000, e7 = ri(10, 80) * 1000;
      var ust = u19 * 0.19 + u7 * 0.07;
      var vst = e19 * 0.19 + e7 * 0.07;
      return {
        text: "Die Weser Elektro-Großhandel KG erstellt die Umsatzsteuer-Voranmeldung für den " +
          "abgelaufenen Monat. Neben dem Kerngeschäft mit Installationsmaterial, das dem Regelsteuersatz " +
          "unterliegt, führt das Unternehmen einen kleinen Sortimentsbereich mit ermäßigt besteuerten " +
          "Erzeugnissen. Auf der Eingangsseite stehen Wareneinkäufe und bezogene Leistungen, für die " +
          "ordnungsgemäße Rechnungen mit gesondertem Steuerausweis vorliegen, sodass der Vorsteuerabzug " +
          "zulässig ist. Innergemeinschaftliche Lieferungen und Ausfuhren sind in diesem Monat nicht " +
          "angefallen. Sie ermitteln die Zahllast.",
        given: [["Nettoumsätze zu 19 Prozent", eur(u19)], ["Nettoumsätze zu 7 Prozent", eur(u7)],
                ["Nettoeinkäufe zu 19 Prozent", eur(e19)], ["Nettoeinkäufe zu 7 Prozent", eur(e7)]],
        parts: [
          { ask: "Ermitteln Sie die gesamte Umsatzsteuer.", unit: "Euro", decimals: 2, value: ust,
            steps: [eur(u19) + " × 19 % = " + eur(u19 * 0.19, 2),
                    eur(u7) + " × 7 % = " + eur(u7 * 0.07, 2),
                    "Summe: " + eur(ust, 2)] },
          { ask: "Ermitteln Sie die gesamte Vorsteuer.", unit: "Euro", decimals: 2, value: vst,
            steps: [eur(e19) + " × 19 % = " + eur(e19 * 0.19, 2),
                    eur(e7) + " × 7 % = " + eur(e7 * 0.07, 2),
                    "Summe: " + eur(vst, 2)] },
          { ask: "Berechnen Sie die Zahllast (Betrag angeben).", unit: "Euro", decimals: 2,
            value: Math.abs(ust - vst),
            steps: [eur(ust, 2) + " − " + eur(vst, 2) + " = " + eur(ust - vst, 2),
                    (ust - vst >= 0 ? "Zahllast an das Finanzamt" : "Vorsteuerüberhang, Erstattungsanspruch")] }
        ]
      };
    }
  }

  ];
})();
