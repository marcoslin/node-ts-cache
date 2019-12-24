import { StorageTypes } from '../../storage/storage.types'
import { AbstractBaseStrategy } from './abstract.base.strategy'

interface IExpiringCacheItem {
    content: any;
    meta: {
        createdAt: number;
        ttl: number;
    }
}

interface IOptions {
    ttl?: number;
    isLazy?: boolean;
    isCachedForever?: boolean;
}

export class ExpirationStrategy extends AbstractBaseStrategy {

    constructor(storage: StorageTypes) {
        super(storage)
    }

    public async getItem<T>(key: string): Promise<T|undefined> {
        const item = await this.storage.getItem<IExpiringCacheItem>(key)
        if (item && item.meta && item.meta.ttl && this.isItemExpired(item)) {
            await this.storage.setItem(key, undefined)
            return undefined
        }
        return item ? item.content : undefined
    }

    public async setItem(key: string, content: any, options: IOptions): Promise<void> {
        options = {ttl: 60, isLazy: true, isCachedForever: false, ...options}

        const meta: any = {}

        if (!options.isCachedForever) {
            meta.createdAt = Date.now()

            if (options.ttl) {
                meta.ttl = options.ttl
                if (!options.isLazy) {
                    setTimeout(() => {
                        this.unsetKey(key)
                    }, options.ttl)
                }
            }


        }
        await this.storage.setItem(key, {meta, content})
    }

    public async clear(): Promise<void> {
        await this.storage.clear()
    }

    private isItemExpired(item: IExpiringCacheItem): boolean {
        return Date.now() > item.meta.createdAt + item.meta.ttl
    }

    private async unsetKey(key: string): Promise<void> {
        await this.storage.setItem(key, undefined)
    }
}
