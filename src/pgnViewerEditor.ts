import * as vscode from 'vscode';

export class PgnViewerEditorProvider implements vscode.CustomTextEditorProvider {
  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new PgnViewerEditorProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(
        PgnViewerEditorProvider.viewType,
      provider
    );
    return providerRegistration;
  }

  private static readonly viewType = 'vscode-pgn-viewer.readonlyView';

  constructor(private readonly context: vscode.ExtensionContext) {}

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    webviewPanel.webview.options = {
      enableScripts: true,
    };
    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

    const updateWebview = () => {
      webviewPanel.webview.postMessage({
        type: 'update',
        content: document.getText(),
      });
    };

    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
      if (e.document.uri.toString() === document.uri.toString()) {
        updateWebview();
      }
    });

    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
    });

    updateWebview();
  }

  private getHtmlForWebview(webview: vscode.Webview): string {
    vscode.window.showInformationMessage(vscode.Uri.joinPath(this.context.extensionUri, 'dist.js').toString());
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'dist.js')
    );

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="${scriptUri}"></script>
        <title>Chess Board</title>
      </head>
      <body>
        <div id="board"></div>
        <script>
          const vscode = acquireVsCodeApi();
          window.addEventListener('message', event => {
            const message = event.data;
            switch (message.type) {
              case 'update':
                PGNV.pgnView('board', { pgn: message.content });
                break;
            }
          });
        </script>
      </body>
      </html>
    `;
  }
}