var objectType = "";
var allShapes = [];
var tempShape = {};
var cnt = 0;
var dragOk = false;
var canvasMain = document.getElementById("canvas");
var canvasDraw = document.getElementById("canvas2");
var contextMain = canvasMain.getContext("2d");
var contextDraw = canvasDraw.getContext("2d");

// contextMain.canvas.width = window.innerWidth;
// contextMain.canvas.height = window.innerHeight;
// contextDraw.canvas.width = window.innerWidth;
// contextDraw.canvas.height = window.innerHeight;

contextMain.canvas.width = 498;
contextMain.canvas.height = 340;
contextDraw.canvas.width = 498;
contextDraw.canvas.height = 340;

// style the context
contextMain.strokeStyle = "red";
contextMain.lineWidth = 5;

// contextDraw.strokeStyle = "blue";
contextDraw.fillStyle = "blue";
contextDraw.lineWidth = 1;
// contextDraw.setLineDash([15]);


// drawRect(contextDraw, 100, 100, 50, 50);
// drawEllipse(contextDraw, 185.6, 183.2, 155.8, 73.8)
// drawPoint(contextDraw, 50, 50, 5);

// function drawPoint(ctx, x, y, r) {
//     ctx.fillStyle = "black"
//     ctx.beginPath();
//     ctx.arc(x, y, r, 0, 2 * Math.PI);
//     ctx.fill();
// }

function drawRect(ctx, x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.stroke();
}

function drawEllipse(ctx, x, y, w, h) {
    var kappa = .5522848,
        ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = x + w,           // x-end
        ye = y + h,           // y-end
        xm = x + w / 2,       // x-middle
        ym = y + h / 2;       // y-middle

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    ctx.closePath(); // not used correctly, see comments (use to close off open path)
    ctx.stroke();
}

// console.log("_shape: ", _shape);
// let { x: mx, y: my } = getMousePosFromPercentage(_shape.x, _shape.y);
// let { x: width, y: height } = getMousePosFromPercentage(_shape.width, _shape.height);
// console.log("shape: ", mx, my, width, height);

// contextDraw.beginPath();
// contextDraw.rect(mx, my, width, height);
// contextDraw.closePath();
// contextDraw.stroke();

function draw() {

    var canvas = canvasDraw;
    var ctx = contextDraw;
    var cw = canvas.width;
    var ch = canvas.height;

    // used to calc canvas position relative to window
    function reOffset() {
        // var BB = canvas.getBoundingClientRect();
        offsetX = canvasDraw.offsetLeft;
        offsetY = canvasDraw.offsetTop;
    }

    var offsetX, offsetY;
    reOffset();

    window.onscroll = function (e) { reOffset(); }
    window.onresize = function (e) { reOffset(); }
    canvas.onresize = function (e) { reOffset(); }

    // save relevant information about shapes drawn on the canvas
    // var shapes = allShapes;
    // let shape = { type: "rectangle", x: 44.4335308197074, y: 65.08205396533613, width: 82.40283303571428, height: 111.47475000000009, _id: `shape-${cnt}` }
    // shapes.push([...shapes, shape])

    // drag related vars
    var isDragging = false;
    var startX, startY;

    // hold the index of the shape being dragged (if any)
    var selectedShapeIndex;

    // draw the shapes on the canvas
    drawAll();

    // listen for mouse events
    canvas.onmousedown = handleMouseDown;
    canvas.onmousemove = handleMouseMove;
    canvas.onmouseup = handleMouseUp;
    canvas.onmouseout = handleMouseOut;

    // given mouse X & Y (mx & my) and shape object
    // return true/false whether mouse is inside the shape
    function isMouseInShape(mx, my, shape) {

        if (shape.radius) {
            // this is a circle
            var dx = mx - shape.x;
            var dy = my - shape.y;
            // math test to see if mouse is inside circle
            if (dx * dx + dy * dy < shape.radius * shape.radius) {
                // yes, mouse is inside this circle
                return (true);
            }
        } else if (shape.width) {
            // this is a rectangle
            var rLeft = shape.x;
            var rRight = shape.x + shape.width;
            var rTop = shape.y;
            var rBott = shape.y + shape.height;
            // math test to see if mouse is inside rectangle
            if (mx > rLeft && mx < rRight && my > rTop && my < rBott) {
                return (true);
            }
        }
        // the mouse isn't in any of the shapes
        return (false);
    }

    function handleMouseDown(e) {
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();
        // calculate the current mouse position
        startX = (e.clientX - offsetX);
        startY = (e.clientY - offsetY);
        // test mouse position against all shapes
        // post result if mouse is in a shape
        for (var i = 0; i < allShapes.length; i++) {
            if (isMouseInShape(startX, startY, allShapes[i])) {
                // the mouse is inside this shape
                // select this shape
                selectedShapeIndex = i;
                // set the isDragging flag
                isDragging = true;
                // and return (==stop looking for 
                //     further shapes under the mouse)
                return;
            }
        }
    }

    function handleMouseUp(e) {
        // return if we're not dragging
        if (!isDragging) { return; }
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();
        // the drag is over -- clear the isDragging flag
        isDragging = false;
    }

    function handleMouseOut(e) {
        // return if we're not dragging
        if (!isDragging) { return; }
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();
        // the drag is over -- clear the isDragging flag
        isDragging = false;
    }

    function handleMouseMove(e) {
        // return if we're not dragging
        if (!isDragging) { return; }
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();
        // calculate the current mouse position         
        mouseX = (e.clientX - offsetX);
        mouseY = (e.clientY - offsetY);
        // mouseX = (e.clientX - offsetX);
        // mouseY = (e.clientY - offsetY);
        // how far has the mouse dragged from its previous mousemove position?
        var dx = mouseX - startX;
        var dy = mouseY - startY;

        // move the selected shape by the drag distance
        var selectedShape = allShapes[selectedShapeIndex];
        console.log("selectedShape: ", selectedShape);
        selectedShape.x += dx;
        selectedShape.y += dy;
        console.log("mouseX, mousey: ", mouseX, mouseY, "selectedShape.x , selectedShape.y ", selectedShape.x, selectedShape.y)
        // clear the canvas and redraw all shapes
        drawAll();
        // update the starting drag position (== the current mouse position)
        startX = mouseX;
        startY = mouseY;
    }

    // clear the canvas and 
    // redraw all shapes in their current positions
    function drawAll() {
        // console.log(drawAll);
        // contextMain.clearRect(0, 0, cw, ch);
        contextDraw.clearRect(0, 0, cw, ch);

        for (var i = 0; i < allShapes.length; i++) {
            var shape = allShapes[i];
            make_base();
            // if (shape.type === "rectangle") {
            //     let _shape = { height: 27.940000000000005, type: "rectangle", width: 28.70035807291666, x: 53.49256727430556, y: 30.76249875199681, _id: "shape-0" };
            //     console.log("_shape: ", _shape);
            //     let { x: mx, y: my } = getMousePosFromPercentage(_shape.x, _shape.y);
            //     let { x: width, y: height } = getMousePosFromPercentage(_shape.width, _shape.height);
            //     console.log("shape: ", mx, my, width, height);
            //     // contextMain.beginPath();
            //     // contextMain.rect(mx, my, width, height);
            //     // contextMain.closePath();
            //     // contextMain.stroke();

            //     contextDraw.beginPath();
            //     contextDraw.rect(mx, my, width, height);
            //     contextDraw.closePath();
            //     contextDraw.stroke();
            // }
            // if (shape.type === "circle") {

            // }
            if (shape.type === "point") {
                // contextMain.beginPath();
                // contextMain.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
                // contextMain.stroke();

                contextDraw.beginPath();
                contextDraw.fillStyle = "black"
                let { x, y } = getMousePosFromPercentage(shape.x, shape.y)
                contextDraw.arc(x, y, shape.radius, 0, 2 * Math.PI);
                contextDraw.stroke();
                contextDraw.fill()
            }

        }
    }
    // allShapes.forEach(shape => {
    //     dragShape(canvasMain, contextMain, shape)
    // })
    // allShapes.forEach(shape => {
    //     if (shape.type === "rectangle") {
    //         contextMain.beginPath();
    //         contextMain.rect(shape.x, shape.y, shape.width, shape.height);
    //         contextMain.closePath();
    //         contextMain.stroke();

    //         contextDraw.beginPath();
    //         contextDraw.rect(shape.x, shape.y, shape.width, shape.height);
    //         contextDraw.closePath();
    //         contextMain.stroke();
    //     }
    //     else if (shape.type === 'circle') {
    //         var cp1x = shape.cp1x, cp1y = shape.cp1y, cp2x = shape.cp2x, cp2y = shape.cp2y, x = shape.x, y = shape.y, mouseX = shape.mouseX, mouseY = shape.mouseY;
    //         contextMain.beginPath();
    //         contextMain.moveTo(cp1x, y);
    //         contextMain.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    //         contextMain.bezierCurveTo(mouseX, mouseY, cp1x, mouseY, cp1x, y);
    //         contextMain.closePath();
    //         contextMain.stroke();
    //     }
    //     if (shape.type === "point") {
    //         contextMain.beginPath();
    //         contextMain.fillStyle = "blue";
    //         contextMain.arc(shape.x, shape.y, 5, 0, 2 * Math.PI);
    //         contextMain.stroke();
    //         contextMain.fill();
    //     }
    // });

}
// function dragShape(_canvas, _ctx, shape) {
//     console.log("dragShape.")
//     var canvas = _canvas;
//     var ctx = _ctx;
//     var x = shape.x;
//     var y = shape.y;
//     var width = shape.width;
//     var height = shape.height;
//     var dragok = false;

//     function rect(x, y, w, h) {
//         ctx.beginPath();
//         ctx.rect(x, y, w, h);
//         ctx.closePath();
//         ctx.stroke();
//     }

//     function clear() {
//         ctx.clearRect(0, 0, canvasMain.width, canvasMain.height);
//     }

//     // function init() {
//     //     return setInterval(draw, 10);
//     // }

//     function draw() {
//         console.log("draw.");
//         clear();
//         rect(x, y, width, height);
//     }

//     function myMove(e) {
//         console.log("myMove.");
//         if (dragok) {
//             x = e.pageX - canvas.offsetLeft;
//             y = e.pageY - canvas.offsetTop;
//         }
//     }

//     function myDown(e) {
//         console.log("myDown.");
//         if (e.pageX < x + canvas.offsetLeft && e.pageX > x +
//             canvas.offsetLeft && e.pageY < y + canvas.offsetTop &&
//             e.pageY > y + canvas.offsetTop) {
//             x = e.pageX - canvas.offsetLeft;
//             y = e.pageY - canvas.offsetTop;
//             dragok = true;

//         }
//     }

//     function myUp() {
//         console.log("myUp.");
//         dragok = false;
//         canvas.onmousemove = null;
//         draw()
//     }

//     // init();

//     canvasDraw.onmousedown = myDown;
//     canvasDraw.onmouseup = myUp;
//     canvasDraw.onmousemove = myMove;
// }

function setType(_objectType) {
    console.log("_objectType", _objectType)
    if (_objectType === "rectangle") {
        objectType = _objectType;
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
    console.log(evt)
    console.log(rect)
    let x = (evt.clientX - rect.left) * canvas.width / rect.width;
    let y = (evt.clientY - rect.top) * canvas.height / rect.height;
    console.log("x,y: ", x, y)

    return {
        x, y
    };
}

function getMousePosInPercentage(startX, startY) {
    // xPercent = parseFloat(startX / canvasMain.width * 100);
    // yPercent = parseFloat(startY / canvasMain.height * 100);
    xPercent = parseFloat(startX / canvasMain.width * 100);
    yPercent = parseFloat(startY / canvasMain.height * 100);
    return { x: xPercent, y: yPercent };
}

function getMousePosFromPercentage(startX, startY) {
    console.log("getMousePosFromPercentage: ", startX, startY)
    // xPercent = parseFloat(startX / 100 * canvasMain.width);
    // yPercent = parseFloat(startY / 100 * canvasMain.height);
    orgX = parseFloat(startX / 100 * canvasMain.width);
    orgY = parseFloat(startY / 100 * canvasMain.height);
    console.log("getMousePosFromPercentage: ", orgX, orgY)
    return { x: orgX, y: orgY };
}

// function getSizeInToPercentage(w, h) {
//     return {
//         w: parseFloat(w/100),
//         h: parseFloat(),
//     }
// }

// function getMousePosInPercentage(clientX, clientY) {
//     console.log("canvasMain.width, canvasMain.height", window.screen.width, window.screen.height);
//     return {
//         x: (clientX / window.screen.width) * 100,
//         y: (clientY / window.screen.height) * 100,
//     };
// }

// function percentageIntoPosition(clientX, clientY) {
//     console.log("clientX, clientY:  ", clientX, clientY)
//     return {
//         x: (clientX / 100) * window.screen.width,
//         y: (clientY / 100) * window.screen.height,
//     };
// }

function drawRectangle() {
    context = contextDraw;
    let start = {}

    function startRect(e) {
        start = getMousePos(canvas, e);
        console.log(start)
        console.log("start: ", start);
        // canvasDraw.style.opacity = 1;
    }

    function endRect(e) {
        let { x, y } = getMousePos(canvas, e)
        console.log("start in px: ", start);
        // let { x: mx, y: my } = getMousePosInPercentage(start.x, start.y, e);
        // console.log("start in %: ", mx, my);
        let { x: startX, y: startY } = getMousePosInPercentage(start.x, start.y)
        let { x: width, y: height } = getMousePosInPercentage(x - start.x, y - start.y)
        let shape = { type: "rectangle", x: startX, y: startY, width, height, _id: `shape-${cnt}` }
        allShapes.push(shape);
        tempShape = { ...shape };
        console.log("allShapes: ", shape);
        cnt++;
        contextDraw.beginPath();
        contextDraw.rect(shape.x, shape.y, shape.width, shape.height);
        contextDraw.closePath();
        contextDraw.stroke();
        draw();
        // context.clearRect(0, 0, canvas.width, canvas.height);
        // canvasDraw.style.opacity = 0;
        start = {}
        objectType = "";
    }


    function drawMove(e) {
        if (start.x) {
            context.clearRect(0, 0, canvas.width, canvas.height)
            let { x, y } = getMousePos(canvas, e)
            context.beginPath();
            context.rect(start.x, start.y, x - start.x, y - start.y);
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

function drawOval(x, y, startX, startY) {
    contextDraw.clearRect(0, 0, canvasDraw.width, canvasDraw.height);
    contextDraw.beginPath();
    contextDraw.moveTo(startX, startY + (y - startY) / 2);
    contextDraw.bezierCurveTo(startX, startY, x, startY, x, startY + (y - startY) / 2);
    contextDraw.bezierCurveTo(x, y, startX, y, startX, startY + (y - startY) / 2);
    contextDraw.closePath();
    contextDraw.stroke();
}

function drawCircle() {

    var offsetX = canvasDraw.offsetLeft;
    var offsetY = canvasDraw.offsetTop;
    var startX;
    var startY;
    var mouseY, mouseX;
    var isDown = false;


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
        // contextDraw.clearRect(0, 0, canvasDraw.width, canvasDraw.height);
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
        drawOval(mouseX, mouseY, startX, startY);
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


    function handleMouseClick(e) {
        var mousePos = getMousePos(canvasDraw, e);
        console.log("x, y: ", mousePos.x, mousePos.y);
        let { x, y } = getMousePosInPercentage(mousePos.x, mousePos.y);
        console.log("x, y: ", x, y);
        allShapes.push({ type: "point", x, y, radius: 5, _id: `shape-${cnt}` });
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

// function drag(shape) {
//     dragok = false;
//     canvasMain.style.zIndex = 100;
//     console.log("drag called.");
//     var canvas = canvasMain;
//     var ctx = contextMain;
//     var x = shape.x;
//     var y = shape.y;

//     // function clear() {
//     //     contextMain.clearRect(0, 0, canvasMain.width, canvasMain.height);
//     // }

//     // function rect(x, y, w, h) {
//     //     ctx.beginPath();
//     //     ctx.rect(x, y, w, h);
//     //     ctx.closePath();
//     //     ctx.fill();
//     // }

//     // function init() {
//     //     return setInterval(draw, 10);
//     // }

//     // function draw() {
//     //     // clear();
//     //     if (shape.type === "rectangle") {
//     //         // ctx.fillStyle = "#FAF7F8";
//     //         // rect(x, y, WIDTH, HEIGHT);
//     //         shape.x = x;
//     //         shape.y = y;
//     //         shape.width = WIDTH;
//     //         shape.height = HEIGHT;
//     //     }
//     // }

//     function myMove(e) {
//         console.log("myMove called");
//         if (dragok) {
//             x = e.pageX - canvas.offsetLeft;
//             y = e.pageY - canvas.offsetTop;
//         }
//     }

//     function myDown(e) {
//         let { x: mouseX, y: mouseY } = getMousePos(canvasMain, e);
//         console.log(x, y, mouseX, mouseY)
//         // if (e.pageX < x + 15 + canvas.offsetLeft && e.pageX > x - 15 +
//         //     canvas.offsetLeft && e.pageY < y + 15 + canvas.offsetTop &&
//         //     e.pageY > y - 15 + canvas.offsetTop) {
//         x = e.pageX - canvas.offsetLeft;
//         y = e.pageY - canvas.offsetTop;
//         dragok = true;
//         console.log("myDown called", x, y);
//         canvas.onmousemove = myMove;
//         // }
//     }

//     function myUp() {
//         console.log("myUp called");
//         dragok = false;
//         canvas.onmousemove = null;
//         tempShape = { type: shape.type, x, y, width: shape.width, height: shape.height, _id: shape._id }
//         // canvasMain.style.zIndex = 0;
//     }

//     // init();
//     canvas.onmousedown = myDown;
//     canvas.onmouseup = myUp;
//     return shape;
// }

// draw image


make_base();


function make_base() {
    var image = new Image();
    image.src = "https://cdn.pixabay.com/photo/2015/11/16/14/43/cat-1045782__340.jpg"
    // image.src = "https://c4.wallpaperflare.com/wallpaper/41/681/303/pc-hd-1080p-nature-1920x1080-wallpaper-preview.jpg"
    console.log("image.width, image.height: ", image.width, image.height);
    console.log("image.naturalWidth, image.naturalHeight: ", image.naturalWidth, image.naturalHeight);
    contextMain.drawImage(image, 0, 0, canvasMain.width, canvasMain.height);
    // let imgData = 
    // let block = document.getElementsByClassName("canvas-block");
    // console.log(block)
    // block.style.set = "url('./cat.jpg')";
    // block.style.backgroundRepeat = "no-repeat";
    // block.style.backgroundSize = "contain";
    // block.style.backgroundAttachment = "fixed";

}

// https://codepen.io/atindo23/pen/OJLbdrJ
// https://riptutorial.com/html5-canvas/example/18918/dragging-circles---rectangles-around-the-canvas
// https://codepen.io/kanishkkunal/pen/YPPeoW

// drag
// http://jsfiddle.net/KZ99q/
// https://www.youtube.com/watch?v=7PYvx8u_9Sk
