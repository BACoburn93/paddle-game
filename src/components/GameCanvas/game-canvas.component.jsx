import React, { useRef, useEffect } from 'react'

import './game-canvas.styles.scss';

const GameCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const canvasContext = canvas.getContext('2d');
        canvasContext.fillStyle = '#000000';
        canvasContext.fillRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);

        canvasContext.fillStyle = '#FFF';
        canvasContext.beginPath();
        canvasContext.arc(100, 100, 10, 0, Math.PI*2, true);
        canvasContext.fill();

      }, [])

    return (
        <div>
            <canvas id='gameCanvas' width='800' height='600' ref={canvasRef}>

            </canvas>
        </div>
    )
}

export default GameCanvas;