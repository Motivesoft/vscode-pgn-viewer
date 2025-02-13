# Change Log

## [1.2.2]

- Updated dependencies in response to [CVE-2025-25200](https://github.com/advisories/GHSA-593f-38f6-jp5m) 

## [1.2.1]

- Allow the system to cope with backslash characters in text strings 

## [1.2.0]

- Display a dropdown selector to choose which game to show if the PGN contains multiple. This is configurable
- Updated to latest versions of a couple of dependencies

## [1.1.0]

- Allow configuration of the board and moves list etc. See [Extension Settings](README.md#extension-settings)

## [1.0.2]

- Ensure the page redraws if the user changes tab

## [1.0.1]

- Documentation tweaks

## [1.0.0]

- Initial release
- Provides an interactive viewer for chess games stored as PGN files
- The viewer is registered as the default handler for `.pgn` files, and provides an `Open In PGN Viewer` command
- The viewer displays a board, move list and annotations. These are fully interactive to allow the moves to be played and reviewed
- This extension works with Code on the desktop and for the web (e.g. [vscode.dev](https://vscode.dev))
- The PGN viewer uses background and foreground colors from the current editor theme
- More layout and configuration options will be provided in a subsequent update

[1.2.2]: https://github.com/Motivesoft/vscode-pgn-viewer/releases/tag/v1.2.2
[1.2.1]: https://github.com/Motivesoft/vscode-pgn-viewer/releases/tag/v1.2.1
[1.2.0]: https://github.com/Motivesoft/vscode-pgn-viewer/releases/tag/v1.2.0
[1.1.0]: https://github.com/Motivesoft/vscode-pgn-viewer/releases/tag/v1.1.0
[1.0.2]: https://github.com/Motivesoft/vscode-pgn-viewer/releases/tag/v1.0.2
[1.0.1]: https://github.com/Motivesoft/vscode-pgn-viewer/releases/tag/v1.0.1
[1.0.0]: https://github.com/Motivesoft/vscode-pgn-viewer/releases/tag/v1.0.0
