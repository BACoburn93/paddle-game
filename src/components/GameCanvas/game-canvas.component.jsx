import React, { useRef, useEffect } from 'react'

import './game-canvas.styles.scss';

const GameCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.fillStyle = '#000000';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
      }, [])

    return (
        <div>
            <canvas id='gameCanvas' width='800' height='600' ref={canvasRef}>

            </canvas>
        </div>
    )
}

export default GameCanvas;