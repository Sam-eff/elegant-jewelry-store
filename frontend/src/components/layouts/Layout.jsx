// Layout.js
import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Newsletter from './Newsletter';

function Layout() {
  const location = useLocation();
  const hidePaths = ['/login', '/signup'];
  const shouldHideLayout = hidePaths.includes(location.pathname);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <>
      {!shouldHideLayout && <Navbar
      darkMode={darkMode}
      toggleDarkMode={() => setDarkMode(!darkMode)} 
      />}
      <main>
        <Outlet />
      </main>
      {!shouldHideLayout && <Newsletter />}
      {!shouldHideLayout && <Footer />}
    </>
  );
}

export default Layout;
