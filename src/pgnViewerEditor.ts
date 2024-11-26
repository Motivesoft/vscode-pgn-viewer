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

    // Watch for any configuration changes and react immediately
    const changeConfigurationSubscription = vscode.workspace.onDidChangeConfiguration(e => {
      if ( e.affectsConfiguration('vscode-pgn-viewer.pieceStyle') ||
           e.affectsConfiguration('vscode-pgn-viewer.theme') ||
           e.affectsConfiguration('vscode-pgn-viewer.layout') ||
           e.affectsConfiguration('vscode-pgn-viewer.notationLayout') ||
           e.affectsConfiguration('vscode-pgn-viewer.moveNotation') ||
           e.affectsConfiguration('vscode-pgn-viewer.showCoordinates') ||
           e.affectsConfiguration('vscode-pgn-viewer.showFen') ||
           e.affectsConfiguration('vscode-pgn-viewer.showHeaders') ||
           e.affectsConfiguration('vscode-pgn-viewer.showResult') ||
           e.affectsConfiguration('vscode-pgn-viewer.showGameSelector') ||
           e.affectsConfiguration('vscode-pgn-viewer.boardSize') ||
           e.affectsConfiguration('vscode-pgn-viewer.movesWidth') ||
           e.affectsConfiguration('vscode-pgn-viewer.movesHeight') ) {
        webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);
        updateWebview();
      }
    });

    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
      changeConfigurationSubscription.dispose();
    });

    webviewPanel.onDidChangeViewState( e => {
        if (e.webviewPanel.visible) {
          updateWebview();
        }
      },
      null,
      [ 
        changeDocumentSubscription, 
        changeConfigurationSubscription
      ]
    );

    updateWebview();
  }

  private getHtmlForWebview(webview: vscode.Webview): string {
    // OK, so make this work in both the development environment and when built using 'vcse package', then we do this:
    // 1) npm i @mliebelt/pgn-viewer
    // 2) copy the dist.js from that package to our 'dist' folder using the "copy-files" script in package.json
    //    - the dist folder is already going be part of the resultant vsix when packaged
    //    - the copy is automated to occur when installing, packaging and building for debugging 
    // 3) reference the copied module using the code below, which will now work correctly whatever the launch semantics
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'dist', 'dist.js')
    );

    const configuration = vscode.workspace.getConfiguration("vscode-pgn-viewer");
    const pieceStyle = configuration.get("pieceStyle");
    const theme = configuration.get("theme");
    const layout = configuration.get("layout");
    const notationLayout = configuration.get("notationLayout");
    const moveNotation = configuration.get("moveNotation");
    const showCoordinates = configuration.get("showCoordinates");
    const showFen = configuration.get("showFen");
    const showHeaders = configuration.get("showHeaders");
    const showResult = configuration.get("showResult");
    const showGameSelector = configuration.get("showGameSelector");
    const boardSize = configuration.get("boardSize") as number;
    const movesWidth = configuration.get("movesWidth") as number;
    const movesHeight = configuration.get("movesHeight") as number;

    // if orientation is left/right, overall width is the sum of board and move size
    // otherwise its the max of them
    let width = 0;
    if (layout === "left" || layout === "right") {
      width = boardSize + movesWidth;
    } else {
      width = Math.max( boardSize + movesWidth );
    }

    // Add a bit for good measure (borders, scrollbars, other decorations)
    width += 100;

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
            color: var(--vscode-editor-foreground);
          }
          .pgnvjs .moves {
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
          }
          .pgnvjs .buttons {
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
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
                  manyGames: ${showGameSelector},
                  pieceStyle: "${pieceStyle}",
                  theme: "${theme}",
                  layout: "${layout}",
                  notation: "${moveNotation}",
                  notationLayout: "${notationLayout}",
                  resizable: false,
                  showCoords: ${showCoordinates},
                  coordsInner: true,
                  showFen: ${showFen},
                  showResult: ${showResult},
                  headers: ${showHeaders},
                  boardSize: "${boardSize}px",
                  movesWidth: "${movesWidth}px",
                  movesHeight: "${movesHeight}px",
                  width: "${width}px",
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