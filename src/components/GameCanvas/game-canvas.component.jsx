import React, { useRef, useEffect } from 'react'

import './game-canvas.styles.scss';

const GameCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        let ballX = 75;
        let ballSpeedX = 5;
        let ballY = 75;
        let ballSpeedY = 10;

        const canvas = canvasRef.current;
        const canvasContext = canvas.getContext('2d');

        const updateAll = () => {
            ballX += ballSpeedX;
            ballY += ballSpeedY;

            if(ballX > canvas.width) {
                ballSpeedX = -ballSpeedX;
            }

            if(ballX < 0) {
                ballSpeedX = -ballSpeedX;
            }

            if(ballY > canvas.height) {
                ballSpeedY = -ballSpeedY;
            }

            if(ballY < 0) {
                ballSpeedY = -ballSpeedY;
            }

            canvasContext.fillStyle = '#000000';
            canvasContext.fillRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);

            canvasContext.fillStyle = '#FFF';
            canvasContext.beginPath();
            canvasContext.arc(ballX, ballY, 10, 0, Math.PI*2, true);
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