$fsm[0].pathWidth = 10;
$fsm[0].wall = 2;
$fsm[0].outerWall = 2;
$fsm[0].width = 25;
$fsm[0].height = 25;
$fsm[0].delay = 1;
$fsm[0].x = $fsm[0].width / 2 | 0;
$fsm[0].y = $fsm[0].height / 2 | 0;
$fsm[0].seed = Math.random() * 100000 | 0;
$fsm[0].wallColor = '#d24';
$fsm[0].pathColor = '#222a33';
$fsm[0].randomGen = function (seed) {
      $fsm[1] = runtime.create(arguments);
      if ($fsm[1].$arguments[0] === undefined)
            $fsm[1].$arguments[0] = performance.now();
      return function () {
            $fsm[2] = runtime.create(arguments);
            $fsm[1].$arguments[0] = ($fsm[1].$arguments[0] * 9301 + 49297) % 233280;
            return $fsm[1].$arguments[0] / 233280;
      };
};
$fsm[0].init = function () {
      $fsm[3] = runtime.create(arguments);
      $fsm[0].offset = $fsm[0].pathWidth / 2 + $fsm[0].outerWall;
      $fsm[0].map = [];
      $fsm[0].canvas = document.querySelector('canvas');
      $fsm[0].ctx = $fsm[0].canvas.getContext('2d');
      $fsm[0].canvas.width = $fsm[0].outerWall * 2 + $fsm[0].width * ($fsm[0].pathWidth + $fsm[0].wall) - $fsm[0].wall;
      $fsm[0].canvas.height = $fsm[0].outerWall * 2 + $fsm[0].height * ($fsm[0].pathWidth + $fsm[0].wall) - $fsm[0].wall;
      $fsm[0].ctx.fillStyle = $fsm[0].wallColor;
      $fsm[0].ctx.fillRect(0, 0, $fsm[0].canvas.width, $fsm[0].canvas.height);
      $fsm[0].random = $fsm[0].randomGen($fsm[0].seed);
      $fsm[0].ctx.strokeStyle = $fsm[0].pathColor;
      $fsm[0].ctx.lineCap = 'square';
      $fsm[0].ctx.lineWidth = $fsm[0].pathWidth;
      $fsm[0].ctx.beginPath();
      for ($fsm[3].i = 0; $fsm[3].i < $fsm[0].height * 2; $fsm[3].i++) {
            $fsm[0].map[$fsm[3].i] = [];
            for ($fsm[3].j = 0; $fsm[3].j < $fsm[0].width * 2; $fsm[3].j++) {
                  $fsm[0].map[$fsm[3].i][$fsm[3].j] = false;
            }
      }
      $fsm[0].map[$fsm[0].y * 2][$fsm[0].x * 2] = true;
      $fsm[0].route = [[
            $fsm[0].x,
            $fsm[0].y
      ]];
      $fsm[0].ctx.moveTo($fsm[0].x * ($fsm[0].pathWidth + $fsm[0].wall) + $fsm[0].offset, $fsm[0].y * ($fsm[0].pathWidth + $fsm[0].wall) + $fsm[0].offset);
};
$fsm[0].init();
$fsm[0].inputWidth = document.getElementById('width');
$fsm[0].inputHeight = document.getElementById('height');
$fsm[0].inputPathWidth = document.getElementById('pathwidth');
$fsm[0].inputWallWidth = document.getElementById('wallwidth');
$fsm[0].inputOuterWidth = document.getElementById('outerwidth');
$fsm[0].inputPathColor = document.getElementById('pathcolor');
$fsm[0].inputWallColor = document.getElementById('wallcolor');
$fsm[0].inputSeed = document.getElementById('seed');
$fsm[0].buttonRandomSeed = document.getElementById('randomseed');
$fsm[0].settings = {
      display: function () {
            $fsm[4] = runtime.create(arguments);
            $fsm[0].inputWidth.value = $fsm[0].width;
            $fsm[0].inputHeight.value = $fsm[0].height;
            $fsm[0].inputPathWidth.value = $fsm[0].pathWidth;
            $fsm[0].inputWallWidth.value = $fsm[0].wall;
            $fsm[0].inputOuterWidth.value = $fsm[0].outerWall;
            $fsm[0].inputPathColor.value = $fsm[0].pathColor;
            $fsm[0].inputWallColor.value = $fsm[0].wallColor;
            $fsm[0].inputSeed.value = $fsm[0].seed;
      },
      check: function () {
            $fsm[5] = runtime.create(arguments);
            if ($fsm[0].inputWidth.value != $fsm[0].width || $fsm[0].inputHeight.value != $fsm[0].height || $fsm[0].inputPathWidth.value != $fsm[0].pathWidth || $fsm[0].inputWallWidth.value != $fsm[0].wall || $fsm[0].inputOuterWidth.value != $fsm[0].outerWall || $fsm[0].inputPathColor.value != $fsm[0].pathColor || $fsm[0].inputWallColor.value != $fsm[0].wallColor || $fsm[0].inputSeed.value != $fsm[0].seed) {
                  $fsm[0].settings.update();
            }
      },
      update: function () {
            $fsm[6] = runtime.create(arguments);
            clearTimeout($fsm[0].timer);
            $fsm[0].width = parseFloat($fsm[0].inputWidth.value);
            $fsm[0].height = parseFloat($fsm[0].inputHeight.value);
            $fsm[0].pathWidth = parseFloat($fsm[0].inputPathWidth.value);
            $fsm[0].wall = parseFloat($fsm[0].inputWallWidth.value);
            $fsm[0].outerWall = parseFloat($fsm[0].inputOuterWidth.value);
            $fsm[0].pathColor = $fsm[0].inputPathColor.value;
            $fsm[0].wallColor = $fsm[0].inputWallColor.value;
            $fsm[0].seed = parseFloat($fsm[0].inputSeed.value);
            $fsm[0].x = $fsm[0].width / 2 | 0;
            $fsm[0].y = $fsm[0].height / 2 | 0;
            $fsm[0].init();
            $fsm[0].loop();
      }
};
$fsm[0].buttonRandomSeed.addEventListener('click', function () {
      $fsm[7] = runtime.create(arguments);
      $fsm[0].inputSeed.value = Math.random() * 100000 | 0;
});
$fsm[0].loop = function () {
      $fsm[8] = runtime.create(arguments);
      $fsm[0].x = $fsm[0].route[$fsm[0].route.length - 1][0] | 0;
      $fsm[0].y = $fsm[0].route[$fsm[0].route.length - 1][1] | 0;
      {
            $fsm[8].directions = [
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
            $fsm[8].alternatives = [];
      }
      for ($fsm[8].i = 0; $fsm[8].i < $fsm[8].directions.length; $fsm[8].i++) {
            if ($fsm[0].map[($fsm[8].directions[$fsm[8].i][1] + $fsm[0].y) * 2] != undefined && $fsm[0].map[($fsm[8].directions[$fsm[8].i][1] + $fsm[0].y) * 2][($fsm[8].directions[$fsm[8].i][0] + $fsm[0].x) * 2] === false) {
                  $fsm[8].alternatives.push($fsm[8].directions[$fsm[8].i]);
            }
      }
      if ($fsm[8].alternatives.length === 0) {
            $fsm[0].route.pop();
            if ($fsm[0].route.length > 0) {
                  $fsm[0].ctx.moveTo($fsm[0].route[$fsm[0].route.length - 1][0] * ($fsm[0].pathWidth + $fsm[0].wall) + $fsm[0].offset, $fsm[0].route[$fsm[0].route.length - 1][1] * ($fsm[0].pathWidth + $fsm[0].wall) + $fsm[0].offset);
                  $fsm[0].timer = setTimeout($fsm[0].loop, $fsm[0].delay);
            } else {
                  console.log('runtime: ' + (performance.now() - $fsm[0].t0));
            }
            return;
      }
      $fsm[0].direction = $fsm[8].alternatives[$fsm[0].random() * $fsm[8].alternatives.length | 0];
      $fsm[0].route.push([
            $fsm[0].direction[0] + $fsm[0].x,
            $fsm[0].direction[1] + $fsm[0].y
      ]);
      $fsm[0].ctx.lineTo(($fsm[0].direction[0] + $fsm[0].x) * ($fsm[0].pathWidth + $fsm[0].wall) + $fsm[0].offset, ($fsm[0].direction[1] + $fsm[0].y) * ($fsm[0].pathWidth + $fsm[0].wall) + $fsm[0].offset);
      $fsm[0].map[($fsm[0].direction[1] + $fsm[0].y) * 2][($fsm[0].direction[0] + $fsm[0].x) * 2] = true;
      $fsm[0].map[$fsm[0].direction[1] + $fsm[0].y * 2][$fsm[0].direction[0] + $fsm[0].x * 2] = true;
      $fsm[0].ctx.stroke();
      $fsm[0].timer = setTimeout($fsm[0].loop, $fsm[0].delay);
};
$fsm[0].settings.display();
$fsm[0].loop();
setInterval($fsm[0].settings.check, 400);
window.onload = function () {
      $fsm[9] = runtime.create(arguments);
      $fsm[0].t0 = performance.now();
      console.log('loading time: ' + $fsm[0].t0);
};

