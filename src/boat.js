class Boat {

	/// Initialization of members
	constructor(_width, _height)
	{

		this.img                   = null   ; 
		this.body                  = null   ; 
		this.speed                 = 0.0    ;
		this.engine_on             = false  ;
		this.rotation_speed        = 1.4    ; 
		this.restore_rotation_speed= 4.0    ; 
		this.width                 = _width ;
		this.height                = _height;
		this.director_body         = null   ;
		this.engine_body           = null   ;
	} 

	/// At the first frame of this object
	Start()
	{

		var boat_body_options = {'linearDamping': 10.0, 'angularDamping': 10.0};
		this.body             = CreateBox(world, 0.75, 0.75, this.width, this.height, boat_body_options);

		this.InitializeDirectorBody();
		this.InitializeEngineBody();
	}

	/// Paint the object into the canvas
	Draw(ctx)
	{	
	} 

	/// Method called every frame
	Update(delta_time)
	{

		this.BoatRotation();
		this.BoatMovement();
	}

	//=============================================================================
	// INITIALIZATION OF VALUES

	/// Initialization of the parameters of the director body
	InitializeDirectorBody()
	{

		this.director_body    = CreateBox(world, 0.5, 1.1, 0.05, 0.1, {});
		let front_joint_def   = new b2RevoluteJointDef();

		front_joint_def.Initialize (this.body, this.director_body, this.director_body.GetWorldCenter());
		front_joint_def.lowerAngle     = -Math.PI / 3;
		front_joint_def.upperAngle     =  Math.PI / 3;
		front_joint_def.enableLimit    = true;
		front_joint_def.maxMotorTorque = 10.0;
		front_joint_def.enableMotor    = true;

		this.director_body.joint       = world.CreateJoint(front_joint_def);
	}

	/// Initialization of the parameters of the engine body
	InitializeEngineBody()
	{

		let back_joint_def = new b2PrismaticJointDef();
		this.engine_body   = CreateBox(world, 0.5, 0.4, 0.05, 0.1, {});

		back_joint_def.Initialize(this.body, this.engine_body, this.engine_body.GetWorldCenter(), new b2Vec2(1,0));
		back_joint_def.enableLimit = true;
		this.engine_body.joint     = world.CreateJoint(back_joint_def);
	}

	//=============================================================================
	// ROTATION AND MOVEMENT

	/// Calculate and apply the rotation of the boat
	BoatRotation()
	{

		let rotation_speed = 0.0;
		let rotation_angle = 0.0;

		if(input.isKeyPressed(KEY_LEFT))
		{
			rotation_angle += this.director_body.joint.m_upperAngle;
			rotation_speed  = this.rotation_speed;
		}
		else if(input.isKeyPressed(KEY_RIGHT))
		{
			rotation_angle += this.director_body.joint.m_lowerAngle;
			rotation_speed  = this.rotation_speed;
		}
		else
		{
			rotation_angle = 0.0;
			rotation_speed = this.restore_rotation_speed;
		}

		let joint            = this.director_body.joint;
		let angle_difference = rotation_angle - joint.GetJointAngle();
	}

	/// Apply the movement to the boat engine
	BoatMovement()
	{
		let force = (this.engine_body.GetTransform().R.col2.Copy()).Multiply(this.speed);
		this.engine_body.ApplyForce(force, this.engine_body.GetPosition());
	}
}