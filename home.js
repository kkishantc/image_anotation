var objectType = "";
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

context.canvas.width = window.innerWidth;
context.canvas.height = window.innerHeight;

function setType(_type) {
    console.log("_type: ", _type);

    if (_type === "ractangle") {
        var shapes = [];
        var isCon = false;
        var cur = 0;

        function updateFrame() {
            shapes.forEach((el) => {
                context.strokeRect(el.x1, el.y1, el.x2 - el.x1, el.y2 - el.y1);
            });
        }

        canvas.addEventListener("pointerdown", function (e) {
            isCon = true;

            shapes.push({
                x1: e.clientX - canvas.offsetLeft,
                y1: e.clientY - canvas.offsetTop,
                x2: e.clientX - canvas.offsetLeft,
                y2: e.clientY - canvas.offsetTop,
            });

        });

        canvas.addEventListener("pointermove", function (e) {
            if (isCon) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                shapes[cur].x2 = e.clientX - canvas.offsetLeft;
                shapes[cur].y2 = e.clientY - canvas.offsetTop;
                requestAnimationFrame(updateFrame);
            }
        });

        canvas.addEventListener("pointerup", function (e) {
            isCon = false;
            cur += 1;
        });

    }
    if (_type === "circle") {

    }
    if (_type === "point") {

    }
    if (_type === "erase") {

    }
    if (_type === "clear") {

    }

}

// make_base()

// function make_base() {

//     base_image = new Image();
//     base_image.src = './images.jpeg';
//     base_image.id = 'image';
//     base_image.onload = function () {
//         context.drawImage(base_image, 0, 0, window.screen.width, 500);
//     }

// }
