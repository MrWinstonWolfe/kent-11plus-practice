/* app.js - screens, test runner, timer, marking and progress for the Kent Test practice site. */
(function () {
  'use strict';

  // ---- configuration ----
  // Mock papers are shorter than the real Kent Test papers so they suit a single practice session.
  var MOCKS = {
    verbal:    { title: 'Verbal Reasoning',     count: 30, minutes: 25 },
    nonverbal: { title: 'Non-verbal Reasoning', count: 25, minutes: 20 }
  };
  var STORAGE_KEY = 'kent11plus.progress.v1';
  var MAX_ATTEMPTS = 100;
  var LETTERS = ['A', 'B', 'C', 'D', 'E'];

  var $app = document.getElementById('app');
  var $timer = document.getElementById('timer');

  // ---- helpers ----
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
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
  function pct(n, d) { return d ? Math.round((n / d) * 100) : 0; }
  function fmtTime(sec) {
    sec = Math.max(0, Math.round(sec));
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }
  function typeLabel(id) {
    var secs = window.QUESTION_TYPES, k, i;
    for (k in secs) { for (i = 0; i < secs[k].length; i++) { if (secs[k][i].id === id) { return secs[k][i].label; } } }
    return id;
  }
  function sectionLabel(sec) { return sec === 'verbal' ? 'Verbal Reasoning' : 'Non-verbal Reasoning'; }

  // A malformed question is skipped and logged instead of breaking a test.
  function isValid(q) {
    var ok = q && typeof q.id === 'string' && (q.section === 'verbal' || q.section === 'nonverbal') &&
      Array.isArray(q.options) && q.options.length >= 2 && Number.isInteger(q.answer) &&
      q.answer >= 0 && q.answer < q.options.length && typeof q.prompt === 'string';
    if (ok && q.section === 'nonverbal') {
      try {
        (q.stem || []).concat(q.options).forEach(window.Shapes.checkCell);
      } catch (e) { ok = false; }
    }
    if (!ok && window.console) { console.warn('Skipping malformed question', q && q.id); }
    return !!ok;
  }
  var BANK = (window.QUESTIONS || []).filter(isValid);

  // ---- progress storage (falls back to memory if the browser blocks storage) ----
  var progress = { attempts: [] };
  var storageOK = true;
  function loadProgress() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var d = JSON.parse(raw);
        if (d && Array.isArray(d.attempts)) { progress = d; }
      }
    } catch (e) { storageOK = false; }
  }
  function saveProgress() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) { storageOK = false; }
  }
  loadProgress();

  // ---- session state ----
  var state = { screen: 'home', session: null, onlyMistakes: false };
  var timerId = null;

  function stopTimer() {
    if (timerId) { clearInterval(timerId); timerId = null; }
    $timer.hidden = true;
    $timer.className = 'timer';
  }

  function buildSession(opts) {
    var pool = BANK.filter(function (q) {
      return q.section === opts.section && (!opts.type || q.type === opts.type);
    });
    var picked = shuffle(pool).slice(0, opts.count || pool.length);
    var items = picked.map(function (q) {
      var order = shuffle(q.options.map(function (_, i) { return i; }));
      return { q: q, order: order, correct: order.indexOf(q.answer), picked: null, flagged: false, revealed: false };
    });
    return {
      mode: opts.mode, section: opts.section, type: opts.type || null, items: items, idx: 0,
      startedAt: Date.now(), limitSec: opts.minutes ? opts.minutes * 60 : 0, deadline: opts.minutes ? Date.now() + opts.minutes * 60000 : 0
    };
  }

  function startSession(opts) {
    var s = buildSession(opts);
    if (!s.items.length) { alert('There are no questions available for that choice.'); return; }
    state.session = s;
    state.screen = 'run';
    if (s.deadline) { startTimer(); }
    render();
  }

  function startTimer() {
    $timer.hidden = false;
    tick();
    timerId = setInterval(tick, 500);
  }
  function tick() {
    var s = state.session;
    if (!s || !s.deadline) { return; }
    var left = Math.ceil((s.deadline - Date.now()) / 1000);
    $timer.textContent = fmtTime(left);
    $timer.className = 'timer' + (left <= 60 ? ' urgent' : left <= 300 ? ' low' : '');
    if (left <= 0) { finish(true); }
  }

  // ---- rendering of questions ----
  function figs(cells, label) {
    return cells.map(function (c, i) { return window.Shapes.cellSvg(c, { label: label + ' ' + (i + 1) }); });
  }

  function stemHtml(q) {
    var S = window.Shapes, html = '';
    if (q.layout === 'row' && q.stem) {
      var cells = q.stem.slice();
      var showMark = q.type === 'nv-seq';
      html = '<div class="stem" role="group" aria-label="' + (showMark ? 'Sequence' : 'Shape') + '">' +
        figs(cells, showMark ? 'Step' : 'Shape').join('') + (showMark ? S.cellSvg('?', { label: 'Missing figure' }) : '') + '</div>';
    } else if (q.layout === 'matrix' && q.stem) {
      html = '<div class="stem matrix" role="group" aria-label="3 by 3 grid with one missing cell">' +
        figs(q.stem, 'Cell').join('') + S.cellSvg('?', { label: 'Missing cell' }) + '</div>';
    } else if (q.layout === 'analogy' && q.stem) {
      html = '<div class="stem analogy" role="group" aria-label="First figure is to second figure as third figure is to missing figure">' +
        '<div class="pair">' + S.cellSvg(q.stem[0], { label: 'First figure' }) + '<span class="arrow" aria-hidden="true">&rarr;</span>' + S.cellSvg(q.stem[1], { label: 'Second figure' }) + '</div>' +
        '<div class="pair">' + S.cellSvg(q.stem[2], { label: 'Third figure' }) + '<span class="arrow" aria-hidden="true">&rarr;</span>' + S.cellSvg('?', { label: 'Missing figure' }) + '</div></div>';
    }
    return html;
  }

  // mode: 'run' (answering) | 'review' (marked)
  function optionsHtml(item, mode) {
    var q = item.q, isFig = q.section === 'nonverbal';
    var out = '<div class="options ' + (isFig ? 'figs' : 'text') + '" role="group" aria-label="Answer choices">';
    item.order.forEach(function (origIdx, di) {
      var cls = 'opt', tag = '', locked = (mode === 'review') || item.revealed;
      if (mode === 'review' || item.revealed) {
        if (di === item.correct) { cls += ' right'; tag = '<span class="tag">Correct answer</span>'; }
        else if (di === item.picked) { cls += ' wrong'; tag = '<span class="tag">Your answer</span>'; }
        if (di === item.correct && di === item.picked) { tag = '<span class="tag">Your answer</span>'; }
      } else if (di === item.picked) { cls += ' selected'; }
      var body = isFig ? window.Shapes.cellSvg(q.options[origIdx], { label: 'Option ' + LETTERS[di] }) : '<span>' + esc(q.options[origIdx]) + '</span>';
      out += '<button type="button" class="' + cls + '" data-action="pick" data-i="' + di + '"' +
        (locked ? ' disabled' : '') + ' aria-pressed="' + (di === item.picked ? 'true' : 'false') + '">' +
        '<span class="letter" aria-hidden="true">' + LETTERS[di] + '</span>' + body + tag + '</button>';
    });
    return out + '</div>';
  }

  function questionBody(item, mode) {
    var q = item.q;
    return '<p class="q-prompt">' + esc(q.prompt) + '</p>' + stemHtml(q) + optionsHtml(item, mode);
  }

  // ---- screens ----
  function homeScreen() {
    var counts = { verbal: 0, nonverbal: 0 };
    BANK.forEach(function (q) { counts[q.section] += 1; });
    var attempts = progress.attempts.length;
    return '<h1>Kent Test reasoning practice</h1>' +
      '<p class="lead">Verbal and non-verbal reasoning questions in the style of the Kent Test. Pick a timed mock paper, or practise one question type at a time.</p>' +
      '<div class="grid two">' +
      mockCard('verbal', counts.verbal) + mockCard('nonverbal', counts.nonverbal) +
      '<div class="card stack"><div><h2>Practise by topic</h2><p class="meta">Untimed. You see whether each answer is right straight away, with an explanation.</p></div>' +
      '<button class="btn secondary" data-action="topics" type="button">Choose a topic</button></div>' +
      '<div class="card stack"><div><h2>My progress</h2><p class="meta">' + (attempts ? attempts + ' practice session' + (attempts === 1 ? '' : 's') + ' saved.' : 'Nothing yet. Finish a test and your scores will appear here.') + '</p></div>' +
      '<button class="btn secondary" data-action="progress" type="button">See progress</button></div>' +
      '</div>' +
      (storageOK ? '' : '<p class="notice" style="margin-top:16px">This browser is blocking storage, so your progress will not be saved after you close the page.</p>');
  }

  function mockCard(section, available) {
    var m = MOCKS[section];
    var n = Math.min(m.count, available);
    return '<div class="card stack"><div><h2>' + m.title + ' mock test</h2>' +
      '<p class="meta">' + n + ' questions &middot; ' + m.minutes + ' minutes &middot; timed</p></div>' +
      '<button class="btn" data-action="start-mock" data-section="' + section + '" type="button"' + (n ? '' : ' disabled') + '>Start mock test</button></div>';
  }

  function topicsScreen() {
    var counts = {};
    BANK.forEach(function (q) { counts[q.type] = (counts[q.type] || 0) + 1; });
    function list(sec) {
      return '<div class="card"><h2>' + sectionLabel(sec) + '</h2><ul class="type-list">' +
        window.QUESTION_TYPES[sec].map(function (t) {
          var n = counts[t.id] || 0;
          return '<li><div><strong>' + esc(t.label) + '</strong><div class="meta">' + n + ' questions</div></div>' +
            '<button class="btn small" type="button" data-action="start-topic" data-section="' + sec + '" data-type="' + t.id + '"' + (n ? '' : ' disabled') + '>Practise</button></li>';
        }).join('') + '</ul></div>';
    }
    return '<div class="row between"><h1>Practise by topic</h1><button class="btn secondary small" data-action="home" type="button">Back</button></div>' +
      '<p class="lead">Questions come up in a random order, and the answers are shuffled each time.</p>' +
      '<div class="grid two">' + list('verbal') + list('nonverbal') + '</div>';
  }

  function runScreen() {
    var s = state.session, item = s.items[s.idx], total = s.items.length;
    var isTopic = s.mode === 'topic';
    var title = isTopic ? typeLabel(s.type) : MOCKS[s.section].title + ' mock test';
    var answered = s.items.filter(function (it) { return it.picked !== null; }).length;
    var last = s.idx === total - 1;

    var feedback = '';
    if (isTopic && item.revealed) {
      var ok = item.picked === item.correct;
      feedback = '<div class="feedback ' + (ok ? 'good' : 'bad') + '" role="status"><strong>' + (ok ? 'Correct!' : 'Not quite.') + '</strong>' + esc(item.q.explanation) + '</div>';
    }

    var dots = '';
    if (!isTopic) {
      dots = '<div class="nav-dots" role="group" aria-label="Jump to question">' + s.items.map(function (it, i) {
        return '<button type="button" class="dot' + (it.picked !== null ? ' answered' : '') + (it.flagged ? ' flagged' : '') + (i === s.idx ? ' current' : '') +
          '" data-action="goto" data-i="' + i + '" aria-label="Question ' + (i + 1) + (it.picked !== null ? ', answered' : ', not answered') + (it.flagged ? ', flagged' : '') + '">' + (i + 1) + '</button>';
      }).join('') + '</div>';
    }

    var nextLabel = last ? (isTopic ? 'Finish' : 'Finish test') : 'Next';
    var nextDisabled = isTopic && !item.revealed;
    return '<div class="row between"><div><span class="pill">' + esc(title) + '</span></div>' +
      '<button class="btn danger small" data-action="quit" type="button">Quit</button></div>' +
      '<div class="card" style="margin-top:14px">' +
      '<div class="q-head"><h2>Question ' + (s.idx + 1) + ' of ' + total + '</h2><span class="meta">' + answered + ' answered</span></div>' +
      '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="' + total + '" aria-valuenow="' + (s.idx + 1) + '"><span style="width:' + pct(s.idx + 1, total) + '%"></span></div>' +
      '<div style="margin-top:16px">' + questionBody(item, 'run') + '</div>' + feedback +
      '<div class="footer-nav">' +
      '<button class="btn secondary" data-action="prev" type="button"' + (s.idx === 0 ? ' disabled' : '') + '>Back</button>' +
      (isTopic ? '' : '<button class="btn secondary" data-action="flag" type="button" aria-pressed="' + item.flagged + '">' + (item.flagged ? 'Unflag' : 'Flag for later') + '</button>') +
      '<button class="btn" data-action="next" type="button"' + (nextDisabled ? ' disabled' : '') + '>' + nextLabel + '</button>' +
      '</div>' + dots + '</div>';
  }

  function resultsScreen() {
    var r = state.session.result, s = state.session;
    var byType = Object.keys(r.byType).map(function (t) {
      var c = r.byType[t];
      return '<tr><td>' + esc(typeLabel(t)) + '</td><td class="num">' + c[0] + ' / ' + c[1] + '</td><td style="min-width:90px"><div class="bar ' + (pct(c[0], c[1]) >= 70 ? 'good' : 'bad') + '"><span style="width:' + pct(c[0], c[1]) + '%"></span></div></td></tr>';
    }).join('');
    var items = s.items.filter(function (it) { return !state.onlyMistakes || it.picked !== it.correct; });
    var review = items.map(function (it) {
      var n = s.items.indexOf(it) + 1;
      var status = it.picked === null ? ['bad', 'Not answered'] : it.picked === it.correct ? ['good', 'Correct'] : ['bad', 'Incorrect'];
      return '<div class="review-item"><div class="row between"><h3>Question ' + n + ' <span class="meta">&middot; ' + esc(typeLabel(it.q.type)) + '</span></h3><span class="status ' + status[0] + '">' + status[1] + '</span></div>' +
        questionBody(it, 'review') + '<div class="feedback good"><strong>Explanation</strong>' + esc(it.q.explanation) + '</div></div>';
    }).join('');
    return '<div class="card stack">' +
      '<div><span class="pill">' + esc(s.mode === 'topic' ? typeLabel(s.type) : MOCKS[s.section].title + ' mock test') + '</span>' +
      (r.timedOut ? ' <span class="pill" style="background:var(--warn-soft);color:var(--warn)">Time ran out</span>' : '') + '</div>' +
      '<div><div class="score">' + r.score + ' / ' + r.total + '</div><div class="meta">' + pct(r.score, r.total) + '% correct &middot; time used ' + fmtTime(r.secs) + '</div></div>' +
      (storageOK ? '' : '<p class="notice">Storage is blocked in this browser, so this result was not saved.</p>') +
      (byType ? '<table><thead><tr><th>Question type</th><th>Score</th><th></th></tr></thead><tbody>' + byType + '</tbody></table>' : '') +
      '<div class="row"><button class="btn" data-action="home" type="button">Home</button>' +
      '<button class="btn secondary" data-action="again" type="button">Try again</button>' +
      '<button class="btn secondary" data-action="progress" type="button">My progress</button></div></div>' +
      '<div class="card" style="margin-top:16px"><div class="row between"><h2>Review your answers</h2>' +
      '<label class="meta"><input type="checkbox" data-action="only-mistakes"' + (state.onlyMistakes ? ' checked' : '') + '> Show only mistakes</label></div>' +
      (review || '<p class="meta">No mistakes to show. Well done!</p>') + '</div>';
  }

  function progressScreen() {
    var att = progress.attempts.slice().reverse();
    var agg = {};
    progress.attempts.forEach(function (a) {
      Object.keys(a.byType || {}).forEach(function (t) {
        agg[t] = agg[t] || [0, 0];
        agg[t][0] += a.byType[t][0]; agg[t][1] += a.byType[t][1];
      });
    });
    var types = Object.keys(agg).sort(function (a, b) { return pct(agg[a][0], agg[a][1]) - pct(agg[b][0], agg[b][1]); });
    var weak = types.length ? '<table><thead><tr><th>Question type (weakest first)</th><th>Correct</th><th></th></tr></thead><tbody>' + types.map(function (t) {
      var p = pct(agg[t][0], agg[t][1]);
      return '<tr><td>' + esc(typeLabel(t)) + '</td><td class="num">' + p + '% <span class="meta">(' + agg[t][0] + '/' + agg[t][1] + ')</span></td><td style="min-width:90px"><div class="bar ' + (p >= 70 ? 'good' : 'bad') + '"><span style="width:' + p + '%"></span></div></td></tr>';
    }).join('') + '</tbody></table>' : '<p class="meta">Complete a test or topic to see your strengths and weak spots.</p>';
    var hist = att.length ? '<table><thead><tr><th>Date</th><th>Practice</th><th>Score</th></tr></thead><tbody>' + att.slice(0, 20).map(function (a) {
      var d = new Date(a.ts);
      return '<tr><td>' + esc(d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) + '</td><td>' +
        esc(a.mode === 'topic' ? typeLabel(a.type) : sectionLabel(a.section) + ' mock') + '</td><td class="num">' + a.score + ' / ' + a.total + ' (' + pct(a.score, a.total) + '%)</td></tr>';
    }).join('') + '</tbody></table>' : '<p class="meta">No sessions saved yet.</p>';
    return '<div class="row between"><h1>My progress</h1><button class="btn secondary small" data-action="home" type="button">Back</button></div>' +
      (storageOK ? '' : '<p class="notice">This browser is blocking storage, so progress is only kept until you close the page.</p>') +
      '<div class="stack" style="margin-top:12px"><div class="card"><h2>Strengths and weak spots</h2>' + weak + '</div>' +
      '<div class="card"><h2>Recent sessions</h2>' + hist + '</div>' +
      (att.length ? '<div><button class="btn danger small" data-action="clear" type="button">Clear all progress</button></div>' : '') + '</div>';
  }

  function render() {
    var screens = { home: homeScreen, topics: topicsScreen, run: runScreen, results: resultsScreen, progress: progressScreen };
    $app.innerHTML = screens[state.screen]();
    window.scrollTo(0, 0);
    $app.focus({ preventScroll: true });
  }

  // re-render only the question card contents when an option is picked, keeping scroll position
  function rerenderKeepScroll() {
    var y = window.scrollY;
    $app.innerHTML = runScreen();
    window.scrollTo(0, y);
  }

  // ---- finishing and marking ----
  function finish(timedOut) {
    var s = state.session;
    if (!s || s.result) { return; }
    var byType = {}, score = 0;
    s.items.forEach(function (it) {
      var t = it.q.type;
      byType[t] = byType[t] || [0, 0];
      byType[t][1] += 1;
      if (it.picked === it.correct) { byType[t][0] += 1; score += 1; }
    });
    var secs = Math.min((Date.now() - s.startedAt) / 1000, s.limitSec || Infinity);
    s.result = { score: score, total: s.items.length, byType: byType, secs: secs, timedOut: !!timedOut };
    stopTimer();
    progress.attempts.push({ ts: Date.now(), mode: s.mode, section: s.section, type: s.type, score: score, total: s.items.length, secs: Math.round(secs), byType: byType });
    if (progress.attempts.length > MAX_ATTEMPTS) { progress.attempts = progress.attempts.slice(-MAX_ATTEMPTS); }
    saveProgress();
    state.screen = 'results';
    state.onlyMistakes = false;
    render();
  }

  function goHome() { stopTimer(); state.session = null; state.screen = 'home'; render(); }

  function pick(di) {
    var s = state.session; if (!s || state.screen !== 'run') { return; }
    var item = s.items[s.idx];
    if (item.revealed) { return; }
    item.picked = di;
    if (s.mode === 'topic') { item.revealed = true; }
    rerenderKeepScroll();
  }

  function next() {
    var s = state.session; var item = s.items[s.idx];
    if (s.mode === 'topic' && !item.revealed) { return; }
    if (s.idx < s.items.length - 1) { s.idx += 1; render(); return; }
    var unanswered = s.items.filter(function (it) { return it.picked === null; }).length;
    if (s.mode === 'mock' && unanswered && !window.confirm('You have ' + unanswered + ' unanswered question' + (unanswered === 1 ? '' : 's') + '. Finish the test anyway?')) { return; }
    finish(false);
  }

  // ---- events ----
  $app.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action]');
    if (!el || el.disabled) { return; }
    var a = el.getAttribute('data-action'), s = state.session;
    if (a === 'home') { goHome(); }
    else if (a === 'topics') { state.screen = 'topics'; render(); }
    else if (a === 'progress') { stopTimer(); state.screen = 'progress'; render(); }
    else if (a === 'start-mock') { var sec = el.getAttribute('data-section'); startSession({ mode: 'mock', section: sec, count: MOCKS[sec].count, minutes: MOCKS[sec].minutes }); }
    else if (a === 'start-topic') { startSession({ mode: 'topic', section: el.getAttribute('data-section'), type: el.getAttribute('data-type') }); }
    else if (a === 'pick') { pick(parseInt(el.getAttribute('data-i'), 10)); }
    else if (a === 'next') { next(); }
    else if (a === 'prev') { if (s.idx > 0) { s.idx -= 1; render(); } }
    else if (a === 'goto') { s.idx = parseInt(el.getAttribute('data-i'), 10); render(); }
    else if (a === 'flag') { s.items[s.idx].flagged = !s.items[s.idx].flagged; rerenderKeepScroll(); }
    else if (a === 'quit') { if (window.confirm('Leave this practice? Your answers so far will not be saved.')) { goHome(); } }
    else if (a === 'again') { var o = { mode: s.mode, section: s.section, type: s.type }; if (s.mode === 'mock') { o.count = MOCKS[s.section].count; o.minutes = MOCKS[s.section].minutes; } startSession(o); }
    else if (a === 'clear') { if (window.confirm('Delete all saved progress on this device?')) { progress = { attempts: [] }; saveProgress(); render(); } }
  });

  $app.addEventListener('change', function (e) {
    if (e.target.getAttribute('data-action') === 'only-mistakes') {
      state.onlyMistakes = e.target.checked;
      var y = window.scrollY; $app.innerHTML = resultsScreen(); window.scrollTo(0, y);
      var cb = $app.querySelector('[data-action="only-mistakes"]'); if (cb) { cb.focus(); }
    }
  });

  document.querySelector('.brand').addEventListener('click', function () {
    if (state.screen === 'run' && !window.confirm('Leave this practice? Your answers so far will not be saved.')) { return; }
    goHome();
  });

  // keyboard shortcuts while answering: A-E or 1-5 pick, Enter/right arrow next, left arrow back
  document.addEventListener('keydown', function (e) {
    if (state.screen !== 'run' || e.ctrlKey || e.metaKey || e.altKey) { return; }
    var tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') { return; }
    var s = state.session, item = s.items[s.idx], k = e.key.toUpperCase(), i = LETTERS.indexOf(k);
    if (i < 0 && /^[1-5]$/.test(k)) { i = parseInt(k, 10) - 1; }
    if (i >= 0 && i < item.order.length) { pick(i); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { next(); }
    else if (e.key === 'ArrowLeft' && s.idx > 0) { s.idx -= 1; render(); }
  });

  window.addEventListener('beforeunload', function (e) {
    if (state.screen === 'run' && state.session && state.session.mode === 'mock') { e.preventDefault(); e.returnValue = ''; }
  });

  // expose pure helpers for tests
  window.__kent = { buildSession: buildSession, BANK: BANK };

  render();
})();
