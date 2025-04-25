export const validateRequiredField = (value: string, message: string) => {
    if (!value.trim()) return message;
    return '';
};

export const validateNumberField = (value: string, message: string) => {
    if (!value.trim()) return message;
    if (isNaN(Number(value))) return message;
    return '';
};



