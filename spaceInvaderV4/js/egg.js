var center;
var radius;
var size;
var leftCircleCenter;
var rightCircleCenter;
var diagonalX;
var diagonalY;
var leftLineEnd;
var rightLineEnd;
var initial = true;
var instruction = document.querySelector('.post-meta');

var steps = [
    function() {
        stroke('rgba(0, 0, 0, 0)');
        // draw left circle
        leftCircleCenter = createVector(center.x - radius / 2, center.y);
        ellipse(leftCircleCenter.x, leftCircleCenter.y, size, size);
    },
    function() {
        // draw right circle
        rightCircleCenter = createVector(center.x + radius / 2, center.y);
        ellipse(rightCircleCenter.x, rightCircleCenter.y, size, size);
    },
    function() {
        // draw left diagonal
        diagonalX = radius * cos(QUARTER_PI * 7);
        diagonalY = radius * sin(QUARTER_PI * 7);
        leftLineEnd = createVector(leftCircleCenter.x + diagonalX, leftCircleCenter.y + diagonalY);
        line(leftCircleCenter.x, leftCircleCenter.y, leftLineEnd.x, leftLineEnd.y);
    }, function() {
        // draw right diagonal
        rightLineEnd = createVector(rightCircleCenter.x - diagonalX, rightCircleCenter.y + diagonalY);
        line(rightCircleCenter.x, rightCircleCenter.y, rightLineEnd.x, rightLineEnd.y);
    }, function() {
        // draw top part of the egg
        stroke('rgba(255,170,51,0.5)');
        fill(color('#FA3'));
        strokeWeight(1);
        push();
        var triangleTop = createVector(center.x, center.y - radius / 2);
        var diagonalShortSideLength = leftLineEnd.dist(triangleTop);
        var topArcSize = diagonalShortSideLength * 2;
        translate(triangleTop.x, triangleTop.y);
        arc(0, 0, topArcSize, topArcSize, QUARTER_PI * 5, QUARTER_PI * 7);
        pop();
    }, function() {
        // draw right side of the egg
        push();
        translate(leftCircleCenter.x, leftCircleCenter.y);
        arc(0, 0, radius * 2, radius * 2, QUARTER_PI * 7, TWO_PI);
        pop();
    }, function() {
        // draw bottom of the egg
        arc(center.x, center.y, radius, radius, 0, PI);
    }, function() {
        // draw left side of the egg
        push();
        translate(rightCircleCenter.x, rightCircleCenter.y);
        arc(0, 0, radius * 2, radius * 2, PI, QUARTER_PI * 5);
        pop();
    }
];

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function drawEgg() {
    clear();
    stroke('#FFAB91');
    strokeWeight(1);
    noFill();

    center = createVector(width / 2, height / 2);
    radius = height / 20;
    size = radius * 2;

    var stepsToDraw = steps.length;
    //if (initial) {
    //    stepsToDraw = steps.length;
    //} else {
    //    var regionWidth = width / steps.length;
    //    var cursor = mouseX ? mouseX : touchX;
    //    for (var i = 1; i <= steps.length; i++) {
    //        var region = regionWidth * i;
    //        if (cursor >= region - regionWidth && cursor <= region) {
    //            stepsToDraw = i;
    //        }
    //    }
    //}
    for (var i = 0; i < stepsToDraw; i++) {
        steps[i]();
    }
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
window.addEventListener('load', function() {
  drawEgg();
});
