import React from "react";
import { X } from "lucide-react";
import ExhibitionBasicFields from "./ExhibitionBasicFields.jsx";
import ExhibitionCoverField from "./ExhibitionCoverField.jsx";
import ExhibitionAuthorSection from "./ExhibitionAuthorSection.jsx";
import ExhibitionImagesEditor from "./ExhibitionImagesEditor.jsx";
import Button from "../layout/Button";
import useExhibitionUploadSession from "./useExhibitionUploadSession.js";

export default function ExhibitionForm({
  isEdit,
  draft,
  setDraft,
  creating,
  onClose,
  onSubmit,
  className = "",
  onRegisterRequestClose,
}) {
  const {
    handleCancel,
    handleSubmit,
    uploadManagedFile,
    removeManagedFile,
    isPendingKey,
    unregisterPendingKey,
    isUploading,
  } = useExhibitionUploadSession({
    draft,
    setDraft,
    onClose,
    onSubmit,
  });

  React.useEffect(() => {
    onRegisterRequestClose?.(() => handleCancel());
    return () => {
      onRegisterRequestClose?.(null);
    };
  }, [handleCancel, onRegisterRequestClose]);

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative overflow-hidden rounded-[2rem] border border-white/50 bg-[linear-gradient(145deg,rgba(255,255,255,0.76),rgba(255,247,237,0.62))] p-5 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-2xl md:p-7 ${className}`}
    >
      <div className="pointer-events-none absolute -left-12 top-10 h-40 w-40 rounded-full bg-[#f5a623]/18 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full bg-white/35 blur-3xl" />

      <div className="relative space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a6a2a]">
              Exhibition Editor
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
              {isEdit ? "Upravit vystavu" : "Pridat vystavu"}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
              Povinne jsou nazev, datum a popis. Fotky i autor jsou volitelne,
              kdyz nic nenahrajes, pouzije se placeholder.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={handleCancel} variant="secondary">
              <X size={18} />
              Zrusit
            </Button>

            <Button
              type="submit"
              disabled={creating || isUploading}
              className="disabled:hover:translate-y-0 disabled:hover:scale-100"
            >
              {creating ? "Ukladam..." : "Ulozit vystavu"}
            </Button>
          </div>
        </div>

        <ExhibitionBasicFields draft={draft} setDraft={setDraft} />

        <ExhibitionCoverField
          draft={draft}
          setDraft={setDraft}
          uploadManagedFile={uploadManagedFile}
          removeManagedFile={removeManagedFile}
        />

        <ExhibitionAuthorSection
          draft={draft}
          setDraft={setDraft}
          uploadManagedFile={uploadManagedFile}
          removeManagedFile={removeManagedFile}
        />

        <ExhibitionImagesEditor
          draft={draft}
          setDraft={setDraft}
          unregisterPendingKey={unregisterPendingKey}
          isPendingKey={isPendingKey}
          uploadManagedFile={uploadManagedFile}
        />
      </div>
    </form>
  );
}
