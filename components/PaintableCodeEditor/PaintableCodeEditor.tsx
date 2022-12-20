import Editor, { Monaco } from '@monaco-editor/react';
import React from 'react';
import { PaintableComponentProps } from '../ComponentCanvas/ComponentCanvas';
import PaintableDiv, { PaintableDivData } from '../PaintableDiv/PaintableDiv';
import styles from './PaintableCodeEditor.module.css';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Button, CircularProgress } from '@mui/material';
import CodeEditorModal, { CodeContext } from '../CodeEditorModal/CodeEditorModal';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export interface PaintableCodeEditorData extends PaintableDivData {
  codeContext: CodeContext;
}

interface PaintableCodeEditorProps extends PaintableComponentProps {}

const PaintableCodeEditor: React.FC<PaintableCodeEditorProps> = ({
  createEvent,
  data,
  setData,
  color = '#eb5c08',
  ...rest
}) => {
  const [consoleOutput, setConsoleOutput] = React.useState<string[]>([]);
  const [loadingConsoleOutput, setLoadingConsoleOutput] =
    React.useState<boolean>(false);
    const [modalEditorOpen, setModalEditorOpen] = React.useState<boolean>(false);

  const handleEditorMount = (editor: any) => {
    const code = editor.getValue();
    updateCodeContext({
      main: code,
      before: '// Code you write here will be executed *before* any visible code in this editor block.\n',
      after: '// Code you write here will be executed *after* any visible code in this editor block.\n'
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    updateCodeContext({...data.codeContext, main: value});
  };

  const updateCodeContext = (newContext: CodeContext) => {
    setData({ ...data, codeContext: newContext });
  }

  const handleCodeExecute = async () => {
    setLoadingConsoleOutput(true);

    const { before, main, after } = data.codeContext;
    const codeToExecute = `${before}\n${main}\n${after}`;

    const response = await fetch('/api/compile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: codeToExecute }),
    });
    const { stdout, success } = await response.json();
    if (success) {
      const newConsoleOutput: string[] = stdout.split('\n');
      setConsoleOutput(newConsoleOutput);
    } else {
      console.log(
        'An error occurred while attempting to compile and execute code.'
      );
    }
    setLoadingConsoleOutput(false);
  };

  return (
    <PaintableDiv
      createEvent={createEvent}
      data={data}
      setData={setData}
      color={color}
      minWidth={300}
      minHeight={200}
      {...rest}
    >
      <div className={styles.wrapper}>
        <div className={styles.topBar} style={{ backgroundColor: color }}><Button onClick={() => setModalEditorOpen(true)}><OpenInNewIcon/></Button></div>
        <div
          className={styles.editorContainer}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <Editor
            defaultLanguage="javascript"
            height="100%"
            theme="vs-dark"
            defaultValue={
              createEvent
                ? `const add = (a, b) => {\n  return a + b;\n}\n\nconsole.log(add(1, 2));\n`
                : data.code
            }
            value={data.codeContext.main}
            onMount={handleEditorMount}
            onChange={handleEditorChange}
          />
          <CodeEditorModal open={modalEditorOpen} setOpen={setModalEditorOpen} codeContext={data.codeContext} setCodeContext={updateCodeContext} />
          <div className={styles.controls} onClick={handleCodeExecute}>
            {loadingConsoleOutput ? (
              <CircularProgress size="1.25rem" thickness={6} />
            ) : (
              <PlayArrowIcon />
            )}
          </div>
        </div>

        <div
          className={styles.console}
          onPointerDown={(event) => event.stopPropagation()}
        >
          {consoleOutput.map((line, index) => (
            <pre key={index}>{line}</pre>
          ))}
        </div>
      </div>
    </PaintableDiv>
  );
};

export default PaintableCodeEditor;
