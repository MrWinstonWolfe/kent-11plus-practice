/* Run with: node validate.js
 * Checks the question bank is well formed. Exits non-zero on any problem.
 */
'use strict';
var path = require('path');
var Shapes = require('./shapes.js');
var bank = require('./questions.js');
var Q = bank.QUESTIONS;
var TYPES = bank.QUESTION_TYPES;

var problems = [];
function bad(q, msg) { problems.push((q.id || '?') + ': ' + msg); }

var seen = {};
var validTypes = {};
Object.keys(TYPES).forEach(function (sec) { TYPES[sec].forEach(function (t) { validTypes[t.id] = sec; }); });

Q.forEach(function (q) {
  if (seen[q.id]) { bad(q, 'duplicate id'); }
  seen[q.id] = true;
  if (validTypes[q.type] !== q.section) { bad(q, 'type "' + q.type + '" does not belong to section "' + q.section + '"'); }
  if (!q.prompt || !q.prompt.trim()) { bad(q, 'empty prompt'); }
  if (!q.explanation || !q.explanation.trim()) { bad(q, 'empty explanation'); }
  if (!Array.isArray(q.options) || q.options.length < 4 || q.options.length > 5) { bad(q, 'needs 4-5 options'); return; }
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) { bad(q, 'answer index out of range'); }

  if (q.section === 'verbal') {
    var uniq = {};
    q.options.forEach(function (o) {
      if (typeof o !== 'string' || !o) { bad(q, 'verbal option must be a non-empty string'); }
      if (uniq[o]) { bad(q, 'duplicate option "' + o + '"'); }
      uniq[o] = true;
    });
  } else {
    if (['none', 'row', 'matrix', 'analogy'].indexOf(q.layout) < 0) { bad(q, 'bad layout ' + q.layout); }
    if (q.layout === 'matrix' && (!q.stem || q.stem.length !== 8)) { bad(q, 'matrix needs 8 stem cells'); }
    if (q.layout === 'analogy' && (!q.stem || q.stem.length !== 3)) { bad(q, 'analogy needs 3 stem cells'); }
    if ((q.layout === 'row') && (!q.stem || q.stem.length < 1)) { bad(q, 'row layout needs stem cells'); }
    var cells = (q.stem || []).concat(q.options);
    cells.forEach(function (c) { try { Shapes.checkCell(c); } catch (e) { bad(q, e.message); } });
    var keys = q.options.map(function (o) { return Shapes.cellSvg(o); });
    if (q.type === 'nv-odd') {
      // Four figures must look the same and the marked answer must be the single different one.
      var odd = keys.filter(function (k, i) { return keys.filter(function (k2) { return k2 === k; }).length === 1; });
      var oddIdx = keys.map(function (k, i) { return keys.filter(function (k2) { return k2 === k; }).length === 1 ? i : -1; }).filter(function (i) { return i >= 0; });
      if (oddIdx.length !== 1) { bad(q, 'odd-one-out needs exactly one different figure (found ' + oddIdx.length + ')'); }
      else if (oddIdx[0] !== q.answer) { bad(q, 'marked answer is ' + q.answer + ' but the different figure is ' + oddIdx[0]); }
    } else {
      // every option must render differently from every other
      var rendered = {};
      keys.forEach(function (key, i) {
        if (rendered[key] !== undefined) { bad(q, 'options ' + rendered[key] + ' and ' + i + ' look identical'); }
        rendered[key] = i;
      });
    }
  }
});

// quota summary
var counts = {};
Q.forEach(function (q) { counts[q.type] = (counts[q.type] || 0) + 1; });
Object.keys(validTypes).forEach(function (t) {
  if (!counts[t]) { problems.push('no questions for type ' + t); }
});

console.log('Questions: ' + Q.length + ' (verbal ' + Q.filter(function (q) { return q.section === 'verbal'; }).length +
            ', non-verbal ' + Q.filter(function (q) { return q.section === 'nonverbal'; }).length + ')');
console.log(JSON.stringify(counts));
var dist = [0, 0, 0, 0, 0];
Q.forEach(function (q) { dist[q.answer] += 1; });
console.log('Correct-answer position spread (A..E, before shuffling): ' + dist.join(', '));

if (problems.length) {
  console.error('\nPROBLEMS (' + problems.length + '):');
  problems.forEach(function (p) { console.error(' - ' + p); });
  process.exit(1);
}
console.log('OK: no problems found.');
