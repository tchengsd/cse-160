// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  varying vec2 v_UV;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform int u_whichTexture;
  void main() {
    if(u_whichTexture == -2) {
      gl_FragColor = u_FragColor;
    }
    else if(u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1, 1);
    }
    else if(u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    }
    else if(u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    }
    else if(u_whichTexture == 2) {
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    }
    else if(u_whichTexture == 3) {
      gl_FragColor = texture2D(u_Sampler3, v_UV);
    }
    else {
      gl_FragColor = vec4(1,.2,.2,1);  
    }
  }`

// Global variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_ModelMatrix;
let g_globalAngle = 0;
let g_globalAngleY = 0;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_whichTexture;
let u_ViewMatrix;
let u_ProjectionMatrix;
let g_camera;
let g_bonusboxes = 0;

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

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (!a_UV) {
    console.log('Failed to get the storage location of a_UV');
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

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if(!u_ViewMatrix) {
    console.log("Failed to get the storage location of u_ViewMatrix");
    return false;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if(!u_ProjectionMatrix) {
    console.log("Failed to get the storage location of u_ProjectionMatrix");
    return false;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if(!u_Sampler0) {
    console.log("Failed to get the storage location of u_Sampler0");
    return false;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if(!u_Sampler1) {
    console.log("Failed to get the storage location of u_Sampler1");
    return false;
  }

  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if(!u_Sampler2) {
    console.log("Failed to get the storage location of u_Sampler2");
    return false;
  }

  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if(!u_Sampler3) {
    console.log("Failed to get the storage location of u_Sampler3");
    return false;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if(!u_whichTexture) {
    console.log("Failed to get the storage location of u_whichTexture");
    return false;
  }
}

function addActionsForUI() {
  
}

function initTexture0() {
  var image = new Image();
  if(!image) {
    console.log("Failed to create the image object.");
    return false;
  }

  image.onload = function(){sendImagetoTEXTURE0(image);}
  image.src = 'brick.png'

  return true;
}

function sendImagetoTEXTURE0(image) {
  var texture = gl.createTexture();
  if(!texture) {
    console.log("Failed to create the texture object.");
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler0, 0);

  console.log('Finished loadTexture0');
}

function initTexture1() {
  var image = new Image();
  if(!image) {
    console.log("Failed to create the image object.");
    return false;
  }

  image.onload = function(){sendImagetoTEXTURE1(image);}
  image.src = 'sky.png'

  return true;
}

function sendImagetoTEXTURE1(image) {
  var texture = gl.createTexture();
  if(!texture) {
    console.log("Failed to create the texture object.");
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler1, 1);

  console.log('Finished loadTexture1');
}

function initTexture2() {
  var image = new Image();
  if(!image) {
    console.log("Failed to create the image object.");
    return false;
  }

  image.onload = function(){sendImagetoTEXTURE2(image);}
  image.src = 'grass.jpg'

  return true;
}

function sendImagetoTEXTURE2(image) {
  var texture = gl.createTexture();
  if(!texture) {
    console.log("Failed to create the texture object.");
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler2, 2);

  console.log('Finished loadTexture2');
}

function initTexture3() {
  var image = new Image();
  if(!image) {
    console.log("Failed to create the image object.");
    return false;
  }

  image.onload = function(){sendImagetoTEXTURE3(image);}
  image.src = 'bonus.png'

  return true;
}

function sendImagetoTEXTURE3(image) {
  var texture = gl.createTexture();
  if(!texture) {
    console.log("Failed to create the texture object.");
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler3, 3);

  console.log('Finished loadTexture3');
}

function main() {
  webGLSetup();
  connectGLSL();

  addActionsForUI();

  document.onkeydown = keydown;

  initTexture0();
  initTexture1();
  initTexture2();
  initTexture3();

  // Set mouse rotation function
  canvas.addEventListener('mousemove', rotateWithMouse);
  canvas.onmousedown = click;

  // Specify the color for clearing <canvas>
  gl.clearColor(0.5, 0.5, 0.5, 1.0);

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);
  g_camera = new Camera();

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
  
}

function rotateWithMouse(ev) {
  if(ev.movementX < 0){
    g_camera.rotLeft(-ev.movementX);
  } else {
    g_camera.rotRight(ev.movementX);
  }
  g_camera.rotUp(ev.movementY);
}

function ConvertCoordsToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x,y]);
}

function keydown(ev) {
  if(ev.keyCode == 87) {
    g_camera.moveForward();
  } else if(ev.keyCode == 83) {
    g_camera.moveBackward();
  } else if(ev.keyCode == 65) {
    g_camera.moveLeft();
  } else if(ev.keyCode == 68) {
    g_camera.moveRight();
  } else if(ev.keyCode == 81) {
    g_camera.rotLeft(5);
  } else if(ev.keyCode == 69) {
    g_camera.rotRight(5);
  }
  var bonusCheck = g_camera.bonusCollisionCheck();
  if(bonusCheck[0] >= 0) {
    g_map[bonusCheck[0]][bonusCheck[1]] = 0;
    g_bonusboxes++;
  }
  RenderShapes();
}

function click(ev) {
  var coords = g_camera.findAtMapCoords();
  if(coords[0] < 0) {
    return;
  }
  if(ev.buttons == 1) {
    if(g_map[coords[0]][coords[1]] <= 4 && g_map[coords[0]][coords[1]] > 0) {
      g_map[coords[0]][coords[1]]--;
    }
    else{
      console.log("error: could not remove block here");
    }
  } else if(ev.buttons == 4) {
    if(g_map[coords[0]][coords[1]] < 4) {
      g_map[coords[0]][coords[1]]++;
    }
    else{
      console.log("error: could not add block here");
    }
  }
  RenderShapes();
}

var g_map = [
  [4,4,4,4,4,4,4,4,4,4,4,4,4,0,0,0,4,4,4,4,4,4,4,0,0,0,4,4,4,4,4,4],
  [4,3,3,3,3,3,3,3,3,3,3,3,1,0,9,0,1,3,3,3,3,3,1,0,9,0,1,3,3,3,1,4],
  [4,1,1,1,1,1,1,1,1,1,2,2,1,0,0,0,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,4],
  [4,1,0,0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,4],
  [4,1,0,9,0,0,0,9,0,1,2,2,1,0,9,0,0,0,0,0,0,0,0,0,9,0,0,0,9,0,1,4],
  [4,1,0,0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,4],
  [4,1,0,0,0,1,1,1,1,1,2,2,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,4],
  [4,1,0,0,0,1,1,1,1,1,1,2,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,0,0,0,1,4],
  [4,1,0,0,0,1,1,0,0,0,1,2,1,0,9,0,1,1,1,1,1,0,9,0,1,1,1,0,0,0,1,4],
  [4,1,0,0,0,1,1,0,9,0,1,2,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,4],
  [4,1,0,0,0,1,1,0,0,0,1,2,1,0,0,0,1,1,1,0,9,0,0,0,9,0,0,0,9,0,1,4],
  [4,1,0,0,0,1,1,0,0,0,1,2,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,4],
  [4,1,0,0,0,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,4],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,2,2,2,1,0,0,0,1,4],
  [0,9,0,0,0,0,0,0,9,0,0,0,0,0,9,0,1,1,1,0,0,0,1,2,2,2,1,0,0,0,1,4],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,4],
  [4,1,0,0,0,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0],
  [4,1,0,0,0,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,9,0,1,1,0,0,0,9,0],
  [4,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0],
  [4,1,0,0,0,1,1,0,9,0,0,9,0,0,0,0,0,0,0,0,9,0,1,1,1,1,1,1,1,1,1,4],
  [4,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,1,0,0,0,1,4],
  [4,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,2,2,2,2,1,0,9,0,1,4],
  [4,1,0,0,0,1,2,2,2,1,0,0,0,1,2,2,2,2,2,2,2,2,1,1,1,1,1,0,0,0,1,4],
  [4,1,0,0,0,1,2,2,2,1,0,0,0,1,2,2,2,2,2,2,1,1,0,0,0,0,0,0,0,0,1,4],
  [4,1,0,0,0,1,2,2,2,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,4],
  [4,1,0,9,0,1,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,4],
  [4,1,0,0,0,1,2,2,2,1,0,9,0,0,0,0,0,0,0,0,0,0,0,9,0,1,1,0,0,0,1,4],
  [4,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,4],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,9,0,1,4],
  [0,9,0,0,0,0,0,0,0,0,0,9,0,1,2,2,2,2,2,2,2,1,0,0,0,1,1,0,0,0,1,4],
  [0,0,0,0,0,0,0,9,0,0,0,0,0,1,3,3,3,3,3,3,3,1,0,9,0,1,1,1,1,1,1,4],
  [4,4,4,4,4,4,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,4,0,0,0,4,4,4,4,4,4,4]
];

function drawMap() {
  for(var i = 0; i < 32; i++) {
    for(var j = 0; j < 32; j++) {
      if(g_map[i][j] == 9) {
        var bonus = new Cube([1,1,0,1]);
        bonus.textureNum = 3;
        bonus.matrix.translate(i-16,-0.50,j-16);
        bonus.matrix.scale(0.25,0.25,0.25);
        bonus.renderfast();
      }
      else if(g_map[i][j] >= 1) {
        var body = new Cube([1,1,1,1]);
        body.textureNum = 0;
        body.matrix.translate(i-16,-0.75,j-16);
        body.matrix.scale(1,g_map[i][j],1);
        body.renderfast();
      }
    }
  }
}

function RenderShapes() {
  var startTime = performance.now();

  //var projMat = new Matrix4();
  g_camera.projMat.setPerspective(50, canvas.width / canvas.height, 0.1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_camera.projMat.elements);

  //var viewMat = new Matrix4();
  g_camera.viewMat.setLookAt(g_camera.eye[0],g_camera.eye[1],g_camera.eye[2], g_camera.at[0],g_camera.at[1],g_camera.at[2], g_camera.up[0],g_camera.up[1],g_camera.up[2]);
  gl.uniformMatrix4fv(u_ViewMatrix, false, g_camera.viewMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw ground plane
  var ground = new Cube([0.34,0.82,0.255,1]);
  ground.textureNum = 2;
  ground.matrix.translate(0,-0.75,0);
  ground.matrix.scale(50,0,50);
  ground.matrix.translate(-.5,0,-.5);
  ground.renderfast();

  // Draw skybox
  var skybox = new Cube([0.4,0.9,1,1]);
  skybox.textureNum = 1;
  skybox.matrix.scale(50,50,50);
  skybox.matrix.translate(-.5,-.5,-.5);
  skybox.renderfast();

  drawMap();

  // Note performance
  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration), "performance");

  sendTextToHTML(" Bonus boxes: " + g_bonusboxes, "bonus");
  if(g_bonusboxes >= 30) {
    sendTextToHTML("Congratulations! You collected all bonus boxes", "congrats");
  }
}

function sendTextToHTML(text, id) {
  var element = document.getElementById(id);
  if(!element) {
    console.log("Failed to get " + id + " from HTML.");
    return;
  }
  element.innerHTML = text;
}