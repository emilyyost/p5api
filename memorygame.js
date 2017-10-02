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
function preload() {
  var url = "http://api.giphy.com/v1/gifs/search?q=puppies&api_key=h6HZ8I2DlH4s3cfzEhfo7yYojnbPRMfZ&limit="+NUM_OF_IMGS;
  giphyInfo = loadJSON(url);
}

function setup() {
  createCanvas(800, 1000);
}

function mouseClicked() {
  var imgIndex = translateToImgIndex(mouseX, mouseY);
  if (imgIndex > -1 && imgIndex !== previousImgIndex) {
    imgsReveal[imgIndex] = true; 
    if (previousImgIndex > -1) {
      if (doTheImagesMatch(imgIndex, previousImgIndex)) {
        if (allMatched(imgsReveal)){
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

function allMatched(imgsReveal){
  for (var i = 0; i < imgsReveal.length; i++){
    if (!imgsReveal[i]) {
      return false;
    } 
  } 
  return true; 
}

function doTheImagesMatch(imgIndex, previousImgIndex) {
  return imgArray[imgIndex] === imgArray[previousImgIndex];
}

function translateToImgIndex(x, y){
  for (var i =0; i<imgArray.length; i++){
    var imgx = (i % ROWS) * IMAGE_WIDTH;
    var imgy = Math.floor(i / ROWS) * IMAGE_HEIGHT;
    if (insideSquare(imgx, imgy, x, y)) {
      return i;
    }
  }
  return -1;
}

function insideSquare(imgx, imgy, mouseX, mouseY) {
  var inX = mouseX > imgx && mouseX < imgx + IMAGE_WIDTH;
  var inY = mouseY > imgy && mouseY < imgy + IMAGE_HEIGHT;
  return inX && inY;
}

function draw() {
  if (!giphyInfo) {
    return;
  }
  if (!allImagesRandomized) {
    textSize(16);
    text("Loading Memory Game!", 10, 30);
  }
  if (!imgArray) {
    imgArray = [];
    var arrayURLS = extractMedImgURLS(giphyInfo);
    loadGiphyImg(arrayURLS);
    return;
  }
  if (allImagesRandomized) {
    drawGrid();
  }
  if (!allImagesRandomized && areAllImagesLoaded(imgArray)) {
    imgArray = randomizeImages(imgArray); 
    allImagesRandomized = true;
  }
  processAlerts();
}

function processAlerts() {
  if (alertMessage != "" && !alertMessageComing) {
    alertMessageComing = true;
  } else if (alertMessage != "" && alertMessageComing){
    if (alertMessage.indexOf("win") == -1) {
      alert(alertMessage);
    } else {
      if (confirm(alertMessage)){
        console.log("confirm return to true");
        imgArray = randomizeImages(imgArray);
        setAllToFalse(imgsReveal);
      } else {
        alert("Thanks for playing!");
      } 
    }
    
    alertMessage = "";
    alertMessageComing = false;
    if (hideMismatchIndexes.length > 0) {
      imgsReveal[hideMismatchIndexes[0]] = false;
      imgsReveal[hideMismatchIndexes[1]] = false;
      hideMismatchIndexes = []; 
    }
  }
}

function setAllToFalse (arr) {
  for (var i = 0; i < arr.length; i++){
    arr[i] = false;
  }
}

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

function extractMedImgURLS(giphyInfo) {
  var arrayURLS = [];
  for (var i = 0; i < giphyInfo.data.length; i++) {
    arrayURLS.push(giphyInfo.data[i].images.downsized_medium.url);
  }
  return arrayURLS;
}

function loadGiphyImg(arrayURLS) {
  for (var i = 0; i < arrayURLS.length; i++) {
    loadImage(arrayURLS[i], function (gif) {
      console.log("Image loaded");
      imgArray.push(gif);
      imgArray.push(gif);      
    });
  }
}

function areAllImagesLoaded(imgArray) {
  return imgArray.length === NUM_OF_IMGS * 2;
}

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