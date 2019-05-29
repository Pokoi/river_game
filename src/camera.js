class Camera
{
    constructor (player)
    {
        this.player = player;
        this.offset = {x: 0, y: 0};
        this.position = {x: 0, y: 0};
        this.min_y = 0;
        this.max_y = 100;
        
    }

    Start()
    {
        this.offset.x = this.player.body.GetPosition().x;
        this.offset.y = this.player.body.GetPosition().y;
    }

    Update(deltaTime)
    {
      
        this.position.y = (-this.player.body.GetPosition().y + this.offset.y) * 0.2;

       // this.position.y = Math.min(Math.max(this.position.y, this.min_y), this.max_y);    
    }
}
