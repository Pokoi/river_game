class RiverBank{

	constructor(position)
	{
		this.vertex    = []         ;
		this.center    = position   ;
		this.collider  = null       ;
		this.active    = true       ;
	}

	Start()
	{
		
	}

	Draw(ctx)
	{
		
	}

	Update(delta_time)
	{
		
	}
	
	GenerateRandomVertex(vertex_count)
	{

		//Push the initial vertex 

		for(let iterator; iterator < vertex_count; iterator++)
		{
			//Do the random generation and push it to the vertex collection
		}

	}

	/// Send to the pool of object 
	SendToPool()
	{
		
	}

	/// Send the object to the scene
	SendToScene()
	{
		
	}

	/// Clears the array of vertex
	ClearVertexCollection() { this.vertex = []; }

	/// Set the active status of the object
	SetActive(bool) { this.active = bool; }

	//SetPolygon
}