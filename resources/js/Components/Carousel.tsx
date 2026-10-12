
import { useRef, type ReactNode } from "react";
import {
    Swiper,
    SwiperSlide,
} from "swiper/react";
import {
    Autoplay,
    Pagination,
} from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/pagination";

type CarouselProps = {
    children: ReactNode[];
    speed?: number;
    delay?: number;
    slidesPerView?: number;
    loop?: boolean;
    spaceBetween?: number;
    direction?: "left" | "right";
};

export default function Carousel({
    children,
    speed = 700,
    delay = 3000,
    slidesPerView = 3,
    loop = true,
    spaceBetween = 20,
    direction = "right",
}: CarouselProps) {
    const swiperRef = useRef<SwiperType | null>(null);

    return (
        <div className="relative w-full">
            <Swiper
                modules={[Autoplay, Pagination]}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                slidesPerView={slidesPerView}
                spaceBetween={spaceBetween}
                speed={speed}
                loop={loop}
                autoplay={{
                    delay,
                    disableOnInteraction: false,
                    reverseDirection: direction === "right",
                    pauseOnMouseEnter: true,
                }}
                pagination={{
                    clickable: true,
                }}
                breakpoints={{
                    0: {
                        slidesPerView: 1,
                    },
                    640: {
                        slidesPerView: Math.min(slidesPerView, 2),
                    },
                    1024: {
                        slidesPerView,
                    },
                }}
                className="carousel-swiper pb-10"
            >
                {children.map((child, index) => (
                    <SwiperSlide key={index}>
                        {child}
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="mt-2 flex justify-center gap-3">
                <button
                    type="button"
                    onClick={() => swiperRef.current?.slidePrev()}
                    aria-label="Slide sebelumnya"
                    className="rounded-full border px-4 py-2 transition hover:bg-indigo-600 hover:text-white cursor-pointer"
                >
                    ←
                </button>

                <button
                    type="button"
                    onClick={() => swiperRef.current?.slideNext()}
                    aria-label="Slide berikutnya"
                    className="rounded-full border px-4 py-2 transition hover:bg-indigo-600 hover:text-white cursor-pointer"
                >
                    →
                </button>
            </div>
        </div>
    );
}
