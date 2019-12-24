export interface ICacheStrategy {
    getItem<T>(key: string): Promise<T|void>;

    setItem(key: string, content: any, options: any): Promise<void>;

    clear(): Promise<void>;
}
