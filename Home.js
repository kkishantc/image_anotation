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
var zoomLevel = 1;
var canvasContainer = document.getElementById("canvas-container");
let imageURL =
  "https://cdn.pixabay.com/photo/2015/11/16/14/43/cat-1045782__340.jpg";
let Canvas = document.getElementById("canvas");
let popover = document.getElementById("popover");

let image = document.createElement("img");
image.src = imageURL;

canvasContainer.style.width = `${image.naturalWidth}px`;
canvasContainer.style.height = `${image.naturalHeight}px`;
canvasContainer.style.overflow = "auto";

Canvas.width = image.naturalWidth;
Canvas.height = image.naturalHeight;

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
};

// const setImageInViewPort = () => {
//   const viewportWidth = window.innerWidth;
//   const viewportHeight = window.innerHeight;
//   let aspectRatio = image.width / image.height;
//   maxW = viewportWidth * 0.8;
//   maxH = viewportHeight * 0.8;
//   console.log("maxW,maxH :>> ", maxW, maxH);
//   console.log(image.getBoundingClientRect());
//   if (image) {
//     if (image.naturalWidth >= maxW || image.naturalHeight >= maxH) {
//       if (maxW / maxH > aspectRatio) {
//         maxW = maxH * aspectRatio;
//       } else {
//         maxH = maxW / aspectRatio;
//       }
//       Canvas.width = maxW;
//       Canvas.height = maxH;
//       console.log(
//         "Canvas.width,Canvas.height :>> ",
//         Canvas.width,
//         Canvas.height
//       );
//     }

//     OrgImageSize.width = image.width;
//     OrgImageSize.height = image.height;
//   }
// };

const setImage = () => {
  fabric.Image.fromURL(imageURL, function (img) {
    console.log("img.width :>> ", img.width);
    console.log("img.height :>> ", img.height);
    img.set({
      scaleX: Canvas.width / img.width,
      scaleY: Canvas.height / img.height,
      selectable: false,
    });
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
      backgroundImageStretch: false,
    });
  });
};
window.onload = () => {
  if (image.src) {
    // setImageInViewPort();

    canvas.perPixelTargetFind = true;
    canvas.targetFindTolerance = 4;
    setImage();
    // let _shape = {
    //   id: 85953,
    //   type: "point",
    //   // width: 1,
    //   // height: 1,
    //   x: 99,
    //   y: 99,
    // };
    // drawPoint(_shape);
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
  }
};

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

const zoomIn = () => {
  zoomLevel *= 1.1;
  canvas.setZoom(zoomLevel);
  reSetStrokeWidth();
};
const zoomOut = () => {
  zoomLevel /= 1.1;
  canvas.setZoom(zoomLevel);
  reSetStrokeWidth();
};
const zoomReset = () => {
  zoomLevel = 1;
  canvas.setZoom(zoomLevel);
  reSetStrokeWidth();
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

// const openPopOver = (object) => {
//   const { id, left, top, width, height } = object;
//   console.log("object :>> ", object);
//   // console.log("popover :>> ", popover);
//   // popover.style.display = "block";
//   // popover.style.position = "absolute";
//   // popover.style.top = `${top + height}px`;
//   // popover.style.left = `${left}px`;
// };
