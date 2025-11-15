import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number // ms, 0 = không tự động đóng
  title?: string
}

let toastIdCounter = 0

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  /**
   * Thêm toast notification
   */
  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${toastIdCounter++}`
    
    // Determine duration: prefer explicit duration, else use type default, else 4000ms
    let finalDuration = toast.duration
    if (finalDuration === undefined) {
      // Use type-specific defaults
      if (toast.type === 'error') {
        finalDuration = 10000  // Errors stay longer
      } else if (toast.type === 'warning') {
        finalDuration = 10000  // Warnings 10s
      } else {
        finalDuration = 10000  // Success/Info 10s
      }
    }
    
    const newToast: Toast = {
      id,
      type: toast.type,
      message: toast.message,
      title: toast.title,
      duration: finalDuration,
    }

    toasts.value.push(newToast)

    // Tự động xóa sau duration (nếu duration > 0)
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }

  /**
   * Xóa toast
   */
  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  /**
   * Xóa tất cả toasts
   */
  const clearAllToasts = () => {
    toasts.value = []
  }

  // ===== Convenience methods =====

  const success = (message: string, options?: { title?: string; duration?: number }) => {
    return addToast({
      type: 'success',
      message,
      title: options?.title,
      duration: options?.duration,
    })
  }

  const error = (message: string, options?: { title?: string; duration?: number }) => {
    return addToast({
      type: 'error',
      message,
      title: options?.title,
      duration: options?.duration,  // If not provided, addToast will use 6000ms default
    })
  }

  const warning = (message: string, options?: { title?: string; duration?: number }) => {
    return addToast({
      type: 'warning',
      message,
      title: options?.title,
      duration: options?.duration,  // If not provided, addToast will use 5000ms default
    })
  }

  const info = (message: string, options?: { title?: string; duration?: number }) => {
    return addToast({
      type: 'info',
      message,
      title: options?.title,
      duration: options?.duration,
    })
  }

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
  }
})
