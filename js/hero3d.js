(function(){
  var mount=document.getElementById("scene");
  if(!mount||!window.THREE)return;

  var files=["img/models/form1.glb","img/models/form2.glb","img/models/form3.glb","img/models/form4.glb","img/models/form5.glb"];
  var forms=["墨","静","間","光","波"];
  var current=0;

  var scene=new THREE.Scene();
  var camera=new THREE.PerspectiveCamera(40,1,0.1,100);
  camera.position.z=5;

  var renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  mount.appendChild(renderer.domElement);

  var light=new THREE.DirectionalLight(0xffffff,1.2);
  light.position.set(3,4,5);
  scene.add(light);
  var fill=new THREE.DirectionalLight(0xffffff,0.5);
  fill.position.set(-4,-2,3);
  scene.add(fill);
  scene.add(new THREE.AmbientLight(0xffffff,0.55));

  function makeTexture(ch){
    var c=document.createElement("canvas");
    c.width=512;c.height=512;
    var x=c.getContext("2d");
    x.fillStyle="#1f2deb";
    x.font="bold 360px 'Helvetica Neue',Arial,sans-serif";
    x.textAlign="center";
    x.textBaseline="middle";
    x.fillText(ch,256,280);
    var t=new THREE.CanvasTexture(c);
    t.anisotropy=4;
    return t;
  }

  var geo=new THREE.BoxGeometry(2.4,2.4,0.5);
  var mat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.4,metalness:0.05,map:makeTexture(forms[0])});
  var placeholder=new THREE.Mesh(geo,mat);
  scene.add(placeholder);

  var pivots=[];
  var loaded=0;
  var glbReady=false;

  function prepare(root){
    var pivot=new THREE.Group();
    root.traverse(function(o){
      if(o.isMesh){
        o.material=new THREE.MeshStandardMaterial({color:0x1f2deb,roughness:0.35,metalness:0.1});
      }
    });
    pivot.add(root);
    var box=new THREE.Box3().setFromObject(root);
    var center=box.getCenter(new THREE.Vector3());
    root.position.sub(center);
    var size=box.getSize(new THREE.Vector3());
    var max=Math.max(size.x,size.y,size.z);
    var s=2.6/(max||1);
    pivot.scale.set(s,s,s);
    pivot.visible=false;
    return pivot;
  }

  if(THREE.GLTFLoader){
    var loader=new THREE.GLTFLoader();
    files.forEach(function(f,i){
      loader.load(f,function(g){
        pivots[i]=prepare(g.scene);
        scene.add(pivots[i]);
        loaded++;
        if(!glbReady){
          glbReady=true;
          scene.remove(placeholder);
        }
        pivots[i].visible=(i===current);
      },undefined,function(){});
    });
  }

  var targetX=0,targetY=0;
  mount.addEventListener("pointermove",function(e){
    var r=mount.getBoundingClientRect();
    targetY=((e.clientX-r.left)/r.width-0.5)*1.2;
    targetX=((e.clientY-r.top)/r.height-0.5)*0.8;
  });
  mount.addEventListener("pointerleave",function(){targetX=0;targetY=0;});

  function resize(){
    var w=mount.clientWidth,h=mount.clientHeight;
    renderer.setSize(w,h);
    camera.aspect=w/h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize",resize);
  resize();

  var t=0;
  function loop(){
    requestAnimationFrame(loop);
    t+=0.01;
    var obj=(glbReady&&pivots[current])?pivots[current]:placeholder;
    obj.rotation.y+=(targetY-obj.rotation.y)*0.06+0.004;
    obj.rotation.x+=(targetX-obj.rotation.x)*0.06;
    obj.position.y=Math.sin(t)*0.08;
    renderer.render(scene,camera);
  }
  loop();

  window.setHeroForm=function(i){
    current=i;
    if(glbReady){
      pivots.forEach(function(p,idx){if(p)p.visible=(idx===i);});
    }else{
      mat.map=makeTexture(forms[i]);
      mat.needsUpdate=true;
    }
  };
})();
