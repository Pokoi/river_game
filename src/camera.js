class Camera
{
    constructor (boat)
    {
        this.player   = boat;
        this.offset   = new Vector2 (0,0);
        this.position = new Vector2 (0,0); 
        this.min_y = 0;
        this.max_y = 800;            
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
