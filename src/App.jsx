import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Projects from "./components/Projects";
import Info from "./components/Info";
import Contact from "./components/Contact";
import { useEffect, useState } from "react";

function App(){

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <div className="min-h-screen bg-slate-950 text-white flex">

    <Sidebar />

    <main>
      <Home />
      <Projects />
      <Info />
      <Contact />
    </main>



  </div>
}

export default App;