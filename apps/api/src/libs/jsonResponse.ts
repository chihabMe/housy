const jsonRepose = {
  success: ({ message, data }: { message: string; data?: any }) => {
    return {
      success: true,
      message,
      data,
    };
  },

  error: ({ errors, message }: { message: string; errors?: any }) => {
    return {
      success: false,
      message,
      errors,
    };
  },
};

export default jsonRepose;
