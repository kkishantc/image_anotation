var intHighest = 0;
var objType = "";
function setType(_type) {
    objType = _type;
    // if (objType === "clear") {
    //   clearZone();
    // }
}
// function clearZone() {
//   const arrZones = getZones();
//   console.log("arrZones :", arrZones);
//   arrZones.forEach((element) => {
//     const div = document.getElementById(`box${element.sequence}`);
//     div.remove();
//     removeZone(element);
//   });
// }

// Get ratio (that is: 2 means original has twice the size; 1/2 means original has half the size)
function getImageRatio(_imgElement) {
    return _imgElement.naturalWidth / _imgElement.width;
}

// User has clicked on the image so create a new zone
function newZone(_event) {
    console.log("objType :", objType);
    if (objType === "ractangle") {
        const objZone = {
            x: _event.clientX,
            y: _event.clientY,
            width: 75,
            height: 75,
            sequence: getNextZoneSequence(),
            canDelete: true,
        };

        addZone(objZone);

        addZoneBox(objZone, _event);
    }
    if (objType === "point") {
        const objZone = {
            x: _event.clientX,
            y: _event.clientY,
            width: 5,
            height: 5,
            sequence: getNextZoneSequence(),
            canDelete: true,
        };
        addZone(objZone);

        addZoneBox(objZone, _event);

    }
    objType = "";
}

// Draw the box on thge screen for given zone
function addZoneBox(_objZone, _event) {
    const theDiv = document.createElement("div");

    theDiv.className = "boxNotActive";
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
    theDiv.style.width = _objZone.width;
    theDiv.style.height = _objZone.height;
    theDiv.canDelete = _objZone.canDelete;

    makeDraggable(theDiv);
    makeResizable(theDiv);

    document.getElementById("main-body").appendChild(theDiv);

    const numberDiv = document.createElement("div");
    numberDiv.innerHTML = _objZone.sequence;
    numberDiv.className = "boxNumber";
    theDiv.appendChild(numberDiv);
}

// Make element draggable
function makeDraggable(_element) {
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
        _element.className = "box";
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
        _element.className = "boxNotActive";

        const objZone = getZoneFromBox(_element);

        if (zoneOutsideImage(objZone)) {
            deleteZone(objZone);
        } else {
            updateZone(objZone);
        }
    }
}

// Make eleemnt resizable by adding dummy divs to the right and to the bottom of element
function makeResizable(_element) {
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
        _element.className = "box";
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
        _element.className = "boxNotActive";

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
    const arrZones = new Array();

    getZones().forEach((objZone) => {
        if (objZone.sequence != _objZone.sequence) {
            arrZones.push(objZone);
        }
    });

    saveZones(arrZones);

    document.getElementById("box" + _objZone.sequence).remove();
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
            objZone.sequence;
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