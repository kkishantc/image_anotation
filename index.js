var zoomLevel = 1;
var eventType = "";
var allShapes = [];
var allDetails = [];
var rotationAngle = 0;
var selectedId = null;
var mainBody = document.getElementById("main-body");
var image = document.getElementById("image");
var OrgImageSize = {
  width: 0,
  height: 0,
};

function getRotatedCoordinates(x, y) {
  let cx = image.width / 2;
  let cy = image.height / 2;
  const _angle = getRotationAngle(mainBody);
  const theta = Number.isNaN(_angle) ? 0 : _angle;
  const x1 = x - cx;
  const y1 = y - cy;

  const cosTheta = Math.cos((theta * Math.PI) / 180);
  const sinTheta = Math.sin((theta * Math.PI) / 180);

  const x2 = x1 * cosTheta - y1 * sinTheta;
  const y2 = x1 * sinTheta + y1 * cosTheta;

  const x3 = x2 + cx;
  const y3 = y2 + cy;

  return { x: x3, y: y3 };
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  let x = evt.clientX - rect.left;
  let y = evt.clientY - rect.top;

  return { x, y };
}

function setType(_type) {
  eventType = _type;
  if (eventType === "clear") {
    clearZone();
  }
  if (eventType === "erase") {
    mainBody.addEventListener("click", eraseZone);
  }
  if (eventType === "rotate") {
    rotationAngle += 90;
    rotateImage(mainBody, rotationAngle);
  }
  if (eventType === "zoomIn") {
    zoomIn();
  }
  if (eventType === "zoomOut") {
    zoomOut();
  }
  if (eventType === "zoomReset") {
    zoomReset();
  }
}

function rotateImage(mainBody) {
  let container = mainBody;
  container.style.transformOrigin = "50% 73%";
  // container.style.transformOrigin = "center";
  container.style.transform = `rotate(${rotationAngle}deg)`;

  if (rotationAngle >= 360) {
    rotationAngle = 0;
  }
  if (selectedId != null && allShapes.length > 0) {
    closePopOver(selectedId);
  }

  let btns = document.getElementById("shapes-btn");
  [...btns?.children].forEach((value, index, array) => {
    if (rotationAngle != 0) {
      value.disabled = true;
    } else {
      value.disabled = false;
    }
  });
}

function eraseZone(e) {
  const arrZones = getZones();
  let { x, y } = getMousePos(image, e);
  let shape = arrZones.filter((value) => isMouseInShape(e, x, y, value));
  deleteZone(shape[0]);
  eventType = "";
  mainBody.removeEventListener("click", eraseZone);
}

function clearZone() {
  const arrZones = getZones();
  arrZones.forEach((element) => {
    deleteZone(element);
  });
  eventType = "";

  let popover = document.getElementById("popover");
  popover.style.display = "none";
}

function zoomIn(ele) {
  // zoomLevel += 0.1;
  // image.width += zoomLevel;
  // image.height += zoomLevel;
  // ele.style.transform = `scale(${zoomLevel})`;
  // ele.style.transformOrigin = "0% 0%";
  image.width += image.width * 0.1;
  image.height += image.height * 0.1;
  reDraw();
}

function zoomOut(ele) {
  if (zoomLevel >= 0.2) {
    // zoomLevel -= 0.1;
    // image.width -= zoomLevel;
    // image.height -= zoomLevel;
    // ele.style.transform = `scale(${zoomLevel})`;
    // ele.style.transformOrigin = "0% 0%";
    image.width -= image.width * 0.1;
    image.height -= image.height * 0.1;
    reDraw();
  }
}

function zoomReset(ele) {
  // zoomLevel = 1;
  // ele.style.transform = `scale(1)`;
  image.width = OrgImageSize.width;
  image.height = OrgImageSize.height;
  reDraw();
}

function reDraw() {
  // allShapes?.forEach((objZone) => {
  //   let ele = document.getElementById(`box${objZone.slug}`);
  //   ele.remove();
  //   // deleteZone({ ...objZone });
  //   let { x, y } = PercentageToPx(objZone.x, objZone.y);
  //   let { x: width, y: height } = PercentageToPx(objZone.width, objZone.height);
  //   objZone.x = x;
  //   objZone.y = y;
  //   if (objZone.type !== "point") {
  //     objZone.width = width;
  //     objZone.height = height;
  //   }
  //   updateZone(objZone);
  //   addZoneBox(objZone);
  // });
}

// Get ratio (that is: 2 means original has twice the size; 1/2 means original has half the size)
function getImageRatio(_imgElement) {
  return _imgElement.naturalWidth / _imgElement.width;
}
// User has clicked on the image so create a new zone

function setImageInViewPort() {
  var tempImageWidth = 0;
  var tempImageHeight = 0;

  // console.log("image.width,image.height :>> ", image.width, image.height);

  const imageNWidth = image.naturalWidth;
  const imageNHeight = image.naturalHeight;
  console.log("imageNWidth,imageHeight :>> ", imageNWidth, imageNHeight);

  tempImageWidth = imageNWidth;
  tempImageHeight = imageNHeight;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  // console.log(
  //   "viewportWidth,viewportHeight :>> ",
  //   viewportWidth,
  //   viewportHeight
  // );

  // var sizeX = viewportWidth * 0.2;
  // var sizeY = viewportHeight * 0.2;
  // console.log("sizeX,sizeY :>> ", sizeX, sizeY);

  var tempViewportWidth = viewportWidth - viewportWidth * 0.2;
  var tempViewportHeight = viewportHeight - viewportHeight * 0.2;
  console.log(
    "tempViewportWidth,tempViewportHeight :>> ",
    tempViewportWidth,
    tempViewportHeight
  );
  console.log("cond :>> ", tempImageWidth >= tempViewportWidth);
  console.log("cond :>> ", tempImageHeight >= tempViewportHeight);
  // while (tempImageWidth >= tempViewportWidth) {

  // }
  while (tempImageWidth >= tempViewportWidth) {
    tempImageWidth = tempImageWidth - tempImageWidth * 0.1;
  }
  while (tempImageHeight >= tempViewportHeight) {
    tempImageHeight = tempImageHeight - tempImageHeight * 0.1;
  }

  // console.log(
  //   "tempImageWidth,tempImageHeight :>> ",
  //   tempImageWidth,
  //   tempImageHeight
  // );
  if (image) {
    // console.log("image.width,image.height :>> ", image.width, image.height);
    image.width = tempImageWidth;
    image.height = tempImageHeight;
    OrgImageSize.width = tempImageWidth;
    OrgImageSize.height = tempImageHeight;
    // console.log("image.width,image.height :>> ", image.width, image.height);
  }
}

window.onload = () => {
  // let mBody = document.getElementById("main-body");
  // mBody.style.width = `${image.width}px`;
  // mBody.style.height = `${image.height}px`;
  OrgImageSize.width = image.width;
  OrgImageSize.height = image.height;
  setImageInViewPort();
  //   image.setAttribute(
  //     `style`,
  //     `width:${mBody.style.width}; height:${mBody.style.height}`
  //   );
};

mainBody.addEventListener("click", newZone);

function newZone(_event) {
  if (eventType === "rectangle") {
    let { x, y } = getMousePos(image, _event);
    const objZone = {
      x,
      y,
      width: 50,
      height: 50,
      slug: getNextZoneSequence(),

      type: "rectangle",
    };
    addZone(objZone);
    addZoneBox(objZone, _event);
  }
  if (eventType === "point") {
    let { x, y } = getMousePos(image, _event);
    const objZone = {
      x,
      y,
      slug: getNextZoneSequence(),
      type: "point",
    };
    addZone(objZone);
    addZoneBox(objZone, _event);
  }
  if (eventType === "circle") {
    let { x, y } = getMousePos(image, _event);
    const objZone = {
      x,
      y,
      width: 50,
      height: 50,
      slug: getNextZoneSequence(),
      type: "circle",
    };
    addZone(objZone);
    addZoneBox(objZone, _event);
  }
  eventType = "";
}

function isMouseInShape(event, mx, my, shape) {
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

  let { x, y } = PercentageToPx(shape.x, shape.y);
  let { x: width, y: height } = PercentageToPx(shape.width, shape.height);
  var rLeft = x;
  var rRight = x + width;
  var rTop = y;
  var rBott = y + height;
  // math test to see if mouse is inside rectangle
  if (mx > rLeft && mx < rRight && my > rTop && my < rBott) {
    return true;
  }
  // }
  // the mouse isn't in any of the shapes
  return false;
}

// Draw the box on the screen for given zone
function addZoneBox(_objZone, _event) {
  const theDiv = document.createElement("div");
  theDiv.className =
    _objZone.type === "circle" || _objZone.type === "point"
      ? "boxNotActive circle"
      : "boxNotActive";
  if (_objZone.type === "point") {
    theDiv.classList.add("point");
  }

  theDiv.id = `box${_objZone.slug}`;
  theDiv.addEventListener("click", () => selectBox(_objZone.slug));
  theDiv.style.position = "absolute";

  let { x, y } = PercentageToPx(_objZone.x, _objZone.y);
  let { x: width, y: height } = PercentageToPx(_objZone.width, _objZone.height);

  theDiv.style.top = `${y}px`;
  theDiv.style.left = `${x}px`;
  if (_objZone.type !== "point") {
    theDiv.style.width = `${width}px`;
    theDiv.style.height = `${height}px`;
  }

  makeDraggable(theDiv, _objZone);
  if (_objZone.type != "point") {
    makeResizable(theDiv, _objZone);
  }

  document.getElementById("main-body").appendChild(theDiv);
}

// Make element draggable
function makeDraggable(_element, _objZone) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  // _element.onmousedown = dragMouseDown;
  _element.addEventListener("mousedown", dragMouseDown);

  function dragMouseDown(e) {
    e = e || window.event;
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    // Save the original x and y
    _element.orgLeft = _element.style.left;
    _element.orgTop = _element.style.top;
    // document.onmouseup = closeDragElement;
    document.addEventListener("mouseup", closeDragElement);
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
    _element.className =
      _objZone.type === "circle" || _objZone.type === "point"
        ? "box circle"
        : "box";
    if (_objZone.type === "point") {
      _element.classList.add("point");
    }
  }

  function elementDrag(e) {
    let popover = document.getElementById("popover");
    popover.style.position = "absolute";
    popover.style.top = `${0}px`;
    popover.style.left = `${0}px`;
    popover.style.display = "none";

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
    _element.style.top = `${_element.offsetTop - pos2}px`;
    _element.style.left = `${_element.offsetLeft - pos1}px`;
    _element.style.border = "3px solid red";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
    document.onmousedown = null;

    _element.className =
      _objZone.type === "circle" || _objZone.type === "point"
        ? "boxNotActive circle"
        : "boxNotActive";

    if (_objZone.type === "point") {
      _element.classList.add("point");
    }

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

    _element.className =
      _objZone.type === "circle" || _objZone.type === "point"
        ? "box circle"
        : "box";
    if (_objZone.type === "point") {
      _element.classList.add("point");
    }
  }

  function doDrag(e) {
    let popover = document.getElementById("popover");
    popover.style.position = "absolute";
    popover.style.top = `${0}px`;
    popover.style.left = `${0}px`;
    popover.style.display = "none";

    e.stopPropagation();
    _element.style.width = `${startWidth + e.clientX - startX}px`;
    _element.style.height = `${startHeight + e.clientY - startY}px`;
  }

  function stopDrag() {
    document.documentElement.removeEventListener("mousemove", doDrag, false);
    document.documentElement.removeEventListener("mouseup", stopDrag, false);

    _element.className =
      _objZone.type === "circle" || _objZone.type === "point"
        ? "boxNotActive circle"
        : "boxNotActive";
    if (_objZone.type === "point") {
      _element.classList.add("point");
    }

    updateZone(getZoneFromBox(_element));
  }
}

// initZones();
// Initialize all the zones for the current page
function initZones() {
  let tempAllShape = [];
  tempAllShape.push({
    slug: "94413",
    type: "point",
    x: 50,
    y: 50,
  });

  tempAllShape.push({
    slug: "94414",
    type: "rectangle",
    width: 15,
    height: 15,
    x: 0,
    y: 0,
  });

  tempAllShape.push({
    slug: "94415",
    type: "circle",
    width: 10,
    height: 15,
    x: 55,
    y: 55,
  });

  // tempAllShape.push({slug:"94416",type:"rectangle",width:15,height:15,x:85,y:85})
  // tempAllShape.push({slug:"94417",type:"rectangle",width:15,height:15,x:0,y:85})
  // tempAllShape.push({slug:"94418",type:"rectangle",width:15,height:15,x:45,y:40})
  // allShapes.push({ width: 1, height: 1, y: 77.70304388557624, x: 53.050270925895425, eventType: "point", slug: 010101 })
  // allShapes = JSON.parse(localStorage.getItem("allShapes")) || [];
  tempAllShape?.forEach((objZone) => {
    let { x, y } = PercentageToPx(objZone.x, objZone.y);
    let { x: width, y: height } = PercentageToPx(objZone.width, objZone.height);
    objZone.x = x;
    objZone.y = y;
    if (objZone.type !== "point") {
      objZone.width = width;
      objZone.height = height;
    }
    addZone(objZone);
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
      objReturn.x = getX(_element.style.left);
      objReturn.y = getX(_element.style.top);
      objReturn.width = getX(_element.style.width);
      objReturn.height = getX(_element.style.height);
      objReturn.type = objZone.type;
    }
  });

  return objReturn;
}

// True when zone is dragged outside of the image
function zoneOutsideImage(_objZone) {
  const elImage = document.getElementById("image");

  if (
    elImage.offsetLeft + elImage.width < _objZone?.x ||
    elImage.offsetTop + elImage.height < _objZone?.y
  ) {
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

// Replace zone with zone passed as parameter
function updateZone(_objZone) {
  if (eventType !== "erase" || (eventType !== "clear" && eventType === "")) {
    const arrZones = new Array();

    getZones().forEach((objZone) => {
      if (objZone.slug === _objZone?.slug) {
        let { x, y } = pxToPercentage(_objZone.x, _objZone.y);
        let { x: width, y: height } = pxToPercentage(
          _objZone.width,
          _objZone.height
        );
        _objZone.x = x;
        _objZone.y = y;
        _objZone.width = width;
        _objZone.height = height;
        arrZones.push(_objZone);
      } else {
        arrZones.push(objZone);
      }
    });
    allShapes = arrZones;

    // localStorage.setItem("allShapes", JSON.stringify(arrZones));
    saveZones(arrZones);
  }
}

// Delete a zone from zone collection
function deleteZone(_objZone) {
  let arrZones = new Array();
  getZones().forEach((item) => {
    if (item.slug !== _objZone?.slug) {
      arrZones.push(item);
    }
  });

  allShapes = arrZones;
  saveZones(arrZones);

  document.getElementById(`box${_objZone?.slug}`)?.remove();
}

// Add a zone to zone collection
function addZone(_objZone) {
  const arrZones = getZones();
  let { x, y } = pxToPercentage(_objZone.x, _objZone.y);
  let { x: width, y: height } = pxToPercentage(_objZone.width, _objZone.height);
  _objZone.x = x;
  _objZone.y = y;
  if (_objZone.type !== "point") {
    _objZone.width = width;
    _objZone.height = height;
  }
  arrZones.push(_objZone);
  console.log("2 _objZone :>> ", _objZone);
  allShapes = arrZones;
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
      objZone.slug +
      " " +
      objZone.type;
  });
  generateList();
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
      const arrTokens = strLine.split(" ").filter((e) => e.trim().length > 0);
      arrZones.push({
        x: parseFloat(arrTokens[0] / dblRatio) + getElementPosition(elImage).x,
        y: parseFloat(arrTokens[1] / dblRatio) + getElementPosition(elImage).y,
        width: parseFloat(arrTokens[2] / dblRatio),
        height: parseFloat(arrTokens[3] / dblRatio),
        slug: arrTokens[4],
        type: arrTokens[5],
      });
    }
  });
  return arrZones;
}

// Return x,y for a given element
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
      xPos += _element.offsetLeft - _element.scrollLeft + _element.clientLeft;
      yPos += _element.offsetTop - _element.scrollTop + _element.clientTop;
      _element = _element.offsetParent;
    }

    return { x: xPos, y: yPos };
  }
}

// convert px To Percentage
function pxToPercentage(_startX, _startY) {
  let xPercent = parseFloat((_startX / image.width) * 100);
  let yPercent = parseFloat((_startY / image.height) * 100);
  return { x: xPercent, y: yPercent };
}

// // convert Percentage To Px
function PercentageToPx(_startX, _startY) {
  let orgX = parseFloat((_startX / 100) * image.width);
  let orgY = parseFloat((_startY / 100) * image.height);
  return { x: orgX, y: orgY };
}

// select div box
function selectBox(ID) {
  if (eventType === "") {
    let _id = Number(ID);
    if (selectedId === _id) {
      const boxes = document.querySelectorAll(".boxNotActive");
      boxes.forEach((box) => {
        box.style.border = "3px solid black";
      });

      const links = document.querySelectorAll(".annotation-link");
      links.forEach((link) => {
        link.style.textDecoration = "none";
      });

      closePopOver(_id);
      selectedId = null;
    } else {
      selectedId = Number(_id);

      const boxes = document.querySelectorAll(".boxNotActive");
      boxes.forEach((box) => {
        box.style.border = "3px solid black";
      });

      const links = document.querySelectorAll(".annotation-link");
      links.forEach((link) => {
        link.style.color = "#0d6efd";
        link.style.textDecoration = "none";
      });

      const selectedBox = document.getElementById(`box${selectedId}`);
      selectedBox.style.border = "3px solid red";

      const link = document.getElementById(`link${ID}`);
      link.style.color = "black";
      link.style.textDecoration = "underline";

      openPopOver(selectedId);
    }
  }
}

// open popover
function openPopOver(_selectedId) {
  let _shape = allShapes.filter(
    (item) => item.slug == _selectedId.toString()
  )[0];
  let { x, y } = PercentageToPx(_shape.x, _shape.y);
  let { y: height } = PercentageToPx(_shape?.width, _shape?.height);

  let popover = document.getElementById("popover");
  popover.style.display = "block";
  popover.style.position = "absolute";
  popover.style.transform = `rotate(0deg)`;
  popover.style.top = `${y + height}px`;
  popover.style.left = `${x}px`;

  const ul = document.getElementById("details-list");
  ul.innerHTML = "";
  let details = allDetails.filter((item) => item.id == _shape?.slug)[0]
    ?.details;
  for (const idx in details) {
    const li = document.createElement("li");
    li.innerHTML = details[idx];
    ul.appendChild(li);
  }
}

// close popover
function closePopOver(ID) {
  const ul = document.getElementById("details-list");
  const listItems = Object.assign(
    {},
    Array.from(ul.children).map((li) => li.innerHTML)
  );

  let temp = allDetails.filter((item) => item.id === ID)[0]?.details;

  if (temp) {
    const item = allDetails.find((item) => item.id === ID);
    item.details = listItems;
    item.id = ID;
  } else {
    allDetails.push({ id: ID, details: listItems });
  }

  ul.innerHTML = "";

  const selectedBox = document.getElementById(`box${ID}`);
  selectedBox.style.border = "3px solid black";

  const link = document.getElementById(`link${ID}`);
  link.style.color = "#0d6efd";
  link.style.textDecoration = "none";

  let popover = document.getElementById("popover");
  popover.style.position = "absolute";
  popover.style.top = `${0}px`;
  popover.style.left = `${0}px`;
  popover.style.display = "none";

  selectedId = null;
}

// close popover
function handelClose() {
  let input = document.getElementById("details");
  input.value = "";
  closePopOver(selectedId);
}

// add item in popover list
function handelSubmit() {
  let input = document.getElementById("details");
  const ul = document.getElementById("details-list");
  const li = document.createElement("li");
  let val = input.value.toString().trim();
  if (val.length > 0) {
    li.innerHTML = val;
    ul.appendChild(li);
    input.value = "";
  } else {
    window.alert("Please enter details.");
  }
}

// generate list of annotation
function generateList() {
  var ul = document.getElementById("annotationList");
  ul.innerHTML = "";
  allShapes?.forEach((value) => {
    var li = document.createElement("li");
    var a = document.createElement("a");
    let text = document.createTextNode(`Annotation ${value.slug}`);
    a.appendChild(text);
    a.setAttribute("href", "#");
    a.setAttribute("id", `link${value.slug}`);
    a.setAttribute("class", "annotation-link");
    li.appendChild(a);
    ul.appendChild(li);
    a.addEventListener("click", handelListItemClick);
  });
}

function handelListItemClick(e) {
  let id = e.target.id.toString().replace("link", "");
  selectBox(id);
}

function getRotationAngle(ele) {
  const style = window.getComputedStyle(ele);
  const transform = style.getPropertyValue("transform");
  const matrix = transform.substr(7).split(",");
  const angle = Math.round(Math.atan2(matrix[1], matrix[0]) * (180 / Math.PI));
  return angle;
}
