
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



    // ------------------------------------------------
    // BOAT

    boat = new Boat(0.1, 0.3, KEY_LEFT, KEY_RIGHT);
    boat.Start();
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

    boat.Update(deltaTime);

    input.postUpdate();
}

function Draw ()
{
    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Transform the canvas coordinates to cartesians coordinates
    ctx.save();
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

