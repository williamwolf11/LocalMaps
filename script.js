//Drag n drop imagez
var green;
var blue;
var brown;
var apt1;
var apt2;
var house;
var transparent;

//Backgrounds
var farmBg;
var cityBg;
var suburbBg;

//Displaymode stuff
var officialMap;
var pinImage;

//Set up some arrays!
var imageArr;
var imageIndex = 0;

var bgArr;
var bgIndex = 0;

var newTree;
var newTrees = [];
var pins = [];

//Drag n drop specific weirdness
var currentSprite;
var stationaryCurrentSprite;
var bx;
var by;
var treeWidth = 64;
var treeHeight = 73;
var overTree = false;
var locked = false;
var xOffset = 0.0;
var yOffset = 0.0;

var createMode = false;
var placeMap = false;

function preload(){
  green = loadImage("images/greenspace.png");
  blue = loadImage("images/bluespace.png");
  brown = loadImage("images/brownspace.png");
  apt1 = loadImage("images/buildingish.png");
  apt2 = loadImage("images/buildingish2.png");
  house = loadImage("images/house.png");
  transparent = loadImage("images/transparent.png");

  farmBg = loadImage("images/farmtemp.png");
  suburbBg = loadImage("images/streettemp.png");
  cityBg = loadImage("images/citytemp.png");

  officialMap = loadImage("images/officialmap.png");
  pinImage = loadImage("images/pin.png");
}

function setup() {
  document.getElementById("userInput").style.display = "none";
  var canvas1 = createCanvas(1425, 780);
  canvas1.parent("canvasHolder");
  bx = 50;
  by = 50;
  imageArr = [green, blue, brown, apt1, apt2, house, transparent];
  bgArr = [farmBg, suburbBg, cityBg, transparent];
}

function draw() {
  //Split the draw function into two modes, create mode and display mode
  if(createMode){
    if(bgIndex == 0 || bgIndex % 1 == 0){
      background("white");
      background(bgArr[bgIndex]);
    }
    drawSprites();

    // Test if the cursor is over the box
    if (
      mouseX > bx - treeWidth &&
      mouseX < bx + treeWidth &&
      mouseY > by - treeHeight &&
      mouseY < by + treeHeight
    ) {
      overTree = true;
      currentSprite.position.x = bx;
      currentSprite.position.y = by;
  }
    else{
      overTree = false;
    }
    //Press enter to delete the most recently dropped item
    if(keyIsDown(13) && newTree){
      newTree.remove();
    }
  }
  //displayMode
  else{
    background(officialMap);
    drawSprites();
  }
}


//Key press function
function keyPressed(){
    if(createMode){
      if(keyCode == RIGHT_ARROW){
        if(imageIndex < imageArr.length - 1){
          imageIndex+=0.5;
        }
        else{
          imageIndex = -0.5;
        }
        if(imageIndex == 0 || imageIndex%1 == 0){
          currentSprite.remove();
          currentSprite = createSprite(50, 50, 64, 73);
          currentSprite.addImage(imageArr[imageIndex]);
          stationaryCurrentSprite.remove();
          stationaryCurrentSprite = createSprite(50, 50, 64, 73);
          stationaryCurrentSprite.addImage(imageArr[imageIndex]);
        }
      }
      else if(keyCode == LEFT_ARROW){
        if(imageIndex > 0){
          imageIndex-=0.5;
        }
        else{
          imageIndex = imageArr.length - 0.5;
        }
        if(imageIndex == 0 || imageIndex%1 == 0){
          currentSprite.remove();
          currentSprite = createSprite(50, 50, 64, 73);
          currentSprite.addImage(imageArr[imageIndex]);
          stationaryCurrentSprite.remove();
          stationaryCurrentSprite = createSprite(50, 50, 64, 73);
          stationaryCurrentSprite.addImage(imageArr[imageIndex]);
        }
      }
      //this is for A
      else if(keyCode == DOWN_ARROW){
        if(bgIndex > 0){
          bgIndex-=0.5;
        }
        else{
          bgIndex = bgArr.length - 0.5;
        }
      }
      //this is for D
      else if(keyCode == UP_ARROW){
        if(bgIndex < bgArr.length - 1){
          bgIndex+=0.5;
        }
        else{
          bgIndex = -0.5;
        }
      }
    }
    //displayMode
    else{

    }
}

var viewingImage = false;

//Mouse functions
function mousePressed() {
  if (overTree) {
    locked = true;
  } else {
    locked = false;
  }
  xOffset = mouseX - bx;
  yOffset = mouseY - by;
  //If a user clicks on a pin, open the map assigned to said pin
  if(!createMode && !placeMap && !viewingImage){
    for(var i = 0; i < pins.length; i++){
      var ohD = dist(mouseX, mouseY, pins[i].position.x, pins[i].position.y);
      if(ohD <= 5){
        viewingImage = true;
        window.open("images/map" + i + ".jpeg");
        var delayInMilliseconds = 1000; //1 second

        setTimeout(function() {
          viewingImage = false;
        }, delayInMilliseconds);
      }
    }
  }
}

//Continue adjusting position of image
function mouseDragged() {
  if (locked) {
    bx = mouseX - xOffset;
    by = mouseY - yOffset;
  }
}

function mouseReleased() {
  //Drop and place image
  if(locked){
    newTree = createSprite(bx, by, 64, 73);
    newTree.addImage(imageArr[imageIndex]);
    append(newTrees, newTree);
    bx = 50;
    by = 50;
    currentSprite.position.x = bx;
    currentSprite.position.y = by;
  }
  locked = false;
  //Drop a pin!
  if(!createMode && placeMap){
    var pinSprite = createSprite(mouseX, mouseY, 32, 32);
    pinSprite.addImage("images/transparent.png", transparent);
    pinSprite.addImage("images/pin.png", pinImage);
    pinSprite.changeAnimation("images/pin.png");
    append(pins, pinSprite);
    placeMap = false;
    document.getElementById("createMapButton").style.display = "inline";
  }
}


var pinIndex = 0;
//This function is called when the create map button is clicked, and automatically switches the mode from create to display
function createMap(){
  //createMode to displayMode
  if(createMode){
    textSize(30);
    text("Map by: " + document.getElementById("userInput").value, 625, 30);
    saveCanvas('map' + pinIndex, 'jpeg');
    pinIndex++;
    createMode = false;
    placeMap = true;
    document.getElementById("userInput").style.display = "none";
    document.getElementById("createMapButton").style.display = "none";
    currentSprite.remove();
    stationaryCurrentSprite.remove();
    document.getElementById("userInput").value = "";
    //Remove drag n dropped images
    for(var i = 0; i < newTrees.length; i++){
      newTrees[i].remove();
    }
    newTrees = [];
    //Display pins
    for(var i = 0; i < pins.length; i++){
      pins[i].changeAnimation("images/pin.png");
    }
  }
  //displayMode to createMode
  else{
    createMode = true;
    document.getElementById("userInput").style.display = "inline";
    var canvas1 = createCanvas(1425, 780);
    canvas1.parent("canvasHolder");
    bx = 50;
    by = 50;
    currentSprite = createSprite(50, 50, 64, 73);
    currentSprite.addImage(green);
    stationaryCurrentSprite = createSprite(50, 50, 64, 73);
    stationaryCurrentSprite.addImage(green);
    imageArr = [green, blue, brown, apt1, apt2, house, transparent];
    bgArr = [farmBg, suburbBg, cityBg, transparent];
    imageIndex = 0;
    bgIndex = 0;
    //Hide the pins!
    for(var i = 0; i < pins.length; i++){
      pins[i].changeAnimation("images/transparent.png");
    }
  }
}
