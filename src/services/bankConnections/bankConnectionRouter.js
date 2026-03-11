/**
 * Bank Connection Router
 * Routes connection requests to the appropriate bank handler
 */

import {handleCeskaSporitelnaConnection} from './ceskaSporitelnaConnection';
import {handleCSOBConnection} from './csobConnection';
import {handleKBConnection} from './kbConnection';
import {handleAirBankConnection} from './airBankConnection';
import {handleRaiffeisenBankConnection} from './raiffeisenBankConnection';

/**
 * Route bank connection to the appropriate handler
 */
export const routeBankConnection = (bank) => {
    const connectionHandlers = {
        'ceska-sporitelna': handleCeskaSporitelnaConnection,
        'csob': handleCSOBConnection,
        'kb': handleKBConnection,
        'air-bank': handleAirBankConnection,
        'reiffeisen-bank': handleRaiffeisenBankConnection,
    };

    const handler = connectionHandlers[bank.id];

    if (!handler) {
        throw new Error(`No connection handler found for bank: ${bank.id}`);
    }

    handler(bank);
};

