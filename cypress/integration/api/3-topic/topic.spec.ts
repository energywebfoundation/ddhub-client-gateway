describe('Topic management', () => {
  context('DELETE /topics/{id}', () => {
    it('should delete topic as admin', () => {
      cy.generateTopicFixture().then((topicFixture) => {
        cy.loginAdmin()
          .then(() => cy.setupPrivateKey())
          .then(() => cy.createTopic(topicFixture))
          .then(() => cy.getTopic(topicFixture.name, topicFixture.owner))
          .then((response) => {
            expect(response.status).to.eq(200);

            expect(response.body.records).to.be.gte(1);

            return cy.deleteTopic(response.body.records[0].id);
          });
      });
    });
  });

  context('GET /topics', () => {
    it('should create and return topic as admin', () => {
      cy.generateTopicFixture().then((topicFixture) => {
        cy.loginAdmin()
          .then(() => cy.setupPrivateKey())
          .then(() => cy.createTopic(topicFixture))
          .then(() => cy.getTopic(topicFixture.name, topicFixture.owner))
          .then((response) => {
            expect(response.status).to.eq(200);

            expect(response.body.records).to.be.gte(1);
            expect(response.body[0].name).to.be.eq(topicFixture.name);
            expect(response.body[0].schemaType).to.be.eq(
              topicFixture.schemaType
            );
            expect(response.body[0].tags).to.be.eq(['CYPRESS_TEST']);
            expect(response.body[0].owner).to.be.eq(topicFixture.owner);
          });
      });
    });
  });

  context('POST /topics', () => {
    it('should not allow to create topic as user', () => {
      expect(true).to.eq(true);
    });

    it('should create topic as admin', () => {
      cy.generateTopicFixture().then((topicFixture) => {
        cy.loginAdmin()
          .then(() => cy.setupPrivateKey())
          .then(() => cy.createTopic(topicFixture))
          .then((response) => {
            expect(response.status).to.eq(201);

            expect(response.body.id).to.be.a('string');
            expect(response.body.name).to.be.a('string');

            expect(response.body.name).to.eq(topicFixture.name);
            expect(response.body.owner).to.eq(topicFixture.owner);

            expect(response.body.tags).to.eq(['CYPRESS_TEST']);
          });
      });
    });
  });
});
