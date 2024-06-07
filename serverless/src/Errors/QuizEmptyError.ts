class QuizEmptyError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'QuizEmptyError';
    }
}