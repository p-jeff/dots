import { Canvas } from '@react-three/fiber'
import { OrbitControls, QuadraticBezierLine } from '@react-three/drei'
import './index.css'
import React from 'react';
import { useFrame } from '@react-three/fiber';



function MyPoints() {
  const myRef = React.useRef();
  const myRef2 = React.useRef();

  function calcPosition(n) {
    let positions = [];

    for (let zi = 0; zi < n; zi++) {
      for (let yi = 0; yi < n; yi++) {
        for (let xi = 0; xi < n; xi++) {
          let x = xi * 4
          let y = yi * 4
          let z = zi * 4
          positions.push(x, y, z)
        }
      }
    }
    return positions
  }

  let positionsA = calcPosition(5)

  let positions = new Float32Array(positionsA)

  function reCal(positions) {
    let reCal = [];
    let temp = [];
    for (let i = 1; i < positions.length; i++) {
      if (i % 3 > 0) {
        temp.push(positions[i])
      }
      else {
        temp.push(positions[i])
        reCal.push(temp)
        temp = []
      }
    }

    randomItems = reCal.sort(() => .5 - Math.random()).slice(0, 4);

    return randomItems
  }


  let randomItems;
  let neoPos = positions.map((x) => x)
  let reCalc = reCal(neoPos);

  let i = 0;
  let speed = 5;

  useFrame(({ clock }) => {
    neoPos = neoPos.sort(() => Math.random() - 0.5);
    reCalc = reCal(neoPos);

    console.log(i)
    if (i % speed === 0) {
      myRef.current.setPoints(reCalc[0], reCalc[1], reCalc[2]);
      myRef2.current.setPoints(reCalc[1], reCalc[2], reCalc[1]);
    }

    i = i + 1
  })

  return (
    <>
      <points>
        <bufferGeometry attach="geometry">
          <bufferAttribute

            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color='black' size={0.3} />
      </points>

      <QuadraticBezierLine points={reCalc} ref={myRef} />
      <QuadraticBezierLine points={reCalc} ref={myRef2} />

    </>
  );
}

function App() {

  return (
    <div className='App'>
      <Canvas camera={{ fov: 75, position: [0, 0, 20] }}>
        <OrbitControls />
        <ambientLight intensity={0.1} />
        <directionalLight color="red" position={[0, 0, 5]} />
        <MyPoints />
      </Canvas>

    </div >
  )
}

export default App

/*
Old and unsued Bits

// Simple Buffer line -> lineWith impossible
<line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            ref={vertexRef}
            attach="attributes-position"
            count={6}
            array={neoPos}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color='red' size={20} />
      </line>


*/ 