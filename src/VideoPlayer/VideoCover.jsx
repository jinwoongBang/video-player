import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';

import ProgressBar from './ProgressBar';
import { calculateTime, calculateWidthToPercent } from './utils/CommonUtils';

import thumbnail from './image/thumbnail_example.png';

const VideoCoverContainer = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    /* border: 1px solid tomato; */
    .deactive-opacity {
        opacity: 0.0;
    }
    .active-opacity {
        opacity: 1.0 ;
    }
    .d-none {
        display: none;
    }
    .deactive-height {
        height: 0;
    }


    .loading-cover {
        position: absolute;
        z-index: 2;
        width: 100%;
        height: 100%;
        background-color: rgb(0, 0, 0, 0.8);
        text-align: center;
        color: white;
    }
    
    .video-play-cover {
        position: relative;
        z-index: 1;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .play-button-container {
        position: relative;
        top: 40%;
        left: 0%;
        width: 100%;
        transition: opacity .5s linear;
        opacity: 1.0;
    }
    .play-button-container > img {
        position: relative;
        left: 47%;
        width: 5vw;
        height: 5vw;
    }
    
    .hover-point-container {
        position: absolute;
        bottom: 2%;

        width: 8vw;
        height: 4.5vw;

        overflow: hidden;
        border-radius: 7px 7px 7px 7px;
        box-shadow: 0 0 5px 0 black;
        transition: opacity .2s linear;
    }
    .hover-point-container > img {
        position: relative;
        width: 100%;
    }
    .hover-point-time {
        position: absolute;
        left: 10%;

        bottom: 2%;
        width: 80%;
        color: white;
        text-align: center;
        background-color: rgb(0, 0, 0, 0.2);
    }
    .preference-container {
        position: absolute;
        z-index: 10;
        bottom: -4%;
        right: 8%;
        width: 6vw;
        padding: 0.5%;

        background-color: rgb(43, 47, 59, 0.7);
        border-radius: 7px 7px 7px 7px;
        box-shadow: 0 0 5px 0 black;
        transition: height 2.0s linear;
        color: rgb(255, 255, 255, 0.5);
    }
    thead {
        border-bottom: 1px solid white;
    }
    .preference-list {
        /* border: 1px solid tomato; */
    }
    .preference-list > table {
        /* border: 1px solid tomato; */
        margin: auto;
        text-align: left;
        font-size: 1.0em;
    }
    .preference-list > table > tbody > tr > td:hover{
        color: rgb(255, 255, 255, 1.0);
    }

`;

const VideoCover = ({
    isPlayed,
    button,
    readyState,
    hoverPointView,
    hoverPointX,
    hoverPointTime,
    playSpeedRateFormView,
    playbackRate,

    onPlayFull,
    onChangePlayBackRate,
}) => {

    // useEffect(() => {
    //     console.log("hoverPoint view : ", hoverPointView);
    // }, [hoverPointView]);

    const playInTopCover = useCallback((event) => {
        onPlayFull(event);
    }, [onPlayFull]);

    const changePlayBackRate = useCallback((event) => {
        onChangePlayBackRate(event.currentTarget.attributes.rate.value);
    }, [onChangePlayBackRate]);

    return (
        <VideoCoverContainer>
            <div
                className="video-play-cover"
                onClick={playInTopCover}
            >
                <div
                    className={[
                        'play-button-container',
                        isPlayed && 'deactive-opacity'
                    ].join(' ')}
                >
                    {isPlayed
                        ? <img src={button.pause} alt="" />
                        : <img src={button.play} alt="" />
                    }
                </div>
            </div>
            <div
                className={[
                    'hover-point-container',
                    hoverPointView ? 'active-opacity' : 'deactive-opacity'
                ].join(' ')}
                style={{
                    "left": hoverPointX + "%"
                }}
            >
                <img src={thumbnail} alt=""></img>
                <div className="hover-point-time">
                    <span>{calculateTime(hoverPointTime).substring(0, 8)}</span>
                </div>
            </div>
            <div
                className={[
                    'preference-container',
                    !playSpeedRateFormView && 'd-none'
                ].join(' ')}
            >
                <div className="preference-list">
                    <table>
                        <thead>
                            <tr>
                                <th>Playback Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 1.25, 1.4, 1.5, 1.75].map((element, index) => {
                                return (
                                    <tr key={element}>
                                        <td
                                            onClick={changePlayBackRate}
                                            rate={element}
                                            style={{"color": playbackRate === element && 'rgb(255, 255, 255, 1.0)'}}
                                        >
                                            {element} x
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </VideoCoverContainer>
    )
}

export default VideoCover;