class Board{

    constructor()
    {
        this.width  = canvas.width;
        this.height = canvas.height;

        this.river_bank_collection      = [];
        this.number_of_riverbank_instances = 25;
        this.left_last_vertex           = null;
        this.right_last_vertex          = null;
        
        this.obstacle_collection        = [];
        this.number_of_obstacle_instances = 50;
                
    }

    Start()
    {
        this.GenerateBoardTiles(); 
        for(let river_bank in this.river_bank_collection) this.river_bank_collection[river_bank].Start();

        this.GenerateBoardObstacles();        
    }

    /// Generate the board tiles 
    GenerateBoardTiles() { for(let iterator = 0; iterator < this.number_of_riverbank_instances; iterator++) { this.GenerateTile(false); this.GenerateTile(true);} }
    
    /// Generate the obstacles 
    GenerateBoardObstacles(){for(let iterator = 0; iterator < this.number_of_obstacle_instances; iterator++) { this.GenerateObstacle(false); } }

    /// Generate a tile
    GenerateTile(fliped)
    {
        let last_vertex = fliped ? this.right_last_vertex : this.left_last_vertex;
        let river_bank = new RiverBank (last_vertex);
        this.river_bank_collection.push(river_bank);

        if(fliped)
        {
            this.right_last_vertex = river_bank.chain_position;
            river_bank.FlipRiverBank();            
        }
        else {this.left_last_vertex = river_bank.chain_position;}

        river_bank.CreatePhysicBody();
    }

    /// Generate an obstacle
    GenerateObstacle(_static){this.obstacle_collection.push(new Obstacle(_static));}
    
    Update(deltaTime){ for(let river_bank in this.river_bank_collection) this.river_bank_collection[river_bank].Update(deltaTime); }

    Draw(ctx){ }
      

}