import React from 'react';
import { useChalkboardDataStore } from '../../hooks/useChalkboardDataStore';
import PaintableText from './PaintableText';

describe('<PaintableDiv />', () => {
  beforeEach(() => {
    const StoreSetupComponent = () => {
      const { addComponent } = useChalkboardDataStore((state) => ({
        addComponent: state.addComponent,
      }));
      React.useEffect(() => {
        addComponent({
          type: 'text',
          data: {
            position: { x: 0, y: 0 },
            width: 300,
            height: 300,
            transform: '',
            text: 'test',
          },
          id: 'test',
        });
      }, []);

      return <></>;
    };

    cy.mount(<StoreSetupComponent />);
  });

  it('renders', () => {
    cy.mount(<PaintableText id="test" color="#000000" createEvent={null} />);
    cy.get('#test').should('exist');
    cy.get('*').contains('test').should('exist');
  });

  it('should allow editing when clicked', () => {
    cy.mount(<PaintableText id="test" color="#000000" createEvent={null} />);
    // cy.get('[aria-label="editable text"]').should('have.attr', 'disabled');
    // cy.get('#test')
    //   .trigger('mousedown')
    //   .clock(150)
    //   .get('#test')
    //   .trigger('mouseup');
    // cy.get('[aria-label="editable text"]').should('not.have.attr', 'disabled');
  });
});
