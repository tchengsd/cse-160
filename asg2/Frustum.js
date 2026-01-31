class Frustum {
  constructor(color) {
    this.type = 'frustum';
    this.color = color;
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
    gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9,rgba[2]*.9,rgba[3]);

    // Bottom of frustum
    for(var angle = 0; angle < 360; angle+=360/8) {
        let angle1 = angle;
        let angle2 = angle+360/8;
        let vec1 = [0.5*Math.cos(angle1*Math.PI/180),0.0,0.5*Math.sin(angle1*Math.PI/180)];
        let vec2 = [0.5*Math.cos(angle2*Math.PI/180),0.0,0.5*Math.sin(angle2*Math.PI/180)];

        drawTriangle3D([0.0, 0.0, 0.0, vec1[0], vec1[1], vec1[2], vec2[0], vec2[1], vec2[2]]);
    }

    //Fake lighting
    gl.uniform4f(u_FragColor, rgba[0], rgba[1],rgba[2],rgba[3]);
    
    //Sides of frustum
    for(var angle = 0; angle < 360; angle+=360/8) {
        let angle1 = angle;
        let angle2 = angle+360/8;
        let vec0 = [0.4*Math.cos(angle1*Math.PI/180),0.4,0.4*Math.sin(angle1*Math.PI/180)];
        let vec1 = [0.5*Math.cos(angle1*Math.PI/180),0.0,0.5*Math.sin(angle1*Math.PI/180)];
        let vec2 = [0.4*Math.cos(angle2*Math.PI/180),0.4,0.4*Math.sin(angle2*Math.PI/180)];

        drawTriangle3D([vec0[0], vec0[1], vec0[2], vec1[0], vec1[1], vec1[2], vec2[0], vec2[1], vec2[2]]);

        vec0 = [0.4*Math.cos(angle2*Math.PI/180),0.4,0.4*Math.sin(angle2*Math.PI/180)];
        vec1 = [0.5*Math.cos(angle2*Math.PI/180),0.0,0.5*Math.sin(angle2*Math.PI/180)];
        vec2 = [0.5*Math.cos(angle1*Math.PI/180),0.0,0.5*Math.sin(angle1*Math.PI/180)];

        drawTriangle3D([vec0[0], vec0[1], vec0[2], vec1[0], vec1[1], vec1[2], vec2[0], vec2[1], vec2[2]]);
    }

    //Fake lighting
    gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8,rgba[2]*.8,rgba[3]);
    // Top of frustum
    for(var angle = 0; angle < 360; angle+=360/8) {
        let angle1 = angle;
        let angle2 = angle+360/8;
        let vec1 = [0.4*Math.cos(angle1*Math.PI/180),0.4,0.4*Math.sin(angle1*Math.PI/180)];
        let vec2 = [0.4*Math.cos(angle2*Math.PI/180),0.4,0.4*Math.sin(angle2*Math.PI/180)];

        drawTriangle3D([0.0, 0.4, 0.0, vec1[0], vec1[1], vec1[2], vec2[0], vec2[1], vec2[2]]);
    }
  }
}