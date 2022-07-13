import React, { useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';

import ProgressBar from './ProgressBar';

const VideoContentContainer = styled.div`
    position: relative;
    width: 100%;

    video {
        width: 100%;
        height: auto;
        display: block;
    }
`;

const VideoContent = ({
    src,
    onTimeUpdate,
    onLoadedMetadata,
    onChangeReadyState,
    setVideoPlayer
}) => {

    const videoRef = useRef(null);

    // useEffect(() => {
    //     const video = videoRef.current;
    //     console.log({video: video});
    //     console.log({video: video.duration});
    //     setVideoPlayer(video);
    // }, [setVideoPlayer]);

    const onTimeUpdateVideo = useCallback(() => {
        const player = videoRef.current;
        onTimeUpdate(player);
    }, [onTimeUpdate]);

    const onLoadedVideoMetadata = useCallback(() => {
        const player = videoRef.current;
        onLoadedMetadata(player);
        // console.log("onLoadedVideoMetadata : ", player.duration);
    }, [onLoadedMetadata]);

    /**
     * [Ready state]
     *  0 : 미디어 리소스에 대한 정보가 없습니다.
     *  1 : 메타 데이터 속성이 초기화 된 충분한 미디어 리소스가 검색되었습니다. 추구하면 더 이상 예외가 발생하지 않습니다.
     *  2 : 현재 재생 위치에 대한 데이터를 사용할 수 있지만 실제로 둘 이상의 프레임을 재생하기에는 충분하지 않습니다.
     *  3 : 현재 재생 위치 및 미래에 대한 약간의 시간 동안의 데이터가 이용 가능하다 (예를 들어, 적어도 2 개의 비디오 프레임).
     *  4 : 미디어를 중단없이 끝까지 재생할 수있을 정도로 충분한 데이터가 있으며 다운로드 속도가 충분히 높습니다.
     */
    const onCanPlay = useCallback(() => {
        const player = videoRef.current;
        if(player.readyState !== 0) {
            onChangeReadyState(true);
        } else {
            onChangeReadyState(false);
        }
    }, [onChangeReadyState]);

    return (
        <VideoContentContainer>
            <video
                ref={videoRef}
                controls={false}
                preload="auto"
                onTimeUpdate={onTimeUpdateVideo}
                onLoadedMetadata={onLoadedVideoMetadata}
                onLoadStart={() => {
                    const player = videoRef.current;
                    // console.log("onLoadStart : ", player.duration);
                }}
                onCanPlay={onCanPlay}
                onCanPlayThrough={() => {
                    const player = videoRef.current;
                    // console.log("onCanPlayThrough : ", player.duration);
                }}
                onSuspend={() => {
                    const player = videoRef.current;
                    // console.log("onSuspend : ", player.duration);
                }}
                onLoadedData={() => {
                    const player = videoRef.current;
                    // console.log("onLoadedData : ", player.duration);
                }}
                onWaiting={() => {
                    const player = videoRef.current;
                    // console.log("onWaiting : ", player.duration);
                }}
                onSeeking={() => {
                    const player = videoRef.current;
                    // console.log("onSeeking : ", player.duration);
                }}
                onSeeked={() => {
                    const player = videoRef.current;
                    // console.log("onSeeked : ", player.duration);
                }}
            >
                <source src={src}></source>
            </video>
        </VideoContentContainer>
    );
}

export default VideoContent;