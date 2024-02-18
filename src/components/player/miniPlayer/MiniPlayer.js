import React, { useState } from "react";
import {
  BsFillSkipEndFill,
  BsFillSkipStartFill,
  BsPauseCircleFill,
  BsPlayCircleFill,
} from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { addSongInfo } from "../../../reduxtool/slice/currentSongSlice";
import "./MiniPlayer.css";
import "../playerControls/PlayerControls.css";

const MiniPlayer = ({
  songsInfo,
  progress,
  isPlaying,
  setIsPlaying,
  handleNext,
  handlePrev,
  audioLoading,
  audioRef,
  mapVideoId,
  currentIndex,
}) => {
  const currentSong = useSelector(
    (state) => state.currentSongSlice.currentSongInfo
  );
  const { id } = currentSong;
  const dispatch = useDispatch();

  const [playerClose, setPlayerClose] = useState(false);

  const handleClosePlayer = () => {
    setPlayerClose(true);
    dispatch(addSongInfo({ onMiniPlayer: false }));
    localStorage.removeItem("currentSongInfo");
  };

  console.log(currentSong);

  return (
    <div
      className="mini-player-section"
      style={{ display: (playerClose || !id) && "none" }}
    >
      <div className="mini-player-container">
        <div
          className="mini-player-song-info-wrapper cur-pointer"
          onClick={() =>
            dispatch(addSongInfo({ ...currentSong, onMiniPlayer: false }))
          }
        >
          <div className="mini-player-image-wrapper">
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              className="mini-player-image "
              alt="mini-player-poster"
            />
          </div>
          <div className="mini-player-song-title-channel-wrapper absolute-center ">
            <div className="mini-player-song-title">
              {songsInfo[0]?.snippet?.title}
            </div>
            <div className="mini-player-song-channel">
              • {songsInfo[0]?.snippet?.channelTitle}
            </div>
          </div>
        </div>

        <div className="audio-controls-wrapper absolute-center">
          <div
            className="audio-prev-wrapper next-prev-icons cur-pointer"
            style={{ opacity: currentIndex <= 0 && "0.5" }}
            onClick={handlePrev}
          >
            <BsFillSkipStartFill style={{ width: "100%", height: "100%" }} />
          </div>

          <div className="audio-play-pause-wrapper">
            <div
              className="audio-play-pause  cur-pointer"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {(!isPlaying || progress === 100) && audioRef.current?.paused ? (
                <BsPlayCircleFill
                  style={{
                    width: "100%",
                    height: "100%",
                    opacity: audioLoading && "0.8",
                  }}
                />
              ) : (
                <BsPauseCircleFill style={{ width: "100%", height: "100%" }} />
              )}
            </div>

            {audioLoading || !audioRef.current?.duration ? (
              <div className="loading-spin">
                <svg style={{ width: "100%", height: "100%" }}>
                  <circle
                    cx="35"
                    cy="35"
                    r="30"
                    fill="transparent"
                    className="svg-circle"
                  ></circle>
                </svg>
              </div>
            ) : null}
          </div>

          <div
            className="audio-next-wrapper next-prev-icons "
            style={{ opacity: currentIndex >= mapVideoId.length - 1 && "0.5" }}
            onClick={handleNext}
          >
            <BsFillSkipEndFill style={{ width: "100%", height: "100%" }} />
          </div>
        </div>

        {/* <div className="player-maximize-wrapper" onClick={() => dispatch(addSongInfo({ ...currentSong, onMiniPlayer: false }))}>
          <BsChevronUp style={{ width: '100%', height: '100%' }} />
        </div> */}
        <div
          className="player-close-wrapper  cur-pointer"
          onClick={handleClosePlayer}
        >
          <RxCross2 style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
