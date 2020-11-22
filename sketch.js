//Create variables here
var dog, happyDog, dogImage, database, foodS, foodStock, DogImage, HappyDogImage;
var dogFoodCounter,c,foodRemaining;
var milk;
var gameState="PLAY";
var fedTime, lastFed,foodObj,foodLeft;

function preload()
{
	//load images here
  dogImage = loadImage("images/dogImg.png",DogImage);
  happyDog = loadImage("images/dogImg1.png",HappyDogImage);
}

function setup() 
{
	createCanvas(1200, 500);
  foodObj = new Food();

  dog = createSprite(950,250,10,10);
  dog.addImage(dogImage);
  dog.scale=0.4;

  database=firebase.database();
  foodStock=database.ref("Food");
  foodStock.on("value",readPosition,showError);

  fedTime=database.ref("FeedTime");
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  dogFoodCounter="Food Remaining";

  
}


function draw() 
{  
  background(46,139,87);
  if(gameState==="PLAY")
  {
    var feedThePetButton = createButton('Click to feed the pet');
    feedThePetButton.position(650,60);

    var addFoodButton = createButton('Click to add food for the pet');
    addFoodButton.position(1050,60);

    addFoodButton.mousePressed(addFood);
    feedThePetButton.mousePressed(feedFood);

    foodObj.display();

    if(dogFoodCounter==="Food Remaining"){

    }else {
      gameState="END";
    }

    c--;
    if(c<=0){
      dog.addImage(dogImage);
    }

  }else  if(gameState==="END")
  {
    dog.addImage(dogImage);
    if(keyWentDown("Space")){
      gameState="PLAY";
      foodS=20;
      dogFoodCounter="Food Remaining";
      foodStock.update({
        Food : 20
      });
    }
  }
  drawSprites();
    //add styles here
    textSize(20);
    fill("Black");
    if(dogFoodCounter==="Food Remaining"){
      if(lastFed>=12){
        text("Last Feed : "+ lastFed%12+ " PM",20,20);
      }else if(lastFed===0){
        text("Last Feed : 12 AM",20,20);
      }else{
        text("Last Feed : "+lastFed+"AM",20,20);
      }
      text("NOTE : Press the button to feed Drago milk and to add Milk for Drago click on add food for pet button",20,480);
    }

    if(dogFoodCounter==="Food Over")
  {
    text("Press SPACE to reset.",20,480)
    text("Food Over",20,20);
  }


}

function writeStock(x){  
 if(x<=1){
    x=0;
    dogFoodCounter="Food Over";
    gameState="END";
  } else {
    x--;
  }

  foodStock.update({
    Food : x 
  });
}

function readPosition(data){
  pos=data.val();
  foodRemaining=pos.Food;
  foodS = foodRemaining;
}

function showError(err){
    console.log(err);
}

function addFood(){
  if(foodS<20)
  {
    foodS++;
    foodStock.update({
    Food : foodS 
  });
  }
}

function feedFood(){
    dog.addImage(happyDog);
    c=20;

    lastFed=hour();

    writeStock(foodS);
    foodStock.update({
    Food : foodS 
  });

    database.ref('/').update({
      FeedTime : lastFed
    })
    
}