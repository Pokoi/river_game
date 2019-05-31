class Board{

    constructor()
    {
        this.width  = canvas.width;
        this.height = canvas.height;

        this.river_bank_collection      = new Array();
        this.number_of_instances        = 50;
        this.left_last_vertex           = null;
        this.right_last_vertex          = null;
                
    }

    Start()
    {
        this.GenerateBoardTiles(); 
        for(let river_bank in this.river_bank_collection) this.river_bank_collection[river_bank].Start();

        //TODO Generate river obstacles
    }

    ///Generate the board tiles 
    GenerateBoardTiles() { for(let iterator = 0; iterator < this.number_of_instances; iterator++) { this.GenerateTile(false); this.GenerateTile(true);} }
    
    ///Generate a tile
    GenerateTile(fliped)
    {
        let last_vertex = fliped ? this.right_last_vertex : this.left_last_vertex;
        let river_bank = new RiverBank (last_vertex);
        this.river_bank_collection.push(river_bank);

        if(fliped)
        {
            this.right_last_vertex = river_bank.vertex[3];
            river_bank.FlipRiverBank();
        }
        else {this.left_last_vertex = river_bank.vertex[3];}
    }
    
    Update(deltaTime){ for(let river_bank in this.river_bank_collection) this.river_bank_collection[river_bank].Update(deltaTime); }

    Draw(ctx){ for(let river_bank in this.river_bank_collection) this.river_bank_collection[river_bank].Draw(ctx);}
      

}