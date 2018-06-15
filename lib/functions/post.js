"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
    var TokenA, TokenB, wethTokenInfo, zrxTokenInfo, WETH_ADDRESS, ZRX_ADDRESS, EXCHANGE_ADDRESS, addresses, makerAddress, setMakerAllowTxHash, MakerTokenAmount, TakerTokenAmount, Time, feesRequest, feesResponse, order, orderHash, ecSignature, signedOrder, makaer;
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
                return [4 /*yield*/, zeroEx.exchange.getContractAddress()];
            case 3:
                EXCHANGE_ADDRESS = _a.sent();
                return [4 /*yield*/, zeroEx.getAvailableAddressesAsync()];
            case 4:
                addresses = _a.sent();
                makerAddress = addresses[0];
                return [4 /*yield*/, zeroEx.token.setUnlimitedProxyAllowanceAsync(ZRX_ADDRESS, makerAddress)];
            case 5:
                setMakerAllowTxHash = _a.sent();
                return [4 /*yield*/, zeroEx.awaitTransactionMinedAsync(setMakerAllowTxHash)];
            case 6:
                _a.sent();
                MakerTokenAmount = _0x_js_1.ZeroEx.toBaseUnitAmount(new utils_1.BigNumber(0.1), zrxTokenInfo.decimals);
                TakerTokenAmount = _0x_js_1.ZeroEx.toBaseUnitAmount(new utils_1.BigNumber(0.2), wethTokenInfo.decimals);
                Time = new utils_1.BigNumber(Date.now() + 360000);
                feesRequest = {
                    exchangeContractAddress: EXCHANGE_ADDRESS,
                    maker: makerAddress,
                    taker: _0x_js_1.ZeroEx.NULL_ADDRESS,
                    makerTokenAddress: ZRX_ADDRESS,
                    takerTokenAddress: WETH_ADDRESS,
                    makerTokenAmount: MakerTokenAmount,
                    takerTokenAmount: TakerTokenAmount,
                    expirationUnixTimestampSec: Time,
                    salt: _0x_js_1.ZeroEx.generatePseudoRandomSalt(),
                };
                return [4 /*yield*/, relayerClient.getFeesAsync(feesRequest)];
            case 7:
                feesResponse = _a.sent();
                order = __assign({}, feesRequest, feesResponse);
                orderHash = _0x_js_1.ZeroEx.getOrderHashHex(order);
                return [4 /*yield*/, zeroEx.signOrderHashAsync(orderHash, makerAddress, false)];
            case 8:
                ecSignature = _a.sent();
                signedOrder = __assign({}, order, { ecSignature: ecSignature });
                return [4 /*yield*/, relayerClient.submitOrderAsync(signedOrder)];
            case 9:
                _a.sent();
                console.log("order posted");
                return [4 /*yield*/, zeroEx.token.getBalanceAsync(ZRX_ADDRESS, makerAddress)];
            case 10:
                makaer = _a.sent();
                console.log('Maker ZRX balance ' + _0x_js_1.ZeroEx.toUnitAmount(makaer, zrxTokenInfo.decimals).toString());
                return [2 /*return*/];
        }
    });
}); };
mainAsync().catch(console.error);
//# sourceMappingURL=post.js.map