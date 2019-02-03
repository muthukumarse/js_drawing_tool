class DrawingTool {
  constructor(rawCommands) {
    // Canvas width, height
    this.canvasWidth = undefined;
    this.canvasHeight = undefined;

    // List of Commmands
    this.commandsList = [];

    // Output
    this.outputText = '';

    // Cell to hold command action
    this.cell = [];

    // Validate given Commands
    this.validateCommands(rawCommands);
  }

  validateCommands(rawCommands) {
    let commandsList = rawCommands.split('\n');

    // Clear empty rows if any
    commandsList = commandsList.filter(n => n);

    // Check at least Canvas & Quit
    if (commandsList.length < 2) {
      this.outputText = "At least 2 commands required to prepare Canvas.\n C 20 4\n Q";
    } else {
      // Validate Canvas command
      this.validateCanvasCommand(commandsList[0]);

      // Validate remaining commands if the Canvas OK
      if (!this.outputText) {
        for (let i = 1; i < commandsList.length - 1; i++) {
          var command = commandsList[i].trim();
          let commandType = command[0];
          if (commandType === 'L') { // Line
            const shapeCommand = this.prepareShapeCommand(command);
            // Check is that inside Canvas
            this.validateCanvasBoundary(shapeCommand.x1, shapeCommand.y1, 'Line');
            this.validateCanvasBoundary(shapeCommand.x2, shapeCommand.y2, 'Line');
            this.validateLineValues(shapeCommand.x1, shapeCommand.y1, shapeCommand.x2, shapeCommand.y2, 'Line');
            this.commandsList.push(shapeCommand);
          } else if (commandType === 'R') { // Rectange
            const shapeCommand = this.prepareShapeCommand(command);
            this.validateCanvasBoundary(shapeCommand.x1, shapeCommand.y1, 'Rectange');
            this.validateCanvasBoundary(shapeCommand.x2, shapeCommand.y2, 'Rectange');
            this.commandsList.push(shapeCommand);
          }
          else if (commandType === 'B') { // Fill
            const fillCommand = this.prepareFillCommand(command);
            // Check is that inside Canvas
            this.validateCanvasBoundary(fillCommand.x, fillCommand.y, 'Fill');
            this.commandsList.push(fillCommand);
          } else {
            this.outputText = "The program accepts the following list of commands: \n Canvas - C {width} {height}\n Line - L {x1} {y1} {x2} {y2}\n Rectangle - R {x1} {y1} {x2} {y2}\n Fill - B {x} {y} {color}: Bucket Fill\n Quit - Q\n\nExample -\n C 20 4\n L 1 2 6 2\n L 6 3 6 4\n R 14 1 18 3\n B 10 3 o\n Q";
          }
        }
        this.validateQuitCommand(commandsList[commandsList.length - 1]);
      }
    }
  }

  validateCanvasCommand(command) {
    let commandSplitted = command.trim().split(' ');

    // Should start with Canvas
    if (commandSplitted[0] !== 'C') {
      this.outputText = 'The first command should be the Canvas. Syntax: "C {width} {height}", Example -\n\nC 20 4';
    } else {
      // Should be positive 
      if (commandSplitted[1] < 1 || commandSplitted[2] < 1) {
        this.outputText = 'The Canvas Width & Height should be a positive number, Example -\n\nC 20 4';
      } else {
        // Canvas width height +1 to get correct drawing size
        this.canvasWidth = parseInt(commandSplitted[1]) + 1;
        this.canvasHeight = parseInt(commandSplitted[2]) + 1;
      }
    }
  }

  validateQuitCommand(command) {
    // Should be Q as Quit
    if (command !== 'Q') {
      this.outputText = 'The last command should be the Quit. Example - "Q"';
    }
  }

  validateCanvasBoundary(x, y, which) {
    if (x < 1 || y < 1 || x >= this.canvasWidth || y >= this.canvasHeight) {
      this.outputText = which + ' Command has problem. x: ' + x + ' and y: ' + y + ' should be inside the canvas. width: ' + (this.canvasWidth - 1) + ', height: ' + (this.canvasHeight - 1) + '\n';
    }
  }

  validateLineValues(x1, y1, x2, y2, which) {
    if (!(x1 === x2 || y1 === y2)) {
      this.outputText = which + ' Command input does not form a straight line. Should be {x1} equals {x2} or {y1} equals {y2}.\n';
    }
  }

  prepareShapeCommand(command) {
    let commandSplitted = command.split(' ');
    return {
      type: command[0],
      x1: parseInt(commandSplitted[1]),
      y1: parseInt(commandSplitted[2]),
      x2: parseInt(commandSplitted[3]),
      y2: parseInt(commandSplitted[4])
    };
  }

  prepareFillCommand(command) {
    let commandSplitted = command.split(' ');
    return {
      type: 'B',
      x: parseInt(commandSplitted[1]),
      y: parseInt(commandSplitted[2]),
      color: commandSplitted[3]
    }
  }

  draw() {
    // If got into Error 
    if (this.outputText) {
      return this.outputText;
    }

    // Draw
    while (this.cell.push([]) <= this.canvasHeight);
    this.drawCanvas(this.canvasWidth, this.canvasHeight);
    this.outputText = this.drawCells();
    for (let i = 0; i < this.commandsList.length; i++) {
      var command = this.commandsList[i];
      if (command.type === 'L') {
        this.drawLine(command.x1, command.y1, command.x2, command.y2, 'x');
        this.outputText += this.drawCells();
      } else if (command.type === 'R') {
        this.drawRectangle(command.x1, command.y1, command.x2, command.y2, 'x');
        this.outputText += this.drawCells();
      } else if (command.type === 'B') {
        this.drawFill(command.x, command.y, command.color);
        this.outputText += this.drawCells();
      }
    }
    return this.outputText;
  }

  // Canvas
  drawCanvas(width, height) {
    this.drawLine(0, 0, 0, height, '|');
    this.drawLine(width, 0, width, height, '|');
    this.drawLine(0, 0, width, 0, '-');
    this.drawLine(0, height, width, height, '-');
  }

  // Line
  drawLine(x1, y1, x2, y2, filler) {
    if (x1 === x2) { // Vertical
      if (y1 > y2) {
        let _y1 = y1;
        y1 = y2;
        y2 = _y1;
      }
      for (let i = y1; i <= y2; i++) {
        this.cell[i][x1] = filler;
      }
    } else if (y1 === y2) { // Horizontal
      if (x1 > x2) {
        let _x1 = x1;
        x1 = x2;
        x2 = _x1;
      }
      for (let i = x1; i <= x2; i++) {
        this.cell[y1][i] = filler;
      }
    }
  }

  // Rectange
  drawRectangle(x1, y1, x2, y2, filler) {
    this.drawLine(x1, y1, x2, y1, filler);
    this.drawLine(x1, y2, x2, y2, filler);
    this.drawLine(x1, y1, x1, y2, filler);
    this.drawLine(x2, y1, x2, y2, filler);
  }

  // Fill
  drawFill(x, y, colour) {
    let target_colour = this.cell[y][x];
    if (target_colour === colour) {
      return;
    }
    this.drawFillRepeat(x, y, target_colour, colour);
  }

  // Recursion
  drawFillRepeat(x, y, target_colour, colour) {
    if (target_colour !== this.cell[y][x]) {
      return;
    }
    this.cell[y][x] = colour;
    this.drawFillRepeat(x, y + 1, target_colour, colour);
    this.drawFillRepeat(x + 1, y, target_colour, colour);
    this.drawFillRepeat(x, y - 1, target_colour, colour);
    this.drawFillRepeat(x - 1, y, target_colour, colour);
  }

  // Draw Fill
  drawCells() {
    let output = "";
    for (let y = 0; y <= this.canvasHeight; y++) {
      for (let x = 0; x <= this.canvasWidth; x++) {
        var cell = this.cell[y][x];
        output += cell || " ";
      }
      output += "\n";
    }
    return output;
  }
}
