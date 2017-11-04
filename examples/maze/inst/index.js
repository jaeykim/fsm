$fsm0.pathWidth = 10;
$fsm0.wall = 2;
$fsm0.outerWall = 2;
$fsm0.width = 25;
$fsm0.height = 25;
$fsm0.delay = 1;
$fsm0.x = $fsm0.width / 2 | 0;
$fsm0.y = $fsm0.height / 2 | 0;
$fsm0.seed = Math.random() * 100000 | 0;
$fsm0.wallColor = '#d24';
$fsm0.pathColor = '#222a33';
$fsm0.randomGen = function (seed) {
    $fsm1 = fsm.create(arguments);
    if ($fsm1.$arguments0 === undefined)
        $fsm1.$arguments0 = performance.now();
    return function () {
        $fsm2 = fsm.create(arguments);
        $fsm1.$arguments0 = ($fsm1.$arguments0 * 9301 + 49297) % 233280;
        return $fsm1.$arguments0 / 233280;
    };
};
$fsm0.init = function () {
    $fsm3 = fsm.create(arguments);
    $fsm0.offset = $fsm0.pathWidth / 2 + $fsm0.outerWall;
    $fsm0.map = [];
    $fsm0.canvas = document.querySelector('canvas');
    $fsm0.ctx = $fsm0.canvas.getContext('2d');
    $fsm0.canvas.width = $fsm0.outerWall * 2 + $fsm0.width * ($fsm0.pathWidth + $fsm0.wall) - $fsm0.wall;
    $fsm0.canvas.height = $fsm0.outerWall * 2 + $fsm0.height * ($fsm0.pathWidth + $fsm0.wall) - $fsm0.wall;
    $fsm0.ctx.fillStyle = $fsm0.wallColor;
    $fsm0.ctx.fillRect(0, 0, $fsm0.canvas.width, $fsm0.canvas.height);
    $fsm0.random = $fsm0.randomGen($fsm0.seed);
    $fsm0.ctx.strokeStyle = $fsm0.pathColor;
    $fsm0.ctx.lineCap = 'square';
    $fsm0.ctx.lineWidth = $fsm0.pathWidth;
    $fsm0.ctx.beginPath();
    for ($fsm3.i = 0; $fsm3.i < $fsm0.height * 2; $fsm3.i++) {
        $fsm0.map[$fsm3.i] = [];
        for ($fsm3.j = 0; $fsm3.j < $fsm0.width * 2; $fsm3.j++) {
            $fsm0.map[$fsm3.i][$fsm3.j] = false;
        }
    }
    $fsm0.map[$fsm0.y * 2][$fsm0.x * 2] = true;
    $fsm0.route = [[
            $fsm0.x,
            $fsm0.y
        ]];
    $fsm0.ctx.moveTo($fsm0.x * ($fsm0.pathWidth + $fsm0.wall) + $fsm0.offset, $fsm0.y * ($fsm0.pathWidth + $fsm0.wall) + $fsm0.offset);
};
$fsm0.init();
$fsm0.inputWidth = document.getElementById('width');
$fsm0.inputHeight = document.getElementById('height');
$fsm0.inputPathWidth = document.getElementById('pathwidth');
$fsm0.inputWallWidth = document.getElementById('wallwidth');
$fsm0.inputOuterWidth = document.getElementById('outerwidth');
$fsm0.inputPathColor = document.getElementById('pathcolor');
$fsm0.inputWallColor = document.getElementById('wallcolor');
$fsm0.inputSeed = document.getElementById('seed');
$fsm0.buttonRandomSeed = document.getElementById('randomseed');
$fsm0.settings = {
    display: function () {
        $fsm4 = fsm.create(arguments);
        $fsm0.inputWidth.value = $fsm0.width;
        $fsm0.inputHeight.value = $fsm0.height;
        $fsm0.inputPathWidth.value = $fsm0.pathWidth;
        $fsm0.inputWallWidth.value = $fsm0.wall;
        $fsm0.inputOuterWidth.value = $fsm0.outerWall;
        $fsm0.inputPathColor.value = $fsm0.pathColor;
        $fsm0.inputWallColor.value = $fsm0.wallColor;
        $fsm0.inputSeed.value = $fsm0.seed;
    },
    check: function () {
        $fsm5 = fsm.create(arguments);
        if ($fsm0.inputWidth.value != $fsm0.width || $fsm0.inputHeight.value != $fsm0.height || $fsm0.inputPathWidth.value != $fsm0.pathWidth || $fsm0.inputWallWidth.value != $fsm0.wall || $fsm0.inputOuterWidth.value != $fsm0.outerWall || $fsm0.inputPathColor.value != $fsm0.pathColor || $fsm0.inputWallColor.value != $fsm0.wallColor || $fsm0.inputSeed.value != $fsm0.seed) {
            $fsm0.settings.update();
        }
    },
    update: function () {
        $fsm6 = fsm.create(arguments);
        clearTimeout($fsm0.timer);
        $fsm0.width = parseFloat($fsm0.inputWidth.value);
        $fsm0.height = parseFloat($fsm0.inputHeight.value);
        $fsm0.pathWidth = parseFloat($fsm0.inputPathWidth.value);
        $fsm0.wall = parseFloat($fsm0.inputWallWidth.value);
        $fsm0.outerWall = parseFloat($fsm0.inputOuterWidth.value);
        $fsm0.pathColor = $fsm0.inputPathColor.value;
        $fsm0.wallColor = $fsm0.inputWallColor.value;
        $fsm0.seed = parseFloat($fsm0.inputSeed.value);
        $fsm0.x = $fsm0.width / 2 | 0;
        $fsm0.y = $fsm0.height / 2 | 0;
        $fsm0.init();
        $fsm0.loop();
    }
};
$fsm0.buttonRandomSeed.addEventListener('click', function () {
    $fsm7 = fsm.create(arguments);
    $fsm0.inputSeed.value = Math.random() * 100000 | 0;
});
$fsm0.loop = function () {
    $fsm8 = fsm.create(arguments);
    $fsm0.x = $fsm0.route[$fsm0.route.length - 1][0] | 0;
    $fsm0.y = $fsm0.route[$fsm0.route.length - 1][1] | 0;
    {
        $fsm8.directions = [
            [
                1,
                0
            ],
            [
                -1,
                0
            ],
            [
                0,
                1
            ],
            [
                0,
                -1
            ]
        ];
        $fsm8.alternatives = [];
    }
    for ($fsm8.i = 0; $fsm8.i < $fsm8.directions.length; $fsm8.i++) {
        if ($fsm0.map[($fsm8.directions[$fsm8.i][1] + $fsm0.y) * 2] != undefined && $fsm0.map[($fsm8.directions[$fsm8.i][1] + $fsm0.y) * 2][($fsm8.directions[$fsm8.i][0] + $fsm0.x) * 2] === false) {
            $fsm8.alternatives.push($fsm8.directions[$fsm8.i]);
        }
    }
    if ($fsm8.alternatives.length === 0) {
        $fsm0.route.pop();
        if ($fsm0.route.length > 0) {
            $fsm0.ctx.moveTo($fsm0.route[$fsm0.route.length - 1][0] * ($fsm0.pathWidth + $fsm0.wall) + $fsm0.offset, $fsm0.route[$fsm0.route.length - 1][1] * ($fsm0.pathWidth + $fsm0.wall) + $fsm0.offset);
            $fsm0.timer = setTimeout($fsm0.loop, $fsm0.delay);
        } else {
            console.log('runtime: ' + (performance.now() - $fsm0.t0));
        }
        return;
    }
    $fsm0.direction = $fsm8.alternatives[$fsm0.random() * $fsm8.alternatives.length | 0];
    $fsm0.route.push([
        $fsm0.direction[0] + $fsm0.x,
        $fsm0.direction[1] + $fsm0.y
    ]);
    $fsm0.ctx.lineTo(($fsm0.direction[0] + $fsm0.x) * ($fsm0.pathWidth + $fsm0.wall) + $fsm0.offset, ($fsm0.direction[1] + $fsm0.y) * ($fsm0.pathWidth + $fsm0.wall) + $fsm0.offset);
    $fsm0.map[($fsm0.direction[1] + $fsm0.y) * 2][($fsm0.direction[0] + $fsm0.x) * 2] = true;
    $fsm0.map[$fsm0.direction[1] + $fsm0.y * 2][$fsm0.direction[0] + $fsm0.x * 2] = true;
    $fsm0.ctx.stroke();
    $fsm0.timer = setTimeout($fsm0.loop, $fsm0.delay);
};
$fsm0.settings.display();
$fsm0.loop();
setInterval($fsm0.settings.check, 400);
window.onload = function () {
    $fsm9 = fsm.create(arguments);
    $fsm0.t0 = performance.now();
    console.log('loading time: ' + $fsm0.t0);
};