import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import AIRecommendations from '../components/AIRecommendations'
import OurPolicy from '../components/Ourpolicy'
import Newsletterbox from '../components/Newsletterbox'

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <BestSeller />
      <AIRecommendations />
      <OurPolicy/>
      <Newsletterbox/>
    </div>
  )
}

export default Home
