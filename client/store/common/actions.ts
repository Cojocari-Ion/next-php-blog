export const SET_COMMENT_TEXT = '@common/SET_COMMENT_TEXT';



export function setCommentText(comment: string) {
    return {type: SET_COMMENT_TEXT, payload: comment}
}