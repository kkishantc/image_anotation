var deleteIcon =
  "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
var deleteImg = document.createElement("img");
deleteImg.src = deleteIcon;
var eventType = "";
var allShapes = [];
var allDetails = [];
var maxW, maxH;
var OrgImageSize = {
  width: 0,
  height: 0,
};
var shapeStates = {};
var zoomLevel = 1;
var canvasContainer = document.getElementsByClassName("canvas-container");
var upperCanvas = document.getElementsByClassName("upper-canvas");
let imageURL =
  "https://cdn.pixabay.com/photo/2015/11/16/14/43/cat-1045782__340.jpg";
// let imageURL =
//   "https://images.pexels.com/photos/13519033/pexels-photo-13519033.jpeg";
let Canvas = document.getElementById("canvas");
var popover = document.getElementById("popover");
var imageObj;
let image = document.createElement("img");
var CanvasSize = {
  width: 0,
  height: 0,
};
image.src = imageURL;
Canvas.width = image.width;
Canvas.height = image.height;
var canvas = new fabric.Canvas("my-canvas", {
  // selection: false,
  // controlsAboveOverlay: true,
  // centeredScaling: true,
  // allowTouchScrolling: true,
  // preserveObjectStacking: true,
});

canvas.allowTouchScrolling = true;
canvas.perPixelTargetFind = true;
canvas.targetFindTolerance = 4;

var canvas = new fabric.Canvas("canvas");
var strokeWidth = 3;
var settings = {
  stroke: "black",
  objectCaching: false,
  strokeWidth,
  cornerSize: 5,
  cornerStyle: "rect",
  cornerColor: "red",
  transparentCorners: false,
  hasControls: true,
  hasBorders: true,
  fill: "rgba(0,0,0,0)",
  selectable: true,
  originX: "center",
  originY: "center",
};

const setImage = () => {
  fabric.Image.fromURL(imageURL, function (img) {
    imageObj = img;
    img.set({
      // left: 248,
      // top: 170,
      // originX: "center",
      // originY: "center",
      scaleX: Canvas.width / img.width,
      scaleY: Canvas.height / img.height,
      selectable: false,
      centeredRotation: true,
    });
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
      backgroundImageStretch: false,
    });
  });
};

const setImageInViewPort = () => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  let aspectRatio = image.width / image.height;
  maxW = viewportWidth * 0.8;
  maxH = viewportHeight * 0.8;
  if (image) {
    if (image.naturalWidth >= maxW || image.height >= maxH) {
      if (maxW / maxH > aspectRatio) {
        maxW = maxH * aspectRatio;
      } else {
        maxH = maxW / aspectRatio;
      }
      console.log("maxW,maxH :>> ", maxW, maxH);
      CanvasSize.width = maxW;
      CanvasSize.height = maxH;
      let canvases = new Array(...document.getElementsByClassName("canvas"));
      let canvasContainer = new Array(
        ...document.getElementsByClassName("canvas-container")
      )[0];
      // console.log("canvasContainer :>> ", canvasContainer);
      // console.log("canvases :>> ", canvases);

      // canvasContainer.width = CanvasSize.width;
      // canvasContainer.height = CanvasSize.height;
      canvasContainer.style.width = CanvasSize.width + "px";
      canvasContainer.style.height = CanvasSize.height + "px";

      canvases.forEach((value, index, array) => {
        value.width = CanvasSize.width;
        value.height = CanvasSize.height;
        value.style.width = CanvasSize.width + "px";
        value.style.height = CanvasSize.height + "px";
      });

      // canvasContainer[0].style.width = `${maxW}px`;
      // canvasContainer[0].style.height = `${maxH}px`;
      // canvasContainer[1].style.width = `${maxW}px`;
      // canvasContainer[1].style.height = `${maxH}px`;
      // upperCanvas[1].style.width = `${maxW}px`;
      // upperCanvas[1].style.height = `${maxH}px`;
      // upperCanvas[1].width = maxW;
      // upperCanvas[1].height = maxH;
      // canvas.setWidth(maxW);
      // canvas.setHeight(maxH);
      // canvasContainer.style.overflow = "auto";
      // canvas.set({
      //   width: 600,
      //   height: 600,
      // });
      // canvas.renderAll();
      // Canvas.style.width = maxW + "px";
      // Canvas.style.height = maxH + "px";
    }

    // OrgImageSize.width = image.width;
    // OrgImageSize.height = image.height;
  }
};

window.onload = () => {
  if (image.src) {
    // setImageInViewPort();
    setImage();
    // console.log("maxW,maxH :>> ", w, h);

    // let shape = {
    //   id: getId(),
    //   type: "rectangle",
    //   x: 10,
    //   y: 10,
    //   width: 10,
    //   height: 10,
    // };
    // drawRectangle(shape);
  }
};

const getId = () => {
  return Math.floor(Math.random().toFixed(5) * 100000);
};

const setType = (_type) => {
  eventType = _type;
  console.log("eventType :>> ", eventType);
  if (eventType === "zoomIn") {
    zoomIn();
  } else if (eventType === "zoomOut") {
    zoomOut();
  } else if (eventType === "zoomReset") {
    zoomReset();
  } else if (eventType === "delete") {
    deleteShape();
  } else if (eventType === "rotate") {
    rotateShape();
  } else if (eventType === "undo") {
    undo();
  } else if (eventType === "redo") {
    redo();
  }
};

// const undo = () => {
//   canvas.undo(function () {
//     console.log("post undo");
//   });
// };
// const redo = () => {
//   canvas.redo(function () {
//     console.log("post redo");
//   });
// };

// convert px To Percentage
const pxToPercentage = (x, y) => {
  let xPercent = parseFloat((x / Canvas.width) * 100);
  let yPercent = parseFloat((y / Canvas.height) * 100);
  return { x: xPercent, y: yPercent };
};

// // convert Percentage To Px
const PercentageToPx = (x, y) => {
  let orgX = parseFloat((x / 100) * Canvas.width);
  let orgY = parseFloat((y / 100) * Canvas.height);
  return { x: orgX, y: orgY };
};

var rotationAngle = 0;
const rotateShape = () => {
  rotationAngle += 90;
  // var origItems = canvas._objects;

  // var posNewCenter = fabric.util.rotatePoint(
  //   new fabric.Point(600, 600),
  //   canvas.getVpCenter(),
  //   fabric.util.degreesToRadians(this.value)
  // );
  // origItems?.forEach(function (obj) {
  //   obj.set({
  //     angle: rotationAngle,
  //   });
  //   canvas.renderAll();
  // });
  // imageObj.set({ angle: rotationAngle });
  // rotate the canvas
  canvas.set({ angle: 45 });
  canvas.renderAll();

  // fabric.Image.set({ angle: 45 });
  // canvas.renderAll();
  // var center = canvas.getCenter();
  // let group = undefined;
  // if (group == undefined) {
  //   var arr = [];
  //   for (var i = 0; i < origItems.length; i++) {
  //     arr.push(canvas.item(i).clone());
  //   }
  //   // group = new fabric.Group(arr);
  //   group = new fabric.Group();
  //   group.set({
  //     width: canvas.getWidth(),
  //     height: canvas.getHeight(),
  //     top: center.top,
  //     left: center.left,
  //     angle: 90,
  //   });
  //   for (var i = 0; i < arr.length; i++) {
  //     group.add(arr[i]);
  //   }
  //   canvas.clear().renderAll();
  //   canvas.add(group);
  // } else {
  //   group.rotate(angleInDegrees);
  // }
  // let group = new fabric.Group();
  // origItems.forEach((value, index, array) => {
  //   group.add(value);
  // });
  // console.log("group :>> ", group);
  // let angleInDegrees = 90;
  // group.rotate(angleInDegrees);
  // canvas.renderAll();

  // var origItems = canvas._objects;
  // // Group the two rectangles
  // const group = new fabric.Group([...origItems], {
  //   left: canvas.width / 2,
  //   top: canvas.height / 2,
  // });
  // group.add(imageObj);

  // // Set the rotation angle in degrees
  // const rotationAngle = 45;

  // // Rotate the group around its center
  // fabric.util.rotateAroundOrigin(
  //   group,
  //   fabric.util.degreesToRadians(rotationAngle)
  // );
};

const zoomIn = () => {
  zoomLevel *= 1.1;
  canvas.setZoom(zoomLevel);
  reSetStrokeWidth();

  // const _zoomLevel = canvas.getZoom();
  // const _width = canvas.getWidth() * _zoomLevel;
  // const _height = canvas.getHeight() * _zoomLevel;
  // canvas.setWidth(_width);
  // canvas.setHeight(_height);
  var _zoomLevel = canvas.getZoom();
  console.log("_zoomLevel :>> ", _zoomLevel);
  // var canvasWidth = canvas.getWidth() * _zoomLevel;
  // var canvasHeight = canvas.getHeight() * _zoomLevel;
  // canvas.setDimensions({ width: canvasWidth, height: canvasHeight });
};

const zoomOut = () => {
  zoomLevel /= 1.1;
  canvas.setZoom(zoomLevel);
  reSetStrokeWidth();

  var _zoomLevel = canvas.getZoom();
  var canvasWidth = canvas.getWidth() / _zoomLevel;
  var canvasHeight = canvas.getHeight() / _zoomLevel;
  canvas.setDimensions({ width: canvasWidth, height: canvasHeight });
};

const zoomReset = () => {
  zoomLevel = 1;
  canvas.setZoom(zoomLevel);
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
  reSetStrokeWidth();

  var _zoomLevel = canvas.getZoom();
  var canvasWidth = canvas.getWidth() * _zoomLevel;
  var canvasHeight = canvas.getHeight() * _zoomLevel;
  canvas.setDimensions({ width: canvasWidth, height: canvasHeight });
};

const drawRectangle = (shape) => {
  let { x: left, y: top } = PercentageToPx(shape.x, shape.y);
  let { x: width, y: height } = PercentageToPx(shape.width, shape.height);
  var rect = new fabric.Rect({
    id: shape.id,
    type: shape.type,
    left,
    top,
    width,
    height,
    ...settings,
  });
  canvas.add(rect);
  shapeSave(shape);
  // canvas.setActiveObject(rect);
};

const drawOval = (shape) => {
  let { x: left, y: top } = PercentageToPx(shape.x, shape.y);
  let { x: width, y: height } = PercentageToPx(shape.width, shape.height);
  var oval = new fabric.Ellipse({
    left,
    top,
    rx: width,
    ry: height,
    id: shape.id,
    type: shape.type,
    ...settings,
  });
  canvas.add(oval);
  shapeSave(shape);
  // canvas.setActiveObject(oval);
};

const drawPoint = (shape) => {
  let { x: left, y: top } = PercentageToPx(shape.x, shape.y);
  let { x: rx, y: ry } = PercentageToPx(shape.width, shape.height);
  var oval = new fabric.Ellipse({
    left,
    top,
    rx,
    ry,
    id: shape.id,
    type: shape.type,
    ...settings,
    hasControls: false,
    hasBorders: false,
    fill: "black",
  });
  canvas.add(oval);
  shapeSave(shape);
};

canvas.on("mouse:down", (e) => {
  let { x, y } = e.absolutePointer;
  let { x: XPercentage, y: YPercentage } = pxToPercentage(x, y);
  if (eventType === "rectangle") {
    let shape = {
      id: getId(),
      type: "rectangle",
      x: XPercentage,
      y: YPercentage,
      width: 10,
      height: 10,
    };
    drawRectangle(shape);
  } else if (eventType === "oval") {
    let shape = {
      id: getId(),
      type: "oval",
      x: XPercentage,
      y: YPercentage,
      width: 5,
      height: 5,
    };
    drawOval(shape);
  } else if (eventType === "point") {
    let shape = {
      id: getId(),
      type: "point",
      x: XPercentage,
      y: YPercentage,
      width: 0.8,
      height: 1,
    };
    drawPoint(shape);
  }
  eventType = null;
});

canvas.on("mouse:up", (e) => {
  const activeObject = canvas.getActiveObject();
  if (activeObject) {
    SelectedShape(activeObject);
    shapeUpdate(activeObject);
  }
});

canvas.on("mouse:wheel", function (opt) {
  var delta = opt.e.deltaY;
  var zoom = canvas.getZoom();
  zoom *= 0.999 ** delta;
  if (zoom > 20) zoom = 20;
  if (zoom < 0.01) zoom = 0.01;
  canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();

  var vpt = this.viewportTransform;
  if (zoom < 400 / 1000) {
    vpt[4] = 200 - (1000 * zoom) / 2;
    vpt[5] = 200 - (1000 * zoom) / 2;
  } else {
    if (vpt[4] >= 0) {
      vpt[4] = 0;
    } else if (vpt[4] < canvas.getWidth() - 1000 * zoom) {
      vpt[4] = canvas.getWidth() - 1000 * zoom;
    }
    if (vpt[5] >= 0) {
      vpt[5] = 0;
    } else if (vpt[5] < canvas.getHeight() - 1000 * zoom) {
      vpt[5] = canvas.getHeight() - 1000 * zoom;
    }
  }
  reSetStrokeWidth();
});

// canvas.on("object:modified", function (event) {
//   var shape = event.target;
//   var currentState = JSON.stringify(shape.toObject());
//   if (!shapeStates[shape.id]) {
//     shapeStates[shape.id] = [currentState];
//   } else {
//     shapeStates[shape.id].push(currentState);
//   }
//   console.log("shapeStates :>> ", shapeStates);
// });

// allow the user to undo modifications by restoring previous states for each shape
function undo() {
  // for (var id in shapeStates) {
  //   var states = shapeStates[id];
  //   if (states.length > 1) {
  //     var shape = canvas.getObjectById(id);
  //     var previousState = JSON.parse(states[states.length - 2]);
  //     shapeStates[id].pop();
  //     shape.set(previousState);
  //   }
  // }
  // canvas.renderAll();
}

// allow the user to redo modifications by restoring next states for each shape
function redo() {
  // for (var id in shapeStates) {
  //   var states = shapeStates[id];
  //   if (states.length > 1) {
  //     var shape = canvas.getObjectById(id);
  //     var nextState = JSON.parse(states[states.length - 1]);
  //     shapeStates[id].pop();
  //     shape.set(nextState);
  //   }
  // }
  // canvas.renderAll();
}

canvas.on("object:scaling", function () {
  var obj = canvas.getActiveObject(),
    width = obj.width,
    height = obj.height,
    scaleX = obj.scaleX,
    scaleY = obj.scaleY;
  if (obj.ry || obj.rx) {
    obj.set({
      ry: obj.ry * scaleY,
      rx: obj.rx * scaleX,
      scaleX: 1,
      scaleY: 1,
    });
  } else {
    obj.set({
      width: width * scaleX,
      height: height * scaleY,
      scaleX: 1,
      scaleY: 1,
    });
  }
});

const reSetStrokeWidth = () => {
  canvas.getObjects().forEach(function (object) {
    if (object.type !== "point") {
      object.set({
        strokeWidth: 2 / zoomLevel,
      });
    } else {
      object.set({
        strokeWidth: 2 / zoomLevel,
        ry: 4 / zoomLevel,
        rx: 4 / zoomLevel,
        scaleX: 1,
        scaleY: 1,
      });
    }
  });
  canvas.renderAll();
};

const SelectedShape = (object) => {
  console.log("SelectedShape object :>> ", object);
  // openPopOver(object);
};

const deleteShape = () => {
  const activeObject = canvas.getActiveObject();
  console.log("activeObject :>> ", activeObject);
  shapeDelete(activeObject);
  canvas.remove(activeObject);
  canvas.renderAll();
};

const shapeSave = (shape) => {
  allShapes.push(shape);
  console.log("shapeSave allShapes :>> ", allShapes);
};

const shapeDelete = (shape) => {
  allShapes = allShapes.filter((item) => item.id !== shape.id);
  console.log("shapeDelete allShapes :>> ", allShapes);
};

const shapeUpdate = (_shape) => {
  let { x: XPercentage, y: YPercentage } = pxToPercentage(
    _shape.left,
    _shape.top
  );
  let { x: widthPercentage, y: heightPercentage } = pxToPercentage(
    _shape.width,
    _shape.height
  );
  let shape = {
    id: _shape.id,
    type: _shape.type,
    x: XPercentage,
    y: YPercentage,
    width: widthPercentage,
    height: heightPercentage,
  };
  allShapes = allShapes.map((item) => (item.id !== _shape.id ? item : shape));

  console.log("shapeUpdate allShapes :>> ", allShapes);
};

const openPopOver = (object) => {
  const { id, left, top, width, height } = object;
  console.log("object :>> ", object);
  console.log("popover :>> ", popover);
  popover.style.display = "block";
  popover.style.position = "absolute";
  popover.style.top = `${top + height}px`;
  popover.style.left = `${left}px`;
};
