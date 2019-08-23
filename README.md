# image-gradient

Image gradient takes an image and generates a gradient like image based off of the colors that appear within it. Output directory is respective to the original image file.

## Usage

```
npm i
node index.js images/test.jpeg
```

## Configuration options

To change the configuration of the generated image, edit the values within `index.js`

### Changing gradient image size

```js
// put your values here [width, height]
const size = [Number, Number];
```

### Changing number of columns

```js
let columns = <Number>;
```

### Toggling horizontal columns

Horizontal columns provide an interesting perspective, but can be disabled and the script will use solely vertical columns.

```js
// false makes script only generate vertical columns
const useHorizontalColumns = <Boolean>;
```

## Example

### Original [source](https://www.pexels.com/photo/graffiti-wall-art-1647121/):

![Original](/images/test.jpeg)

### Generated with horizontal lines:

![Generated, horizontal lines](/images/test.jpeg-gradient-horizontal.png)

### Generated with vertical lines only:

![Generated, vertical lines only](/images/test.jpeg-gradient.png)
