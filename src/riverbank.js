class RiverBank{

	constructor(_last_vertex = null)
	{
		this.vertex       = []               ;
		this.collider     = null             ;
		this.active       = true             ;
		this.height       = 10               ;
		this.width        = canvas.width / 3 ;
		this.random_range = 10               ; 

	}

	Draw(ctx)
	{
		
	}

	
	GenerateRandomVertexComponent(min, max) { return Math.floor(Math.random() * (max - min))+(min); }

	///Generate the face inner 
	GenerateInnerFace() 
	{
		let last_y = this.vertex[this.vertex.length-1].y;
		let unit_size = (last_y - this.vertex[0].y) * 0.33;

		for(let i = 0; i < 3; i++)
		{
			let vertex = new Vector2((this.width + this.GenerateRandomVertexComponent(this.random_range, -this.random_range), 
									  this.GenerateRandomVertexComponent(last_y, last_y - ((i+1) * unit_size))));
			this.vertex.push(vertex);						  
		}
	}
	/// Send to the pool of object 
	SendToPool() { this.SetActive(true);}

	/// Assign the vertex 
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
		if(_last_vertex == null || _last_vertex == undefined) { a = new Vector2 (this.width + GenerateRandomVertexComponent(this.random_range, -this.random_range), 0); }
		else a = _last_vertex;
		this.vertex.push(a);

		//B
		let b = new Vector2(_last_vertex.x - canvas.width, _last_vertex.y); 
		this.vertex.push(b);
		
		//C
		let c = new Vector2(b.x, b.y + this.height);  
		this.vertex.push(c);

		//D
		let d = new Vector2(this.width + GenerateRandomVertexComponent(this.random_range, -this.random_range), c.y);
		this.vertex.push(d);
	}

	/// Send the object to the scene
	SendToScene()
	{
		this.AssignEdgeVertex()
	}

	/// Clears the array of vertex
	ClearVertexCollection() { this.vertex = []; }

	/// Set the active status of the object
	SetActive(bool) { this.active = bool; }

	/// Set 
	FlipRiverBank() { for (let vertex in this.vertex) vertex = new Vector2 (board.width - vertex.x, vertex.y);}

	//SetPolygon
}