/* shapes.js - draws non-verbal reasoning figures as inline SVG.
 *
 * A "cell" is either one item or an array of items.
 * An item is { s: shape, f: fill, r: rotation (deg, clockwise), z: scale, x, y, fl: mirror }.
 * Coordinates are in a 100x100 box centred on (0,0) -> x,y range roughly -50..50.
 */
(function (root) {
  'use strict';

  var INK = '#1c2340';
  var FILLS = { black: INK, white: '#ffffff', grey: '#aab1c8', none: 'none' };

  function polar(n, radius, startDeg) {
    var pts = [];
    for (var i = 0; i < n; i++) {
      var a = (startDeg + (360 / n) * i) * Math.PI / 180;
      pts.push((radius * Math.cos(a)).toFixed(1) + ',' + (radius * Math.sin(a)).toFixed(1));
    }
    return pts.join(' ');
  }

  function star() {
    var pts = [];
    for (var i = 0; i < 10; i++) {
      var rad = i % 2 === 0 ? 32 : 13;
      var a = (-90 + 36 * i) * Math.PI / 180;
      pts.push((rad * Math.cos(a)).toFixed(1) + ',' + (rad * Math.sin(a)).toFixed(1));
    }
    return pts.join(' ');
  }

  // Shape outlines are drawn about (0,0), roughly 60 units across at scale 1.
  var SHAPES = {
    circle:   function (a) { return '<circle r="30" ' + a + '/>'; },
    square:   function (a) { return '<rect x="-26" y="-26" width="52" height="52" ' + a + '/>'; },
    triangle: function (a) { return '<polygon points="0,-30 30,24 -30,24" ' + a + '/>'; },
    diamond:  function (a) { return '<polygon points="0,-32 24,0 0,32 -24,0" ' + a + '/>'; },
    pentagon: function (a) { return '<polygon points="' + polar(5, 31, -90) + '" ' + a + '/>'; },
    hexagon:  function (a) { return '<polygon points="' + polar(6, 31, 0) + '" ' + a + '/>'; },
    star:     function (a) { return '<polygon points="' + star() + '" ' + a + '/>'; },
    cross:    function (a) { return '<polygon points="-10,-30 10,-30 10,-10 30,-10 30,10 10,10 10,30 -10,30 -10,10 -30,10 -30,-10 -10,-10" ' + a + '/>'; },
    arrow:    function (a) { return '<polygon points="0,-32 22,-4 8,-4 8,30 -8,30 -8,-4 -22,-4" ' + a + '/>'; },
    // Chiral shapes: used for rotation and reflection questions.
    L:        function (a) { return '<polygon points="-20,-30 -4,-30 -4,14 20,14 20,30 -20,30" ' + a + '/>'; },
    flag:     function (a) { return '<polygon points="-16,-30 -10,-30 -10,-26 22,-14 -10,-2 -10,30 -16,30" ' + a + '/>'; }
  };

  function itemSvg(it) {
    var draw = SHAPES[it.s];
    if (!draw) { throw new Error('Unknown shape: ' + it.s); }
    var fill = FILLS[it.f === undefined ? 'white' : it.f];
    if (fill === undefined) { throw new Error('Unknown fill: ' + it.f); }
    var z = it.z === undefined ? 1 : it.z;
    var attrs = 'fill="' + fill + '" stroke="' + INK + '" stroke-width="' + (3 / Math.max(z, 0.3)).toFixed(2) + '" stroke-linejoin="round"';
    var t = 'translate(' + (it.x || 0) + ' ' + (it.y || 0) + ') rotate(' + (it.r || 0) + ') scale(' + (it.fl ? -z : z) + ' ' + z + ')';
    return '<g transform="' + t + '">' + draw(attrs) + '</g>';
  }

  function cellItems(cell) {
    return Array.isArray(cell) ? cell : [cell];
  }

  // Returns an <svg> string for one cell, or a "?" box for the missing cell.
  function cellSvg(cell, opts) {
    opts = opts || {};
    var label = opts.label || 'Figure';
    var body;
    if (cell === '?') {
      body = '<rect x="-46" y="-46" width="92" height="92" rx="8" fill="#ffffff" stroke="' + INK +
             '" stroke-width="3" stroke-dasharray="7 6"/>' +
             '<text x="0" y="14" text-anchor="middle" font-size="42" font-weight="700" fill="' + INK + '">?</text>';
    } else {
      body = '<rect x="-48" y="-48" width="96" height="96" rx="8" fill="#ffffff" stroke="#c9cfe4" stroke-width="2"/>' +
             cellItems(cell).map(itemSvg).join('');
    }
    return '<svg class="fig" viewBox="-50 -50 100 100" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg">' + body + '</svg>';
  }

  // Throws if the cell contains an unknown shape or fill. Used by the validator.
  function checkCell(cell) {
    if (cell === '?') { return; }
    cellItems(cell).forEach(itemSvg);
  }

  root.Shapes = { cellSvg: cellSvg, checkCell: checkCell, SHAPE_NAMES: Object.keys(SHAPES) };
  if (typeof module !== 'undefined' && module.exports) { module.exports = root.Shapes; }
})(typeof window !== 'undefined' ? window : globalThis);
