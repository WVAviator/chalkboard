import Editor from '@monaco-editor/react';
import { Dialog, DialogContent, DialogTitle, Tab, Tabs } from '@mui/material';
import React from 'react';

type EditorTab = "before" | "main" | "after";

export interface CodeContext {
    before: string;
    main: string;
    after: string;
}

interface CodeEditorModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    codeContext: CodeContext;
    setCodeContext: (codeContext: CodeContext) => void;
}

const CodeEditorModal: React.FC<CodeEditorModalProps> = ({ open, setOpen, codeContext, setCodeContext }) => {

    const [currentTab, setCurrentTab] = React.useState<EditorTab>("main");

    const handleTabChange = (event: React.SyntheticEvent, newValue: EditorTab) => {
        setCurrentTab(newValue);
    }

    const handleEditorChange = (value: string | undefined) => {
        setCodeContext({ ...codeContext, [currentTab]: value })
    }

  return (
    <Dialog open={open} scroll="paper" onClose={() => setOpen(false)}>
        <DialogTitle>Code Context</DialogTitle>
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
      <DialogContent>
        <Editor height="100%" defaultLanguage="javascript" theme="vs-dark" value={codeContext[currentTab]} onChange={handleEditorChange} />
      </DialogContent>
    </Dialog>
  );
};

export default CodeEditorModal;
