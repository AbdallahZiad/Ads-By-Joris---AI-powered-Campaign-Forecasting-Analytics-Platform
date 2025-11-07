export interface Group {
    id: string;
    name: string;
    keywords: string[];
}

export interface Category {
    id: string;
    name: string;
    groups: Group[];
}
