    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffe9df);
    
    var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(11, 5, 16);
    var renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x101010);
    document.body.appendChild(renderer.domElement);

    camera.lookAt(new THREE.Vector3(0,0,0));

    //var controls = new THREE.OrbitControls(camera, renderer.domElement);
    var light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.setScalar(10);
    scene.add(light);


    // video = document.getElementById('thevideo');
    var myTexture = new THREE.VideoTexture(thisVideo);
    myTexture.needsUpdate = true;
    myTexture.minFilter = THREE.LinearFilter;
    myTexture.magFilter = THREE.LinearFilter;
    myTexture.format = THREE.RGBFormat;
    myTexture.crossOrigin = 'anonymous';

    var otherTexture = new THREE.Texture(thatCanvas);
    otherTexture.needsUpdate = true;

    var imageObject = new THREE.Mesh(
        new THREE.PlaneGeometry(4, 5, 1, 1),
        new THREE.MeshBasicMaterial({ map: myTexture })
        );
        imageObject.position.set(-17,3,0);
        imageObject.rotation.y = 0.15 * Math.PI;
        // thisVideo.src = "src to video";
        // thisVideo.load();
        // thisVideo.play();
        scene.add( imageObject );
    
    
    var imageObject2 = new THREE.Mesh(
        new THREE.PlaneGeometry(4, 5, 1, 1),
        new THREE.MeshBasicMaterial({ map: otherTexture })
        );
        imageObject2.position.set(-17,3,5);
        imageObject2.rotation.y = 0.15 * Math.PI;
        scene.add( imageObject2 );



    var planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
    var myTexture = new THREE.TextureLoader().load( 'https://threejs.org/examples/textures/uv_grid_opengl.jpg' );
    var planeMaterial = new THREE.MeshLambertMaterial( { map: myTexture } );
    //var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0,0,0);
    // add the plane to the scene
    scene.add(plane);

    render();

    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }