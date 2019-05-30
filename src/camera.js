class Camera
{
    constructor (boat)
    {
        this.player   = boat;
        this.offset   = new Vector2 (0,0);
        this.position = new Vector2 (0,0);
        this.min_y    = 0;
        this.max_y    = 0;
        
    }

    Start()
    {
        this.offset.x = this.player.body.GetPosition().x;
        this.offset.y = this.player.body.GetPosition().y;
    }

    Update(deltaTime)
    {
      
        this.position.y = (-this.player.body.GetPosition().y + this.offset.y) * 0.2;

        //this.position.y = Math.min(Math.max(this.position.y, this.min_y), this.max_y);    
    }
}
