declare module '@mliebelt/pgn-viewer' {
    interface PgnViewerOptions {
      pgn?: string;
      locale?: string;
      startPlay?: number;
      showCoords?: boolean;
      orientation?: 'white' | 'black';
      showFen?: boolean;
      showResult?: boolean;
      // Add more options as needed
    }
  
    function pgnView(boardId: string, options: PgnViewerOptions): void;
    function pgnEdit(boardId: string, options: PgnViewerOptions): void;
    function pgnBoard(boardId: string, options: PgnViewerOptions): void;
  
    // Export the functions
    export { pgnView, pgnEdit, pgnBoard };
  }