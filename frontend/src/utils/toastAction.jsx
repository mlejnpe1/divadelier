import toast from "react-hot-toast";

export async function toastAction(fn, { loading, success, error }) {
  const id = toast.loading(loading);
  try {
    const result = await fn();
    const successMessage =
      typeof success === "function" ? success(result) : success;

    toast.success(successMessage, { id });
    return result;
  } catch (e) {
    const errorMessage = typeof error === "function" ? error(e) : error;

    toast.error(e.message || errorMessage, { id });
    throw e;
  }
}
