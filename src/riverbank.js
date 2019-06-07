class RiverBank{

	constructor(_last_vertex = null)
	{
		this.vertex         = [];
		this.collider       = null;
		this.active         = true;
		this.height         = canvas.height * 0.2;
		this.width          = canvas.width * 0.33;
		this.random_range   = this.width * 0.40; 
		this.chain_position = null;
		
		this.bodyDef        = null;
		this.fixDef         = null; 
		
		this.type                  = 'river_bank';

		this.AssignEdgeVertex(_last_vertex);			
	}

	Start(){}

	Update(){}

	Draw(ctx){}
	
	/// Generate a random integer between a min and max numbers
	GenerateRandomVertexComponent(min, max) { return Math.floor(Math.random() * (max - min))+(min); }

	/// Send to the pool of object 
	SendToPool() { this.SetActive(true);}

	/// Assign the vertex 
	AssignEdgeVertex(_last_vertex)
	{
		//---------------------- 
		// (x: 0, y: 0)
		//
		//  C ---------- D
		//  |           /
		//  |          /
		//  |         / 
		//  B -------A
		//
		//-----------------------
		
		this.ClearVertexCollection();

		//A
		let a;
		if(_last_vertex == null || _last_vertex == undefined) { a = new Vector2 (this.width + this.GenerateRandomVertexComponent(this.random_range, -this.random_range), canvas.height); }
		else a = _last_vertex;		

		//B
		let b = new Vector2(0, a.y); 		
		
		//C
		let c = new Vector2(b.x, b.y - this.height);  		

		//D
		let d = new Vector2(this.width + this.GenerateRandomVertexComponent(this.random_range, -this.random_range), c.y);
		this.chain_position = d;
		
		// Push the vertex in counterclockwise 
		this.vertex.push(d);
		this.vertex.push(c);
		this.vertex.push(b);
		this.vertex.push(a);		
	}

	/// Send the object to the scene
	SendToScene(_last_vertex) { this.AssignEdgeVertex(_last_vertex);}

	/// Clears the array of vertex
	ClearVertexCollection() { this.vertex = []; }

	/// Set the active status of the object
	SetActive(bool) { this.active = bool; }

	/// Flip the tile
	FlipRiverBank() { for (let vertex in this.vertex) this.vertex[vertex] = new Vector2 (board.width - this.vertex[vertex].x, this.vertex[vertex].y); this.ReverseVertexCollection();}

	/// Reverse the order of the vertex in the array
	ReverseVertexCollection(){this.vertex = this.vertex.reverse();}

	/// Creates the physics Body
	CreatePhysicBody()
	{
		this.fixDef = new b2FixtureDef;
		this.fixDef.density = 8.0;
		this.fixDef.friction = 0.5;
		this.fixDef.restitution = 1;

		this.bodyDef = new b2BodyDef;
		
		this.bodyDef.type = b2Body.b2_staticBody;
		
		this.fixDef.shape = new b2PolygonShape;
		
		var points = [];

		for (var i = this.vertex.length - 1; i >= 0; i--) {
			var vec = new b2Vec2();
			vec.Set(this.vertex[i].x / scale, (canvas.height-this.vertex[i].y)/scale);
			points[i] = vec;
		}

		this.fixDef.shape.SetAsArray(points, points.length);

		this.bodyDef.position.Set(0,0);	
		world.CreateBody(this.bodyDef).CreateFixture(this.fixDef);
		


	}	
}