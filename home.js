var objectType = "";
var allShapes = [];
var cnt = 0;
var canvasMain = document.getElementById("canvas");
var canvasDraw = document.getElementById("canvas2");
var contextMain = canvasMain.getContext("2d");
var contextDraw = canvasDraw.getContext("2d");

contextMain.canvas.width = window.innerWidth;
contextMain.canvas.height = window.innerHeight;
contextDraw.canvas.width = window.innerWidth;
contextDraw.canvas.height = window.innerHeight;

// style the context
contextDraw.strokeStyle = "red";
contextDraw.lineWidth = 2;
contextDraw.setLineDash([10]);

contextMain.strokeStyle = "blue";
contextMain.lineWidth = 2;

function draw() {
    allShapes.forEach(shape => {
        if (shape.type === "rectangle") {
            contextMain.beginPath();
            contextMain.rect(shape.x, shape.y, shape.width, shape.height);
            contextMain.closePath();
            contextMain.stroke();
        }
        else if (shape.type === 'circle') {
            var cp1x = shape.cp1x, cp1y = shape.cp1y, cp2x = shape.cp2x, cp2y = shape.cp2y, x = shape.x, y = shape.y, mouseX = shape.mouseX, mouseY = shape.mouseY;
            contextMain.beginPath();
            contextMain.moveTo(cp1x, y);
            contextMain.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
            contextMain.bezierCurveTo(mouseX, mouseY, cp1x, mouseY, cp1x, y);
            contextMain.closePath();
            contextMain.stroke();
        }
        if (shape.type === "point") {
            contextMain.beginPath();
            contextMain.fillStyle = "blue";
            contextMain.arc(shape.x, shape.y, 5, 0, 2 * Math.PI);
            contextMain.stroke();
            contextMain.fill();
        }
    });
}

function setType(_objectType) {
    console.log("_objectType", _objectType)

    if (_objectType === "rectangle") {
        objectType = _objectType;
        drawRectangle();
    } else if (_objectType === "circle") {
        objectType = _objectType;
        drawCircle();
    } else if (_objectType === "point") {
        objectType = _objectType;
        drawPoint()
    } else if (_objectType === "erase") {
        objectType = _objectType;
    } else if (_objectType === "clear") {
        objectType = _objectType;
    }
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect()
    return {
        x: (evt.clientX - rect.left) * canvas.width / rect.width,
        y: (evt.clientY - rect.top) * canvas.height / rect.height,
    };
}

function drawRectangle() {
    context = contextDraw;
    let start = {}

    function startRect(e) {
        start = getMousePos(canvas, e);
    }

    function endRect(e) {
        let { x, y } = getMousePos(canvas, e)
        allShapes.push({ type: "rectangle", x: start.x, y: start.y, width: x - start.x, height: y - start.y, _id: `shape-${cnt}` });
        console.log("allShapes: ", allShapes);
        cnt++;
        draw();
        context.clearRect(0, 0, canvas.width, canvas.height);
        start = {}
        objectType = "";

    }


    function drawMove(e) {
        if (start.x) {
            context.clearRect(0, 0, canvas.width, canvas.height)
            let { x, y } = getMousePos(canvas, e)
            context.beginPath();
            context.rect(start.x, start.y, x - start.x, y - start.y);
            context.strokeStyle = 'red';
            context.stroke();
        }
    }

    canvasDraw.onmouseup = function (e) {
        if (objectType === "rectangle") {
            canvasDraw.style.cursor = "default";
            endRect(e);
        }
    };

    canvasDraw.onmousedown = function (e) {
        if (objectType === "rectangle") {
            canvasDraw.style.cursor = "crosshair";
            startRect(e);
        }
    }

    canvasDraw.onmousemove = drawMove;
}

function drawCircle() {

    var offsetX = canvasDraw.offsetLeft;
    var offsetY = canvasDraw.offsetTop;
    var startX;
    var startY;
    var mouseY, mouseX;
    var isDown = false;

    function drawOval(x, y) {
        contextDraw.clearRect(0, 0, canvasDraw.width, canvasDraw.height);
        contextDraw.beginPath();
        contextDraw.moveTo(startX, startY + (y - startY) / 2);
        contextDraw.bezierCurveTo(startX, startY, x, startY, x, startY + (y - startY) / 2);
        contextDraw.bezierCurveTo(x, y, startX, y, startX, startY + (y - startY) / 2);
        contextDraw.closePath();
        contextDraw.stroke();
    }

    function handleMouseDown(e) {

        e.preventDefault();
        e.stopPropagation();
        let { x, y } = getMousePos(canvasDraw, e);
        startX = x;
        startY = y;
        isDown = true;
    }

    function handleMouseUp(e) {
        if (!isDown) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        isDown = false;

        allShapes.push({ type: "circle", cp1x: startX, cp1y: startY, cp2x: mouseX, cp2y: startY, x: mouseX, y: startY + (mouseY - startY) / 2, mouseX, mouseY, _id: `shape-${cnt}` });
        console.log("allShapes: ", allShapes);
        cnt++;

        draw();
        contextDraw.clearRect(0, 0, canvasDraw.width, canvasDraw.height);
        objectType = "";

    }

    function handleMouseOut(e) {
        if (!isDown) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        isDown = false;
    }

    function handleMouseMove(e) {
        if (!isDown) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        let { x, y } = getMousePos(canvasDraw, e)
        mouseX = x;
        mouseY = y;
        drawOval(mouseX, mouseY);
    }

    canvasDraw.onmouseup = function (e) {
        if (objectType === "circle") {
            handleMouseUp(e);
        }
    };

    canvasDraw.onmousedown = function (e) {
        if (objectType === "circle") {
            handleMouseDown(e);
        }
    }

    canvasDraw.onmousemove = handleMouseMove;

    canvasDraw.onmouseout = (function (e) {
        if (objectType === "circle") {
            handleMouseOut(e);
        }
    });



}

function drawPoint(e) {
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect()
        return {
            x: (evt.clientX - rect.left) * canvas.width / rect.width,
            y: (evt.clientY - rect.top) * canvas.height / rect.height,
        };
    }

    function handleMouseClick(e) {
        var mousePos = getMousePos(canvasDraw, e);

        allShapes.push({ type: "point", x: mousePos.x, y: mousePos.y, _id: `shape-${cnt}` });
        console.log("allShapes: ", allShapes);
        cnt++;
        draw();
        objectType = "";

    }
    canvasDraw.onclick = function (e) {
        if (objectType === "point") {
            handleMouseClick(e);

        }
    }
}

// function drag(_shape) {

//     var canvas;
//     var ctx;
//     var x = 75;
//     var y = 50;
//     var WIDTH = 400;
//     var HEIGHT = 300;
//     var dragok = false;

//     function rect(x, y, w, h) {
//         ctx.beginPath();
//         ctx.rect(x, y, w, h);
//         ctx.closePath();
//         ctx.fill();
//     }

//     function clear() {
//         ctx.clearRect(0, 0, WIDTH, HEIGHT);
//     }

//     function init() {
//         canvas = document.getElementById("canvas");
//         ctx = canvas.getContext("2d");
//         return setInterval(draw, 10);
//     }

//     function draw() {
//         clear();
//         ctx.fillStyle = "#FAF7F8";
//         rect(0, 0, WIDTH, HEIGHT);
//         ctx.fillStyle = "#444444";
//         rect(x - 15, y - 15, 30, 30);
//     }

//     function myMove(e) {
//         if (dragok) {
//             x = e.pageX - canvas.offsetLeft;
//             y = e.pageY - canvas.offsetTop;
//         }
//     }

//     function myDown(e) {
//         if (e.pageX < x + 15 + canvas.offsetLeft && e.pageX > x - 15 +
//             canvas.offsetLeft && e.pageY < y + 15 + canvas.offsetTop &&
//             e.pageY > y - 15 + canvas.offsetTop) {
//             x = e.pageX - canvas.offsetLeft;
//             y = e.pageY - canvas.offsetTop;
//             dragok = true;
//             canvas.onmousemove = myMove;
//         }
//     }

//     function myUp() {
//         dragok = false;
//         canvas.onmousemove = null;
//     }

//     init();
//     canvas.onmousedown = myDown;
//     canvas.onmouseup = myUp;
// }
// draw image
make_base()

function make_base() {
    base_image = new Image();
    base_image.src = './images.jpeg';
    base_image.id = 'image';
    base_image.onload = function () {
        contextMain.drawImage(base_image, 0, 0, canvasMain.width, canvasMain.height);
    }

}

// https://codepen.io/atindo23/pen/OJLbdrJ
// https://riptutorial.com/html5-canvas/example/18918/dragging-circles---rectangles-around-the-canvas
// https://codepen.io/kanishkkunal/pen/YPPeoW

// drag
// http://jsfiddle.net/KZ99q/
// https://www.youtube.com/watch?v=7PYvx8u_9Sk
