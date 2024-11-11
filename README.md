# PGN Viewer

This extension provides an interactive viewer for chess Portable Game Notation (pgn) files. The viewer shows the game details, moves and a board on which to play through the moves.

The PGN viewer uses background and foreground colors from the current editor theme, for example, to display in dark or light:
![Showing two different themes](images/themes.png)

## Features

When the user opens a `.pgn` file, the extension will automatically open the file in its viewer. The board and move list will be displayed and the user can play through the moves by clicking on them or the navigation buttons below the board.

Alternately, if the PGN text is already open in an editor window, choosing the `Open In PGN Viewer` command from the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac) will open the file in this viewer.

If a directory is open in the editor, a `.pgn` file can be opened directly by selecting it, or right-click on the file, select `Open With...` and choose `PGN Viewer` from the menu.

## Requirements

Uses [@mliebelt/pgn-viewer](https://www.npmjs.com/package/@mliebelt/pgn-viewer).

## Extension Settings

None, but some to be added in a subsequent release

## Known Issues

Results are unknown if the provided PGN data is invalid.

## Release Notes

### 1.0.0

- Initial release
- Provides an interactive viewer for chess games stored as PGN files
- The viewer is registered as the default handler for `.pgn` files, and provides an `Open In PGN Viewer` command
- The viewer displays a board, move list and annotations. These are fully interactive to allow the moves to be played and reviewed
- This extension works with Code on the desktop and for the web (e.g. [vscode.dev](https://vscode.dev))
- The PGN viewer uses background and foreground colors from the current editor theme
- More layout and configuration options will be provided in a subsequent update

