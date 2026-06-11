import Swal, { type SweetAlertIcon } from 'sweetalert2';

/** Pull the most specific API / validation message from an axios-style error. */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  const err = error as { response?: { data?: unknown }; message?: string };
  const data = err?.response?.data;

  if (typeof data === 'string' && data.trim()) {
    return data.trim();
  }

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    if (typeof record.msg === 'string' && record.msg.trim()) return record.msg.trim();
    if (typeof record.message === 'string' && record.message.trim()) return record.message.trim();
    if (Array.isArray(record.errors) && record.errors.length > 0) {
      return String(record.errors[0]);
    }
  }

  if (err?.message?.trim()) return err.message.trim();
  return fallback;
}

/** Auto-dismissing alert — use exact validation text from API when available. */
export function showValidationAlert(
  title: string,
  messageOrError: string | unknown,
  fallbackMessage = 'Please check your input and try again.',
  icon: SweetAlertIcon = 'error'
) {
  const text =
    typeof messageOrError === 'string'
      ? messageOrError
      : getApiErrorMessage(messageOrError, fallbackMessage);

  return Swal.fire({
    icon,
    title,
    text,
    confirmButtonColor: '#002f37',
    timer: 3500,
    timerProgressBar: true,
    showConfirmButton: false,
  });
}
