import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import CategoryList from '../components/sections/CategoryList';
import TrendingProducts from '../components/sections/TrendingProduct';
import FeaturedProducts from '../components/sections/FeaturedProduct';
import TopProducts from '../components/sections/TopProducts';
import BestSellingProducts from '../components/sections/BestSelling';
import ScrollBanner from '../components/sections/ScrollBanner';
import AtelierSpotlight from '../components/sections/AtelierSpotlight';

const Home = () => {
  return (
    <>
      <HeroSection />
      <ScrollBanner />
      <CategoryList />
      <TrendingProducts />
      <AtelierSpotlight />
      <TopProducts />
      <FeaturedProducts />
      <BestSellingProducts />
    </>
  );
};

export default Home;
