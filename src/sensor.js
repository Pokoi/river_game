//
// Author: Jesus 'Pokoi' Villar 
//
// © pokoidev 2019 (pokoidev.com)
// Creative Commons License:
// Attribution 4.0 International (CC BY 4.0)
//

/// This class manages the limits of the game
class Sensor{

    constructor(position){
        
        this.body     = null;
        this.type     = "sensor";
        this.width    = canvas.width;
        this.height   = canvas.height;
        this.position = position;

        this.InitializeBody();
    }

    /// Creates the physic body
    InitializeBody()
    {
        this.body = CreateBox(world, this.position.x / scale, this.position.y/scale, this.width / scale, this.height / scale, {'friction': 0.2, 'restitution': 1.0, 'linearDamping': 1.0, 'angularDamping': 1.0, 'density': 100, 'type': b2Body.b2_staticBody }); 
        this.body.m_userData = this;
    }

    Draw(ctx){

        ctx.save();      
        
        ctx.fillStyle = 'rgba(218, 235, 242, 0.8)';  
        ctx.fillRect(0, canvas.height - this.position.y,this.width, this.height); 

        ctx.restore();
    }
}