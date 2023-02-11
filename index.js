var intHighest = 0;
var objType = "";
var allShapes = [];
var mainBody = document.getElementById("main-body");

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect()
    return {
        x: (evt.clientX - rect.left) * canvas.width / rect.width,
        y: (evt.clientY - rect.top) * canvas.height / rect.height,
    };
}

function setType(_type) {
    objType = _type;
    console.log("objType: ", objType);
    if (objType === "clear") {
        clearZone();
    }
    if (objType === "erase") {
        mainBody.onmousedown = null;
        mainBody.onmouseup = null;
        mainBody.onmousemove = null;

        mainBody.onclick = (e) => {
            const arrZones = getZones();
            let mx = e.clientX;
            let my = e.clientY;
            let shape = arrZones.filter((value, index, array) => isMouseInShape(mx, my, value));
            deleteZone(shape[0]);
        }
        objType = "";
    }
}

function clearZone() {
    const arrZones = getZones();
    arrZones.forEach((element) => {
        deleteZone(element);
    });
    console.log("allShapes :", allShapes);
    objType = "";
}

// Get ratio (that is: 2 means original has twice the size; 1/2 means original has half the size)
function getImageRatio(_imgElement) {
    return _imgElement.naturalWidth / _imgElement.width;
}
// User has clicked on the image so create a new zone

document.getElementById("main-body").onclick = newZone;

function newZone(_event) {
    console.log("objType :", objType);
    if (objType === "rectangle") {
        const objZone = {
            x: _event.clientX,
            y: _event.clientY,
            width: 75,
            height: 75,
            slug: getNextZoneSequence(),
            canDelete: true,
            isShow: false,
            objType: "rectangle"
        };

        addZone(objZone);
        addZoneBox(objZone, _event);
    }
    if (objType === "point") {
        const objZone = {
            x: _event.clientX,
            y: _event.clientY,
            width: 10,
            height: 10,
            slug: getNextZoneSequence(),
            canDelete: true,
            objType: "point"
        };
        addZone(objZone);
        addZoneBox(objZone, _event);
    }
    if (objType === "circle") {
        const objZone = {
            x: _event.clientX,
            y: _event.clientY,
            width: 75,
            height: 75,
            slug: getNextZoneSequence(),
            canDelete: true,
            objType: "circle"
        };
        addZone(objZone);
        addZoneBox(objZone, _event);
    }
    objType = "";
}

function isMouseInShape(mx, my, shape) {
    // if (shape.radius) {
    //     // this is a circle
    //     var dx = mx - shape.x;
    //     var dy = my - shape.y;
    //     // math test to see if mouse is inside circle
    //     if (dx * dx + dy * dy < shape.radius * shape.radius) {
    //         // yes, mouse is inside this circle
    //         return (true);
    //     }
    // } else if (shape.width) {
    // this is a rectangle
    var rLeft = shape.x;
    var rRight = shape.x + shape.width;
    var rTop = shape.y;
    var rBott = shape.y + shape.height;
    // math test to see if mouse is inside rectangle
    if (mx > rLeft && mx < rRight && my > rTop && my < rBott) {
        return (true);
    }
    // }
    // the mouse isn't in any of the shapes
    return (false);
}

// Draw the box on the screen for given zone
function addZoneBox(_objZone, _event) {
    const theDiv = document.createElement("div");

    theDiv.className = _objZone.objType === "circle" || _objZone.objType === "point" ? "boxNotActive circle" : "boxNotActive";

    theDiv.id = "box" + _objZone.slug;
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
    theDiv.canDelete = _objZone.canDelete;

    makeDraggable(theDiv, _objZone);
    if (objType != "point") {
        makeResizable(theDiv, _objZone);
    }

    document.getElementById("main-body").appendChild(theDiv);

    //     const detailsDiv = document.createElement("div");
    //     detailsDiv.style.position = "absolute";
    //     // detailsDiv.style.display = _objZone.isShow ? "block" : "none";
    //     detailsDiv.style.top = _objZone.width + 10 + "px";
    //     detailsDiv.style.left = -4 + "px";
    //     detailsDiv.id = "detailsBox" + _objZone.slug;
    //     // let objStr = "'" + JSON.stringify(_objZone) + "'";
    //     detailsDiv.className = "details";
    //     detailsDiv.innerHTML = `<div id="popover4"> The changes in our brochure designs for 2013 require us to update key areas of our website. 
    //         < h1 > Hii</h1 >   
    //   </div > `;
    //     theDiv.appendChild(detailsDiv);
    //     detailsDiv.innerHTML = `<button style="display:none" type="button" id="exampleModalBtn${_objZone.slug}" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
    //         Launch demo modal
    //       </button>


    //       <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    //   <div class="modal-dialog">
    //     <div class="modal-content">
    //       <div class="modal-header">
    //         <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
    //         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    //       </div>
    //       <div class="modal-body">
    //         ...
    //       </div>
    //       <div class="modal-footer">
    //         <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    //         <button type="button" class="btn btn-primary">Understood</button>
    //       </div>
    //     </div>
    //   </div>
    // </div>`;

}

// Make element draggable
function makeDraggable(_element, _objZone) {
    console.log("makeDraggable")
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

    // let ele = document.getElementById("detailsBox" + _objZone.slug)
    // console.log("ele: ", ele);    
    // if (objType === "") {
    //     _element.addEventListener('mousedown', (e) => handelOpenModel(e, _element, _objZone));
    // }

    // if (_objZone.isShow === false) {
    _element.onmousedown = dragMouseDown;
    // }

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
        _element.className = _objZone.objType === "circle" || _objZone.objType === "point" ? "box circle" : "box";

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

        _element.className = _objZone.objType === "circle" || _objZone.objType === "point" ? "boxNotActive circle" : "boxNotActive";


        const objZone = getZoneFromBox(_element);

        if (zoneOutsideImage(objZone)) {
            deleteZone(objZone);
        } else {
            updateZone(objZone);
        }
    }
}

// Make element resizable by adding dummy dives to the right and to the bottom of element
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
        startWidth = parseFloat(
            document.defaultView.getComputedStyle(_element).width,
            10
        );
        startHeight = parseFloat(
            document.defaultView.getComputedStyle(_element).height,
            10
        );
        document.documentElement.addEventListener("mousemove", doDrag, false);
        document.documentElement.addEventListener("mouseup", stopDrag, false);

        _element.className = _objZone.objType === "circle" || _objZone.objType === "point" ? "box circle" : "box";
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

        _element.className = _objZone.objType === "circle" || _objZone.objType === "point" ? "boxNotActive circle" : "boxNotActive";

        updateZone(getZoneFromBox(_element));
    }
}

// initZones();
// Initialize all the zones for the current page
function initZones() {
    // allShapes.push({ width: 83.0, height: 82.7, y: 146.7, x: 191.1, type: "rectangle", slug: 0 })
    // allShapes = JSON.parse(localStorage.getItem("allShapes")) || [];
    allShapes?.forEach((objZone) => {
        addZoneBox(objZone);
    });
}

// Get the next slug (by adding 1 to the highest slug so far)
function getNextZoneSequence() {
    return Math.floor(Math.random().toFixed(5) * 100000);
}

// User has selected a box on the screen, get the associated objZone
function getZoneFromBox(_element) {
    const intSequence = parseFloat(_element.id.replace("box", ""));
    var objReturn = null;

    getZones().forEach((objZone) => {
        if (objZone.slug == intSequence) {
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
        const intReturn = parseFloat(_x.replace("px", ""));
        return intReturn;
    } catch (error) {
        return 0;
    }
}


// $('#show-div').click(function () {
//     $('#hidden-content').toggle();
// });

function handelOpenModel(e, ele, obj) {
    console.log("opening model.", obj.slug);

    // if (obj.isShow === false) {
    //     obj.isShow = true;
    //     updateZone(obj);
    //     console.log("opening model.");
    //     // let child = document.getElementById("exampleModalBtn" + obj.slug)
    //     let child = document.getElementById("detailsBox" + obj.slug)
    //     // console.log(child);
    //     // child.click();
    //     child.style.display = "block";
    // }
    // else {
    //     handelCloseModel(ele, obj);
    // }
}

function handelCloseModel(ele, obj) {
    if (obj.isShow === true) {
        let child = document.getElementById("detailsBox" + obj.slug)
        child.style.display = "none";
        obj.isShow = false;
        updateZone(obj);
        console.log("closing model.");
    }
}

function handelClick(seq) {

}
function handelClose(obj) {
    // handelCloseModel(obj);
    // console.log(obj);
    console.log("handelClose");
}


// document.addEventListener("click",handelCloseModel)

// Replace zone with zone passed as parameter
function updateZone(_objZone) {


    const arrZones = new Array();

    getZones().forEach((objZone) => {
        if (objZone.slug == _objZone.slug) {
            arrZones.push(_objZone);
        } else {
            arrZones.push(objZone);
        }
    });
    allShapes = arrZones;
    console.log("updateZone allShapes: ", allShapes)
    // for (const iterator of detailsBoxes) {
    //     // console.log("iterator: ", )
    //     iterator.onclick = (e) => {
    //         handelOpenModel(e, iterator)
    //     }
    // let ele = document.getElementById("detailsBox" + _objZone.slug)
    // console.log("ele: ", ele);
    // ele.addEventListener('click', handelOpenModel)
    // ele.addEventListener("onmousedown", (e) => handelOpenModel(e, ele));
    // ele.addEventListener("onmouseup", (e) => handelCloseModel(e, ele));
    // }
    // detailsBoxes.forEach((item) => {
    // })
    // localStorage.setItem("allShapes", JSON.stringify(arrZones));
    saveZones(arrZones);
}

// Delete a zone from zone collection
function deleteZone(_objZone) {
    const arrZones = new Array();

    getZones().forEach((objZone) => {
        if (objZone.slug != _objZone.slug) {
            arrZones.push(objZone);
        }
    });

    allShapes = arrZones;
    saveZones(arrZones);

    document.getElementById("box" + _objZone.slug).remove();
}

// Add a zone to zone collection
function addZone(_objZone) {
    const arrZones = getZones();

    arrZones.push(_objZone);
    allShapes = arrZones;
    console.log("addZone allShapes: ", allShapes)
    // localStorage.setItem("allShapes", JSON.stringify(allShapes));
    saveZones(
        arrZones.sort(function (a, b) {
            a.slug - b.slug;
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
            parseFloat((objZone.x - getElementPosition(elImage).x) * dblRatio) +
            " " +
            parseFloat((objZone.y - getElementPosition(elImage).y) * dblRatio) +
            " " +
            parseFloat(objZone.width * dblRatio) +
            " " +
            parseFloat(objZone.height * dblRatio) +
            " " +
            objZone.slug;
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
                x: parseFloat(arrTokens[0] / dblRatio) + getElementPosition(elImage).x,
                y: parseFloat(arrTokens[1] / dblRatio) + getElementPosition(elImage).y,
                width: parseFloat(arrTokens[2] / dblRatio),
                height: parseFloat(arrTokens[3] / dblRatio),
                slug: arrTokens[4],
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