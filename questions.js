/* questions.js - original 11+ style practice questions (verbal + non-verbal reasoning).
 *
 * These are NOT official GL Assessment papers. They are written to practise the same
 * question styles that the Kent Test uses.
 *
 * Verbal helper:    v(type, prompt, options[], correctAnswerText, explanation)
 * Non-verbal helper nv(type, prompt, layout, stem[], options[], correctIndex, explanation)
 *   layout: 'none' (options only) | 'row' (sequence / single figure) | 'matrix' (3x3 grid) | 'analogy' (A -> B, C -> ?)
 */
(function (root) {
  'use strict';

  var Q = [];
  var counter = { verbal: 0, nonverbal: 0 };

  function nextId(section) {
    counter[section] += 1;
    return (section === 'verbal' ? 'V' : 'N') + String(counter[section]).padStart(3, '0');
  }

  function v(type, prompt, options, answerText, explanation) {
    var idx = options.indexOf(answerText);
    if (idx < 0) { throw new Error('Verbal answer not in options: ' + prompt); }
    Q.push({ id: nextId('verbal'), section: 'verbal', type: type, prompt: prompt, options: options, answer: idx, explanation: explanation });
  }

  function nv(type, prompt, layout, stem, options, answer, explanation) {
    Q.push({ id: nextId('nonverbal'), section: 'nonverbal', type: type, prompt: prompt, layout: layout, stem: stem, options: options, answer: answer, explanation: explanation });
  }

  // ---- figure helpers ----
  function I(s, f, r, z, x, y, fl) {
    return { s: s, f: f || 'white', r: r || 0, z: z === undefined ? 1 : z, x: x || 0, y: y || 0, fl: !!fl };
  }
  // n small copies of one shape in a row
  function row(n, s, f) {
    var items = [];
    for (var i = 0; i < n; i++) { items.push(I(s, f, 0, 0.3, (i - (n - 1) / 2) * 19, 0)); }
    return items;
  }
  function arrow(r, f, z) { return I('arrow', f || 'black', r, z === undefined ? 0.9 : z); }
  function L(r, fl) { return I('L', 'black', r, 0.9, 0, 0, fl); }
  function flag(r, fl) { return I('flag', 'black', r, 0.9, 0, 0, fl); }
  function corner(x, y) { return I('circle', 'black', 0, 0.4, x, y); }

  // =====================================================================
  // VERBAL REASONING
  // =====================================================================

  // ---- Number sequences ----
  v('nseq', 'What number comes next?  2, 4, 6, 8, ?', ['9', '10', '11', '12', '14'], '10', 'The numbers go up by 2 each time, so 8 + 2 = 10.');
  v('nseq', 'What number comes next?  3, 6, 12, 24, ?', ['30', '36', '48', '27', '42'], '48', 'Each number is doubled: 24 x 2 = 48.');
  v('nseq', 'What number comes next?  50, 45, 40, 35, ?', ['25', '32', '30', '28', '34'], '30', 'The numbers go down by 5 each time, so 35 - 5 = 30.');
  v('nseq', 'What number comes next?  1, 4, 9, 16, ?', ['20', '24', '36', '25', '32'], '25', 'These are square numbers: 1x1, 2x2, 3x3, 4x4, so the next is 5x5 = 25.');
  v('nseq', 'What number comes next?  2, 3, 5, 8, 12, ?', ['15', '16', '17', '18', '20'], '17', 'The gaps grow by 1 each time: +1, +2, +3, +4, so the next gap is +5. 12 + 5 = 17.');
  v('nseq', 'What number comes next?  100, 91, 82, 73, ?', ['62', '64', '65', '63', '66'], '64', 'The numbers go down by 9 each time: 73 - 9 = 64.');
  v('nseq', 'What number comes next?  1, 2, 4, 7, 11, ?', ['14', '15', '16', '17', '18'], '16', 'The gaps grow by 1 each time: +1, +2, +3, +4, so the next gap is +5. 11 + 5 = 16.');
  v('nseq', 'What number comes next?  81, 27, 9, 3, ?', ['0', '1', '2', '6', '1.5'], '1', 'Each number is divided by 3: 3 / 3 = 1.');

  // ---- Letter sequences ----
  v('lseq', 'Which letter comes next?  A, C, E, G, ?', ['H', 'I', 'J', 'K', 'L'], 'I', 'The letters skip one letter each time (they go up by 2 places). After G comes I.');
  v('lseq', 'Which letter comes next?  Z, X, V, T, ?', ['S', 'Q', 'R', 'P', 'U'], 'R', 'The letters go backwards, missing one letter each time. After T comes R.');
  v('lseq', 'Which letter comes next?  B, D, G, K, ?', ['N', 'O', 'P', 'Q', 'R'], 'P', 'The jumps grow by 1: +2, +3, +4, so the next jump is +5. K is the 11th letter, so the next is the 16th letter, P.');
  v('lseq', 'Which pair comes next?  AZ, BY, CX, DW, ?', ['EV', 'EU', 'FV', 'DV', 'EW'], 'EV', 'The first letter goes forward (A, B, C, D, E) while the second goes backward (Z, Y, X, W, V).');
  v('lseq', 'Which letter comes next?  M, N, P, S, ?', ['T', 'U', 'V', 'W', 'X'], 'W', 'The jumps grow by 1: +1, +2, +3, so the next jump is +4. S is the 19th letter; the 23rd letter is W.');
  v('lseq', 'Which letter comes next?  C, F, I, L, ?', ['M', 'N', 'O', 'P', 'Q'], 'O', 'Each letter is 3 places after the one before. L + 3 places = O.');
  v('lseq', 'Which pair comes next?  YB, WD, UF, SH, ?', ['QJ', 'RJ', 'QK', 'PJ', 'QI'], 'QJ', 'The first letter goes back 2 each time (Y, W, U, S, Q) and the second goes forward 2 (B, D, F, H, J).');
  v('lseq', 'Which letter comes next?  T, S, Q, N, ?', ['K', 'L', 'M', 'J', 'I'], 'J', 'The jumps backward grow by 1: -1, -2, -3, so the next is -4. N is the 14th letter; the 10th letter is J.');

  // ---- Analogies ----
  v('analogy', 'Hot is to cold as up is to ...', ['high', 'down', 'under', 'top', 'left'], 'down', 'Hot and cold are opposites. The opposite of up is down.');
  v('analogy', 'Bird is to nest as bee is to ...', ['honey', 'hive', 'flower', 'sting', 'wing'], 'hive', 'A nest is where a bird lives. A hive is where bees live.');
  v('analogy', 'Finger is to hand as toe is to ...', ['shoe', 'nail', 'foot', 'leg', 'sock'], 'foot', 'A finger is part of a hand. A toe is part of a foot.');
  v('analogy', 'Teacher is to school as doctor is to ...', ['patient', 'hospital', 'medicine', 'nurse', 'ill'], 'hospital', 'A teacher works in a school. A doctor works in a hospital.');
  v('analogy', 'Puppy is to dog as kitten is to ...', ['cat', 'mouse', 'fur', 'tiger', 'milk'], 'cat', 'A puppy is a young dog. A kitten is a young cat.');
  v('analogy', 'Pen is to write as knife is to ...', ['sharp', 'cut', 'fork', 'butter', 'kitchen'], 'cut', 'A pen is used to write. A knife is used to cut.');
  v('analogy', 'Painter is to painting as sculptor is to ...', ['brush', 'gallery', 'statue', 'clay', 'artist'], 'statue', 'A painter makes a painting. A sculptor makes a statue.');
  v('analogy', 'Day is to night as summer is to ...', ['sun', 'winter', 'autumn', 'hot', 'holiday'], 'winter', 'Day and night are opposites. The opposite season to summer is winter.');

  // ---- Odd one out ----
  v('odd', 'Which word is the odd one out?', ['apple', 'banana', 'carrot', 'orange', 'pear'], 'carrot', 'Apple, banana, orange and pear are fruits. A carrot is a vegetable.');
  v('odd', 'Which word is the odd one out?', ['London', 'Paris', 'Rome', 'Spain', 'Berlin'], 'Spain', 'London, Paris, Rome and Berlin are capital cities. Spain is a country.');
  v('odd', 'Which word is the odd one out?', ['red', 'blue', 'green', 'table', 'yellow'], 'table', 'Red, blue, green and yellow are colours. A table is not.');
  v('odd', 'Which word is the odd one out?', ['dog', 'cat', 'horse', 'hammer', 'rabbit'], 'hammer', 'Dog, cat, horse and rabbit are animals. A hammer is a tool.');
  v('odd', 'Which number is the odd one out?', ['12', '18', '24', '31', '36'], '31', '12, 18, 24 and 36 are all in the 6 times table. 31 is not.');
  v('odd', 'Which word is the odd one out?', ['square', 'triangle', 'circle', 'cube', 'hexagon'], 'cube', 'Square, triangle, circle and hexagon are flat (2D) shapes. A cube is a solid (3D) shape.');
  v('odd', 'Which word is the odd one out?', ['Monday', 'Friday', 'April', 'Sunday', 'Tuesday'], 'April', 'Monday, Friday, Sunday and Tuesday are days of the week. April is a month.');
  v('odd', 'Which word is the odd one out?', ['oak', 'ash', 'rose', 'elm', 'birch'], 'rose', 'Oak, ash, elm and birch are trees. A rose is a flower.');

  // ---- Word codes ----
  v('code', 'In a code, CAT is written as DBU. What is the code for DOG?', ['EPH', 'DPH', 'EOH', 'EPG', 'FPH'], 'EPH', 'Each letter moves one place forward in the alphabet: D->E, O->P, G->H.');
  v('code', 'If A = 1, B = 2, C = 3 and so on, what is the total value of the letters in CAB?', ['5', '6', '7', '8', '9'], '6', 'C = 3, A = 1, B = 2, and 3 + 1 + 2 = 6.');
  v('code', 'In a code, BED is written as DGF. What is the code for CAB?', ['ECD', 'DCE', 'ECE', 'EDC', 'CEA'], 'ECD', 'Each letter moves two places forward: B->D, E->G, D->F. So C->E, A->C, B->D.');
  v('code', 'In a code, FISH is written as GJTI. What is the code for LAMB?', ['MBNC', 'KZLA', 'MANC', 'MBMC', 'NCOD'], 'MBNC', 'Each letter moves one place forward: L->M, A->B, M->N, B->C.');
  v('code', 'In a code, PLAN is written as OKZM. What is the code for TIME?', ['SHLD', 'UJNF', 'SHKD', 'RGLD', 'SILD'], 'SHLD', 'Each letter moves one place backward: T->S, I->H, M->L, E->D.');
  v('code', 'In a code, BOAT is written as TAOB. What is the code for FISH?', ['HSIF', 'HISF', 'FISH', 'SHIF', 'HSFI'], 'HSIF', 'The letters are written in reverse order. FISH backwards is HSIF.');
  v('code', 'If A = 1, B = 2, C = 3 and so on, what is the total value of the letters in FACE?', ['13', '14', '15', '16', '17'], '15', 'F = 6, A = 1, C = 3, E = 5, and 6 + 1 + 3 + 5 = 15.');
  v('code', 'In a code, TEN is written as UFO and ONE is written as POF. What is the code for TWO?', ['UXP', 'SVN', 'UWP', 'UXO', 'VYQ'], 'UXP', 'Each letter moves one place forward: T->U, W->X, O->P.');

  // ---- Hidden words ----
  v('hidden', 'A four-letter word is hidden at the end of one word and the start of the next. Find it.\n"Put it on the attic shelf."', ['HEAT', 'HATE', 'TICK', 'SHED', 'LATE'], 'HEAT', 'The words "the attic" contain tHE ATtic, so the hidden word is HEAT.');
  v('hidden', 'A four-letter word is hidden at the end of one word and the start of the next. Find it.\n"I wish other people would help."', ['SHOT', 'SHIP', 'HOST', 'DISH', 'THEM'], 'SHOT', 'The words "wish other" contain wiSH OTher, so the hidden word is SHOT.');
  v('hidden', 'A four-letter word is hidden at the end of one word and the start of the next. Find it.\n"The wolf ate acorns."', ['GATE', 'MATE', 'FATE', 'RATE', 'FEAT'], 'FATE', 'The words "wolf ate" contain wolF ATE, so the hidden word is FATE.');
  v('hidden', 'A four-letter word is hidden at the end of one word and the start of the next. Find it.\n"The mast arm broke."', ['STAR', 'SLAM', 'ARMS', 'TEAR', 'RAMS'], 'STAR', 'The words "mast arm" contain maST ARm, so the hidden word is STAR.');
  v('hidden', 'A four-letter word is hidden at the end of one word and the start of the next. Find it.\n"I like taco at lunch."', ['GOAT', 'BOAT', 'CAST', 'COAT', 'TOLL'], 'COAT', 'The words "taco at" contain taCO AT, so the hidden word is COAT.');
  v('hidden', 'A four-letter word is hidden at the end of one word and the start of the next. Find it.\n"I hop early each day."', ['HEAR', 'FEAR', 'NEAR', 'PEAR', 'TEAR'], 'PEAR', 'The words "hop early" contain hoP EARly, so the hidden word is PEAR.');
  v('hidden', 'A four-letter word is hidden at the end of one word and the start of the next. Find it.\n"The cats now ran off."', ['SHOW', 'SNOW', 'STOW', 'BLOW', 'GLOW'], 'SNOW', 'The words "cats now" contain catS NOW, so the hidden word is SNOW.');
  v('hidden', 'A four-letter word is hidden at the end of one word and the start of the next. Find it.\n"We ate peas and carrots."', ['HAND', 'LAND', 'BAND', 'SAND', 'WAND'], 'SAND', 'The words "peas and" contain peaS AND, so the hidden word is SAND.');

  // ---- Compound words ----
  v('compound', 'Which word can be added to the end of FOOT to make a new word?', ['ball', 'table', 'window', 'chair', 'cloud'], 'ball', 'Football is a word. The other choices do not make real words with foot.');
  v('compound', 'Which word can be added to the end of RAIN to make a new word?', ['bow', 'chair', 'table', 'shoe', 'pen'], 'bow', 'Rainbow is a word. The other choices do not make real words with rain.');
  v('compound', 'Which word can be added to the end of SNOW to make a new word?', ['man', 'desk', 'plate', 'door', 'cup'], 'man', 'Snowman is a word. The other choices do not make real words with snow.');
  v('compound', 'Which word can be added to the start of FISH to make a new word?', ['gold', 'table', 'door', 'cup', 'shoe'], 'gold', 'Goldfish is a word. The other choices do not make real words with fish.');
  v('compound', 'Which word can be added to the start of HOUSE to make a new word?', ['green', 'tall', 'wide', 'soft', 'cold'], 'green', 'Greenhouse is a word. The other choices do not make real words with house.');
  v('compound', 'Which word can be added to the start of BOARD to make a new word?', ['key', 'door', 'sun', 'tree', 'shoe'], 'key', 'Keyboard is a word. The other choices do not make real words with board.');
  v('compound', 'Which word can be added to the end of SUN to make a new word?', ['set', 'tree', 'bag', 'pen', 'door'], 'set', 'Sunset is a word. The other choices do not make real words with sun.');
  v('compound', 'Which word can be added to the end of AIR to make a new word?', ['port', 'table', 'tree', 'desk', 'cup'], 'port', 'Airport is a word. The other choices do not make real words with air.');

  // ---- Logic and reasoning ----
  v('logic', 'Tom is taller than Sam. Sam is taller than Ben. Who is the shortest?', ['Tom', 'Sam', 'Ben', 'Tom and Sam are the same', 'It cannot be known'], 'Ben', 'Tom > Sam > Ben, so Ben is the shortest.');
  v('logic', 'Anna is older than Beth. Beth is older than Cara. Who is the second oldest?', ['Anna', 'Beth', 'Cara', 'Anna and Beth', 'It cannot be known'], 'Beth', 'Anna is oldest, then Beth, then Cara, so Beth is second oldest.');
  v('logic', 'All dogs have tails. Rex is a dog. Which statement must be true?', ['Rex has a tail', 'Rex is a puppy', 'Rex can swim', 'All animals have tails', 'Rex is brown'], 'Rex has a tail', 'Every dog has a tail and Rex is a dog, so Rex must have a tail. Nothing else is stated.');
  v('logic', 'Town A is east of town B. Town B is east of town C. Which town is furthest west?', ['A', 'B', 'C', 'A and B', 'It cannot be known'], 'C', 'Going from west to east the order is C, B, A. C is furthest west.');
  v('logic', 'Sam is 3rd from the front in a queue of 8 children. What place is Sam from the back?', ['3rd', '4th', '5th', '6th', '7th'], '6th', 'There are 2 children in front of Sam and 5 behind. 5 + 1 = 6, so Sam is 6th from the back.');
  v('logic', 'If today is Wednesday, what day was it 3 days ago?', ['Saturday', 'Sunday', 'Monday', 'Friday', 'Tuesday'], 'Sunday', 'Counting back from Wednesday: Tuesday, Monday, Sunday.');
  v('logic', 'In a row, the red car is left of the blue car. The blue car is left of the green car. The green car is left of the yellow car. Which car is second from the left?', ['Red', 'Blue', 'Green', 'Yellow', 'It cannot be known'], 'Blue', 'From left to right the order is red, blue, green, yellow, so blue is second.');
  v('logic', 'A bus leaves at 9:45 and the journey takes 1 hour 30 minutes. When does it arrive?', ['10:75', '11:00', '11:15', '11:30', '10:45'], '11:15', '9:45 + 1 hour = 10:45, and + 30 minutes = 11:15.');

  // =====================================================================
  // NON-VERBAL REASONING
  // =====================================================================

  // ---- Odd one out ----
  var NV_ODD = 'Which figure is the odd one out?';
  nv('nv-odd', NV_ODD, 'none', null,
    [I('circle', 'white'), I('circle', 'white'), I('square', 'white'), I('circle', 'white'), I('circle', 'white')], 2,
    'Four of the shapes are circles. The odd one out is the square.');
  nv('nv-odd', NV_ODD, 'none', null,
    [I('star', 'black'), I('star', 'white'), I('star', 'black'), I('star', 'black'), I('star', 'black')], 1,
    'Four of the stars are black. The odd one out is the white star.');
  nv('nv-odd', NV_ODD, 'none', null,
    [I('triangle', 'grey'), I('triangle', 'grey'), I('triangle', 'grey'), I('triangle', 'grey', 180), I('triangle', 'grey')], 3,
    'Four of the triangles point up. The odd one out points down.');
  nv('nv-odd', NV_ODD, 'none', null,
    [row(3, 'square', 'black'), row(2, 'square', 'black'), row(2, 'square', 'black'), row(2, 'square', 'black'), row(2, 'square', 'black')], 0,
    'Four of the figures have two squares. The odd one out has three squares.');
  nv('nv-odd', NV_ODD, 'none', null,
    [I('hexagon', 'white'), I('hexagon', 'white'), I('hexagon', 'white'), I('hexagon', 'white'), I('pentagon', 'white')], 4,
    'Four of the shapes have six sides. The odd one out is the pentagon, which has five sides.');
  nv('nv-odd', NV_ODD, 'none', null,
    [[I('square', 'white', 0, 1), I('circle', 'black', 0, 0.4)], [I('square', 'white', 0, 1), I('circle', 'black', 0, 0.4)],
     [I('square', 'white', 0, 1), I('circle', 'white', 0, 0.4)], [I('square', 'white', 0, 1), I('circle', 'black', 0, 0.4)],
     [I('square', 'white', 0, 1), I('circle', 'black', 0, 0.4)]], 2,
    'Four of the figures have a black circle inside the square. The odd one out has a white circle.');
  nv('nv-odd', NV_ODD, 'none', null,
    [arrow(90), arrow(90), arrow(90), arrow(270), arrow(90)], 3,
    'Four of the arrows point right. The odd one out points left.');
  nv('nv-odd', NV_ODD, 'none', null,
    [[I('circle', 'white', 0, 0.45, -18, 0), I('triangle', 'black', 0, 0.45, 18, 0)],
     [I('triangle', 'black', 0, 0.45, -18, 0), I('circle', 'white', 0, 0.45, 18, 0)],
     [I('circle', 'white', 0, 0.45, -18, 0), I('triangle', 'black', 0, 0.45, 18, 0)],
     [I('circle', 'white', 0, 0.45, -18, 0), I('triangle', 'black', 0, 0.45, 18, 0)],
     [I('circle', 'white', 0, 0.45, -18, 0), I('triangle', 'black', 0, 0.45, 18, 0)]], 1,
    'Four of the figures have the circle on the left and the triangle on the right. In the odd one out they have swapped places.');

  // ---- Sequences ----
  var NV_SEQ = 'Which figure comes next in the sequence?';
  nv('nv-seq', NV_SEQ, 'row', [arrow(0), arrow(90), arrow(180)],
    [arrow(90), arrow(270), arrow(0), arrow(180), arrow(45)], 1,
    'The arrow turns 90 degrees clockwise each time, so after pointing down it points left.');
  nv('nv-seq', NV_SEQ, 'row', [I('circle', 'black', 0, 0.4), I('circle', 'black', 0, 0.6), I('circle', 'black', 0, 0.8)],
    [I('circle', 'black', 0, 0.4), I('circle', 'black', 0, 0.6), I('circle', 'black', 0, 1.0), I('circle', 'black', 0, 1.2), I('circle', 'black', 0, 0.8)], 2,
    'The circle gets a little bigger each time, so the next circle is the next size up.');
  nv('nv-seq', NV_SEQ, 'row', [row(1, 'circle', 'black'), row(2, 'circle', 'black'), row(3, 'circle', 'black')],
    [row(5, 'circle', 'black'), row(3, 'circle', 'black'), row(4, 'circle', 'black'), row(2, 'circle', 'black'), row(1, 'circle', 'black')], 2,
    'One more circle is added each time: 1, 2, 3, so the next figure has 4 circles.');
  nv('nv-seq', NV_SEQ, 'row', [I('square', 'black'), I('square', 'white'), I('square', 'black'), I('square', 'white')],
    [I('square', 'white'), I('square', 'grey'), I('circle', 'black'), I('square', 'black'), I('circle', 'white')], 3,
    'The square swaps between black and white each time, so after white comes black.');
  nv('nv-seq', NV_SEQ, 'row', [I('circle'), I('square'), I('triangle'), I('circle'), I('square')],
    [I('circle'), I('diamond'), I('star'), I('triangle'), I('square')], 3,
    'The shapes repeat in the order circle, square, triangle, so after the square comes the triangle.');
  nv('nv-seq', NV_SEQ, 'row', [arrow(0), arrow(45), arrow(90), arrow(135)],
    [arrow(225), arrow(90), arrow(180), arrow(0), arrow(135)], 2,
    'The arrow turns 45 degrees clockwise each time, so after 135 degrees comes 180 degrees (pointing down).');
  nv('nv-seq', NV_SEQ, 'row', [corner(-26, -26), corner(26, -26), corner(26, 26)],
    [corner(-26, -26), corner(0, 0), corner(-26, 26), corner(26, -26), corner(26, 26)], 2,
    'The circle moves clockwise round the corners: top left, top right, bottom right, so next is bottom left.');
  nv('nv-seq', NV_SEQ, 'row', [arrow(270), arrow(180), arrow(90)],
    [arrow(45), arrow(90), arrow(270), arrow(180), arrow(0)], 4,
    'The arrow turns 90 degrees anticlockwise each time: pointing left, down, right, so next it points up.');

  // ---- Matrices ----
  var NV_MAT = 'Which figure completes the grid?';
  nv('nv-matrix', NV_MAT, 'matrix',
    [I('circle', 'white'), I('circle', 'grey'), I('circle', 'black'),
     I('square', 'white'), I('square', 'grey'), I('square', 'black'),
     I('triangle', 'white'), I('triangle', 'grey')],
    [I('triangle', 'grey'), I('triangle', 'black'), I('square', 'black'), I('triangle', 'white'), I('circle', 'black')], 1,
    'Each row has one shape. Along each row the shading goes white, grey, black, so the last triangle is black.');
  nv('nv-matrix', NV_MAT, 'matrix',
    [I('circle', 'white', 0, 0.5), I('circle', 'white', 0, 0.8), I('circle', 'white', 0, 1.1),
     I('square', 'white', 0, 0.5), I('square', 'white', 0, 0.8), I('square', 'white', 0, 1.1),
     I('triangle', 'white', 0, 0.5), I('triangle', 'white', 0, 0.8)],
    [I('triangle', 'white', 0, 0.8), I('triangle', 'white', 0, 1.1), I('square', 'white', 0, 1.1), I('triangle', 'white', 0, 0.5), I('circle', 'white', 0, 1.1)], 1,
    'Each row has one shape, and along each row the shape gets bigger: small, medium, large. The last cell is a large triangle.');
  nv('nv-matrix', NV_MAT, 'matrix',
    [arrow(0, 'white'), arrow(90, 'white'), arrow(180, 'white'),
     arrow(0, 'grey'), arrow(90, 'grey'), arrow(180, 'grey'),
     arrow(0, 'black'), arrow(90, 'black')],
    [arrow(90, 'black'), arrow(180, 'grey'), arrow(180, 'black'), arrow(180, 'white'), arrow(0, 'black')], 2,
    'Down each column the arrow direction stays the same and along each row the shading stays the same. The last cell is a black arrow pointing down.');
  nv('nv-matrix', NV_MAT, 'matrix',
    [I('circle'), I('square'), I('triangle'),
     I('square'), I('triangle'), I('circle'),
     I('triangle'), I('circle')],
    [I('circle'), I('triangle'), I('diamond'), I('square'), I('star')], 3,
    'Every row and every column must contain a circle, a square and a triangle once each. The missing shape is the square.');
  nv('nv-matrix', NV_MAT, 'matrix',
    [row(1, 'circle', 'white'), row(1, 'circle', 'grey'), row(1, 'circle', 'black'),
     row(2, 'circle', 'white'), row(2, 'circle', 'grey'), row(2, 'circle', 'black'),
     row(3, 'circle', 'white'), row(3, 'circle', 'grey')],
    [row(3, 'circle', 'grey'), row(2, 'circle', 'black'), row(3, 'circle', 'black'), row(3, 'circle', 'white'), row(1, 'circle', 'black')], 2,
    'Down the rows the number of circles goes 1, 2, 3. Along each row the shading goes white, grey, black. So the last cell has 3 black circles.');
  nv('nv-matrix', NV_MAT, 'matrix',
    [I('circle', 'black', 0, 0.4), I('square', 'white', 0, 1), [I('square', 'white', 0, 1), I('circle', 'black', 0, 0.4)],
     I('triangle', 'black', 0, 0.4), I('diamond', 'white', 0, 1), [I('diamond', 'white', 0, 1), I('triangle', 'black', 0, 0.4)],
     I('star', 'black', 0, 0.4), I('hexagon', 'white', 0, 1)],
    [[I('hexagon', 'white', 0, 1), I('triangle', 'black', 0, 0.4)], [I('hexagon', 'white', 0, 1), I('star', 'black', 0, 0.4)],
     I('hexagon', 'white', 0, 1), I('star', 'black', 0, 0.4), [I('hexagon', 'white', 0, 1), I('circle', 'black', 0, 0.4)]], 1,
    'In each row the third cell combines the first two: the small shape is placed inside the large shape. So the last cell is the hexagon with the small star inside.');
  nv('nv-matrix', NV_MAT, 'matrix',
    [arrow(0), arrow(90), arrow(180),
     arrow(90), arrow(180), arrow(270),
     arrow(180), arrow(270)],
    [arrow(90), arrow(270), arrow(180), arrow(0), arrow(45)], 3,
    'Along each row the arrow turns 90 degrees clockwise each time. The last row goes down, left, then up.');
  nv('nv-matrix', NV_MAT, 'matrix',
    [I('circle', 'black'), I('circle', 'white'), I('circle', 'black'),
     I('square', 'white'), I('square', 'black'), I('square', 'white'),
     I('triangle', 'black'), I('triangle', 'white')],
    [I('triangle', 'white'), I('square', 'black'), I('triangle', 'grey'), I('triangle', 'black'), I('square', 'white')], 3,
    'The shading alternates black, white, black along the first row, white, black, white along the second, and black, white, black along the third. So the last triangle is black.');

  // ---- Rotation and reflection ----
  nv('nv-rot', 'The first shape is turned 90 degrees clockwise. Which figure shows the result?', 'row', [L(0)],
    [L(270), L(90), L(180), L(0, true), L(180, true)], 1,
    'A quarter turn clockwise lays the long bar flat along the top, with the short foot hanging down at its left end. The mirror-image options are not rotations.');
  nv('nv-rot', 'The first shape is turned 180 degrees (a half turn). Which figure shows the result?', 'row', [L(0)],
    [L(0), L(180), L(90), L(0, true), L(270)], 1,
    'A half turn puts the shape upside down: the bar is now on the right-hand side and the foot is at the top, pointing left.');
  nv('nv-rot', 'The first shape is reflected in a vertical mirror line (left to right). Which figure shows the mirror image?', 'row', [L(0)],
    [L(90), L(180), L(270), L(0, true), L(180, true)], 3,
    'In a left-to-right reflection the foot of the L moves from the right side to the left side while the bar stays pointing up.');
  nv('nv-rot', 'The first shape is turned 90 degrees clockwise. Which figure shows the result?', 'row', [L(90)],
    [L(0), L(90), L(270), L(180, true), L(180)], 4,
    'The first shape is already turned a quarter. Another quarter turn clockwise makes a half turn in total.');
  nv('nv-rot', 'Which figure is NOT a rotation of the first shape?', 'row', [L(0)],
    [L(90), L(180), L(90, true), L(270), L(0)], 2,
    'Three figures are the original shape turned round. The odd one has been reflected, so no amount of turning will match it.');
  nv('nv-rot', 'The first shape is reflected in a horizontal mirror line (top to bottom). Which figure shows the result?', 'row', [flag(0)],
    [flag(0, true), flag(180), flag(180, true), flag(90), flag(90, true)], 2,
    'The flag moves from the top to the bottom of the pole but still points to the right.');
  nv('nv-rot', 'The first shape is turned 135 degrees clockwise. Which figure shows the result?', 'row', [flag(0)],
    [flag(45), flag(135), flag(225), flag(315), flag(90)], 1,
    '135 degrees is one quarter turn (90) plus half a quarter turn (45) clockwise.');
  nv('nv-rot', 'The first shape is reflected left to right, then turned 90 degrees clockwise. Which figure shows the result?', 'row', [flag(0)],
    [flag(90), flag(0, true), flag(90, true), flag(270, true), flag(270)], 2,
    'First the pennant points left (mirror image). Then a quarter turn clockwise makes the pole horizontal with the pennant pointing up.');

  // ---- Analogies (A is to B as C is to ?) ----
  var NV_ANA = 'The first pair of figures is related in a certain way. Which figure completes the second pair in the same way?';
  nv('nv-analogy', NV_ANA, 'analogy', [I('circle', 'white'), I('circle', 'black'), I('square', 'white')],
    [I('circle', 'black'), I('square', 'grey'), I('square', 'black'), I('square', 'white'), I('triangle', 'black')], 2,
    'The shape stays the same but changes from white to black. So the white square becomes a black square.');
  nv('nv-analogy', NV_ANA, 'analogy', [I('triangle', 'white', 0, 0.5), I('triangle', 'white', 0, 1.1), I('star', 'white', 0, 0.5)],
    [I('star', 'white', 0, 0.5), I('circle', 'white', 0, 1.1), I('star', 'white', 0, 1.1), I('triangle', 'white', 0, 1.1), I('star', 'white', 0, 0.8)], 2,
    'The shape gets bigger. So the small star becomes a big star.');
  nv('nv-analogy', NV_ANA, 'analogy', [arrow(0), arrow(90), arrow(270)],
    [arrow(90), arrow(180), arrow(270), arrow(0), arrow(45)], 3,
    'The arrow turns 90 degrees clockwise. So the arrow pointing left turns to point up.');
  nv('nv-analogy', NV_ANA, 'analogy', [row(1, 'circle', 'black'), row(2, 'circle', 'black'), row(1, 'square', 'black')],
    [row(3, 'square', 'black'), row(2, 'square', 'black'), row(2, 'circle', 'black'), row(1, 'square', 'black'), row(4, 'square', 'black')], 1,
    'The number of shapes doubles from one to two. So one square becomes two squares.');
  nv('nv-analogy', NV_ANA, 'analogy',
    [I('circle', 'black', 0, 0.6), [I('square', 'white', 0, 1), I('circle', 'black', 0, 0.6)], I('triangle', 'black', 0, 0.6)],
    [I('triangle', 'black', 0, 0.6), [I('square', 'white', 0, 1), I('circle', 'black', 0, 0.6)], [I('square', 'white', 0, 1), I('triangle', 'black', 0, 0.6)],
     I('square', 'white', 0, 1), [I('square', 'white', 0, 1), I('triangle', 'white', 0, 0.6)]], 2,
    'The shape is placed inside a large white square. So the black triangle goes inside a large white square.');
  nv('nv-analogy', NV_ANA, 'analogy', [flag(0), flag(0, true), L(0)],
    [L(0), L(180), L(0, true), L(180, true), L(90)], 2,
    'The first figure is reflected left to right. So the L is reflected left to right too.');
  nv('nv-analogy', NV_ANA, 'analogy', [I('square', 'grey'), I('square', 'black'), I('triangle', 'grey')],
    [I('triangle', 'grey'), I('triangle', 'black'), I('triangle', 'white'), I('square', 'black'), I('circle', 'black')], 1,
    'The shape stays the same but the shading changes from grey to black. So the grey triangle becomes a black triangle.');
  nv('nv-analogy', NV_ANA, 'analogy', [I('triangle'), I('square'), I('pentagon')],
    [I('pentagon'), I('circle'), I('hexagon'), I('star'), I('triangle')], 2,
    'The shape gains one side: a triangle (3 sides) becomes a square (4 sides). So a pentagon (5 sides) becomes a hexagon (6 sides).');

  // =====================================================================
  // EXTRA QUESTIONS (set 2)
  // =====================================================================

  // ---- Number sequences ----
  v('nseq', 'What number comes next?  7, 14, 21, 28, ?', ['32', '34', '35', '36', '42'], '35', 'The numbers go up by 7 each time (the 7 times table): 28 + 7 = 35.');
  v('nseq', 'What number comes next?  2, 6, 18, 54, ?', ['108', '148', '162', '72', '216'], '162', 'Each number is multiplied by 3: 54 x 3 = 162.');
  v('nseq', 'What number comes next?  1, 3, 6, 10, 15, ?', ['19', '20', '21', '22', '25'], '21', 'The gaps grow by 1 each time: +2, +3, +4, +5, so the next gap is +6. 15 + 6 = 21.');
  v('nseq', 'What number comes next?  64, 32, 16, 8, ?', ['0', '2', '4', '6', '12'], '4', 'Each number is halved: 8 / 2 = 4.');

  // ---- Letter sequences ----
  v('lseq', 'Which letter comes next?  D, G, J, M, ?', ['N', 'O', 'P', 'Q', 'R'], 'P', 'Each letter is 3 places after the one before. M + 3 places = P.');
  v('lseq', 'Which pair comes next?  AB, CD, EF, GH, ?', ['HI', 'IJ', 'IK', 'JK', 'GI'], 'IJ', 'The pairs are consecutive letters, and each pair starts where the one before left off: AB, CD, EF, GH, then IJ.');
  v('lseq', 'Which letter comes next?  Y, V, S, P, ?', ['N', 'M', 'L', 'O', 'K'], 'M', 'The letters go back 3 places each time. P goes back 3 places to M.');
  v('lseq', 'Which letter comes next?  A, Z, B, Y, C, ?', ['D', 'W', 'X', 'Y', 'B'], 'X', 'There are two patterns mixed together. Every other letter goes forward (A, B, C) and the others go backward (Z, Y, X).');

  // ---- Analogies ----
  v('analogy', 'Fish is to water as bird is to ...', ['nest', 'feathers', 'air', 'wing', 'tree'], 'air', 'A fish moves through water. A bird moves through air.');
  v('analogy', 'Book is to read as food is to ...', ['cook', 'eat', 'plate', 'hungry', 'taste'], 'eat', 'You read a book. You eat food.');
  v('analogy', 'Page is to book as petal is to ...', ['garden', 'flower', 'bee', 'stem', 'colour'], 'flower', 'A page is part of a book. A petal is part of a flower.');
  v('analogy', 'Fawn is to deer as lamb is to ...', ['wool', 'field', 'sheep', 'goat', 'farm'], 'sheep', 'A fawn is a young deer. A lamb is a young sheep.');

  // ---- Odd one out ----
  v('odd', 'Which word is the odd one out?', ['walk', 'run', 'jog', 'sleep', 'sprint'], 'sleep', 'Walk, run, jog and sprint are all ways of moving along. Sleep is not.');
  v('odd', 'Which number is the odd one out?', ['2', '3', '5', '9', '11'], '9', '2, 3, 5 and 11 are prime numbers. 9 is not prime because 3 x 3 = 9.');
  v('odd', 'Which word is the odd one out?', ['Mercury', 'Venus', 'Moon', 'Mars', 'Jupiter'], 'Moon', 'Mercury, Venus, Mars and Jupiter are planets. The Moon goes round the Earth.');
  v('odd', 'Which word is the odd one out?', ['guitar', 'violin', 'drum', 'cello', 'harp'], 'drum', 'Guitar, violin, cello and harp all have strings. A drum is hit.');

  // ---- Word codes ----
  v('code', 'In a code, DOG is written as FQI. What is the code for CAT?', ['ECV', 'DBU', 'ECU', 'EDV', 'BYR'], 'ECV', 'Each letter moves two places forward: D->F, O->Q, G->I. So C->E, A->C, T->V.');
  v('code', 'If A = 1, B = 2, C = 3 and so on, what is the total value of the letters in BEAD?', ['10', '11', '12', '13', '14'], '12', 'B = 2, E = 5, A = 1, D = 4, and 2 + 5 + 1 + 4 = 12.');
  v('code', 'In a code, LION is written as KHNM. What is the code for BEAR?', ['ADZQ', 'CFBS', 'ADZR', 'ACZQ', 'BDZQ'], 'ADZQ', 'Each letter moves one place backward: L->K, I->H, O->N, N->M. So B->A, E->D, A->Z, R->Q.');
  v('code', 'If A = 1, B = 2, C = 3 and so on, which word does 4-15-7 spell?', ['DOG', 'DIG', 'DOT', 'GOD', 'FOG'], 'DOG', '4 = D, 15 = O, 7 = G, so the word is DOG.');

  // ---- Hidden words ----
  v('hidden', 'A four-letter word is hidden at the end of one word and the start of the next. Find it.\n"I ate a plum ice lolly."', ['RICE', 'NICE', 'MICE', 'DICE', 'LICE'], 'MICE', 'The words "plum ice" contain pluM ICE, so the hidden word is MICE.');
  v('hidden', 'A four-letter word is hidden at the end of one word and the start of the next. Find it.\n"Her slow arm healed."', ['FARM', 'HARM', 'WARN', 'WARM', 'WORM'], 'WARM', 'The words "slow arm" contain sloW ARM, so the hidden word is WARM.');
  v('hidden', 'A four-letter word is hidden at the end of one word and the start of the next. Find it.\n"The ash opened wide."', ['ROPE', 'HOSE', 'COPE', 'MOPE', 'HOPE'], 'HOPE', 'The words "ash opened" contain asH OPEned, so the hidden word is HOPE.');
  v('hidden', 'A four-letter word is hidden at the end of one word and the start of the next. Find it.\n"She rose at dawn."', ['BEAT', 'HEAT', 'MEAT', 'SEAT', 'NEAT'], 'SEAT', 'The words "rose at" contain roSE AT, so the hidden word is SEAT.');

  // ---- Compound words ----
  v('compound', 'Which word can be added to the end of BUTTER to make a new word?', ['fly', 'table', 'door', 'bag', 'shoe'], 'fly', 'Butterfly is a word. The other choices do not make real words with butter.');
  v('compound', 'Which word can be added to the start of PAPER to make a new word?', ['news', 'door', 'tall', 'tree', 'cup'], 'news', 'Newspaper is a word. The other choices do not make real words with paper.');
  v('compound', 'Which word can be added to the end of BED to make a new word?', ['room', 'tree', 'desk', 'shoe', 'sun'], 'room', 'Bedroom is a word. The other choices do not make real words with bed.');
  v('compound', 'Which word can be added to the start of LIGHT to make a new word?', ['moon', 'table', 'cup', 'desk', 'shoe'], 'moon', 'Moonlight is a word. The other choices do not make real words with light.');

  // ---- Logic and reasoning ----
  v('logic', 'Mia has 5 sweets. She gives 2 to Jo and then is given 4 more. How many sweets does Mia have now?', ['5', '6', '7', '8', '11'], '7', '5 - 2 = 3, then 3 + 4 = 7.');
  v('logic', 'Four children stand in a line. Ali is behind Ben. Cal is in front of Ben. Dev is behind Ali. Who is second in the line?', ['Ali', 'Ben', 'Cal', 'Dev', 'It cannot be known'], 'Ben', 'From front to back the order is Cal, Ben, Ali, Dev, so Ben is second.');
  v('logic', 'A box weighs more than a bag. The bag weighs more than a book. The book weighs more than a pen. Which is the lightest?', ['box', 'bag', 'book', 'pen', 'It cannot be known'], 'pen', 'Heaviest to lightest the order is box, bag, book, pen, so the pen is the lightest.');
  v('logic', 'Tom starts his homework at 4:20 pm and finishes at 5:05 pm. How long did it take?', ['35 minutes', '40 minutes', '45 minutes', '55 minutes', '1 hour'], '45 minutes', 'From 4:20 to 5:00 is 40 minutes, and from 5:00 to 5:05 is 5 more minutes. 40 + 5 = 45 minutes.');

  // ---- Non-verbal: odd one out ----
  nv('nv-odd', NV_ODD, 'none', null,
    [I('cross', 'grey'), I('cross', 'grey'), I('cross', 'grey'), I('star', 'grey'), I('cross', 'grey')], 3,
    'Four of the shapes are crosses. The odd one out is the star.');
  nv('nv-odd', NV_ODD, 'none', null,
    [row(3, 'circle', 'white'), row(3, 'square', 'white'), row(3, 'circle', 'white'), row(3, 'circle', 'white'), row(3, 'circle', 'white')], 1,
    'Four of the figures show three circles. The odd one out shows three squares.');
  nv('nv-odd', NV_ODD, 'none', null,
    [I('square', 'black', 0, 1), I('square', 'black', 0, 1), I('square', 'black', 0, 1), I('square', 'black', 0, 1), I('square', 'black', 0, 0.6)], 4,
    'Four of the squares are large. The odd one out is small.');

  // ---- Non-verbal: sequences ----
  nv('nv-seq', NV_SEQ, 'row', [I('circle', 'white'), I('circle', 'grey'), I('circle', 'black'), I('circle', 'white'), I('circle', 'grey')],
    [I('circle', 'white'), I('circle', 'black'), I('circle', 'grey'), I('square', 'black'), I('square', 'grey')], 1,
    'The shading repeats white, grey, black, so after grey comes black.');
  nv('nv-seq', NV_SEQ, 'row', [row(5, 'circle', 'black'), row(4, 'circle', 'black'), row(3, 'circle', 'black')],
    [row(1, 'circle', 'black'), row(4, 'circle', 'black'), row(2, 'circle', 'black'), row(3, 'circle', 'black'), row(5, 'circle', 'black')], 2,
    'One circle is taken away each time: 5, 4, 3, so the next figure has 2 circles.');
  nv('nv-seq', NV_SEQ, 'row', [I('square', 'black', 0, 0.5), I('circle', 'white', 0, 0.7), I('square', 'black', 0, 0.9), I('circle', 'white', 0, 1.1)],
    [I('circle', 'white', 0, 1.3), I('square', 'black', 0, 1.1), I('square', 'white', 0, 1.3), I('square', 'black', 0, 1.3), I('circle', 'black', 0, 1.3)], 3,
    'Two things change together: the shape alternates between a black square and a white circle, and the size grows each time. So next is a black square, one size bigger.');

  // ---- Non-verbal: matrices ----
  nv('nv-matrix', NV_MAT, 'matrix',
    [row(1, 'circle', 'black'), row(2, 'circle', 'black'), row(3, 'circle', 'black'),
     row(1, 'square', 'black'), row(2, 'square', 'black'), row(3, 'square', 'black'),
     row(1, 'triangle', 'black'), row(2, 'triangle', 'black')],
    [row(3, 'square', 'black'), row(3, 'triangle', 'black'), row(2, 'triangle', 'black'), row(4, 'triangle', 'black'), row(3, 'circle', 'black')], 1,
    'Each row has one shape. The number of shapes goes up by one along each row: 1, 2, 3. So the last cell has 3 triangles.');
  nv('nv-matrix', NV_MAT, 'matrix',
    [I('circle', 'black'), I('circle', 'grey'), I('circle', 'white'),
     I('square', 'grey'), I('square', 'white'), I('square', 'black'),
     I('triangle', 'white'), I('triangle', 'black')],
    [I('triangle', 'black'), I('triangle', 'white'), I('square', 'grey'), I('triangle', 'grey'), I('circle', 'grey')], 3,
    'Each row uses one shape in all three shadings: black, grey and white once each. The last triangle must be the missing shade, grey.');
  nv('nv-matrix', NV_MAT, 'matrix',
    [I('circle', 'white', 0, 0.5), I('square', 'white', 0, 0.5), I('triangle', 'white', 0, 0.5),
     I('circle', 'white', 0, 0.8), I('square', 'white', 0, 0.8), I('triangle', 'white', 0, 0.8),
     I('circle', 'white', 0, 1.1), I('square', 'white', 0, 1.1)],
    [I('triangle', 'white', 0, 0.8), I('square', 'white', 0, 1.1), I('triangle', 'white', 0, 1.1), I('circle', 'white', 0, 1.1), I('triangle', 'white', 0, 0.5)], 2,
    'Each column has one shape (circle, square, triangle). Down each column the shape gets bigger. The last cell is a large triangle.');

  // ---- Non-verbal: rotation and reflection ----
  nv('nv-rot', 'The first shape is turned 270 degrees clockwise (three quarter turns). Which figure shows the result?', 'row', [L(0)],
    [L(90), L(180), L(270), L(270, true), L(0, true)], 2,
    'Three quarter turns clockwise lays the long bar flat along the bottom with the short foot pointing up at its right-hand end.');
  nv('nv-rot', 'The first shape is reflected in a vertical mirror line (left to right). Which figure shows the mirror image?', 'row', [flag(0)],
    [flag(0, true), flag(180), flag(90), flag(180, true), flag(270)], 0,
    'In a left-to-right reflection the pole stays upright but the pennant now points to the left.');
  nv('nv-rot', 'Which figure is a rotation of the first shape (not a mirror image)?', 'row', [flag(0)],
    [flag(0, true), flag(90, true), flag(135), flag(180, true), flag(270, true)], 2,
    'Four of the figures are mirror images, which no turning can match. Only one is the original flag turned round.');

  // ---- Non-verbal: analogies ----
  nv('nv-analogy', NV_ANA, 'analogy', [arrow(0), arrow(180), flag(0)],
    [flag(0), flag(90), flag(180), flag(0, true), flag(270)], 2,
    'The first figure is turned upside down (a half turn). So the flag is turned a half turn too.');
  nv('nv-analogy', NV_ANA, 'analogy',
    [[I('square', 'white', 0, 1), I('circle', 'black', 0, 0.5)], I('circle', 'black', 0, 0.5), [I('hexagon', 'white', 0, 1), I('star', 'black', 0, 0.5)]],
    [I('hexagon', 'white', 0, 1), I('star', 'black', 0, 0.5), [I('hexagon', 'white', 0, 1), I('star', 'black', 0, 0.5)], I('star', 'white', 0, 0.5), I('circle', 'black', 0, 0.5)], 1,
    'The large outer shape is taken away and only the small inner shape is left. So the hexagon is removed and only the black star is left.');

  root.QUESTIONS = Q;
  root.QUESTION_TYPES = {
    verbal: [
      { id: 'nseq', label: 'Number sequences' },
      { id: 'lseq', label: 'Letter sequences' },
      { id: 'analogy', label: 'Word analogies' },
      { id: 'odd', label: 'Odd one out (words)' },
      { id: 'code', label: 'Word and letter codes' },
      { id: 'hidden', label: 'Hidden words' },
      { id: 'compound', label: 'Compound words' },
      { id: 'logic', label: 'Logic and reasoning' }
    ],
    nonverbal: [
      { id: 'nv-odd', label: 'Odd one out (shapes)' },
      { id: 'nv-seq', label: 'Shape sequences' },
      { id: 'nv-matrix', label: 'Matrices (3x3 grids)' },
      { id: 'nv-rot', label: 'Rotation and reflection' },
      { id: 'nv-analogy', label: 'Shape analogies' }
    ]
  };
  if (typeof module !== 'undefined' && module.exports) { module.exports = { QUESTIONS: Q, QUESTION_TYPES: root.QUESTION_TYPES }; }
})(typeof window !== 'undefined' ? window : globalThis);
