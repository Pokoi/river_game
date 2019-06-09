//
// Author: Jesus 'Pokoi' Villar 
//
// © pokoidev 2019 (pokoidev.com)
// Creative Commons License:
// Attribution 4.0 International (CC BY 4.0)
//


/// This class manages the camera
class Camera
{
    constructor (boat)
    {
        this.player   = boat;
        this.offset   = new Vector2 (0,0);
        this.position = new Vector2 (0,0);           
    }

    Start()
    {
        this.offset.x = this.player.body.GetPosition().x * scale;
        this.offset.y = this.player.body.GetPosition().y * scale;
    }

    Update(deltaTime) { 
        this.position.y = (-this.player.body.GetPosition().y * scale + this.offset.y);         
    }
}
