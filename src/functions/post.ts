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
    TokenPairsItem,
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

        const EXCHANGE_ADDRESS = await zeroEx.exchange.getContractAddress();

        const addresses = await zeroEx.getAvailableAddressesAsync();

        const makerAddress= addresses[0];

        const setMakerAllowTxHash = await zeroEx.token.setUnlimitedProxyAllowanceAsync(ZRX_ADDRESS, makerAddress);
        await zeroEx.awaitTransactionMinedAsync(setMakerAllowTxHash);

        const MakerTokenAmount = ZeroEx.toBaseUnitAmount(new BigNumber(0.1), zrxTokenInfo.decimals);
        const TakerTokenAmount = ZeroEx.toBaseUnitAmount(new BigNumber(0.2), wethTokenInfo.decimals);
        const Time= new BigNumber(Date.now() + 360000);

        const feesRequest: FeesRequest = {
            exchangeContractAddress:EXCHANGE_ADDRESS,
            maker: makerAddress,
            taker: ZeroEx.NULL_ADDRESS,
            makerTokenAddress:ZRX_ADDRESS,
            takerTokenAddress:WETH_ADDRESS,
            makerTokenAmount:MakerTokenAmount,
            takerTokenAmount:TakerTokenAmount,
            expirationUnixTimestampSec:Time,
            salt: ZeroEx.generatePseudoRandomSalt(),
        }

        const feesResponse: FeesResponse = await relayerClient.getFeesAsync(feesRequest);

        const order:Order={
            ...feesRequest,
            ...feesResponse,
        }

        const orderHash= ZeroEx.getOrderHashHex(order);

        const ecSignature = await zeroEx.signOrderHashAsync(orderHash,makerAddress , false);
        
        const signedOrder: SignedOrder = {
            ...order,
            ecSignature,
        };

        await relayerClient.submitOrderAsync(signedOrder);

        console.log("order posted");

        const makaer = await zeroEx.token.getBalanceAsync(ZRX_ADDRESS, makerAddress);
        console.log('Maker ZRX balance ' + ZeroEx.toUnitAmount(makaer, zrxTokenInfo.decimals).toString());
        

    };

    mainAsync().catch(console.error);
