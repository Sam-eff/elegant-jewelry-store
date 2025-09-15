import React from 'react';
import Navbar from '../layouts/Navbar';
import HeroSection from '../HeroSection';
import CategoryList from '../CategoryList';
import ProductSection from './ProductSection';
import TrendingProducts from '../TrendingProduct';
import FeaturedProducts from '../FeaturedProduct';
import TopProducts from '../TopProducts';
import BestSellingProducts from '../BestSelling';


// Add others when ready: CategoryList, ProductSection, Newsletter, Footer

const Home = () => {
  return (
    <>
      <HeroSection />
      <CategoryList />
      <TrendingProducts />
      <TopProducts />
      <FeaturedProducts/>
      <BestSellingProducts />
      {/* <ProductSection title="featured" /> */}
      {/* <ProductSection type="trending" /> */}
      {/* <ProductSection type="top" /> */}
      {/* <ProductSection type="bestseller" /> */}
    </>
  );
};

export default Home;
