$fsm0.Stats = function () {
    $fsm1 = fsm.create(arguments);
    $fsm1.s = function s(a, g, d) {
        $fsm2 = fsm.create(arguments);
        {
            $fsm2.f = undefined;
            $fsm2.c = undefined;
            $fsm2.e = undefined;
        }
        for ($fsm2.c = 0; $fsm2.c < 30; $fsm2.c++)
            for ($fsm2.f = 0; $fsm2.f < 73; $fsm2.f++)
                $fsm2.e = ($fsm2.f + $fsm2.c * 74) * 4, $fsm2.$arguments0[$fsm2.e] = $fsm2.$arguments0[$fsm2.e + 4], $fsm2.$arguments0[$fsm2.e + 1] = $fsm2.$arguments0[$fsm2.e + 5], $fsm2.$arguments0[$fsm2.e + 2] = $fsm2.$arguments0[$fsm2.e + 6];
        for ($fsm2.c = 0; $fsm2.c < 30; $fsm2.c++)
            $fsm2.e = (73 + $fsm2.c * 74) * 4, $fsm2.c < $fsm2.$arguments1 ? ($fsm2.$arguments0[$fsm2.e] = $fsm0.b[$fsm2.$arguments2].bg.r, $fsm2.$arguments0[$fsm2.e + 1] = $fsm0.b[$fsm2.$arguments2].bg.g, $fsm2.$arguments0[$fsm2.e + 2] = $fsm0.b[$fsm2.$arguments2].bg.b) : ($fsm2.$arguments0[$fsm2.e] = $fsm0.b[$fsm2.$arguments2].fg.r, $fsm2.$arguments0[$fsm2.e + 1] = $fsm0.b[$fsm2.$arguments2].fg.g, $fsm2.$arguments0[$fsm2.e + 2] = $fsm0.b[$fsm2.$arguments2].fg.b);
    };
    {
        $fsm1.r = 0;
        $fsm1.t = 2;
        $fsm1.g = undefined;
        $fsm1.u = 0;
        $fsm1.j = new Date().getTime();
        $fsm1.F = $fsm1.j;
        $fsm1.v = $fsm1.j;
        $fsm1.l = 0;
        $fsm1.w = 1000;
        $fsm1.x = 0;
        $fsm1.k = undefined;
        $fsm1.d = undefined;
        $fsm1.a = undefined;
        $fsm1.m = undefined;
        $fsm1.y = undefined;
        $fsm1.n = 0;
        $fsm1.z = 1000;
        $fsm1.A = 0;
        $fsm1.f = undefined;
        $fsm1.c = undefined;
        $fsm1.o = undefined;
        $fsm1.B = undefined;
        $fsm1.p = 0;
        $fsm1.C = 1000;
        $fsm1.D = 0;
        $fsm1.h = undefined;
        $fsm1.i = undefined;
        $fsm1.q = undefined;
        $fsm1.E = undefined;
        $fsm1.b = {
            fps: {
                bg: {
                    r: 16,
                    g: 16,
                    b: 48
                },
                fg: {
                    r: 0,
                    g: 255,
                    b: 255
                }
            },
            ms: {
                bg: {
                    r: 16,
                    g: 48,
                    b: 16
                },
                fg: {
                    r: 0,
                    g: 255,
                    b: 0
                }
            },
            mb: {
                bg: {
                    r: 48,
                    g: 16,
                    b: 26
                },
                fg: {
                    r: 255,
                    g: 0,
                    b: 128
                }
            }
        };
    }
    $fsm1.g = document.createElement('div');
    $fsm1.g.style.cursor = 'pointer';
    $fsm1.g.style.width = '80px';
    $fsm1.g.style.opacity = '0.9';
    $fsm1.g.style.zIndex = '10001';
    $fsm1.g.addEventListener('click', function () {
        $fsm3 = fsm.create(arguments);
        $fsm1.r++;
        $fsm1.r == $fsm1.t && ($fsm1.r = 0);
        $fsm1.k.style.display = 'none';
        $fsm1.f.style.display = 'none';
        $fsm1.h.style.display = 'none';
        switch ($fsm1.r) {
        case 0:
            $fsm1.k.style.display = 'block';
            break;
        case 1:
            $fsm1.f.style.display = 'block';
            break;
        case 2:
            $fsm1.h.style.display = 'block';
        }
    }, !1);
    $fsm1.k = document.createElement('div');
    $fsm1.k.style.backgroundColor = 'rgb(' + Math.floor($fsm1.b.fps.bg.r / 2) + ',' + Math.floor($fsm1.b.fps.bg.g / 2) + ',' + Math.floor($fsm1.b.fps.bg.b / 2) + ')';
    $fsm1.k.style.padding = '2px 0px 3px 0px';
    $fsm1.g.appendChild($fsm1.k);
    $fsm1.d = document.createElement('div');
    $fsm1.d.style.fontFamily = 'Helvetica, Arial, sans-serif';
    $fsm1.d.style.textAlign = 'left';
    $fsm1.d.style.fontSize = '9px';
    $fsm1.d.style.color = 'rgb(' + $fsm1.b.fps.fg.r + ',' + $fsm1.b.fps.fg.g + ',' + $fsm1.b.fps.fg.b + ')';
    $fsm1.d.style.margin = '0px 0px 1px 3px';
    $fsm1.d.innerHTML = '<span style="font-weight:bold">FPS</span>';
    $fsm1.k.appendChild($fsm1.d);
    $fsm1.a = document.createElement('canvas');
    $fsm1.a.width = 74;
    $fsm1.a.height = 30;
    $fsm1.a.style.display = 'block';
    $fsm1.a.style.marginLeft = '3px';
    $fsm1.k.appendChild($fsm1.a);
    $fsm1.m = $fsm1.a.getContext('2d');
    $fsm1.m.fillStyle = 'rgb(' + $fsm1.b.fps.bg.r + ',' + $fsm1.b.fps.bg.g + ',' + $fsm1.b.fps.bg.b + ')';
    $fsm1.m.fillRect(0, 0, $fsm1.a.width, $fsm1.a.height);
    $fsm1.y = $fsm1.m.getImageData(0, 0, $fsm1.a.width, $fsm1.a.height);
    $fsm1.f = document.createElement('div');
    $fsm1.f.style.backgroundColor = 'rgb(' + Math.floor($fsm1.b.ms.bg.r / 2) + ',' + Math.floor($fsm1.b.ms.bg.g / 2) + ',' + Math.floor($fsm1.b.ms.bg.b / 2) + ')';
    $fsm1.f.style.padding = '2px 0px 3px 0px';
    $fsm1.f.style.display = 'none';
    $fsm1.g.appendChild($fsm1.f);
    $fsm1.c = document.createElement('div');
    $fsm1.c.style.fontFamily = 'Helvetica, Arial, sans-serif';
    $fsm1.c.style.textAlign = 'left';
    $fsm1.c.style.fontSize = '9px';
    $fsm1.c.style.color = 'rgb(' + $fsm1.b.ms.fg.r + ',' + $fsm1.b.ms.fg.g + ',' + $fsm1.b.ms.fg.b + ')';
    $fsm1.c.style.margin = '0px 0px 1px 3px';
    $fsm1.c.innerHTML = '<span style="font-weight:bold">MS</span>';
    $fsm1.f.appendChild($fsm1.c);
    $fsm1.a = document.createElement('canvas');
    $fsm1.a.width = 74;
    $fsm1.a.height = 30;
    $fsm1.a.style.display = 'block';
    $fsm1.a.style.marginLeft = '3px';
    $fsm1.f.appendChild($fsm1.a);
    $fsm1.o = $fsm1.a.getContext('2d');
    $fsm1.o.fillStyle = 'rgb(' + $fsm1.b.ms.bg.r + ',' + $fsm1.b.ms.bg.g + ',' + $fsm1.b.ms.bg.b + ')';
    $fsm1.o.fillRect(0, 0, $fsm1.a.width, $fsm1.a.height);
    $fsm1.B = $fsm1.o.getImageData(0, 0, $fsm1.a.width, $fsm1.a.height);
    try {
        performance && performance.memory && performance.memory.totalJSHeapSize && ($fsm1.t = 3);
    } catch ($fsm0.G) {
    }
    $fsm1.h = document.createElement('div');
    $fsm1.h.style.backgroundColor = 'rgb(' + Math.floor($fsm1.b.mb.bg.r / 2) + ',' + Math.floor($fsm1.b.mb.bg.g / 2) + ',' + Math.floor($fsm1.b.mb.bg.b / 2) + ')';
    $fsm1.h.style.padding = '2px 0px 3px 0px';
    $fsm1.h.style.display = 'none';
    $fsm1.g.appendChild($fsm1.h);
    $fsm1.i = document.createElement('div');
    $fsm1.i.style.fontFamily = 'Helvetica, Arial, sans-serif';
    $fsm1.i.style.textAlign = 'left';
    $fsm1.i.style.fontSize = '9px';
    $fsm1.i.style.color = 'rgb(' + $fsm1.b.mb.fg.r + ',' + $fsm1.b.mb.fg.g + ',' + $fsm1.b.mb.fg.b + ')';
    $fsm1.i.style.margin = '0px 0px 1px 3px';
    $fsm1.i.innerHTML = '<span style="font-weight:bold">MB</span>';
    $fsm1.h.appendChild($fsm1.i);
    $fsm1.a = document.createElement('canvas');
    $fsm1.a.width = 74;
    $fsm1.a.height = 30;
    $fsm1.a.style.display = 'block';
    $fsm1.a.style.marginLeft = '3px';
    $fsm1.h.appendChild($fsm1.a);
    $fsm1.q = $fsm1.a.getContext('2d');
    $fsm1.q.fillStyle = '#301010';
    $fsm1.q.fillRect(0, 0, $fsm1.a.width, $fsm1.a.height);
    $fsm1.E = $fsm1.q.getImageData(0, 0, $fsm1.a.width, $fsm1.a.height);
    return {
        domElement: $fsm1.g,
        update: function () {
            $fsm4 = fsm.create(arguments);
            $fsm1.u++;
            $fsm1.j = new Date().getTime();
            $fsm1.n = $fsm1.j - $fsm1.F;
            $fsm1.z = Math.min($fsm1.z, $fsm1.n);
            $fsm1.A = Math.max($fsm1.A, $fsm1.n);
            $fsm1.s($fsm1.B.data, Math.min(30, 30 - $fsm1.n / 200 * 30), 'ms');
            $fsm1.c.innerHTML = '<span style="font-weight:bold">' + $fsm1.n + ' MS</span> (' + $fsm1.z + '-' + $fsm1.A + ')';
            $fsm1.o.putImageData($fsm1.B, 0, 0);
            $fsm1.F = $fsm1.j;
            if ($fsm1.j > $fsm1.v + 1000) {
                $fsm1.l = Math.round($fsm1.u * 1000 / ($fsm1.j - $fsm1.v));
                $fsm1.w = Math.min($fsm1.w, $fsm1.l);
                $fsm1.x = Math.max($fsm1.x, $fsm1.l);
                $fsm1.s($fsm1.y.data, Math.min(30, 30 - $fsm1.l / 100 * 30), 'fps');
                $fsm1.d.innerHTML = '<span style="font-weight:bold">' + $fsm1.l + ' FPS</span> (' + $fsm1.w + '-' + $fsm1.x + ')';
                $fsm1.m.putImageData($fsm1.y, 0, 0);
                if ($fsm1.t == 3)
                    $fsm1.p = performance.memory.usedJSHeapSize * 9.54e-7, $fsm1.C = Math.min($fsm1.C, $fsm1.p), $fsm1.D = Math.max($fsm1.D, $fsm1.p), $fsm1.s($fsm1.E.data, Math.min(30, 30 - $fsm1.p / 2), 'mb'), $fsm1.i.innerHTML = '<span style="font-weight:bold">' + Math.round($fsm1.p) + ' MB</span> (' + Math.round($fsm1.C) + '-' + Math.round($fsm1.D) + ')', $fsm1.q.putImageData($fsm1.E, 0, 0);
                $fsm1.v = $fsm1.j;
                $fsm1.u = 0;
            }
        }
    };
};
$fsm0.get = function get(id) {
    $fsm5 = fsm.create(arguments);
    return document.getElementById($fsm5.$arguments0);
};
$fsm0.hide = function hide(id) {
    $fsm6 = fsm.create(arguments);
    $fsm0.get($fsm6.$arguments0).style.visibility = 'hidden';
};
$fsm0.show = function show(id) {
    $fsm7 = fsm.create(arguments);
    $fsm0.get($fsm7.$arguments0).style.visibility = null;
};
$fsm0.html = function html(id, html) {
    $fsm8 = fsm.create(arguments);
    $fsm0.get($fsm8.$arguments0).innerHTML = $fsm8.$arguments1;
};
$fsm0.timestamp = function timestamp() {
    $fsm9 = fsm.create(arguments);
    return new Date().getTime();
};
$fsm0.random = function random(min, max) {
    $fsm10 = fsm.create(arguments);
    return $fsm10.$arguments0 + Math.random() * ($fsm10.$arguments1 - $fsm10.$arguments0);
};
$fsm0.randomChoice = function randomChoice(choices) {
    $fsm11 = fsm.create(arguments);
    return $fsm11.$arguments0[Math.round($fsm0.random(0, $fsm11.$arguments0.length - 1))];
};
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback, element) {
        $fsm12 = fsm.create(arguments);
        window.setTimeout($fsm12.$arguments0, 1000 / 60);
    };
}
{
    $fsm0.KEY = {
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40
    };
    $fsm0.DIR = {
        UP: 0,
        RIGHT: 1,
        DOWN: 2,
        LEFT: 3,
        MIN: 0,
        MAX: 3
    };
    $fsm0.stats = new $fsm0.Stats();
    $fsm0.canvas = $fsm0.get('canvas');
    $fsm0.ctx = $fsm0.canvas.getContext('2d');
    $fsm0.ucanvas = $fsm0.get('upcoming');
    $fsm0.uctx = $fsm0.ucanvas.getContext('2d');
    $fsm0.speed = {
        start: 0.6,
        decrement: 0.005,
        min: 0.1
    };
    $fsm0.nx = 10;
    $fsm0.ny = 20;
    $fsm0.nu = 5;
}
{
    $fsm0.dx = undefined;
    $fsm0.dy = undefined;
    $fsm0.blocks = undefined;
    $fsm0.actions = undefined;
    $fsm0.playing = undefined;
    $fsm0.dt = undefined;
    $fsm0.current = undefined;
    $fsm0.next = undefined;
    $fsm0.score = undefined;
    $fsm0.vscore = undefined;
    $fsm0.rows = undefined;
    $fsm0.step = undefined;
}
$fsm0.i = {
    size: 4,
    blocks: [
        3840,
        8738,
        240,
        17476
    ],
    color: 'cyan'
};
$fsm0.j = {
    size: 3,
    blocks: [
        17600,
        36352,
        25664,
        3616
    ],
    color: 'blue'
};
$fsm0.l = {
    size: 3,
    blocks: [
        17504,
        3712,
        50240,
        11776
    ],
    color: 'orange'
};
$fsm0.o = {
    size: 2,
    blocks: [
        52224,
        52224,
        52224,
        52224
    ],
    color: 'yellow'
};
$fsm0.s = {
    size: 3,
    blocks: [
        1728,
        35904,
        27648,
        17952
    ],
    color: 'green'
};
$fsm0.t = {
    size: 3,
    blocks: [
        3648,
        19520,
        19968,
        17984
    ],
    color: 'purple'
};
$fsm0.z = {
    size: 3,
    blocks: [
        3168,
        19584,
        50688,
        9792
    ],
    color: 'red'
};
$fsm0.eachblock = function eachblock(type, x, y, dir, fn) {
    $fsm13 = fsm.create(arguments);
    {
        $fsm13.bit = undefined;
        $fsm13.result = undefined;
        $fsm13.row = 0;
        $fsm13.col = 0;
        $fsm13.blocks = $fsm13.$arguments0.blocks[$fsm13.$arguments3];
    }
    for ($fsm13.bit = 32768; $fsm13.bit > 0; $fsm13.bit = $fsm13.bit >> 1) {
        if ($fsm13.blocks & $fsm13.bit) {
            $fsm13.$arguments4($fsm13.$arguments1 + $fsm13.col, $fsm13.$arguments2 + $fsm13.row);
        }
        if (++$fsm13.col === 4) {
            $fsm13.col = 0;
            ++$fsm13.row;
        }
    }
};
$fsm0.occupied = function occupied(type, x, y, dir) {
    $fsm14 = fsm.create(arguments);
    $fsm14.result = false;
    $fsm0.eachblock($fsm14.$arguments0, $fsm14.$arguments1, $fsm14.$arguments2, $fsm14.$arguments3, function (x, y) {
        $fsm15 = fsm.create(arguments);
        if ($fsm15.$arguments0 < 0 || $fsm15.$arguments0 >= $fsm0.nx || $fsm15.$arguments1 < 0 || $fsm15.$arguments1 >= $fsm0.ny || $fsm0.getBlock($fsm15.$arguments0, $fsm15.$arguments1))
            $fsm14.result = true;
    });
    return $fsm14.result;
};
$fsm0.unoccupied = function unoccupied(type, x, y, dir) {
    $fsm16 = fsm.create(arguments);
    return !$fsm0.occupied($fsm16.$arguments0, $fsm16.$arguments1, $fsm16.$arguments2, $fsm16.$arguments3);
};
$fsm0.pieces = [];
$fsm0.randomPiece = function randomPiece() {
    $fsm17 = fsm.create(arguments);
    if ($fsm0.pieces.length == 0)
        $fsm0.pieces = [
            $fsm0.i,
            $fsm0.i,
            $fsm0.i,
            $fsm0.i,
            $fsm0.j,
            $fsm0.j,
            $fsm0.j,
            $fsm0.j,
            $fsm0.l,
            $fsm0.l,
            $fsm0.l,
            $fsm0.l,
            $fsm0.o,
            $fsm0.o,
            $fsm0.o,
            $fsm0.o,
            $fsm0.s,
            $fsm0.s,
            $fsm0.s,
            $fsm0.s,
            $fsm0.t,
            $fsm0.t,
            $fsm0.t,
            $fsm0.t,
            $fsm0.z,
            $fsm0.z,
            $fsm0.z,
            $fsm0.z
        ];
    $fsm17.type = $fsm0.pieces.splice($fsm0.random(0, $fsm0.pieces.length - 1), 1)[0];
    return {
        type: $fsm17.type,
        dir: $fsm0.DIR.UP,
        x: Math.round($fsm0.random(0, $fsm0.nx - $fsm17.type.size)),
        y: 0
    };
};
$fsm0.run = function run() {
    $fsm18 = fsm.create(arguments);
    $fsm0.showStats();
    $fsm0.addEvents();
    $fsm18.last = $fsm0.now = $fsm0.timestamp();
    $fsm18.frame = function frame() {
        $fsm19 = fsm.create(arguments);
        $fsm0.now = $fsm0.timestamp();
        $fsm0.update(Math.min(1, ($fsm0.now - $fsm18.last) / 1000));
        $fsm0.draw();
        $fsm0.stats.update();
        $fsm18.last = $fsm0.now;
        $fsm0.requestAnimationFrame($fsm18.frame, $fsm0.canvas);
    };
    $fsm0.resize();
    $fsm0.reset();
    $fsm18.frame();
};
$fsm0.showStats = function showStats() {
    $fsm20 = fsm.create(arguments);
    $fsm0.stats.domElement.id = 'stats';
    $fsm0.get('menu').appendChild($fsm0.stats.domElement);
};
$fsm0.addEvents = function addEvents() {
    $fsm21 = fsm.create(arguments);
    document.addEventListener('keydown', $fsm0.keydown, false);
    window.addEventListener('resize', $fsm0.resize, false);
};
$fsm0.resize = function resize(event) {
    $fsm22 = fsm.create(arguments);
    $fsm0.canvas.width = $fsm0.canvas.clientWidth;
    $fsm0.canvas.height = $fsm0.canvas.clientHeight;
    $fsm0.ucanvas.width = $fsm0.ucanvas.clientWidth;
    $fsm0.ucanvas.height = $fsm0.ucanvas.clientHeight;
    $fsm0.dx = $fsm0.canvas.width / $fsm0.nx;
    $fsm0.dy = $fsm0.canvas.height / $fsm0.ny;
    $fsm0.invalidate();
    $fsm0.invalidateNext();
};
$fsm0.keydown = function keydown(ev) {
    $fsm23 = fsm.create(arguments);
    $fsm23.handled = false;
    if ($fsm0.playing) {
        switch ($fsm23.$arguments0.keyCode) {
        case $fsm0.KEY.LEFT:
            $fsm0.actions.push($fsm0.DIR.LEFT);
            $fsm23.handled = true;
            break;
        case $fsm0.KEY.RIGHT:
            $fsm0.actions.push($fsm0.DIR.RIGHT);
            $fsm23.handled = true;
            break;
        case $fsm0.KEY.UP:
            $fsm0.actions.push($fsm0.DIR.UP);
            $fsm23.handled = true;
            break;
        case $fsm0.KEY.DOWN:
            $fsm0.actions.push($fsm0.DIR.DOWN);
            $fsm23.handled = true;
            break;
        case $fsm0.KEY.ESC:
            $fsm0.lose();
            $fsm23.handled = true;
            break;
        }
    } else if ($fsm23.$arguments0.keyCode == $fsm0.KEY.SPACE) {
        $fsm0.play();
        $fsm23.handled = true;
    }
    if ($fsm23.handled)
        $fsm23.$arguments0.preventDefault();
};
$fsm0.play = function play() {
    $fsm24 = fsm.create(arguments);
    $fsm0.hide('start');
    $fsm0.reset();
    $fsm0.playing = true;
};
$fsm0.lose = function lose() {
    $fsm25 = fsm.create(arguments);
    $fsm0.show('start');
    $fsm0.setVisualScore();
    $fsm0.playing = false;
};
$fsm0.setVisualScore = function setVisualScore(n) {
    $fsm26 = fsm.create(arguments);
    $fsm0.vscore = $fsm26.$arguments0 || $fsm0.score;
    $fsm0.invalidateScore();
};
$fsm0.setScore = function setScore(n) {
    $fsm27 = fsm.create(arguments);
    $fsm0.score = $fsm27.$arguments0;
    $fsm0.setVisualScore($fsm27.$arguments0);
};
$fsm0.addScore = function addScore(n) {
    $fsm28 = fsm.create(arguments);
    $fsm0.score = $fsm0.score + $fsm28.$arguments0;
};
$fsm0.clearScore = function clearScore() {
    $fsm29 = fsm.create(arguments);
    $fsm0.setScore(0);
};
$fsm0.clearRows = function clearRows() {
    $fsm30 = fsm.create(arguments);
    $fsm0.setRows(0);
};
$fsm0.setRows = function setRows(n) {
    $fsm31 = fsm.create(arguments);
    $fsm0.rows = $fsm31.$arguments0;
    $fsm0.step = Math.max($fsm0.speed.min, $fsm0.speed.start - $fsm0.speed.decrement * $fsm0.rows);
    $fsm0.invalidateRows();
};
$fsm0.addRows = function addRows(n) {
    $fsm32 = fsm.create(arguments);
    $fsm0.setRows($fsm0.rows + $fsm32.$arguments0);
};
$fsm0.getBlock = function getBlock(x, y) {
    $fsm33 = fsm.create(arguments);
    return $fsm0.blocks && $fsm0.blocks[$fsm33.$arguments0] ? $fsm0.blocks[$fsm33.$arguments0][$fsm33.$arguments1] : null;
};
$fsm0.setBlock = function setBlock(x, y, type) {
    $fsm34 = fsm.create(arguments);
    $fsm0.blocks[$fsm34.$arguments0] = $fsm0.blocks[$fsm34.$arguments0] || [];
    $fsm0.blocks[$fsm34.$arguments0][$fsm34.$arguments1] = $fsm34.$arguments2;
    $fsm0.invalidate();
};
$fsm0.clearBlocks = function clearBlocks() {
    $fsm35 = fsm.create(arguments);
    $fsm0.blocks = [];
    $fsm0.invalidate();
};
$fsm0.clearActions = function clearActions() {
    $fsm36 = fsm.create(arguments);
    $fsm0.actions = [];
};
$fsm0.setCurrentPiece = function setCurrentPiece(piece) {
    $fsm37 = fsm.create(arguments);
    $fsm0.current = $fsm37.$arguments0 || $fsm0.randomPiece();
    $fsm0.invalidate();
};
$fsm0.setNextPiece = function setNextPiece(piece) {
    $fsm38 = fsm.create(arguments);
    $fsm0.next = $fsm38.$arguments0 || $fsm0.randomPiece();
    $fsm0.invalidateNext();
};
$fsm0.reset = function reset() {
    $fsm39 = fsm.create(arguments);
    $fsm0.dt = 0;
    $fsm0.clearActions();
    $fsm0.clearBlocks();
    $fsm0.clearRows();
    $fsm0.clearScore();
    $fsm0.setCurrentPiece($fsm0.next);
    $fsm0.setNextPiece();
};
$fsm0.update = function update(idt) {
    $fsm40 = fsm.create(arguments);
    if ($fsm0.playing) {
        if ($fsm0.vscore < $fsm0.score)
            $fsm0.setVisualScore($fsm0.vscore + 1);
        $fsm0.handle($fsm0.actions.shift());
        $fsm0.dt = $fsm0.dt + $fsm40.$arguments0;
        if ($fsm0.dt > $fsm0.step) {
            $fsm0.dt = $fsm0.dt - $fsm0.step;
            $fsm0.drop();
        }
    }
};
$fsm0.handle = function handle(action) {
    $fsm41 = fsm.create(arguments);
    switch ($fsm41.$arguments0) {
    case $fsm0.DIR.LEFT:
        $fsm0.move($fsm0.DIR.LEFT);
        break;
    case $fsm0.DIR.RIGHT:
        $fsm0.move($fsm0.DIR.RIGHT);
        break;
    case $fsm0.DIR.UP:
        $fsm0.rotate();
        break;
    case $fsm0.DIR.DOWN:
        $fsm0.drop();
        break;
    }
};
$fsm0.move = function move(dir) {
    $fsm42 = fsm.create(arguments);
    {
        $fsm42.x = $fsm0.current.x;
        $fsm42.y = $fsm0.current.y;
    }
    switch ($fsm42.$arguments0) {
    case $fsm0.DIR.RIGHT:
        $fsm42.x = $fsm42.x + 1;
        break;
    case $fsm0.DIR.LEFT:
        $fsm42.x = $fsm42.x - 1;
        break;
    case $fsm0.DIR.DOWN:
        $fsm42.y = $fsm42.y + 1;
        break;
    }
    if ($fsm0.unoccupied($fsm0.current.type, $fsm42.x, $fsm42.y, $fsm0.current.dir)) {
        $fsm0.current.x = $fsm42.x;
        $fsm0.current.y = $fsm42.y;
        $fsm0.invalidate();
        return true;
    } else {
        return false;
    }
};
$fsm0.rotate = function rotate() {
    $fsm43 = fsm.create(arguments);
    $fsm43.newdir = $fsm0.current.dir == $fsm0.DIR.MAX ? $fsm0.DIR.MIN : $fsm0.current.dir + 1;
    if ($fsm0.unoccupied($fsm0.current.type, $fsm0.current.x, $fsm0.current.y, $fsm43.newdir)) {
        $fsm0.current.dir = $fsm43.newdir;
        $fsm0.invalidate();
    }
};
$fsm0.drop = function drop() {
    $fsm44 = fsm.create(arguments);
    if (!$fsm0.move($fsm0.DIR.DOWN)) {
        $fsm0.addScore(10);
        $fsm0.dropPiece();
        $fsm0.removeLines();
        $fsm0.setCurrentPiece($fsm0.next);
        $fsm0.setNextPiece($fsm0.randomPiece());
        $fsm0.clearActions();
        if ($fsm0.occupied($fsm0.current.type, $fsm0.current.x, $fsm0.current.y, $fsm0.current.dir)) {
            $fsm0.lose();
        }
    }
};
$fsm0.dropPiece = function dropPiece() {
    $fsm45 = fsm.create(arguments);
    $fsm0.eachblock($fsm0.current.type, $fsm0.current.x, $fsm0.current.y, $fsm0.current.dir, function (x, y) {
        $fsm46 = fsm.create(arguments);
        $fsm0.setBlock($fsm46.$arguments0, $fsm46.$arguments1, $fsm0.current.type);
    });
};
$fsm0.removeLines = function removeLines() {
    $fsm47 = fsm.create(arguments);
    {
        $fsm47.x = undefined;
        $fsm47.y = undefined;
        $fsm47.complete = undefined;
        $fsm47.n = 0;
    }
    for ($fsm47.y = $fsm0.ny; $fsm47.y > 0; --$fsm47.y) {
        $fsm47.complete = true;
        for ($fsm47.x = 0; $fsm47.x < $fsm0.nx; ++$fsm47.x) {
            if (!$fsm0.getBlock($fsm47.x, $fsm47.y))
                $fsm47.complete = false;
        }
        if ($fsm47.complete) {
            $fsm0.removeLine($fsm47.y);
            $fsm47.y = $fsm47.y + 1;
            $fsm47.n++;
        }
    }
    if ($fsm47.n > 0) {
        $fsm0.addRows($fsm47.n);
        $fsm0.addScore(100 * Math.pow(2, $fsm47.n - 1));
    }
};
$fsm0.removeLine = function removeLine(n) {
    $fsm48 = fsm.create(arguments);
    {
        $fsm48.x = undefined;
        $fsm48.y = undefined;
    }
    for ($fsm48.y = $fsm48.$arguments0; $fsm48.y >= 0; --$fsm48.y) {
        for ($fsm48.x = 0; $fsm48.x < $fsm0.nx; ++$fsm48.x)
            $fsm0.setBlock($fsm48.x, $fsm48.y, $fsm48.y == 0 ? null : $fsm0.getBlock($fsm48.x, $fsm48.y - 1));
    }
};
$fsm0.invalid = {};
$fsm0.invalidate = function invalidate() {
    $fsm49 = fsm.create(arguments);
    $fsm0.invalid.court = true;
};
$fsm0.invalidateNext = function invalidateNext() {
    $fsm50 = fsm.create(arguments);
    $fsm0.invalid.next = true;
};
$fsm0.invalidateScore = function invalidateScore() {
    $fsm51 = fsm.create(arguments);
    $fsm0.invalid.score = true;
};
$fsm0.invalidateRows = function invalidateRows() {
    $fsm52 = fsm.create(arguments);
    $fsm0.invalid.rows = true;
};
$fsm0.draw = function draw() {
    $fsm53 = fsm.create(arguments);
    $fsm0.ctx.save();
    $fsm0.ctx.lineWidth = 1;
    $fsm0.ctx.translate(0.5, 0.5);
    $fsm0.drawCourt();
    $fsm0.drawNext();
    $fsm0.drawScore();
    $fsm0.drawRows();
    $fsm0.ctx.restore();
};
$fsm0.drawCourt = function drawCourt() {
    $fsm54 = fsm.create(arguments);
    if ($fsm0.invalid.court) {
        $fsm0.ctx.clearRect(0, 0, $fsm0.canvas.width, $fsm0.canvas.height);
        if ($fsm0.playing)
            $fsm0.drawPiece($fsm0.ctx, $fsm0.current.type, $fsm0.current.x, $fsm0.current.y, $fsm0.current.dir);
        {
            $fsm54.x = undefined;
            $fsm54.y = undefined;
            $fsm54.block = undefined;
        }
        for ($fsm54.y = 0; $fsm54.y < $fsm0.ny; $fsm54.y++) {
            for ($fsm54.x = 0; $fsm54.x < $fsm0.nx; $fsm54.x++) {
                if ($fsm54.block = $fsm0.getBlock($fsm54.x, $fsm54.y))
                    $fsm0.drawBlock($fsm0.ctx, $fsm54.x, $fsm54.y, $fsm54.block.color);
            }
        }
        $fsm0.ctx.strokeRect(0, 0, $fsm0.nx * $fsm0.dx - 1, $fsm0.ny * $fsm0.dy - 1);
        $fsm0.invalid.court = false;
    }
};
$fsm0.drawNext = function drawNext() {
    $fsm55 = fsm.create(arguments);
    if ($fsm0.invalid.next) {
        $fsm55.padding = ($fsm0.nu - $fsm0.next.type.size) / 2;
        $fsm0.uctx.save();
        $fsm0.uctx.translate(0.5, 0.5);
        $fsm0.uctx.clearRect(0, 0, $fsm0.nu * $fsm0.dx, $fsm0.nu * $fsm0.dy);
        $fsm0.drawPiece($fsm0.uctx, $fsm0.next.type, $fsm55.padding, $fsm55.padding, $fsm0.next.dir);
        $fsm0.uctx.strokeStyle = 'black';
        $fsm0.uctx.strokeRect(0, 0, $fsm0.nu * $fsm0.dx - 1, $fsm0.nu * $fsm0.dy - 1);
        $fsm0.uctx.restore();
        $fsm0.invalid.next = false;
    }
};
$fsm0.drawScore = function drawScore() {
    $fsm56 = fsm.create(arguments);
    if ($fsm0.invalid.score) {
        $fsm0.html('score', ('00000' + Math.floor($fsm0.vscore)).slice(-5));
        $fsm0.invalid.score = false;
    }
};
$fsm0.drawRows = function drawRows() {
    $fsm57 = fsm.create(arguments);
    if ($fsm0.invalid.rows) {
        $fsm0.html('rows', $fsm0.rows);
        $fsm0.invalid.rows = false;
    }
};
$fsm0.drawPiece = function drawPiece(ctx, type, x, y, dir) {
    $fsm58 = fsm.create(arguments);
    $fsm0.eachblock($fsm58.$arguments1, $fsm58.$arguments2, $fsm58.$arguments3, $fsm58.$arguments4, function (x, y) {
        $fsm59 = fsm.create(arguments);
        $fsm0.drawBlock($fsm58.$arguments0, $fsm59.$arguments0, $fsm59.$arguments1, $fsm58.$arguments1.color);
    });
};
$fsm0.drawBlock = function drawBlock(ctx, x, y, color) {
    $fsm60 = fsm.create(arguments);
    $fsm60.$arguments0.fillStyle = $fsm60.$arguments3;
    $fsm60.$arguments0.fillRect($fsm60.$arguments1 * $fsm0.dx, $fsm60.$arguments2 * $fsm0.dy, $fsm0.dx, $fsm0.dy);
    $fsm60.$arguments0.strokeRect($fsm60.$arguments1 * $fsm0.dx, $fsm60.$arguments2 * $fsm0.dy, $fsm0.dx, $fsm0.dy);
};
$fsm0.run();