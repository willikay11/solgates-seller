import { Meta } from "./meta";

export interface Pagination<T> {
    [key: string]: T[] | {
        first: string;
        last: string;
        next: string;
        prev: string;
    } | Meta;
}