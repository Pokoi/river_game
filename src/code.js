//
// Author: Jesus 'Pokoi' Villar 
//
// © pokoidev 2019 (pokoidev.com)
// Creative Commons License:
// Attribution 4.0 International (CC BY 4.0)
//

//---------------------------------------------------------------
// GLOBAL VALUES

    const PI2 = Math.PI * 2;

    var canvas;
    var ctx;
    var world    = null;
    var gravity  = null;

    var game;
    var menu;
    var endgame_screen;

    var deltaTime = 0;
    var targetDT = (1 / 60) * 1000;
    var targetDTSeconds = (1 / 60);



    var game_phase = 1; // 0: main menu, 1: building game, 2: playing, 3: pause, 4: end

//---------------------------------------------------------------
// IMAGES

    var plastic_img = null;
    var seal_img    = null;
    var boat_img    = null;

//---------------------------------------------------------------
// CANVAS AND CONTEXT
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
            plastic_img = new Image();
            plastic_img.src = "./assets/plastic.png";
            plastic_img.onload = function(){

                seal_img = new Image();
                seal_img.src = "./assets/seal.png";
                seal_img.onload = function(){

                    boat_img = new Image();
                    boat_img.src = "./assets/boat.png";
                    boat_img.onload = function(){

                            // start the game
                        Start();
                        // first call to the game loop
                        Loop();                                            
                        
                    }
                }
            }        
            
        }
    }

//---------------------------------------------------------------
// GAMEFLOW

    function Start ()
    {
        // create physics
        PreparePhysics(ctx)
        
        // Create the menu
        menu = new Menu();    

        // Create the game
        game = new Game();

        // Create the final screen
        endgame_screen = new EndGame();

        menu.Start();        
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

        if(game_phase == 2) game.Update(deltaTime);     

        input.postUpdate();
    }

    function Draw ()
    {
        if(game_phase == 2) game.Draw(ctx);       
    }

    function StartGame() { menu.menu_div.style.display = "none"; game.Start(); }

    function ShowHighScores(){ getScores(); }

    function StartEndGame()
    {
        let score = game.score.points;
        game.hud.style.display = "none";
        canvas.style.display = "none";
        endgame_screen.Start(score);
    }

    function BackToMenu() { location.reload(); }

//---------------------------------------------------------------
// PHYSICS

    function PreparePhysics (ctx)
    {
        // gravity vector
        gravity = new b2Vec2();
        world = CreateWorld(ctx, gravity);    
    }

    /// To detect collisions
    /// From Alejandro Benitez https://github.com/BenitezDev
    function OnContactDetected(contact){
        var a = contact.GetFixtureA().GetBody().GetUserData();
        var b = contact.GetFixtureB().GetBody().GetUserData();    

        // Apply damage if collides with the river bank
        if((a.type == "boat" && b.type == "river_bank") || (b.type == "boat" && a.type == "river_bank")) 
        { 
            game.score.ApplyDamage(); 
            game.damage.currentTime = 0.2;
            game.damage.play();
        }

        // Gain points if collides with plastic trash
        if(a.type == "boat" && b.type == "plastic")
        {
            if(!b.touched){
                b.Touched();
                world.DestroyBody(contact.GetFixtureB().GetBody());
                game.score.AddPoint();
                game.plastic_hit_sound.currentTime = 0.2;
                game.plastic_hit_sound.play();

            } 
        }
        if(b.type == "boat" && a.type == "plastic")
        {
            if(!a.touched){
                a.Touched();
                world.DestroyBody(contact.GetFixtureA().GetBody());
                game.score.AddPoint();
                game.plastic_hit_sound.currentTime = 0.2;
                game.plastic_hit_sound.play();
            } 
        }

        // End the game if collides with a sensor limit
        if(a.type == "boat" && b.type == "sensor" || a.type == "sensor" && b.type == "boat"){game_phase = 4;}

        // Loose points if collides with a seal
        if(a.type == "boat" && b.type == "seal")
        {
            if(!b.touched){
                b.Touched();
                world.DestroyBody(contact.GetFixtureB().GetBody());
                game.score.LoosePoint();
                game.seal_hit_sound.currentTime = 0.2;
                game.seal_hit_sound.play();
            } 
        }
        if(b.type == "boat" && a.type == "seal")
        {
            if(!a.touched){
                a.Touched();
                world.DestroyBody(contact.GetFixtureA().GetBody());
                game.score.LoosePoint();
                game.seal_hit_sound.currentTime = 0.2;
                game.seal_hit_sound.play();
            } 
        }

        
    }

//--------------------------------------------------
// FIREBASE

    /// Log in with Google to add New Score
    function SubmitScore()
    {
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            addNewScore(user.displayName, endgame_screen.score.toFixed(2));
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    }

    /// Adds a new score to the data base
    function addNewScore(userName, score){
        firebase.database().ref('/scores/userName').set({
            userName: userName,
            score: score
        });
    }

    /// Prints in the HTML the best scores ordered
    function getScores(){

        let back_menu = document.getElementById("back");
        back_menu.addEventListener("click", function(){BackToMenu();});

        menu.play_button.style.display = "none";
        menu.hs_button.style.display = "none";

        let data_table = document.getElementById("data_table");
        data_table.style.display = "block";

        let table = document.getElementById("table");

        let row_index = 1;

        var ref = firebase.database().ref('/scores/');

        ref.orderByChild("score").on("child_added", function (snapshot){
            var d = snapshot.val();
            {
                var row = table.insertRow(row_index);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);

                cell1.innerHTML = d.userName;
                cell2.innerHTML = d.score;

            }
        });
    }
