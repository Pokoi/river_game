//
// Author: Jesus 'Pokoi' Villar 
//
// © pokoidev 2019 (pokoidev.com)
// Creative Commons License:
// Attribution 4.0 International (CC BY 4.0)
//

/// This class manages the game itself
class Game{
    constructor()
    {
        this.board       = null;
        this.boat        = null;
        this.camera      = null;
        this.start       = null;
        this.end         = null;
        this.time_played = 0.0;
        this.score       = null;
        this.lifes = [];

        this.hud         = document.getElementById("hud");
        this.speed_text  = document.getElementById("speed");
        this.points_text = document.getElementById("points");
        
        this.lifes.push(document.getElementById("life_1"));
        this.lifes.push(document.getElementById("life_2"));
        this.lifes.push(document.getElementById("life_3"));

        this.plastic_hit_sound = document.getElementById("plastic_hit");
        this.seal_hit_sound    = document.getElementById("seal_hit");
        this.music             = document.getElementById("music");
        this.damage            = document.getElementById("damage");
        
    }

    Start()
    {
        
        this.ApplyStyles();

        // ------------------------------------------------
        // SOUND
        this.music.loop = true;
        this.music.play();

        // ------------------------------------------------
        // BOARD
        this.board = new Board();
        this.board.Start();    

        // ------------------------------------------------
        // BOAT
        this.boat = new Boat(0.1, 0.3, KEY_LEFT, KEY_RIGHT, new Vector2(canvas.width * 0.5 / scale, 3));
        this.boat.Start();        

        // ------------------------------------------------
        // CAMERA
        this.camera = new Camera(game.boat);
        this.camera.Start();

        // ------------------------------------------------
        // SCORE MANAGER
        this.score = new ScoreManager();
        

        game_phase = 2;
    }

    Update(deltaTime)
    {
        // Sound update
        this.music.playbackRate = 1 + (this.time_played * 0.01);

        // Time update
        this.time_played += targetDTSeconds;  
        
        // HTML update    
        this.speed_text.innerHTML = "Boat speed: " + (this.boat.speed * 36 ).toFixed(2) + " km/h";
        this.points_text.innerHTML = "Points: " + (this.score.GetTotalScore()).toFixed(2);

        // update physics
        world.Step(deltaTime, 8, 3);
        world.ClearForces();  

        // Boat update
        this.boat.Update(deltaTime);

        // Camera update        
        this.camera.Update(deltaTime);
    }

    /// Render method
    Draw(ctx)
    {
        // clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        ctx.fillStyle = 'rgba(155, 211, 277, 1)';  
        ctx.fillRect(0,0,canvas.width, canvas.height);      

        // camera transform: translate
        ctx.save();
        ctx.translate(-this.camera.position.x, -this.camera.position.y);  
        
        // draw the tiles
        this.board.Draw(ctx);
        this.boat.Draw(ctx);

        // Transform the canvas coordinates to cartesians coordinates
        //ctx.save();
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);
        //world.DrawDebugData();
        ctx.restore();        
    
    }

    /// Makes visible the HUD
    ApplyStyles() { this.hud.style.display = "block";}
}