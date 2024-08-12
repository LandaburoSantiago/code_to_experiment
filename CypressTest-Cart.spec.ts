describe("template spec", () => {
  it("test agregar producto al carrito", () => {
    cy.visit(Cypress.env("url"));
    cy.get(".css-1odfl6e").click();
    cy.get('[href="/cart"] > .chakra-text')
      .should("be.visible")
      .should("contain", "Mi carrito")
      .click();
    cy.get(".css-19936ik")
      .should("be.visible")
      .should("contain", "NO TIENES PRODUCTOS EN EL CARRITO");
    cy.get(".chakra-link > .chakra-button")
      .should("be.visible")
      .should("contain", "Ir a ver productos")
      .click();
    cy.get(
      ":nth-child(1) > .css-euhppb > .css-i9vqp4 > .chakra-link > .chakra-button"
    )
      .should("be.visible")
      .should("contain", "Mas detalles")
      .click();

    cy.get(".css-1lekzkb > .chakra-button")
      .should("be.visible")
      .should("contain", "Agregar al carrito")
      .click();
    cy.get(
      ".chakra-toast > .chakra-toast__inner > .chakra-alert > .chakra-link > .chakra-button"
    )
      .should("be.visible")
      .should("contain", "Ir al carrito");
  });

  it("test carrito", () => {
    cy.visit(Cypress.env("url"));
    cy.get(".css-1odfl6e").click();
    cy.get('[href="/cart"] > .chakra-text')
      .should("be.visible")
      .should("contain", "Mi carrito")
      .click();
    cy.get(".chakra-avatar__img")
      .should("be.visible")
      .should("have.attr", "src");
    cy.get(".chakra-numberinput__field")
      .should("be.visible")
      .should("have.prop", "value")
      .should("not.be.empty");
    cy.get(".css-1jj9yua > :nth-child(1)").click();
    cy.get(".css-1f0vz2m > .chakra-text")
      .should("be.visible")
      .should("not.be.empty");
    cy.get(".css-1nlgqls > .chakra-text")
      .should("be.visible")
      .should("not.be.empty");
    cy.get(".css-1nlgqls > .chakra-button").should("be.visible");
    cy.get("html").scrollTo("bottom");
    cy.get(".css-1aeuht6 > .chakra-badge")
      .should("be.visible")
      .should("not.be.empty");
    cy.get(".css-13q2ois > .chakra-button").should("be.visible").click();
    cy.get("#field-9-label")
      .should("be.visible")
      .should(
        "contain",
        "Seleccione una dirección para que le enviemos el producto"
      );
    cy.get('[href="/cart"] > .chakra-text').click();
    cy.get(".css-1nlgqls > .chakra-button").click();
    cy.get("#chakra-modal--header-2")
      .should("be.visible")
      .should("contain", "Eliminar producto");
    cy.get("#chakra-modal--body-2")
      .should("be.visible")
      .should("contain", "¿Seguro que desea eliminar el producto del carrito?");
    cy.get(".chakra-modal__footer > .css-73pxpg")
      .should("be.visible")
      .should("contain", "Cancelar")
      .click();
    cy.get(".css-1nlgqls > .chakra-button").click();
    cy.get(".css-tptix0")
      .should("be.visible")
      .should("contain", "Eliminar")
      .click();
    cy.get(".css-19936ik")
      .should("be.visible")
      .should("contain", "NO TIENES PRODUCTOS EN EL CARRITO");
  });
});
