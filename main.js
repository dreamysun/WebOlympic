var mode;
var myId;
var myPos = 0;
var pace = 3000;
var maxPlayerNum = 5;
var timer;
var maxtime = 10;
var msg;
var ready = false;

var camera, scene, renderer,light, geometry;
var texture1, texture2,texture3, texture4, texture5,texture6;
var material1, material2, material3, material4, material5, material6;
var mesh1, mesh2, mesh3,mesh4, mesh5, mesh6;
var width = window.innerWidth, height = window.innerHeight;
var pos1 = 0;
var pos2 = 0;
var pos3 = 0;
var pos4 = 0;
var pos5 = 0;
var pos6 = 0;
var playerNum = 0;

//communications
var socket = io.connect();
socket.on('connect', function() {
    console.log("Connected");
});

//you are a player
socket.on('player mode on',function(data){
    console.log("you are a player");
    console.log(data);

    mode = "player";
});

//you are an audience
socket.on('audience mode on',function(data){
    console.log("you are an audience");
    mode = "audience";
});

socket.on('change to player', function(){
    console.log("you just become a player!!");
    mode = "player";
});

//new player join
socket.on('new player enter',(data)=>{
    console.log("a new player joined: "+data[data.length-1].id);
});

//receive updated player image
socket.on('update image', function(data) {
    // console.log(data.length);
    var length = data.length;
    var imageDom = document.getElementById('images');

    for (let i = 0; i < length; i++){
        imageDom.children[i].src = data[i].img;
    }

});

//receive updated player position
socket.on('update position', function(data) {
    var thisLength = data.length;

    if (thisLength == 1){
        pos1 = data[0].pos;

    } else if (thisLength == 2){
        pos1 = data[0].pos;
        pos2 = data[1].pos
    } else if (thisLength = 3){
        pos1 = data[0].pos;
        pos2 = data[1].pos;
        pos3 = data[2].pos
    } else if (thisLength = 4){
        pos1 = data[0].pos;
        pos2 = data[1].pos;
        pos3 = data[2].pos
        pos4 = data[3].pos
    } else if (thisLength = 5){
        pos1 = data[0].pos;
        pos2 = data[1].pos;
        pos3 = data[2].pos
        pos4 = data[3].pos
        pos5 = data[4].pos
        playerNum = 5;
    } else if (thisLength >= 6){
        pos1 = data[0].pos;
        pos2 = data[1].pos;
        pos3 = data[2].pos;
        pos4 = data[3].pos;
        pos5 = data[4].pos;
        pos6 = data[5].pos;

    }
});

socket.on('placeholder',(data)=>{
    var imageDom = document.getElementById('images');
    imageDom.children[data].src = "placeholder.jpg";
    console.log('place holder!!');
    console.log(data);
    console.log(imageDom.children[data]);
})




socket.on('play Number',(data)=>{
    console.log("player number "+data.length);
    if (data.length == 5){
      ready = true;
    } else {
      ready = false;
    }
})




window.addEventListener('load', function() {
    //My Page
    var myVideo = document.getElementById('myVideo');
    var myCanvas = document.getElementById('myCanvas');
    var myContext = myCanvas.getContext('2d');

    var frdImage1 = document.getElementById('frdImage1');
    var frdCanvas1 = document.getElementById('frdCanvas1');
    var frdContext1 = frdCanvas1.getContext('2d');

    var frdImage2 = document.getElementById('frdImage2');
    var frdCanvas2 = document.getElementById('frdCanvas2');
    var frdContext2 = frdCanvas2.getContext('2d');

    var frdImage3 = document.getElementById('frdImage3');
    var frdCanvas3 = document.getElementById('frdCanvas3');
    var frdContext3 = frdCanvas3.getContext('2d');

    var frdImage4 = document.getElementById('frdImage4');
    var frdCanvas4 = document.getElementById('frdCanvas4');
    var frdContext4 = frdCanvas4.getContext('2d');

    var frdImage5 = document.getElementById('frdImage5');
    var frdCanvas5 = document.getElementById('frdCanvas5');
    var frdContext5 = frdCanvas5.getContext('2d');

    var frdImage6 = document.getElementById('frdImage6');
    var frdCanvas6 = document.getElementById('frdCanvas6');
    var frdContext6 = frdCanvas6.getContext('2d');

    //get video part
    let constraints = { audio: false, video: true };
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        // Attach to our video object
        myVideo.srcObject = stream;
        // Wait for the stream to load enough to play
        myVideo.onloadedmetadata = function(e) {
            myVideo.play();

            if (mode === "player"){
                updateMyImage();
                // updateMyPos();
            }

            DrawPlayers();
        };
    })
    .catch(function(err) {
        alert(err);
    });

    function click(){
    window.addEventListener("click",function(e){
        myPos += 0.1;
        console.log("my position is: "+myPos);
        socket.emit("update position",myPos);
    });

  };

  var CountDown = function(){
    if(maxtime>=0){
      msg = "Ready?" + maxtime;
      document.getElementById("timer").innerHTML=msg;
      maxtime--;
    }
    else{
      clearInterval(timer);
      document.getElementById("timer").innerHTML="RUN!";
      click();
    }
    timer = setInterval(CountDown,1000);
  };
    CountDown();


  var updatePlayerNum = function(){
      if (ready == true){
        CountDown();
      }
      setTimeout(updatePlayerNum,1000);
  };



    var updateMyImage = function(){
        // Draw my video onto the canvas
        myContext.drawImage(myVideo,0,0,myVideo.width,myVideo.height);
        var dataUrl = myCanvas.toDataURL();
        // console.log("my image:" + dataUrl);
        socket.emit('update image',dataUrl);

        setTimeout(updateMyImage,pace);
    };


    var DrawPlayers = function(){
        frdContext1.drawImage(frdImage1,0,0,frdImage1.width,frdImage1.height);
        frdContext2.drawImage(frdImage2,0,0,frdImage2.width,frdImage2.height);
        frdContext3.drawImage(frdImage3,0,0,frdImage3.width,frdImage3.height);
        frdContext4.drawImage(frdImage4,0,0,frdImage4.width,frdImage4.height);
        frdContext5.drawImage(frdImage5,0,0,frdImage5.width,frdImage5.height);
        frdContext6.drawImage(frdImage6,0,0,frdImage6.width,frdImage6.height);
        setTimeout(DrawPlayers,pace);
    };

    //3D part
    function init(){
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(width, height);
        renderer.setClearColor(0x101010);
        document.body.appendChild(renderer.domElement);
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffe9df);

        camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
        camera.position.set(11, 5, 16);
        camera.lookAt(new THREE.Vector3(0,0,0));
        scene.add(camera);

        light = new THREE.DirectionalLight(0xffffff, 2);
        light.position.setScalar(10);
        scene.add(light);

        geometry = new THREE.PlaneGeometry(5, 7, 1, 1);

        //set up textures
        texture1 = new THREE.Texture(frdCanvas1);
        texture2 = new THREE.Texture(frdCanvas2);
        texture3 = new THREE.Texture(frdCanvas3);
        texture4 = new THREE.Texture(frdCanvas4);
        texture5 = new THREE.Texture(frdCanvas5);
        texture6 = new THREE.Texture(frdCanvas6);

        material1 = new THREE.MeshBasicMaterial({ map: texture1 });
        material2 = new THREE.MeshBasicMaterial({ map: texture2 });
        material3 = new THREE.MeshBasicMaterial({ map: texture3 });
        material4 = new THREE.MeshBasicMaterial({ map: texture4 });
        material5 = new THREE.MeshBasicMaterial({ map: texture5 });
        material6 = new THREE.MeshBasicMaterial({ map: texture6 });

        mesh1 = new THREE.Mesh(geometry,material1);
        mesh1.position.set(0,3,-20);
        mesh1.rotation.y = 0.15 * Math.PI;
        scene.add(mesh1);

        mesh2 = new THREE.Mesh(geometry,material2);
        mesh2.position.set(0,3,-12);
        mesh2.rotation.y = 0.15 * Math.PI;
        scene.add(mesh2);

        mesh3 = new THREE.Mesh(geometry,material3);
        mesh3.position.set(0,3,-4);
        mesh3.rotation.y = 0.15 * Math.PI;
        scene.add(mesh3);

        mesh4 = new THREE.Mesh(geometry,material4);
        mesh4.position.set(0,3,4);
        mesh4.rotation.y = 0.15 * Math.PI;
        scene.add(mesh4);

        mesh5 = new THREE.Mesh(geometry,material5);
        mesh5.position.set(0,3,10);
        mesh5.rotation.y = 0.15 * Math.PI;
        scene.add(mesh5);

        mesh6 = new THREE.Mesh(geometry,material6);
        mesh6.position.set(0,3,16);
        mesh6.rotation.y = 0.15 * Math.PI;
        scene.add(mesh6);

        var planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
        var planeTexture = new THREE.TextureLoader().load( 'or.png' );
        var planeMaterial = new THREE.MeshLambertMaterial( { map: planeTexture } );
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -0.5 * Math.PI;
        plane.receiveShadow = true;
        plane.position.set(0,0,-8);
        scene.add(plane);
    }

    function animate() {

        requestAnimationFrame(animate);

        texture1.needsUpdate = true;
        texture2.needsUpdate = true;
        texture3.needsUpdate = true;
        texture4.needsUpdate = true;
        texture5.needsUpdate = true;
        texture6.needsUpdate = true;

        mesh1.position.x = -17 + pos1;
        mesh2.position.x = -17 + pos2;
        mesh3.position.x = -17 + pos3;
        mesh4.position.x = -17 + pos4;
        mesh5.position.x = -17 + pos5;
        mesh6.position.x = -17 + pos6;

        if (mesh1.position.x >= 25){
          document.getElementById("timer").innerHTML="We have a Winner: 1 you are the winner!";
        }
        else if (mesh2.position.x >= 25){
          document.getElementById("timer").innerHTML="We have a Winner: 2 you are the winner!";
        }
        else if (mesh3.position.x >= 25){
          document.getElementById("timer").innerHTML="We have a Winner: 3 you are the winner!";
        }
        else if (mesh4.position.x >= 25){
          document.getElementById("timer").innerHTML="We have a Winner: 4 you are the winner!";
        }
        else if (mesh5.position.x >= 25){
          document.getElementById("timer").innerHTML="We have a Winner: 5 you are the winner!";
        }



        renderer.render(scene, camera);
    }

    init();
    animate();



  });
