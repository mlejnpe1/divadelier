import { useRef } from "react";
import { useListControls } from "../../hooks/useListControls.js";
import ListToolbar from "../layout/ListToolbar.jsx";
import Pagination from "../layout/Pagiantion.jsx";
import PlaylistVideoCard from "./PlaylistVideoCard.jsx";

const searchFields = [(video) => video.title, (video) => video.description];
const getSortValue = (video) => video.position;

function countLabel(count, kind) {
  if (kind === "poetrycast") {
    return count === 1 ? "díl" : count >= 2 && count <= 4 ? "díly" : "dílů";
  }
  return count === 1 ? "speciál" : count >= 2 && count <= 4 ? "speciály" : "speciálů";
}

export default function PlaylistArchive({
  items,
  loading,
  error,
  kind,
  emptyMessage,
}) {
  const listTopRef = useRef(null);
  const controls = useListControls(items, {
    pageSize: 6,
    getSortValue,
    searchFields,
  });

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-[#f5a623] border-solid" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="rounded-[1.6rem] border border-white/45 bg-white/55 px-6 py-8 text-[#6b4b2b]">
        Seznam se teď nepodařilo načíst z YouTube. Zkuste to prosím později.
      </p>
    );
  }

  return (
    <div ref={listTopRef} className="scroll-mt-24">
      {items.length > 0 && (
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <ListToolbar
            query={controls.query}
            setQuery={controls.setQuery}
            placeholder={kind === "poetrycast" ? "Hledat v PoetryCastech..." : "Hledat ve speciálech..."}
            className="w-full sm:flex-1"
          />
          <p className="text-sm text-[#8c6a43]" aria-live="polite">
            {controls.query
              ? `Výsledky: ${controls.filteredCount} z ${controls.totalCount}`
              : `${controls.totalCount} ${countLabel(controls.totalCount, kind)}`}
          </p>
        </div>
      )}
      {controls.filteredCount === 0 ? (
        <p className="rounded-[1.6rem] border border-white/45 bg-white/55 px-6 py-8 text-[#6b4b2b]">
          {controls.query ? "Hledání neodpovídá žádné položce. Zkuste jiné jméno nebo název." : emptyMessage}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {controls.items.map((video) => (
            <PlaylistVideoCard
              key={`${video.position}-${video.videoId}`}
              video={video}
              kind={kind}
            />
          ))}
        </div>
      )}
      <Pagination
        page={controls.page}
        pageCount={controls.pageCount}
        onPageChange={(page) => {
          controls.setPage(page);
          listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      />
    </div>
  );
}
