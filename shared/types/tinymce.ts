export interface TinyMceEditor {
  on: Function;
  setContent: Function;
  getContent: Function;
  insertContent: Function;
  selection: {
    getNode: Function;
    setCursorLocation: Function;
  };
  dom: {
    insertAfter: Function;
    create: Function;
  };
  editorCommands: {
    commands: {
      exec: {
        mceinsertnewline: Function;
        mceinsertcontent: Function;
      };
    };
  };
  windowManager: {
    open: Function;
    confirm: Function;
  };
  editorManager: {
    activeEditor: {
      selection: {
        getContent: Function;
        setContent: Function;
        getNode: Function;
      };
    };
    execCommand: Function;
  };
  activeEditor: {
    execCommand: Function;
  };
  ui: {
    registry: {
      addButton: Function;
      addMenuItem: Function;
    };
  };
}
