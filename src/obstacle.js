class Obstacle{

    constructor(_static = false){
        this.width  = _static ? 10 : 5;
        this.height = _static ? 5 : 5;
        this.img    = null;
        this.body   = null;
        this.position = new Vector2(this.GenerateRandomInRange(canvas.width * 0.40, canvas.width * 0.60),this.GenerateRandomInRange(0, (board.river_bank_collection.length * 0.5 * board.river_bank_collection[0].height)));
        
        this.InitializeBody(); 
        this.type = 'obstacle';       
    }

    Start(){}

    /// Generates a random number between range
    GenerateRandomInRange(min, max) { return Math.floor(Math.random() * (max - min))+(min); }

    /// Create the physic body
    InitializeBody(){this.body = CreateBox(world, this.position.x / scale, this.position.y/scale, this.width / scale, this.height / scale, {'restitution': 1.0, 'linearDamping': 1.0, 'angularDamping': 1.0, 'density': 0.2}); this.body.m_userData = this}
}