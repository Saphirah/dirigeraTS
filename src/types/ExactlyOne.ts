﻿export type ExactlyOne<T> = {
  [K in keyof T]: Record<K, T[K]> & Partial<Record<Exclude<keyof T, K>, never>>
}[keyof T]
