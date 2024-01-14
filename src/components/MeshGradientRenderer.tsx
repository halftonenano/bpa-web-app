'use client';

import MeshGradient from 'mesh-gradient.js';
import { useEffect, useId } from 'react';

const gradient = new MeshGradient();
const colors = ['#ecfccb', '#fff', '#bae6fd', '#d1fae5'];
let i = 315;
let initialized = false;

export default function MeshGradientRenderer({
  className,
  width,
  height,
}: {
  className?: string;
  width?: number;
  height?: number;
}) {
  const canvasId = useId();

  useEffect(() => {
    gradient.initGradient('#' + canvasId.replace(/:/g, ''), colors);
    gradient.setCanvasSize(width || 800, height || 800);
    if (!initialized) {
      initialized = true;
      animate();
    }
  }, []);

  return <canvas id={canvasId.replace(/:/g, '')} className={className || ''} />;
}

function animate() {
  i += 0.02;
  gradient?.changePosition(i);
  requestAnimationFrame(animate);
}
