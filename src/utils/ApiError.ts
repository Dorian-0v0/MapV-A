export class ApiError extends Error {
    code: number;
    message: string;
    constructor(message: string, code: number = 500) {
        super(message);
        this.message = message;
        this.code = code;
    }
}