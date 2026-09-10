/* Prüfungstrainer Logistiksysteme – Anwendungslogik.
   Kein Build, keine Abhängigkeiten. Fortschritt liegt im localStorage des Browsers. */
(function () {
  "use strict";

  var STORE = "fls-trainer-v1";
  var QUESTIONS = window.QUESTIONS || [];
  var CATEGORIES = window.CATEGORIES || [];
  var MODULES = window.MODULES || [];
  var KEYS = "ABCDEFGHI";

  var MODES = {
    lernen:   { name: "Lernmodus",       desc: "Auflösung und Erläuterung direkt nach jeder Frage." },
    pruefung: { name: "Prüfungssimulation", desc: "Auf Zeit, Auswertung erst am Ende. 90 Sekunden je Frage." },
    fehler:   { name: "Fehlerspeicher",  desc: "Nur Fragen, die zuletzt falsch beantwortet wurden." }
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

  /* ---------------- Zustand ---------------- */

  function nextSpringDate() {
    var now = new Date();
    var y = now.getFullYear();
    var d = new Date(y, 3, 28);
    if (d <= now) d = new Date(y + 1, 3, 28);
    return iso(d);
  }

  function iso(d) {
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  var state = {
    theme: "",
    examDate: nextSpringDate(),
    mode: "lernen",
    size: 20,
    cats: CATEGORIES.map(function (c) { return c.id; }),
    stats: {}
  };

  function load() {
    try {
      var raw = localStorage.getItem(STORE);
      if (!raw) return;
      var saved = JSON.parse(raw);
      if (saved && typeof saved === "object") {
        if (saved.theme) state.theme = saved.theme;
        if (saved.examDate) state.examDate = saved.examDate;
        if (MODES[saved.mode]) state.mode = saved.mode;
        if (typeof saved.size === "number") state.size = saved.size;
        if (Array.isArray(saved.cats) && saved.cats.length) state.cats = saved.cats;
        if (saved.stats && typeof saved.stats === "object") state.stats = saved.stats;
      }
    } catch (e) { /* privater Modus o. Ä.: ohne gespeicherten Fortschritt weiterarbeiten */ }
  }

  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {}
  }

  function statOf(id) {
    return state.stats[id] || { seen: 0, right: 0, wrong: 0, streak: 0 };
  }
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

  function inCat(id) {
    return QUESTIONS.filter(function (q) { return q.cat === id; });
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
    return d.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
  }

  function gradeFor(pct) {
    for (var i = 0; i < GRADES.length; i++) if (pct >= GRADES[i].min) return GRADES[i];
    return GRADES[GRADES.length - 1];
  }

  function plural(n, one, many) { return n === 1 ? one : many; }

  /* ---------------- Lauf ---------------- */

  var run = null;
  var screen = "setup";
  var tick = null;

  function poolForRun() {
    var pool = QUESTIONS.filter(function (q) { return state.cats.indexOf(q.cat) !== -1; });
    if (state.mode === "fehler") pool = pool.filter(function (q) { return isWeak(q.id); });
    return pool;
  }

  function startRun() {
    var pool = shuffle(poolForRun());
    if (!pool.length) return;
    if (state.size > 0) pool = pool.slice(0, state.size);

    run = {
      mode: state.mode,
      items: pool.map(function (q) {
        return {
          q: q,
          order: shuffle(q.a.map(function (_, i) { return i; })),
          picked: [],
          checked: false,
          correct: null
        };
      }),
      i: 0,
      deadline: 0
    };

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
        el.className = left < 120000 ? "timer low" : "timer";
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
    render();
  }

  function evaluate(it) {
    var chosen = it.picked.map(function (d) { return it.order[d]; }).sort(function (a, b) { return a - b; });
    var right = it.q.c.slice().sort(function (a, b) { return a - b; });
    return chosen.length === right.length && chosen.every(function (v, i) { return v === right[i]; });
  }

  function record(it) {
    var s = statOf(it.q.id);
    s = { seen: s.seen + 1, right: s.right + (it.correct ? 1 : 0), wrong: s.wrong + (it.correct ? 0 : 1), streak: it.correct ? s.streak + 1 : 0 };
    state.stats[it.q.id] = s;
    save();
  }

  function submit() {
    var it = current();
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
      render();
    } else {
      advance();
    }
  }

  function advance() {
    if (run.i < run.items.length - 1) { run.i++; render(); }
    else finishRun();
  }

  function finishRun() {
    stopTimer();
    screen = "result";
    render();
  }

  function abortRun() {
    stopTimer();
    run = null;
    screen = "setup";
    render();
  }

  /* ---------------- Darstellung: Startseite ---------------- */

  function setupScreen() {
    var total = QUESTIONS.length;
    var seen = 0, mastered = 0, right = 0, answered = 0;
    QUESTIONS.forEach(function (q) {
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
    h.push('<header class="masthead">');
    h.push('<div><h1>Prüfungstrainer<br><span class="accent">Logistiksysteme</span></h1>');
    h.push('<div class="eyebrow masthead-sub">' + total + ' Fragen · 13 Handlungsfelder · IHK-Fortbildung</div></div>');
    h.push('<button class="icon-btn" data-act="theme">' + (isDark() ? "Hell" : "Dunkel") + '</button>');
    h.push('</header>');

    h.push('<div class="countdown">');
    h.push('<div class="countdown-days">' + (days === null ? "–" : (days > 0 ? days : 0)) + '</div>');
    h.push('<div class="countdown-text"><strong>' + (days > 0 ? plural(days, "Tag", "Tage") + " bis zur Prüfung" : "Prüfungstermin erreicht") + '</strong>');
    h.push(germanDate(state.examDate) + (days > 0 ? " · das sind rund " + Math.max(1, Math.round(days / 7)) + " " + plural(Math.round(days / 7), "Woche", "Wochen") : "") + '</div>');
    h.push('<input type="date" id="examDate" value="' + esc(state.examDate) + '" aria-label="Prüfungstermin">');
    h.push('</div>');

    h.push('<div class="stat-row">');
    h.push(statTile(seen + " / " + total, "Fragen mindestens einmal bearbeitet"));
    h.push(statTile(quote + " %", "Trefferquote über alle Versuche"));
    h.push(statTile(String(mastered), "sicher beherrscht (2x in Folge richtig)"));
    h.push(statTile(String(weak), "im Fehlerspeicher"));
    h.push('</div>');

    h.push('<section class="section"><div class="section-head"><h2>Modus</h2></div><div class="mode-grid">');
    Object.keys(MODES).forEach(function (k) {
      var disabled = k === "fehler" && weak === 0;
      h.push('<button class="mode" data-act="mode" data-mode="' + k + '" aria-pressed="' + (state.mode === k) + '"' + (disabled ? " disabled" : "") + '>');
      h.push('<span class="mode-name">' + MODES[k].name + '</span>');
      h.push('<span class="mode-desc">' + (disabled ? "Noch keine falsch beantworteten Fragen gespeichert." : MODES[k].desc) + '</span>');
      h.push('</button>');
    });
    h.push('</div></section>');

    h.push('<section class="section"><div class="section-head"><h2>Umfang</h2>');
    h.push('<span class="section-note">' + pool + ' ' + plural(pool, "Frage", "Fragen") + ' in der Auswahl</span></div>');
    h.push('<div class="seg">');
    [10, 20, 40, 0].forEach(function (n) {
      h.push('<button data-act="size" data-size="' + n + '" aria-pressed="' + (state.size === n) + '">' + (n === 0 ? "alle" : n) + '</button>');
    });
    h.push('</div></section>');

    h.push('<section class="section"><div class="section-head"><h2>Themengebiete</h2>');
    h.push('<button class="link-btn" data-act="toggle-all">' + (state.cats.length === CATEGORIES.length ? "Alle abwählen" : "Alle auswählen") + '</button></div>');

    MODULES.forEach(function (m) {
      var cats = CATEGORIES.filter(function (c) { return c.mod === m.id; });
      if (!cats.length) return;
      h.push('<div class="module-label">' + esc(m.name) + '</div><div class="cat-list">');
      cats.forEach(function (c) {
        var qs = inCat(c.id);
        var mast = qs.filter(function (q) { return isMastered(q.id); }).length;
        var pctM = qs.length ? Math.round(mast / qs.length * 100) : 0;
        var on = state.cats.indexOf(c.id) !== -1;
        h.push('<button class="cat" data-act="cat" data-cat="' + c.id + '" aria-pressed="' + on + '">');
        h.push('<span class="cat-box" aria-hidden="true">✓</span>');
        h.push('<span class="cat-code">' + esc(c.code) + '</span>');
        h.push('<span class="cat-name">' + esc(c.name) + '</span>');
        h.push('<span class="cat-meta"><span class="mastery" title="' + pctM + ' % sicher beherrscht"><span style="width:' + pctM + '%"></span></span>');
        h.push('<span class="cat-count">' + qs.length + '</span></span>');
        h.push('</button>');
      });
      h.push('</div>');
    });
    h.push('</section>');

    h.push('<button class="primary" data-act="start"' + (pool ? "" : " disabled") + '>' +
      (pool ? "Runde starten" : "Bitte Themengebiet wählen") + '</button>');

    h.push('<div class="reset-row"><button class="link-btn" data-act="reset">Fortschritt zurücksetzen</button></div>');

    h.push('<p class="footnote">Bewertet wird streng: Bei Mehrfachauswahl zählt die Antwort nur, wenn genau alle richtigen Aussagen angekreuzt sind. ' +
      'Die Notenstufen folgen dem IHK-Bewertungsschlüssel (ab 50 Prozent bestanden). ' +
      'Die Zuordnung der Fragen zu den Handlungsfeldern orientiert sich an den üblichen IHK-Prüfungsinhalten – gleiche den Zuschnitt bitte mit dem Rahmenplan deiner Kammer ab. ' +
      'Der Fortschritt wird nur lokal in diesem Browser gespeichert.</p>');

    return h.join("");
  }

  function statTile(v, l) {
    return '<div class="stat"><span class="stat-value">' + esc(v) + '</span><span class="stat-label">' + esc(l) + '</span></div>';
  }

  /* ---------------- Darstellung: Frage ---------------- */

  function quizScreen() {
    var it = current();
    var q = it.q;
    var c = catById(q.cat);
    var multi = q.c.length > 1;
    var exam = run.mode === "pruefung";

    var h = [];
    h.push('<div class="runbar">');
    h.push('<button class="icon-btn" data-act="abort">Beenden</button>');
    h.push('<span class="runbar-count">' + (run.i + 1) + ' <span class="of">/ ' + run.items.length + '</span></span>');
    h.push('<span class="runbar-mode">' + MODES[run.mode].name + '</span>');
    if (exam) h.push('<span class="timer" id="timer">' + clockText(run.deadline - Date.now()) + '</span>');
    h.push('</div>');

    h.push('<div class="rail">');
    run.items.forEach(function (item, idx) {
      var cls = "";
      if (idx === run.i) cls = "now";
      else if (item.checked) cls = exam ? "done" : (item.correct ? "right" : "wrong");
      h.push('<i class="' + cls + '"></i>');
    });
    h.push('</div>');

    h.push('<div class="card">');
    h.push('<div class="card-head">');
    h.push('<span class="tag">' + esc(c.code) + ' · ' + esc(q.id) + '</span>');
    h.push('<span class="tag' + (multi ? " multi" : "") + '">' + (multi ? "Mehrfachauswahl" : "Eine Antwort") + '</span>');
    h.push('</div>');
    h.push('<p class="question">' + esc(q.q) + '</p>');

    h.push('<div class="answers">');
    it.order.forEach(function (origIdx, d) {
      var picked = it.picked.indexOf(d) !== -1;
      var correct = q.c.indexOf(origIdx) !== -1;
      var cls = "answer", mark = "";
      if (it.checked && !exam) {
        if (picked && correct) { cls += " is-right"; mark = "✓"; }
        else if (picked && !correct) { cls += " is-wrong"; mark = "✕"; }
        else if (!picked && correct) { cls += " is-missed"; mark = "✓"; }
      }
      h.push('<button class="' + cls + '" data-act="pick" data-d="' + d + '" aria-pressed="' + picked + '"' + (it.checked ? " disabled" : "") + '>');
      h.push('<span class="answer-key">' + KEYS[d] + '</span>');
      h.push('<span>' + esc(q.a[origIdx]) + '</span>');
      h.push('<span class="answer-mark">' + mark + '</span>');
      h.push('</button>');
    });
    h.push('</div>');

    if (it.checked && !exam) {
      h.push('<div class="verdict ' + (it.correct ? "right" : "wrong") + '">' +
        (it.correct ? "Richtig" : "Falsch") +
        '<small>' + esc(c.name) + '</small></div>');
      h.push('<p class="explain">' + esc(q.e) + '</p>');
    }
    h.push('</div>');

    var label;
    if (exam) label = run.i === run.items.length - 1 ? "Antwort speichern und auswerten" : "Antwort speichern";
    else if (!it.checked) label = "Antwort prüfen";
    else label = run.i === run.items.length - 1 ? "Runde auswerten" : "Nächste Frage";

    h.push('<button class="primary" data-act="submit"' + (it.picked.length ? "" : " disabled") + '>' + label + '</button>');
    h.push('<p class="hint">Tasten <kbd>1</kbd>–<kbd>' + it.order.length + '</kbd> zum Auswählen · <kbd>Enter</kbd> weiter · <kbd>Esc</kbd> beenden</p>');
    return h.join("");
  }

  /* ---------------- Darstellung: Ergebnis ---------------- */

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
    h.push('<header class="masthead"><div><h1>Auswertung</h1>');
    h.push('<div class="eyebrow masthead-sub">' + MODES[run.mode].name + ' · ' + done.length + ' von ' + run.items.length + ' Fragen bearbeitet</div></div>');
    h.push('<button class="icon-btn" data-act="theme">' + (isDark() ? "Hell" : "Dunkel") + '</button></header>');

    h.push('<div class="score">');
    h.push('<div class="score-pct">' + pct + '<span style="font-size:.45em"> %</span></div>');
    h.push('<div class="score-body"><h2 class="grade ' + (passed ? "pass" : "fail") + '">' + g.label + '</h2>');
    h.push('<p>' + hits + ' von ' + done.length + ' Fragen richtig · Note ' + g.note + ' nach IHK-Schlüssel · ' +
      (passed ? "bestanden" : "nicht bestanden (50 Prozent erforderlich)") + '</p></div></div>');

    h.push('<section class="section"><div class="section-head"><h2>Nach Handlungsfeld</h2>' +
      '<span class="section-note">grün richtig · rot falsch</span></div><div class="bar-list">');
    Object.keys(byCat).sort().forEach(function (k) {
      var v = byCat[k], n = v.r + v.w, p = Math.round(v.r / n * 100);
      h.push('<div class="bar-row"><span class="bar-code">' + esc(catById(k).code) + '</span>');
      h.push('<span class="bar-track"><b style="width:' + (v.r / n * 100) + '%"></b><i style="width:' + (v.w / n * 100) + '%"></i></span>');
      h.push('<span class="bar-val">' + p + ' % · ' + n + '</span></div>');
    });
    h.push('</div></section>');

    var wrong = done.filter(function (it) { return !it.correct; });
    h.push('<section class="section"><div class="section-head"><h2>' +
      (wrong.length ? "Diese Fragen noch einmal ansehen" : "Durchsicht") + '</h2>' +
      '<span class="section-note">' + wrong.length + ' Fehler</span></div>');

    if (!wrong.length) {
      h.push('<div class="empty">Alle Fragen dieser Runde richtig beantwortet.<br>Nimm dir als Nächstes ein Handlungsfeld mit niedrigem Beherrschungsgrad vor.</div>');
    } else {
      h.push('<div class="review">');
      wrong.forEach(function (it) {
        var q = it.q;
        var chosen = it.picked.map(function (d) { return q.a[it.order[d]]; });
        var right = q.c.map(function (i) { return q.a[i]; });
        h.push('<details><summary>' + esc(q.q) + '</summary><div class="review-body">');
        h.push('<p class="review-line wrong-line"><span class="lbl">Deine Antwort</span>' +
          (chosen.length ? esc(chosen.join(" · ")) : "keine Auswahl") + '</p>');
        h.push('<p class="review-line right-line"><span class="lbl">Richtig</span>' + esc(right.join(" · ")) + '</p>');
        h.push('<p class="explain">' + esc(q.e) + '</p>');
        h.push('</div></details>');
      });
      h.push('</div>');
    }
    h.push('</section>');

    h.push('<div class="btn-row">');
    if (wrong.length) h.push('<button class="primary" data-act="retry-wrong">Diese Fehler sofort üben</button>');
    h.push('<button class="primary' + (wrong.length ? " ghost" : "") + '" data-act="again">Neue Runde</button>');
    h.push('<button class="primary ghost" data-act="home">Zur Übersicht</button>');
    h.push('</div>');
    return h.join("");
  }

  /* ---------------- Steuerung ---------------- */

  function isDark() {
    if (state.theme) return state.theme === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function applyTheme() {
    if (state.theme) document.documentElement.setAttribute("data-theme", state.theme);
    else document.documentElement.removeAttribute("data-theme");
  }

  function render() {
    var el = document.getElementById("app");
    if (!el) return;
    el.innerHTML = screen === "quiz" ? quizScreen() : screen === "result" ? resultScreen() : setupScreen();
    window.scrollTo(0, 0);
  }

  function retryWrong() {
    var wrong = run.items.filter(function (it) { return it.checked && !it.correct; });
    if (!wrong.length) return;
    run = {
      mode: "lernen",
      items: shuffle(wrong).map(function (it) {
        return { q: it.q, order: shuffle(it.q.a.map(function (_, i) { return i; })), picked: [], checked: false, correct: null };
      }),
      i: 0,
      deadline: 0
    };
    screen = "quiz";
    render();
  }

  document.addEventListener("click", function (ev) {
    var t = ev.target.closest("[data-act]");
    if (!t || t.disabled) return;
    var act = t.getAttribute("data-act");

    if (act === "theme") { state.theme = isDark() ? "light" : "dark"; applyTheme(); save(); render(); }
    else if (act === "mode") { state.mode = t.getAttribute("data-mode"); save(); render(); }
    else if (act === "size") { state.size = parseInt(t.getAttribute("data-size"), 10); save(); render(); }
    else if (act === "cat") {
      var id = t.getAttribute("data-cat"), pos = state.cats.indexOf(id);
      if (pos === -1) state.cats.push(id); else state.cats.splice(pos, 1);
      save(); render();
    }
    else if (act === "toggle-all") {
      state.cats = state.cats.length === CATEGORIES.length ? [] : CATEGORIES.map(function (c) { return c.id; });
      save(); render();
    }
    else if (act === "start") startRun();
    else if (act === "pick") toggle(parseInt(t.getAttribute("data-d"), 10));
    else if (act === "submit") submit();
    else if (act === "abort") { if (confirm("Runde beenden? Der Zwischenstand dieser Runde geht verloren.")) abortRun(); }
    else if (act === "again") { run = null; screen = "setup"; render(); }
    else if (act === "home") { run = null; screen = "setup"; render(); }
    else if (act === "retry-wrong") retryWrong();
    else if (act === "reset") {
      if (confirm("Wirklich den gesamten Lernfortschritt löschen? Das lässt sich nicht rückgängig machen.")) {
        state.stats = {}; save(); render();
      }
    }
  });

  document.addEventListener("change", function (ev) {
    if (ev.target.id === "examDate") { state.examDate = ev.target.value; save(); render(); }
  });

  document.addEventListener("keydown", function (ev) {
    if (screen !== "quiz") return;
    if (ev.target.tagName === "INPUT") return;
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
