class RiverBank{

	constructor(position, _last_vertex)
	{
		this.vertex       = []               ;
		this.center       = position         ;
		this.collider     = null             ;
		this.active       = true             ;
		this.height       = 10               ;
		this.width        = canvas.width / 3 ;
		this.random_range = 10               ; 

		AssignEdgeVertex(_last_vertex);

	}

	Draw(ctx)
	{
		
	}

	Update(delta_time)
	{
		
	}
	
	GenerateRandomVertex() { return Math.floor(Math.random() * (this.random_range - -this.random_range))+(-this.random_range); }

	/// Send to the pool of object 
	SendToPool()
	{
		
	}

	AssignEdgeVertex(_last_vertex)
	{
		//----------------------
		//  C ---------- D
		//  |           /
		//  |          /
		//  |          \
		//  B ---------- A
		//-----------------------
		
		//A
		let a;
		if(_last_vertex == null || _last_vertex == undefined) { a = new Vector2 (this.width + GenerateRandomVertex(), 0); }
		else a = _last_vertex;
		this.vertex.push(a);

		//B
		let b = new Vector2(_last_vertex.x - canvas.width, _last_vertex.y); 
		this.vertex.push(b);
		
		//C
		let c = new Vector2(b.x, b.y + this.height); 
		this.vertex.push(c);

		//D
		let d = new Vector2(this.width + GenerateRandomVertex(), c.y);
		this.vertex.push(d);		


	}

	/// Send the object to the scene
	SendToScene()
	{
		
	}

	/// Clears the array of vertex
	ClearVertexCollection() { this.vertex = []; }

	/// Set the active status of the object
	SetActive(bool) { this.active = bool; }

	/// Set 
	FlipRiverBank() { for (let vertex in this.vertex) vertex = new Vector2 (board.width - vertex.x, vertex.y);}

	//SetPolygon
}