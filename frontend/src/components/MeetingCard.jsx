import React from "react";
import { Edit2, Trash2 } from "lucide-react";

export default function MeetingCard({ meeting, user, onEdit, onDelete }) {
  return (
    <div className="relative p-6 flex flex-col justify-end h-64 border-[#f5a623] border-solid border-2 rounded-lg bg-white">
      <h3 className="text-xl md:text-2xl font-bold text-black">
        {meeting.title}
      </h3>

      <p className="text-black/90 text-sm md:text-base mt-1">
        {meeting.information}
      </p>

      <p className="text-black text-xs mt-2 italic">
        Kdy se scházíme: {meeting.day_in_week}
      </p>

      {user && (
        <div className="mt-6 flex justify-end space-x-2">
          <Edit2
            className="cursor-pointer text-blue-600 hover:bg-blue-200 rounded-md"
            onClick={onEdit}
          />
          <Trash2
            className="cursor-pointer text-red-600 hover:bg-red-200 rounded-md"
            onClick={onDelete}
          />
        </div>
      )}
    </div>
  );
}
