/* Prüfungstrainer Logistiksysteme – Anwendungslogik.
   Kein Build, keine Abhängigkeiten. Fortschritt liegt im localStorage des Browsers. */
(function () {
  "use strict";

  /* Der Speicherschlüssel bleibt dauerhaft gleich, die Fassung steht im Inhalt.
     Dadurch übersteht der Lernfortschritt künftige Änderungen an Fragen,
     Kategorien und Einstellungen. */
  var STORE = "fls-trainer";
  var LEGACY_KEYS = ["fls-trainer-v1"];
  var SCHEMA = 2;

  var QUESTIONS = window.QUESTIONS || [];
  var FORMULAS = window.FORMULAS || [];
  var CATEGORIES = window.CATEGORIES || [];

  var MODES = {
    lernen:   { tab: "Lernen",  name: "Lernmodus",
                desc: "Auflösung und Erläuterung direkt nach jeder Frage." },
    pruefung: { tab: "Prüfung", name: "Prüfungssimulation",
                desc: "Auf Zeit, Auswertung erst am Ende. 90 Sekunden je Frage." },
    fehler:   { tab: "Fehler",  name: "Fehlerspeicher",
                desc: "Nur Fragen, die zuletzt falsch beantwortet wurden." },
    rechnen:  { tab: "Rechnen", name: "Rechentrainer", calc: true,
                desc: "Kennzahlen und Formeln mit immer neuen Zahlen. Die Formel steht dabei." }
  };

  /* IHK-Bewertungsschlüssel */
  var GRADES = [
    { min: 92, label: "sehr gut",     note: 1 },
    { min: 81, label: "gut",          note: 2 },
    { min: 67, label: "befriedigend", note: 3 },
    { min: 50, label: "ausreichend",  note: 4 },
    { min: 30, label: "mangelhaft",   note: 5 },
    { min: 0,  label: "ungenügend",   note: 6 }
  ];

  var THEMES = [
    { id: "",      label: "Automatisch" },
    { id: "light", label: "Hell" },
    { id: "dark",  label: "Dunkel" }
  ];

  /* ---------------- Zustand ---------------- */

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function iso(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }

  function nextSpringDate() {
    var now = new Date(), y = now.getFullYear();
    var d = new Date(y, 3, 28);
    if (d <= now) d = new Date(y + 1, 3, 28);
    return iso(d);
  }

  var state = {
    theme: "",
    showFormula: true,
    examDate: nextSpringDate(),
    mode: "lernen",
    size: 20,
    cats: CATEGORIES.map(function (c) { return c.id; }),
    stats: {}
  };

  function readStored() {
    var keys = [STORE].concat(LEGACY_KEYS);
    for (var i = 0; i < keys.length; i++) {
      try {
        var raw = localStorage.getItem(keys[i]);
        if (raw) return { key: keys[i], raw: raw };
      } catch (e) { return null; }   // privater Modus o. Ä.
    }
    return null;
  }

  function count(v) {
    return typeof v === "number" && isFinite(v) && v >= 0 ? Math.floor(v) : 0;
  }

  /* Jedes Feld wird einzeln geprüft und notfalls auf den Standard gesetzt.
     Unbekannte Angaben aus älteren oder neueren Fassungen können den
     gespeicherten Lernfortschritt dadurch nicht entwerten. */
  function adopt(saved) {
    var settings = saved.schema ? (saved.settings || {}) : saved;   // Fassung 1 war flach
    var stats = saved.stats && typeof saved.stats === "object" ? saved.stats : {};

    if (typeof settings.theme === "string" &&
        ["", "light", "dark"].indexOf(settings.theme) !== -1) state.theme = settings.theme;
    if (typeof settings.examDate === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(settings.examDate)) state.examDate = settings.examDate;
    if (MODES[settings.mode]) state.mode = settings.mode;
    if (typeof settings.showFormula === "boolean") state.showFormula = settings.showFormula;
    if ([0, 10, 20, 40].indexOf(settings.size) !== -1) state.size = settings.size;

    /* Nach einer Umbenennung der Handlungsbereiche zeigt die gespeicherte
       Auswahl ins Leere. Unbekanntes wird verworfen; bleibt nichts übrig,
       ist wieder alles ausgewählt statt einer leeren Auswahl. */
    var known = CATEGORIES.map(function (c) { return c.id; });
    if (Array.isArray(settings.cats)) {
      var keep = settings.cats.filter(function (id) { return known.indexOf(id) !== -1; });
      state.cats = keep.length ? keep : known.slice();
    }

    /* Der Lernfortschritt hängt an der unveränderlichen Fragekennung, nicht an
       Kategorie oder Reihenfolge. Einträge zu entfernten Fragen fallen weg. */
    var live = {};
    QUESTIONS.forEach(function (q) { live[q.id] = true; });
    FORMULAS.forEach(function (f) { live[f.id] = true; });
    var clean = {};
    Object.keys(stats).forEach(function (id) {
      if (!live[id]) return;
      var v = stats[id] || {};
      clean[id] = { seen: count(v.seen), right: count(v.right), wrong: count(v.wrong), streak: count(v.streak) };
    });
    state.stats = clean;
  }

  function load() {
    var found = readStored();
    if (!found) return;
    var saved;
    try { saved = JSON.parse(found.raw); } catch (e) { return; }
    if (!saved || typeof saved !== "object") return;

    var outdated = found.key !== STORE || saved.schema !== SCHEMA;
    if (outdated) {
      // Vor der Umstellung den unveränderten alten Stand sichern.
      try { localStorage.setItem(STORE + "-backup", found.raw); } catch (e) {}
    }
    adopt(saved);
    if (outdated) save();
  }

  function save() {
    try {
      localStorage.setItem(STORE, JSON.stringify({
        schema: SCHEMA,
        settings: {
          theme: state.theme, examDate: state.examDate, showFormula: state.showFormula,
          mode: state.mode, size: state.size, cats: state.cats
        },
        stats: state.stats
      }));
    } catch (e) {}
  }

  function statOf(id) { return state.stats[id] || { seen: 0, right: 0, wrong: 0, streak: 0 }; }
  function isMastered(id) { return statOf(id).streak >= 2; }
  function isWeak(id) {
    var s = statOf(id);
    return s.seen > 0 && s.wrong > 0 && s.streak < 2;
  }

  /* ---------------- Hilfsfunktionen ---------------- */

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function catById(id) {
    for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i];
    return { code: "?", name: "Unbekannt" };
  }

  function inCat(id) { return QUESTIONS.filter(function (q) { return q.cat === id; }); }
  function formulasInCat(id) { return FORMULAS.filter(function (f) { return f.cat === id; }); }
  function isCalcMode(m) { return !!MODES[m].calc; }

  /* Aus den Fragestatistiken abgeleitet, nie getrennt gespeichert – dadurch
     kann der Bereichsfortschritt nicht von den Fragedaten abweichen. */
  function catProgress(id) {
    var qs = inCat(id).concat(formulasInCat(id));   // Fragen und Rechenaufgaben zusammen
    var mastered = 0, right = 0, answered = 0, seen = 0;
    qs.forEach(function (q) {
      var st = statOf(q.id);
      if (st.seen) seen++;
      if (isMastered(q.id)) mastered++;
      right += st.right;
      answered += st.seen;
    });
    return {
      total: qs.length, seen: seen, mastered: mastered,
      quote: answered ? Math.round(right / answered * 100) : null,
      pct: qs.length ? Math.round(mastered / qs.length * 100) : 0
    };
  }

  function catProgressText(pr) {
    return pr.mastered + " von " + pr.total + " sicher" +
      (pr.quote === null ? " · noch nicht bearbeitet" : " · " + pr.quote + " % richtig");
  }

  function daysUntil(dateStr) {
    var target = new Date(dateStr + "T00:00:00");
    if (isNaN(target)) return null;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.round((target - today) / 86400000);
  }

  function germanDate(dateStr) {
    var d = new Date(dateStr + "T00:00:00");
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });
  }

  function gradeFor(pct) {
    for (var i = 0; i < GRADES.length; i++) if (pct >= GRADES[i].min) return GRADES[i];
    return GRADES[GRADES.length - 1];
  }

  function plural(n, one, many) { return n === 1 ? one : many; }

  function weakCount() {
    return QUESTIONS.filter(function (q) { return isWeak(q.id); }).length;
  }
  function cdTitleText(days) {
    return days > 0 ? plural(days, "Tag", "Tage") + " bis zur Prüfung" : "Prüfungstermin erreicht";
  }
  function cdSubText(days) {
    var w = Math.round(days / 7);
    return germanDate(state.examDate) +
      (days > 0 ? " · rund " + Math.max(1, w) + " " + plural(w, "Woche", "Wochen") : "");
  }
  function modeFootText(weak) {
    return state.mode === "fehler" && weak === 0
      ? "Noch keine falsch beantworteten Fragen gespeichert."
      : MODES[state.mode].desc;
  }
  function poolFootText(pool) {
    var w = isCalcMode(state.mode) ? ["Rechenaufgabe", "Rechenaufgaben"] : ["Frage", "Fragen"];
    return pool + " " + plural(pool, w[0], w[1]) + " in der aktuellen Auswahl.";
  }
  function startBtnText(pool) {
    return pool ? "Runde starten" : "Bitte Handlungsbereich wählen";
  }

  /* ---------------- Bausteine ---------------- */

  function segmented(act, items, isOn) {
    var h = ['<div class="segmented">'];
    items.forEach(function (it) {
      h.push('<button data-act="' + act + '" data-v="' + esc(it.v) + '" aria-pressed="' +
        isOn(it) + '"' + (it.disabled ? " disabled" : "") + '>' + esc(it.label) + '</button>');
    });
    h.push("</div>");
    return h.join("");
  }

  function groupHead(text, action) {
    return '<div class="group-head' + (action ? " with-action" : "") + '"><span>' + esc(text) + "</span>" +
      (action ? '<button class="head-action" id="toggleAll" data-act="' + action.act + '">' +
        esc(action.label) + "</button>" : "") +
      "</div>";
  }

  /* ---------------- Lauf ---------------- */

  var run = null;
  var screen = "setup";
  var tick = null;

  function poolForRun() {
    var source = isCalcMode(state.mode) ? FORMULAS : QUESTIONS;
    var pool = source.filter(function (x) { return state.cats.indexOf(x.cat) !== -1; });
    if (state.mode === "fehler") pool = pool.filter(function (q) { return isWeak(q.id); });
    return pool;
  }

  function makeItems(list) {
    return list.map(function (x) {
      if (x.make) {                       // Rechenvorlage: Zahlen jetzt erzeugen
        return {
          calc: true, f: x, task: x.make(), input: "", checked: false, correct: null,
          q: { id: x.id, cat: x.cat, topic: x.topic, q: x.name }
        };
      }
      return {
        q: x,
        order: shuffle(x.a.map(function (_, i) { return i; })),
        picked: [],
        checked: false,
        correct: null
      };
    });
  }

  /* Eingabe deutsch gelesen: Komma trennt Dezimalstellen. Steht nur ein Punkt in
     einer Tausenderstellung, wird auch diese Lesart geprüft. */
  function readNumbers(str) {
    var t = String(str || "").trim().replace(/\s|€|%/g, "");
    if (!t) return [];
    var out = [];
    if (t.indexOf(",") !== -1) out.push(parseFloat(t.replace(/\./g, "").replace(",", ".")));
    else {
      out.push(parseFloat(t));
      if (/^\d{1,3}(\.\d{3})+$/.test(t)) out.push(parseFloat(t.replace(/\./g, "")));
    }
    return out.filter(function (n) { return isFinite(n); });
  }

  function checkCalc(it) {
    var soll = it.task.value;
    var tol = it.f.tol !== undefined
      ? it.f.tol
      : Math.max(0.5 * Math.pow(10, -it.f.decimals), Math.abs(soll) * 0.001);
    return readNumbers(it.input).some(function (n) { return Math.abs(n - soll) <= tol; });
  }

  function startRun() {
    var pool = shuffle(poolForRun());
    if (!pool.length) return;
    if (state.size > 0) pool = pool.slice(0, state.size);

    run = { mode: state.mode, items: makeItems(pool), i: 0, deadline: 0 };
    if (run.mode === "pruefung") {
      run.deadline = Date.now() + run.items.length * 90000;
      startTimer();
    }
    screen = "quiz";
    render();
  }

  function startTimer() {
    stopTimer();
    tick = setInterval(function () {
      if (!run || run.mode !== "pruefung") return stopTimer();
      var left = run.deadline - Date.now();
      if (left <= 0) { stopTimer(); finishRun(); return; }
      var el = document.getElementById("timer");
      if (el) {
        el.textContent = clockText(left);
        el.className = left < 120000 ? "nav-timer low" : "nav-timer";
      }
    }, 1000);
  }
  function stopTimer() { if (tick) { clearInterval(tick); tick = null; } }

  function clockText(ms) {
    var s = Math.max(0, Math.ceil(ms / 1000));
    return pad(Math.floor(s / 60)) + ":" + pad(s % 60);
  }

  function current() { return run.items[run.i]; }

  function toggle(displayIdx) {
    var it = current();
    if (it.checked) return;
    var multi = it.q.c.length > 1;
    var pos = it.picked.indexOf(displayIdx);
    if (pos !== -1) it.picked.splice(pos, 1);
    else if (multi) it.picked.push(displayIdx);
    else it.picked = [displayIdx];
    syncAnswers();
  }

  function evaluate(it) {
    var chosen = it.picked.map(function (d) { return it.order[d]; }).sort(function (a, b) { return a - b; });
    var right = it.q.c.slice().sort(function (a, b) { return a - b; });
    return chosen.length === right.length && chosen.every(function (v, i) { return v === right[i]; });
  }

  function record(it) {
    var s = statOf(it.q.id);
    state.stats[it.q.id] = {
      seen: s.seen + 1,
      right: s.right + (it.correct ? 1 : 0),
      wrong: s.wrong + (it.correct ? 0 : 1),
      streak: it.correct ? s.streak + 1 : 0
    };
    save();
  }

  function submit() {
    var it = current();

    if (it.calc) {
      if (!readNumbers(it.input).length) return;
      if (!it.checked) {
        it.checked = true;
        it.correct = checkCalc(it);
        record(it);
        render(true);
      } else {
        advance();
      }
      return;
    }

    if (!it.picked.length) return;

    if (run.mode === "pruefung") {
      it.checked = true;
      it.correct = evaluate(it);
      record(it);
      advance();
      return;
    }
    if (!it.checked) {
      it.checked = true;
      it.correct = evaluate(it);
      record(it);
      render(true);
    } else {
      advance();
    }
  }

  function advance() {
    if (run.i < run.items.length - 1) { run.i++; render(); }
    else finishRun();
  }

  function finishRun() { stopTimer(); screen = "result"; render(); }
  function abortRun() { stopTimer(); run = null; screen = "setup"; render(); }

  function retryWrong() {
    var wrong = run.items.filter(function (it) { return it.checked && !it.correct; });
    if (!wrong.length) return;
    run = {
      mode: "lernen",
      items: makeItems(shuffle(wrong.map(function (it) { return it.q; }))),
      i: 0,
      deadline: 0
    };
    screen = "quiz";
    render();
  }

  /* ---------------- Startseite ---------------- */

  function setupScreen() {
    var total = QUESTIONS.length;
    var seen = 0, mastered = 0, right = 0, answered = 0;
    QUESTIONS.concat(FORMULAS).forEach(function (q) {
      var s = statOf(q.id);
      if (s.seen) seen++;
      if (isMastered(q.id)) mastered++;
      right += s.right;
      answered += s.seen;
    });
    var quote = answered ? Math.round(right / answered * 100) : 0;
    var weak = QUESTIONS.filter(function (q) { return isWeak(q.id); }).length;
    var days = daysUntil(state.examDate);
    var pool = poolForRun().length;

    var h = [];
    h.push('<h1 class="large-title">Prüfungstrainer</h1>');
    h.push('<p class="large-sub">Fachwirt für Logistiksysteme · ' + total +
      " Fragen und " + FORMULAS.length + " Rechenaufgaben · " +
      CATEGORIES.length + " Handlungsbereiche</p>");

    h.push('<div class="widget">');
    h.push('<div class="widget-num tnum" id="cdNum">' + (days === null ? "–" : Math.max(0, days)) + "</div>");
    h.push('<div class="widget-body"><div class="widget-title" id="cdTitle">' + esc(cdTitleText(days)) + "</div>");
    h.push('<div class="widget-sub" id="cdSub">' + esc(cdSubText(days)) + "</div></div>");
    h.push("</div>");
    h.push('<div class="section"><div class="group"><div class="row">');
    h.push('<span class="row-main"><span class="row-title">Prüfungstermin</span></span>');
    h.push('<input type="date" id="examDate" value="' + esc(state.examDate) + '" aria-label="Prüfungstermin">');
    h.push("</div></div></div>");

    h.push('<div class="tiles">');
    h.push(tile(seen + " / " + (total + FORMULAS.length), "Aufgaben bearbeitet"));
    h.push(tile(quote + " %", "Trefferquote"));
    h.push(tile(String(mastered), "sicher beherrscht"));
    h.push(tile(String(weak), "im Fehlerspeicher"));
    h.push("</div>");

    h.push('<div class="section">');
    h.push(groupHead("Modus"));
    h.push(segmented("mode", Object.keys(MODES).map(function (k) {
      return { v: k, label: MODES[k].tab, disabled: k === "fehler" && weak === 0 };
    }), function (it) { return state.mode === it.v; }));
    h.push('<div class="group-foot" id="modeFoot">' + esc(modeFootText(weak)) + "</div>");
    h.push("</div>");

    h.push('<div class="section">');
    h.push(groupHead("Umfang"));
    h.push(segmented("size", [
      { v: "10", label: "10" }, { v: "20", label: "20" },
      { v: "40", label: "40" }, { v: "0", label: "Alle" }
    ], function (it) { return state.size === parseInt(it.v, 10); }));
    h.push('<div class="group-foot" id="sizeFoot">' + esc(poolFootText(pool)) + "</div>");
    h.push("</div>");

    h.push('<div class="section">');
    h.push(groupHead("Handlungsbereiche", {
      act: "toggle-all",
      label: state.cats.length === CATEGORIES.length ? "Alle abwählen" : "Alle auswählen"
    }));
    h.push('<div class="group">');
    CATEGORIES.forEach(function (c) {
      var pr = catProgress(c.id);
      var on = state.cats.indexOf(c.id) !== -1;
      h.push('<button class="row tap" data-act="cat" data-v="' + c.id + '" aria-pressed="' + on + '">');
      h.push('<span class="row-main">');
      h.push('<span class="row-title"><b class="hb">' + esc(c.code) + "</b> " + esc(c.name) + "</span>");
      h.push('<span class="bar"><b style="width:' + pr.pct + '%"></b></span>');
      h.push('<span class="row-sub" data-progress="' + c.id + '">' + esc(catProgressText(pr)) + "</span>");
      h.push("</span>");
      h.push('<span class="row-check">' + (on ? "✓" : "") + "</span>");
      h.push("</button>");
    });
    h.push("</div>");
    h.push('<div class="group-foot">Der Balken zeigt, wie viele Fragen des Bereichs du sicher beherrschst, ' +
      "also zweimal hintereinander richtig beantwortet hast.</div>");
    h.push("</div>");

    h.push('<div class="section">');
    h.push('<button class="btn" id="startBtn" data-act="start"' + (pool ? "" : " disabled") + ">" +
      esc(startBtnText(pool)) + "</button>");
    h.push("</div>");

    h.push('<div class="section">');
    h.push(groupHead("Darstellung"));
    h.push(segmented("theme", THEMES.map(function (t) { return { v: t.id, label: t.label }; }),
      function (it) { return state.theme === it.v; }));
    h.push("</div>");

    h.push('<div class="section"><div class="group">');
    h.push('<button class="row tap destructive row-pad" data-act="reset">Fortschritt zurücksetzen</button>');
    h.push("</div>");
    h.push('<div class="group-foot">Bei Mehrfachauswahl zählt eine Antwort nur, wenn genau alle richtigen ' +
      'Aussagen angekreuzt sind. Die Notenstufen folgen dem IHK-Bewertungsschlüssel, bestanden ab 50 Prozent. ' +
      'Die Fragen sind den vier Handlungsbereichen zugeordnet; jede trägt zusätzlich ihr Fachthema. ' +
      'Gleiche den Zuschnitt mit dem Rahmenplan deiner Kammer ab. Der Fortschritt wird nur lokal in diesem ' +
      'Browser gespeichert und übersteht Aktualisierungen der App.</div>');
    h.push("</div>");

    return h.join("");
  }

  function tile(num, label) {
    return '<div class="tile"><div class="tile-num tnum">' + esc(num) +
      '</div><div class="tile-label">' + esc(label) + "</div></div>";
  }

  /* ---------------- Frage ---------------- */

  function quizScreen() {
    var it = current();
    var q = it.q;
    var c = catById(q.cat);
    var multi = q.c.length > 1;
    var exam = run.mode === "pruefung";
    var pct = (run.i + (it.checked ? 1 : 0)) / run.items.length * 100;

    var h = [];
    h.push('<div class="navbar">');
    h.push('<button class="nav-btn" data-act="abort">Beenden</button>');
    h.push('<div class="nav-title tnum">' + (run.i + 1) + " von " + run.items.length + "</div>");
    h.push('<div class="nav-right">' +
      (exam ? '<span class="nav-timer" id="timer">' + clockText(run.deadline - Date.now()) + "</span>" : "") +
      "</div>");
    h.push("</div>");

    h.push('<div class="progress"><b style="width:' + pct + '%"></b></div>');

    h.push('<div class="q-cat">' + esc(c.code + " · " + c.short) + "</div>");
    h.push('<h2 class="q-text">' + esc(q.q) + "</h2>");
    h.push('<p class="q-hint">' + esc(q.topic || "") + " · " +
      (multi ? "Mehrfachauswahl, alle zutreffenden ankreuzen" : "Eine Antwort") + "</p>");

    h.push('<div class="section"><div class="group">');
    it.order.forEach(function (origIdx, d) {
      var picked = it.picked.indexOf(d) !== -1;
      var correct = q.c.indexOf(origIdx) !== -1;
      var cls = "answer", glyph = "✓";
      if (it.checked && !exam) {
        if (picked && correct) cls += " right";
        else if (picked && !correct) { cls += " wrong"; glyph = "✕"; }
        else if (!picked && correct) cls += " missed";
      }
      var showGlyph = picked || (it.checked && !exam && correct);
      h.push('<button class="' + cls + '" data-act="pick" data-v="' + d + '" aria-pressed="' + picked + '"' +
        (it.checked ? " disabled" : "") + ">");
      h.push('<span class="bullet">' + (showGlyph ? glyph : "") + "</span>");
      h.push('<span class="answer-text">' + esc(q.a[origIdx]) + "</span>");
      h.push("</button>");
    });
    h.push("</div></div>");

    if (it.checked && !exam) {
      h.push('<div class="section"><div class="group">');
      h.push('<div class="verdict ' + (it.correct ? "ok" : "no") + '">' +
        (it.correct ? "✓ Richtig" : "✕ Falsch") + "</div>");
      h.push('<p class="explain">' + esc(q.e) + "</p>");
      h.push("</div></div>");
    }

    var label;
    if (exam) label = run.i === run.items.length - 1 ? "Speichern und auswerten" : "Antwort speichern";
    else if (!it.checked) label = "Antwort prüfen";
    else label = run.i === run.items.length - 1 ? "Runde auswerten" : "Nächste Frage";

    h.push('<button class="btn" id="submitBtn" data-act="submit"' +
      (it.picked.length ? "" : " disabled") + ">" + label + "</button>");
    h.push('<p class="kbd-hint">Tasten 1–' + it.order.length + " zum Auswählen · Enter weiter · Esc beenden</p>");
    return h.join("");
  }

  function nf(n, d) {
    return n.toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });
  }

  function calcScreen() {
    var it = current();
    var f = it.f, t = it.task;
    var c = catById(f.cat);

    var h = [];
    h.push('<div class="navbar">');
    h.push('<button class="nav-btn" data-act="abort">Beenden</button>');
    h.push('<div class="nav-title tnum">' + (run.i + 1) + " von " + run.items.length + "</div>");
    h.push('<div class="nav-right"></div></div>');
    h.push('<div class="progress"><b style="width:' +
      ((run.i + (it.checked ? 1 : 0)) / run.items.length * 100) + '%"></b></div>');

    h.push('<div class="q-cat">' + esc(c.code + " · " + c.short) + "</div>");
    h.push('<h2 class="q-text">' + esc(f.name) + "</h2>");
    h.push('<p class="q-hint">' + esc(f.topic) + " · Ergebnis auf " +
      (f.decimals === 0 ? "volle " + esc(f.unit) : f.decimals + " Nachkommastellen") + "</p>");

    h.push('<div class="section">');
    h.push(groupHead("Formel", { act: "formula", label: state.showFormula ? "Ausblenden" : "Einblenden" }));
    if (state.showFormula) {
      h.push('<div class="group"><div class="formula">' + esc(f.formula) + "</div></div>");
    } else {
      h.push('<div class="group-foot">Ausgeblendet – erst rechnen, dann bei Bedarf einblenden.</div>');
    }
    h.push("</div>");

    h.push('<div class="section">');
    h.push(groupHead("Aufgabe"));
    h.push('<div class="group"><div class="task-text">' + esc(t.text) + "</div>");
    if (t.ask) h.push('<div class="task-ask">' + esc(t.ask) + "</div>");
    t.given.forEach(function (g) {
      h.push('<div class="row"><span class="row-main"><span class="row-title">' + esc(g[0]) +
        '</span></span><span class="row-value">' + esc(g[1]) + "</span></div>");
    });
    h.push("</div></div>");

    h.push('<div class="section">');
    h.push(groupHead("Dein Ergebnis"));
    h.push('<div class="group"><div class="numfield">');
    h.push('<input id="calcInput" type="text" inputmode="decimal" autocomplete="off" ' +
      'placeholder="0" aria-label="Ergebnis" value="' + esc(it.input) + '"' +
      (it.checked ? " disabled" : "") + ">");
    h.push('<span class="unit">' + esc(f.unit) + "</span>");
    h.push("</div></div>");
    h.push('<div class="group-foot">Nachkommastellen mit Komma eingeben.</div>');
    h.push("</div>");

    if (it.checked) {
      h.push('<div class="section"><div class="group">');
      h.push('<div class="verdict ' + (it.correct ? "ok" : "no") + '">' +
        (it.correct ? "✓ Richtig" : "✕ Falsch") + "</div>");
      h.push('<div class="result-line">Richtige Lösung: <b>' +
        esc(nf(t.value, f.decimals) + " " + f.unit) + "</b></div>");
      h.push('<ol class="steps">');
      t.steps.forEach(function (st) { h.push("<li>" + esc(st) + "</li>"); });
      h.push("</ol></div></div>");
    }

    h.push('<button class="btn" id="submitBtn" data-act="submit"' +
      (readNumbers(it.input).length ? "" : " disabled") + ">" +
      (it.checked
        ? (run.i === run.items.length - 1 ? "Runde auswerten" : "Nächste Aufgabe")
        : "Ergebnis prüfen") + "</button>");
    return h.join("");
  }

  /* ---------------- Ergebnis ---------------- */

  function resultScreen() {
    var done = run.items.filter(function (it) { return it.checked; });
    var hits = done.filter(function (it) { return it.correct; }).length;
    var pct = done.length ? Math.round(hits / done.length * 100) : 0;
    var g = gradeFor(pct);
    var passed = pct >= 50;

    var byCat = {};
    done.forEach(function (it) {
      var k = it.q.cat;
      if (!byCat[k]) byCat[k] = { r: 0, w: 0 };
      byCat[k][it.correct ? "r" : "w"]++;
    });

    var h = [];
    h.push('<h1 class="large-title">Ergebnis</h1>');
    h.push('<p class="large-sub">' + MODES[run.mode].name + " · " + done.length +
      " von " + run.items.length + " Fragen bearbeitet</p>");

    h.push('<div class="score">');
    h.push('<div class="score-num tnum">' + pct + "<small> %</small></div>");
    h.push('<div class="score-grade ' + (passed ? "pass" : "fail") + '">' + esc(g.label) + "</div>");
    h.push('<div class="score-sub">' + hits + " von " + done.length + " richtig · Note " + g.note +
      " nach IHK-Schlüssel<br>" + (passed ? "bestanden" : "nicht bestanden, 50 Prozent erforderlich") + "</div>");
    h.push("</div>");

    h.push('<div class="section">');
    h.push(groupHead("Nach Handlungsbereich"));
    h.push('<div class="group">');
    var order = CATEGORIES.map(function (c) { return c.id; });
    Object.keys(byCat).sort(function (a, b) {
      return order.indexOf(a) - order.indexOf(b);
    }).forEach(function (k) {
      var v = byCat[k], n = v.r + v.w, p = Math.round(v.r / n * 100);
      var cc = catById(k);
      h.push('<div class="row"><span class="row-main"><span class="row-title">' +
        esc(cc.code + " · " + cc.short) + "</span>");
      h.push('<span class="bar"><b style="width:' + (v.r / n * 100) + '%"></b>' +
        '<i style="width:' + (v.w / n * 100) + '%"></i></span></span>');
      h.push('<span class="row-value">' + v.r + "/" + n + " · " + p + " %</span></div>");
    });
    h.push("</div></div>");

    var wrong = done.filter(function (it) { return !it.correct; });
    h.push('<div class="section">');
    h.push(groupHead(wrong.length ? wrong.length + " " + plural(wrong.length, "Fehler", "Fehler") : "Durchsicht"));
    if (!wrong.length) {
      h.push('<div class="empty">Alle Fragen dieser Runde richtig beantwortet.<br>' +
        "Nimm dir als Nächstes einen Handlungsbereich mit wenigen sicheren Fragen vor.</div>");
    } else {
      h.push('<div class="group">');
      wrong.forEach(function (it) {
        var q = it.q;
        h.push('<details class="row-details"><summary><span class="chevron">›</span><span>' +
          esc(q.q) + "</span></summary><div class=\"detail-body\">");
        if (it.calc) {
          h.push('<p class="detail-line no"><span class="detail-label">Deine Eingabe</span>' +
            (it.input ? esc(it.input) + " " + esc(it.f.unit) : "keine Eingabe") + "</p>");
          h.push('<p class="detail-line ok"><span class="detail-label">Richtig</span>' +
            esc(nf(it.task.value, it.f.decimals) + " " + it.f.unit) + "</p>");
          h.push('<p class="detail-line"><span class="detail-label">Formel</span>' + esc(it.f.formula) + "</p>");
          h.push('<ol class="steps">');
          it.task.steps.forEach(function (st) { h.push("<li>" + esc(st) + "</li>"); });
          h.push("</ol>");
        } else {
          var chosen = it.picked.map(function (d) { return q.a[it.order[d]]; });
          var rights = q.c.map(function (i) { return q.a[i]; });
          h.push('<p class="detail-line no"><span class="detail-label">Deine Antwort</span>' +
            (chosen.length ? esc(chosen.join(" · ")) : "keine Auswahl") + "</p>");
          h.push('<p class="detail-line ok"><span class="detail-label">Richtig</span>' +
            esc(rights.join(" · ")) + "</p>");
          h.push('<p class="explain">' + esc(q.e) + "</p>");
        }
        h.push("</div></details>");
      });
      h.push("</div>");
    }
    h.push("</div>");

    h.push('<div class="btn-stack">');
    if (wrong.length) h.push('<button class="btn" data-act="retry-wrong">Diese Fehler sofort üben</button>');
    h.push('<button class="btn' + (wrong.length ? " plain" : "") + '" data-act="again">Neue Runde</button>');
    if (wrong.length) h.push('<button class="btn plain" data-act="home">Zur Übersicht</button>');
    h.push("</div>");
    return h.join("");
  }

  /* ---------------- Steuerung ---------------- */

  function qsa(sel) {
    return Array.prototype.slice.call(document.querySelectorAll(sel));
  }

  /* Auswahlvorgänge bauen die Seite nicht neu auf, sondern ändern nur die
     betroffenen Stellen. Dadurch bleibt die Bildlaufposition erhalten und
     die Auswahl reagiert ohne Flackern. */
  function syncSegment(act, isOn) {
    qsa('[data-act="' + act + '"]').forEach(function (b) {
      b.setAttribute("aria-pressed", isOn(b.getAttribute("data-v")));
    });
  }

  function syncCountdown() {
    var days = daysUntil(state.examDate);
    var num = document.getElementById("cdNum");
    var title = document.getElementById("cdTitle");
    var sub = document.getElementById("cdSub");
    if (num) num.textContent = days === null ? "–" : Math.max(0, days);
    if (title) title.textContent = cdTitleText(days);
    if (sub) sub.textContent = cdSubText(days);
  }

  function syncSetup() {
    var pool = poolForRun().length;
    var weak = weakCount();

    syncSegment("mode", function (v) { return state.mode === v; });
    syncSegment("size", function (v) { return state.size === parseInt(v, 10); });
    syncSegment("theme", function (v) { return state.theme === v; });

    qsa('[data-act="cat"]').forEach(function (b) {
      var on = state.cats.indexOf(b.getAttribute("data-v")) !== -1;
      b.setAttribute("aria-pressed", on);
      var mark = b.querySelector(".row-check");
      if (mark) mark.textContent = on ? "✓" : "";
    });

    qsa("[data-progress]").forEach(function (el) {
      el.textContent = catProgressText(catProgress(el.getAttribute("data-progress")));
    });

    var all = document.getElementById("toggleAll");
    if (all) all.textContent = state.cats.length === CATEGORIES.length ? "Alle abwählen" : "Alle auswählen";

    var mf = document.getElementById("modeFoot");
    if (mf) mf.textContent = modeFootText(weak);

    var sf = document.getElementById("sizeFoot");
    if (sf) sf.textContent = poolFootText(pool);

    var btn = document.getElementById("startBtn");
    if (btn) { btn.disabled = !pool; btn.textContent = startBtnText(pool); }
  }

  function syncAnswers() {
    var it = current();
    qsa(".answer").forEach(function (b) {
      var d = parseInt(b.getAttribute("data-v"), 10);
      var picked = it.picked.indexOf(d) !== -1;
      b.setAttribute("aria-pressed", picked);
      var bullet = b.querySelector(".bullet");
      if (bullet) bullet.textContent = picked ? "✓" : "";
    });
    var btn = document.getElementById("submitBtn");
    if (btn) btn.disabled = !it.picked.length;
  }

  function applyTheme() {
    if (state.theme) document.documentElement.setAttribute("data-theme", state.theme);
    else document.documentElement.removeAttribute("data-theme");
  }

  /* keepScroll: bei Auflösung oder Zurücksetzen bleibt die Position stehen,
     bei Bildschirm- und Fragewechsel beginnt die Seite wieder oben. */
  function render(keepScroll) {
    var el = document.getElementById("app");
    if (!el) return;
    var y = window.scrollY;
    el.innerHTML = screen === "quiz"
      ? (current().calc ? calcScreen() : quizScreen())
      : screen === "result" ? resultScreen() : setupScreen();
    window.scrollTo(0, keepScroll ? y : 0);
  }

  document.addEventListener("click", function (ev) {
    var t = ev.target.closest("[data-act]");
    if (!t || t.disabled) return;
    var act = t.getAttribute("data-act");
    var v = t.getAttribute("data-v");

    if (act === "theme") { state.theme = v; applyTheme(); save(); syncSetup(); }
    else if (act === "mode") { state.mode = v; save(); syncSetup(); }
    else if (act === "size") { state.size = parseInt(v, 10); save(); syncSetup(); }
    else if (act === "cat") {
      var pos = state.cats.indexOf(v);
      if (pos === -1) state.cats.push(v); else state.cats.splice(pos, 1);
      save(); syncSetup();
    }
    else if (act === "toggle-all") {
      state.cats = state.cats.length === CATEGORIES.length ? [] : CATEGORIES.map(function (c) { return c.id; });
      save(); syncSetup();
    }
    else if (act === "formula") { state.showFormula = !state.showFormula; save(); render(true); }
    else if (act === "start") startRun();
    else if (act === "pick") toggle(parseInt(v, 10));
    else if (act === "submit") submit();
    else if (act === "abort") { if (confirm("Runde beenden? Der Zwischenstand dieser Runde geht verloren.")) abortRun(); }
    else if (act === "again" || act === "home") { run = null; screen = "setup"; render(); }
    else if (act === "retry-wrong") retryWrong();
    else if (act === "reset") {
      if (confirm("Wirklich den gesamten Lernfortschritt löschen? Das lässt sich nicht rückgängig machen.")) {
        state.stats = {}; save(); render(true);
      }
    }
  });

  document.addEventListener("input", function (ev) {
    if (ev.target.id !== "calcInput" || !run) return;
    current().input = ev.target.value;
    var btn = document.getElementById("submitBtn");
    if (btn) btn.disabled = !readNumbers(ev.target.value).length;
  });

  document.addEventListener("change", function (ev) {
    if (ev.target.id === "examDate") { state.examDate = ev.target.value; save(); syncCountdown(); }
  });

  document.addEventListener("keydown", function (ev) {
    if (screen !== "quiz") return;
    if (ev.key === "Enter" && ev.target.id === "calcInput") { ev.preventDefault(); submit(); return; }
    if (ev.target.tagName === "INPUT") return;
    if (current().calc) {
      if (ev.key === "Enter") { ev.preventDefault(); submit(); }
      else if (ev.key === "Escape") {
        ev.preventDefault();
        if (confirm("Runde beenden? Der Zwischenstand dieser Runde geht verloren.")) abortRun();
      }
      return;
    }
    if (ev.key >= "1" && ev.key <= "9") {
      var d = parseInt(ev.key, 10) - 1;
      if (d < current().order.length) { ev.preventDefault(); toggle(d); }
    } else if (ev.key === "Enter") {
      ev.preventDefault(); submit();
    } else if (ev.key === "Escape") {
      ev.preventDefault();
      if (confirm("Runde beenden? Der Zwischenstand dieser Runde geht verloren.")) abortRun();
    }
  });

  load();
  applyTheme();
  render();
})();
