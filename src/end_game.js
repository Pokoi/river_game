//
// Author: Jesus 'Pokoi' Villar 
//
// © pokoidev 2019 (pokoidev.com)
// Creative Commons License:
// Attribution 4.0 International (CC BY 4.0)
//

/// This class manages the end game screen
class EndGame{

    constructor()
    {
        this.score = 0.0;

        this.endgame_menu = document.getElementById("endgame"); 
        this.back_to_menu_button = document.getElementById("menubutton"); 
        this.submit_score_button = document.getElementById("loginbutton"); 
        this.score_text = document.getElementById("end_text");  
    }
    
    Start(score)
    {
        game.music.pause();
        this.endgame_menu.style.display = "block";
        this.score = score;
        this.score_text.innerHTML = "Congratulations, you've got " + (this.score).toFixed(2) + " points";
        
        this.back_to_menu_button.addEventListener("click", function(){BackToMenu();});
        this.submit_score_button.addEventListener("click", function(){SubmitScore();});
    }
}