import * as Redis from 'redis'

export interface RedisClient extends Redis.RedisClient {
    getAsync?(arg: string): Promise<string>;

    delAsync?(arg: string): Promise<void>;

    setAsync?(arg: string, arg2: string): Promise<void>;

    flushdbAsync?(): Promise<void>;
}
