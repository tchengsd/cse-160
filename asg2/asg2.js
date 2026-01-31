// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

// Constants
const BAY = [0.61, 0.321, 0.067, 1];
const CHESTNUT = [0.87,0.55,0.24,1];
const BLACK = [0.235,0.235,0.235, 1];
const GRAY = [0.83,0.83,0.83,1];

// Global variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
//UI globals
let g_selectedColor = BAY;
let g_selectedSize = 10.0;
let g_circleSegs = 10;
let g_globalAngle = 0;
let g_globalAngleY = 0;
let g_upperLeftLegAngle = 0;
let g_lowerLeftLegAngle = 0;
let g_upperRightLegAngle = 0;
let g_lowerRightLegAngle = 0;
let g_upperHLeftLegAngle = g_upperLeftLegAngle;
let g_lowerHLeftLegAngle = g_lowerLeftLegAngle;
let g_upperHRightLegAngle = g_upperRightLegAngle;
let g_lowerHRightLegAngle = g_lowerRightLegAngle;
let g_neckAngle = 0;
let g_headAngle = 0;
let g_earAngle = 150;
let g_tailAngle = 150;
let g_legAnimation = false;
let g_neckAnimation = false;
let g_tailAnimation = false;
let g_specialAnimation = false;

function webGLSetup(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }
}

function addActionsForUI() {
  //Button Events
  document.getElementById('bayButton').onclick = function() {g_selectedColor = BAY;};
  document.getElementById('chestnutButton').onclick = function() {g_selectedColor = CHESTNUT;};
  document.getElementById('blackButton').onclick = function() {g_selectedColor = BLACK;};
  document.getElementById('grayButton').onclick = function() {g_selectedColor = GRAY;};

  //Slider Events
  document.getElementById('angleSlide').addEventListener('mousemove', function(){g_globalAngle = this.value; RenderShapes()});
  document.getElementById('upperLeftSlide').addEventListener('mousemove', function(){g_upperLeftLegAngle = this.value; g_upperHLeftLegAngle = this.value; RenderShapes()});
  document.getElementById('lowerLeftSlide').addEventListener('mousemove', function(){g_lowerLeftLegAngle = this.value; g_lowerHLeftLegAngle = this.value; RenderShapes()});
  document.getElementById('upperRightSlide').addEventListener('mousemove', function(){g_upperRightLegAngle = this.value; g_upperHRightLegAngle = this.value; RenderShapes()});
  document.getElementById('lowerRightSlide').addEventListener('mousemove', function(){g_lowerRightLegAngle = this.value; g_lowerHRightLegAngle = this.value; RenderShapes()});
  document.getElementById('neckSlide').addEventListener('mousemove', function(){g_neckAngle = this.value; RenderShapes()});
  document.getElementById('headSlide').addEventListener('mousemove', function(){g_headAngle = this.value; RenderShapes()});
  document.getElementById('earSlide').addEventListener('mousemove', function(){g_earAngle = this.value; RenderShapes()});
  document.getElementById('tailSlide').addEventListener('mousemove', function(){g_tailAngle = this.value; RenderShapes()});

  document.getElementById('webgl').addEventListener('click', (event) => {
    if(event.shiftKey) {
      if(g_specialAnimation) {
        g_specialAnimation = false;
      } else {
        g_specialAnimation = true;
      }
    }
  });

  //Checkbox Events
  document.getElementById('neckAnimBox').addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
      g_neckAnimation = true;
    } else {
      g_neckAnimation = false;
    }
  });

  document.getElementById('legAnimBox').addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
      g_legAnimation = true;
    } else {
      g_legAnimation = false;
    }
  });

  document.getElementById('tailAnimBox').addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
      g_tailAnimation = true;
    } else {
      g_tailAnimation = false;
    }
  });
}

function main() {
  webGLSetup();
  connectGLSL();

  addActionsForUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousemove = function(ev){if(ev.buttons == 1) {rotateWithMouse(ev);}};

  // Specify the color for clearing <canvas>
  gl.clearColor(0.5, 0.5, 0.5, 1.0);

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);

  //RenderShapes();
  requestAnimationFrame(tick);
}

let g_startTime = performance.now() / 1000.0;
let g_seconds = performance.now() / 1000.0 - g_startTime;

function tick() {
  // Save current time
  g_seconds = performance.now() / 1000.0 - g_startTime;
  //console.log(performance.now());

  // Update angles
  updateAnimationAngles();

  // Draw the canvas
  RenderShapes();
  // Request the next frame
  requestAnimationFrame(tick);
  
} 

function updateAnimationAngles() {
  if(g_legAnimation) {
    g_upperLeftLegAngle = (45*Math.sin(8* g_seconds));
    g_lowerLeftLegAngle = -(22.5 + (22.5*Math.sin(8* g_seconds)));

    g_upperRightLegAngle = (45*Math.sin(8* g_seconds + 0.7));
    g_lowerRightLegAngle = -(22.5 + (22.5*Math.sin(8* g_seconds + 0.7)));

    g_upperHLeftLegAngle = g_upperLeftLegAngle;
    g_lowerHLeftLegAngle = g_lowerLeftLegAngle;
    g_upperHRightLegAngle = g_upperRightLegAngle;
    g_lowerHRightLegAngle = g_lowerRightLegAngle;
  } else if(g_specialAnimation) {
    g_upperLeftLegAngle = 0;
    g_lowerLeftLegAngle = 0;
    g_upperRightLegAngle = 0;
    g_lowerRightLegAngle = 0;

    g_upperHLeftLegAngle = 0;
    g_lowerHLeftLegAngle = 0;
    g_upperHRightLegAngle = -45 + (45*Math.sin(4* g_seconds));
    g_lowerHRightLegAngle = -(35 + (35*Math.sin(8* g_seconds)));
  }
  if(g_neckAnimation) {
    g_neckAngle = (10*Math.sin(8* g_seconds));
  }
  if(g_tailAnimation) {
    g_tailAngle = 90 + (20*Math.sin(8* g_seconds));
  }
}

function rotateWithMouse(ev) {
  [x,y] = ConvertCoordsToGL(ev);
  g_globalAngle = -180 * x;
  g_globalAngleY = 180 * y;
}

function ConvertCoordsToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x,y]);
}

function ConvertCoordsToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x,y]);
}

function RenderShapes() {
  var startTime = performance.now();

  var globalRotMat = new Matrix4().rotate(g_globalAngle,0,1,0);
  globalRotMat.rotate(g_globalAngleY, 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw body
  var body = new Cube(g_selectedColor);
  body.matrix.translate(-.6,-0.2, 0.0);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(1,0.4,0.4);
  body.render();

  // Draw front left leg (upper)
  var leftFleg = new Cube(g_selectedColor);
  leftFleg.matrix.setTranslate(0.35, -.18, 0);
  leftFleg.matrix.rotate(-5,1,0,0);
  leftFleg.matrix.rotate(180-g_upperLeftLegAngle,0,0,1);
  var leftFCoords = new Matrix4(leftFleg.matrix);
  leftFleg.matrix.scale(0.08, .2, .08);
  leftFleg.matrix.translate(-.5, 0, 0);
  leftFleg.render();

  // Draw front left leg (lower)
  var leftFlegL = new Cube(g_selectedColor);
  leftFlegL.matrix = leftFCoords;
  leftFlegL.matrix.translate(0.0, 0.19, -0.001);
  leftFlegL.matrix.rotate(g_lowerLeftLegAngle, 0, 0, 1);
  var leftFLCoords = new Matrix4(leftFlegL.matrix);
  leftFlegL.matrix.scale(0.075, .2, .075);
  leftFlegL.matrix.translate(-0.5, 0.0, 0.0);
  leftFlegL.render();

  // Draw front left hoof
  var leftFHoof = new Frustum([0.1,0.1,0.1,1]);
  leftFHoof.matrix = leftFLCoords;
  leftFHoof.matrix.translate(0.0, 0.23, -0.032);
  leftFHoof.matrix.rotate(180, 1, 0, 0); 
  leftFHoof.matrix.scale(0.1,0.15,0.1);
  leftFHoof.matrix.translate(0.0, -0.15, 0.0);
  leftFHoof.render();

  // Draw front right leg (upper)
  var rightFleg = new Cube(g_selectedColor);
  rightFleg.matrix.setTranslate(0.35, -.2, -0.325);
  rightFleg.matrix.rotate(-5,1,0,0);
  rightFleg.matrix.rotate(180-g_upperRightLegAngle,0,0,1);
  var rightFCoords = new Matrix4(rightFleg.matrix);
  rightFleg.matrix.scale(0.08, .2, .08);
  rightFleg.matrix.translate(-.5, 0, 0);
  rightFleg.render();

  // Draw front right leg (lower)
  var rightFlegL = new Cube(g_selectedColor);
  rightFlegL.matrix = rightFCoords;
  rightFlegL.matrix.translate(0.0, 0.19, -0.001);
  rightFlegL.matrix.rotate(g_lowerRightLegAngle, 0, 0, 1);
  var rightFLCoords = new Matrix4(rightFlegL.matrix);
  rightFlegL.matrix.scale(0.075, .2, .075);
  rightFlegL.matrix.translate(-0.5, 0.0, 0.0);
  rightFlegL.render();

  // Draw front right hoof
  var rightFHoof = new Frustum([0.1,0.1,0.1,1]);
  rightFHoof.matrix = rightFLCoords;
  rightFHoof.matrix.translate(0.0, 0.23, -0.032);
  rightFHoof.matrix.rotate(180, 1, 0, 0); 
  rightFHoof.matrix.scale(0.1,0.15,0.1);
  rightFHoof.matrix.translate(0.0, -0.15, 0.0);
  rightFHoof.render();

  // Draw hind left leg (upper)
  var leftHleg = new Cube(g_selectedColor);
  leftHleg.matrix.setTranslate(-0.55, -.18, 0);
  leftHleg.matrix.rotate(-5,1,0,0);
  leftHleg.matrix.rotate(-(180-g_upperHLeftLegAngle),0,0,1);
  var leftHCoords = new Matrix4(leftHleg.matrix);
  leftHleg.matrix.scale(0.08, .2, .08);
  leftHleg.matrix.translate(-.5, 0, 0);
  leftHleg.render();

  // Draw hind left leg (lower)
  var leftHlegL = new Cube(g_selectedColor);
  leftHlegL.matrix = leftHCoords;
  leftHlegL.matrix.translate(0.0, 0.19, -0.001);
  leftHlegL.matrix.rotate(-g_lowerHLeftLegAngle, 0, 0, 1);
  var leftHLCoords = new Matrix4(leftHlegL.matrix);
  leftHlegL.matrix.scale(0.075, .2, .075);
  leftHlegL.matrix.translate(-0.5, 0.0, 0.0);
  leftHlegL.render();

  // Draw hind left hoof
  var leftHHoof = new Frustum([0.1,0.1,0.1,1]);
  leftHHoof.matrix = leftHLCoords;
  leftHHoof.matrix.translate(0.0, 0.23, -0.032);
  leftHHoof.matrix.rotate(180, 1, 0, 0); 
  leftHHoof.matrix.scale(0.1,0.15,0.1);
  leftHHoof.matrix.translate(0.0, -0.15, 0.0);
  leftHHoof.render();

  // Draw hind right leg (upper)
  var rightHleg = new Cube(g_selectedColor);
  rightHleg.matrix.setTranslate(-0.55, -.2, -0.325);
  rightHleg.matrix.rotate(-5,1,0,0);
  rightHleg.matrix.rotate(-(180-g_upperHRightLegAngle),0,0,1);
  var rightHCoords = new Matrix4(rightHleg.matrix);
  rightHleg.matrix.scale(0.08, .2, .08);
  rightHleg.matrix.translate(-.5, 0, 0);
  rightHleg.render();

  // Draw hind right leg (lower)
  var rightHlegL = new Cube(g_selectedColor);
  rightHlegL.matrix = rightHCoords;
  rightHlegL.matrix.translate(0.0, 0.19, -0.001);
  rightHlegL.matrix.rotate(-g_lowerHRightLegAngle, 0, 0, 1);
  var rightHLCoords = new Matrix4(rightHlegL.matrix);
  rightHlegL.matrix.scale(0.075, .2, .075);
  rightHlegL.matrix.translate(-0.5, 0.0, 0.0);
  rightHlegL.render();

  // Draw hind right hoof
  var rightHHoof = new Frustum([0.1,0.1,0.1,1]);
  rightHHoof.matrix = rightHLCoords;
  rightHHoof.matrix.translate(0.0, 0.23, -0.032);
  rightHHoof.matrix.rotate(180, 1, 0, 0); 
  rightHHoof.matrix.scale(0.1,0.15,0.1);
  rightHHoof.matrix.translate(0.0, -0.15, 0.0);
  rightHHoof.render();

  //Draw neck
  var neck = new Frustum(g_selectedColor);
  neck.matrix.setTranslate(0.25,0.05,-0.225);
  neck.matrix.rotate(-5, 1, 0, 0);
  neck.matrix.rotate(g_neckAngle-45, 0, 0, 1);
  var neckCoords = new Matrix4(neck.matrix);
  neck.matrix.scale(0.33,1.3,0.33);
  neck.render();

  //Draw head
  var head = new Frustum(g_selectedColor);
  head.matrix = neckCoords;
  head.matrix.translate(-0.14, 0.5, 0.0);
  head.matrix.rotate(g_headAngle-100, 0, 0, 1);
  var headCoords = new Matrix4(head.matrix);
  head.matrix.scale(0.3, 1.1, .3);
  head.matrix.translate(-0.15, 0, 0);
  head.render();

  //Draw left ear
  var leftEar = new Frustum(g_selectedColor);
  leftEar.matrix = new Matrix4(headCoords);
  leftEar.matrix.translate(-0.15, 0.05, 0.07);
  leftEar.matrix.rotate(g_earAngle, 0, 0, 1);
  leftEar.matrix.scale(0.05, 0.45, .08);
  leftEar.render();

  //Draw left ear
  var rightEar = new Frustum(g_selectedColor);
  rightEar.matrix = new Matrix4(headCoords);
  rightEar.matrix.translate(-0.15, 0.05, -0.07);
  rightEar.matrix.rotate(g_earAngle, 0, 0, 1);
  rightEar.matrix.scale(0.05, 0.45, .08);
  rightEar.render();

  //Draw tail
  var tail = new Cube([0.1, 0.1, 0.1, 1.0]);
  tail.matrix.setTranslate(-.525,0.1,-0.2);
  tail.matrix.rotate(-5, 1, 0, 0);
  tail.matrix.rotate(g_tailAngle, 0, 0, 1);
  tail.matrix.scale(0.08,0.6,0.08);
  tail.render();

  //Draw left eye
  var leftEye = new Cube([0,0,0,1]);
  leftEye.matrix = new Matrix4(headCoords);
  leftEye.matrix.translate(-0.15,0.15,0.12);
  leftEye.matrix.scale(0.05,0.05,0.05);
  leftEye.render();

  //Draw right eye
  var rightEye = new Cube([0,0,0,1]);
  rightEye.matrix = new Matrix4(headCoords);
  rightEye.matrix.translate(-0.15,0.15,-0.07);
  rightEye.matrix.scale(0.05,0.05,0.05);
  rightEye.render();

  //Draw nose
  var nose = new Frustum([0.3,0.2,0.2,1]);
  nose.matrix = headCoords;
  nose.matrix.translate(-0.045,0.42,0);
  nose.matrix.scale(0.24,0.24,0.24);
  nose.render();

  // Note performance
  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration), "performance");
}

function sendTextToHTML(text, id) {
  var element = document.getElementById(id);
  if(!element) {
    console.log("Failed to get " + id + " from HTML.");
    return;
  }
  element.innerHTML = text;
}