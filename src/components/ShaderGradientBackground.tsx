/**
 * CURRENT APPROACH — Option 2: WebGL shader gradient with lazy loading.
 *
 * Uses @shadergradient/react (Three.js/WebGL) for the animated CTA background.
 * lazyLoad + rootMargin pause the render loop when the section is far off-screen,
 * preventing the GPU from running continuously and causing scroll jank.
 *
 * rootMargin="800px" — starts rendering 800px before the section enters the viewport
 * so the animation is already running by the time the user scrolls to it.
 *
 * ─── SWITCHING TO OPTION 1 (pure CSS, zero GPU cost) ────────────────────────
 * If you want to drop the WebGL gradient entirely:
 *
 * 1. In CTASection.astro:
 *    - Remove the import of ShaderGradientBackground (line 3)
 *    - Remove <ShaderGradientBackground client:only="react" /> (line 28)
 *    - The CSS .cta-gradient class (already in the <style> block) will take over
 *      automatically — it is already applied to the <section> element.
 *
 * 2. Keep or delete this file — it is no longer used.
 * ────────────────────────────────────────────────────────────────────────────
 */
import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react'

export function ShaderGradientBackground() {
  return (
    <ShaderGradientCanvas
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      pointerEvents="none"
      lazyLoad={true}
      threshold={0}
      rootMargin="800px"
    >
      <ShaderGradient
        control="props"
        animate="on"
        axesHelper="off"
        bgColor1="#000000"
        bgColor2="#000000"
        brightness={0.8}
        cAzimuthAngle={270}
        cDistance={0.5}
        cPolarAngle={180}
        cameraZoom={15.1}
        color1="#73bfc4"
        color2="#ff810a"
        color3="#8da0ce"
        envPreset="city"
        fov={45}
        grain="on"
        lightType="env"
        pixelDensity={1}
        positionX={-0.1}
        positionY={0}
        positionZ={0}
        range="disabled"
        rangeEnd={40}
        rangeStart={0}
        reflection={0.4}
        rotationX={0}
        rotationY={130}
        rotationZ={70}
        shader="defaults"
        type="sphere"
        uAmplitude={3.2}
        uDensity={0.8}
        uFrequency={5.5}
        uSpeed={0.3}
        uStrength={0.3}
        uTime={0}
        wireframe={false}
      />
    </ShaderGradientCanvas>
  )
}
