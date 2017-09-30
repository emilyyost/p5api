var imgArray;
var giphyInfo;

function preload() {
  var url = "http://api.giphy.com/v1/gifs/search?q=puppies&api_key=h6HZ8I2DlH4s3cfzEhfo7yYojnbPRMfZ&limit=25";
  giphyInfo = loadJSON(url);
}

function setup() {
  createCanvas(800, 1000);
}

function draw() {
  if (!giphyInfo) {
    return;
  }
  if (!imgArray) {
    imgArray = [];
    var arrayURLS = extractMedImgURLS(giphyInfo);
    loadGiphyImg(arrayURLS);
    return;
  }
  for (var i = 0; i < imgArray.length; i++) {
    image(imgArray[i], (i % 5) * 50, Math.floor(i / 5) * 50, 50, 50);
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
    });
  }
}