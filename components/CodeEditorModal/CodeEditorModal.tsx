import Editor from '@monaco-editor/react';
import { Dialog, DialogContent, DialogTitle, Tab, Tabs } from '@mui/material';
import React, { useEffect } from 'react';
import styles from './CodeEditorModal.module.css';

export interface CodeContext {
  before: string;
  main: string;
  after: string;
}

type EditorTab = keyof CodeContext;
interface CodeEditorModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  codeContext: CodeContext;
  setCodeContext: (codeContext: CodeContext) => void;
}

const CodeEditorModal: React.FC<CodeEditorModalProps> = ({
  open,
  setOpen,
  codeContext,
  setCodeContext,
}) => {
  const [currentTab, setCurrentTab] = React.useState<EditorTab>('main');

  useEffect(() => {
    setCurrentTab('main');
  }, [open]);

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: EditorTab
  ) => {
    setCurrentTab(newValue);
  };

  return (
    <Dialog open={open} scroll="paper" onClose={() => setOpen(false)}>
      <DialogTitle>Code Context</DialogTitle>
      <DialogContent dividers>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="before" label="Before (hidden)" />
          <Tab value="main" label="Main (visible)" />
          <Tab value="after" label="After (hidden)" />
        </Tabs>
        <div className={styles.editor}>
          {currentTab === 'before' && (
            <Editor
              height="20rem"
              defaultLanguage="javascript"
              theme="vs-dark"
              defaultValue={codeContext.before}
              onChange={(value) =>
                setCodeContext({ ...codeContext, before: value })
              }
            />
          )}
          {currentTab === 'main' && (
            <Editor
              height="20rem"
              defaultLanguage="javascript"
              theme="vs-dark"
              defaultValue={codeContext.main}
              onChange={(value) =>
                setCodeContext({ ...codeContext, main: value })
              }
            />
          )}
          {currentTab === 'after' && (
            <Editor
              height="20rem"
              defaultLanguage="javascript"
              theme="vs-dark"
              defaultValue={codeContext.after}
              onChange={(value) =>
                setCodeContext({ ...codeContext, after: value })
              }
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CodeEditorModal;
