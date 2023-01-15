import create from 'zustand';
import { PaintableComponentData } from '../components/ComponentCanvas/ComponentCanvas';

export interface ChalkboardDataStore {
  chalkboardComponents: PaintableComponentData[];
  chalkboardId: string | null;
  chalkboardTitle: string;
  resetChalkboard: () => void;
  loadFromDatabase: (
    fetcher: (input: RequestInfo, init?: RequestInit) => Promise<Response>,
    chalkboardId: string,
    onSuccess?: (message: string) => void,
    onError?: (error: string) => void
  ) => void;
  loadFromLocalStorage: () => void;
  saveToDatabase: (
    fetcher: (input: RequestInfo, init?: RequestInit) => Promise<Response>,
    saveAsNew: boolean,
    onSuccess?: (message: string) => void,
    onError?: (error: string) => void
  ) => void;
  saveToLocalStorage: () => void;
  addComponent: (component: PaintableComponentData) => void;
  removeComponent: (componentId: string, dueToFailure: boolean) => void;
  updateComponent: (
    componentId: string,
    update: Partial<PaintableComponentData>
  ) => void;
  updateComponentData: (componentId: string, update: any) => void;
  moveComponent: (componentId: string, newIndex?: number) => void;
  updateTitle: (title: string) => void;
  getComponent: (componentId: string) => PaintableComponentData | undefined;
}

export const useChalkboardDataStore = create<ChalkboardDataStore>(
  (set, get) => ({
    chalkboardComponents: [],
    chalkboardId: null,
    chalkboardTitle: 'Untitled',
    resetChalkboard: () =>
      set({
        chalkboardComponents: [],
        chalkboardId: null,
        chalkboardTitle: 'Untitled',
      }),
    loadFromDatabase: async (
      fetcher: (url: string, options?: RequestInit) => Promise<Response>,
      chalkboardId: string,
      onSuccess: (message: string) => void,
      onError: (error: string) => void
    ) => {
      set({
        chalkboardComponents: [],
        chalkboardId: null,
        chalkboardTitle: 'Untitled',
      });
      const response = await fetcher(`/api/canvas/${chalkboardId}`);
      const { data, success } = await response.json();
      if (success) {
        set({
          chalkboardComponents: data.components,
          chalkboardId: data._id,
          chalkboardTitle: data.title,
        });
        onSuccess && onSuccess('Successfully loaded chalkboard.');
      } else {
        console.log('Error loading canvas');
        onError && onError('Error occurred while loading Chalkboard.');
      }
    },
    loadFromLocalStorage: () => {
      const restoredData = localStorage.getItem('chalkboardData');
      if (restoredData) {
        const { chalkboardComponents, chalkboardTitle, chalkboardId } =
          JSON.parse(restoredData);

        set({
          chalkboardComponents,
          chalkboardId,
          chalkboardTitle,
        });

        localStorage.removeItem('chalkboardData');
      }
    },
    saveToDatabase: async (
      fetcher,
      saveAsNew: boolean,
      onSuccess: (message: string) => void,
      onError: (error: string) => void
    ) => {
      const { chalkboardComponents, chalkboardTitle, chalkboardId } = get();

      const body = JSON.stringify({
        components: chalkboardComponents,
        title: chalkboardTitle,
        canvasId: chalkboardId,
      });

      let response;

      if (!chalkboardId || saveAsNew) {
        response = await fetcher('/api/canvas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        });
      } else {
        response = await fetcher(`/api/canvas/${chalkboardId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        });
      }

      const { success, data } = await response.json();
      if (success) {
        onSuccess && onSuccess('Successfully saved chalkboard.');
        return set({
          chalkboardId: data._id.toString(),
        });
      } else {
        console.log('Error saving canvas');
        let error = 'Error occurred while saving Chalkboard.';
        if (response.status === 401) {
          error = 'You must be logged in to save a chalkboard.';
        }
        if (response.status === 403) {
          error =
            'You have reached the maximum number of chalkboards for your account.';
        }
        onError && onError(error);
      }
    },
    saveToLocalStorage: () => {
      const { chalkboardComponents, chalkboardTitle, chalkboardId } = get();
      localStorage.setItem(
        'chalkboardData',
        JSON.stringify({
          chalkboardComponents,
          chalkboardTitle,
          chalkboardId,
        })
      );
    },
    addComponent: (component: PaintableComponentData) =>
      set((state) => {
        return {
          chalkboardComponents: [...state.chalkboardComponents, component],
        };
      }),

    removeComponent: async (
      componentId: string,
      dueToFailure: boolean = false
    ) => {
      const component = get().getComponent(componentId);
      if (component.type === 'paste' && component.data.pasteType === 'image') {
        const parts = component.data.imageUrl.split('/');
        const key = parts[parts.length - 1];
        const response = await fetch(`/api/s3-image-upload`, {
          method: 'DELETE',

          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ key, decrementUserImageCount: !dueToFailure }),
        });
        const { success } = await response.json();
        if (!success) {
          console.log('Error deleting image from s3');
          return set((state) => ({
            chalkboardComponents: state.chalkboardComponents,
          }));
        }
      }

      return set((state) => ({
        chalkboardComponents: state.chalkboardComponents.filter(
          (component) => component.id !== componentId
        ),
      }));
    },

    updateComponent: (
      componentId: string,
      update: Partial<PaintableComponentData>
    ) =>
      set((state) => ({
        chalkboardComponents: state.chalkboardComponents.map((component) => {
          if (component.id === componentId) {
            const newComponent = {
              ...component,
              ...update,
            };
            if (newComponent.props) newComponent.props.createEvent = null;
            return newComponent;
          }
          return component;
        }),
      })),

    updateComponentData: (componentId: string, update: any) =>
      set((state) => ({
        chalkboardComponents: state.chalkboardComponents.map((component) => {
          if (component.id === componentId) {
            const newComponent = {
              ...component,
              data: {
                ...component.data,
                ...update,
              },
            };
            return newComponent;
          }
          return component;
        }),
      })),

    moveComponent: (componentId: string, index: number = -1) =>
      set((state) => {
        const components = state.chalkboardComponents;
        const componentIndex = components.findIndex(
          (component) => component.id === componentId
        );
        if (componentIndex === -1) {
          console.log("Attempted to move component that doesn't exist");
          return;
        }
        const component = components[componentIndex];
        const newComponents = [...components];
        newComponents.splice(componentIndex, 1);
        if (index === -1) {
          newComponents.push(component);
        } else {
          newComponents.splice(index, 0, component);
        }
        return {
          chalkboardComponents: newComponents,
        };
      }),
    updateTitle: (title: string) =>
      set({
        chalkboardTitle: title,
      }),
    getComponent: (componentId: string) =>
      get().chalkboardComponents.find(
        (component) => component.id === componentId
      ),
  })
);
