// DrawRectangle.js
function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    // Set buttons
    const button = document.querySelector("#draw");
    button.addEventListener("click", handleDrawEvent);
    const opButton = document.getElementById("drawOp");
    opButton.addEventListener("click", handleDrawOperationEvent);

    // Set text fields
    const v1xField = document.querySelector("#v1x");
    const v1yField = document.querySelector("#v1y");
    const v2xField = document.querySelector("#v2x");
    const v2yField = document.querySelector("#v2y");
    const scalarField = document.getElementById("scalar");
    const operationSelect = document.getElementById("operation-select");

    // Get the rendering context for 2DCG
    var ctx = canvas.getContext('2d');
    
    // Draw a black background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 400, 400);

    function drawVector(v, color) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo(200,200);
        ctx.lineTo(200 + v.elements[0] * 20, 200 - v.elements[1] * 20);
        ctx.stroke();
    }

    function handleDrawEvent() {
        //Clear background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 400, 400);
        //Draw v1
        var v1x = parseFloat(v1xField.value);
        var v1y = parseFloat(v1yField.value);
        var v1 = new Vector3([v1x, v1y, 0]);
        drawVector(v1, "red");
        //Draw v2
        var v2x = parseFloat(v2xField.value);
        var v2y = parseFloat(v2yField.value);
        var v2 = new Vector3([v2x, v2y, 0]);
        drawVector(v2, "blue");
    }

    function handleDrawOperationEvent() {
        //Clear background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 400, 400);
        //Draw v1
        var v1x = parseFloat(v1xField.value);
        var v1y = parseFloat(v1yField.value);
        var v1 = new Vector3([v1x, v1y, 0]);
        drawVector(v1, "red");
        //Draw v2
        var v2x = parseFloat(v2xField.value);
        var v2y = parseFloat(v2yField.value);
        var v2 = new Vector3([v2x, v2y, 0]);
        drawVector(v2, "blue");
        //handle different operations
        var value = operationSelect.value;
        if(value == "add") {
            var v3 = new Vector3([v1x, v1y, 0]);
            v3.add(v2);
            drawVector(v3, "green");
        } if(value == "sub") {
            var v3 = new Vector3([v1x, v1y, 0]);
            v3.sub(v2);
            drawVector(v3, "green");
        } if(value == "mul") {
            var scale = parseFloat(scalarField.value);
            var v3 = new Vector3([v1x, v1y, 0]);
            v3.mul(scale);
            drawVector(v3, "green");
            var v4 = new Vector3([v2x, v2y, 0]);
            v4.mul(scale);
            drawVector(v4, "green");
        } if(value == "div") {
            var scale = parseFloat(scalarField.value);
            var v3 = new Vector3([v1x, v1y, 0]);
            v3.div(scale);
            drawVector(v3, "green");
            var v4 = new Vector3([v2x, v2y, 0]);
            v4.div(scale);
            drawVector(v4, "green");
        } if(value == "mag") {
            console.log("Magnitude v1: ",  v1.magnitude());
            console.log("Magnitude v2: ",  v2.magnitude());
        } if(value == "nor") {
            var v3 = new Vector3([v1x, v1y, 0]);
            v3.normalize();
            drawVector(v3, "green");
            var v4 = new Vector3([v2x, v2y, 0]);
            v4.normalize();
            drawVector(v4, "green");
        } if(value == "ang") {
            var dot = Vector3.dot(v1, v2);
            dot /= v1.magnitude();
            dot /= v2.magnitude();
            var angle = Math.acos(dot);
            console.log("Angle: ", angle * (180 / Math.PI));
        } if(value == "area") {
            var cross = Vector3.cross(v1,v2);
            var area = cross.magnitude() / 2;
            console.log("Area of the triangle: ", area);
        }
    }
}