"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var Lint = require("tslint");
var ts = require("typescript");
var AsyncSuffixWalker = /** @class */ (function (_super) {
    __extends(AsyncSuffixWalker, _super);
    function AsyncSuffixWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AsyncSuffixWalker.prototype.visitMethodDeclaration = function (node) {
        var methodNameNode = node.name;
        var methodName = methodNameNode.getText();
        if (!_.isUndefined(node.type)) {
            if (node.type.kind === ts.SyntaxKind.TypeReference) {
                // tslint:disable-next-line:no-unnecessary-type-assertion
                var returnTypeName = node.type.typeName.getText();
                if (returnTypeName === 'Promise' && !methodName.endsWith('Async')) {
                    var failure = this.createFailure(methodNameNode.getStart(), methodNameNode.getWidth(), AsyncSuffixWalker.FAILURE_STRING);
                    this.addFailure(failure);
                }
            }
        }
        _super.prototype.visitMethodDeclaration.call(this, node);
    };
    AsyncSuffixWalker.FAILURE_STRING = 'async functions must have an Async suffix';
    return AsyncSuffixWalker;
}(Lint.RuleWalker));
exports.AsyncSuffixWalker = AsyncSuffixWalker;
//# sourceMappingURL=async_suffix.js.map