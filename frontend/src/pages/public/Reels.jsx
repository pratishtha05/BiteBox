import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
} from "lucide-react";

const Reels = () => {
  const [reels, setReels] = useState([
    { videoUrl: "/reels/reel1.mp4" },
    { videoUrl: "/reels/reel2.mp4" },
    { videoUrl: "/reels/reel3.mp4" },
    { videoUrl: "/reels/reel4.mp4" },
    { videoUrl: "/reels/reel5.mp4" },
    { videoUrl: "/reels/reel6.mp4" },
    { videoUrl: "/reels/reel7.mp4" },
  ]);

  const containerRef = useRef(null);
  const videoRefs = useRef([]);

  useEffect(() => {
    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target
                .play()
                .catch(() => {});
            } else {
              entry.target.pause();
            }
          });
        },
        { threshold: 0.6 }
      );

    videoRefs.current.forEach(
      (v) => v && observer.observe(v)
    );

    return () => observer.disconnect();
  }, []);

  const scrollToNext = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        top:
          containerRef.current.clientHeight,
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
          top:
            -containerRef.current
              .clientHeight,
          behavior: "smooth",
        });
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar bg-black"
    >
      {reels.map((reel, index) => (
        <div
          key={index}
          className="relative h-screen w-full flex items-center justify-center snap-start snap-always overflow-hidden"
        >
          {/* Video Layer */}
          <video
            ref={(el) =>
              (videoRefs.current[index] = el)
            }
            src={reel.videoUrl}
            className="h-full w-full object-cover sm:object-cover md:object-contain bg-black"
            muted
            loop
            playsInline
            preload="auto"
            onClick={(e) =>
              e.target.paused
                ? e.target.play()
                : e.target.pause()
            }
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none z-10" />

          {/* Navigation Icon */}
          {index !== reels.length - 1 && (
            <button
              onClick={scrollToNext}
              className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 p-2 text-white hover:text-white transition-colors z-20 hover:cursor-pointer"
            >
              <ChevronDown
                size={28}
                className="animate-bounce sm:w-8 sm:h-8"
              />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Reels;