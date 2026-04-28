import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSlider() {
    const slides = [
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
        "https://images.unsplash.com/photo-1509062522246-3755977927d7",
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    ];

    // 🔥 CLONE FIRST & LAST (KEY FIX)
    const extendedSlides = [
        slides[slides.length - 1], // last clone
        ...slides,
        slides[0], // first clone
    ];

    const [current, setCurrent] = useState(1);
    const [transition, setTransition] = useState(true);
    const sliderRef = useRef();

    // ✅ AUTO SLIDE
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => prev + 1);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    // ✅ HANDLE LOOP (PERFECT FIX)
    useEffect(() => {
        if (current === extendedSlides.length - 1) {
            // reached last clone
            setTimeout(() => {
                setTransition(false);
                setCurrent(1);
            }, 700);
        }

        if (current === 0) {
            // reached first clone
            setTimeout(() => {
                setTransition(false);
                setCurrent(slides.length);
            }, 700);
        }
    }, [current]);

    // re-enable transition
    useEffect(() => {
        if (!transition) {
            requestAnimationFrame(() => {
                setTransition(true);
            });
        }
    }, [transition]);

    const nextSlide = () => {
        setCurrent((prev) => prev + 1);
    };

    const prevSlide = () => {
        setCurrent((prev) => prev - 1);
    };

    return (
        <div className="w-full max-w-7xl mx-auto mt-2 overflow-hidden relative shadow-lg">

            {/* SLIDER TRACK */}
            <div
                ref={sliderRef}
                className={`flex ${transition ? "transition-transform duration-700 ease-in-out" : ""}`}
                style={{
                    transform: `translateX(-${current * 100}%)`,
                }}
            >
                {extendedSlides.map((src, i) => (
                    <img
                        key={i}
                        src={src}
                        alt=""
                        className="w-full h-[220px] md:h-[320px] object-cover flex-shrink-0"
                    />
                ))}
            </div>

            {/* LEFT */}
            <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
            >
                <ChevronLeft />
            </button>

            {/* RIGHT */}
            <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
            >
                <ChevronRight />
            </button>
        </div>
    );
}