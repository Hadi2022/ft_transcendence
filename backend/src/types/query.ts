
export type Order = 'asc' | 'desc'

export type ListParams = {
    limit: number;
    offset: number;
    userId?: string | undefined;
}