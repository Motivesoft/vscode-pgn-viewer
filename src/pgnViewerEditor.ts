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

  public static readonly viewType = 'vscode-pgn-viewer.readonlyView';

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
    // OK, so make this work in both the development environment and when built using 'vcse package', then we do this:
    // 1) npm i @mliebelt/pgn-viewer
    // 2) copy the dist.js from that package to our 'dist' folder using the "copy-files" script in package.json
    //    - the dist folder is already going be part of the resultant vsix when packaged
    //    - the copy is automated to occur when installing, packaging and debugging 
    // 3) reference the copied module using the code, below, which will now work correctly whatever the launch semantics
    vscode.window.showInformationMessage(vscode.Uri.joinPath(this.context.extensionUri, 'dist', './dist.js').toString());
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'dist', 'dist.js')
    );

    // Return the HTML for the page, including the script calls to display the board and the style stuff
    // to coloriize the page based on whatever the current theme is
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="${scriptUri}"></script>
        <title>Chess Board</title>
        <style>
          .pgnvjs
          {
            background-color: var(--vscode-editor-background);
          }
          .pgnvjs .moves {
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
          }
          .pgnvjs .buttons {
            background-color: var(--vscode-editor-background);
          }
          .pgnvjs .fen {
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
            font-family: Arial,sans-serif;
          }
          .pgnvjs .moves.list > move-number {
            background-color: var(--vscode-editor-background);
            border-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
          }
        </style>
      </head>
      <body>
        <div id="board"></div>
        <script>
          const vscode = acquireVsCodeApi();
          window.addEventListener('message', event => {
            const message = event.data;
            switch (message.type) {
              case 'update':
                PGNV.pgnView('board', { 
                  pgn: message.content,
                  figurine: "merida",
                  layout: "left",
                  notation: "long",
                  notationLayout: "list",
                  resizable: false,
                  showFen: true,
                  showResult: true,
                  width: "1000px",
                  boardSize: "400px",
                  movesWidth: "400px",
                  orientation: "white"
                });
                break;
            }
          });
        </script>
      </body>
      </html>
    `;
  }
}