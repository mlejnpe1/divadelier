import React from "react";

export default function ExhibitionImagesEditor({
  draft,
  setDraft,
  newImageUrl,
  setNewImageUrl,
  newImageAlt,
  setNewImageAlt,
  onAddImage,
}) {
  return (
    <div className='space-y-3'>
      <p className='font-semibold text-gray-900'>Fotky výstavy</p>

      <div className='grid md:grid-cols-3 gap-2'>
        <input
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          placeholder='URL obrázku (Cloudflare)'
          className='md:col-span-2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]'
        />
        <input
          value={newImageAlt}
          onChange={(e) => setNewImageAlt(e.target.value)}
          placeholder='Popisek (alt)'
          className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]'
        />
      </div>

      <button
        type='button'
        onClick={onAddImage}
        className='inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition'
      >
        Přidat fotku
      </button>

      {Array.isArray(draft.images) && draft.images.length > 0 && (
        <div className='space-y-3'>
          {draft.images.map((img, idx) => (
            <div
              key={idx}
              className='flex gap-3 items-center border rounded-lg p-3 bg-gray-50'
            >
              <span className='text-sm text-gray-500 w-6 text-right select-none'>
                {idx + 1}.
              </span>

              <div className='w-28 h-20 rounded-md overflow-hidden bg-gray-200 flex-shrink-0 border relative'>
                <img
                  src={img?.url || "/placeholder.png"}
                  alt={img?.alt || ""}
                  loading='lazy'
                  className='w-full h-full object-cover'
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.png";
                  }}
                />
              </div>

              <input
                value={img?.url || ""}
                onChange={(e) => {
                  const v = e.target.value;
                  setDraft((d) => {
                    const next = [...(d.images || [])];
                    next[idx] = { ...next[idx], url: v };
                    return { ...d, images: next };
                  });
                }}
                placeholder='URL obrázku'
                className='flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]'
              />

              <input
                value={img?.alt || ""}
                onChange={(e) => {
                  const v = e.target.value;
                  setDraft((d) => {
                    const next = [...(d.images || [])];
                    next[idx] = { ...next[idx], alt: v };
                    return { ...d, images: next };
                  });
                }}
                placeholder='alt text'
                className='w-44 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]'
              />

              <button
                type='button'
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    images: d.images.filter((_, i) => i !== idx),
                  }))
                }
                className='px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition'
              >
                Smazat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
