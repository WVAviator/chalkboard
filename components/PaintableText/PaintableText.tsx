import React from 'react';
import { PaintableComponentProps } from '../ComponentCanvas/ComponentCanvas';
import PaintableDiv from '../PaintableDiv/PaintableDiv';
import { TextSize } from '../TextSizePicker/TextSizePicker';
import styles from './PaintableText.module.css';

interface PaintableTextProps extends PaintableComponentProps {
  textSize?: TextSize;
}

const PaintableText: React.FC<PaintableTextProps> = ({
  createEvent,
  data,
  setData,
  canvasRect,
  color = '#FFFFFF',
  textSize = 'medium',
}) => {
  const [editing, setEditing] = React.useState<boolean>(false);
  const [quickClick, setQuickClick] = React.useState<boolean>(false);

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData({ ...data, text: event.target.value });
  };

  const handleCreated = () => {
    setEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLTextAreaElement>
  ) => {
    setQuickClick(true);
    setTimeout(() => setQuickClick(false), 200);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLTextAreaElement>) => {
    if (quickClick) {
      setEditing(true);
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  };

  const { fontSize, divHeight, divWidth } = React.useMemo(() => {
    return {
      small: { fontSize: '1rem', divHeight: 24, divWidth: 150 },
      medium: { fontSize: '2rem', divHeight: 38, divWidth: 300 },
      large: { fontSize: '3rem', divHeight: 56, divWidth: 450 },
    }[textSize];
  }, [textSize]);

  return (
    <PaintableDiv
      createEvent={createEvent}
      data={data}
      setData={setData}
      canvasRect={canvasRect}
      color={'transparent'}
      onCreated={handleCreated}
      minHeight={divHeight}
      minWidth={divWidth}
      shadow="dragonly"
    >
      <textarea
        className={styles.textarea}
        style={{ color, fontSize }}
        value={data.text}
        onChange={handleChange}
        ref={textareaRef}
        disabled={!editing}
        onBlur={() => setEditing(false)}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      />
    </PaintableDiv>
  );
};

export default PaintableText;
