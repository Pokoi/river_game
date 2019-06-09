//
// Author: Jesus 'Pokoi' Villar 
//
// © pokoidev 2019 (pokoidev.com)
// Creative Commons License:
// Attribution 4.0 International (CC BY 4.0)
//

/// This class manages the obstacles
class Obstacle{

    constructor(type, img = null, index){
        
        this.width  = 16;
        this.height = 16;
        this.img    = img;
        this.body   = null;
        this.position = new Vector2(this.GenerateRandomInRange(canvas.width * 0.40, canvas.width * 0.60),this.GenerateRandomInRange(0, (game.board.river_bank_in_scene.length * 0.5 * game.board.river_bank_in_scene[0].height)));
        
        this.InitializeBody(); 
        this.type  = type;  
        this.index = index;
        
        this.touched = false;
    }

    /// Render method
    Draw(ctx)
    {
        if(!this.touched)
        {
            let body_position = this.body.GetPosition();
            var angle = this.body.GetAngle();

            ctx.save();
            
            ctx.translate(body_position.x * scale, canvas.height - body_position.y * scale);
            ctx.rotate(-angle);       

            ctx.drawImage(this.img, -this.width , -this.height , this.width  * 2, this.height  * 2);
            
            ctx.restore();
        }
        else if(this.body != null)  world.DestroyBody(this.body);
    }

    /// Generates a random number between range
    GenerateRandomInRange(min, max) { return Math.floor(Math.random() * (max - min))+(min); }

    /// Create the physic body
    InitializeBody()
    {
        this.body = CreateBox(world, this.position.x / scale, this.position.y/scale, this.width / scale, this.height / scale, {'friction': 0.2, 'restitution': 1.0, 'linearDamping': 1.0, 'angularDamping': 1.0, 'density': 0.1}); 
        this.body.m_userData = this;
    }

    /// Called when this object is touched by player
    Touched(){ this.touched = true; }
}