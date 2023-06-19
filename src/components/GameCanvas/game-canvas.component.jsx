import React, { useRef, useEffect, useMemo, useCallback } from 'react'

import './game-canvas.styles.scss';

const GameCanvas = () => {
    const canvasRef = useRef(null);
    let gameStart = useRef(false);
    let bricksLeft = useRef(0);

    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 600;

    const BRICK_COLS = 10;
    const BRICK_ROWS = 13;

    const brickGrid = useMemo(() => new Array(BRICK_COLS * BRICK_ROWS), []);

    const brickReset = useCallback(() => {
        bricksLeft.current = 0;
        for (let i = 0; i < BRICK_COLS * 3; i++) {
            brickGrid[i] = false;
        }
        for (let i = BRICK_COLS * 3; i < BRICK_COLS * BRICK_ROWS; i++) {
            brickGrid[i] = true;
            bricksLeft.current++;
        }
    }, [brickGrid])

    useEffect(() => {
        if (!gameStart.current) {
            gameStart.current = true;
            let canvas, canvasContext;

            let mouseX = 0;
            // eslint-disable-next-line no-unused-vars
            let mouseY = 0;

            let ballX = 75;
            let ballSpeedX = 5;
            let ballY = 75;
            let ballSpeedY = 10;

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

                // Cheat to test ball in any position
                ballX = mouseX;
                ballY = mouseY;
                ballSpeedX = 4;
                ballSpeedY = -4;
            }

            const colors = ['rgb(139,211,230)', 'rgb(255,109,106)', 'rgb(233,236,107)', 'rgb(239,190,125)', 'rgb(177,162,202)'];

            canvas.addEventListener('mousemove', updateMousePos);

            const updateAll = () => {
                moveAll();
                drawAll();
            }

            const ballReset = () => {
                ballX = canvas.width / 2;
                ballY = canvas.height / 2;
            }

            const ballMove = () => {
                ballX += ballSpeedX;
                ballY += ballSpeedY;

                if (ballX >= canvas.width && ballSpeedX > 0.0) { // right
                    ballSpeedX = -ballSpeedX;
                    if (ballColor < colors.length - 1) ballColor++;
                    else ballColor = 0;
                }

                if (ballX <= 0 && ballSpeedX < 0.0) { // left
                    ballSpeedX = -ballSpeedX;
                    if (ballColor < colors.length - 1) ballColor++;
                    else ballColor = 0;
                }

                if (ballY >= canvas.height) { // bottom
                    ballReset();
                    brickReset();
                }

                if (ballY <= 0 && ballSpeedY < 0.0) { // top
                    ballSpeedY = -ballSpeedY;
                    if (ballColor < colors.length - 1) ballColor++;
                    else ballColor = 0;
                }
            }

            const isBrickAtColRow = (col, row) => {
                if (col >= 0 && col < BRICK_COLS &&
                    row >= 0 && row < BRICK_ROWS) {
                    let brickIndexUnderCoord = rowCallToArrayIndex(col, row);
                    return brickGrid[brickIndexUnderCoord];
                } else {
                    return false;
                }
            }

            const ballBrickHandling = () => {
                let ballBrickCol = Math.floor(ballX / BRICK_W);
                let ballBrickRow = Math.floor(ballY / BRICK_H);
                let brickIndexUnderBall = rowCallToArrayIndex(ballBrickCol, ballBrickRow)

                if (ballBrickCol >= 0 && ballBrickCol < BRICK_COLS &&
                    ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS) {

                    if (isBrickAtColRow(ballBrickCol, ballBrickRow)) {
                        brickGrid[brickIndexUnderBall] = false;
                        bricksLeft.current--;

                        let prevBallX = ballX - ballSpeedX;
                        let prevBallY = ballY - ballSpeedY;
                        let prevBrickCol = Math.floor(prevBallX / BRICK_W);
                        let prevBrickRow = Math.floor(prevBallY / BRICK_H);

                        let bothTestsFailed = true;

                        if (prevBrickCol !== ballBrickCol) {
                            let adjBrickSide = rowCallToArrayIndex(prevBrickCol, ballBrickRow);

                            if (!brickGrid[adjBrickSide]) {
                                ballSpeedX = -ballSpeedX;
                                bothTestsFailed = false;
                            }
                        }

                        if (prevBrickRow !== ballBrickRow) {
                            let adjBrickTopBot = rowCallToArrayIndex(ballBrickCol, prevBrickRow);

                            if (!brickGrid[adjBrickTopBot]) {
                                ballSpeedY = -ballSpeedY;
                                bothTestsFailed = false;
                            }
                        }

                        if (bothTestsFailed) {
                            ballSpeedX = -ballSpeedX;
                            ballSpeedY = -ballSpeedY;
                        }

                    } // end of brick found
                } // end of valid col and row
            } // end of ballBrickHandling

            const ballPaddleHandling = () => {
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
                    if (bricksLeft.current === 0) {
                        brickReset();
                    } // when bricks are all gone
                } // ball center inside paddle
            } // ballPaddleHandling end

            const moveAll = () => {
                ballMove();
                ballBrickHandling();
                ballPaddleHandling();
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

            // const colorText = (showWords, textX, textY, fillColor) => {
            //     canvasContext.fillStyle = fillColor;
            //     canvasContext.fillText(showWords, textX, textY);
            // }

            const framesPerSecond = 30;

            setInterval(updateAll, 1000 / framesPerSecond);

            ballReset();
        }
    }, [brickGrid, gameStart, brickReset])

    useEffect(() => {
        brickReset();
    }, [brickGrid, brickReset])



    return (
        <div>
            <canvas id='gameCanvas' width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef}>

            </canvas>
        </div>
    )
}

export default GameCanvas;