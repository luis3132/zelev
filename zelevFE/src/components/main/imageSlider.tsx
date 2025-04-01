// components/ImageSlider.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Slide {
    id: number;
    src: string;
    alt: string;
    caption?: string;
}

export default function ImageSlider({ slides }: { slides: Slide[] }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
    }, [currentSlide]);

    return (
        <section
            aria-label="Galería de imágenes"
            className="relative w-full mx-auto overflow-hidden rounded-2xl shadow-2xl shadow-white/20"
        >
            <div className="relative h-56 md:h-[600px]">
                {slides.map((slide, index) => (
                    <figure
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-500 w-full
                            ${index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        aria-hidden={index !== currentSlide}
                    >
                        <Image
                            src={slide.src}
                            alt={slide.alt}
                            fill
                            className='object-cover object-center'
                            priority={index === currentSlide}
                        />
                        {slide.caption && (
                            <figcaption className="absolute bottom-0 left-0 right-0 p-4 text-center text-white bg-black/30">
                                {slide.caption}
                            </figcaption>
                        )}
                    </figure>
                ))}
            </div>

            {/* Controles de navegación */}
            <div className="absolute inset-0 flex items-center justify-between p-4">
                <button
                    onClick={prevSlide}
                    aria-label="Imagen anterior"
                    className="p-2 text-white bg-black/50 rounded-full hover:bg-black/75 transition-all cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={nextSlide}
                    aria-label="Imagen siguiente"
                    className="p-2 text-white bg-black/50 rounded-full hover:bg-black/75 transition-all cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
            <div className="absolute bottom-0 flex items-center justify-center gap-2 p-4">
                {slides.map((slide, index) => (
                    <button
                        key={slide.id}
                        onClick={() => goToSlide(index)}
                        aria-label={`Ir a imagen ${index + 1}`}
                        className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-black/50 w-6' : 'bg-gray-400/40'}`}
                    />
                ))}
            </div>
        </section>
    );
}