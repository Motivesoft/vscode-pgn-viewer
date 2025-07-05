import * as vscode from 'vscode';
import { PgnViewerEditorProvider } from './pgnViewerEditor';

export function activate(context: vscode.ExtensionContext) {
	// Register a command that will open the file in the currently active text editor in our PGN viewer
	context.subscriptions.push(vscode.commands.registerCommand('vscode-pgn-viewer.openInPgnViewer', (uri: vscode.Uri) => {
		// Get the open file
		if (!uri && vscode.window.activeTextEditor) {
		  uri = vscode.window.activeTextEditor.document.uri;
		}

		// If there is an open file, open it with our viewer via its provider
		if (uri) {
		  vscode.commands.executeCommand('vscode.openWith', uri, PgnViewerEditorProvider.viewType);
		}
	  })
	);

	// Register our viewer via its provider
    context.subscriptions.push(PgnViewerEditorProvider.register(context));
}

export function deactivate() {}
