// @ts-ignore
import { safeJsonParse } from '@jitsi/js-utils/json';

import { reportError } from './helpers';
import {jitsiLocalStorage} from "@jitsi/js-utils";

/**
 * A list if keys to ignore when parsing.
 *
 * @type {string[]}
 */
const blacklist = [ '__proto__', 'constructor', 'prototype' ];

/**
 * Parses the query/search or fragment/hash parameters out of a specific URL and
 * returns them as a JS object.
 *
 * @param {URL} url - The URL to parse.
 * @param {boolean} dontParse - If falsy, some transformations (for parsing the
 * value as JSON) will be executed.
 * @param {string} source - If {@code 'search'}, the parameters will parsed out
 * of {@code url.search}; otherwise, out of {@code url.hash}.
 * @returns {Object}
 */
export function parseURLParams(
        url: URL | string,
        dontParse = false,
        source = 'hash') {
    if (!url) {
        return {};
    }

    if (typeof url === 'string') {
        // eslint-disable-next-line no-param-reassign
        url = new URL(url);
    }
    const paramStr = source === 'search' ? url.search : url.hash;
    const params: any = {};
    const paramParts = paramStr?.substr(1).split('&') || [];

    // Detect and ignore hash params for hash routers.
    if (source === 'hash' && paramParts.length === 1) {
        const firstParam = paramParts[0];

        if (firstParam.startsWith('/') && firstParam.split('&').length === 1) {
            return params;
        }
    }

    paramParts.forEach((part: string) => {
        let param;
        if (part.includes('preRecUrl')) {
            param = part.substring(10, part.length)
        } else {
            param = part.split('=');
        }

        let key;
        if (part.includes('preRecUrl')) {
            key = 'preRecUrl'
        } else {
            key = param[0];
        }

        if (!key || key.split('.').some((k: string) => blacklist.includes(k))) {
            return;
        }

        let value: any = null;

        try {
            if (part.includes('preRecUrl')) {
                value = param
            } else {
                value = param[1];
            }

            // If key match skip
            if (key === 'preRecUrl') {
                jitsiLocalStorage.setItem(key, value);
                jitsiLocalStorage.getItem(key);
                return;
            }

            if (!dontParse) {
                const decoded = decodeURIComponent(value).replace(/\\&/, '&');

                value = decoded === 'undefined' ? undefined : safeJsonParse(decoded);
                jitsiLocalStorage.setItem(key,value);
                jitsiLocalStorage.getItem(key);
            }
        } catch (e: any) {
            reportError(
                e, `Failed to parse URL parameter value: ${String(value)}`);

            return;
        }
        params[key] = value;
    });

    return params;
}
