import toast from "react-hot-toast";

export async function toastAction(fn, { loading, success, error }) {
  const id = toast.loading(loading);
  try {
    const result = await fn();
    toast.success(success, { id });
    return result;
  } catch (e) {
    toast.error(e.message || error, { id });
    throw e;
  }
}
