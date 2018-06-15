import { LogWithDecodedArgs } from '@0xproject/types';
import { BigNumber } from '@0xproject/utils';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import { BlockRange, EventCallback, IndexedFilterValues, TransactionOpts } from '../types';
import { ContractWrapper } from './contract_wrapper';
import { EtherTokenContractEventArgs, EtherTokenEvents } from './generated/ether_token';
import { TokenWrapper } from './token_wrapper';
/**
 * This class includes all the functionality related to interacting with a wrapped Ether ERC20 token contract.
 * The caller can convert ETH into the equivalent number of wrapped ETH ERC20 tokens and back.
 */
export declare class EtherTokenWrapper extends ContractWrapper {
    private _etherTokenContractsByAddress;
    private _tokenWrapper;
    constructor(web3Wrapper: Web3Wrapper, networkId: number, tokenWrapper: TokenWrapper);
    /**
     * Deposit ETH into the Wrapped ETH smart contract and issues the equivalent number of wrapped ETH tokens
     * to the depositor address. These wrapped ETH tokens can be used in 0x trades and are redeemable for 1-to-1
     * for ETH.
     * @param   etherTokenAddress   EtherToken address you wish to deposit into.
     * @param   amountInWei         Amount of ETH in Wei the caller wishes to deposit.
     * @param   depositor           The hex encoded user Ethereum address that would like to make the deposit.
     * @param   txOpts              Transaction parameters.
     * @return Transaction hash.
     */
    depositAsync(etherTokenAddress: string, amountInWei: BigNumber, depositor: string, txOpts?: TransactionOpts): Promise<string>;
    /**
     * Withdraw ETH to the withdrawer's address from the wrapped ETH smart contract in exchange for the
     * equivalent number of wrapped ETH tokens.
     * @param   etherTokenAddress   EtherToken address you wish to withdraw from.
     * @param   amountInWei  Amount of ETH in Wei the caller wishes to withdraw.
     * @param   withdrawer   The hex encoded user Ethereum address that would like to make the withdrawal.
     * @param   txOpts       Transaction parameters.
     * @return Transaction hash.
     */
    withdrawAsync(etherTokenAddress: string, amountInWei: BigNumber, withdrawer: string, txOpts?: TransactionOpts): Promise<string>;
    /**
     * Gets historical logs without creating a subscription
     * @param   etherTokenAddress   An address of the ether token that emitted the logs.
     * @param   eventName           The ether token contract event you would like to subscribe to.
     * @param   blockRange          Block range to get logs from.
     * @param   indexFilterValues   An object where the keys are indexed args returned by the event and
     *                              the value is the value you are interested in. E.g `{_owner: aUserAddressHex}`
     * @return  Array of logs that match the parameters
     */
    getLogsAsync<ArgsType extends EtherTokenContractEventArgs>(etherTokenAddress: string, eventName: EtherTokenEvents, blockRange: BlockRange, indexFilterValues: IndexedFilterValues): Promise<Array<LogWithDecodedArgs<ArgsType>>>;
    /**
     * Subscribe to an event type emitted by the Token contract.
     * @param   etherTokenAddress   The hex encoded address where the ether token is deployed.
     * @param   eventName           The ether token contract event you would like to subscribe to.
     * @param   indexFilterValues   An object where the keys are indexed args returned by the event and
     *                              the value is the value you are interested in. E.g `{_owner: aUserAddressHex}`
     * @param   callback            Callback that gets called when a log is added/removed
     * @return Subscription token used later to unsubscribe
     */
    subscribe<ArgsType extends EtherTokenContractEventArgs>(etherTokenAddress: string, eventName: EtherTokenEvents, indexFilterValues: IndexedFilterValues, callback: EventCallback<ArgsType>): string;
    /**
     * Cancel a subscription
     * @param   subscriptionToken Subscription token returned by `subscribe()`
     */
    unsubscribe(subscriptionToken: string): void;
    /**
     * Cancels all existing subscriptions
     */
    unsubscribeAll(): void;
    /**
     * Retrieves the Ethereum address of the EtherToken contract deployed on the network
     * that the user-passed web3 provider is connected to. If it's not Kovan, Ropsten, Rinkeby, Mainnet or TestRPC
     * (networkId: 50), it will return undefined (e.g a private network).
     * @returns The Ethereum address of the EtherToken contract or undefined.
     */
    getContractAddressIfExists(): string | undefined;
    private _invalidateContractInstance();
    private _getEtherTokenContractAsync(etherTokenAddress);
}
