
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/navigation";
import "./Gallery.css";

const photos = [
  {
    id: 1,
    title: "Pemandangan Alam",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=900",
  },
  {
    id: 2,
    title: "Pegunungan",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900",
  },
  {
    id: 3,
    title: "Laut dan Pantai",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900",
  },
  {
    id: 4,
    title: "Hutan Hijau",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900",
  },
];

export default function Gallery() {
  return (
    <section className="gallery-section">
      <div className="gallery-heading">
        <p className="gallery-label">OUR GALLERY</p>
        <h2>Jelajahi Galeri Kami</h2>
        <p className="gallery-description">
          Kumpulan momen dan pemandangan dalam satu galeri.
        </p>
      </div>

      <div className="gallery-slider">
        <Swiper
          modules={[EffectCards, Navigation, Autoplay]}
          effect="cards"
          grabCursor={true}
          loop={true}
          navigation={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          cardsEffect={{
            slideShadows: true,
            rotate: true,
            perSlideOffset: 8,
            perSlideRotate: 2,
          }}
          className="gallery-swiper"
        >
          {photos.map((photo) => (
            <SwiperSlide key={photo.id}>
              <div className="gallery-card">
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="gallery-image"
                />

                <div className="gallery-card-caption">
                  <h3>{photo.title}</h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
