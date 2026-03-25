import React, { useEffect, useMemo, useState } from "react";
import GalleryLightbox from "../layout/GalleryLightbox.jsx";

export default function MeetingDetailModal({ meeting, visual, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const items = useMemo(() => {
    const unique = Array.from(
      new Set(
        (visual?.gallery?.length ? visual.gallery : [visual?.cover]).filter(Boolean),
      ),
    );

    return unique.map((url, index) => ({
      url,
      alt: `Fotografie skupiny ${meeting?.title || ""} ${index + 1}`,
    }));
  }, [meeting?.title, visual?.cover, visual?.gallery]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [meeting?._id]);

  if (!meeting || !items.length) return null;

  return (
    <GalleryLightbox
      items={items}
      currentIndex={currentIndex}
      onChangeIndex={setCurrentIndex}
      onClose={onClose}
    />
  );
}
