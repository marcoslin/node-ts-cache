import { StorageTypes } from './storage.types'

export class MemoryStorage implements StorageTypes {

    private memCache: any = {}

    constructor() {
    }

    public async getItem<T>(key: string): Promise<T|undefined> {
        if (key in this.memCache) {
            return this.memCache[key]
        } else {
            return undefined
        }
    }

    public async setItem(key: string, content: any): Promise<void> {
        this.memCache[key] = content
    }

    public async clear(): Promise<void> {
        this.memCache = {}
    }

}
