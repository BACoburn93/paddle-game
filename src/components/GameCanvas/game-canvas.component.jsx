import React, { useRef, useEffect, useMemo } from 'react'

import './game-canvas.styles.scss';

const GameCanvas = () => {
    const canvasRef = useRef(null);

    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 600;

    const BRICK_COLS = 10;
    const BRICK_ROWS = 13;

    const brickGrid = useMemo(() => new Array(BRICK_COLS * BRICK_ROWS), []);

    useEffect(() => {
        console.log('RESETTING');
        let canvas, canvasContext;
        let mouseX = 0;
        let mouseY = 0;

        let ballX = 75;
        let ballSpeedX = 4;
        let ballY = 75;
        let ballSpeedY = 8;

        const BRICK_W = CANVAS_WIDTH / BRICK_COLS;
        const BRICK_H = 20;
        const BRICK_GAP = 2;

        let ballColor = 0;
        let ballSize = 10;

        canvas = canvasRef.current;
        canvasContext = canvas.getContext('2d');

        const PADDLE_WIDTH = 100;
        const PADDLE_THICKNESS = 10;
        const PADDLE_DIST_FROM_EDGE = canvas.height / 10;
        let paddleX = 400;

        const updateMousePos = (e) => {
            let rect = canvas.getBoundingClientRect();
            let root = document.documentElement;

            mouseX = e.clientX - rect.left - root.scrollLeft;
            mouseY = e.clientY - rect.top - root.scrollTop;

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

            if (ballX >= canvas.width - 5) { // right
                ballSpeedX = -ballSpeedX;
                if (ballColor < colors.length - 1) ballColor++;
                else ballColor = 0;
            }

            if (ballX <= 5) { // left
                ballSpeedX = -ballSpeedX;
                if (ballColor < colors.length - 1) ballColor++;
                else ballColor = 0;
            }

            if (ballY >= canvas.height - 5) { // bottom
                ballReset();
            }

            if (ballY <= 5) { // top
                ballSpeedY = -ballSpeedY;
                if (ballColor < colors.length - 1) ballColor++;
                else ballColor = 0;
            }

            let ballBrickCol = Math.floor(ballX / BRICK_W);
            let ballBrickRow = Math.floor(ballY / BRICK_H);
            let brickIndexUnderBall = rowCallToArrayIndex(ballBrickCol, ballBrickRow)

            if (brickIndexUnderBall >= 0 && brickIndexUnderBall < BRICK_COLS * BRICK_ROWS) {
                brickGrid[brickIndexUnderBall] = false;
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

            drawBricks();

            // colorText(`${mouseBrickCol}, ${mouseBrickRow}: ${brickIndexUnderMouse}`, mouseX, mouseY, colors[ballColor]);
        }

        const rowCallToArrayIndex = (col, row) => {
            return col + BRICK_COLS * row;
        }

        const drawBricks = () => {
            for (let brickRow = 0; brickRow < BRICK_ROWS; brickRow++) {
                for (let brickCol = 0; brickCol < BRICK_COLS; brickCol++) {

                    let arrayIndex = rowCallToArrayIndex(brickCol, brickRow);

                    if (brickGrid[arrayIndex]) {
                        colorRect(BRICK_W * brickCol, BRICK_H * brickRow, BRICK_W - BRICK_GAP, BRICK_H - BRICK_GAP, colors[ballColor]);
                    }
                }
            }
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

        const colorText = (showWords, textX, textY, fillColor) => {
            canvasContext.fillStyle = fillColor;
            canvasContext.fillText(showWords, textX, textY);
        }

        const framesPerSecond = 30;

        setInterval(updateAll, 1000 / framesPerSecond);

        // brickReset();
    }, [brickGrid])

    useEffect(() => {
        const brickReset = () => {
            for (let i = 0; i < BRICK_COLS * BRICK_ROWS; i++) {
                // if (Math.random() < 0.5) {
                brickGrid[i] = true;
                // } 
                // else {
                //     brickGrid[i] = false;
                // }
            }
        }

        brickReset();
    }, [brickGrid])



    return (
        <div>
            <canvas id='gameCanvas' width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef}>

            </canvas>
        </div>
    )
}

export default GameCanvas;