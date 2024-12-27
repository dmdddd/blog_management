import { Toaster, toast } from 'react-hot-toast';
import { useState } from 'react';

// ToastProvider component to wrap your app
const ToastProvider = ({ children }) => {
  return (
    <>
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10B981',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
    </>
  );
};

// Custom hook for handling API errors
const useApiErrorToast = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleApiError = async (promise) => {
    setIsLoading(true);
    try {
      const result = await promise;
      return result;
    } catch (error) {
      // Handle different types of errors
      if (error.response) {
        // Server responded with error
        toast.error(error.response.data.message || 'An error occurred');
      } else if (error.request) {
        // Request made but no response
        toast.error('No response from server. Please try again.');
      } else {
        // Other errors
        toast.error('Something went wrong. Please try again.');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleApiError, isLoading };
};

export { ToastProvider, useApiErrorToast, toast };