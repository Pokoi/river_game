//
// Author: Jesus 'Pokoi' Villar 
//
// © pokoidev 2019 (pokoidev.com)
// Creative Commons License:
// Attribution 4.0 International (CC BY 4.0)
//


/// This class manages all the board, building the items
/// and drawing them
class Board{

    constructor()
    {
        this.width  = canvas.width;
        this.height = canvas.height;

        this.river_bank_in_scene           = [];
        this.number_of_riverbank_instances = 200;
        this.left_last_vertex              = null;
        this.right_last_vertex             = null;
        
        this.obstacle_collection          = [];
        this.number_of_plastic_instances  = this.number_of_riverbank_instances * 2;
        this.number_of_seals_instances    = this.number_of_riverbank_instances;
                
    }

    Start()
    {  
        // Create the origin      
        game.start = new Sensor(new Vector2(canvas.width * 0.5, -canvas.height));
        
        // Create the tiles
        this.GenerateBoardTiles(); 

        // Create the obstacles and start them
        this.GenerateBoardObstacles();   
        game.end = new Sensor(new Vector2(canvas.width * 0.5, (this.river_bank_in_scene.length * 0.5 * this.river_bank_in_scene[0].height) + canvas.height));
    }

    /// Render method
    Draw(ctx)
    { 
        for(let river_bank in this.river_bank_in_scene) this.river_bank_in_scene[river_bank].Draw(ctx);
        for(let obstacle in this.obstacle_collection) this.obstacle_collection[obstacle].Draw(ctx);
        game.start.Draw(ctx);
        game.end.Draw(ctx);
    }

    // ----------------------------------------------------------
    // GENERATING METHODS

    /// Generate the board tiles 
    GenerateBoardTiles() { for(let iterator = 0; iterator < this.number_of_riverbank_instances; iterator++) { this.GenerateTile(false); this.GenerateTile(true);} }
    
    /// Generate the obstacles 
    GenerateBoardObstacles()
    {
        for(let iterator = 0; iterator < this.number_of_plastic_instances; iterator++) this.GenerateObstacle("plastic", plastic_img, iterator);  
        for(let iterator = 0; iterator < this.number_of_seals_instances; iterator++)   this.GenerateObstacle("seal", seal_img, iterator);  
    }

    /// Generate a tile
    GenerateTile(fliped)
    {
        let last_vertex = fliped ? this.right_last_vertex : this.left_last_vertex;
        let river_bank = new RiverBank (last_vertex);
        this.river_bank_in_scene.push(river_bank);

        if(fliped)
        {
            this.right_last_vertex = river_bank.chain_position;
            river_bank.FlipRiverBank();            
        }
        else {this.left_last_vertex = river_bank.chain_position;}

        river_bank.CreatePhysicBody();
    }

    /// Generate an obstacle
    GenerateObstacle(type, img, index){this.obstacle_collection.push(new Obstacle(type, img, index));}  
}