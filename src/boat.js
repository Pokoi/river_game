//
// Author: Jesus 'Pokoi' Villar 
//
// © pokoidev 2019 (pokoidev.com)
// Creative Commons License:
// Attribution 4.0 International (CC BY 4.0)
//


/// This class manages the boat behaviour
class Boat {

	
	constructor(_width, _height, _left_input, _right_input, _initial_position)
	{
		this.img                   = boat_img;
		this.body                  = null; 

		this.speed                       = 0.0;
		this.base_speed                  = 0.5;
		this.rotation_speed              = 0.0;
		this.base_rotation_speed         = 0.6; 
		this.restore_rotation_speed      = 0.0;
		this.base_restore_rotation_speed = 1.2;

		this.initial_position      = new Vector2(_initial_position.x,_initial_position.y);

		this.width                 = _width;
		this.height                = _height;

		this.director_body         = null;
		this.engine_body           = null;
		this.bodies                = [];

		this.left_input            = _left_input;
		this.right_input           = _right_input;

		this.type                  = 'boat';

	} 

	/// At the first frame of this object
	Start()
	{
		var boat_body_options = {'linearDamping': 10.0, 'angularDamping': 10.0};
		this.body             = CreateBox(world, this.initial_position.x, this.initial_position.y, this.width, this.height, boat_body_options);
		this.body.m_userData = this;

		this.InitializeDirectorBody();
		this.InitializeEngineBody();		
	}

	/// Render method
	Draw(ctx)
	{	
		let body_position = this.body.GetPosition();
        var angle = this.body.GetAngle();

        ctx.save();
        
        ctx.translate(body_position.x * scale, canvas.height - body_position.y * scale);
        ctx.rotate(-angle);       

        ctx.drawImage(this.img, -this.width * scale, -this.height * scale, this.width * scale * 2, this.height * scale * 2);
        
		ctx.restore();

	} 

	/// Method called every frame
	Update(delta_time)
	{
		let modificator = (game.time_played/30);

		this.speed                  = this.base_speed + modificator;
		this.rotation_speed         = this.base_rotation_speed + modificator;
		this.restore_rotation_speed = this.base_restore_rotation_speed + modificator;

		this.BoatRotation();
		this.BoatMovement();
	}

	//------------------------------------------------------------------------------
	// INITIALIZATION OF VALUES

	/// Initialization of the parameters of the director body
	InitializeDirectorBody()
	{

		this.director_body    = CreateBox(world, this.body.GetPosition().x, this.body.GetPosition().y + this.height * 0.5, 0.05, 0.1, {});
		let front_joint_def   = new b2RevoluteJointDef();

		front_joint_def.Initialize (this.body, this.director_body, this.director_body.GetWorldCenter());
		front_joint_def.lowerAngle     = -Math.PI / 3;
		front_joint_def.upperAngle     =  Math.PI / 3;
		front_joint_def.enableLimit    = true;
		front_joint_def.maxMotorTorque = 10.0;
		front_joint_def.enableMotor    = true;

		this.director_body.joint       = world.CreateJoint(front_joint_def);
		
		this.bodies.push(this.director_body);
	}

	/// Initialization of the parameters of the engine body
	InitializeEngineBody()
	{		
		this.engine_body   = CreateBox(world, this.body.GetPosition().x, this.body.GetPosition().y - this.height * 0.5, 0.05, 0.1, {});
		let back_joint_def = new b2PrismaticJointDef();

		back_joint_def.Initialize(this.body, this.engine_body, this.engine_body.GetWorldCenter(), new b2Vec2(1,0));
		back_joint_def.enableLimit = true;
		this.engine_body.joint     = world.CreateJoint(back_joint_def);
		
		this.bodies.push(this.engine_body);
	}	

	//------------------------------------------------------------------------------
	// ROTATION AND MOVEMENT

	/// Calculate and apply the rotation of the boat
	BoatRotation()
	{

		let rotation_speed = 0.0;
		let rotation_angle = 0.0;

		if(input.isKeyPressed(this.left_input))
		{
			rotation_angle += this.director_body.joint.m_upperAngle;
			rotation_speed  = this.rotation_speed;
			
		}
		else if(input.isKeyPressed(this.right_input))
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
		joint.SetMotorSpeed(angle_difference * rotation_speed);
	}

	/// Apply the movement to the boat engine
	BoatMovement()
	{
		for (let i in this.bodies)
		{
			let current_body    = this.bodies[i];
			let force_direction = current_body.GetTransform().R.col2.Copy();
			force_direction.Multiply(this.speed);
			current_body.ApplyForce(force_direction, current_body.GetPosition());
		}		
	}

	
}