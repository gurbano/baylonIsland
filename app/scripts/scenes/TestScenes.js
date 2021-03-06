var dat = require('dat-gui');
var random = function (min, max) {
	return (Math.random() * (max - min) + min).toFixed(0);
}
function TestScenes() {
	return{
		'PHYS' : function (scene, sceneManager) {
			sceneManager.enablePhysics();
			return {};
		},
		'AUDIO': function (scene, sceneManager) {
			var OST = new Audio('./music/ost.mp3');
			sceneManager.am.add('OST', OST);
			//OST.play();
			return {}
		},
		'TST1': function (scene) {
			// create a basic light, aiming 0,1,0 - meaning, to the sky
			var light0 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
			light0.diffuse = new BABYLON.Color3(1, 1, 1);
			light0.specular = new BABYLON.Color3(1, 1, 1);
			light0.groundColor = new BABYLON.Color3(0, 0, 0);

			scene.clearColor = BABYLON.Color3.Blue();
			scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);

			var gui = new dat.GUI();
			
			gui.add(light0, 'intensity',0,1, function(data, someother){
				debugger;	
			});
			gui.add(light0.diffuse, 'r',0,1);
			gui.add(light0.diffuse, 'g',0,1);
			gui.add(light0.diffuse, 'b',0,1);

			return {
				'light1' : light0
			}
		},
		'SKYBOX1': function (scene) {
			var skybox = BABYLON.Mesh.CreateBox("skyBox", 2200.0, scene);
			var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
			skyboxMaterial.backFaceCulling = false;
			skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./images/textures/sunny", scene);
			skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
			skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
			skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
			skyboxMaterial.disableLighting = true;
			skybox.material = skyboxMaterial;
			return {'skybox': skybox};
		},
		'TERR1': function (scene, opts, cb) {
			// Create terrain material
			var w = 1200;
			var h = 1200;
			var subdivisions = 300;
			var ratio = w/subdivisions;
			//var terrainMaterial = getTerrainMaterial(scene);
			var terrainMaterial = getStandardMaterial(scene);
			// Ground
			var approxTo = function(x, to){ 
				return  (parseInt(x)/to).toFixed(0) * to;
			}
			var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "./images/textures/heightMap.png", 
				w, h, 
				subdivisions, 
				0, //min height
				100, //max height
				scene, 
				false,
				function (mesh) {
					//mesh.convertToFlatShadedMesh();
					var positions_array = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
					var pos = {};
					for (var i = 0; i < positions_array.length; i = i+3) {
						var x = positions_array[i];
						var y = positions_array[i +1];
						var z = positions_array[i +2];
						if(!pos[x])pos[x]={};
						pos[x][z] = y;
					}
					mesh.pos = pos;
					mesh.getHeightAtCoordinatesOld = mesh.getHeightAtCoordinates; 
					mesh.getHeightAtCoordinates = function (x,z) {
						x = Math.floor(parseInt(x)/ratio) * ratio;
						z = Math.floor(parseInt(z)/ratio) * ratio;
						if (pos[x] && pos[x][z])
							return pos[x][z];
						else
							return 0;
					}
					cb({'ground': ground});
				});
			ground.material = terrainMaterial;
		},
		'POINTER1' : function (scene, ground) {		
			var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);	
			var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
			particleSystem.particleTexture = new BABYLON.Texture("./images/textures/flare.png", scene);
			particleSystem.textureMask = new BABYLON.Color4(0.1, 0.8, 0.8, 1.0);
			particleSystem.emitter = sphere;
			particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, -1); // Starting all From
  			particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 1); // To...
  			particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
			particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
			particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
			// Size of each particle (random between...)
			particleSystem.minSize = 0.1;
			particleSystem.maxSize = 0.5;
			// Life time of each particle (random between...)
			particleSystem.minLifeTime = 0.3;
			particleSystem.maxLifeTime = 8.5;
			particleSystem.emitRate = 5000;
			particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
			particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);
			particleSystem.minAngularSpeed = 0;
			particleSystem.maxAngularSpeed = Math.PI;
			particleSystem.start();
			window.onmousemove = function () {
		        var pickResult = scene.pick(scene.pointerX, scene.pointerY);                    
		        if(pickResult.pickedPoint){
		        	var pos = {};
		        	pos.x = pickResult.pickedPoint.x;
		        	pos.z = pickResult.pickedPoint.z;
		        	pos.y = ground.getHeightAtCoordinates(pickResult.pickedPoint.x, pickResult.pickedPoint.z) + 15;
		        	sphere.position = pos;
		        }
		    };	
		},
		'TREE1' : function (scene, ground) {
			var name ="TREE1";
			//Material declaration
		    var woodMaterial = new BABYLON.StandardMaterial(name, scene);
		    woodMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.3, 0);
		    

		   	var leafMaterial = new BABYLON.StandardMaterial("leafMaterial", scene);
  			leafMaterial.diffuseColor = new BABYLON.Color3(0.5, 1, 0.5);
  			leafMaterial.specularPower = 1;
			
			var treeMaterial = getStandardMaterial(scene);
			//var trees = new BABYLON.Node(name, scene);
			var _trees = {};
			for (var i = 0; i < 300; i++) {				
				//let tree = simplePineGenerator(4, 40, grassMaterial , grassMaterial, scene);
				var x = random(-600, 600);
				var z = random(-600, 600);
				var y = ground.getHeightAtCoordinates(x, z) ;
				if (y>12){
					var tree = QuickTreeGenerator(
						20, //radius of cappella 15-20
						10, //height of trunk 10 to 15
						2, // radius of trunk
						woodMaterial,
						leafMaterial, 
						scene);
					var n = name+i;				
					_trees[n] = tree;
					tree.position.x = x;
					tree.position.z = z;
					tree.position.y = y;
					tree.parent = ground;
				}
				//tree.isPickable = true;				
			}
			return _trees;
		},
		'TREE2' : function (scene, opts) {
			var ground = opts.ground;
			var mesh = opts.treeMesh.loadedMeshes[1];
			var name ="TREE2";

			var _trees = {};
			for (var i = 0; i < 300; i++) {				
				var x = random(-600, 600);
				var z = random(-600, 600);
				var y = ground.getHeightAtCoordinates(x, z) ;
				if (y>12){
					var tree = mesh.createInstance(name+'_'+i);
					_trees[name+'_'+i] = tree;
					tree.position.x = x;
					tree.position.z = z;
					tree.position.y = y+2;
					tree.parent = ground;
				}
				//tree.isPickable = true;				
			}
			return _trees;
		},
		'WATER1': function (scene, reflect) { 
			var waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 1200, 1200, 32, scene, false);
			waterMesh.position.y=6;

			var water = new BABYLON.WaterMaterial("water", scene);
			water.bumpTexture = new BABYLON.Texture("./images/textures/waterbump.png", scene);
			
			// Water properties
			water.windForce = -1;
			water.waveHeight = 0.01;
			water.windDirection = new BABYLON.Vector2(1, 1);
			water.waterColor = new BABYLON.Color3(0.1, 0.1, 0.6);
			water.colorBlendFactor = 0.3;
			water.bumpHeight = 0.01;
			water.waveLength = 0.5;

			
			// Add skybox and ground to the reflection and refraction
			for (var i = 0; i < reflect.length; i++) {
				var objs = reflect[i];
				for (var obj in objs) {
					if (objs.hasOwnProperty(obj)) {
						//console.info('adding reflection of ' + obj);
						water.addToRenderList(objs[obj]);    
					}
				}
			}
			
			
			//water.addToRenderList(ground);
			
			// Assign the water material
			waterMesh.material = water;

			var gui = new dat.GUI();
			gui.add(water, 'windForce', -5, 5);
			gui.add(water, 'waveHeight', 0, 5);
			gui.add(water, 'colorBlendFactor', 0, 5);
			gui.add(water, 'bumpHeight', 0, 1);
			gui.add(water, 'waveLength', 0, 5);
			gui.add(waterMesh.position, 'y',-10,10);	

			return {'waterMesh': waterMesh, 'water': water, 'gui': gui};            
		},
		'OBJ1' : function(scene, ground, cb){
		// The first parameter can be used to specify which mesh to import. Here we import all meshes
			var loader = new BABYLON.AssetsManager(scene);
			var bane = loader.addMeshTask("bane", "", "./images/objs/", "Lowpoly_tree_sample.obj");
    		bane.onSuccess = function(mesh){
    			console.info(mesh);
    			cb(mesh);
    		}
    		bane.onError = function(err){
    			console.error(err);
    			cb(undefined);
    		}
    		loader.load();

		}



	}
}
module.exports = new TestScenes();

var getTerrainMaterial = function (scene) {	
	var terrainMaterial =  new BABYLON.TerrainMaterial("terrainMaterial", scene);
	terrainMaterial.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
	terrainMaterial.specularPower = 128;	
	// Set the mix texture (represents the RGB values)
	terrainMaterial.mixTexture = new BABYLON.Texture("./images/textures/mixMap.png", scene);	
	// Diffuse textures following the RGB values of the mix map
	// diffuseTexture1: Red
	// diffuseTexture2: Green
	// diffuseTexture3: Blue
	terrainMaterial.diffuseTexture0 = new BABYLON.Texture("./images/textures/floor.png", scene);
	terrainMaterial.diffuseTexture1 = new BABYLON.Texture("./images/textures/rock.png", scene);	
	terrainMaterial.diffuseTexture2 = new BABYLON.Texture("./images/textures/grass.png", scene);
	terrainMaterial.diffuseTexture3 = new BABYLON.Texture("./images/textures/grass.png", scene);

	// Bump textures according to the previously set diffuse textures
	terrainMaterial.bumpTexture0 = new BABYLON.Texture("./images/textures/floor_bump.png", scene);
	terrainMaterial.bumpTexture1 = new BABYLON.Texture("./images/textures/rockn.png", scene);
	terrainMaterial.bumpTexture2 = new BABYLON.Texture("./images/textures/grassn.png", scene);
	terrainMaterial.bumpTexture3 = new BABYLON.Texture("./images/textures/grassn.png", scene);

	// Rescale textures according to the terrain
	terrainMaterial.diffuseTexture1.uScale = terrainMaterial.diffuseTexture1.vScale = 5;
	terrainMaterial.diffuseTexture2.uScale = terrainMaterial.diffuseTexture2.vScale = 5;
	terrainMaterial.diffuseTexture3.uScale = terrainMaterial.diffuseTexture3.vScale = 5;

	return terrainMaterial;
}

var getStandardMaterial = function (scene) {
	var terrainMaterial = new BABYLON.StandardMaterial("texture1", scene)			
	//terrainMaterial.wireframe = true;
	var rossoScuro = new BABYLON.Color3(1, 0.2, 0.2);
	var verdeScuro = new BABYLON.Color3(0.1, 0.3, 0);
	terrainMaterial.diffuseColor = verdeScuro;
	terrainMaterial.specularColor = rossoScuro;
	terrainMaterial.specularPower = 2;
	terrainMaterial.ambientColor = new BABYLON.Color3(0, 0, 0); 
	terrainMaterial.emissiveColor = new BABYLON.Color3(0, 0, 0); 

	

	
	return terrainMaterial;
}


var simplePineGenerator = function(canopies, height, trunkMaterial, leafMaterial, scene) {
    var curvePoints = function(l, t) {
    var path = [];
    var step = l / t;
    for (var i = 0; i < l; i += step ) {
		path.push(new BABYLON.Vector3(0, i, 0));
	   	path.push(new BABYLON.Vector3(0, i, 0 ));
     }
    return path;
  	};
	
	var nbL = canopies + 1;
  	var nbS = height;
  	var curve = curvePoints(nbS, nbL);
	var radiusFunction = function (i, distance) {
  		var fact = 1;
		if (i % 2 == 0) { fact = .5; }
   		var radius =  (nbL * 2 - i - 1) * fact;	
   		return radius;
	};  
  
	var leaves = BABYLON.Mesh.CreateTube("tube", curve, 0, 10, radiusFunction, 1, scene);
	var trunk = BABYLON.Mesh.CreateCylinder("trunk", nbS/nbL, nbL*1.5 - nbL/2 - 1, nbL*1.5 - nbL/2 - 1, 12, 1, scene);
  
	leaves.material = leafMaterial;
	trunk.material = trunkMaterial; 
	var tree = new BABYLON.Mesh.CreateBox('',1,scene);
	tree.isVisible = false;
	leaves.parent = tree;
	trunk.parent = tree; 
    return tree; 
}

var QuickTreeGenerator = function QuickTreeGenerator(sizeBranch, sizeTrunk, radius, trunkMaterial, leafMaterial, scene) {

    var tree = new BABYLON.Mesh("tree", scene);
    tree.isVisible = false;
    
    var leaves = new BABYLON.Mesh("leaves", scene);
    
    //var vertexData = BABYLON.VertexData.CreateSphere(2,sizeBranch); //this line for BABYLONJS2.2 or earlier
    var vertexData = BABYLON.VertexData.CreateSphere({segments:2, diameter:sizeBranch}); //this line for BABYLONJS2.3 or later
    
    vertexData.applyToMesh(leaves, false);

    var positions = leaves.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    var indices = leaves.getIndices();
    var numberOfPoints = positions.length/3;

    var map = [];

    // The higher point in the sphere
    var v3 = BABYLON.Vector3;
    var max = [];

    for (var i=0; i<numberOfPoints; i++) {
        var p = new v3(positions[i*3], positions[i*3+1], positions[i*3+2]);

        if (p.y >= sizeBranch/2) {
            max.push(p);
        }

        var found = false;
        for (var index=0; index<map.length&&!found; index++) {
            var array = map[index];
            var p0 = array[0];
            if (p0.equals (p) || (p0.subtract(p)).lengthSquared() < 0.01){
                array.push(i*3);
                found = true;
            }
        }
        if (!found) {
            var array = [];
            array.push(p, i*3);
            map.push(array);
        }

    }
    var randomNumber = function (min, max) {
        if (min == max) {
            return (min);
        }
        var random = Math.random();
        return ((random * (max - min)) + min);
    };

    map.forEach(function(array) {
        var index, min = -sizeBranch/10, max = sizeBranch/10;
        var rx = randomNumber(min,max);
        var ry = randomNumber(min,max);
        var rz = randomNumber(min,max);

        for (index = 1; index<array.length; index++) {
            var i = array[index];
            positions[i] += rx;
            positions[i+1] += ry;
            positions[i+2] += rz;
        }
    });

    leaves.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
    var normals = [];
    BABYLON.VertexData.ComputeNormals(positions, indices, normals);
    leaves.setVerticesData(BABYLON.VertexBuffer.NormalKind, normals);
    leaves.convertToFlatShadedMesh();
    
    leaves.material = leafMaterial;
    leaves.position.y = sizeTrunk+sizeBranch/2-2;
    

    var trunk = BABYLON.Mesh.CreateCylinder("trunk", sizeTrunk, radius-2<1?1:radius-2, radius, 10, 2, scene );
    
    trunk.position.y = (sizeBranch/2+2)-sizeTrunk/2;

    trunk.material = trunkMaterial;
    trunk.convertToFlatShadedMesh();
    
    leaves.parent = tree;
    trunk.parent = tree;
    return tree;

};


