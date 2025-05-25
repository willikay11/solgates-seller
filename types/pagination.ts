import { Meta } from "./meta";

export interface Pagination<T> {
    [key: string]: T[] | { first: string; last: string; next: string; prev: string; } | Meta,
    links: {
        first: string;
        last: string;
        next: string;
        prev: string;
    },
    meta: Meta;
}