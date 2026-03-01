// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec4 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_NormalMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
    v_VertPos = u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  uniform vec3 u_LightPos;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform vec3 u_cameraPos;
  uniform int u_whichTexture;
  uniform bool u_lightOn;

  uniform vec3 u_SpotPos;
  uniform vec3 u_SpotDir;
  uniform float u_SpotCutoff;
  uniform float u_SpotExponent;
  uniform bool u_spotLightOn;

  uniform vec3 u_LightColor;

  void main() {
    if(u_whichTexture == -3) {
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);
    }
    else if(u_whichTexture == -2) {
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

    if(!u_lightOn && !u_spotLightOn) {
      return;
    }

    // ----- Point Light -----
    vec3 lightVector = u_LightPos - vec3(v_VertPos);
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);

    float NDotL = max(dot(N, L), 0.0);

    vec3 R = reflect(-L, N);
    vec3 E = normalize(u_cameraPos - vec3(v_VertPos));

    vec3 specular = u_LightColor * pow(max(dot(E, R), 0.0), 17.5);
    if(u_whichTexture == 1 || u_whichTexture == 2) {
      specular = vec3(0.0);
    }

    vec3 diffuse = u_LightColor * vec3(gl_FragColor) * NDotL;
    vec3 ambient = vec3(gl_FragColor) * 0.3;

    vec3 pointLightColor = vec3(0.0);
    if(u_lightOn) {
      pointLightColor = diffuse + specular;
    }

    // ----- Spot Light -----
    vec3 spotLightColor = vec3(0.0);

    if(u_spotLightOn) {

      vec3 spotVector = u_SpotPos - vec3(v_VertPos);
      vec3 SL = normalize(spotVector);

      float spotEffect = dot(normalize(-u_SpotDir), SL);

      if(spotEffect > u_SpotCutoff) {

        float spotFactor = pow(spotEffect, u_SpotExponent);

        float spotNDotL = max(dot(N, SL), 0.0);

        vec3 spotDiffuse = u_LightColor * vec3(gl_FragColor) * spotNDotL;

        vec3 spotR = reflect(-SL, N);
        vec3 spotSpec = u_LightColor * pow(max(dot(E, spotR), 0.0), 17.5);

        if(u_whichTexture == 1 || u_whichTexture == 2) {
          spotSpec = vec3(0.0);
        }

        spotLightColor = (spotDiffuse + spotSpec) * spotFactor;
      }
    }

    // Final color combination
    gl_FragColor = vec4(ambient + pointLightColor + spotLightColor, 1.0);
  }`

// Global variables
let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
let u_FragColor;
let u_ModelMatrix;
let u_NormalMatrix;
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
let g_normals = false;
let g_bonusboxes = 0;
let g_lightPos = [0,1,-2];
let u_LightPos;
let u_cameraPos;
let u_lightOn;
let u_LightColor;

let g_animationOn = false;

let g_lightColor = [1,1,1];
let g_spotPos = [0, 20, -2];
let g_spotCutoff = 20;
let u_SpotPos;
let u_SpotDir;
let u_SpotCutoff;
let u_SpotExponent;
let u_spotLightOn;
let trumpet;

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

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (!a_Normal) {
    console.log('Failed to get the storage location of a_Normal');
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

  u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (!u_NormalMatrix) {
    console.log('Failed to get the storage location of u_NormalMatrix');
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

  u_LightPos = gl.getUniformLocation(gl.program, 'u_LightPos');
  if(!u_LightPos) {
    console.log("Failed to get the storage location of u_LightPos");
    return false;
  }

  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if(!u_cameraPos) {
    console.log("Failed to get the storage location of u_cameraPos");
    return false;
  }

  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if(!u_lightOn) {
    console.log("Failed to get the storage location of u_lightOn");
    return false;
  }

  u_SpotPos = gl.getUniformLocation(gl.program, 'u_SpotPos');
  if(!u_SpotPos) {
    console.log("Failed to get the storage location of u_SpotPos");
    return false;
  }

  u_SpotDir = gl.getUniformLocation(gl.program, 'u_SpotDir');
  if(!u_SpotDir) {
    console.log("Failed to get the storage location of u_SpotDir");
    return false;
  }

  u_SpotCutoff = gl.getUniformLocation(gl.program, 'u_SpotCutoff');
  if(!u_SpotCutoff) {
    console.log("Failed to get the storage location of u_SpotCutoff");
    return false;
  }

  u_SpotExponent = gl.getUniformLocation(gl.program, 'u_SpotExponent');
  if(!u_SpotExponent) {
    console.log("Failed to get the storage location of u_SpotExponent");
    return false;
  }

  u_spotLightOn = gl.getUniformLocation(gl.program, 'u_spotLightOn');
  if(!u_spotLightOn) {
    console.log("Failed to get the storage location of u_spotLightOn");
    return false;
  }

  u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
  if(!u_LightColor) {
    console.log("Failed to get the storage location of u_LightColor");
    return false;
  }
}

function addActionsForUI() {
  //Slider Events
  document.getElementById('lightXSlide').addEventListener('mousemove', function(ev){if(ev.buttons == 1) {g_lightPos[0] = this.value/100; RenderShapes()}});
  document.getElementById('lightYSlide').addEventListener('mousemove', function(ev){if(ev.buttons == 1) {g_lightPos[1] = this.value/100; RenderShapes()}});
  document.getElementById('lightZSlide').addEventListener('mousemove', function(ev){if(ev.buttons == 1) {g_lightPos[2] = this.value/100; RenderShapes()}});

  document.getElementById('spotXSlide').addEventListener('mousemove', function(ev){if(ev.buttons == 1) {g_spotPos[0] = this.value/100; RenderShapes()}});
  document.getElementById('spotYSlide').addEventListener('mousemove', function(ev){if(ev.buttons == 1) {g_spotPos[1] = this.value/100; RenderShapes()}});
  document.getElementById('spotZSlide').addEventListener('mousemove', function(ev){if(ev.buttons == 1) {g_spotPos[2] = this.value/100; RenderShapes()}});

  document.getElementById('spotWidthSlide').addEventListener('mousemove', function(ev){if(ev.buttons == 1) {g_spotCutoff = this.value; RenderShapes()}});

  document.getElementById('redSlide').addEventListener('mousemove', function(ev){if(ev.buttons == 1) {g_lightColor[0] = this.value / 255; RenderShapes()}});
  document.getElementById('greenSlide').addEventListener('mousemove', function(ev){if(ev.buttons == 1) {g_lightColor[1] = this.value / 255; RenderShapes()}});
  document.getElementById('blueSlide').addEventListener('mousemove', function(ev){if(ev.buttons == 1) {g_lightColor[2] = this.value / 255; RenderShapes()}});

  //Checkbox Events
  document.getElementById('normalBox').addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
      g_normals = true;
    } else {
      g_normals = false;
    }
  });
  document.getElementById('lightOnBox').addEventListener('change', (event) => {
    gl.uniform1i(u_lightOn, event.currentTarget.checked);
  });
  document.getElementById('spotOnBox').addEventListener('change', (event) => {
    gl.uniform1i(u_spotLightOn, event.currentTarget.checked);
  });

  document.getElementById('lightMoveBox').addEventListener('change', (event) => {
    g_animationOn = event.currentTarget.checked;
  });
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

  // load obj
  trumpet = new Model(gl, "trumpet.obj");

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
  if(g_animationOn) {
    g_lightPos[0]=15 * Math.cos(g_seconds / 2);
  }
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
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,1,2,3,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,1,2,3,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,1,2,3,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,3,0,0,0,3,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

function drawMap() {
  for(var i = 0; i < 32; i++) {
    for(var j = 0; j < 32; j++) {
      if(g_map[i][j] >= 1) {
        var body = new Cube([1,1,1,1]);
        if(g_normals) {
          body.textureNum = -3;
        } else {
          body.textureNum = 0;
        }
        body.matrix.translate(i-16,-0.75,j-16);
        body.matrix.scale(1,g_map[i][j],1);
        body.normalMatrix.setInverseOf(body.matrix).transpose();
        body.render();
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

  gl.uniform3f(u_LightPos, g_lightPos[0],g_lightPos[1],g_lightPos[2]);
  gl.uniform3f(u_cameraPos, g_camera.eye[0], g_camera.eye[1], g_camera.eye[2])

  gl.uniform3f(u_SpotPos, g_spotPos[0], g_spotPos[1], g_spotPos[2]);
  gl.uniform1f(u_SpotCutoff, Math.cos(g_spotCutoff * Math.PI / 180));
  gl.uniform1f(u_SpotExponent, 15.0);
  gl.uniform3f(u_SpotDir, 0, -1, 0);

  gl.uniform3f(u_LightColor, g_lightColor[0], g_lightColor[1], g_lightColor[2]);

  // Draw ground plane
  var ground = new Cube([0.34,0.82,0.255,1]);
  ground.textureNum = 2;
  ground.matrix.translate(0,-0.75,0);
  ground.matrix.scale(50,0,50);
  ground.matrix.translate(-.5,0,-.5);
  ground.render();

  // Draw skybox
  var skybox = new Cube([0.4,0.9,1,1]);
  skybox.textureNum = 1;
  if(g_normals) skybox.textureNum = -3;
  skybox.matrix.scale(-50,-50,-50);
  skybox.matrix.translate(-.5,-.5,-.5);
  skybox.render();

  // test draw sphere
  var sphere = new Sphere([1,1,1,1]);
  if(g_normals) sphere.textureNum = -3;
  sphere.matrix.translate(0,0.5,0);
  sphere.render();

  // draw light source
  var light = new Cube([1,1,0,1]);
  light.textureNum = -2;
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(-.1,-.1,-.1);
  light.matrix.translate(-0.5,-.5,-.5);
  light.render();

  // draw spotlight
  var spot = new Cube([1,0.6,0,1]);
  spot.textureNum = -2;
  spot.matrix.translate(g_spotPos[0], g_spotPos[1], g_spotPos[2]);
  spot.matrix.scale(-.1,-.1,-.1);
  spot.matrix.translate(-0.5,-.5,-.5);
  spot.render();

  // draw trumpet
  trumpet.color = [0.0,0.74,0.54,1.0]
  if(g_normals) trumpet.textureNum = -3; else trumpet.textureNum = -2;
  trumpet.matrix.setTranslate(-10,1,0);
  trumpet.matrix.scale(0.1,0.1,0.1);
  //trumpet.matrix.rotate(60, 1, 1, 0);
  trumpet.render();

  drawMap();

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