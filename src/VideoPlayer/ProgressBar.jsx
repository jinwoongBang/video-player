import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

import { Constants } from './utils/Constants';

const ProgressBarContainer = styled.div`
    position: relative;
    top: 0%;
    left: 0%;
    width: 100%;
    height: 10%;
    box-sizing: border-box;
    background-color: rgb(0, 0, 0, 0.2);
    /* border: 1px solid tomato; */

    .progress-bar-cover {
        position: absolute;
        z-index: 3;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        /* background-color: rgb(255, 255, 255, 0.5); */
    }

    .progress-bar {
        position: relative;
        z-index: 1;
        top: 0;
        width: 0%;
        height: 100%;
        opacity: 1.0;
    }
    .hover-point {
        position: absolute;
        z-index: 2;
        top: 0;
        width: 0.1%;
        height: 100%;
        background-color: rgb(255, 255, 255, 1.0);
    }
`;

const ProgressBar = ({
    percent,
    color,
    hoverPointX,
    hoverPointView,
    onMouseDown,
    onMouseMoveInProgressBar,
    onMouseEnterInProgressBar,
    onMouseLeaveInProgressBar,
    onChangeMoveType,
    setCurrentPoint
}) => {
    const hoverPointRef = useRef(null);
    const currentPointRef = useRef(null);

    useEffect(() => {
        setCurrentPoint(currentPointRef.current);
    }, [setCurrentPoint]);

    return (
        <ProgressBarContainer
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnterInProgressBar}
            onMouseLeave={onMouseLeaveInProgressBar}
            onMouseMove={onMouseMoveInProgressBar}
            style={{
                "backgroundColor": "rgb(54, 55, 56)"
            }}
        >
            <div
                className="progress-bar-cover"
            />
            <div
                ref={currentPointRef}
                className="progress-bar"
                type={Constants.COMPONENT_TYPE.PROGRESS}
                style={{
                    "width": percent + "%",
                    "backgroundColor": color
                }}
            />
            <div
                ref={hoverPointRef}
                className="hover-point"
                style={{
                    "left": hoverPointX + "%",
                    "backgroundColor": "rgb(255, 255, 255, " + (hoverPointView ? 1.0 : 0.0) + ")"
                }}
                onMouseMove={onChangeMoveType}
            />
        </ProgressBarContainer>
    )
}

export default ProgressBar;