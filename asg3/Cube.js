class Cube {
  constructor(color) {
    this.type = 'cube';
    this.color = color;
    this.matrix = new Matrix4();
    this.textureNum = 0;
  }

  render() {
    //var xy = this.position;
    var rgba = this.color;
    //var size = this.size;

    gl.uniform1i(u_whichTexture, this.textureNum);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the matrix into u_ModelMatrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    //Front/back of cube
    drawTriangle3DUV([0.0, 0.0, 0.0,  1.0,1.0,0.0,  1.0,0.0,0.0], [0,0, 1,1, 1,0]);
    drawTriangle3DUV([0.0, 0.0, 0.0,  0.0,1.0,0.0,  1.0,1.0,0.0], [0,0, 0,1, 1,1]);

    drawTriangle3DUV([0.0, 0.0, 1.0,  1.0,1.0,1.0,  1.0,0.0,1.0], [0,0, 1,1, 1,0]);
    drawTriangle3DUV([0.0, 0.0, 1.0,  0.0,1.0,1.0,  1.0,1.0,1.0], [0,0, 0,1, 1,1]);

    //Top/bottom of cube
    drawTriangle3DUV([0.0, 1.0, 0.0,  0.0,1.0,1.0,  1.0,1.0,0.0], [0,0, 0,1, 1,0]);
    drawTriangle3DUV([0.0, 1.0, 1.0,  1.0,1.0,1.0,  1.0,1.0,0.0], [0,1, 1,1, 1,0]);

    drawTriangle3DUV([0.0, 0.0, 0.0,  0.0,0.0,1.0,  1.0,0.0,0.0], [0,0, 0,1, 1,0]);
    drawTriangle3DUV([0.0, 0.0,1.0,  1.0,0.0,1.0,  1.0,0.0,0.0], [0,1, 1,1, 1,0]);

    //Left/right side of cube
    drawTriangle3DUV([0.0, 0.0, 0.0,  0.0,0.0,1.0,  0.0,1.0,0.0], [0,0, 0,1, 1,0]);
    drawTriangle3DUV([0.0,0.0,1.0,   0.0,1.0,1.0,  0.0,1.0,0.0], [0,1, 1,1, 1,0]);

    drawTriangle3DUV([1.0,0.0, 0.0,   1.0,0.0,1.0,  1.0,1.0,0.0], [0,0, 0,1, 1,0]);
    drawTriangle3DUV([1.0,0.0,1.0,   1.0,1.0,1.0,  1.0,1.0,0.0], [0,1, 1,1, 1,0]);
  }

  renderfast() {
    //var xy = this.position;
    var rgba = this.color;
    //var size = this.size;

    gl.uniform1i(u_whichTexture, this.textureNum);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the matrix into u_ModelMatrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    var allverts = [];
    var alluvs = [];
    //Front/back of cube
    allverts = allverts.concat([0.0, 0.0, 0.0,  1.0,1.0,0.0,  1.0,0.0,0.0]);
    alluvs = alluvs.concat([0,0, 1,1, 1,0]);
    allverts = allverts.concat([0.0, 0.0, 0.0,  0.0,1.0,0.0,  1.0,1.0,0.0]);
    alluvs = alluvs.concat([0,0, 0,1, 1,1]);

    allverts = allverts.concat([0.0, 0.0, 1.0,  1.0,1.0,1.0,  1.0,0.0,1.0]);
    alluvs = alluvs.concat([0,0, 1,1, 1,0]);
    allverts = allverts.concat([0.0, 0.0, 1.0,  0.0,1.0,1.0,  1.0,1.0,1.0]); 
    alluvs = alluvs.concat([0,0, 0,1, 1,1]);

    //Top/bottom of cube
    allverts = allverts.concat([0.0, 1.0, 0.0,  0.0,1.0,1.0,  1.0,1.0,0.0]);
    alluvs = alluvs.concat([0,0, 0,1, 1,0]);
    allverts = allverts.concat([0.0, 1.0, 1.0,  1.0,1.0,1.0,  1.0,1.0,0.0]); 
    alluvs = alluvs.concat([0,1, 1,1, 1,0]);

    allverts = allverts.concat([0.0, 0.0, 0.0,  0.0,0.0,1.0,  1.0,0.0,0.0]);
    alluvs = alluvs.concat([0,0, 0,1, 1,0]);
    allverts = allverts.concat([0.0, 0.0,1.0,  1.0,0.0,1.0,  1.0,0.0,0.0]);
    alluvs = alluvs.concat([0,1, 1,1, 1,0]);

    //Left/right side of cube
    allverts = allverts.concat([0.0, 0.0, 0.0,  0.0,0.0,1.0,  0.0,1.0,0.0]);
    alluvs = alluvs.concat([0,0, 0,1, 1,0]);
    allverts = allverts.concat([0.0,0.0,1.0,   0.0,1.0,1.0,  0.0,1.0,0.0]);
    alluvs = alluvs.concat([0,1, 1,1, 1,0]);

    allverts = allverts.concat([1.0,0.0, 0.0,   1.0,0.0,1.0,  1.0,1.0,0.0]);
    alluvs = alluvs.concat([0,0, 0,1, 1,0]);
    allverts = allverts.concat([1.0,0.0,1.0,   1.0,1.0,1.0,  1.0,1.0,0.0]);
    alluvs = alluvs.concat([0,1, 1,1, 1,0]);

    drawTriangle3DUV(allverts, alluvs);
  }
}