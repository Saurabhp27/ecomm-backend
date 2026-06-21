import axios from 'axios';
import { USER_SERVICE_URL } from '../config/services.js';

let cachedPublicKey = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

let pendingFetch = null;

export async function getPublicKey() {
    if (cachedPublicKey && Date.now() - cacheTime < CACHE_TTL) {
        return cachedPublicKey;
    }

    // Someone is already fetching the key
    if (pendingFetch) {
        return pendingFetch;
    }

    pendingFetch = (async () => {
        try {
            const url = `${USER_SERVICE_URL.replace(/\/$/, '')}/publicKey`;
            const resp = await axios.get(url, {
                responseType: 'text'
            });

            cachedPublicKey = resp.data;
            cacheTime = Date.now();
            return cachedPublicKey;
        } finally {
            pendingFetch = null;
        }
    })();
    return pendingFetch;
}

export function clearPublicKeyCache() {
    cachedPublicKey = null;
    cacheTime = 0;
}
