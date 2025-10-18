
import React, { useEffect, useRef } from 'react';

interface ConfettiProps {
  fire: boolean;
}

const Confetti: React.FC<ConfettiProps> = ({ fire }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (fire && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const confettiCount = 200;
      const confetti = [];
      const colors = ['#DC241F', '#003688', '#FFD300', '#00782A', '#A0A5A9', '#9B0056'];

      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      for (let i = 0; i < confettiCount; i++) {
        confetti.push({
          color: colors[Math.floor(Math.random() * colors.length)],
          dimensions: { x: Math.random() * 8 + 2, y: Math.random() * 10 + 5 },
          position: { x: Math.random() * canvas.width, y: -10 },
          rotation: Math.random() * 360,
          scale: { x: 1, y: 1 },
          velocity: { x: Math.random() * 20 - 10, y: Math.random() * 10 + 10 },
        });
      }

      let animationFrameId: number;

      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confetti.forEach((con, i) => {
          ctx.save();
          ctx.translate(con.position.x, con.position.y);
          ctx.rotate(con.rotation * Math.PI / 180);
          ctx.scale(con.scale.x, con.scale.y);
          ctx.fillStyle = con.color;
          ctx.fillRect(-con.dimensions.x / 2, -con.dimensions.y / 2, con.dimensions.x, con.dimensions.y);
          ctx.restore();

          con.position.x += con.velocity.x;
          con.position.y += con.velocity.y;
          con.rotation += Math.random() * 5;
          
          if(con.position.y > canvas.height + 20) {
            confetti.splice(i, 1);
          }
        });

        if (confetti.length > 0) {
          animationFrameId = requestAnimationFrame(render);
        }
      };

      resizeCanvas();
      render();
      window.addEventListener('resize', resizeCanvas);
      
      return () => {
        window.removeEventListener('resize', resizeCanvas);
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [fire]);

  return <canvas ref={canvasRef} className="confetti-canvas"></canvas>;
};

export default Confetti;
