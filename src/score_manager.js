//
// Author: Jesus 'Pokoi' Villar 
//
// © pokoidev 2019 (pokoidev.com)
// Creative Commons License:
// Attribution 4.0 International (CC BY 4.0)
//

/// This class manages the score
class ScoreManager
{
    constructor()
    {
        this.points = 0;
        this.life   = 3;
        
        this.last_time_damaged      = 0;
		this.damage_cd              = 2;
        this.points_for_plastic_hit = 20;
        this.points_for_seal_hit    = -100;

        this.lifes_multiplier  = 50;
        this.points_multiplier = 20;
        this.speed_multiplier  = 100;
    }   

	//=============================================================================
	// LIFE MANAGEMENT

        /// Apply damage to the player
        ApplyDamage(){
            if(game.time_played - this.last_time_damaged >= this.damage_cd)
            {
                this.life--;
                game.lifes[this.life].style.display = "none";			
                if(this.life == 0){game_phase = 4; StartEndGame();}
                else this.last_time_damaged = game.time_played;
            }
        }
    
    //=============================================================================
	// POINTS MANAGEMENT

        /// Add points
        AddPoint(){this.points = this.points_for_plastic_hit * game.boat.speed;}
        /// Removes points
        LoosePoint(){this.points += this.points_for_seal_hit;}

        /// Returns the total score
        GetTotalScore(){ return (this.points * this.points_multiplier) + (this.life * this.lifes_multiplier) + (game.boat.speed * this.speed_multiplier);}

}