import React from "react";
import ExhibitionCard from "./ExhibitionCard.jsx";

export default function ExhibitionList({
  exhibitions,
  loading,
  user,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className='flex justify-center items-center h-48'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a623] border-solid' />
      </div>
    );
  }

  if (!exhibitions || exhibitions.length === 0) {
    return <p className='text-gray-400'>Žádné výstavy k zobrazení</p>;
  }

  return (
    <div className='space-y-6'>
      {exhibitions.map((exh, index) => (
        <ExhibitionCard
          key={exh._id}
          exhibition={exh}
          index={index}
          user={user}
          onEdit={() => onEdit(exh)}
          onDelete={() => onDelete(exh._id)}
        />
      ))}
    </div>
  );
}
