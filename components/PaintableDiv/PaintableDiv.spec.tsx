import React from 'react';
import { useChalkboardDataStore } from '../../hooks/useChalkboardDataStore';
import PaintableDiv from './PaintableDiv';

describe('<PaintableDiv />', () => {
  beforeEach(() => {
    const StoreSetupComponent = () => {
      const { addComponent } = useChalkboardDataStore((state) => ({
        addComponent: state.addComponent,
      }));
      React.useEffect(() => {
        addComponent({
          type: 'div',
          data: {
            position: { x: 0, y: 0 },
            width: 300,
            height: 300,
            transform: '',
          },
          id: 'test',
        });
      }, []);

      return <></>;
    };

    cy.mount(<StoreSetupComponent />);
  });

  it('renders', () => {
    cy.mount(
      <PaintableDiv id="test" color="#FFFFFF" createEvent={null}>
        test
      </PaintableDiv>
    );
    cy.get('#test').should('exist');
  });
});
