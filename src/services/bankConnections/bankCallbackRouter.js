/**
 * Bank Callback Processor Router
 * Routes callback processing to the appropriate bank handler
 */

import {processCeskaSporiitelnaCallback} from './ceskaSporitelnaConnection';
import {processKBCallback} from './kbConnection';
import {processAirBankCallback} from './airBankConnection';

/**
 * Route callback processing to the appropriate handler
 */
export const routeCallbackProcessing = async (bankId, code, axiosClient, token) => {
    const callbackProcessors = {
        'ceska-sporitelna': processCeskaSporiitelnaCallback,
        'kb': processKBCallback,
        'air-bank': processAirBankCallback,
    };

    const processor = callbackProcessors[bankId];

    if (!processor) {
        throw new Error(`No callback processor found for bank: ${bankId}`);
    }

    return await processor(code, axiosClient, token);
};

