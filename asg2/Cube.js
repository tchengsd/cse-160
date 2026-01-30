class Cube {
  constructor(segments) {
    this.type = 'cube';
    //this.position = [0.0,0.0,0.0];
    this.color = [1.0,1.0,1.0,1.0];
    //this.size = 10.0;
    //this.segments = segments;
    this.matrix = new Matrix4();
  }

  render() {
    //var xy = this.position;
    var rgba = this.color;
    //var size = this.size;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the matrix into u_ModelMatrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Pass the color of a point to u_FragColor
    gl.uniform4f(u_FragColor, rgba[0], rgba[1],rgba[2],rgba[3]);

    //Front/back of cube
    drawTriangle3D([0.0, 0.0, 0.0,  1.0,1.0,0.0,  1.0,0.0,0.0]);
    drawTriangle3D([0.0, 0.0, 0.0,  0.0,1.0,0.0,  1.0,1.0,0.0]);

    drawTriangle3D([0.0, 0.0, -1.0,  1.0,1.0,-1.0,  1.0,0.0,-1.0]);
    drawTriangle3D([0.0, 0.0, -1.0,  0.0,1.0,-1.0,  1.0,1.0,-1.0]);

    //Fake lighting
    gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9,rgba[2]*.9,rgba[3]);
    //Top/bottom of cube
    drawTriangle3D([0.0, 1.0, 0.0,  0.0,1.0,-1.0,  1.0,1.0,0.0]);
    drawTriangle3D([0.0, 1.0,-1.0,  1.0,1.0,-1.0,  1.0,1.0,0.0]);

    drawTriangle3D([0.0, 0.0, 0.0,  0.0,0.0,-1.0,  1.0,0.0,0.0]);
    drawTriangle3D([0.0, 0.0,-1.0,  1.0,0.0,-1.0,  1.0,0.0,0.0]);

    //Fake lighting
    gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8,rgba[2]*.8,rgba[3]);
    //Left/right side of cube
    drawTriangle3D([0.0, 0.0, 0.0,  0.0,0.0,-1.0,  0.0,1.0,0.0]);
    drawTriangle3D([0.0,0.0,-1.0,   0.0,1.0,-1.0,  0.0,1.0,0.0]);

    drawTriangle3D([1.0,0.0, 0.0,   1.0,0.0,-1.0,  1.0,1.0,0.0]);
    drawTriangle3D([1.0,0.0,-1.0,   1.0,1.0,-1.0,  1.0,1.0,0.0]);
  }
}