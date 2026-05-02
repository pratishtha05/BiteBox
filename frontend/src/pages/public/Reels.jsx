import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Heart, MessageCircle, Send, ChevronDown, Music, MoreHorizontal } from "lucide-react";

const Reels = () => {
  const [reels, setReels] = useState([]);
  const containerRef = useRef(null);
  const videoRefs = useRef([]);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/reels");
        setReels(res.data.reels || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReels();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.play().catch(() => {});
          } else {
            entry.target.pause();
          }
        });
      },
      { threshold: 0.6 }
    );

    videoRefs.current.forEach((v) => v && observer.observe(v));
    return () => observer.disconnect();
  }, [reels]);

  const scrollToNext = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        top: containerRef.current.clientHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        scrollToNext();
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        containerRef.current.scrollBy({
          top: -containerRef.current.clientHeight,
          behavior: "smooth",
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    
    <div 
      ref={containerRef}
      className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar"
    >
      {reels.map((reel, index) => (
        <div
          key={index}
          className="relative h-full w-full flex items-center justify-center snap-start snap-always overflow-hidden"
        >
          {/* Video Layer */}
          <video
            ref={(el) => (videoRefs.current[index] = el)}
            src={`http://localhost:3000/${reel.videoUrl}`}
            className="h-full w-full object-cover md:object-contain bg-white/10 "
            muted
            loop
            playsInline
            onClick={(e) => e.target.paused ? e.target.play() : e.target.pause()}
          />

          {/* Navigation Icon */}
          <button 
            onClick={scrollToNext}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 p-2 text-white hover:text-white transition-colors z-20"
          >
            <ChevronDown size={30} className="animate-bounce" />
          </button>
        </div>
      ))}
    </div>
  );
};
export default Reels;