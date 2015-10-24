import HttpStatus from './HttpStatus';

// TODO use https://github.com/jshttp/http-errors ?
export default class HttpError {
    constructor(status, error, details, previous) {
        this.status = status;
        this.error = error;
        this.details = details;

        if (previous) {
            this.previous = previous;
        }

        Object.seal(this);
    }

    /** 400 */
    static badRequest(details, message, previous) {
        return new HttpError(HttpStatus.BAD_REQUEST, message, details, previous);
    }

    /** 403 */
    static forbidden(details, message, previous) {
        return new HttpError(HttpStatus.FORBIDDEN, message, details, previous);
    }

    /** 404 */
    static notFound(details, message, previous) {
        return new HttpError(HttpStatus.NOT_FOUND, message, details, previous);
    }

    /** 500 */
    static internalServerError(details, message, previous) {
        return new HttpError(HttpStatus.INTERNAL_ERROR, message, details, previous);
    }

}
