import React, { useState, useRef, useEffect } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import ReactPlayer from 'react-player';
import { FaPlay, FaPause, FaExpand, FaStar, FaMoon, FaSun } from 'react-icons/fa';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
  }
`;

const lightTheme = {
  body: '#f0f0f0',
  text: '#000',
  card: '#fff',
  sidebar: '#1a1a1a',
  sidebarText: '#fff'
};

const darkTheme = {
  body: '#1a1a1a',
  text: '#fff',
  card: '#333',
  sidebar: '#000',
  sidebarText: '#fff'
};

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 300px;
  background: ${({ theme }) => theme.sidebar};
  color: ${({ theme }) => theme.sidebarText};
  padding: 20px;
  flex-shrink: 0;
`;

const MainContent = styled.div`
  flex-grow: 1;
  background: ${({ theme }) => theme.body};
  padding: 20px;
  overflow-y: auto;
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const CourseCard = styled.div`
  background: ${({ theme }) => theme.card};
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
  cursor: pointer;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`;

const Progress = styled.div`
  width: 100%;
  height: 5px;
  background: #ddd;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 10px;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: #1a73e8;
`;

const Duration = styled.div`
  margin-top: 10px;
  color: #555;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const Star = styled(FaStar)`
  color: ${({ rated }) => (rated ? '#ff0' : '#ccc')};
  cursor: pointer;
  margin-right: 5px;
`;

const CommentSection = styled.div`
  margin-top: 20px;
  width: 100%;
`;

const CommentInput = styled.textarea`
  width: 100%;
  height: 50px;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

const CommentList = styled.div`
  margin-top: 10px;
`;

const Comment = styled.div`
  background: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  border: 1px solid #ddd;
`;

const CategoryFilter = styled.select`
  padding: 10px;
  margin-right: 20px;
`;

const Home = () => {
  const [currentVideo, setCurrentVideo] = useState('video1.mp4');
  const [playingStatus, setPlayingStatus] = useState({});
  const [progress, setProgress] = useState({});
  const [durations, setDurations] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [watchLater, setWatchLater] = useState([]);
  const [category, setCategory] = useState('All');
  const [theme, setTheme] = useState(lightTheme);
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

  const handleProgress = (video, progress) => {
    setProgress(prev => ({
      ...prev,
      [video]: progress.played
    }));
  };

  const handleDuration = (video, duration) => {
    setDurations(prev => ({
      ...prev,
      [video]: duration
    }));
  };

  const handleRating = (video, rating) => {
    setRatings(prev => ({
      ...prev,
      [video]: rating
    }));
  };

  const handleComment = (video, comment) => {
    setComments(prev => ({
      ...prev,
      [video]: [...(prev[video] || []), comment]
    }));
  };

  const handleAddToWatchLater = (video) => {
    if (!watchLater.includes(video)) {
      setWatchLater([...watchLater, video]);
    }
  };

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === lightTheme ? darkTheme : lightTheme));
  };

  const videoCategories = {
    'video1.mp4': 'Virtualization',
    'video2.mp4': 'Database',
    'video3.mp4': 'Database'
  };

  const videoTitles = {
    'video1.mp4': 'Sett opp VMware',
    'video2.mp4': 'Sett opp Atlas og Compass',
    'video3.mp4': 'Sett opp din mongoDB server selv'
  };

  const filteredVideos = Object.keys(videoTitles).filter(video =>
    (videoTitles[video].toLowerCase().includes(searchTerm.toLowerCase())) &&
    (category === 'All' || videoCategories[video] === category)
  );

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <Sidebar>
          <h1>SECKER</h1>
          <p>Kommandoer</p>
          <p>YouTube Kanal</p>
          <p>Watch Later</p>
          <ul>
            {watchLater.map(video => (
              <li key={video}>{videoTitles[video]}</li>
            ))}
          </ul>
        </Sidebar>
        <MainContent>
          <Header>
            <h2>Kurs Bibliotek</h2>
            <input 
              type="text" 
              placeholder="Finn video" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <CategoryFilter onChange={(e) => setCategory(e.target.value)}>
              <option value="All">All</option>
              <option value="Virtualization">Virtualization</option>
              <option value="Database">Database</option>
            </CategoryFilter>
            <Icon onClick={toggleTheme}>
              {theme === lightTheme ? <FaMoon /> : <FaSun />}
            </Icon>
          </Header>
          <CourseGrid>
            {filteredVideos.map(video => (
              <CourseCard key={video} onClick={() => setCurrentVideo(video)}>
                <h3>{videoTitles[video]}</h3>
                <ReactPlayer
                  ref={ref => videoRefs.current[video] = ref}
                  url={require(`../videoer/${video}`)}
                  width="100%"
                  height="auto"
                  controls
                  playing={playingStatus[video] || false}
                  onProgress={(progress) => handleProgress(video, progress)}
                  onDuration={(duration) => handleDuration(video, duration)}
                />
                <Progress>
                  <ProgressBar style={{ width: `${(progress[video] || 0) * 100}%` }} />
                </Progress>
                <Duration>
                  Varighet: {durations[video] ? `${Math.floor(durations[video] / 60)}m ${Math.floor(durations[video] % 60)}s` : 'Laster...'}
                </Duration>
                <Rating>
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      rated={i < (ratings[video] || 0)} 
                      onClick={() => handleRating(video, i + 1)}
                    />
                  ))}
                </Rating>
                <Controls>
                  <Icon onClick={() => handlePlayPause(video)}>
                    {playingStatus[video] ? <FaPause /> : <FaPlay />}
                  </Icon>
                  <Icon onClick={() => handleFullScreen(video)}>
                    <FaExpand />
                  </Icon>
                </Controls>
                <Controls>
                  <button onClick={() => handleAddToWatchLater(video)}>Watch Later</button>
                </Controls>
                <CommentSection>
                  <h4>Comments</h4>
                  <CommentInput 
                    placeholder="Add a comment" 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleComment(video, e.target.value);
                        e.target.value = '';
                      }
                    }} 
                  />
                  <CommentList>
                    {(comments[video] || []).map((comment, index) => (
                      <Comment key={index}>{comment}</Comment>
                    ))}
                  </CommentList>
                </CommentSection>
              </CourseCard>
            ))}
          </CourseGrid>
        </MainContent>
      </Container>
    </ThemeProvider>
  );
};

export default Home;
