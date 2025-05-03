import * as React from 'react';

import HomePage from "@/components/pages/homePage";
import Navbar from "@/components/widgets/navbar";
import Footer from "@/components/widgets/footer";


export default async function Home() {
  return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <HomePage />
        <Footer />
      </div>
  )
}
