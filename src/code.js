
const PI2 = Math.PI * 2;

var canvas;
var ctx;

var deltaTime = 0;
var targetDT = (1 / 60) * 1000;
var targetDTSeconds = (1 / 60);

var board   = null;
var world   = null;
var gravity = null;
var boat    = null;
var second_boat = null;
var camera  = null;

var player_one_origin = null; 
var player_two_origin = null; 

var a = null;
var b = null;

window.requestAnimationFrame = (function (evt) {
    return window.requestAnimationFrame    ||
    	window.mozRequestAnimationFrame    ||
    	window.webkitRequestAnimationFrame ||
    	window.msRequestAnimationFrame     ||
    	function (callback) {
        	window.setTimeout(callback, targetDT);
    	};
}) ();


canvas = document.getElementById("my_canvas");
if (canvas)
{
    ctx = canvas.getContext("2d");
    if (ctx)
    {
        // setup keyboard events
        SetupKeyboardEvents();
        // setup mouse events
        SetupMouseEvents();
        
        // load images...
        
        // start the game
        Start();
        // first call to the game loop
        Loop();
    }
}

function Start ()
{
    // create physics
    PreparePhysics(ctx)

    // ------------------------------------------------
    // CANVAS
    ResizeCanvas();


    player_one_origin = new Vector2(canvas.width * 0.6 / scale, 0.75);
    player_two_origin = new Vector2(canvas.width * 0.4 / scale, 0.75);

    // ------------------------------------------------
    // BOARD
    board = new Board();
    board.Start();

    // ------------------------------------------------
    // BOAT
    boat = new Boat(0.1, 0.3, KEY_LEFT, KEY_RIGHT, player_one_origin);
    boat.Start();

    second_boat = new Boat(0.1, 0.3, KEY_A, KEY_D, player_two_origin);
    second_boat.Start();

    // ------------------------------------------------
    // CAMERA
    camera = new Camera(boat);
    camera.Start();
}

function Loop ()
{
    requestAnimationFrame(Loop);

    Update(targetDTSeconds);
    Draw();
}

function Update (deltaTime)
{
    input.update();

    // update physics
    // Step(timestep , velocity iterations, position iterations)
    world.Step(deltaTime, 8, 3);
    world.ClearForces();  

    board.Update(deltaTime);
    boat.Update(deltaTime);
    second_boat.Update(deltaTime);
    camera.Update(deltaTime);


    input.postUpdate();
}

function Draw ()
{
    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);    
      

    // camera transform: translate
    ctx.save();
    ctx.translate(-camera.position.x, -camera.position.y);    

    // draw the tiles
    board.Draw(ctx);

    // Transform the canvas coordinates to cartesians coordinates
    //ctx.save();
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
    world.DrawDebugData();
    ctx.restore();    
}

function PreparePhysics (ctx)
{
    // gravity vector
    gravity = new b2Vec2();

    world = CreateWorld(ctx, gravity);
}

function ResizeCanvas()
{  
    canvas.height = window.innerHeight - (2);
    canvas.width  = canvas.height * (9/16);
}

function OnContactDetected(contact){
    a = contact.GetFixtureA().GetBody();
    b = contact.GetFixtureB().GetBody();

    console.log(a.GetUserData());
    console.log(b.GetUserData());

    if(a.type == "boat" && b.type == "obstacle")
    {
        console.log("barco choca obstaculo");
    }

    if(b.type == "boat" && a.type == "river_bank")
    {
        console.log("obstaculo choca barco");
    }

    
}
