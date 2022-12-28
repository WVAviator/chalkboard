import Editor from '@monaco-editor/react';
import React, { MouseEvent, useEffect } from 'react';
import { PaintableComponentProps } from '../ComponentCanvas/ComponentCanvas';
import PaintableDiv, { PaintableDivData } from '../PaintableDiv/PaintableDiv';
import styles from './PaintableCodeEditor.module.css';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Button, CircularProgress } from '@mui/material';
import CodeEditorModal, {
  CodeContext,
} from '../CodeEditorModal/CodeEditorModal';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useChalkboardDataStore } from '../../hooks/useChalkboardDataStore';

export interface PaintableCodeEditorData extends PaintableDivData {
  codeContext: CodeContext;
}

interface PaintableCodeEditorProps extends PaintableComponentProps {}

const defaultCodeContext: CodeContext = {
  main: 'const add = (a, b) => {\n  return a + b;\n}\n\nconsole.log(add(1, 2));\n',
  before:
    '// Code you write here will be executed \n// *before* any visible code.\n',
  after:
    '// Code you write here will be executed \n// *after* any visible code.\n',
};

const PaintableCodeEditor: React.FC<PaintableCodeEditorProps> = ({
  createEvent,
  color = '#eb5c08',
  id,
  ...rest
}) => {
  const { data, setData } = useChalkboardDataStore((state) => ({
    data: state.getComponent(id).data,
    setData: (data: any) => state.updateComponent(id, { data }),
  }));
  const [consoleOutput, setConsoleOutput] = React.useState<string[]>([]);
  const [loadingConsoleOutput, setLoadingConsoleOutput] =
    React.useState<boolean>(false);
  const [modalEditorOpen, setModalEditorOpen] = React.useState<boolean>(false);

  useEffect(() => {
    if (!createEvent) return;
    setData({ ...data, codeContext: defaultCodeContext });
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    setData({ ...data, codeContext: { ...data.codeContext, main: value } });
  };

  const updateCodeContext = (newCodeContext: CodeContext) => {
    setData({ ...data, codeContext: newCodeContext });
  };

  const handleOpenModalEditor = (event: MouseEvent) => {
    event.stopPropagation();
    setModalEditorOpen(true);
  };

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
      color={color}
      minWidth={300}
      minHeight={200}
      id={id}
      {...rest}
    >
      <div className={styles.wrapper}>
        <div className={styles.topBar} style={{ backgroundColor: color }}>
          <Button
            onClick={handleOpenModalEditor}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <OpenInNewIcon />
          </Button>
        </div>
        <div
          className={styles.editorContainer}
          onPointerDown={(event) => event.stopPropagation()}
        >
          {data.codeContext && (
            <Editor
              defaultLanguage="javascript"
              height="100%"
              width="100%"
              theme="vs-dark"
              value={data.codeContext.main}
              onChange={handleEditorChange}
            />
          )}
          <CodeEditorModal
            open={modalEditorOpen}
            setOpen={setModalEditorOpen}
            codeContext={data.codeContext || defaultCodeContext}
            setCodeContext={updateCodeContext}
          />
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
