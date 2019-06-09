//
// Author: Jesus 'Pokoi' Villar 
//
// © pokoidev 2019 (pokoidev.com)
// Creative Commons License:
// Attribution 4.0 International (CC BY 4.0)
//

/// This class manages the main menu
class Menu{
    constructor()
    {
        this.menu_div    = document.getElementById("menu");
        this.play_button = document.getElementById("playbutton"); 
        this.hs_button   = document.getElementById("showhs");        
    }

    Start()
    {   
        this.menu_div.style.display = "block";  
        this.play_button.addEventListener("click", function(){StartGame();});
        this.hs_button.addEventListener("click", function(){ShowHighScores();});
    }
}