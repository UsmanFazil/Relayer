"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var _0x_js_1 = require("0x.js");
var connect_1 = require("@0xproject/connect");
var utils_1 = require("@0xproject/utils");
var Web3 = require("web3");
var provider = new Web3.providers.HttpProvider('http://localhost:8545');
// Instantiate 0x.js instance
var zeroExConfig = {
    networkId: 50,
};
var zeroEx = new _0x_js_1.ZeroEx(provider, zeroExConfig);
// Instantiate relayer client pointing to a local server on port 3000
var relayerApiUrl = 'http://localhost:3000/v0';
var relayerClient = new connect_1.HttpClient(relayerApiUrl);
var mainAsync = function () { return __awaiter(_this, void 0, void 0, function () {
    var TokenA, TokenB, wethTokenInfo, zrxTokenInfo, WETH_ADDRESS, ZRX_ADDRESS, orderbookRequest, orderbookResponse, bidfill, addresses, takerAddress, ethAmount, ethToConvert, convertEthTxHash, setTakerAllowTxHash, fillTxHash, takerr;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                TokenA = 'WETH';
                TokenB = 'ZRX';
                return [4 /*yield*/, zeroEx.tokenRegistry.getTokenBySymbolIfExistsAsync(TokenA)];
            case 1:
                wethTokenInfo = _a.sent();
                return [4 /*yield*/, zeroEx.tokenRegistry.getTokenBySymbolIfExistsAsync(TokenB)];
            case 2:
                zrxTokenInfo = _a.sent();
                if (wethTokenInfo === undefined || zrxTokenInfo === undefined) {
                    throw new Error('Invalid Token');
                }
                WETH_ADDRESS = wethTokenInfo.address;
                ZRX_ADDRESS = zrxTokenInfo.address;
                orderbookRequest = {
                    baseTokenAddress: ZRX_ADDRESS,
                    quoteTokenAddress: WETH_ADDRESS,
                };
                return [4 /*yield*/, relayerClient.getOrderbookAsync(orderbookRequest)];
            case 3:
                orderbookResponse = _a.sent();
                bidfill = orderbookResponse.asks[0];
                console.log(bidfill);
                return [4 /*yield*/, zeroEx.getAvailableAddressesAsync()];
            case 4:
                addresses = _a.sent();
                takerAddress = addresses[1];
                ethAmount = new utils_1.BigNumber(2);
                ethToConvert = _0x_js_1.ZeroEx.toBaseUnitAmount(ethAmount, 18);
                return [4 /*yield*/, zeroEx.etherToken.depositAsync(WETH_ADDRESS, ethToConvert, takerAddress)];
            case 5:
                convertEthTxHash = _a.sent();
                return [4 /*yield*/, zeroEx.awaitTransactionMinedAsync(convertEthTxHash)];
            case 6:
                _a.sent();
                console.log(ethAmount + " ETH -> WETH conversion mined...");
                return [4 /*yield*/, zeroEx.token.setUnlimitedProxyAllowanceAsync(WETH_ADDRESS, takerAddress)];
            case 7:
                setTakerAllowTxHash = _a.sent();
                return [4 /*yield*/, zeroEx.awaitTransactionMinedAsync(setTakerAllowTxHash)];
            case 8:
                _a.sent();
                return [4 /*yield*/, zeroEx.exchange.fillOrderAsync(bidfill, bidfill.takerTokenAmount, true, takerAddress)];
            case 9:
                fillTxHash = _a.sent();
                return [4 /*yield*/, zeroEx.awaitTransactionMinedAsync(fillTxHash)];
            case 10:
                _a.sent();
                console.log("order filled");
                return [4 /*yield*/, zeroEx.token.getBalanceAsync(WETH_ADDRESS, takerAddress)];
            case 11:
                takerr = _a.sent();
                console.log('Taker WETH Balance ' + _0x_js_1.ZeroEx.toUnitAmount(takerr, wethTokenInfo.decimals).toString());
                return [2 /*return*/];
        }
    });
}); };
mainAsync().catch(console.error);
//# sourceMappingURL=fill.js.map