class RiverBank{

	constructor(_last_vertex = null)
	{
		this.vertex       = []               ;
		this.collider     = null             ;
		this.active       = true             ;
		this.height       = canvas.height /10 ;
		this.width        = canvas.width / 3 ;
		this.random_range = this.width * 0.35; 
		this.center       = null;
		this.body         = null;
		this.fill_color   = null;
		this.normal_color = 'rgba(255, 255, 255, 0.1)';
		this.touched_color = 'rgba(255, 0, 0, 0.5)';
		this.bodyDef       = null;
		this.fixDef       = null;
		
		this.AssignEdgeVertex(_last_vertex);
		this.SetCenter();
		this.CreatePhysicBody();
	}

	Start(){}

	Update(){
		if(this.active)
		{
			var a = false;
			for(var point in boat.vertex)
			{
				if(this.DistancePointToSegment(this.vertex[0], this.vertex[3], boat.vertex[point]) < 1)
				{
					boat.ApplyForce(boat.vertex[point]-(boat.body.GetPosition() * scale));
					console.log("touching");
					a = true;
				}
				
			}
			this.fill_color = a ? this.touched_color : this.normal_color;
			
		}		 
	}

	Draw(ctx)
	{
		if(this.active){
			// draw the collider polygon
			ctx.strokeStyle = "red";
			ctx.beginPath();
			ctx.moveTo(this.vertex[0].x,this.vertex[0].y);
			for (var i = 1; i < this.vertex.length; i++)
			{
				ctx.lineTo(this.vertex[i].x, this.vertex[i].y);
			}
			ctx.lineTo(this.vertex[0].x, this.vertex[0].y);
			ctx.stroke();
			ctx.fillStyle = this.fill_color;
			ctx.fill();
		}
	}
	
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
		
		//A
		let a;
		if(_last_vertex == null || _last_vertex == undefined) { a = new Vector2 (this.width + this.GenerateRandomVertexComponent(this.random_range, -this.random_range), canvas.height); }
		else a = _last_vertex;
		this.vertex.push(a);

		//B
		let b = new Vector2(0, a.y); 
		this.vertex.push(b);
		
		//C
		let c = new Vector2(b.x, b.y - this.height);  
		this.vertex.push(c);

		//D
		let d = new Vector2(this.width + this.GenerateRandomVertexComponent(this.random_range, -this.random_range), c.y);
		this.vertex.push(d);
	}

	/// Send the object to the scene
	SendToScene(_last_vertex) { this.AssignEdgeVertex(_last_vertex);}

	/// Clears the array of vertex
	ClearVertexCollection() { this.vertex = []; }

	/// Set the active status of the object
	SetActive(bool) { this.active = bool; }

	/// Flip the tile
	FlipRiverBank() { for (let vertex in this.vertex) this.vertex[vertex] = new Vector2 (board.width - this.vertex[vertex].x, this.vertex[vertex].y);}

	/// Set the center of the riverbank
	SetCenter(){ this.center = new Vector2(this.vertex[1].x + this.width * 0.5, this.vertex[1].y - this.height * 0.5); }

	/// Returns the distance between a given point and the segment between the two given points
	DistancePointToSegment (A, B, p) 
	{ 
		//return Math.abs((((B.x - A.x)*(A.y - p.y) - (A.x - p.x)*(B.y - A.y)) /(Math.sqrt((B.x - A.x)*(B.x - A.x) + (B.y - A.y)*(B.y - A.y)))));

		var l2 = this.dist2(A, B);
		if(l2 === 0) return this.dist2(p, A);

		var t = ((p.x-A.x)*(B.x-A.x) + (p.y - A.y) * (B.y - A.y)) / l2;
		t = Math.max(0, Math.min(1,t));

		return Math.sqrt(this.dist2(p, new Vector2(A.x + t * (B.x - A.x), A.y + t * (B.y - A.y))));
	}

	dist2 (A, B) {return Math.sqrt(A.x - B.x) + Math.sqrt(A.y - B.y);}

	CreatePhysicBody()
	{

		this.fixDef = new b2FixtureDef;
		this.fixDef.density = 1.0;
		this.fixDef.friction = 0.5;
		this.fixDef.restitution = 0.2;

		this.bodyDef = new b2BodyDef;
		this.bodyDef.type = b2Body.b2_staticBody;
		this.fixDef.shape = new b2PolygonShape;

		// entity.points == [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y:2}]
		var points = [];

		for (var i = this.vertex.length - 1; i >= 0; i--) {
			var vec = new b2Vec2();
			vec.Set(this.vertex[i].x / scale, canvas.height-this.vertex[i].y/scale);
			points[i] = vec;
		}

		this.fixDef.shape.SetAsArray(points, points.length);

		this.bodyDef.position.x = this.center.x / scale;
		this.bodyDef.position.y = (canvas.height-(this.center.y)) / scale;
		world.CreateBody(this.bodyDef).CreateFixture(this.fixDef);


	}
	
}