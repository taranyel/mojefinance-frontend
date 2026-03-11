/**
 * Bank Callback Processor Router
 * Routes callback processing to the appropriate bank handler
 */

import {processCeskaSporiitelnaCallback} from './ceskaSporitelnaConnection';
import {processCSOBCallback} from './csobConnection';
import {processKBCallback} from './kbConnection';
import {processAirBankCallback} from './airBankConnection';
import {processRaiffeisenBankCallback} from './raiffeisenBankConnection';

/**
 * Route callback processing to the appropriate handler
 */
export const routeCallbackProcessing = async (bankId, code, axiosClient, token) => {
    const callbackProcessors = {
        'ceska-sporitelna': processCeskaSporiitelnaCallback,
        'csob': processCSOBCallback,
        'kb': processKBCallback,
        'air-bank': processAirBankCallback,
        'reiffeisen-bank': processRaiffeisenBankCallback,
    };

    const processor = callbackProcessors[bankId];

    if (!processor) {
        throw new Error(`No callback processor found for bank: ${bankId}`);
    }

    return await processor(code, axiosClient, token);
};

