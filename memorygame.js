var imgArray;
var giphyInfo;
var imgsReveal = [];
var allImagesRandomized = false;
var previousImgIndex = -1;
var alertMessage = "";
var alertMessageComing = false;
var hideMismatchIndexes = [];
const IMAGE_WIDTH = 50;
const IMAGE_HEIGHT = 50;
const ROWS = 5;
const NUM_OF_IMGS = 10;

//point to JSON from giphy
function preload() {
  var url = "http://api.giphy.com/v1/gifs/search?q=puppies&api_key=h6HZ8I2DlH4s3cfzEhfo7yYojnbPRMfZ&limit=" + NUM_OF_IMGS;
  giphyInfo = loadJSON(url);
}

function setup() {
  createCanvas(800, 1000);
}

//is the mouseclick with in a square? yes, assign a number to imgIndex. No, assign -1
//previousImgIndex is already assigned -1 in global. If imgIndex is within the square (>-1) and not equal to previousImgIndex, 
//the the array (blank in global) imgsReveal at the index location using imgIndex is assigned true (whole array of booleans)
//if the previousImgIndex is greater than -1 and function doTheImagesMatch using the two indexes we created using mouse clicks is true
//and if the function allMatched calling the array imgsReveal is true (all match), then the alert messsage says you win, asks play again.
//if the above is true but there are still false responses in imgsReveal, then the game is not over but since the images matched
//alert "they match" and return imgIndex -1
//otherwise the cards don't match, so alert that. then assign hideMismatchIndexes (global blank array to start) with two values:
//the previousImgIndex and imgIndex
//console log those values. Asign imgIndex to previous ImgIndex to move on to the next click
function mouseClicked() {
  var imgIndex = translateToImgIndex(mouseX, mouseY);
  if (imgIndex > -1 && imgIndex !== previousImgIndex) {
    imgsReveal[imgIndex] = true;
    if (previousImgIndex > -1) {
      if (doTheImagesMatch(imgIndex, previousImgIndex)) {
        if (allMatched(imgsReveal)) {
          alertMessage = "You win! Play again?";
        } else {
          alertMessage = "They Match!";
        }
      } else {
        alertMessage = "They Don't Match!!";
        hideMismatchIndexes = [previousImgIndex, imgIndex];
      }
      imgIndex = -1;
    }

    console.log(imgIndex, previousImgIndex);
    previousImgIndex = imgIndex;
  }
  // prevent default
  return false;
}

//this function uses the array imgsReveal to determine if the card has already been matched (false). If it's false, it stays false.
//otherwise, return it as true
function allMatched(imgsReveal) {
  for (var i = 0; i < imgsReveal.length; i++) {
    if (!imgsReveal[i]) {
      return false;
    }
  }
  return true;
}

//using the current imgIndex and previousImgIndex, this will be true if the indexes of current and previous match. Otherwise
//nothing
function doTheImagesMatch(imgIndex, previousImgIndex) {
  return imgArray[imgIndex] === imgArray[previousImgIndex];
}

//create the index of an image using the # of images pulled (20) and constants to make rows and columns. 
//If that index is within a square (defined in insideSquare(), it is assigned to i in translateToImgIndex (an index) and imgIndex above.
//The location inside the square is also assigned to inX and inY in insideSquare().
//if the click is not within a square, this function returns -1, assigned to imgIndex above)
function translateToImgIndex(x, y) {
  for (var i = 0; i < imgArray.length; i++) {
    var imgx = (i % ROWS) * IMAGE_WIDTH;
    var imgy = Math.floor(i / ROWS) * IMAGE_HEIGHT;
    if (insideSquare(imgx, imgy, x, y)) {
      return i;
    }
  }
  return -1;
}

//this returns a location for the mouse click that is used to match it within rows/columns above
function insideSquare(imgx, imgy, mouseX, mouseY) {
  var inX = mouseX > imgx && mouseX < imgx + IMAGE_WIDTH;
  var inY = mouseY > imgy && mouseY < imgy + IMAGE_HEIGHT;
  return inX && inY;
}

//if giphyInfo (JSON, urls) is false (we don't have the images to yet), draw nothing. 
function draw() {
  if (!giphyInfo) {
    return;
  }

  //if allImagesRandomized (set as false globally) is not false, show "Loading game" text as directed.
  if (!allImagesRandomized) {
    textSize(16);
    text("Loading Memory Game!", 10, 30);
  }

  //if imgArray is falseish (undefined globally), then make it an empty array.
  //create a variable and assign values with the extractedMed...URLS (basically, get the URLS once). That function
  //pushes the urls into the array. 
  if (!imgArray) {
    imgArray = [];
    var arrayURLS = extractMedImgURLS(giphyInfo);
    loadGiphyImg(arrayURLS);
    return;
  }

  //if allImagesRandomized is true (meaning, the next if statement has happened, call the drawGrid function
  if (allImagesRandomized) {
    drawGrid();
  }

  //if the images are not randomized and all of the images are loaded (function below), assign values to imgArray
  //using the randomizeImages function and assign allImagesRandomized as true so the grid can be drawn
  if (!allImagesRandomized && areAllImagesLoaded(imgArray)) {
    imgArray = randomizeImages(imgArray);
    allImagesRandomized = true;
  }

  //call function
  processAlerts();
}


//called at the end of draw
function processAlerts() {
  //if the alertMessage is not empty (will be filled based on matches when clicked) and there is no alert message coming (false
  //assign true to alertMessageComing
  if (alertMessage != "" && !alertMessageComing) {
    alertMessageComing = true;

  //otherwise, if the alert message is empty and the alert message is coming is true (assigned above)
  } else if (alertMessage != "" && alertMessageComing) {

    //if alert message contains "win", **not sure what == -1 is, alert that message
    //otherwise, confirm (shows okay or cancel buttons) with the alert message play again?, because you won if you get this message
    //console log a message. assign imgArray with the randomized images and set all imgsReveal to false.
    //otherwise, alert thanks for playing
    if (alertMessage.indexOf("win") == -1) {
      alert(alertMessage);
    } else {
      if (confirm(alertMessage)) {
        console.log("confirm return to true");
        imgArray = randomizeImages(imgArray);
        setAllToFalse(imgsReveal);
      } else {
        alert("Thanks for playing!");
      }
    }
    //sets alert message back to empty, then Coming to false
    // not sure about the rest of it
    alertMessage = "";
    alertMessageComing = false;
    if (hideMismatchIndexes.length > 0) {
      imgsReveal[hideMismatchIndexes[0]] = false;
      imgsReveal[hideMismatchIndexes[1]] = false;
      hideMismatchIndexes = [];
    }
  }
}

//called to reset the game
function setAllToFalse(arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i] = false;
  }
}

//called when allImagesRandomized is true. If the imagesReveal is true (by click), place the images in a grid.
//otherwise, draw grey rectangles to hide the images
function drawGrid() {
  for (var i = 0; i < imgArray.length; i++) {
    if (imgsReveal[i]) {
      image(
        imgArray[i],
        (i % ROWS) * IMAGE_WIDTH,
        Math.floor(i / ROWS) * IMAGE_HEIGHT,
        IMAGE_WIDTH,
        IMAGE_HEIGHT
      );
    } else {
      //make grey rectangle to hide images
      fill("grey");
      rect(
        (i % ROWS) * IMAGE_WIDTH,
        Math.floor(i / ROWS) * IMAGE_HEIGHT,
        IMAGE_WIDTH,
        IMAGE_HEIGHT
      );
    }
  }
}

//invoked when imgArray is undefined in draw to grab the URLs from JSON for a specific sized-image
function extractMedImgURLS(giphyInfo) {
  var arrayURLS = [];
  for (var i = 0; i < giphyInfo.data.length; i++) {
    arrayURLS.push(giphyInfo.data[i].images.downsized_medium.url);
  }
  return arrayURLS;
}

//i think this pushes the array URLS pulled from giphy to load the images (a p5 thing that needs to happen to load the images)
function loadGiphyImg(arrayURLS) {
  for (var i = 0; i < arrayURLS.length; i++) {
    loadImage(arrayURLS[i], function (gif) {
      console.log("Image loaded");
      imgArray.push(gif);
      imgArray.push(gif);
    });
  }
}

//pass in the values from array imgArray. this will return true if the number of elements in imgArray are equal to variable NUM_OF_IMGS
//times 2 (10 images, repeated twice. -- constant set above)
function areAllImagesLoaded(imgArray) {
  return imgArray.length === NUM_OF_IMGS * 2;
}

//called after the images are loaded but not yet randomized. creates a new, blank array and blank array to imgsReveal
//loop through when the imgArray is greater than 0: creates a random number from 0-19. pushes the img in imgArray to that location in 
//newImgArr. pushes false to imgsRevealed (will be hidden by gray, removes one value from that imgArray -- I
//think this replaces something but I forget/cannot figture out right now.
//log the random number
//return newImgArr ay
function randomizeImages(imgArray) {
  var newImgArr = [];
  imgsReveal = [];
  while (imgArray.length > 0) {
    var num = Math.floor((Math.random() * imgArray.length));
    newImgArr.push(imgArray[num]);
    imgsReveal.push(false);
    imgArray.splice(num, 1);
  }
  console.log(num);
  return newImgArr;
}