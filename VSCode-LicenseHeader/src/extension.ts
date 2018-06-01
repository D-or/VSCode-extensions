'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { window, commands, Disposable, ExtensionContext, TextDocument } from 'vscode';
import axios from 'axios';

// import http = require('http');

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
        const { CopiedBy, Author, LicenseName, LicenseUrl } = config;

        if (!editor) {
            return;
        }

        vscode.window.showInformationMessage('Wait a minute.');

        axios.get(LicenseUrl)
            .then(response => {
                let license = "(License Content)";
                const { status, data } = response;
                if (status === 200) {
                    if (data.match(/<!DOCTYPE html>/)) {
                        vscode.window.showWarningMessage('The provided url may be wrong.');
                    } else {
                        license = data;
                    }

                    // Define header content
                    let header = `/*\r * ${LicenseName} License\n *\r * ${CopiedBy}\n *\r ${license} \n */\n\r/*\n * Revision History:\n *     Initial:        ${this.getTime()}        ${Author}\n */\n\r`;

                    // Get the document
                    let doc = editor.document;

                    // Insert header
                    editor.edit((editor) => {
                        editor.insert(doc.positionAt(0), header);
                    });
                }
            })
            .catch(error => {
                vscode.window.showErrorMessage('There seems to be something wrong with your network.');
            });
    }

    dispose() {
        this.disposable.dispose();
    }
}

exports.activate = activate;
