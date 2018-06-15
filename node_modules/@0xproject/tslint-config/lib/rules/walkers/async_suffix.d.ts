import * as Lint from 'tslint';
import * as ts from 'typescript';
export declare class AsyncSuffixWalker extends Lint.RuleWalker {
    static FAILURE_STRING: string;
    visitMethodDeclaration(node: ts.MethodDeclaration): void;
}
