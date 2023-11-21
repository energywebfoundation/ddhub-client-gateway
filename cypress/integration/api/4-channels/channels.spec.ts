describe('Channel management', () => {
  it('Happy Path', () => {
    cy.loginAdmin()
      .then(() => cy.setupPrivateKey())
      .then(() => cy.createChannelWithTopic('pub', false, false))
      .then((createChannelResponse) => {
        expect(createChannelResponse.body.fqcn).to.be.a('string');
        expect(createChannelResponse.body.messageForms).to.eq(false);
        expect(createChannelResponse.body.type).to.eq('pub');

        expect(createChannelResponse.body.conditions.dids.length).to.eq(1);
        expect(
          createChannelResponse.body.conditions.qualifiedDids.length
        ).to.eq(1);
        expect(createChannelResponse.body.conditions.topics.length).to.eq(1);

        expect(createChannelResponse.body.conditions.topics[0].topicId).to.be.a(
          'string'
        );
        expect(
          createChannelResponse.body.conditions.topics[0].topicName
        ).to.be.a('string');
        expect(createChannelResponse.body.conditions.topics[0].owner).to.be.a(
          'string'
        );

        return cy
          .getAllChannels()
          .then((response) => {
            expect(response.status).to.eq(200);

            expect(response.body.length).to.eq(1);
            expect(response.body[0].fqcn).to.eq(
              createChannelResponse.body.fqcn
            );
          })
          .then(() => cy.getChannelByFqcn(createChannelResponse.body.fqcn))
          .then((getChannelResponse) => {
            expect(getChannelResponse.body.fqcn).to.eq(
              createChannelResponse.body.fqcn
            );

            return cy.deleteChannel(createChannelResponse.body.fqcn);
          })
          .then(() => cy.getAllChannels())
          .then((response) => {
            expect(response.body.length).to.eq(0);
          });
      });
  });
});
