import * as vscode from 'vscode';

export class PgnViewerEditorProvider implements vscode.CustomReadonlyEditorProvider {

    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        return vscode.window.registerCustomEditorProvider(
            "vscode-pgn-viewer.readonlyView",
            new PgnViewerEditorProvider(context),
            {
                supportsMultipleEditorsPerDocument: false,
            }
        );
    }

    constructor(private readonly context: vscode.ExtensionContext) {}

    async openCustomDocument(uri: vscode.Uri): Promise<vscode.CustomDocument> {
        return { uri, dispose: () => {} };
    }

    async resolveCustomEditor(
        document: vscode.CustomDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {
        webviewPanel.webview.options = {
            enableScripts: true,
        };

        const pgnContent = await vscode.workspace.fs.readFile(document.uri);
        const pgnString = Buffer.from(pgnContent).toString('utf8');

        webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview, pgnString);
    }

    private getHtmlForWebview(webview: vscode.Webview, pgnString: string): string {
        // const parsedJson = JSON.parse(pgnString);
        // const formattedJson = JSON.stringify(parsedJson, null, 2);

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>PGN Viewer</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    pre { background-color: #444444; padding: 10px; }
                </style>
            </head>
            <body>
                <h1>PGN Viewer</h1>
                <pre>${this.escapeHtml(pgnString)}</pre>
            </body>
            </html>
        `;
    }

    private escapeHtml(unsafe: string): string {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}