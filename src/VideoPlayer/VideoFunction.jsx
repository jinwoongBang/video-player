import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

import { Constants } from './utils/Constants';
import { calculateTime } from './utils/CommonUtils';

import playButton from './image/play-white-01.png';
import sectionPlayButton from './image/replay-white-01.png';
import pauseButton from './image/pause-white-01.png';
import volumeButton0 from './image/volume-white-00.png';
import volumeButton1 from './image/volume-white-01.png';
import volumeButton2 from './image/volume-white-02.png';
import volumeButton3 from './image/volume-white-03.png';
import volumeButton4 from './image/volume-white-04.png';
import volumeButton5 from './image/volume-white-05.png';
import fullScreenButton from './image/expand-white-02.png';
import preferenceButton from './image/preference-button.png';


import ProgressBar from './ProgressBar';

const VideoFunctionContainer = styled.div`
    display: flex;
    height: 50%;
    /* border: 1px solid black; */
    background-color: rgb(43, 47, 59);
    padding: 5px;

    .time-container,
    .button-container {
        position: relative;
        top: 0;
        height: 100%;
        /* border: 1px solid tomato; */
        margin-right: 0.5%;
        margin-left: 0.5%;
    }
    .button-container > img {
        width: auto;
        height: 100%;
        vertical-align: top;
        /* border: 1px solid tomato; */
    }
    .time-container {
        width: 40vw;
        text-align: left;
    }
    .time-container > span {
        position: relative;
        top: 20%;
        color: white;
        /* border: 1px solid tomato; */
    }
    .space-container {
        width: 35vw;
        height: 100%;
        border: 1px solid tomato;
    }
    .volume-container {
        box-sizing: border-box;
        height: 100%;
        /* border: 1px solid tomato; */
    }
    .volume-container > img {
        vertical-align: top;
        height: 100%;
    }
    .volume-content {
        height: 100%;
        background-color: tomato;
    }
`;

const VideoFunction = ({
    onPlayFull,
    onPlaySection,
    onClickFullScreen,
    onClickRatePreference,
    onMouseDownInVolume,
    onMouseMoveInVolume,

    isPlayed,
    currentTime,
    duration,
    volume
}) => {

    return (
        <VideoFunctionContainer>
            <div className="button-container">
                {isPlayed
                    ? <img
                        src={pauseButton}
                        alt=""
                        onClick={onPlayFull}
                    />
                    : <img
                        src={playButton}
                        alt=""
                        onClick={onPlayFull}
                    />}
            </div>
            <div className="button-container">
                <img
                    src={sectionPlayButton}
                    alt=""
                    // style={{
                    //     "opacity": isPlayed ? 0.3 : 1.0
                    // }}
                    onClick={onPlaySection}
                />
            </div>
            <div className="time-container">
                <span>{calculateTime(currentTime).substring(0, 8)} / {calculateTime(duration).substring(0, 8)}</span>
            </div>
            <div className="space-container">
                {/* IN : <input type="text"></input>
                OUT : <input type="text"></input>
                <button>다운로드</button>
                <button>리셋</button> */}
            </div>

            <div className="button-container">
                <img
                    src={preferenceButton}
                    alt=""
                    onClick={onClickRatePreference}
                />
            </div>
            <div className="button-container">
                <img
                    src={fullScreenButton}
                    alt=""
                    onClick={onClickFullScreen}
                />
            </div>
            <div className="button-container">
                <div
                    className="volume-container"
                    onMouseDown={onMouseDownInVolume}
                    onMouseMove={onMouseMoveInVolume}
                >
                    {volume > 80
                        ? <img src={volumeButton5} alt="" draggable={false} />
                        : volume > 60
                            ? <img src={volumeButton4} alt="" draggable={false} />
                            : volume > 40
                                ? <img src={volumeButton3} alt="" draggable={false} />
                                : volume > 20
                                    ? <img src={volumeButton2} alt="" draggable={false} />
                                    : volume <= 0
                                        ? <img src={volumeButton0} alt="" draggable={false} />
                                        : <img src={volumeButton1} alt="" draggable={false} />
                    }
                </div>

            </div>
        </VideoFunctionContainer>
    );
}

export default VideoFunction;
