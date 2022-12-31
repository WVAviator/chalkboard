import React from 'react';
import { useChalkboardDataStore } from '../../hooks/useChalkboardDataStore';
import { PaintableComponentProps } from '../ComponentCanvas/ComponentCanvas';
import PaintableDiv, { PaintableDivProps } from '../PaintableDiv/PaintableDiv';
import { TextSize } from '../TextSizePicker/TextSizePicker';
import styles from './PaintableText.module.css';

export interface PaintableTextProps extends PaintableDivProps {
  textSize?: TextSize;
}

const PaintableText: React.FC<PaintableTextProps> = ({
  createEvent,
  color = '#FFFFFF',
  textSize = 'medium',
  id,
  ...rest
}) => {
  const { data, setData } = useChalkboardDataStore((state) => ({
    data: state.getComponent(id).data,
    setData: (data: any) => state.updateComponent(id, { data }),
  }));
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

  const handlePointerDown = () => {
    setQuickClick(true);
    setTimeout(() => setQuickClick(false), 200);
  };

  const handlePointerUp = () => {
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
      color={'transparent'}
      onCreated={handleCreated}
      minHeight={divHeight}
      minWidth={divWidth}
      shadow="dragonly"
      id={id}
      {...rest}
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
