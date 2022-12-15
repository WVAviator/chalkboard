import Editor from '@monaco-editor/react';
import React from 'react';
import { PaintableComponentProps } from '../ComponentCanvas/ComponentCanvas';
import PaintableDiv from '../PaintableDiv/PaintableDiv';
import styles from './PaintableCodeEditor.module.css';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface PaintableCodeEditorProps extends PaintableComponentProps {}

const PaintableCodeEditor: React.FC<PaintableCodeEditorProps> = ({
  createEvent,
  data,
  setData,
  ...rest
}) => {
  const handleEditorChange = (value: string | undefined) => {
    setData({ ...data, code: value });
  };

  const handleCodeExecute = () => {
    //TODO: Send code to backend for execution and handle console output
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
            onChange={handleEditorChange}
          />
          <div className={styles.controls} onClick={handleCodeExecute}>
            <PlayArrowIcon />
          </div>
        </div>

        <div
          className={styles.console}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <pre>test console output</pre>
        </div>
      </div>
    </PaintableDiv>
  );
};

export default PaintableCodeEditor;
