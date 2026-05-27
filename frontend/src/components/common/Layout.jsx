// Layout.js
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Newsletter from './Newsletter';

function Layout() {
  const location = useLocation();
  const hidePaths = ['/login', '/signup'];
  const shouldHideLayout = hidePaths.includes(location.pathname);

  return (
    <>
      {!shouldHideLayout && <Navbar />}
      <main>
        <Outlet />
      </main>
      {!shouldHideLayout && <Newsletter />}
      {!shouldHideLayout && <Footer />}
    </>
  );
}

export default Layout;
