import {
    ZeroEx,
    ZeroExConfig,
} from '0x.js';
import {
    FeesRequest,
    FeesResponse,
    HttpClient,
    Order,
    OrderbookRequest,
    OrderbookResponse,
    SignedOrder,
} from '@0xproject/connect';
import { BigNumber } from '@0xproject/utils';
import * as Web3 from 'web3';

const provider = new Web3.providers.HttpProvider('http://localhost:8545');

    // Instantiate 0x.js instance
    const zeroExConfig: ZeroExConfig = {
        networkId: 50, // testrpc
    };
    const zeroEx = new ZeroEx(provider, zeroExConfig);

    // Instantiate relayer client pointing to a local server on port 3000
    const relayerApiUrl = 'http://localhost:3000/v0';
    const relayerClient = new HttpClient(relayerApiUrl);


    const mainAsync = async () => {
        
        const TokenA= 'WETH';
        const TokenB= 'ZRX';

        const wethTokenInfo = await zeroEx.tokenRegistry.getTokenBySymbolIfExistsAsync(TokenA);
        const zrxTokenInfo = await zeroEx.tokenRegistry.getTokenBySymbolIfExistsAsync(TokenB);

        if (wethTokenInfo === undefined || zrxTokenInfo === undefined) {
            throw new Error('Invalid Token');
        }

        const WETH_ADDRESS = wethTokenInfo.address;
        const ZRX_ADDRESS = zrxTokenInfo.address;
        
        const orderbookRequest: OrderbookRequest = {
            baseTokenAddress: ZRX_ADDRESS,
            quoteTokenAddress: WETH_ADDRESS,
        };

        const orderbookResponse: OrderbookResponse = await relayerClient.getOrderbookAsync(orderbookRequest);

        const bidfill= orderbookResponse.asks[0];

        console.log(bidfill);

        const addresses = await zeroEx.getAvailableAddressesAsync();
        const takerAddress= addresses[1];

        const ethAmount = new BigNumber(2);
        const ethToConvert = ZeroEx.toBaseUnitAmount(ethAmount, 18); 
    
        const convertEthTxHash = await zeroEx.etherToken.depositAsync(WETH_ADDRESS, ethToConvert, takerAddress);
        await zeroEx.awaitTransactionMinedAsync(convertEthTxHash);
        console.log(`${ethAmount} ETH -> WETH conversion mined...`);

        const setTakerAllowTxHash = await zeroEx.token.setUnlimitedProxyAllowanceAsync(WETH_ADDRESS, takerAddress);
        await zeroEx.awaitTransactionMinedAsync(setTakerAllowTxHash);

        const fillTxHash = await zeroEx.exchange.fillOrderAsync(bidfill, bidfill.takerTokenAmount, true, takerAddress);
        await zeroEx.awaitTransactionMinedAsync(fillTxHash);

        console.log("order filled");
        
        const takerr = await zeroEx.token.getBalanceAsync(WETH_ADDRESS, takerAddress);
        console.log('Taker WETH Balance ' + ZeroEx.toUnitAmount(takerr, wethTokenInfo.decimals).toString());


    };

    mainAsync().catch(console.error);