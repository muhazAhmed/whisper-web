export const GenRandomNumber = (length: number) => {
    if (length <= 0) {
        return "Random number length Must be greater than 0";
    }
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
}

export const ResponseRef = (success: boolean, message: string, status: number) => {
    if (!success || !message || !status) return "Either of Params is missing from ResponseRef"
    return Response.json({
        success: success,
        message: message,
    }, { status: status })
}