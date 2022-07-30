import * as THREE from "three";
import React, { Suspense, useRef, useEffect, useProgress } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PositionalAudio, OrbitControls, QuadraticBezierLine, Html } from "@react-three/drei";
import './index.css'

function Analyzer({ sound, threshhold, dots, offset, color }) {
  // <Analyzer /> will not run before everything else in the suspense block is resolved.
  // That means <PositionalAudio/>, which executes async, is ready by the time we're here.
  // The next frame (useEffect) is guaranteed(!) to access positional-audios ref.

  const analyser = useRef();
  const myRef = useRef();
  const myRef2 = useRef();
  const myRef3 = useRef();

  let randomItems

  function calcPosition(n) {
    let positions = [];

    for (let zi = 0; zi < n; zi++) {
      for (let yi = 0; yi < n; yi++) {
        for (let xi = 0; xi < n; xi++) {
          let x = xi + offset
          let y = yi
          let z = zi
          positions.push(x, y, z)
        }
      }
    }
    return positions
  }

  function reCal(array) {
    let reCal = [];
    let temp = [];

    const chunkSize = 3;
    for (let i = 0; i < array.length; i += chunkSize) {
      temp = array.slice(i, i + chunkSize);
      reCal.push(temp)
    }

    /*for (let i = 0; i < positions.length; i++) {
      if (i % 3 > 0) {
        temp.push(positions[i])
      }
      else {
        temp.push(positions[i])
        reCal.push(temp)
        temp = []
      }
    }*/

    randomItems = reCal.sort(() => .5 - Math.random()).slice(0, 3);
    return randomItems
  }

  let positions = new Float32Array(calcPosition(dots))

  useEffect(
    () => void (analyser.current = new THREE.AudioAnalyser(sound.current, 32)),
  );

  let reCalc = reCal(positions);

  useFrame(({ clock }) => {
    if (analyser.current) {
      const data = analyser.current.getAverageFrequency();

      if (data > threshhold) {
        reCalc = reCal(positions);
      }
    }

    myRef.current.setPoints(reCalc[0], reCalc[2]);
    //myRef2.current.setPoints([dots - 1 + offset, 0, dots - 1], reCalc[0]);
    //myRef3.current.setPoints([offset, dots - 1, 0], reCalc[2]);

    myRef2.current.setPoints(reCalc[1], reCalc[0]);
    myRef3.current.setPoints(reCalc[1], reCalc[2]);

    myRef.current.needsUpdate = true;
    myRef2.current.needsUpdate = true;
    myRef3.current.needsUpdate = true;
  });


  return (
    <>
      <QuadraticBezierLine points={reCalc} ref={myRef} lineWidth='5' color={color} />
      <QuadraticBezierLine points={reCalc} ref={myRef2} lineWidth='5' color={color} />
      <QuadraticBezierLine points={reCalc} ref={myRef3} lineWidth='5' color={color} />
    </>
  );
}

function Loader() {
  return <Html className="splashScreen">Loading...</Html>
}


function PlaySound({ url }) {
  // This component creates a suspense block, blocking execution until
  // all async tasks (in this case PositionAudio) have been resolved.
  const sound = useRef();
  return (
    <Suspense fallback={<Loader />}>
      <PositionalAudio autoplay url={url} ref={sound} position={[5, 5, 5]} distance={100} />
      <Analyzer sound={sound} dots={2} threshhold={70} offset={0} color={0xffff00} />
      <Analyzer sound={sound} dots={5} threshhold={80} offset={0} color={0xff00ff} />
      <Analyzer sound={sound} dots={8} threshhold={110} offset={0} color={0x003cff} />
      <Analyzer sound={sound} dots={10} threshhold={100} offset={0} color={0x000003} />
      <Analyzer sound={sound} dots={12} threshhold={90} offset={0} color={0x000003} />
    </Suspense>
  );
}

/*
function Dolly() {
  // This one makes the camera move in and out
  useFrame(({ clock, camera }) => {
    camera.position.z = 50 + Math.sin(clock.getElapsedTime()) * 30
  })
  return null
} */

export default function App() {

  return (
    <div className="App">
      <Canvas camera={{ position: [15, 15, 15], far: 100 }} >
        <PlaySound url="SoWeWentE.mp3" />
        <OrbitControls autoRotate='true' autoRotateSpeed={10} target={[5, 2.5, 5]} />
      </Canvas>
    </div >
  );
}



/*<points>

<OrbitControls autoRotate='true' />


        <bufferGeometry attach="geometry">
          <bufferAttribute
            ref={mesh}
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color={color} size={0.1} />
      </points>
*/