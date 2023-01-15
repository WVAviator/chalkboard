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
  const { data, setData, props, setProps, removeComponent, saveToDatabase } =
    useChalkboardDataStore((state) => ({
      data: state.getComponent(id).data,
      setData: (data: any) => state.updateComponent(id, { data }),
      props: state.getComponent(id).props,
      setProps: (props: any) => state.updateComponent(id, { props }),
      removeComponent: state.removeComponent,
      saveToDatabase: state.saveToDatabase,
    }));

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
            removeComponent(id, true);
          }
        };
        reader.readAsDataURL(pastedImage);
      } else {
        const clipboardText = pasteEvent.clipboardData.getData('text/plain');
        if (!clipboardText) {
          console.error('Could not get text from clipboard.');
          showToastNotification('Cannot paste text.', 'error');
          removeComponent(id, true);
          return;
        }
        setData({ ...data, text: clipboardText, pasteType: 'text' });
      }
    };
    getClipboardData();
  }, [pasteEvent]);

  React.useEffect(() => {
    if (!image) return;
    console.log('Uploading image to S3...');

    const uploadImageToS3 = async () => {
      const response = await fetch('/api/s3-image-upload');
      const { url, success } = await response.json();

      if (!success) {
        if (response.status === 403) {
          showToastNotification(
            'You have reach the maximum number of image uploads for this account. This image will not be saved.',
            'error'
          );
          removeComponent(id, true);
          return;
        } else if (response.status === 401) {
          showToastNotification(
            'You are not logged in. This image will not be saved.',
            'error'
          );
          removeComponent(id, true);
          return;
        }
        showToastNotification('Error uploading image.', 'error');
        removeComponent(id, true);
        return;
      }

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
        removeComponent(id, true);
        return;
      }

      const imageUrl = url.split('?')[0];
      console.log('Image upload successful.');
      setData({ ...data, pasteType: 'image', imageUrl });
      setImage(null);

      // Force a save to database to ensure uploaded images are always associated with a saved chalkboard
      saveToDatabase(
        fetch,
        false,
        () => {
          showToastNotification(
            'Image upload successful. Autosaving...',
            'success'
          );
        },
        (error) => {
          showToastNotification(error, 'error');
          removeComponent(id, false);
        }
      );
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
