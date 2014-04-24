// Get the canvas element from the HTML document
var canvas = document.getElementById( 'canvas' );
// Get the canvas context to draw with
var ctx = canvas.getContext( '2d' );

// Get the canvas width and height for scaling
var width  = canvas.width,
    height = canvas.height;

// Name some basic colors for easy styling
var white = "#FFF"
var black1 = "#000000", black2 = "#171717", black3 = "#2E2E2E",
    black4 = "#454545", black5 = "#5C5C5C", black6 = "#707070",
    black7 = "#828282", black8 = "#999999";
var colors = [black1, black2, black3, black4, black5, black6];

// Setting styles for canvas stroke and fill
ctx.strokeStyle = black7;
ctx.fillStyle   = black8;

// Draw a circle at the given center position
//   center is a [ x, y ] array
//   radius is a float
//   color is a #RGB hex string, or undefined
function drawCircle( center, radius, color ) {
  if (color === undefined) {
    color = black8;
  }
  ctx.beginPath();
  ctx.arc(
    center[0], // center x coordinate
    center[1], // center y coordinate
    radius,    // radius
    0,          // starting angle
    2 * Math.PI // ending angle
  );
  ctx.closePath();

  if ( radius < 1 ) {
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    ctx.strokeStyle = color;
    ctx.stroke();
  }
};

// Transform Leap coordinates to scene coordinates
//   leapPosition is a [ x, y, z ] array
//   returns a [ x, y ] array
function leapToScene( leapPosition, leapScalar ) {
  var canvasPos = [ 0, 0 ];
  canvasPos[0] = width/2 + leapPosition[0];
  canvasPos[1] = height  - leapPosition[1];
  return canvasPos;
};

// Create a Leap controller so we can emit gesture events
var controller = new Leap.Controller( { enableGestures: true } );

// Emit gesture events before emitting frame events
controller.addStep( function( frame ) {
  for ( var g = 0; g < frame.gestures.length; g++ ) {
    var gesture = frame.gestures[g];
    controller.emit( gesture.type, gesture, frame );
  }
  return frame; // Return frame data unmodified
});

// Frame event listener
controller.on( 'frame', function( frame ) {
  // Slowly fade away the last frame's canvas
  ctx.fillStyle = "rgba(256, 256, 256, .02)";
  ctx.fillRect(0, 0, width, height);

  for ( var p = 0; p < frame.pointables.length; p++ ) {
    var finger = frame.pointables[p];
    var pos = finger.tipPosition;
    var position = leapToScene( pos );
    // Choose color based on the finger ID
    var color = colors[finger.id % 6];
    var radius = Math.min(600/Math.abs(pos[2]),20);
    drawCircle( position, radius, color );
  }
});

// Start listening for frames
controller.connect();