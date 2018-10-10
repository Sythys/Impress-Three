// Documentation coming soon

let background = document.getElementById("background");
let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;
background.appendChild(renderer.domElement);

var path = 'three/textures/MilkyWay/';
var format = '.jpg';
var envMap = new THREE.CubeTextureLoader().load( [
    path + 'dark-s_px' + format, path + 'dark-s_nx' + format,
    path + 'dark-s_py' + format, path + 'dark-s_ny' + format,
    path + 'dark-s_pz' + format, path + 'dark-s_nz' + format
] );

let scene = new THREE.Scene();
// scene.background = new THREE.Color( 0x666666 );
scene.background = envMap;

camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, .01, 100 );
camera.position.set( 0, 0, 0 );

light = new THREE.HemisphereLight( 0xbbbbff, 0x444422 );
light2 = new THREE.PointLight( 0xbbbbff, .21, 100, 0.1 );
light.position.set( 0, 1, 0 );
light2.position.set( 4, -3, 3);
scene.add( light );
scene.add( light2 );

let loader = new THREE.GLTFLoader();
loader.load( 'three/models/Impreejs.gltf', function ( gltf ) {

    scene.add( gltf.scene );},undefined,undefined);

let Step = true;
let deltaA = Date.now();
let stateA = currentState;

function setCameraTranslation() {
    let stateB = currentState;
    let delta = null;
    let translationScale = 0.001;
    let deltaProgress = 1;
    let state = [0,0,4,0,0,0,0];
    delta = Date.now();
    stateB = currentState;
    // Step = false;
    if((stateA !== stateB) && (Step)) {
        deltaA = Date.now() - 19;
        Step = false;
    }
    deltaProgress = ((delta-deltaA)/GlobalDuration);
    if(deltaProgress >= 1){
        deltaProgress = 1;
    }

    if(deltaProgress >= 1){
        stateA = stateB;
        Step = true;
    }
    deltaProgress = ( 3 * Math.pow(deltaProgress,2) ) - ( 2 * Math.pow(deltaProgress,3) );
    // deltaProgress = ( 1.26 * deltaProgress ) - ( 0.78 * Math.pow(deltaProgress,2) ) + ( 0.52 * Math.pow(deltaProgress,3) );

    state[3] = stateA.rotate.x + (( stateB.rotate.x - stateA.rotate.x ) * deltaProgress);
    state[4] = stateA.rotate.y + (( stateB.rotate.y - stateA.rotate.y ) * deltaProgress);
    state[5] = stateA.rotate.z + (( stateB.rotate.z - stateA.rotate.z ) * deltaProgress);

    state[0] = stateA.translate.x + (( stateB.translate.x - stateA.translate.x ) * deltaProgress);
    state[1] = stateA.translate.y + (( stateB.translate.y - stateA.translate.y ) * deltaProgress);
    state[2] = stateA.translate.z + (( stateB.translate.z - stateA.translate.z ) * deltaProgress);

    state[0] -= (-1.29)*(Math.sin(state[4]*Math.PI/180))*(1/(stateA.scale + ( stateB.scale - stateA.scale )* deltaProgress))/translationScale;
    state[1] += (-1.29)*(Math.sin(state[3]*Math.PI/180))*(1/(stateA.scale + ( stateB.scale - stateA.scale )* deltaProgress))/translationScale;
    state[2] += (-1.29)*(Math.cos(state[3]*Math.PI/180)*Math.cos(state[4]*Math.PI/180))*(1/(stateA.scale + ( stateB.scale - stateA.scale )* deltaProgress))/translationScale;

    camera.position.set(state[0]*(-1)*translationScale,state[1]*translationScale,state[2]*(-1)*translationScale);
    camera.rotation.set(state[3]*Math.PI/180, state[4]*(-1)*Math.PI/180,state[5]*Math.PI/180);

    // function printData() {
    //     let node = document.getElementById("data");
    //     node.innerHTML = '<h1 style="font-family: Consolas;color: white;">' + "</br>"
    //         + camera.position.x.toFixed(2) + " = " + state[0] + " = " + currentState.translate.x.toFixed(2) + " " + stateA.translate.x + " " + stateB.translate.x + "</br>"
    //         + camera.position.y.toFixed(2) + " = " + state[1] + " = " + currentState.translate.y.toFixed(2) + "</br>"
    //         + camera.position.z.toFixed(2) + " = " + state[2] + " = " + currentState.translate.z.toFixed(2) + "</br>"
    //         + camera.rotation.x.toFixed(2) + " = " + state[3] + " = " + currentState.rotate.x.toFixed(2) + "</br>"
    //         + camera.rotation.y.toFixed(2) + " = " + state[4] + " = " + currentState.rotate.y.toFixed(2) + "</br>"
    //         + camera.rotation.z.toFixed(2) + " = " + state[5] + " = " + currentState.rotate.z.toFixed(2) + "</br>"
    //         + "DeltaProgress__" + deltaProgress.toFixed(2) + "</br>"
    //         + "DeltaA_________" + deltaA + "</br>"
    //         + "delta__________" + delta + "</br>"
    //         + "Step___________" + Step + "</br>"
    //         + "Test___________" + ((delta-deltaA)/GlobalDuration).toFixed(2) + "</br>"
    //         + "GlobalDuration_" + GlobalDuration
    //         + "</br>Window inner width" + window.innerWidth + "</h1>";
    // }
    // printData()
}

function animate() {
    requestAnimationFrame( animate );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );
    setCameraTranslation();
}
animate();
