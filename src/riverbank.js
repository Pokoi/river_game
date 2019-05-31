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
		
		this.AssignEdgeVertex(_last_vertex);
		this.SetCenter();
	}

	Start(){}

	Update(){
		if(this.active)
		{
			for(var point in boat.vertex)
			{
				if(this.DistancePointToSegment(this.vertex[0], this.vertex[3], boat.vertex[point]) < 0.5)
				{
					boat.ApplyForce(boat.vertex[point]-(boat.body.GetPosition() * scale));
					console.log("touching");
				}
				
			}
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
			ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
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
		//  C ---------- D
		//  |           /
		//  |          /
		//  |         / 
		//  B -------A
		//-----------------------
		
		//A
		let a;
		if(_last_vertex == null || _last_vertex == undefined) { a = new Vector2 (this.width + this.GenerateRandomVertexComponent(this.random_range, -this.random_range), 0); }
		else a = _last_vertex;
		this.vertex.push(a);

		//B
		let b = new Vector2(a.x - canvas.width, a.y); 
		this.vertex.push(b);
		
		//C
		let c = new Vector2(b.x, b.y + this.height);  
		this.vertex.push(c);

		//D
		let d = new Vector2(this.width + this.GenerateRandomVertexComponent(this.random_range, -this.random_range), c.y);
		this.vertex.push(d);
	}

	/// Send the object to the scene
	SendToScene(_last_vertex)
	{
		this.AssignEdgeVertex(_last_vertex);			
	}

	/// Clears the array of vertex
	ClearVertexCollection() { this.vertex = []; }

	/// Set the active status of the object
	SetActive(bool) { this.active = bool; }

	/// Flip the tile
	FlipRiverBank() { for (let vertex in this.vertex) this.vertex[vertex] = new Vector2 (board.width - this.vertex[vertex].x, this.vertex[vertex].y);}

	/// Set the center of the riverbank
	SetCenter(){ this.center = new Vector2(this.vertex[1].x + this.height * 0.5, this.vertex[1].y + this.height * 0.5); }

	/// Returns the distance between a given point and the segment between the two given points
	DistancePointToSegment (A, B, p) { return Math.abs((((B.x - A.x)*(A.y - p.y) - (A.x - p.x)*(B.y - A.y)) /(Math.sqrt((B.x - A.x)*(B.x - A.x) + (B.y - A.y)*(B.y - A.y)))));}
	
}