'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { window, commands, Disposable, ExtensionContext, TextDocument } from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let headerGen = new HeaderGenerator();
    var disposable = vscode.commands.registerCommand('extension.licenseHeader', () => {
        // The code you place here will be executed every time your command is executed
        headerGen.insertHeader();
    });

    context.subscriptions.push(headerGen);
    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

class HeaderGenerator {
    private disposable: Disposable;

    public getTime() {
        const date = new Date();

        const year = date.getFullYear();
        const month = (date.getMonth() + 100 + 1).toString().slice(1, 3);
        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

        return `${year}/${month}/${day}`;
    }

    public insertHeader() {
        // Get the current text editor 
        let editor = vscode.window.activeTextEditor;
        const config = vscode.workspace.getConfiguration('licenseheader');

        if (!editor) {
            return;
        }

        // Define header content
        var header = `/*\r * MIT License\n *\r * ${config.CopiedBy}\n *\r * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the 'Software'), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\r * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\r * The above copyright notice and this permission notice shall be included in all\n * copies or substantial portions of the Software.\n *\r * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\n * SOFTWARE.\n */\n\r/*\n * Revision History:\n *     Initial: ${this.getTime()}      ${config.Author}\n */\n\r`;

        // Get the document
        var doc = editor.document;

        // Insert header
        editor.edit((editor) => {
            editor.insert(doc.positionAt(0), header);
        });
    }

    dispose() {
        this.disposable.dispose();
    }
}

exports.activate = activate;
