var deleteIcon =
  "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
var deleteImg = document.createElement("img");
deleteImg.src = deleteIcon;
var eventType = "";
var allShapes = [];
var allDetails = [];

let imageURL = "./cat.jpg";
let Canvas = document.getElementById("canvas");
let popover = document.getElementById("popover");
let image = new Image(imageURL);
image.src = imageURL;
Canvas.width = image.naturalWidth;
Canvas.height = image.naturalHeight;

// Initialize canvas variable
var stroke = "black";
var strokeWidth = 2;
var cornerSize = 10;
var cornerStyle = "rect";
var cornerColor = "red";
var fill = "rgba(0,0,0,0)";
var transparentCorners = false;
var objectCaching = false;
var hasControls = true;
var hasBorders = true;
var selectable = true;

var settings = {
  stroke,
  objectCaching,
  strokeWidth,
  cornerSize,
  cornerStyle,
  cornerColor,
  transparentCorners,
  hasControls,
  hasBorders,
  fill,
  selectable,
};
// Initialize canvas
var canvas = new fabric.Canvas("canvas");
canvas.perPixelTargetFind = true;
canvas.targetFindTolerance = 4;

fabric.Image.fromURL(imageURL, function (img) {
  img.set({
    scaleX: canvas.width / img.width,
    scaleY: canvas.height / img.height,
    selectable: false,
  });
  canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
    backgroundImageStretch: false,
  });
});

const setType = (_type) => {
  eventType = _type;
  if (eventType === "rectangle") {
    drawRectangle();
  } else if (eventType === "circle") {
    drawCircle();
  } else if (eventType === "point") {
    drawPoint();
  }
  eventType = null;
};

const drawRectangle = () => {
  var rect = new fabric.Rect({
    id: "1",
    mouseUpHandler: handelMouseUp,
    // mouseDownHandler: handelMouseDown,
    // mouseMoveHandler: handelMouseMove,
    left: 100,
    top: 50,
    width: 200,
    height: 100,
    ...settings,
  });

  canvas.add(rect);
  canvas.setActiveObject(rect);
};

const drawCircle = () => {
  var circle = new fabric.Circle({
    id: "2",
    mouseUpHandler: handelMouseUp,
    // mouseDownHandler: handelMouseDown,
    // mouseMoveHandler: handelMouseMove,
    left: 300,
    top: 100,
    radius: 50,
    ...settings,
  });
  canvas.add(circle);
};

const drawPoint = () => {
  var point = new fabric.Circle({
    id: "3",
    mouseUpHandler: handelMouseUp,
    // mouseDownHandler: handelMouseDown,
    // mouseMoveHandler: handelMouseMove,
    left: 100,
    top: 100,
    radius: 5,
    ...settings,
    hasControls: false,
    hasBorders: false,
    fill: "black",
  });
  canvas.add(point);
};

const handelMouseUp = (eventData, transform) => {
  var target = transform.target;
  console.log("handelMouseUp target: ", target);
};

canvas.on("mouse:up", function (e) {
  // Get selected shape object details
  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    openPopOver(activeObject);
  }
});

const openPopOver = (object) => {
  const { id, left, top, width, height } = object;
  console.log("object :>> ", object);
  console.log("popover :>> ", popover);
  popover.style.display = "block";
  popover.style.position = "absolute";
  popover.style.top = `${top + height}px`;
  popover.style.left = `${left}px`;
};
