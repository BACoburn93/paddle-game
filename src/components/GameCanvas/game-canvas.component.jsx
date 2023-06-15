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

        const PADDLE_WIDTH = 100;
        const PADDLE_THICKNESS = 10;
        let paddleX = 400;

        const canvas = canvasRef.current;
        const canvasContext = canvas.getContext('2d');

        const updateMousePos = (e) => {
            let rect = canvas.getBoundingClientRect();
            let root = document.documentElement;

            let mouseX = e.clientX - rect.left - root.scrollLeft;
            // let mouseY = e.clientY - rect.top - root.scrollTop;

            paddleX = mouseX - PADDLE_WIDTH / 2;
        }

        const colors = ['red', 'orange', 'yellow', 'blue', 'green', 'violet', 'white'];

        canvas.addEventListener('mousemove', updateMousePos);

        const updateAll = () => {
            moveAll();
            drawAll();
        }

        const ballReset = () => {
            ballX = canvas.width / 2;
            ballY = canvas.height / 2;
        }

        const moveAll = () => {
            ballX += ballSpeedX;
            ballY += ballSpeedY;

            if (ballX >= canvas.width - ballSize) { // right
                ballSpeedX = -ballSpeedX;
                if (ballColor < colors.length - 1) ballColor++;
                else ballColor = 0;
            }

            if (ballX <= ballSize) { // left
                ballSpeedX = -ballSpeedX;
                if (ballColor < colors.length - 1) ballColor++;
                else ballColor = 0;
            }

            if (ballY >= canvas.height - ballSize) { // bottom
                ballSpeedY = -ballSpeedY;
                if (ballColor < colors.length - 1) ballColor++;
                else ballColor = 0;
            }

            if (ballY <= ballSize) { // top
                ballSpeedY = -ballSpeedY;
                if (ballColor < colors.length - 1) ballColor++;
                else ballColor = 0;
            }
        }

        const drawAll = () => {
            colorRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height, '#000000');

            colorCircle(ballX, ballY, ballSize, colors[ballColor]);

            colorRect(paddleX, canvas.height - PADDLE_THICKNESS, PADDLE_WIDTH, PADDLE_THICKNESS, '#fff');
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