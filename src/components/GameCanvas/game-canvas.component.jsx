import React, { useRef, useEffect } from 'react'

import './game-canvas.styles.scss';

const GameCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        let ballX = 75;
        let ballSpeedX = 5;
        let ballY = 75;

        const canvas = canvasRef.current;
        const canvasContext = canvas.getContext('2d');

        const updateAll = () => {
            ballX += ballSpeedX;

            canvasContext.fillStyle = '#000000';
            canvasContext.fillRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);

            canvasContext.fillStyle = '#FFF';
            canvasContext.beginPath();
            canvasContext.arc(ballX, 100, 10, 0, Math.PI*2, true);
            canvasContext.fill();
          }

        const framesPerSecond = 30;

        setInterval(updateAll, 1000/framesPerSecond);

      }, [])



    return (
        <div>
            <canvas id='gameCanvas' width='800' height='600' ref={canvasRef}>

            </canvas>
        </div>
    )
}

export default GameCanvas;