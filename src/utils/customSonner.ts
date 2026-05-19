import Swal from 'sweetalert2';
import React from 'react';

// Design a customized SweetAlert2 theme matching AgriLync aesthetics
const customSwal = Swal.mixin({
  customClass: {
    popup: 'rounded-3xl border border-gray-100 shadow-2xl font-sans bg-white p-6',
    title: 'font-montserrat font-bold text-[#002f37] text-xl',
    htmlContainer: 'text-gray-500 text-sm font-medium leading-relaxed mt-2',
    confirmButton: 'bg-[#002f37] hover:bg-[#001f24] text-[#7ede56] border border-[#7ede56]/30 font-bold px-8 py-3 rounded-xl shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#7ede56] text-sm',
    cancelButton: 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 font-bold px-8 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm ml-3'
  },
  buttonsStyling: false,
  confirmButtonText: 'Understood'
});

export const toast = {
  success: (message: string | React.ReactNode, options?: any) => {
    const text = typeof message === 'string' ? message : '';
    customSwal.fire({
      title: 'Success!',
      text: text,
      icon: 'success',
      iconColor: '#7ede56',
    });
    return 'swal-id';
  },
  error: (message: string | React.ReactNode, options?: any) => {
    const text = typeof message === 'string' ? message : '';
    customSwal.fire({
      title: 'Action Failed',
      text: text,
      icon: 'error',
      iconColor: '#ef4444',
    });
    return 'swal-id';
  },
  info: (message: string | React.ReactNode, options?: any) => {
    const text = typeof message === 'string' ? message : '';
    customSwal.fire({
      title: 'Information',
      text: text,
      icon: 'info',
      iconColor: '#002f37',
    });
    return 'swal-id';
  },
  warning: (message: string | React.ReactNode, options?: any) => {
    const text = typeof message === 'string' ? message : '';
    customSwal.fire({
      title: 'Warning',
      text: text,
      icon: 'warning',
      iconColor: '#f59e0b',
    });
    return 'swal-id';
  },
  custom: (message: string | React.ReactNode, options?: any) => {
    const text = typeof message === 'string' ? message : '';
    customSwal.fire({
      title: 'Notification',
      text: text,
    });
    return 'swal-id';
  },
  loading: (message: string | React.ReactNode, options?: any) => {
    const text = typeof message === 'string' ? message : '';
    customSwal.fire({
      title: text || 'Please wait...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    return 'swal-id';
  },
  dismiss: (id?: string) => {
    Swal.close();
  }
};

// Ensure we export a valid dummy Toaster component for layout components that import it
export const Toaster = () => {
  return null;
};

export default toast;
