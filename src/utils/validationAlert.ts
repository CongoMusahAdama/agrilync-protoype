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

const SWAL_TOP_LAYER = 99999;

function elevateSwalLayer(): void {
  document.querySelectorAll('.swal2-container').forEach((el) => {
    (el as HTMLElement).style.zIndex = String(SWAL_TOP_LAYER);
  });
  const backdrop = document.querySelector('.swal2-backdrop-show') as HTMLElement | null;
  if (backdrop) backdrop.style.zIndex = String(SWAL_TOP_LAYER - 1);
}

function openAutoAlert(options: {
  icon: SweetAlertIcon;
  title: string;
  text?: string;
  html?: string;
  timer?: number;
}) {
  void Swal.close();
  return Swal.fire({
    icon: options.icon,
    title: options.title,
    text: options.text,
    html: options.html,
    showConfirmButton: false,
    timer: options.timer ?? 3500,
    timerProgressBar: true,
    allowOutsideClick: true,
    allowEscapeKey: true,
    heightAuto: false,
    didOpen: elevateSwalLayer,
  });
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

  return openAutoAlert({ icon, title, text });
}

/** Auto-dismissing success alert — no OK tap required (works reliably on mobile). */
export function showAutoSuccessAlert(title: string, html: string, timer = 3500) {
  return openAutoAlert({ icon: 'success', title, html, timer });
}

/** Auto-dismissing error alert — no OK tap required (works reliably on mobile). */
export function showAutoErrorAlert(
  title: string,
  message: string,
  timer = 4500,
  asHtml = false
) {
  return openAutoAlert({
    icon: 'error',
    title,
    ...(asHtml ? { html: message } : { text: message }),
    timer,
  });
}

/** Auto-dismissing warning alert — no OK tap required (works reliably on mobile). */
export function showAutoWarningAlert(title: string, text: string, timer = 4000) {
  return openAutoAlert({ icon: 'warning', title, text, timer });
}
