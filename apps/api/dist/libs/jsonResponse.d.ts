declare const jsonRepose: {
    success: ({ message, data }: {
        message: string;
        data?: any;
    }) => {
        success: boolean;
        message: string;
        data: any;
    };
    error: ({ errors, message }: {
        message: string;
        errors?: any;
    }) => {
        success: boolean;
        message: string;
        errors: any;
    };
};
export default jsonRepose;
//# sourceMappingURL=jsonResponse.d.ts.map