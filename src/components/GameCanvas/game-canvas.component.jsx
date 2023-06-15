import React, { useRef, useEffect } from 'react'

import './game-canvas.styles.scss';

const GameCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        let ballX = 75;
        let ballSpeedX = 5;
        let ballY = 75;
        let ballSpeedY = 10;

        let ballColor = 0;

        let ballSize = 10;

        const canvas = canvasRef.current;
        const canvasContext = canvas.getContext('2d');

        const colors = ['red', 'orange', 'yellow', 'blue', 'green', 'violet', 'white'];

        const updateAll = () => {
            moveAll();
            drawAll();
        }

        const moveAll = () => {
            ballX += ballSpeedX;
            ballY += ballSpeedY;

            if (ballX >= canvas.width - ballSize) {
                ballSpeedX = -ballSpeedX;
                if (ballColor < colors.length - 1) ballColor++;
                else ballColor = 0;
            }

            if (ballX <= ballSize) {
                ballSpeedX = -ballSpeedX;
                if (ballColor < colors.length - 1) ballColor++;
                else ballColor = 0;
            }

            if (ballY >= canvas.height - ballSize) {
                ballSpeedY = -ballSpeedY;
                if (ballColor < colors.length - 1) ballColor++;
                else ballColor = 0;
            }

            if (ballY <= ballSize) {
                ballSpeedY = -ballSpeedY;
                if (ballColor < colors.length - 1) ballColor++;
                else ballColor = 0;
            }
        }

        const drawAll = () => {
            colorRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height, '#000000')
            colorCircle(ballX, ballY, ballSize, colors[ballColor])
        }

        const colorRect = (topLeftX, topLeftY, boxWidth, boxHeight, fillColor) => {
            canvasContext.fillStyle = fillColor;
            canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
        }

        const colorCircle = (centerX, centerY, radius, fillColor) => {
            canvasContext.fillStyle = fillColor;
            canvasContext.beginPath();
            canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
            canvasContext.fill();
        }

        const framesPerSecond = 30;

        setInterval(updateAll, 1000 / framesPerSecond);

    }, [])



    return (
        <div>
            <canvas id='gameCanvas' width='800' height='600' ref={canvasRef}>

            </canvas>
        </div>
    )
}

export default GameCanvas;