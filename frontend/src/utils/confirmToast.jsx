import toast from "react-hot-toast";

export function confirmToast({
  message = "Opravdu pokračovat?",
  confirmText = "Potvrdit",
  cancelText = "Zrušit",
  description,
  danger = false,
  duration = Infinity,
} = {}) {
  return new Promise((resolve) => {
    const id = toast.custom(
      (t) => (
        <div
          className={[
            "w-full max-w-md rounded-xl shadow-lg border bg-white p-4",
            "flex items-start gap-3",
            "border-gray-200",
          ].join(" ")}
        >
          <div
            className={[
              "mt-1 h-3 w-3 rounded-full flex-shrink-0",
              danger ? "bg-red-500" : "bg-[#f5a623]",
            ].join(" ")}
          />

          <div className='flex-1'>
            <p className='font-semibold text-gray-900'>{message}</p>
            {description ? (
              <p className='text-sm text-gray-600 mt-1'>{description}</p>
            ) : null}

            <div className='mt-4 flex justify-end gap-2'>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(false);
                }}
                className='px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition'
              >
                {cancelText}
              </button>

              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(true);
                }}
                className={[
                  "px-3 py-1.5 rounded-lg text-white transition",
                  danger
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-[#f5a623] hover:bg-[#e09b1e]",
                ].join(" ")}
              >
                {confirmText}
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              toast.dismiss(t.id);
              resolve(false);
            }}
            className='ml-1 text-gray-400 hover:text-gray-600 transition'
            aria-label='Close'
          >
            ✕
          </button>
        </div>
      ),
      { id: `confirm-${Date.now()}`, duration }
    );

    void id;
  });
}
