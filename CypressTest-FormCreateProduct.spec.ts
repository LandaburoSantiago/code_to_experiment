describe("template spec", () => {
  it("test creación de producto", () => {
    cy.visit(Cypress.env("url"));
    cy.get(".css-1odfl6e").click();
    cy.get(".css-13izd6u")
      .should("be.visible")
      .should("contain", "Agregar producto")
      .click();
    cy.get(".css-aq4acn")
      .should("be.visible")
      .should("contain", "Agregar producto");
    cy.get("#field-10-label")
      .should("be.visible")
      .should("contain", "Número de catálogo");
    cy.get("#catalog_number").should("be.visible");
    cy.get("#field-11-label")
      .should("be.visible")
      .should("contain", "Nombre del producto");
    cy.get("#name").should("be.visible");
    cy.get("#field-12-label")
      .should("be.visible")
      .should("contain", "Descripción");
    cy.get("#description").should("be.visible");
    cy.get("#field-13-label").should("be.visible").should("contain", "Precio");
    cy.get("#price").should("be.visible");
    cy.get("#field-14-label").should("be.visible").should("contain", "Stock");
    cy.get("#stock").should("be.visible");
    cy.get("#field-15-label").should("be.visible").should("contain", "Brilla");
    cy.get(".chakra-switch__track").should("be.visible");
    cy.get("#field-16-label")
      .should("be.visible")
      .should("contain", "Collección");
    cy.get("#collection_id").should("be.visible");
    cy.get("form > .chakra-text")
      .should("be.visible")
      .should("contain", "Si tu colección no existe creala aqui");
    cy.get(".chakra-text > .chakra-link")
      .should("be.visible")
      .should("contain", "aqui");
    cy.get(".ant-upload > .chakra-button")
      .should("be.visible")
      .should("contain", "Click para cargar imagen");
    cy.get(".css-zwfhvy").should("be.visible").should("contain", "Agregar");

    // Chequeo de validación de campos
    cy.get(".css-zwfhvy")
      .should("be.visible")
      .should("contain", "Agregar")
      .click();

    cy.get("#field-10-feedback")
      .should("be.visible")
      .should("contain", "Debe especificar un número de catálogo");
    cy.get("#field-11-feedback")
      .should("be.visible")
      .should("contain", "Debe ingresar un nombre");
    cy.get("#field-12-feedback")
      .should("be.visible")
      .should("contain", "Debe ingresar una descripción");
    cy.get("#field-13-feedback")
      .should("be.visible")
      .should("contain", "Debe especificarle el precio");
    cy.get("#field-14-feedback")
      .should("be.visible")
      .should("contain", "Debe especificarle el stock");
    // Completado de campos y chequeo de que los mensajes de error desaparezcan
    // Chequeo de que el campo numerico no admita letras
    cy.get("#catalog_number").should("be.visible").type("11asd");
    cy.get("#catalog_number").should("have.value", "11");
    cy.get("#name").should("be.visible").type("Nombre Producto Test");
    cy.get("#description").should("be.visible").type("Descripción de test");
    // Chequeo de que el campo numerico no admita letras
    cy.get("#price").should("be.visible").type("150asd");
    cy.get("#price").should("have.value", "150");
    // Chequeo de que el campo numerico no admita letras
    cy.get("#stock").should("be.visible").type("30");
    cy.get("#stock").should("have.value", "30");

    /*
    Se debe reescribir el campo número de catalogo para escribir un valor único.
    Para ello se utilizará new Date().getTime() para minimizar lo mas posible que el número de catalogo igresado ya exista
    */
    cy.get("#catalog_number")
      .should("be.visible")
      .type(`${new Date().getTime()}`);
    // Guardo con los campos minimos completos.
    cy.get(".css-zwfhvy")
      .should("be.visible")
      .should("contain", "Agregar")
      .click();

    cy.get("#test-alert-success")
      .should("be.visible")
      .should("contain", "Bien hecho!")
      .should("contain", "Tu producto se registró exitosamente!.");

    // Completado de todos los campos
    cy.get(".css-13izd6u")
      .should("be.visible")
      .should("contain", "Agregar producto")
      .click();

    cy.get("#catalog_number").should("be.visible").type("11asd");
    cy.get("#catalog_number").should("have.value", "11");
    cy.get("#name").should("be.visible").type("Nombre Producto Test");
    cy.get("#description").should("be.visible").type("Descripción de test");
    // Chequeo de que el campo numerico no admita letras
    cy.get("#price").should("be.visible").type("150asd");
    cy.get("#price").should("have.value", "150");
    // Chequeo de que el campo numerico no admita letras
    cy.get("#stock").should("be.visible").type("30");
    cy.get("#stock").should("have.value", "30");
    /*
    Se debe reescribir el campo número de catalogo para escribir un valor único.
    Para ello se utilizará new Date().getTime() para minimizar lo mas posible que el número de catalogo igresado ya exista
    */
    cy.get("#catalog_number")
      .should("be.visible")
      .type(`${new Date().getTime()}`);
    cy.get(".chakra-switch__track").click();
    cy.get("#collection_id").select("Dragon Ball Z");

    cy.get("#test-input-file").selectFile("cypress/fixtures/logo192.png", {
      force: true,
    });

    // Guardo con los todos los completos.
    cy.get(".css-zwfhvy")
      .should("be.visible")
      .should("contain", "Agregar")
      .click();

    cy.get("#test-alert-success")
      .should("be.visible")
      .should("contain", "Bien hecho!")
      .should("contain", "Tu producto se registró exitosamente!.");
  });

  it("test edición de producto", () => {
    cy.visit(Cypress.env("url"));
    cy.get(".css-1odfl6e").click();
    cy.get("#tabs-9--tabpanel-0 > .chakra-table__container").scrollTo("right");
    cy.get(
      "#tabs-9--tabpanel-0 > .chakra-table__container > .chakra-table > .css-v5e1nz > :nth-child(1) > :nth-child(8) > .css-73pxpg"
    )
      .should("be.visible")
      .click();
    cy.get(".css-aq4acn")
      .should("be.visible")
      .should("contain", "Actualizar producto");
    cy.get("#field-10-label")
      .should("be.visible")
      .should("contain", "Número de catálogo");
    cy.get("#catalog_number")
      .should("be.visible")
      .should("have.prop", "value")
      .should("not.be.empty");
    cy.get("#field-11-label")
      .should("be.visible")
      .should("contain", "Nombre del producto");
    cy.get("#name")
      .should("be.visible")
      .should("have.prop", "value")
      .should("not.be.empty");
    cy.get("#field-12-label")
      .should("be.visible")
      .should("contain", "Descripción");
    cy.get("#description")
      .should("be.visible")
      .should("have.prop", "value")
      .should("not.be.empty");
    cy.get("#field-13-label").should("be.visible").should("contain", "Precio");
    cy.get("#price")
      .should("be.visible")
      .should("have.prop", "value")
      .should("not.be.empty");
    cy.get("#field-14-label").should("be.visible").should("contain", "Stock");
    cy.get("#stock")
      .should("be.visible")
      .should("have.prop", "value")
      .should("not.be.empty");
    cy.get("#field-15-label").should("be.visible").should("contain", "Brilla");
    cy.get(".chakra-switch__track").should("be.visible");
    cy.get("#field-16-label")
      .should("be.visible")
      .should("contain", "Collección");
    cy.get("#collection_id").should("be.visible");
    cy.get("form > .chakra-text")
      .should("be.visible")
      .should("contain", "Si tu colección no existe creala aqui");
    cy.get(".chakra-text > .chakra-link")
      .should("be.visible")
      .should("contain", "aqui");
    cy.get(".ant-upload > .chakra-button")
      .should("be.visible")
      .should("contain", "Click para cargar imagen");
    cy.get(".css-zwfhvy").should("be.visible").should("contain", "Guardar");

    cy.get("#name").should("be.visible").type(" Test editar");
    cy.get("#description").should("be.visible").type(" Test editar");
    cy.get("#price").should("be.visible").type("1");
    cy.get("#stock").should("be.visible").type("2");
    cy.get(".chakra-switch__track").click();
    cy.get("#collection_id").select("Star Wars");

    cy.get("#test-input-file").selectFile("cypress/fixtures/logo192.png", {
      force: true,
    });

    // Guardo con los todos los completos.
    cy.get(".css-zwfhvy")
      .should("be.visible")
      .should("contain", "Guardar")
      .click();

    cy.get("#test-alert-success")
      .should("be.visible")
      .should("contain", "Bien hecho!")
      .should("contain", "Tu producto se actualizó exitosamente!.");
  });
});
