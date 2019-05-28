class Board{

    constructor(_width = null, _height = null)
    {
        if(_height == null) this.height = window.innerHeight;
        else                this.height = _height;

        if(_width == null) this.width   = this.height * (9/16);
        else               this.width   =  _width;
        
    }
    
}