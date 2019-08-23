const fs = require("fs");
const { createCanvas, Image } = require("canvas");

// CONFIGURATION SETTINGS
// ======================

// size = [height <Number>, width <Number>]
const size = [1920, 1920];

// columns = <Number>
let columns = 32;

// useHorizontalColumns = <Boolean>
const useHorizontalColumns = true;

const file = process.argv[2];
const set = new Set();

fs.readFile(file, (err, data) => {
  if (err) {
    throw err;
  }

  // Create a new image based on the Buffer data read in
  const img = new Image();
  img.src = data;

  // Generate a canvas representation of our image so we can determine the colors within
  const canvas = createCanvas(img.width, img.height);
  const context = canvas.getContext("2d");
  context.drawImage(img, 0, 0);

  // Get specific color data from canvas image. This is a long array, every 4 items represent r,g,b,a
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  // Calculate all of the unique colors within the canvas image
  calculateUniqueColors(imageData.data);

  // Setup a second canvas to parse our generated image
  const gradientCanvas = createCanvas(size[0], size[1]);
  const gradientContext = gradientCanvas.getContext("2d");

  // Sort unique colors by their luminence, reverse to get light -> dark
  const setValues = [...set]
    .sort((a, b) => luminence(a) - luminence(b))
    .reverse();

  // If we have less colors than the desired number of columns, we will only generate the smaller number of columns
  if (setValues.length < columns) {
    columns = setValues.length;
  }

  // Calculate the horizontal and vertical width of columns based on total size of image
  const xSize = Math.ceil(size[0] / columns);
  const ySize = Math.ceil(size[1] / columns);

  for (var i = 0; i < columns; i++) {
    // Pick color in ordered set based on luminence threshold
    const valueIndex = Math.floor(setValues.length / columns) * i;
    gradientContext.fillStyle = `rgb(${setValues[valueIndex]})`;

    // Create vertial rectangular column
    gradientContext.fillRect(xSize * i, 0, xSize, size[1]);

    // Create horizontal rectangular column
    if (useHorizontalColumns) {
      gradientContext.fillRect(0, ySize * i, size[0], ySize);
    }
  }

  fs.writeFile(`${file}-gradient.png`, gradientCanvas.toBuffer(), err => {
    if (err) {
      throw err;
    }

    console.log(`File written as: ${file}-gradient.png`);
  });
});

// Creates RGB value (ignores alpha) and adds to set for unique color storage
function calculateUniqueColors(data) {
  for (var i = 0; i < data.length; i += 4) {
    set.add(`${data[i]},${data[i + 1]},${data[i + 2]}`);
  }
}

// Calculate lumience of a given RGB color (format is r,g,b created in calculateUniqueColors)
function luminence(str) {
  var rgb = str.split(",").map(Number);

  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}
