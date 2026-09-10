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
        text: "Die Weser Elektro-Großhandel KG betreibt in Bremen ein Zentrallager für Installationsmaterial. Im Rahmen des Jahresabschlusses soll die Kapitalbindung der Warengruppe Kabel und Leitungen beurteilt werden. Aus der Lagerbuchhaltung liegen der Bestand zu Jahresbeginn und zum Jahresende vor.",
        ask: "Ermitteln Sie den durchschnittlichen Lagerbestand des Geschäftsjahres.",
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
        text: "Die Hansa Teile-Service GmbH beliefert Nutzfahrzeugwerkstätten in Norddeutschland mit Ersatzteilen. Ihr Vorlieferant hat angekündigt, die Fertigung einer Bremsscheibenserie für mehrere Monate zu unterbrechen. Bevor Sie über eine Vorratsbeschaffung entscheiden, wollen Sie wissen, wie lange der vorhandene Bestand ohne Zugang ausreicht.",
        ask: "Berechnen Sie die Lagerreichweite des Artikels in Monaten.",
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
        text: "In der MediLog Pharmadistribution GmbH häufen sich Beschwerden von Apotheken über Positionen, die nicht sofort geliefert werden können. Die Vertriebsleitung möchte die Lieferbereitschaft des vergangenen Monats belegt haben, bevor über höhere Sicherheitsbestände entschieden wird. Die Auswertung des Auftragssystems liegt vor.",
        ask: "Ermitteln Sie den Lieferbereitschaftsgrad des Monats in Prozent.",
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
        text: "Die Rheinlager Kontraktlogistik GmbH kommissioniert im Auftrag eines Automobilzulieferers. Im Quartalsgespräch verlangt der Auftraggeber einen Nachweis der Kommissionierqualität in Fehlern je Million Positionen, weil im Vertrag eine Obergrenze vereinbart ist. Die erfassten Zahlen des Quartals liegen vor.",
        ask: "Berechnen Sie die Fehlerquote in ppm.",
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
        text: "Für die Beschaffung von Kunststoffpaletten liegen der Süd-Distribution GmbH & Co. KG mehrere Angebote vor. Um sie vergleichen zu können, müssen alle Angebote einheitlich auf den Einstandspreis heruntergerechnet werden. Für das erste Angebot gelten die folgenden Konditionen.",
        ask: "Ermitteln Sie den Bezugspreis dieses Angebots.",
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
        text: "Die Weser Elektro-Großhandel KG überprüft ihr Sortiment. Für einen Artikel mit rückläufiger Nachfrage steht zur Diskussion, ob er weitergeführt wird. Grundlage der Entscheidung ist der Beitrag, den der Artikel zur Deckung der Fixkosten leistet.",
        ask: "Berechnen Sie den Deckungsbeitrag, den der Artikel im Jahr erwirtschaftet.",
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
        text: "Im Ersatzteillager der Elbe Industriemontage GmbH soll eine ABC-Analyse eingeführt werden, um die Dispositionsverfahren nach Wertigkeit zu staffeln. Für die Einordnung eines Artikels benötigen Sie dessen Anteil am gesamten Verbrauchswert des Lagers.",
        ask: "Ermitteln Sie den Wertanteil des Artikels in Prozent.",
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
        text: "In der Montage der Elbe Industriemontage GmbH kam es zuletzt zu Stillständen, weil Verbindungselemente zu spät nachbestellt wurden. Die Disposition soll künftig über das Bestellpunktverfahren gesteuert werden. Dafür ist festzulegen, bei welchem Bestand eine Bestellung ausgelöst wird.",
        ask: "Berechnen Sie den Meldebestand.",
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
        text: "Die Ostsee Verpackungswerk GmbH bezieht Wellpappzuschnitte bisher in monatlich gleichen Mengen. Weil sowohl die Bestellkosten als auch die Lagerhaltungskosten gestiegen sind, soll die Bestellmenge neu bestimmt werden. Es gelten die vereinfachenden Annahmen der klassischen Bestellmengenformel.",
        ask: "Berechnen Sie die optimale Bestellmenge.",
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
        text: "Die Rheinlager Kontraktlogistik GmbH will das Konfektionieren von Verkaufsdisplays als neue Dienstleistung anbieten. Dafür entstehen zusätzliche Fixkosten für Fläche und Anlagen. Vor der Angebotsabgabe möchte die Geschäftsführung wissen, ab welcher Jahresmenge sich das Geschäft trägt.",
        ask: "Ermitteln Sie die Break-even-Menge.",
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
        text: "In der Vormontage der Elbe Industriemontage GmbH wird eine neue Linie eingerichtet. Die Stationen sollen so ausgelegt werden, dass die Linie genau im Kundentakt arbeitet. Pausen und geplante Rüstzeiten sind in der verfügbaren Zeit bereits berücksichtigt.",
        ask: "Berechnen Sie die Kundentaktzeit je Stück.",
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
        text: "Für die kommende Fertigungswoche der Elbe Industriemontage GmbH steht der Bruttobedarf einer Baugruppe fest. Aus dem Dispositionssystem sind Lagerbestand, offene Bestellungen, bereits reservierte Mengen und der Sicherheitsbestand ersichtlich. Bevor eine Bestellung ausgelöst wird, ist der tatsächlich fehlende Anteil zu bestimmen.",
        ask: "Berechnen Sie den Nettobedarf.",
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
        text: "Die Süd-Distribution GmbH & Co. KG erwägt die Anschaffung eines Schmalgangstaplers, um die vorhandene Lagerfläche besser auszunutzen. Die Geschäftsführung gibt vor, dass sich Investitionen dieser Art innerhalb von fünf Jahren zurückverdienen müssen. Der jährliche Rückfluss aus eingesparten Kosten wurde bereits ermittelt.",
        ask: "Berechnen Sie die Amortisationsdauer in Jahren.",
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
        text: "Die Alpin Transport GmbH beliefert eine Großbaustelle mit Schüttgut. Für den Einsatztag steht nur ein Fahrzeugtyp zur Verfügung, das Material muss vollständig am selben Tag angeliefert werden. Angefangene Fahrten zählen als volle Fahrt.",
        ask: "Ermitteln Sie, wie viele Fahrten erforderlich sind.",
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
        text: "Wegen eines Produktionsstillstands beim Kunden in Singapur muss die Hansa Teile-Service GmbH ein Ersatzteil per Luftfracht versenden. Die Airline rechnet nach dem frachtpflichtigen Gewicht ab und setzt für die Umrechnung des Volumens 6.000 Kubikzentimeter je Kilogramm an. Die Sendung besteht aus einem Packstück.",
        ask: "Ermitteln Sie das frachtpflichtige Gewicht der Sendung.",
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
        text: "Die Rheinlager Kontraktlogistik GmbH plant die Personalausstattung des Lagers für das kommende Geschäftsjahr. Der Bruttopersonalbedarf ergibt sich aus dem geplanten Mengengerüst. Aus der Personalabteilung sind der aktuelle Bestand sowie bereits feststehende Zu- und Abgänge bekannt.",
        ask: "Ermitteln Sie den Nettopersonalbedarf.",
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
        text: "Für ein neues Distributionszentrum der Süd-Distribution GmbH & Co. KG ist die Grundbesetzung zu planen. Das jährliche Arbeitsvolumen wurde aus Mengengerüst und Zeitwerten abgeleitet. Für die Umrechnung auf Vollzeitkräfte ist die tarifliche Jahresarbeitszeit je Person maßgeblich.",
        ask: "Berechnen Sie den Personalbedarf in Vollzeitkräften.",
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
        text: "Im Quartalsgespräch mit der Bereichsleitung sollen Sie die Fehlzeiten Ihres Lagerbereichs darstellen. Als Vergleichsmaßstab dient der Vorjahreswert des Gesamtbetriebs. Aus der Zeitwirtschaft liegen die Solltage je Person und die Summe der Fehltage vor.",
        ask: "Ermitteln Sie die Fehlzeitenquote in Prozent.",
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
        text: "In der Nordfracht Logistik GmbH mussten im Logistikbereich auffällig viele Stellen neu besetzt werden. Bevor über Maßnahmen zur Mitarbeiterbindung entschieden wird, soll die Fluktuation des Vorjahres beziffert und mit dem Branchenwert verglichen werden.",
        ask: "Berechnen Sie die Fluktuationsquote in Prozent.",
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
        text: "Die Nordfracht Logistik GmbH betreibt ein Zentrallager für Ersatzteile des Nutzfahrzeughandels. Im Rahmen der Jahresauswertung soll für die Warengruppe Bremsen beurteilt werden, wie wirtschaftlich der Bestand bewirtschaftet wird. Wareneinsatz und durchschnittlicher Lagerbestand des Geschäftsjahres liegen vor.",
        ask: "Ermitteln Sie die Umschlagshäufigkeit.",
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
        text: "Für dieselbe Warengruppe der Nordfracht Logistik GmbH soll zusätzlich dargestellt werden, wie lange ein Artikel im Durchschnitt im Lager liegt. Die Umschlagshäufigkeit wurde bereits ermittelt. Im Unternehmen wird einheitlich mit einem Geschäftsjahr von 360 Tagen gerechnet.",
        ask: "Berechnen Sie die durchschnittliche Lagerdauer in Tagen.",
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
        text: "Im Rahmen eines Bestandssenkungsprojekts soll bei der Nordfracht Logistik GmbH sichtbar gemacht werden, welche Zinskosten die Lagerung verursacht. Dafür wird zunächst der auf die tatsächliche Lagerdauer bezogene Zinssatz benötigt. Gerechnet wird mit einem Geschäftsjahr von 360 Tagen.",
        ask: "Ermitteln Sie den Lagerzinssatz in Prozent.",
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
        text: "Für den Wirtschaftlichkeitsnachweis des Bestandssenkungsprojekts sind die Zinskosten der Kapitalbindung in Euro auszuweisen. Der durchschnittliche Lagerwert und der bereits ermittelte Lagerzinssatz liegen vor. Die Geschäftsführung erwartet einen Eurobetrag, keine Prozentangabe.",
        ask: "Berechnen Sie die Lagerzinsen in Euro.",
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
        text: "Im Umschlagzentrum der CityBox KEP-Dienst GmbH bleibt die Sortieranlage hinter der geplanten Leistung zurück. Vor dem Start eines Verbesserungsprojekts soll die Gesamtanlageneffektivität als Ausgangswert festgehalten werden. Verfügbarkeit, Leistungsgrad und Qualitätsrate der vergangenen Woche wurden erfasst.",
        ask: "Berechnen Sie die Gesamtanlageneffektivität (OEE) in Prozent.",
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
        text: "Die Rheinlager Kontraktlogistik GmbH vergleicht die Leistung zweier Kommissionierzonen. Für die erste Zone liegen die kommissionierten Positionen und die dafür eingesetzte Arbeitszeit einer Schicht vor. Weg- und Basiszeiten sind in der eingesetzten Zeit enthalten.",
        ask: "Ermitteln Sie die Kommissionierleistung in Positionen je Stunde.",
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
        text: "Die Alpin Transport GmbH wertet die Auslastung ihres Fuhrparks aus, weil die Kosten je Sendung gestiegen sind. Für eine Relation liegen die Nutzlast des eingesetzten Fahrzeugs und die tatsächlich mitgeführte Ladung vor. Volumenbedingte Einschränkungen bestehen nicht.",
        ask: "Berechnen Sie den Auslastungsgrad in Prozent.",
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
        text: "Bevor die Alpin Transport GmbH eine Relation an einen Frachtführer vergibt, will sie die eigenen Kosten kennen. Für eine typische Fahrt liegen Gesamtkosten, transportierte Menge und gefahrene Strecke vor. Das Angebot des Frachtführers lautet auf einen Preis je Tonnenkilometer und soll damit vergleichbar gemacht werden.",
        ask: "Ermitteln Sie die eigenen Kosten je Tonnenkilometer.",
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
        text: "Im monatlichen Lieferantengespräch stellt die MediLog Pharmadistribution GmbH die Liefertreue eines Vorlieferanten zur Diskussion. Im Rahmenvertrag ist eine Mindesttermintreue vereinbart, deren Unterschreitung Konsequenzen auslöst. Aus dem Wareneingang liegen die Zahlen des Monats vor.",
        ask: "Berechnen Sie die Termintreue in Prozent.",
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
        text: "In der Fertigung der Elbe Industriemontage GmbH sind die Durchlaufzeiten zu lang. Vor einer Bestandssenkung soll der Zusammenhang zwischen Bestand und Durchlaufzeit am betroffenen Arbeitssystem belegt werden. Mittlerer Bestand und mittlere Leistung wurden über acht Wochen erfasst.",
        ask: "Ermitteln Sie die mittlere Durchlaufzeit in Tagen.",
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
        text: "Die Süd-Distribution GmbH & Co. KG prüft, ob eine Hallenerweiterung notwendig ist oder ob die vorhandene Fläche besser genutzt werden kann. Als Ausgangswert soll festgehalten werden, welcher Anteil der Lagerfläche tatsächlich für die Lagerung genutzt wird. Verkehrs- und Funktionsflächen zählen nicht als genutzte Fläche.",
        ask: "Ermitteln Sie den Flächennutzungsgrad in Prozent.",
        given: [["Gesamte Lagerfläche", nf(ges, 0) + " m²"], ["Davon genutzt", nf(genutzt, 0) + " m²"]],
        value: genutzt / ges * 100,
        steps: [nf(genutzt, 0) + " ÷ " + nf(ges, 0) + " × 100 = " + nf(genutzt / ges * 100, 1) + " %"]
      };
    }
  }

  ];
})();
