import * as vscode from 'vscode';
import { PgnViewerEditorProvider } from './pgnViewerEditor';

export function activate(context: vscode.ExtensionContext) {

	console.log('Extension "vscode-pgn-viewer" is now active');

	const disposable = vscode.commands.registerCommand('vscode-pgn-viewer.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from PGN Viewer!');
	});

	context.subscriptions.push(disposable);

    context.subscriptions.push(PgnViewerEditorProvider.register(context));
}

export function deactivate() {}
