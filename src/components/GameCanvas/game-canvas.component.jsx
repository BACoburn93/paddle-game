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

        const PADDLE_WIDTH = 100;
        const PADDLE_THICKNESS = 10;
        const PADDLE_DIST_FROM_EDGE = canvas.height / 10;
        let paddleX = 400;

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

            if (ballX >= canvas.width) { // right
                ballSpeedX = -ballSpeedX;
                if (ballColor < colors.length - 1) ballColor++;
                else ballColor = 0;
            }

            if (ballX <= 0) { // left
                ballSpeedX = -ballSpeedX;
                if (ballColor < colors.length - 1) ballColor++;
                else ballColor = 0;
            }

            if (ballY >= canvas.height) { // bottom
                // ballSpeedY = -ballSpeedY;
                // if (ballColor < colors.length - 1) ballColor++;
                // else ballColor = 0;
                ballReset();
            }

            if (ballY <= 0) { // top
                ballSpeedY = -ballSpeedY;
                if (ballColor < colors.length - 1) ballColor++;
                else ballColor = 0;
            }

            let paddleTopEdgeY = canvas.height - PADDLE_DIST_FROM_EDGE;
            let paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
            let paddleLeftEdgeX = paddleX;
            let paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH;

            if (ballY > paddleTopEdgeY - PADDLE_THICKNESS && // below top of paddle
                ballY < paddleBottomEdgeY && // above bottom of paddle
                ballX > paddleLeftEdgeX && // right of left of paddle
                ballX < paddleRightEdgeX) { // left of right of paddle

                ballSpeedY = -ballSpeedY;

                let centerOfPaddleX = paddleX + PADDLE_WIDTH / 2;
                let ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
                ballSpeedX = ballDistFromPaddleCenterX * 0.38;
            }
        }

        const drawAll = () => {
            colorRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height, '#000000');

            colorCircle(ballX, ballY, ballSize, colors[ballColor]);

            colorRect(paddleX, canvas.height - PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, colors[ballColor]);
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