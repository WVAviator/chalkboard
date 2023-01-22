/// <reference types="cypress" />

import React from 'react';
import { useChalkboardDataStore } from '../../hooks/useChalkboardDataStore';
import { CodeContext } from '../CodeEditorModal/CodeEditorModal';
import PaintableCodeEditor from './PaintableCodeEditor';

describe('<PaintableCodeEditor />', () => {
  const defaultCodeContext: CodeContext = {
    main: 'const add = (a, b) => {\n  return a + b;\n}\n\nconsole.log(add(1, 2));\n',
    before:
      '// Code you write here will be executed \n// *before* any visible code.\n',
    after:
      '// Code you write here will be executed \n// *after* any visible code.\n',
  };

  beforeEach(() => {
    const StoreSetupComponent = () => {
      const { addComponent } = useChalkboardDataStore((state) => ({
        addComponent: state.addComponent,
      }));
      React.useEffect(() => {
        addComponent({
          type: 'code',
          data: {
            position: { x: 0, y: 0 },
            width: 300,
            height: 300,
            transform: '',
            codeContext: defaultCodeContext,
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
      <PaintableCodeEditor id="test" color="#FFFFFF" createEvent={null} />
    );
    cy.get('#test').should('exist');
  });

  it('should execute code by sending top api and displaying response', () => {
    cy.intercept('POST', '/api/compile', {
      statusCode: 200,
      body: {
        stdout: '3',
        success: true,
      },
    }).as('compile');

    cy.mount(
      <PaintableCodeEditor id="test" color="#FFFFFF" createEvent={null} />
    );

    cy.get('[aria-label="execute code"]').click();

    cy.wait('@compile').then((interception) => {
      expect(interception.request.body).to.deep.equal({
        code: `${defaultCodeContext.before}\n${defaultCodeContext.main}\n${defaultCodeContext.after}`,
      });
    });

    cy.get('[aria-label="console output"]').contains('3');
  });

  it('should open a modal for editing code context', () => {
    cy.mount(
      <PaintableCodeEditor id="test" color="#FFFFFF" createEvent={null} />
    );

    cy.get('[aria-label="edit code context"]').click();
    cy.get('[aria-label="code editor modal"]').should('exist');
  });
});
