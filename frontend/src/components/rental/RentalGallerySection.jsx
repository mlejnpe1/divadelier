import Gallery from "../layout/Gallery.jsx";

export default function RentalGallerySection({ images }) {
  return (
    <>
      <h2 className="mb-6 text-3xl font-bold">Jak prostor vypadá</h2>
      <Gallery images={images} />
    </>
  );
}
