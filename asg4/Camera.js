class Camera {
    constructor() {
        this.fov = 60.0;
        this.eye = [0,0,-18];
        this.at = [0,0,-14];
        this.up = [0,1,0];
        this.viewMat = new Matrix4();
        this.viewMat.setLookAt(this.eye[0],this.eye[1],this.eye[2], this.at[0],this.at[1],this.at[2], this.up[0],this.up[1],this.up[2]);
        this.projMat = new Matrix4();
        this.projMat.setPerspective(this.fov, canvas.width / canvas.height, 0.1, 1000);
    }

    moveForward() {
        var d = new Vector3([this.at[0] - this.eye[0], this.at[1] - this.eye[1], this.at[2] - this.eye[2]]);
        d = d.normalize();
        this.eye[0]+=d.elements[0];
        this.eye[1]+=d.elements[1];
        this.eye[2]+=d.elements[2];
        this.at[0]+=d.elements[0];
        this.at[1]+=d.elements[1];
        this.at[2]+=d.elements[2];
        //check ground collision
        if(this.eye[1] < 0) {
            this.eye[1] = 0;
            this.at[1]=d.elements[1];
        }
        //check sky collision
        if(this.eye[1] > 24) {
            this.eye[1] = 24;
            this.at[1]=24+d.elements[1];
        }
        //check skywall collisions
        if(this.eye[0] < -24) {
            this.eye[0] = -24;
            this.at[0]=-24+d.elements[0];
        }
        if(this.eye[0] > 24) {
            this.eye[0] = 24;
            this.at[0]=24+d.elements[0];
        }
        if(this.eye[2] < -24) {
            this.eye[2] = -24;
            this.at[2]=-24+d.elements[1];
        }
        if(this.eye[2] > 24) {
            this.eye[2] = 24;
            this.at[2]=24+d.elements[1];
        }
        //check block collisions
        if(this.blockCollisionCheck()) {
            this.eye[0]-=d.elements[0];
            this.eye[1]-=d.elements[1];
            this.eye[2]-=d.elements[2];
            this.at[0]-=d.elements[0];
            this.at[1]-=d.elements[1];
            this.at[2]-=d.elements[2];
        }
    }

    moveBackward() {
        var d = new Vector3([this.at[0] - this.eye[0], this.at[1] - this.eye[1], this.at[2] - this.eye[2]]);
        d = d.normalize();
        this.eye[0]-=d.elements[0];
        this.eye[1]-=d.elements[1];
        this.eye[2]-=d.elements[2];
        this.at[0]-=d.elements[0];
        this.at[1]-=d.elements[1];
        this.at[2]-=d.elements[2];
        //check ground collision
        if(this.eye[1] < 0) {
            this.eye[1] = 0;
            this.at[1]=-d.elements[1];
        }
        //check sky collision
        if(this.eye[1] > 24) {
            this.eye[1] = 24;
            this.at[1]=24+d.elements[1];
        }
        //check skywall collisions
        if(this.eye[0] < -24) {
            this.eye[0] = -24;
            this.at[0]=-24+d.elements[0];
        }
        if(this.eye[0] > 24) {
            this.eye[0] = 24;
            this.at[0]=24+d.elements[0];
        }
        if(this.eye[2] < -24) {
            this.eye[2] = -24;
            this.at[2]=-24+d.elements[1];
        }
        if(this.eye[2] > 24) {
            this.eye[2] = 24;
            this.at[2]=24+d.elements[1];
        }
        //check block collisions
        if(this.blockCollisionCheck()) {
            this.eye[0]+=d.elements[0];
            this.eye[1]+=d.elements[1];
            this.eye[2]+=d.elements[2];
            this.at[0]+=d.elements[0];
            this.at[1]+=d.elements[1];
            this.at[2]+=d.elements[2];
        }
    }

    moveLeft() {
        var d = new Vector3([this.at[0] - this.eye[0], this.at[1] - this.eye[1], this.at[2] - this.eye[2]]);
        d.mul(-1);
        d = Vector3.cross(d, new Vector3(this.up));
        d = d.normalize();
        this.eye[0]+=d.elements[0];
        this.eye[1]+=d.elements[1];
        this.eye[2]+=d.elements[2];
        this.at[0]+=d.elements[0];
        this.at[1]+=d.elements[1];
        this.at[2]+=d.elements[2];
        //check skywall collisions
        if(this.eye[0] < -24) {
            this.eye[0] = -24;
            this.at[0]=-24+d.elements[0];
        }
        if(this.eye[0] > 24) {
            this.eye[0] = 24;
            this.at[0]=24+d.elements[0];
        }
        if(this.eye[2] < -24) {
            this.eye[2] = -24;
            this.at[2]=-24+d.elements[1];
        }
        if(this.eye[2] > 24) {
            this.eye[2] = 24;
            this.at[2]=24+d.elements[1];
        }
        //check block collisions
        if(this.blockCollisionCheck()) {
            this.eye[0]-=d.elements[0];
            this.eye[1]-=d.elements[1];
            this.eye[2]-=d.elements[2];
            this.at[0]-=d.elements[0];
            this.at[1]-=d.elements[1];
            this.at[2]-=d.elements[2];
        }
    }

    moveRight() {
        var d = new Vector3([this.at[0] - this.eye[0], this.at[1] - this.eye[1], this.at[2] - this.eye[2]]);
        d = Vector3.cross(d, new Vector3(this.up));
        d = d.normalize();
        this.eye[0]+=d.elements[0];
        this.eye[1]+=d.elements[1];
        this.eye[2]+=d.elements[2];
        this.at[0]+=d.elements[0];
        this.at[1]+=d.elements[1];
        this.at[2]+=d.elements[2];
        //check skywall collisions
        if(this.eye[0] < -24) {
            this.eye[0] = -24;
            this.at[0]=-24+d.elements[0];
        }
        if(this.eye[0] > 24) {
            this.eye[0] = 24;
            this.at[0]=24+d.elements[0];
        }
        if(this.eye[2] < -24) {
            this.eye[2] = -24;
            this.at[2]=-24+d.elements[1];
        }
        if(this.eye[2] > 24) {
            this.eye[2] = 24;
            this.at[2]=24+d.elements[1];
        }
        //check block collisions
        if(this.blockCollisionCheck()) {
            this.eye[0]+=d.elements[0];
            this.eye[1]+=d.elements[1];
            this.eye[2]+=d.elements[2];
            this.at[0]+=d.elements[0];
            this.at[1]+=d.elements[1];
            this.at[2]+=d.elements[2];
        }
    }

    rotLeft(alpha) {
        var d = new Vector3([this.at[0] - this.eye[0], this.at[1] - this.eye[1], this.at[2] - this.eye[2]]);
        var dist = d.magnitude();
        let rotMat = new Matrix4();
        rotMat.setRotate(alpha, this.up[0], this.up[1], this.up[2]);
        var d_prime = rotMat.multiplyVector3(d);
        d.elements[0]=this.at[0]+d_prime.elements[0];
        d.elements[1]=this.at[1]+d_prime.elements[1];
        d.elements[2]=this.at[2]+d_prime.elements[2];
        d_prime = new Vector3([d.elements[0]-this.eye[0],d.elements[1]-this.eye[1],d.elements[2]-this.eye[2]]);
        d_prime.normalize();
        d_prime = d_prime.mul(dist);
        this.at[0]=this.eye[0]+d_prime.elements[0];
        this.at[1]=this.eye[1]+d_prime.elements[1];
        this.at[2]=this.eye[2]+d_prime.elements[2];
    }

    rotRight(alpha) {
        var d = new Vector3([this.at[0] - this.eye[0], this.at[1] - this.eye[1], this.at[2] - this.eye[2]]);
        var dist = d.magnitude();
        let rotMat = new Matrix4();
        rotMat.setRotate(-alpha, this.up[0], this.up[1], this.up[2]);
        var d_prime = rotMat.multiplyVector3(d);
        d.elements[0]=this.at[0]+d_prime.elements[0];
        d.elements[1]=this.at[1]+d_prime.elements[1];
        d.elements[2]=this.at[2]+d_prime.elements[2];
        d_prime = new Vector3([d.elements[0]-this.eye[0],d.elements[1]-this.eye[1],d.elements[2]-this.eye[2]]);
        d_prime.normalize();
        d_prime = d_prime.mul(dist);
        this.at[0]=this.eye[0]+d_prime.elements[0];
        this.at[1]=this.eye[1]+d_prime.elements[1];
        this.at[2]=this.eye[2]+d_prime.elements[2];
    }

    rotUp(alpha) {
        var d = new Vector3([this.eye[0] - this.at[0], this.eye[1] - this.at[1], this.eye[2] - this.at[2]]);
        d.normalize();
        var upV3 = new Vector3(this.up);
        var cross = Vector3.cross(d, upV3);
        cross.normalize();
        var recenter = new Vector3([this.at[0] - this.eye[0], this.at[1] - this.eye[1], this.at[2] - this.eye[2]]);
        let rotMat = new Matrix4().setRotate(alpha, cross.elements[0], cross.elements[1], cross.elements[2]);
        recenter = rotMat.multiplyVector3(recenter);
        this.at[0] = this.eye[0] + recenter.elements[0];
        this.at[1] = this.eye[1] + recenter.elements[1];
        this.at[2] = this.eye[2] + recenter.elements[2];
    }

    blockCollisionCheck() {
        for(var i = 0; i < 32; i++) {
            for(var j = 0; j < 32; j++) {
                if(g_map[i][j] >= 1 && g_map[i][j] <=4) {
                    if(this.eye[0] > i-16 && this.eye[0] < i-15 && this.eye[2] > j-16 && this.eye[2] < j-15 && this.eye[1] < g_map[i][j]-0.75) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    bonusCollisionCheck() {
        for(var i = 0; i < 32; i++) {
            for(var j = 0; j < 32; j++) {
                if(g_map[i][j] == 9) {
                    if(this.eye[0] > i-16 && this.eye[0] < i-15 && this.eye[2] > j-16 && this.eye[2] < j-15 && this.eye[1] < g_map[i][j]-0.75) {
                        return [i, j];
                    }
                }
            }
        }
        return [-1, -1];
    }

    findAtMapCoords() {
        var x = Math.floor(this.at[0])+16;
        var y = Math.floor(this.at[2])+16;
        if(x < 0 || y < 0) {
            return [-1,-1];
        }
        return [x,y];
    }
}