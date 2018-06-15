<<<<<<< HEAD
import {ZeroEx,ZeroExConfig} from '0x.js';
import * as Web3 from 'web3';
import{BigNumber} from '@0xproject/utils';
import {
    FeesRequest,
    FeesResponse,
    Order,
    OrderbookRequest,
    OrderbookResponse,
    HttpClient,
    SignedOrder,    
} from '@0xproject/connect';


const provider = new Web3.providers.HttpProvider('http://localhost:8545');
const configs = {
    networkId: 50,
};

const zeroEx= new ZeroEx(provider,configs);

const relayerapi = 'http://localhost:3000/v0';
const relayerClient = new HttpClient(relayerapi);

const mainAsync = async () =>{
    const ZRXaddress= await zeroEx.exchange.getZRXTokenAddress();
    const WETHaddress = await zeroEx.etherToken.getContractAddressIfExists() as string;
    
    const orderbookRequest: OrderbookRequest = {
        baseTokenAddress: ZRXaddress,
        quoteTokenAddress: WETHaddress,
    };

    const orderbookResponse: OrderbookResponse = await relayerClient.getOrderbookAsync(orderbookRequest);

    console.log(orderbookResponse);
   const sortedBids = orderbookResponse.bids.sort((orderA, orderB) => {
    const orderRateA = (new BigNumber(orderA.makerTokenAmount)).div(new BigNumber(orderA.takerTokenAmount));
    const orderRateB = (new BigNumber(orderB.makerTokenAmount)).div(new BigNumber(orderB.takerTokenAmount));
    return orderRateB.comparedTo(orderRateA);
});
   const rates = sortedBids.map(order => {
    const rate = (new BigNumber(order.makerTokenAmount)).div(new BigNumber(order.takerTokenAmount));
    return (rate.toString() + ' ZRX/WETH');
});
console.log(rates);

};
mainAsync().catch(console.error);
=======
import {ZeroEx,ZeroExConfig} from '0x.js';
import * as Web3 from 'web3';
import{BigNumber} from '@0xproject/utils';
import {
    FeesRequest,
    FeesResponse,
    Order,
    OrderbookRequest,
    OrderbookResponse,
    HttpClient,
    SignedOrder,    
} from '@0xproject/connect';


const provider = new Web3.providers.HttpProvider('http://localhost:8545');
const configs = {
    networkId: 50,
};

const zeroEx= new ZeroEx(provider,configs);

const relayerapi = 'http://localhost:3000/v0';
const relayerClient = new HttpClient(relayerapi);

const mainAsync = async () =>{
    const ZRXaddress= await zeroEx.exchange.getZRXTokenAddress();
    const WETHaddress = await zeroEx.etherToken.getContractAddressIfExists() as string;
    
    const orderbookRequest: OrderbookRequest = {
        baseTokenAddress: ZRXaddress,
        quoteTokenAddress: WETHaddress,
    };

    const orderbookResponse: OrderbookResponse = await relayerClient.getOrderbookAsync(orderbookRequest);

    console.log(orderbookResponse);
   const sortedBids = orderbookResponse.bids.sort((orderA, orderB) => {
    const orderRateA = (new BigNumber(orderA.makerTokenAmount)).div(new BigNumber(orderA.takerTokenAmount));
    const orderRateB = (new BigNumber(orderB.makerTokenAmount)).div(new BigNumber(orderB.takerTokenAmount));
    return orderRateB.comparedTo(orderRateA);
});
   const rates = sortedBids.map(order => {
    const rate = (new BigNumber(order.makerTokenAmount)).div(new BigNumber(order.takerTokenAmount));
    return (rate.toString() + ' ZRX/WETH');
});
console.log(rates);

};
mainAsync().catch(console.error);
>>>>>>> 829c40f4c24fc312aaa04b6b64680ea5d2ca9fc9
