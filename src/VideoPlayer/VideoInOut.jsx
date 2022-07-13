import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

import { Constants } from './utils/Constants';
import pinButton from './image/in-out-pin.png';

const VideoInOutContainer = styled.div`
    position: relative;
    height: 40.00%;
    border: 1px solid black;
    background-color: rgb(43, 47, 59);
    /* border: 1px solid tomato; */
    /* overflow: hidden; */

    .in-point {
        position: absolute;
        top: 0;
        left: 0%;
        height: 40%;
        transform: rotateX(180deg);
        opacity: 0.4;
        transition: opacity 0.2s linear;
        transition: height 0.1s linear;
    }
    .out-point {
        position: absolute;
        top: 0;
        left: 100%;
        height: 40%;
        transform: rotateX(180deg);
        opacity: 0.4;
        transition: opacity 0.2s linear;
        transition: height 0.1s linear;
    }
    .active {
        opacity: 1.0;
        height: 60%;
    }
`;

const VideoInOut = ({
    onMouseMoveInOutContainer,
    onChangeMoveType,
    onMouseDownInPoint,
    onMouseDownOutPoint,
    setInPoint,
    setOutPoint,

    selectedPoint,
    inTimePercent,
    outTimePercent
}) => {
    const inPointRef = useRef(null);
    const outPointRef = useRef(null);

    useEffect(() => {
        setInPoint(inPointRef.current);
        setOutPoint(outPointRef.current);
    }, [setInPoint, setOutPoint]);
    
    return (
        <VideoInOutContainer
            onMouseMove={onMouseMoveInOutContainer}
        >
            <img
                ref={inPointRef}
                className={[
                    'in-point',
                    selectedPoint === inPointRef.current && 'active'
                ].join(' ')}
                src={pinButton}
                alt=""
                draggable={false}
                type={Constants.COMPONENT_TYPE.IN_POINT}
                style={{
                    "left": inTimePercent + "%",
                }}
                onMouseDown={onMouseDownInPoint}
                onMouseMove={onChangeMoveType}
            />
            <img
                ref={outPointRef}
                className={[
                    'out-point',
                    selectedPoint === outPointRef.current && 'active'
                ].join(' ')}
                src={pinButton}
                alt=""
                draggable={false}
                type={Constants.COMPONENT_TYPE.OUT_POINT}
                style={{
                    "left": outTimePercent + "%",
                }}
                onMouseDown={onMouseDownOutPoint}
                onMouseMove={onChangeMoveType}
            />
        </VideoInOutContainer>
    );
}

export default VideoInOut;