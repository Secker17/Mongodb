import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import ReactPlayer from 'react-player';
import { FaPlay, FaPause, FaExpand } from 'react-icons/fa';

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 1050px;
  background: #1a1a1a;
  color: white;
  padding: 20px;
`;

const MainContent = styled.div`
  flex-grow: 1;
  background: #f0f0f0;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;
`;

const CourseCard = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Icon = styled.div`
  width: 24px;
  height: 24px;
  color: #333;
  margin: 0 5px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`;

const Home = () => {
  const [currentVideo, setCurrentVideo] = useState('video1.mp4');
  const [playingStatus, setPlayingStatus] = useState({});
  const videoRefs = useRef({});

  const handlePlayPause = (video) => {
    setPlayingStatus(prev => ({
      ...prev,
      [video]: !prev[video]
    }));
  };

  const handleFullScreen = (video) => {
    const player = videoRefs.current[video].wrapper;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      player.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    }
  };

  const videoTitles = {
    'video1.mp4': 'Sett opp VMware',
    'video2.mp4': 'Sett opp Atlas og Compass',
    'video3.mp4': 'Sett opp din mongoDB server selv'
  };

  return (
    <Container>
      <Sidebar>
        <h1>SECKER</h1>
        <p>Kommandoer</p>
        <p>YouTube Kanal</p>
      </Sidebar>
      <MainContent>
        <Header>
          <h2>Kurs Bibliotek</h2>
          <input type="text" placeholder="Finn video" />
        </Header>
        <CourseGrid>
          {Object.keys(videoTitles).map(video => (
            <CourseCard key={video} onClick={() => setCurrentVideo(video)}>
              <h3>{videoTitles[video]}</h3>
              <ReactPlayer
                ref={ref => videoRefs.current[video] = ref} // Use a ref for each video
                url={require(`../videoer/${video}`)}
                width="100%"
                height="auto"
                controls
                playing={playingStatus[video] || false}
              />
              <Controls>
                <Icon onClick={() => handlePlayPause(video)}>
                  {playingStatus[video] ? <FaPause /> : <FaPlay />}
                </Icon>
                <Icon onClick={() => handleFullScreen(video)}>
                  <FaExpand />
                </Icon>
              </Controls>
            </CourseCard>
          ))}
        </CourseGrid>
      </MainContent>
    </Container>
  );
};

export default Home;