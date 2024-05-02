import React from 'react';
import Navbar from '../components/Navbar';
import VideoTutorial from '../components/VideoTutorial';
import Footer from '../components/footer';

function Home() {
  return (
    <div>
      <Navbar />
      <VideoTutorial />
      <Footer />
    </div>
  );
}

export default Home;
