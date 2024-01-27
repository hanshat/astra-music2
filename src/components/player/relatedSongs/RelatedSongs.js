import React, { useEffect, useRef, useState } from "react";
import { BsPlayCircleFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { addSongInfo } from "../../../reduxtool/slice/currentSongSlice";
import "./RelatedSongs.css";
import RelatedSongsSkeleton from "./RelatedSongsSkeleton";
import { getRelatedSongs } from "../../../api/getRelatedSongs";

const RelatedSongs = ({ videoId, songsList, setSongsList }) => {
  const dispatch = useDispatch();
  const currentSong = useSelector(
    (state) => state.currentSongSlice.currentSongInfo
  );
  const { id } = currentSong;
  const [isUpClick, setIsUpClick] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const getRelated = async () => {
    try {
      setErrorMessage(null);
      const response = await getRelatedSongs({ id });
      const data = await response.json();
      setSongsList(data.result);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRelated();
    // eslint-disable-next-line
  }, []);

  const handleRedirect = (videoId) => {
    dispatch(addSongInfo({ ...currentSong, id: videoId }));
  };

  const upNextRef = useRef();

  window.onclick = (e) => {
    if (e.target !== upNextRef.current) {
      setIsUpClick(false);
    }
  };

  return (
    <div className="related-songs-section">
      <h3 className="relate-songs-heading">Up Next Songs</h3>
      <div
        className="relate-songs-heading mobile-next cur-pointer"
        ref={upNextRef}
        onClick={() => setIsUpClick(!isUpClick)}
      >
        Up Next Songs
      </div>
      <div
        className={`related-songs-container ${
          isUpClick ? "related-songs-mobile" : ""
        }`}
      >
        {isLoading ? (
          <RelatedSongsSkeleton amount={6} />
        ) : (
          <>
            {songsList?.length ? (
              songsList?.map((song) => (
                <div
                  className="related-songs-info-wrapper cur-pointer"
                  key={song?.index}
                  onClick={() => handleRedirect(song?.videoId)}
                >
                  <div className="related-songs-image-wrapper">
                    <img
                      src={song?.thumbnails}
                      className="related-songs-image"
                      alt={song?.title}
                    />
                    {id === song?.videoId && (
                      <div className="playing-status-wrapper">
                        <BsPlayCircleFill
                          style={{ width: "100%", height: "100%" }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="related-songs-title-channel-wrapper">
                    <p className="related-songs-title-wrapper">{song?.title}</p>
                    <p className="related-songs-channel-wrapper">
                      • {song?.artistInfo.artist[0]?.text}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="related-songs-error-wrapper">
                <p className="sorry-emoji">😢</p>
                <p>Sorry! Not able to fetch related songs</p>
                {errorMessage ? (
                  <p className="error-message">Error: {errorMessage}</p>
                ) : null}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RelatedSongs;
