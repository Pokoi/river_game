class RiverBank{

	constructor(_last_vertex = null)
	{
		this.vertex       = []               ;
		this.collider     = null             ;
		this.active       = true             ;
		this.height       = canvas.height /2 ;
		this.width        = canvas.width / 3 ;
		this.random_range = this.width * 0.35; 
		this.center       = null;
		
		this.AssignEdgeVertex(_last_vertex);
		this.GenerateInnerFace();
	}

	Start(){ this.SetCenter(); }

	Update(){if(this.IntersectsWith(boat) != false) console.log("intersects");}

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

	/// Generate the inner face 
	GenerateInnerFace() 
	{
		let last_y = this.vertex[this.vertex.length-1].y;
		let unit_size = (last_y - this.vertex[0].y) * 0.33;

		for(let i = 0; i < 3; i++)
		{
			let vertex = new Vector2((this.width + this.GenerateRandomVertexComponent(this.random_range, -this.random_range)), 
									this.GenerateRandomVertexComponent(last_y - (i) * unit_size, last_y - ((i+1) * unit_size))
									);
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
		this.GenerateInnerFace();			
	}

	/// Clears the array of vertex
	ClearVertexCollection() { this.vertex = []; }

	/// Set the active status of the object
	SetActive(bool) { this.active = bool; }

	/// Flip the tile
	FlipRiverBank() { for (let vertex in this.vertex) this.vertex[vertex] = new Vector2 (board.width - this.vertex[vertex].x, this.vertex[vertex].y);}

	/// Set the center of the riverbank
	SetCenter(){ this.center = new Vector2(this.vertex[1].x + this.height * 0.5, this.vertex[1].y + this.height * 0.5); }

	//-----------------------------------------------------------------------------------------
	/// Methods from MattiasBuelens
	/// Avalaible in: http://jsfiddle.net/MattiasBuelens/9FAGJ/

	/*
     *  This function returns true if the given point is inside the polygon,
     *  and false otherwise.
     */
	ContainsPoint(point)
	{
		var nvert = this.vertex.length;
		var testx = point.x;
		var testy = point.y;

		var vertx = new Array();
    	for (var q = 0; q < this.vertex.length; q++) {
    		vertx.push(this.vertex[q].x + this.center.x);
    	}
    	
    	var verty = new Array();
    	for (var w = 0; w < this.vertex.length; w++) {
    		verty.push(this.vertex[w].y + this.center.y);
    	}

    	var i, j = 0;
    	var c = false;
    	for (i = 0, j = nvert - 1; i < nvert; j = i++) {
    		if ( ((verty[i]>testy) != (verty[j]>testy)) &&
    				(testx < (vertx[j]-vertx[i]) * (testy-verty[i]) / (verty[j]-verty[i]) + vertx[i]) )
    			c = !c;
    	}
    	return c;
	}

	
	/*
     *  To detect intersection with another Polygon object, this
     *  function uses the Separating Axis Theorem. It returns false
     *  if there is no intersection, or an object if there is. The object
     *  contains 2 fields, overlap and axis. Moving the polygon by overlap
     *  on axis will get the polygons out of intersection.
     */
	IntersectsWith(other)
	{
		var axis = new Vector2(0,0);
    	var tmp, minA, maxA, minB, maxB;
    	var side, i;
    	var smallest = null;
    	var overlap = 99999999;

    	// test polygon A's sides 
    	for (side = 0; side < this.vertex.length; side++)
    	{
    		// get the axis that we will project onto 
    		if (side == 0)
    		{
    			axis.x = this.vertex[this.vertex.length - 1].y - this.vertex[0].y;
    			axis.y = this.vertex[0].x - this.vertex[this.vertex.length - 1].x;
    		}
    		else
    		{
    			axis.x = this.vertex[side - 1].y - this.vertex[side].y;
    			axis.y = this.vertex[side].x - this.vertex[side - 1].x;
    		}

    		// normalize the axis
    		tmp = Math.sqrt(axis.x * axis.x + axis.y * axis.y);
    		axis.x /= tmp;
    		axis.y /= tmp;

    		// project polygon A onto axis to determine the min/max 
    		minA = maxA = this.vertex[0].x * axis.x + this.vertex[0].y * axis.y;
    		for (i = 1; i < this.vertex.length; i++)
    		{
    			tmp = this.vertex[i].x * axis.x + this.vertex[i].y * axis.y;
    			if (tmp > maxA)
    				maxA = tmp;
    			else if (tmp < minA)
    				minA = tmp;
			}
			
    		// correct for offset 
    		tmp = this.center.x * axis.x + this.center.y * axis.y;
    		minA += tmp;
    		maxA += tmp;

    		// project polygon B onto axis to determine the min/max 
    		minB = maxB = other.vertex[0].x * axis.x + other.vertex[0].y * axis.y;
    		for (i = 1; i < other.vertex.length; i++)
    		{
    			tmp = other.vertex[i].x * axis.x + other.vertex[i].y * axis.y;
    			if (tmp > maxB)
    				maxB = tmp;
    			else if (tmp < minB)
    				minB = tmp;
			}
			
    		// correct for offset 
    		tmp = other.body.GetPosition().x * axis.x + other.body.GetPosition().y * axis.y;
    		minB += tmp;
    		maxB += tmp;

    		// test if lines intersect, if not, return false 
    		if (maxA < minB || minA > maxB) {
    			return false;
    		} else {
    			var o = (maxA > maxB ? maxB - minA : maxA - minB);
    			if (o < overlap) {
    				overlap = o;
    			    smallest = {x: axis.x, y: axis.y};
    			}
    		}
    	}

    	// test polygon B's sides 
    	for (side = 0; side < other.vertex.length; side++)
    	{
    		// get the axis that we will project onto 
    		if (side == 0)
    		{
    			axis.x = other.vertex[other.vertex.length - 1].y - other.vertex[0].y;
    			axis.y = other.vertex[0].x - other.vertex[other.vertex.length - 1].x;
    		}
    		else
    		{
    			axis.x = other.vertex[side - 1].y - other.vertex[side].y;
    			axis.y = other.vertex[side].x - other.vertex[side - 1].x;
    		}

    		// normalize the axis 
    		tmp = Math.sqrt(axis.x * axis.x + axis.y * axis.y);
    		axis.x /= tmp;
    		axis.y /= tmp;

    		// project polygon A onto axis to determine the min/max 
    		minA = maxA = this.vertex[0].x * axis.x + this.vertex[0].y * axis.y;
    		for (i = 1; i < this.vertex.length; i++)
    		{
    			tmp = this.vertex[i].x * axis.x + this.vertex[i].y * axis.y;
    			if (tmp > maxA)
    				maxA = tmp;
    			else if (tmp < minA)
    				minA = tmp;
    		}
    		// correct for offset 
    		tmp = this.center.x * axis.x + this.center.y * axis.y;
    		minA += tmp;
    		maxA += tmp;

    		// project polygon B onto axis to determine the min/max 
    		minB = maxB = other.vertex[0].x * axis.x + other.vertex[0].y * axis.y;
    		for (i = 1; i < other.vertex.length; i++)
    		{
    			tmp = other.vertex[i].x * axis.x + other.vertex[i].y * axis.y;
    			if (tmp > maxB)
    				maxB = tmp;
    			else if (tmp < minB)
    				minB = tmp;
    		}
    		// correct for offset 
    		tmp = other.body.GetPosition().x * axis.x + other.body.GetPosition().y * axis.y;
    		minB += tmp;
    		maxB += tmp;

    		// test if lines intersect, if not, return false 
    		if (maxA < minB || minA > maxB) {
    			return false;
    		} else {
    			var o = (maxA > maxB ? maxB - minA : maxA - minB);
    			if (o < overlap) {
    				overlap = o;
    			    smallest = {x: axis.x, y: axis.y};
    			}
    		}
    	}

    	return {"overlap": overlap + 0.001, "axis": smallest};
	}
	
}