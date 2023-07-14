export default interface PostInterface {
    title: string,
    content: string,
    userId: string,
    likes?: Array<string>,
    comments?: Array<string>,
}