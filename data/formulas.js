/* Rechenaufgaben zu Kennzahlen und Formeln.
 * Jede Vorlage erzeugt über make() bei jedem Aufruf neue Zahlen, damit der
 * Rechenweg geübt wird und nicht das Ergebnis. Die Werte sind so gewählt,
 * dass sich saubere Ergebnisse einstellen.
 * Feld id ist die dauerhafte Kennung für den Lernfortschritt und ändert sich nie.
 */
(function () {
  "use strict";

  function ri(min, max, step) {            // Zufallszahl in Schritten
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

  window.FORMULAS = [

  /* ---------- HB1: Anforderungen ermitteln, analysieren und bewerten ---------- */
  {
    id: "RCH-01", cat: "anf", topic: "Logistikcontrolling",
    name: "Durchschnittlicher Lagerbestand",
    formula: "Durchschnittlicher Lagerbestand = (Anfangsbestand + Endbestand) ÷ 2",
    unit: "Euro", decimals: 0,
    make: function () {
      var ab = ri(80, 300, 2) * 1000, eb = ri(80, 300, 2) * 1000;
      return {
        text: "Für die Bewertung der Kapitalbindung wird der durchschnittliche Lagerbestand des Geschäftsjahres benötigt.",
        given: [["Anfangsbestand", eur(ab)], ["Endbestand", eur(eb)]],
        value: (ab + eb) / 2,
        steps: ["(" + eur(ab) + " + " + eur(eb) + ") ÷ 2 = " + eur((ab + eb) / 2)]
      };
    }
  },
  {
    id: "RCH-02", cat: "anf", topic: "Logistikcontrolling",
    name: "Lagerreichweite",
    formula: "Lagerreichweite = Lagerbestand ÷ durchschnittlicher Verbrauch je Periode",
    unit: "Monate", decimals: 1,
    make: function () {
      var verbrauch = ri(50, 250) * 100, rw = ri(25, 90) / 10;
      var bestand = Math.round(rw * verbrauch);
      return {
        text: "Sie prüfen, wie lange der vorhandene Bestand den Bedarf ohne Zugang deckt.",
        given: [["Lagerbestand", stk(bestand)], ["Durchschnittlicher Monatsverbrauch", stk(verbrauch)]],
        value: bestand / verbrauch,
        steps: [stk(bestand) + " ÷ " + stk(verbrauch) + " = " + nf(bestand / verbrauch, 1) + " Monate"]
      };
    }
  },
  {
    id: "RCH-03", cat: "anf", topic: "Logistikcontrolling",
    name: "Lieferbereitschaftsgrad",
    formula: "Lieferbereitschaftsgrad = sofort erfüllte Anforderungen ÷ Anforderungen gesamt × 100",
    unit: "%", decimals: 1,
    make: function () {
      var ges = ri(20, 90) * 10, fehl = ri(3, 60), erf = ges - fehl;
      return {
        text: "Zur Bewertung des Lieferservice wird der Lieferbereitschaftsgrad des Monats ermittelt.",
        given: [["Anforderungen gesamt", nf(ges, 0)], ["Davon nicht sofort erfüllbar", nf(fehl, 0)]],
        value: erf / ges * 100,
        steps: ["Sofort erfüllt: " + nf(ges, 0) + " − " + nf(fehl, 0) + " = " + nf(erf, 0),
                nf(erf, 0) + " ÷ " + nf(ges, 0) + " × 100 = " + nf(erf / ges * 100, 1) + " %"]
      };
    }
  },
  {
    id: "RCH-04", cat: "anf", topic: "Qualität und Prozesse",
    name: "Fehlerquote in ppm",
    formula: "Fehler je Million (ppm) = Fehler ÷ Gesamtzahl × 1.000.000",
    unit: "ppm", decimals: 0,
    make: function () {
      var ges = ri(100, 500) * 1000, fehl = ri(2, 90) * 10;
      return {
        text: "Die Kommissionierqualität soll in Fehlern je Million Positionen ausgedrückt werden.",
        given: [["Kommissionierpositionen", nf(ges, 0)], ["Fehlerhafte Positionen", nf(fehl, 0)]],
        value: fehl / ges * 1000000,
        steps: [nf(fehl, 0) + " ÷ " + nf(ges, 0) + " = " + nf(fehl / ges, 6),
                nf(fehl / ges, 6) + " × 1.000.000 = " + nf(Math.round(fehl / ges * 1000000), 0) + " ppm"]
      };
    }
  },
  {
    id: "RCH-05", cat: "anf", topic: "Beschaffung",
    name: "Bezugspreis (Einstandspreis)",
    formula: "Listenpreis − Rabatt = Zieleinkaufspreis − Skonto = Bareinkaufspreis + Bezugskosten = Bezugspreis",
    unit: "Euro", decimals: 2,
    make: function () {
      var lp = ri(4, 30) * 1000, rab = pick([5, 10, 15, 20]), sk = pick([2, 3]), bk = ri(8, 60) * 10;
      var ziel = lp * (1 - rab / 100), bar = ziel * (1 - sk / 100), bez = bar + bk;
      return {
        text: "Für den Angebotsvergleich ist der Einstandspreis zu ermitteln.",
        given: [["Listenpreis", eur(lp)], ["Rabatt", rab + " %"], ["Skonto", sk + " %"], ["Bezugskosten", eur(bk)]],
        value: bez,
        steps: ["Zieleinkaufspreis: " + eur(lp) + " − " + rab + " % = " + eur(ziel, 2),
                "Bareinkaufspreis: " + eur(ziel, 2) + " − " + sk + " % = " + eur(bar, 2),
                "Bezugspreis: " + eur(bar, 2) + " + " + eur(bk) + " = " + eur(bez, 2)]
      };
    }
  },
  {
    id: "RCH-06", cat: "anf", topic: "Kosten und Kalkulation",
    name: "Deckungsbeitrag",
    formula: "Deckungsbeitrag gesamt = (Verkaufspreis − variable Stückkosten) × Absatzmenge",
    unit: "Euro", decimals: 0,
    make: function () {
      var kv = ri(12, 70), db = ri(8, 45), p = kv + db, menge = ri(20, 300) * 100;
      return {
        text: "Für eine Sortimentsentscheidung wird der Deckungsbeitrag des Artikels benötigt.",
        given: [["Verkaufspreis je Stück", eur(p)], ["Variable Kosten je Stück", eur(kv)], ["Absatzmenge", stk(menge)]],
        value: db * menge,
        steps: ["Stückdeckungsbeitrag: " + eur(p) + " − " + eur(kv) + " = " + eur(db),
                eur(db) + " × " + stk(menge) + " = " + eur(db * menge)]
      };
    }
  },
  {
    id: "RCH-07", cat: "anf", topic: "Beschaffung",
    name: "Wertanteil in der ABC-Analyse",
    formula: "Wertanteil = (Jahresverbrauchsmenge × Einstandspreis) ÷ Gesamtverbrauchswert × 100",
    unit: "%", decimals: 1,
    make: function () {
      var menge = ri(20, 200) * 100, preis = ri(4, 60), ges = ri(30, 90) * 100000;
      var wert = menge * preis;
      return {
        text: "Für die ABC-Analyse ist der Wertanteil eines Artikels am Gesamtverbrauchswert zu bestimmen.",
        given: [["Jahresverbrauch", stk(menge)], ["Einstandspreis je Stück", eur(preis)],
                ["Gesamtverbrauchswert aller Artikel", eur(ges)]],
        value: wert / ges * 100,
        steps: ["Verbrauchswert: " + stk(menge) + " × " + eur(preis) + " = " + eur(wert),
                eur(wert) + " ÷ " + eur(ges) + " × 100 = " + nf(wert / ges * 100, 1) + " %"]
      };
    }
  },

  /* ---------- HB2: Lösungen entwickeln und planen ---------- */
  {
    id: "RCH-08", cat: "loes", topic: "Beschaffung",
    name: "Meldebestand",
    formula: "Meldebestand = (Tagesverbrauch × Wiederbeschaffungszeit) + Sicherheitsbestand",
    unit: "Stück", decimals: 0,
    make: function () {
      var tv = ri(4, 60) * 10, wbz = ri(2, 12), sb = ri(10, 120) * 10;
      return {
        text: "Für die Disposition ist festzulegen, bei welchem Bestand eine Bestellung ausgelöst wird.",
        given: [["Tagesverbrauch", stk(tv)], ["Wiederbeschaffungszeit", wbz + " Tage"], ["Sicherheitsbestand", stk(sb)]],
        value: tv * wbz + sb,
        steps: ["Verbrauch während der Wiederbeschaffung: " + stk(tv) + " × " + wbz + " = " + stk(tv * wbz),
                stk(tv * wbz) + " + " + stk(sb) + " = " + stk(tv * wbz + sb)]
      };
    }
  },
  {
    id: "RCH-09", cat: "loes", topic: "Beschaffung",
    name: "Optimale Bestellmenge (Andler)",
    formula: "Optimale Bestellmenge = Wurzel aus (200 × Jahresbedarf × Bestellkosten je Bestellung) ÷ (Einstandspreis × Lagerhaltungskostensatz in %)",
    unit: "Stück", decimals: 0, tol: 2,
    make: function () {
      var m = ri(20, 90) * 1000, kf = pick([50, 60, 80, 100, 120]),
          p = pick([4, 5, 8, 10, 12, 20]), lhs = pick([10, 12, 15, 20, 25]);
      var q = Math.sqrt(200 * m * kf / (p * lhs));
      return {
        text: "Die wirtschaftliche Bestellmenge soll nach der klassischen Formel bestimmt werden.",
        given: [["Jahresbedarf", stk(m)], ["Bestellkosten je Bestellung", eur(kf)],
                ["Einstandspreis je Stück", eur(p)], ["Lagerhaltungskostensatz", lhs + " %"]],
        value: q,
        steps: ["Zähler: 200 × " + nf(m, 0) + " × " + nf(kf, 0) + " = " + nf(200 * m * kf, 0),
                "Nenner: " + nf(p, 0) + " × " + nf(lhs, 0) + " = " + nf(p * lhs, 0),
                "Wurzel aus " + nf(200 * m * kf / (p * lhs), 0) + " = rund " + nf(Math.round(q), 0) + " Stück"]
      };
    }
  },
  {
    id: "RCH-10", cat: "loes", topic: "Kosten und Kalkulation",
    name: "Break-even-Menge",
    formula: "Break-even-Menge = Fixkosten ÷ (Verkaufspreis − variable Stückkosten)",
    unit: "Stück", decimals: 0,
    make: function () {
      var kv = ri(10, 60), db = ri(5, 40), p = kv + db, menge = ri(15, 200) * 100;
      var kf = db * menge;
      return {
        text: "Ab welcher Absatzmenge deckt der Deckungsbeitrag die Fixkosten?",
        given: [["Fixkosten je Jahr", eur(kf)], ["Verkaufspreis je Stück", eur(p)],
                ["Variable Kosten je Stück", eur(kv)]],
        value: menge,
        steps: ["Stückdeckungsbeitrag: " + eur(p) + " − " + eur(kv) + " = " + eur(db),
                eur(kf) + " ÷ " + eur(db) + " = " + stk(menge)]
      };
    }
  },
  {
    id: "RCH-11", cat: "loes", topic: "Produktionslogistik",
    name: "Kundentaktzeit",
    formula: "Taktzeit = verfügbare Arbeitszeit ÷ Kundenbedarf im gleichen Zeitraum",
    unit: "Minuten je Stück", decimals: 2,
    make: function () {
      var zeit = pick([420, 450, 480]), bedarf = ri(60, 300, 10);
      return {
        text: "Die Montagelinie soll im Kundentakt ausgelegt werden.",
        given: [["Verfügbare Zeit je Schicht", zeit + " Minuten"], ["Kundenbedarf je Schicht", stk(bedarf)]],
        value: zeit / bedarf,
        steps: [zeit + " Minuten ÷ " + nf(bedarf, 0) + " Stück = " + nf(zeit / bedarf, 2) + " Minuten je Stück"]
      };
    }
  },
  {
    id: "RCH-12", cat: "loes", topic: "Produktionslogistik",
    name: "Nettobedarf",
    formula: "Nettobedarf = Bruttobedarf − (Lagerbestand + offene Bestellungen − Reservierungen − Sicherheitsbestand)",
    unit: "Stück", decimals: 0,
    make: function () {
      var sb = ri(1, 10) * 100, res = ri(0, 8) * 50, ob = ri(0, 10) * 100;
      // Lagerbestand so wählen, dass der verfügbare Bestand nicht negativ wird
      var lb = res + sb + ri(1, 20) * 100;
      var verf = lb + ob - res - sb;
      var brutto = verf + ri(5, 60) * 100;   // echter Restbedarf bleibt positiv
      return {
        text: "Für die Fertigungsplanung ist der tatsächlich zu beschaffende Bedarf zu ermitteln.",
        given: [["Bruttobedarf", stk(brutto)], ["Lagerbestand", stk(lb)], ["Offene Bestellungen", stk(ob)],
                ["Reservierungen", stk(res)], ["Sicherheitsbestand", stk(sb)]],
        value: brutto - verf,
        steps: ["Verfügbarer Bestand: " + stk(lb) + " + " + stk(ob) + " − " + stk(res) + " − " + stk(sb) + " = " + stk(verf),
                stk(brutto) + " − " + stk(verf) + " = " + stk(brutto - verf)]
      };
    }
  },
  {
    id: "RCH-13", cat: "loes", topic: "Investition",
    name: "Amortisationsdauer",
    formula: "Amortisationsdauer = Kapitaleinsatz ÷ durchschnittlicher jährlicher Rückfluss",
    unit: "Jahre", decimals: 1,
    make: function () {
      var jahre = ri(20, 75) / 10, rueck = ri(20, 90) * 1000;
      var kapital = Math.round(jahre * rueck);
      return {
        text: "Nach wie vielen Jahren hat sich die Investition in die Fördertechnik zurückgezahlt?",
        given: [["Anschaffungskosten", eur(kapital)], ["Jährlicher Rückfluss", eur(rueck)]],
        value: kapital / rueck,
        steps: [eur(kapital) + " ÷ " + eur(rueck) + " = " + nf(kapital / rueck, 1) + " Jahre"]
      };
    }
  },
  {
    id: "RCH-14", cat: "loes", topic: "Transport und Distribution",
    name: "Anzahl benötigter Fahrten",
    formula: "Anzahl Fahrten = Gesamtmenge ÷ Nutzlast je Fahrzeug, aufgerundet auf volle Fahrten",
    unit: "Fahrten", decimals: 0,
    make: function () {
      var nutz = pick([12, 18, 24, 25]), menge = ri(60, 400);
      return {
        text: "Die Tagesmenge ist auf Fahrzeuge einer Größe aufzuteilen. Angefangene Fahrten zählen voll.",
        given: [["Zu transportierende Menge", nf(menge, 0) + " Tonnen"], ["Nutzlast je Fahrzeug", nf(nutz, 0) + " Tonnen"]],
        value: Math.ceil(menge / nutz),
        steps: [nf(menge, 0) + " ÷ " + nf(nutz, 0) + " = " + nf(menge / nutz, 2),
                "Aufgerundet: " + Math.ceil(menge / nutz) + " Fahrten"]
      };
    }
  },
  {
    id: "RCH-15", cat: "loes", topic: "Transport und Distribution",
    name: "Frachtpflichtiges Gewicht Luftfracht",
    formula: "Volumengewicht = Länge × Breite × Höhe in cm ÷ 6.000; frachtpflichtig ist der höhere Wert aus Real- und Volumengewicht",
    unit: "Kilogramm", decimals: 0,
    make: function () {
      var l = ri(60, 120, 10), b = ri(60, 100, 10), h = ri(50, 100, 10);
      var vol = l * b * h / 6000, real = ri(60, 260, 10);
      return {
        text: "Für die Luftfrachtsendung ist das frachtpflichtige Gewicht zu bestimmen.",
        given: [["Maße", l + " × " + b + " × " + h + " cm"], ["Tatsächliches Gewicht", nf(real, 0) + " kg"]],
        value: Math.max(vol, real),
        steps: ["Volumen: " + l + " × " + b + " × " + h + " = " + nf(l * b * h, 0) + " cm³",
                "Volumengewicht: " + nf(l * b * h, 0) + " ÷ 6.000 = " + nf(vol, 1) + " kg",
                "Höherer Wert gegenüber " + nf(real, 0) + " kg: " + nf(Math.round(Math.max(vol, real)), 0) + " kg"]
      };
    }
  },

  /* ---------- HB3: Kommunikation, Führung und Zusammenarbeit ---------- */
  {
    id: "RCH-16", cat: "komm", topic: "Personalmanagement",
    name: "Nettopersonalbedarf",
    formula: "Nettopersonalbedarf = Bruttopersonalbedarf − (Personalbestand + Zugänge − Abgänge)",
    unit: "Mitarbeitende", decimals: 0,
    make: function () {
      var bestand = ri(30, 140), zu = ri(0, 12), ab = ri(0, 15);
      var fort = bestand + zu - ab;
      var brutto = fort + ri(2, 25);         // es bleibt ein echter Einstellungsbedarf
      return {
        text: "Für die Personalplanung des kommenden Jahres ist der Einstellungsbedarf zu ermitteln.",
        given: [["Bruttopersonalbedarf", nf(brutto, 0)], ["Aktueller Personalbestand", nf(bestand, 0)],
                ["Feststehende Zugänge", nf(zu, 0)], ["Feststehende Abgänge", nf(ab, 0)]],
        value: brutto - fort,
        steps: ["Fortgeschriebener Bestand: " + nf(bestand, 0) + " + " + nf(zu, 0) + " − " + nf(ab, 0) + " = " + nf(fort, 0),
                nf(brutto, 0) + " − " + nf(fort, 0) + " = " + nf(brutto - fort, 0)]
      };
    }
  },
  {
    id: "RCH-17", cat: "komm", topic: "Personalmanagement",
    name: "Personalbedarf aus Arbeitsvolumen",
    formula: "Personalbedarf = Gesamtarbeitsvolumen in Stunden ÷ Jahresarbeitszeit je Mitarbeitendem",
    unit: "Mitarbeitende", decimals: 1,
    make: function () {
      var mitarb = ri(8, 45), jahr = pick([1600, 1650, 1700]);
      var ges = mitarb * jahr;
      return {
        text: "Wie viele Vollzeitkräfte werden für das geplante Arbeitsvolumen im Lager benötigt?",
        given: [["Jährliches Arbeitsvolumen", nf(ges, 0) + " Stunden"],
                ["Jahresarbeitszeit je Person", nf(jahr, 0) + " Stunden"]],
        value: ges / jahr,
        steps: [nf(ges, 0) + " ÷ " + nf(jahr, 0) + " = " + nf(ges / jahr, 1) + " Mitarbeitende"]
      };
    }
  },
  {
    id: "RCH-18", cat: "komm", topic: "Personalmanagement",
    name: "Fehlzeitenquote",
    formula: "Fehlzeitenquote = Fehltage ÷ Solltage × 100",
    unit: "%", decimals: 1,
    make: function () {
      var mitarb = ri(20, 90), tage = pick([220, 225, 230]);
      var soll = mitarb * tage, fehl = ri(3, 12) * mitarb;
      return {
        text: "Für das Personalgespräch mit der Bereichsleitung wird die Fehlzeitenquote des Lagers benötigt.",
        given: [["Mitarbeitende", nf(mitarb, 0)], ["Solltage je Person", nf(tage, 0)],
                ["Fehltage gesamt", nf(fehl, 0)]],
        value: fehl / soll * 100,
        steps: ["Solltage gesamt: " + nf(mitarb, 0) + " × " + nf(tage, 0) + " = " + nf(soll, 0),
                nf(fehl, 0) + " ÷ " + nf(soll, 0) + " × 100 = " + nf(fehl / soll * 100, 1) + " %"]
      };
    }
  },
  {
    id: "RCH-19", cat: "komm", topic: "Personalmanagement",
    name: "Fluktuationsquote",
    formula: "Fluktuationsquote = Abgänge im Zeitraum ÷ durchschnittlicher Personalbestand × 100",
    unit: "%", decimals: 1,
    make: function () {
      var bestand = ri(40, 200), ab = ri(3, 30);
      return {
        text: "Die Personalabteilung fragt die Fluktuationsquote des Logistikbereichs für das Vorjahr ab.",
        given: [["Durchschnittlicher Personalbestand", nf(bestand, 0)], ["Abgänge im Jahr", nf(ab, 0)]],
        value: ab / bestand * 100,
        steps: [nf(ab, 0) + " ÷ " + nf(bestand, 0) + " × 100 = " + nf(ab / bestand * 100, 1) + " %"]
      };
    }
  },

  /* ---------- HB4: Umsetzen, bewerten und weiterentwickeln ---------- */
  {
    id: "RCH-20", cat: "ums", topic: "Logistikcontrolling",
    name: "Umschlagshäufigkeit",
    formula: "Umschlagshäufigkeit = Wareneinsatz ÷ durchschnittlicher Lagerbestand",
    unit: "Umschläge je Jahr", decimals: 1,
    make: function () {
      var uh = ri(4, 14), bestand = ri(15, 45) * 10000;
      return {
        text: "Wie oft wird der Lagerbestand im Jahr umgeschlagen?",
        given: [["Wareneinsatz im Jahr", eur(uh * bestand)], ["Durchschnittlicher Lagerbestand", eur(bestand)]],
        value: uh,
        steps: [eur(uh * bestand) + " ÷ " + eur(bestand) + " = " + nf(uh, 1)]
      };
    }
  },
  {
    id: "RCH-21", cat: "ums", topic: "Logistikcontrolling",
    name: "Durchschnittliche Lagerdauer",
    formula: "Durchschnittliche Lagerdauer = 360 ÷ Umschlagshäufigkeit",
    unit: "Tage", decimals: 0,
    make: function () {
      var uh = pick([4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24]);
      return {
        text: "Wie lange liegt ein Artikel im Durchschnitt im Lager? Rechnen Sie mit 360 Tagen.",
        given: [["Umschlagshäufigkeit", nf(uh, 0)]],
        value: 360 / uh,
        steps: ["360 ÷ " + nf(uh, 0) + " = " + nf(360 / uh, 0) + " Tage"]
      };
    }
  },
  {
    id: "RCH-22", cat: "ums", topic: "Logistikcontrolling",
    name: "Lagerzinssatz",
    formula: "Lagerzinssatz = Jahreszinssatz × durchschnittliche Lagerdauer ÷ 360",
    unit: "%", decimals: 2,
    make: function () {
      var zins = pick([4, 5, 6, 7, 8]), dauer = ri(4, 20) * 6;
      return {
        text: "Für die Bewertung der Kapitalbindung wird der Lagerzinssatz benötigt. Rechnen Sie mit 360 Tagen.",
        given: [["Jahreszinssatz", zins + " %"], ["Durchschnittliche Lagerdauer", dauer + " Tage"]],
        value: zins * dauer / 360,
        steps: [zins + " % × " + dauer + " ÷ 360 = " + nf(zins * dauer / 360, 2) + " %"]
      };
    }
  },
  {
    id: "RCH-23", cat: "ums", topic: "Logistikcontrolling",
    name: "Lagerzinsen in Euro",
    formula: "Lagerzinsen = durchschnittlicher Lagerwert × Lagerzinssatz ÷ 100",
    unit: "Euro", decimals: 2,
    make: function () {
      var wert = ri(80, 400) * 1000, satz = ri(60, 320) / 100;
      return {
        text: "Wie hoch sind die Zinskosten der Kapitalbindung im Lager?",
        given: [["Durchschnittlicher Lagerwert", eur(wert)], ["Lagerzinssatz", nf(satz, 2) + " %"]],
        value: wert * satz / 100,
        steps: [eur(wert) + " × " + nf(satz, 2) + " % = " + eur(wert * satz / 100, 2)]
      };
    }
  },
  {
    id: "RCH-24", cat: "ums", topic: "Produktionslogistik",
    name: "Gesamtanlageneffektivität (OEE)",
    formula: "OEE = Verfügbarkeit × Leistungsgrad × Qualitätsrate",
    unit: "%", decimals: 1,
    make: function () {
      var v = ri(80, 97), l = ri(82, 98), q = ri(92, 100);
      return {
        text: "Bewerten Sie die Gesamtanlageneffektivität der Sortieranlage.",
        given: [["Verfügbarkeit", v + " %"], ["Leistungsgrad", l + " %"], ["Qualitätsrate", q + " %"]],
        value: v * l * q / 10000,
        steps: [v + " % × " + l + " % × " + q + " % = " + nf(v * l * q / 10000, 1) + " %"]
      };
    }
  },
  {
    id: "RCH-25", cat: "ums", topic: "Lager und Kommissionierung",
    name: "Kommissionierleistung",
    formula: "Kommissionierleistung = Positionen ÷ eingesetzte Arbeitsstunden",
    unit: "Positionen je Stunde", decimals: 0,
    make: function () {
      var std = ri(12, 16) / 2, leistung = ri(60, 220);
      var pos = Math.round(leistung * std);
      return {
        text: "Wie viele Positionen schafft ein Kommissionierer im Durchschnitt je Stunde?",
        given: [["Kommissionierte Positionen", nf(pos, 0)], ["Eingesetzte Arbeitszeit", nf(std, 1) + " Stunden"]],
        value: pos / std,
        steps: [nf(pos, 0) + " ÷ " + nf(std, 1) + " = " + nf(Math.round(pos / std), 0) + " Positionen je Stunde"]
      };
    }
  },
  {
    id: "RCH-26", cat: "ums", topic: "Transport und Distribution",
    name: "Auslastungsgrad eines Fahrzeugs",
    formula: "Auslastungsgrad = tatsächliche Ladung ÷ Nutzlast × 100",
    unit: "%", decimals: 1,
    make: function () {
      var nutz = pick([12, 18, 24, 25]), ladung = ri(50, 98) * nutz / 100;
      return {
        text: "Bewerten Sie die Auslastung des eingesetzten Fahrzeugs.",
        given: [["Nutzlast", nf(nutz, 0) + " Tonnen"], ["Tatsächliche Ladung", nf(ladung, 2) + " Tonnen"]],
        value: ladung / nutz * 100,
        steps: [nf(ladung, 2) + " ÷ " + nf(nutz, 0) + " × 100 = " + nf(ladung / nutz * 100, 1) + " %"]
      };
    }
  },
  {
    id: "RCH-27", cat: "ums", topic: "Transport und Distribution",
    name: "Kosten je Tonnenkilometer",
    formula: "Kosten je Tonnenkilometer = Gesamtkosten ÷ (transportierte Tonnen × gefahrene Kilometer)",
    unit: "Euro je Tonnenkilometer", decimals: 3,
    make: function () {
      var t = ri(8, 25), km = ri(20, 90) * 10, kosten = ri(30, 160) * 10;
      return {
        text: "Für den Kostenvergleich der Relation wird der Kostensatz je Tonnenkilometer benötigt.",
        given: [["Gesamtkosten der Fahrt", eur(kosten)], ["Transportierte Menge", nf(t, 0) + " Tonnen"],
                ["Gefahrene Strecke", nf(km, 0) + " km"]],
        value: kosten / (t * km),
        steps: ["Tonnenkilometer: " + nf(t, 0) + " × " + nf(km, 0) + " = " + nf(t * km, 0) + " tkm",
                eur(kosten) + " ÷ " + nf(t * km, 0) + " tkm = " + nf(kosten / (t * km), 3) + " Euro je tkm"]
      };
    }
  },
  {
    id: "RCH-28", cat: "ums", topic: "Logistikcontrolling",
    name: "Termintreue",
    formula: "Termintreue = termingerechte Lieferungen ÷ Lieferungen gesamt × 100",
    unit: "%", decimals: 1,
    make: function () {
      var ges = ri(30, 120) * 10, spaet = ri(5, 90);
      return {
        text: "Für das monatliche Lieferantengespräch ist die Termintreue zu ermitteln.",
        given: [["Lieferungen gesamt", nf(ges, 0)], ["Davon verspätet", nf(spaet, 0)]],
        value: (ges - spaet) / ges * 100,
        steps: ["Termingerecht: " + nf(ges, 0) + " − " + nf(spaet, 0) + " = " + nf(ges - spaet, 0),
                nf(ges - spaet, 0) + " ÷ " + nf(ges, 0) + " × 100 = " + nf((ges - spaet) / ges * 100, 1) + " %"]
      };
    }
  },
  {
    id: "RCH-29", cat: "ums", topic: "Produktionslogistik",
    name: "Durchlaufzeit nach der Trichterformel",
    formula: "Mittlere Durchlaufzeit = mittlerer Bestand ÷ mittlere Leistung",
    unit: "Tage", decimals: 1,
    make: function () {
      var leistung = ri(4, 30) * 10, tage = ri(15, 90) / 10;
      var bestand = Math.round(leistung * tage);
      return {
        text: "Wie lange dauert ein Auftrag im Mittel durch das Arbeitssystem?",
        given: [["Mittlerer Bestand", stk(bestand)], ["Mittlere Leistung", stk(leistung) + " je Tag"]],
        value: bestand / leistung,
        steps: [stk(bestand) + " ÷ " + stk(leistung) + " je Tag = " + nf(bestand / leistung, 1) + " Tage"]
      };
    }
  },
  {
    id: "RCH-30", cat: "ums", topic: "Lager und Kommissionierung",
    name: "Flächennutzungsgrad",
    formula: "Flächennutzungsgrad = genutzte Lagerfläche ÷ gesamte Lagerfläche × 100",
    unit: "%", decimals: 1,
    make: function () {
      var ges = ri(30, 150) * 100, genutzt = Math.round(ges * ri(55, 92) / 100);
      return {
        text: "Wie gut ist die vorhandene Lagerfläche ausgenutzt?",
        given: [["Gesamte Lagerfläche", nf(ges, 0) + " m²"], ["Davon genutzt", nf(genutzt, 0) + " m²"]],
        value: genutzt / ges * 100,
        steps: [nf(genutzt, 0) + " ÷ " + nf(ges, 0) + " × 100 = " + nf(genutzt / ges * 100, 1) + " %"]
      };
    }
  }

  ];
})();
