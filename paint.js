class paint {
  constructor() {
    this.canvas = document.getElementById("board");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = 800;
    this.canvas.height = 500;
    this.color = "#ff0000";
    this.tool = "pen";
    this.lineWidth = 1;
    this.drawBackground();
    this.listenEvent();
    this.startPos = {
      x: 0,
      y: 0
    };
    this.currentPos = {
      x: 0,
      y: 0
    };

    this.drawing = false;
    this.image = null;
    this.afterImage = null;
  }
  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
  mousedown() {
    let mousePos = this.getMousePos(this.canvas, event);
    this.drawing = true;
    if (this.drawing) {
      this.currentPos = mousePos;
      this.startPos = mousePos;
    }
    this.image = new Image();
    this.image.src = this.canvas.toDataURL("image/bmp", 1.0);
  }
  mousemove() {
    let mousePos = this.getMousePos(this.canvas, event);
    if (this.drawing) {
      switch (this.tool) {
        case "pen":
          this.drawLine(
            this.currentPos.x,
            this.currentPos.y,
            mousePos.x,
            mousePos.y
          );
          break;
        case "line":
          this.undo();
          this.drawLine(
            this.startPos.x,
            this.startPos.y,
            mousePos.x,
            mousePos.y
          );
          break;
        case "rect":
          this.undo();
          this.drawRect(
            this.startPos.x,
            this.startPos.y,
            mousePos.x,
            mousePos.y
          );
          break;
      }

      this.currentPos = mousePos;
    }
  }
  mouseup() {
    this.afterImage = new Image();
    this.afterImage.src = this.canvas.toDataURL("image/bmp", 1.0);
    this.drawing = false;
  }
  listenEvent() {
    this.canvas.addEventListener("mousedown", event => {
      this.mousedown(event);
    });
    this.canvas.addEventListener("mousemove", event => {
      this.mousemove(event);
    });
    this.canvas.addEventListener("mouseup", event => {
      this.mouseup(event);
    });
  }
  undo() {
    this.ctx.drawImage(this.image, 0, 0, 800, 500);
  }
  redo() {
    this.ctx.drawImage(this.afterImage, 0, 0, 800, 500);
  }
  drawBackground() {
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(0, 0, 800, 500);
  }
  drawLine(startX, startY, endX, endY) {
    this.ctx.beginPath();
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.strokeStyle = this.color;

    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, endY);
    this.ctx.stroke();
  }
  drawRect(startX, startY, endX, endY) {
    this.ctx.beginPath();
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.strokeStyle = this.color;
    this.ctx.rect(startX, startY, endX - startX, endY - startY);
    this.ctx.stroke();
  }
}

let p = new paint();
