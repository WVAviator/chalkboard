import React from 'react';
import { useChalkboardDataStore } from '../../hooks/useChalkboardDataStore';
import { useToastNotificationStore } from '../../hooks/useToastNotificationStore';
import { PaintableComponentProps } from '../ComponentCanvas/ComponentCanvas';
import PaintableDiv from '../PaintableDiv/PaintableDiv';
import PaintableText, {
  PaintableTextProps,
} from '../PaintableText/PaintableText';
import styles from './ClipboardComponent.module.css';

interface ClipboardComponentProps extends PaintableTextProps {
  pasteEvent: ClipboardEvent;
}

const ClipboardComponent: React.FC<ClipboardComponentProps> = ({
  pasteEvent,
  id,
  ...rest
}) => {
  const { data, setData, props, setProps } = useChalkboardDataStore(
    (state) => ({
      data: state.getComponent(id).data,
      setData: (data: any) => state.updateComponent(id, { data }),
      props: state.getComponent(id).props,
      setProps: (props: any) => state.updateComponent(id, { props }),
    })
  );

  // const [type, setType] = React.useState<'text' | 'image' | null>(pasteEvent ? null : data.pasteType);
  // const [displayText, setDisplayText] = React.useState<string | null>(pasteEvent ? null : data.pasteDisplayText);

  const [image, setImage] = React.useState<File | null>(null);

  const showToastNotification = useToastNotificationStore(
    (state) => state.showToastNotification
  );

  React.useEffect(() => {
    if (!pasteEvent) return;
    setProps({ ...props, pasteEvent: null });

    const getClipboardData = async () => {
      if (!pasteEvent.clipboardData) {
        console.error('The clipboard API is not supported in this browser.');
        showToastNotification('Cannot paste data.', 'error');
        return;
      }

      const pastedImage = pasteEvent.clipboardData.files[0];

      if (pastedImage) {
        setImage(pastedImage);

        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setData({
              ...data,
              pasteType: 'image',
              imageUrl: e.target.result as string,
            });
          } else {
            console.error('Could not read image from clipboard.');
            showToastNotification('Cannot paste image.', 'error');
          }
        };
        reader.readAsDataURL(pastedImage);
      } else {
        const clipboardText = pasteEvent.clipboardData.getData('text/plain');
        if (!clipboardText) {
          console.error('Could not get text from clipboard.');
          showToastNotification('Cannot paste text.', 'error');
          return;
        }
        setData({ ...data, text: clipboardText, pasteType: 'text' });
      }
    };
    getClipboardData();
  }, [pasteEvent]);

  //TODO: useEffect with image dependency for S3 upload
  React.useEffect(() => {
    if (!image) return;
    console.log('Uploading image to S3...');

    const uploadImageToS3 = async () => {
      const response = await fetch('/api/s3-image-upload');
      const { url } = await response.json();

      try {
        await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': image.type,
          },
          body: image,
        });
      } catch (err) {
        console.error('Error uploading image to S3: ', err);
        showToastNotification('Error uploading image.', 'error');
        return;
      }

      const imageUrl = url.split('?')[0];
      console.log('Upload successful, setting image URL: ', imageUrl);
      setData({ ...data, pasteType: 'image', imageUrl });
      setImage(null);
    };

    uploadImageToS3();
  }, [image]);

  if (data.pasteType === 'text') {
    return <PaintableText id={id} createEvent={null} {...rest} />;
  }

  if (data.pasteType === 'image') {
    return (
      <PaintableDiv id={id} createEvent={null} {...rest}>
        <img
          src={data.imageUrl}
          alt="Clipboard image"
          className={styles.image}
        />
      </PaintableDiv>
    );
  }

  return null;
};

export default ClipboardComponent;
