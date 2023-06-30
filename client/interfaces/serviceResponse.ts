export default interface ServiceResponse {
    error: boolean,
    response?: any,
    message?: string,
    details?: Array<string>,
}