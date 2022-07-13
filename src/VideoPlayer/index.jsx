import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';

import styled from 'styled-components';

import VideoContent from './VideoContent';
import VideoCover from './VideoCover';
import ProgressPrint from './ProgressPrint';
import ProgressBar from './ProgressBar';
import VideoInOut from './VideoInOut';
import VideoFunction from './VideoFunction';

import { calculateTime, calculateWidthToPercent } from './utils/CommonUtils';
import { Constants } from './utils/Constants';


import playButton from '../../public/image/play-button-white-01.png';
import pauseButton from '../../public/image/play-button-white-02.png';

const VideoPlayerContainer = styled.div`
    position: relative;
    padding: 10px;

    -ms-user-select: none; 
    -moz-user-select: none;
    -khtml-user-select: none;
    /* -webkit-user-select: none; */
    user-select: none;
    font-size: 1em;

    @media (min-width: 768px) and (max-width: 991px) {
        font-size: 0.3em;
    }
    @media (min-width: 576px) and (max-width: 767px) {
        font-size: 0.2em;
    }
    @media (min-width: 375px) and (max-width: 575px) {
        font-size: 0.1em;
    }
    @media (max-width: 374px) {
        font-size: 0.1em;
    }

    .border {
        border: 1px solid tomato;
    }
    .radius {
        border-radius: 10px 10px 10px 10px;
    }
    
    .loading-cover {
        position: absolute;
        z-index: 1;
        background-color: rgb(255, 255, 255, 0.5);
        /* width: 100%; */
        height: 100%;
        border: 1px solid tomato;
    }

    .video-top-container {
        position: relative;
    }

    .video-bottom-container {
        position: relative;
        height: 5vw;
        /* border: 1px solid tomato; */
        /* background-color: black; */
    }
    .in-out-input-container {
        position: relative;
        height: 2.5vw;
        border: 1px solid black;
        background-color: rgb(43, 47, 59);
        color: rgb(255, 255, 255);
        text-align: center;
    }
`;

/**
 * 
 * @param { src }   영상 소스
 * @param { skim }  스킴 이미지
 */
const VideoPlayer = ({ src, skim }) => {
    const [hoverPointX, setHoverPointX] = useState(0);
    const [hoverPointView, setHoverPointView] = useState(false);
    const [playSpeedRateFormView, setPlaySpeedRateFormView] = useState(false);

    /**
     * [1] Web 상태
     */
    const [videoPlayer, setVideoPlayer] = useState(null);
    const [videoReadyState, setVideoReadyState] = useState(false);
    const [isPlayed, setIsPlayed] = useState(false);
    // "full" : 전체 재생, "section" : 구간 재생
    const [videoPlayMode, setVideoPlayMode] = useState(Constants.PLAY_TYPE.FULL);
    const [draggableProgress, setDraggableProgress] = useState(false);
    const [draggableInOut, setDraggableInOut] = useState(false);
    const [draggableVolume, setDraggableVolume] = useState(false);

    const [selectedPoint, setSelectedPoint] = useState(null);
    const [inPoint, setInPoint] = useState(null);
    const [outPoint, setOutPoint] = useState(null);
    const [currentPoint, setCurrentPoint] = useState(null);


    // "center" : 타임라인을 클릭하여 현재 시간을 변경 할 경우
    // "left"   : 시간 표시 막대를 왼쪽으로 움직이는 중
    // "right"   : 시간 표시 막대의 오른쪽으로 움직이는 중
    const [moveType, setMoveType] = useState(Constants.MOVE_TYPE.CENTER);

    const [videoCurrentTime, setVideoCurrentTime] = useState(0.00);
    const [videoInTime, setVideoInTime] = useState(0.00);
    const [videoOutTime, setVideoOutTime] = useState(0.00);
    const [videoDuration, setVideoDuration] = useState(0.00);
    const [videoVolume, setVideoVolume] = useState(0.00);
    const [videoPlaybackRate, setVideoPlaybackRate] = useState(1.0);

    useEffect(() => {
        console.log("useEffect()");
    }, []);

    /**
     * [0] 비디오 메타데이터 최초 로드 및 상태 초기화(init)
     */
    const loadedMetadata = useCallback((player) => {
        const { duration, readyState, volume } = player;
        setVideoPlayer(player);
        setVideoDuration(duration);
        setVideoOutTime(duration);
        setVideoVolume(volume);
        setSelectedPoint(currentPoint);
    }, [currentPoint]);

    /**
     * [1] 비디오 재생 관련 Functions
     */

    /**
     * [1-1] 전체 재생 (full play)
     */
    const playFull = useCallback((event) => {
        const { paused } = videoPlayer;
        paused ? videoPlayer.play() : videoPlayer.pause();
        setIsPlayed(!videoPlayer.paused);
        setVideoPlayMode(Constants.PLAY_TYPE.FULL);
    }, [videoPlayer]);

    /**
     * [1-2] 구간 재생 (section play)
     */
    const playSection = useCallback(() => {
        const { paused } = videoPlayer;
        if (paused) {
            videoPlayer.currentTime = videoInTime;
            videoPlayer.play();
            setIsPlayed(true);
        } else {
            videoPlayer.pause();
            setIsPlayed(false);
        }
        setVideoPlayMode(Constants.PLAY_TYPE.SECTION);
    }, [videoInTime, videoPlayer]);

    /**
     * [1-3] 현재 재생 중인 시간 업데이트
     */
    const timeUpdate = useCallback((player) => {
        setVideoCurrentTime(player.currentTime);
        // 구간 재생일 경우 Out Time 에서 일시정지
        if (videoPlayMode === Constants.PLAY_TYPE.SECTION) {
            if (player.currentTime > videoOutTime) {
                player.pause();
                setIsPlayed(false);
            }
        }

    }, [videoOutTime, videoPlayMode]);

    /**
     * [1-4] 비디오 진행률 계산
     */
    const currentTimePercent = useMemo(() => {
        return videoCurrentTime / videoDuration * 100;
    }, [videoCurrentTime, videoDuration]);

    const inTimePercent = useMemo(() => {
        return videoInTime / videoDuration * 100;
    }, [videoInTime, videoDuration]);

    const outTimePercent = useMemo(() => {
        return videoOutTime / videoDuration * 100;
    }, [videoOutTime, videoDuration]);

    const hoverPointTime = useMemo(() => {
        return videoDuration * hoverPointX / 100;
    }, [hoverPointX, videoDuration]);

    const thumbnailMaxX = useMemo(() => {
        // console.log({videoPlayer: videoPlayer.offsetWidth});
    }, [videoPlayer]);

    /**
     * [2] 동작 이벤트
     */

    /**
     * [Mouse Down] 현재 재생 Bar 클릭
     */
    const mouseDownInProgressBar = useCallback(({ nativeEvent, target, currentTarget }) => {
        const { offsetX } = nativeEvent;
        const timelineWidth = currentTarget.offsetWidth;
        const percent = calculateWidthToPercent(
            timelineWidth, offsetX, 1, Constants.MOVE_TYPE.CENTER
        );
        setVideoCurrentTime(percent * videoDuration);
        setDraggableProgress(true);
        setSelectedPoint(currentPoint);
        videoPlayer.currentTime = percent * videoDuration;

    }, [currentPoint, videoDuration, videoPlayer]);

    /**
      * [Mouse Down] In Point 클릭
      */
    const mouseDownInPoint = useCallback(({ screenX, clientX, pageX, target, currentTarget, nativeEvent }) => {
        setHoverPointX(inTimePercent);
        setHoverPointView(true);
        setDraggableInOut(true);
        setSelectedPoint(currentTarget);
    }, [inTimePercent]);

    /**
      * [Mouse Down] Out Point 클릭
      */
    const mouseDownOutPoint = useCallback(({ screenX, clientX, pageX, target, currentTarget }) => {
        setHoverPointX(outTimePercent);
        setHoverPointView(true);
        setDraggableInOut(true);
        setSelectedPoint(currentTarget);
    }, [outTimePercent]);

    /**
     * [Mouse Up] 타임라인 '안' 에서 Mouse Up
     */
    const mouseUpInComponent = useCallback(() => {
        setHoverPointView(false);
        setDraggableProgress(false);
        setDraggableInOut(false);
        setDraggableVolume(false);
        setMoveType(Constants.MOVE_TYPE.CENTER);
    }, []);

    /**
     * [Mouse Up] 타임라인 '밖' 에서 Mouse Up
     */
    const mouseLeaveComponent = useCallback(() => {
        if (draggableInOut || draggableProgress) {
            window.addEventListener("mouseup", (event) => {
                setDraggableProgress(false);
                setDraggableInOut(false);
                setDraggableVolume(false);
                setHoverPointView(false);
                setMoveType(Constants.MOVE_TYPE.CENTER);
            })
        }
    }, [draggableInOut, draggableProgress]);

    /**
     * [Mouse Move] 진행 Bar 안에서 마우스 움직임
     */
    const mouseMoveInProgressBar = useCallback(({ nativeEvent, target, currentTarget }) => {
        const progressWidth = currentTarget.offsetWidth;
        const percent = calculateWidthToPercent(
            progressWidth, nativeEvent.offsetX, 1, moveType
        );
        setHoverPointX(percent * 100);

        if (draggableProgress) {
            setVideoCurrentTime(percent * videoDuration);
            videoPlayer.currentTime = percent * videoDuration;
        }
    }, [draggableProgress, moveType, videoDuration, videoPlayer]);

    /**
     * [Mouse Move] 진행 Bar 안에서 마우스 움직임
     */
    const changeMoveType = useCallback(({ nativeEvent }) => {
        if (nativeEvent.movementX > 0) {
            setMoveType(Constants.MOVE_TYPE.RIGHT);
        }
        if (nativeEvent.movementX < 0) {
            setMoveType(Constants.MOVE_TYPE.LEFT);
        }
    }, []);

    /**
     * [Mouse Move] In & Out 마우스 조정
     */
    const mouseMoveInOutContainer = useCallback(({ target, currentTarget, nativeEvent }) => {
        if ((target !== inPoint) && (target !== outPoint)) {
            if (draggableInOut) {
                const containerWidth = currentTarget.offsetWidth;
                const pointWidth = selectedPoint.offsetWidth;
                const pointType = selectedPoint.attributes.type.value;
                const x = nativeEvent.offsetX;
                switch (pointType) {
                    case Constants.COMPONENT_TYPE.IN_POINT: {
                        const percent = calculateWidthToPercent(containerWidth, x, pointWidth, moveType);
                        let time = videoDuration * percent >= videoOutTime ? videoOutTime : videoDuration * percent;
                        setVideoInTime(time);
                        videoPlayer.currentTime = time;
                        setHoverPointX(percent * 100);
                        break;
                    }
                    case Constants.COMPONENT_TYPE.OUT_POINT: {
                        const percent = calculateWidthToPercent(containerWidth, x, pointWidth, moveType);
                        let time = videoDuration * percent <= videoInTime ? videoInTime : videoDuration * percent;
                        setVideoOutTime(time);
                        videoPlayer.currentTime = time;
                        setHoverPointX(percent * 100);
                        break;
                    }
                    default:
                        break;
                }
            }
        }
    }, [draggableInOut, inPoint, moveType, outPoint, selectedPoint, videoDuration, videoInTime, videoOutTime, videoPlayer]);

    /**
     * [Mouse Enter] 진행 Bar 에 마우스 들어옴
     */
    const mouseEnterInProgressBar = useCallback(() => {
        setHoverPointView(true);
    }, []);

    /**
     * [Mouse Leave] 진행 Bar 에서 마우스 나감
     */
    const mouseLeaveInProgressBar = useCallback(() => {
        setHoverPointView(false);
    }, []);

    /**
     * [Click] 전체 화면 
     */
    const clickFullScreen = useCallback(() => {
        // console.log({ videoPlayer: videoPlayer });
        videoPlayer.webkitEnterFullScreen();
    }, [videoPlayer]);
    /**
     * [Click] 배속 설정 Form 토글
     */
    const clickRatePreference = useCallback(() => {
        setPlaySpeedRateFormView(!playSpeedRateFormView);
    }, [playSpeedRateFormView]);

    /**
     * [Change] 배속 변경
     */
    const changePlayBackRate = useCallback((speedRate) => {
        videoPlayer.playbackRate = parseInt(speedRate);
        setVideoPlaybackRate(parseInt(speedRate));
    }, [videoPlayer]);

    const mouseDownInVolume = useCallback((event) => {
        const { nativeEvent, target, currentTarget } = event;
        const { offsetX } = nativeEvent;
        const timelineWidth = currentTarget.offsetWidth;
        const percent = calculateWidthToPercent(timelineWidth, offsetX, 1, Constants.MOVE_TYPE.CENTER);
        setDraggableVolume(true);
        setVideoVolume(percent * 100);
        console.log({ percent: percent });
        videoPlayer.volume = percent;
    }, [videoPlayer]);

    const mouseMoveInVolume = useCallback((event) => {
        if (draggableVolume) {
            const { nativeEvent, target, currentTarget } = event;
            const { offsetX } = nativeEvent;
            const timelineWidth = currentTarget.offsetWidth;
            const percent = calculateWidthToPercent(timelineWidth, offsetX, 1, Constants.MOVE_TYPE.CENTER);
            setVideoVolume(percent * 100);
            console.log({ percent: percent });
            videoPlayer.volume = percent;
        }
    }, [draggableVolume, videoPlayer]);

    /**
     * [Context Menu] 우클릭 방지
     */
    const contextMenuInComponent = useCallback((event) => {
        event.preventDefault();
    }, []);

    /**
     *  [4] 단축키
     *  - shiftKey + C : 현재 시간 Bar 선택
     *  - shiftKey + I : In 포인트 Bar 선택
     *  - shiftKey + O : Out 포인트 Bar 선택
     *  - space : 재생
     *  - 방향키 Right, Left : 영상 시간 변경
     */
    const keyDown = useCallback((event) => {
        const { keyCode, ctrlKey, altKey, shiftKey, target, currentTarget } = event;
        console.log({ keyCode: keyCode });

        let type = null;
        if (selectedPoint === null) {
            type = "current";
        } else {
            type = selectedPoint.attributes.type.value;
        }
        // console.log({ type: type });

        const onKeyPressLeft = (detailTime) => {
            if (type === Constants.COMPONENT_TYPE.PROGRESS) {
                videoPlayer.currentTime -= detailTime;
            }
            if (type === Constants.COMPONENT_TYPE.IN_POINT) {
                let time = videoInTime - detailTime;
                if (time <= 0) {
                    time = 0;
                }
                videoPlayer.currentTime = time;
                setVideoInTime(time);
            }
            if (type === Constants.COMPONENT_TYPE.OUT_POINT) {
                let time = videoOutTime - detailTime;
                if (time <= videoInTime) {
                    time = videoInTime;
                }
                videoPlayer.currentTime = time;
                setVideoOutTime(time);
            }
        }
        const onKeyPressRight = (detailTime) => {
            if (type === Constants.COMPONENT_TYPE.PROGRESS) {
                videoPlayer.currentTime += detailTime;
            }
            if (type === Constants.COMPONENT_TYPE.IN_POINT) {
                let time = videoInTime + detailTime;
                if (time >= videoOutTime) {
                    time = videoOutTime;
                }
                videoPlayer.currentTime = time;
                setVideoInTime(time);
            }
            if (type === Constants.COMPONENT_TYPE.OUT_POINT) {
                let time = videoOutTime + detailTime;
                if (time >= videoDuration) {
                    time = videoDuration;
                }
                videoPlayer.currentTime = time;
                setVideoOutTime(time);
            }
        }

        // ['shift']
        if (shiftKey) {
            switch (keyCode) {
                // [왼쪽 방향키]
                case 37: {
                    onKeyPressLeft(Constants.DETAIL_TIME.SUB);
                    break;
                }
                // [오른쪽 방향키]
                case 39: {
                    onKeyPressRight(Constants.DETAIL_TIME.SUB);
                    break;
                }
                // ['d'] 구간 초기화
                case 68: {
                    setVideoInTime(0);
                    setVideoOutTime(videoDuration);
                    break;
                }
                // ['i'] In Time Bar 선택
                case 73: {
                    setSelectedPoint(inPoint);
                    videoPlayer.currentTime = videoInTime;
                    break;
                }

                // ['o'] Out Time Bar 선택
                case 79: {
                    setSelectedPoint(outPoint);
                    videoPlayer.currentTime = videoOutTime;
                    break;
                }

                default:
                    break;
            }
        } else {
            switch (keyCode) {
                // [스페이스 바]
                case 32: {
                    const { paused } = videoPlayer;
                    setVideoPlayMode(Constants.PLAY_TYPE.FULL);
                    if (paused) {
                        setIsPlayed(paused);
                        videoPlayer.play();
                    } else {
                        setIsPlayed(paused);
                        videoPlayer.pause();
                    }
                    break;
                }
                // [왼쪽 방향키]
                case 37: {
                    onKeyPressLeft(Constants.DETAIL_TIME.MAIN);
                    break;
                }
                // [오른쪽 방향키]
                case 39: {
                    onKeyPressRight(Constants.DETAIL_TIME.MAIN);
                    break;
                }
                default:
                    break;
            }
        }


    }, [selectedPoint, inPoint, videoPlayer, videoInTime, outPoint, videoOutTime, videoDuration]);

    /**
     * [모바일 State]
     *  - 추후 작업 예정
     */
    const [touchStartX, setTouchStartX] = useState(0);
    const [touchStartPercent, setTouchStartPercnet] = useState(0);

    /**
     * [모바일 Event]
     *  - 추후 작업 예정
     */
    const onTouchStart = useCallback((event) => {
    }, []);
    const onTouchMove = useCallback((event) => {
    }, []);
    const onTouchEnd = useCallback((event) => {
    }, []);

    return (
        <VideoPlayerContainer
            tabIndex="0"
            onContextMenu={contextMenuInComponent}
            onMouseUp={mouseUpInComponent}
            onMouseLeave={mouseLeaveComponent}
            onKeyDown={keyDown}
        >
            {/* <div className="loading-cover">Loading...</div> */}
            {/* {videoReadyState ? null : <div className="loading-cover">Loading...</div>} */}
            <div className="video-top-container">
                <VideoContent
                    src={src}
                    percent={currentTimePercent}

                    onTimeUpdate={timeUpdate}
                    onLoadedMetadata={loadedMetadata}
                    onChangeReadyState={setVideoReadyState}
                    setVideoPlayer={setVideoPlayer}
                />
                <VideoCover
                    isPlayed={isPlayed}
                    readyState={videoReadyState}
                    hoverPointView={hoverPointView}
                    hoverPointX={hoverPointX}
                    hoverPointTime={hoverPointTime}
                    playSpeedRateFormView={playSpeedRateFormView}
                    playbackRate={videoPlaybackRate}
                    button={{
                        play: playButton,
                        pause: pauseButton
                    }}
                    onPlayFull={playFull}
                    onChangePlayBackRate={changePlayBackRate}
                />
            </div>
            <div className="video-bottom-container">
                <ProgressBar
                    onMouseDown={mouseDownInProgressBar}
                    onMouseMoveInProgressBar={mouseMoveInProgressBar}
                    onChangeMoveType={changeMoveType}
                    onMouseEnterInProgressBar={mouseEnterInProgressBar}
                    onMouseLeaveInProgressBar={mouseLeaveInProgressBar}
                    setCurrentPoint={setCurrentPoint}
                    hoverPointX={hoverPointX}
                    hoverPointView={hoverPointView}
                    percent={currentTimePercent}
                    color="rgb(91, 83, 255)"
                />
                <VideoInOut
                    onMouseMoveInOutContainer={mouseMoveInOutContainer}
                    onChangeMoveType={changeMoveType}
                    onMouseDownInPoint={mouseDownInPoint}
                    onMouseDownOutPoint={mouseDownOutPoint}
                    setInPoint={setInPoint}
                    setOutPoint={setOutPoint}
                    selectedPoint={selectedPoint}
                    inTimePercent={inTimePercent}
                    outTimePercent={outTimePercent}
                />
                <VideoFunction
                    onPlayFull={playFull}
                    onPlaySection={playSection}
                    onClickFullScreen={clickFullScreen}
                    onClickRatePreference={clickRatePreference}
                    onMouseDownInVolume={mouseDownInVolume}
                    onMouseMoveInVolume={mouseMoveInVolume}
                    isPlayed={isPlayed}
                    currentTime={videoCurrentTime}
                    duration={videoDuration}
                    volume={videoVolume}
                />
            </div>
            {/* <div
                className="in-out-input-container"
            >
                IN : <input type="text"></input>
                OUT : <input type="text"></input>
                <button>다운로드</button>
                <button>리셋</button>
            </div> */}
            <ProgressPrint
                currentTime={videoCurrentTime}
                currentTimePercent={currentTimePercent}
                inTime={videoInTime}
                inTimePercent={inTimePercent}
                outTime={videoOutTime}
                outTimePercent={outTimePercent}
                selectedBar={selectedPoint}
                calculateTime={calculateTime}
            />
        </ VideoPlayerContainer>
    )
}

export default VideoPlayer;