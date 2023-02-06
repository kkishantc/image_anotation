var intHighest = 0;
var objType = "";
function setType(_type) {
    objType = _type;
    if (objType === "clear") {
        clearZone();
        objType = "";
    }
    if (objType === "ractangle") {
        document.getElementById("image").click();
    }
    if (objType === "circle") {
        document.getElementById("image").click();
    }

}

function clearZone() {
    const boxes = document.getElementsByClassName('boxNotActive');
    const arrZones = getZones();
    for (const box of boxes) {
        box.addEventListener('click', (event) => {
            let seq = box.id.replace("box", "");
            let zone = arrZones.filter(zone => zone.sequence === seq);
            deleteZone(...zone);
            event.target.remove();
        });
    }



}

// Get ratio (that is: 2 means original has twice the size; 1/2 means original has half the size)
function getImageRatio(_imgElement) {
    return _imgElement.naturalWidth / _imgElement.width;
}

// User has clicked on the image so create a new zone
function newZone(_event) {
    console.log("objType :", objType);
    if (objType === "ractangle") {

        const Canvas = document.createElement("canvas");
        Canvas.id = "canvas";
        Canvas.width = document.getElementById("image").width;
        Canvas.height = document.getElementById("image").height;
        Canvas.style.position = "absolute";
        Canvas.style.top = "40px";
        Canvas.style.left = "8px";
        document.getElementById("main-body").appendChild(Canvas);


        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        canvas.style.cursor = "crosshair";

        // style the context
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;

        // calculate where the canvas is on the window
        // (used to help calculate mouseX/mouseY)
        var canvasOffset = canvas.getBoundingClientRect();
        var offsetX = canvasOffset.left;
        var offsetY = canvasOffset.top;

        // this flage is true when the user is dragging the mouse
        var isDown = false;

        // these vars will hold the starting mouse position
        var startX;
        var startY;

        var objZone, mouseX, mouseY;

        function handleMouseDown(e) {

            e.preventDefault();
            e.stopPropagation();

            // save the starting x/y of the rectangle
            startX = parseInt(e.clientX - offsetX);
            startY = parseInt(e.clientY - offsetY);

            // set a flag indicating the drag has begun
            isDown = true;
        }

        function handleMouseUp(e) {

            e.preventDefault();
            e.stopPropagation();

            // the drag is over, clear the dragging flag
            isDown = false;
            addZone(objZone);
            addZoneBox(objZone, e);
            document.getElementById("canvas").remove();

        }

        function handleMouseOut(e) {

            e.preventDefault();
            e.stopPropagation();

            // the drag is over, clear the dragging flag
            isDown = false;
        }

        function handleMouseMove(e) {

            e.preventDefault();
            e.stopPropagation();

            // if we're not dragging, just return
            if (!isDown) {
                return;
            }

            // get the current mouse position
            mouseX = parseInt(e.clientX - offsetX);
            mouseY = parseInt(e.clientY - offsetY);

            // Put your mousemove stuff here

            // clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // calculate the rectangle width/height based
            // on starting vs current mouse position
            var width = mouseX - startX;
            var height = mouseY - startY;

            // draw a new rect from the start position 
            // to the current mouse position
            ctx.strokeRect(startX, startY, width, height);

            objZone = {
                x: startX + offsetX,
                y: startY + offsetY,
                width: width,
                height: height,
                sequence: getNextZoneSequence(),
                canDelete: true,
                zoneType: "point"
            };
        }

        document.getElementById('canvas').addEventListener('mousedown', function (e) {
            handleMouseDown(e);
        });
        document.getElementById('canvas').addEventListener('mousemove', function (e) {
            handleMouseMove(e);
        });
        document.getElementById('canvas').addEventListener('mouseup', function (e) {
            handleMouseUp(e);
        });
        document.getElementById('canvas').addEventListener('mouseout', function (e) {
            handleMouseOut(e);
        });

    }
    if (objType === "circle") {

        const Canvas = document.createElement("canvas");
        Canvas.id = "canvas";
        Canvas.width = document.getElementById("image").width;
        Canvas.height = document.getElementById("image").height;
        Canvas.style.position = "absolute";
        Canvas.style.top = "40px";
        Canvas.style.left = "8px";
        document.getElementById("main-body").appendChild(Canvas);

        //Canvas
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');

        //Variables
        var canvasOffset = canvas.getBoundingClientRect();
        var canvasx = canvasOffset.left;
        var canvasy = canvasOffset.top;

        var last_mousex = last_mousey = 0;
        var mousex = mousey = 0;
        var mousedown = false;
        var last_mousex, last_mousey, mousey, objZone;

        //Mousedown
        canvas.onmousedown = function (e) {
            last_mousex = parseInt(e.clientX - canvasx);
            last_mousey = parseInt(e.clientY - canvasy);
            mousedown = true;
        };

        //Mouseup
        canvas.onmouseup = function (e) {
            mousedown = false;
            addZone(objZone);
            addZoneBox(objZone, e);
            // document.getElementById("canvas").remove();
        };

        //Mousemove
        canvas.onmousemove = function (e) {
            mousex = parseInt(e.clientX - canvasx);
            mousey = parseInt(e.clientY - canvasy);
            if (mousedown) {
                ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
                //Save
                ctx.save();
                ctx.beginPath();
                //Dynamic scaling
                var scalex = 1 * ((mousex - last_mousex) / 2);
                var scaley = 1 * ((mousey - last_mousey) / 2);
                ctx.scale(scalex, scaley);
                //Create ellipse
                var centerx = (last_mousex / scalex) + 1;
                var centery = (last_mousey / scaley) + 1;
                ctx.arc(centerx, centery, 1, 0, 2 * Math.PI);
                //Restore and draw
                ctx.restore();
                ctx.strokeStyle = 'blue';
                ctx.lineWidth = 2;
                ctx.stroke();
                objZone = {
                    x: mousex,
                    y: mousey,
                    width: scalex + centerx,
                    height: scaley + centery,
                    sequence: getNextZoneSequence(),
                    canDelete: true,
                    zoneType: "circle"
                };
            }

        };

    }

    if (objType === "point") {
        const objZone = {
            x: _event.clientX,
            y: _event.clientY,
            width: 0,
            height: 0,
            sequence: getNextZoneSequence(),
            canDelete: true,
            zoneType: "point"
        };
        addZone(objZone);
        addZoneBox(objZone, _event);
    }

    objType = "";
}

// Draw the box on thge screen for given zone
function addZoneBox(_objZone, _event) {
    let theDiv = null;
    if (_objZone.zoneType === "ractangle") {



        theDiv = document.createElement("div");

        theDiv.className = _objZone.zoneType === "circle" ? "boxNotActive circle" : "boxNotActive";

        theDiv.id = "box" + _objZone.sequence;
        theDiv.style.position = "absolute";
        theDiv.style.top =
            _objZone.y +
            (document.all ? document.body.scrollTop : pageYOffset) +
            "px";
        theDiv.style.left =
            _objZone.x +
            (document.all ? document.body.scrollLeft : pageXOffset) +
            "px";
        theDiv.style.width = _objZone.width + "px";
        theDiv.style.height = _objZone.height + "px";
        theDiv.style.zIndex = _objZone.sequence + 1;
        theDiv.canDelete = _objZone.canDelete;
        makeDraggable(theDiv, _objZone);
        if (objType != "point") {
            makeResizable(theDiv, _objZone);
        }

        document.getElementById("main-body").appendChild(theDiv);
    }
    else {


        theDiv = document.createElement("div");

        theDiv.className = _objZone.zoneType === "circle" ? "boxNotActive circle" : "boxNotActive";

        theDiv.id = "box" + _objZone.sequence;
        theDiv.style.position = "absolute";
        theDiv.style.top =
            _objZone.y +
            (document.all ? document.body.scrollTop : pageYOffset) +
            "px";
        theDiv.style.left =
            _objZone.x +
            (document.all ? document.body.scrollLeft : pageXOffset) +
            "px";
        theDiv.style.width = _objZone.width + "px";
        theDiv.style.height = _objZone.height + "px";
        theDiv.style.zIndex = _objZone.sequence + 1;
        theDiv.canDelete = _objZone.canDelete;
        makeDraggable(theDiv, _objZone);
        if (objType != "point") {
            makeResizable(theDiv, _objZone);
        }

        document.getElementById("main-body").appendChild(theDiv);
    }


    // const numberDiv = document.createElement("div");
    // numberDiv.innerHTML = _objZone.sequence;
    // numberDiv.className = "boxNumber";
    // theDiv.appendChild(numberDiv);
}

// Make element draggable
function makeDraggable(_element, _objZone) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

    _element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Save the original x and y
        _element.orgLeft = _element.style.left;
        _element.orgTop = _element.style.top;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
        _element.className = _objZone.zoneType === "circle" ? "box circle" : "box";

    }

    function elementDrag(e) {
        if (!_element) {
            return;
        }

        e = e || window.event;
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        _element.style.top = _element.offsetTop - pos2 + "px";
        _element.style.left = _element.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;

        _element.className = _objZone.zoneType === "circle" ? "boxNotActive circle" : "boxNotActive";


        const objZone = getZoneFromBox(_element);

        if (zoneOutsideImage(objZone)) {
            deleteZone(objZone);
            document.getElementById("box" + objZone.sequence).remove();
        } else {
            updateZone(objZone);
        }
    }
}

// Make eleemnt resizable by adding dummy divs to the right and to the bottom of element
function makeResizable(_element, _objZone) {
    var startX, startY, startWidth, startHeight;

    var right = document.createElement("div");
    right.className = "resizer-right";
    _element.appendChild(right);
    right.addEventListener("mousedown", initDrag, false);
    right.parentPopup = _element;

    var bottom = document.createElement("div");
    bottom.className = "resizer-bottom";
    _element.appendChild(bottom);
    bottom.addEventListener("mousedown", initDrag, false);
    bottom.parentPopup = _element;

    var both = document.createElement("div");
    both.className = "resizer-both";
    _element.appendChild(both);
    both.addEventListener("mousedown", initDrag, false);
    both.parentPopup = _element;

    function initDrag(e) {
        startX = e.clientX;
        startY = e.clientY;
        e.stopPropagation();
        startWidth = parseInt(
            document.defaultView.getComputedStyle(_element).width,
            10
        );
        startHeight = parseInt(
            document.defaultView.getComputedStyle(_element).height,
            10
        );
        document.documentElement.addEventListener("mousemove", doDrag, false);
        document.documentElement.addEventListener("mouseup", stopDrag, false);

        _element.className = _objZone.zoneType === "circle" ? "box circle" : "box";
    }

    function doDrag(e) {
        e.stopPropagation();
        _element.style.width = startWidth + e.clientX - startX + "px";
        _element.style.height = startHeight + e.clientY - startY + "px";
    }

    function stopDrag() {
        document.documentElement.removeEventListener(
            "mousemove",
            doDrag,
            false
        );
        document.documentElement.removeEventListener(
            "mouseup",
            stopDrag,
            false
        );

        _element.className = _objZone.zoneType === "circle" ? "boxNotActive circle" : "boxNotActive";

        updateZone(getZoneFromBox(_element));
    }
}

// Initialize all the zones for the current page
function initZones() {
    getZones().forEach((objZone) => {
        addZoneBox(objZone);
    });
}

// Get the next sequence (by adding 1 to the highest sequence so far)
function getNextZoneSequence() {
    return intHighest++;
}

// User has selected a box on the screen, get the associated objZone
function getZoneFromBox(_element) {
    const intSequence = parseInt(_element.id.replace("box", ""));
    var objReturn = null;

    getZones().forEach((objZone) => {
        if (objZone.sequence == intSequence) {
            objReturn = objZone;

            // Make sure coordinates still in line with image on the screen
            objReturn.x =
                getX(_element.style.left) -
                (document.all ? document.body.scrollLeft : pageXOffset);
            objReturn.y =
                getX(_element.style.top) -
                (document.all ? document.body.scrollTop : pageYOffset);
            objReturn.width = getX(_element.style.width);
            objReturn.height = getX(_element.style.height);
            objReturn.canDelete = _element.canDelete;
            objReturn.objType = _element.objType;
        }
    });

    return objReturn;
}

// True when zone is dragged outside of the image
function zoneOutsideImage(_objZone) {
    const elImage = document.getElementById("image");

    if (elImage.offsetLeft + elImage.width < _objZone.x) {
        return true;
    } else {
        return false;
    }
}

// Get pixels from a style
function getX(_x) {
    try {
        const intReturn = parseInt(_x.replace("px", ""));
        return intReturn;
    } catch (error) {
        return 0;
    }
}

// Replace zone with zone passed as parameter
function updateZone(_objZone) {
    const arrZones = new Array();

    getZones().forEach((objZone) => {
        if (objZone.sequence == _objZone.sequence) {
            arrZones.push(_objZone);
        } else {
            arrZones.push(objZone);
        }
    });

    saveZones(arrZones);
}

// Delete a zone from zone collection
function deleteZone(_objZone) {
    const arrZones = getZones().filter(objZone => objZone.sequence !== _objZone.sequence);
    saveZones(arrZones);
}

// Add a zone to zone collection
function addZone(_objZone) {
    const arrZones = getZones();

    arrZones.push(_objZone);

    saveZones(
        arrZones.sort(function (a, b) {
            a.sequence - b.sequence;
        })
    );
}

// Save zone collection in the field that is submitted
function saveZones(_arr) {
    var strZones = "";
    const elImage = document.getElementById("image");
    const dblRatio = getImageRatio(elImage);

    _arr.forEach((objZone) => {
        if (strZones.length > 0) {
            strZones += "\n";
        }

        strZones +=
            parseInt((objZone.x - getElementPosition(elImage).x) * dblRatio) +
            " " +
            parseInt((objZone.y - getElementPosition(elImage).y) * dblRatio) +
            " " +
            parseInt(objZone.width * dblRatio) +
            " " +
            parseInt(objZone.height * dblRatio) +
            " " +
            objZone.sequence + " " + objZone.zoneType;
    });

    document.getElementsByName("ctrZones")[0].value = strZones;
}

// Get zone collection from fields on the screen
function getZones() {
    const strZones = document.getElementsByName("ctrZones")[0].value;
    const arrZones = new Array();
    const elImage = document.getElementById("image");
    const dblRatio = getImageRatio(elImage);


    strZones.split(/\r?\n/).forEach((strLine) => {
        if (strLine.trim().length > 0) {
            const arrTokens = strLine
                .split(" ")
                .filter((e) => e.trim().length > 0);
            arrZones.push({
                x:
                    parseInt(arrTokens[0] / dblRatio) + getElementPosition(elImage).x,
                y:
                    parseInt(arrTokens[1] / dblRatio) + getElementPosition(elImage).y,
                width: parseInt(arrTokens[2] / dblRatio),
                height: parseInt(arrTokens[3] / dblRatio),
                sequence: arrTokens[4],
                zoneType: arrTokens[5],
            });
        }
    });

    return arrZones;
}

// Return x,y foir a given element
function getElementPosition(_element) {
    var xPos = 0,
        yPos = 0;

    if (typeof _element.getBoundingClientRect === "function") {
        return {
            x: _element.getBoundingClientRect().x,
            y: _element.getBoundingClientRect().y,
        };
    } else {
        while (_element) {
            xPos +=
                _element.offsetLeft - _element.scrollLeft + _element.clientLeft;
            yPos += _element.offsetTop - _element.scrollTop + _element.clientTop;
            _element = _element.offsetParent;
        }

        return { x: xPos, y: yPos };
    }
}