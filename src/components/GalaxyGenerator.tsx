import React, { useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'

const GalaxyGenerator = () => {
  useEffect(() => {
    /**
     * Base
     */
    // Debug
    const gui = new dat.GUI({ width: 360 })

    // Canvas
    const canvas: HTMLElement = document.querySelector(
      'canvas.webgl'
    ) as HTMLElement

    // Scene
    const scene = new THREE.Scene()

    /**
     * Galaxy
     */
    const parameters = {}
    //@ts-ignore
    parameters.count = 1000
    //@ts-ignore

    let geometry = null
    let material = null
    let points = null

    //@ts-ignore
    parameters.size = 0.02

    const generateGalaxy = () => {
      /**
       * Destroy Galaxy
       */
      //@ts-ignore
      if (points !== null) {
        //@ts-ignore
        geometry.dispose()
        //@ts-ignore
        material.dispose()
        //@ts-ignore
        scene.remove(points)
      }

      /**
       * Geometry
       */
      geometry = new THREE.BufferGeometry()
      //@ts-ignore
      const positions = new Float32Array(parameters.count * 3)
      //@ts-ignore
      for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3

        positions[i3] = (Math.random() - 0.5) * 3
        positions[i3 + 1] = (Math.random() - 0.5) * 3
        positions[i3 + 2] = (Math.random() - 0.5) * 3
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      /**
       * Material
       */
      material = new THREE.PointsMaterial({
        //@ts-ignore
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      /**
       * Points
       */
      points = new THREE.Points(geometry, material)
      scene.add(points)
    }
    generateGalaxy()

    // Debug
    gui
      .add(parameters, 'count')
      .min(100)
      .max(1000000)
      .step(100)
      .onFinishChange(generateGalaxy)
    gui
      .add(parameters, 'size')
      .min(0.001)
      .max(0.1)
      .step(0.001)
      .onFinishChange(generateGalaxy)

    /**
     * Test cube
     */
    // const cube = new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1),
    //   new THREE.MeshBasicMaterial()
    // )
    // scene.add(cube)

    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    window.addEventListener('resize', () => {
      // Update sizes
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight

      // Update camera
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()

      // Update renderer
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    )
    camera.position.x = 3
    camera.position.y = 3
    camera.position.z = 3
    scene.add(camera)

    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas,
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    /**
     * Animate
     */
    const clock = new THREE.Clock()

    const tick = () => {
      const elapsedTime = clock.getElapsedTime()

      // Update controls
      controls.update()

      // Render
      renderer.render(scene, camera)

      // Call tick again on the next frame
      window.requestAnimationFrame(tick)
    }

    tick()
  }, [])

  return (
    <section>
      <canvas className='webgl'></canvas>
    </section>
  )
}

export default GalaxyGenerator
