/**
 * Bank Callback Processor Router
 * Routes callback processing to the appropriate bank handler
 */

import {processCeskaSporitelnaCallback} from './ceskaSporitelnaConnection';
import {processKBCallback} from './kbConnection';
import {processAirBankCallback} from './airBankConnection';

/**
 * Route callback processing to the appropriate handler
 */
export const routeCallbackProcessing = async (bankId, code, axiosClient, token) => {
    const callbackProcessors = {
        'ceska-sporitelna': processCeskaSporitelnaCallback,
        'kb': processKBCallback,
        'air-bank': processAirBankCallback,
    };

    const processor = callbackProcessors[bankId];

    if (!processor) {
        throw new Error(`No callback processor found for bank: ${bankId}`);
    }

    return await processor(bankId, code, axiosClient, token);
};

