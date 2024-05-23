import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { FaMoon, FaSun, FaChevronDown, FaChevronUp, FaSearch, FaArrowUp, FaHome, FaBook, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/themes/prism.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { animateScroll as scroll, scroller } from 'react-scroll';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: 'Arial', sans-serif;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
`;

const lightTheme = {
  body: '#f0f0f0',
  text: '#000',
  card: '#fff',
  sidebar: '#1a1a1a',
  sidebarText: '#fff',
  searchBackground: '#e0e0e0',
  codeBackground: '#f5f5f5',
  codeText: '#333',
  linkHover: '#1a73e8',
  headerBackground: '#fff',
};

const darkTheme = {
  body: '#1a1a1a',
  text: '#fff',
  card: '#333',
  sidebar: '#000',
  sidebarText: '#fff',
  searchBackground: '#555',
  codeBackground: '#2d2d2d',
  codeText: '#f8f8f2',
  linkHover: '#1a73e8',
  headerBackground: '#333',
};

const Container = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
`;

const Sidebar = styled.div`
  width: 300px;
  background: ${({ theme }) => theme.sidebar};
  color: ${({ theme }) => theme.sidebarText};
  padding: 20px;
  flex-shrink: 0;
  overflow-y: auto;
  position: fixed;
  height: 100vh;
`;

const NavButton = styled(Link)`
  display: flex;
  align-items: center;
  margin: 10px 0;
  padding: 10px;
  background: #333;
  color: #fff;
  border-radius: 5px;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    background: #555;
  }
`;

const NavIcon = styled.div`
  margin-right: 10px;
`;

const MainContent = styled.div`
  margin-left: 320px;
  background: ${({ theme }) => theme.body};
  padding: 20px;
  overflow-y: auto;
  flex-grow: 1;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: ${({ theme }) => theme.headerBackground};
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-radius: 8px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const UserIcon = styled(FaUser)`
  margin-left: 20px;
  cursor: pointer;
`;

const GuideContent = styled.div`
  margin-top: 20px;
`;

const Section = styled.div`
  margin-bottom: 20px;
  border-radius: 8px;
  background: ${({ theme }) => theme.card};
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
`;

const SectionTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const SectionContent = styled.div`
  margin-top: 10px;
  line-height: 1.6;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  animation: ${({ isOpen }) => (isOpen ? 'fadeIn 0.3s ease-in-out' : 'fadeOut 0.3s ease-in-out')};

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;

const Icon = styled.div`
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.text};
  margin: 0 5px;
  cursor: pointer;
`;

const Code = styled.pre`
  background: ${({ theme }) => theme.codeBackground};
  color: ${({ theme }) => theme.codeText};
  padding: 10px;
  border-radius: 5px;
  overflow-x: auto;
`;

const TableOfContents = styled.div`
  position: sticky;
  top: 20px;
  padding: 10px;
  background: ${({ theme }) => theme.card};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const TocLink = styled.a`
  display: block;
  margin: 10px 0;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.linkHover};
  }
`;

const ProgressBar = styled.div`
  position: fixed;
  width: 100%;
  height: 4px;
  background: #ddd;
  top: 0;
  left: 0;
  z-index: 1000;
`;

const Progress = styled.div`
  height: 100%;
  background: #1a73e8;
  width: ${({ progress }) => `${progress}%`};
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.searchBackground};
  padding: 5px 10px;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 5px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.text};
  &:focus {
    outline: none;
  }
`;

const BackToTopButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #1a73e8;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: background 0.3s ease;

  &:hover {
    background: #155cb0;
  }
`;

const Footer = styled.footer`
  padding: 20px;
  background: ${({ theme }) => theme.card};
  text-align: center;
  border-top: 1px solid #ddd;
  margin-top: auto;
`;

const Guide = () => {
  const [theme, setTheme] = useState(lightTheme);
  const [openSections, setOpenSections] = useState({});
  const [progress, setProgress] = useState(0);
  const [isBackToTopVisible, setIsBackToTopVisible] = useState(false);
  const [codeTheme, setCodeTheme] = useState('tomorrow');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const scrollProgress = (window.scrollY / totalHeight) * 100;
      setProgress(scrollProgress);
      setIsBackToTopVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === lightTheme ? darkTheme : lightTheme));
    toast(`Switched to ${theme === lightTheme ? 'Dark' : 'Light'} mode`);
  };

  const toggleSection = (index) => {
    setOpenSections(prevState => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const highlightCode = (code) => (
    <Code>
      <code dangerouslySetInnerHTML={{ __html: Prism.highlight(code, Prism.languages.javascript, 'javascript') }} />
    </Code>
  );

  const scrollToSection = (id) => {
    scroller.scrollTo(id, {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart'
    });
  };

  const handleBackToTop = () => {
    scroll.scrollToTop();
  };

  const handleCodeThemeToggle = () => {
    setCodeTheme(prevTheme => (prevTheme === 'tomorrow' ? 'default' : 'tomorrow'));
    Prism.highlightAll();
  };

  const sections = [
    {
      title: '1. Sign Up for MongoDB Atlas',
      content: `Go to the [MongoDB Atlas website](https://www.mongodb.com/cloud/atlas) and sign up for a free account.`,
      image: 'https://d7umqicpi7263.cloudfront.net/img/product/ff17ad02-a9a0-4bd6-95db-25741bd05e27.png',
    },
    {
      title: '2. Create a Cluster',
      content: `After signing up, create a new cluster by following the instructions on the MongoDB Atlas dashboard.`,
      image: 'https://webimages.mongodb.com/_com_assets/cms/kykgzd0sd3qiv9n36-atlas-hero.svg?auto=format%252Ccompress',
    },
    {
      title: '3. Whitelist Your IP Address',
      content: `To connect to your cluster, you need to whitelist your IP address. Go to the Network Access tab and add your current IP address.`,
      image: 'https://studio3t.com/wp-content/uploads/2020/04/mongodb-atlas-ip-whitelist-tab-scaled.jpg',
    },
    {
      title: '4. Create a Database User',
      content: `Create a database user with the necessary permissions to access your cluster. Go to the Database Access tab and add a new user.`,
      image: 'https://www.mongodb.com/docs/guides/static/8bcb8e948c871029e6710747788d6231/0e7aa/db-user-password.webp',
    },
    {
      title: '5. Connect to Your Cluster Using MongoDB Compass',
      content: `Download and install MongoDB Compass from the [official website](https://www.mongodb.com/products/compass). Open Compass and use the connection string from the Atlas dashboard to connect to your cluster.`,
      image: 'https://images.contentstack.io/v3/assets/blt7151619cb9560896/blt924135b56cfca952/646e1f54a9ab8d332d67324a/compass.svg',
    },
    {
      title: '6. Create and Manage Databases and Collections in Compass',
      content: `Once connected, you can create and manage databases and collections directly within MongoDB Compass.`,
      image: 'https://www.notion.so/image/https%3A%2F%2Fdownloads.intercomcdn.com%2Fi%2Fo%2F399579719%2Fe016bf02d42f282d9c9b8bde%2FSimpleBackups-Mongo-NewConnection5.png?table=block&id=4a5891b9-5c5e-4eda-9a61-ee59eaf91832&cache=v2',
    },
  ];

  const filteredSections = sections.filter(section => 
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ToastContainer />
      <ProgressBar>
        <Progress progress={progress} />
      </ProgressBar>
      <Container>
        <Sidebar>
          <h1>SECKER</h1>
          <NavButton to="/">
            <NavIcon><FaHome /></NavIcon>
            Home
          </NavButton>
          <NavButton to="/guide">
            <NavIcon><FaBook /></NavIcon>
            Guide
          </NavButton>


          <SearchBar>
            <FaSearch />
            <SearchInput 
              type="text" 
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBar>
          <TableOfContents>
            <h3>Table of Contents</h3>
            {filteredSections.map((section, index) => (
              <TocLink key={index} onClick={() => scrollToSection(`section-${index}`)}>
                {section.title}
              </TocLink>
            ))}
          </TableOfContents>
        </Sidebar>
        <MainContent>
          <Header>
            <HeaderLeft>
              <h2>Guide: Setting up MongoDB with Atlas and Compass</h2>
            </HeaderLeft>
            <div>
              <Icon onClick={toggleTheme}>
                {theme === lightTheme ? <FaMoon /> : <FaSun />}
              </Icon>
              <Icon onClick={handleCodeThemeToggle}>
                {codeTheme === 'tomorrow' ? <FaChevronDown /> : <FaChevronUp />}
              </Icon>
              <UserIcon />
            </div>
          </Header>
          <GuideContent>
            {filteredSections.map((section, index) => (
              <Section key={index} id={`section-${index}`}>
                <SectionTitle onClick={() => toggleSection(index)}>
                  {section.title}
                  {openSections[index] ? <FaChevronUp /> : <FaChevronDown />}
                </SectionTitle>
                <SectionContent isOpen={openSections[index]}>
                  <p>{section.content}</p>
                  {section.image && <img src={section.image} alt={section.title} style={{ width: '100%', maxWidth: '300px', borderRadius: '8px', marginTop: '10px' }} />}
                </SectionContent>
              </Section>
            ))}
          </GuideContent>
        </MainContent>
        <BackToTopButton onClick={handleBackToTop} isVisible={isBackToTopVisible}>
          <FaArrowUp />
        </BackToTopButton>
      </Container>
      <Footer>
        <p>&copy; 2024 SECKER. All Rights Reserved.</p>
      </Footer>
    </ThemeProvider>
  );
};

export default Guide;
