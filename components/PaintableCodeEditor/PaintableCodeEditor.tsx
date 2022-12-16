import Editor, { Monaco } from '@monaco-editor/react';
import React from 'react';
import { PaintableComponentProps } from '../ComponentCanvas/ComponentCanvas';
import PaintableDiv from '../PaintableDiv/PaintableDiv';
import styles from './PaintableCodeEditor.module.css';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { CircularProgress } from '@mui/material';

interface PaintableCodeEditorProps extends PaintableComponentProps {}

const PaintableCodeEditor: React.FC<PaintableCodeEditorProps> = ({
  createEvent,
  data,
  setData,
  ...rest
}) => {
  const [consoleOutput, setConsoleOutput] = React.useState<string[]>([]);
  const [loadingConsoleOutput, setLoadingConsoleOutput] =
    React.useState<boolean>(false);

  const editorRef = React.useRef(null);

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
    const value = editor.getValue();
    setData({ ...data, code: value });
  };

  const handleEditorChange = (value: string | undefined) => {
    setData({ ...data, code: value });
  };

  const handleCodeExecute = async () => {
    setLoadingConsoleOutput(true);
    const response = await fetch('/api/compile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: data.code }),
    });
    const { stdout, success } = await response.json();
    if (success) {
      const newConsoleOutput: string[] = stdout.split('\n');
      console.log('newConsoleOutput: ', newConsoleOutput);
      setConsoleOutput(newConsoleOutput);
    } else {
      console.log('An error occurred.');
    }
    setLoadingConsoleOutput(false);
  };

  return (
    <PaintableDiv
      createEvent={createEvent}
      data={data}
      setData={setData}
      backgroundColor="#1E1E1E"
      minWidth={300}
      minHeight={200}
      {...rest}
    >
      <div className={styles.wrapper}>
        <div className={styles.topBar}></div>
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
            onMount={handleEditorMount}
            onChange={handleEditorChange}
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
