Test the solution 
------------------

// Run index.html in Chrome for visual Test
I have used "menlo" font to display text output into html to visually match to Notepad. 

Windows - Simply copy the given "Menlo-Regular.ttf" into your C:/Windows/Fonts
Mac - its has by default. I am using Mac ;)




// Run Test over Developer Tool in Chrome - Change your input values

Option 1
  Open index.html in your browser and Inspect into Chrome Developer Tool, Which I use always.
  Copy below code, you can chagne the input variable values and rerun 

  ````````````````````````````````````````````````````````````````````````````````
  var input = "C 20 4\nL 1 2 6 2\nL 6 3 6 4\nR 14 1 18 3\nB 10 3 o\nQ";
  var drawingTool = new DrawingTool(input);
  drawingTool.draw();
  ````````````````````````````````````````````````````````````````````````````````

Option 2
  Open chrome tab as default and Inspect into Chrome Developer Tool
  Copy the drawingTools.js source and paste and execute, then below code can run same as above
  
  ````````````````````````````````````````````````````````````````````````````````
  var input = "C 20 4\nL 1 2 6 2\nL 6 3 6 4\nR 14 1 18 3\nB 10 3 o\nQ";
  var drawingTool = new DrawingTool(input);
  drawingTool.draw();
  ````````````````````````````````````````````````````````````````````````````````