import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

export const givenEnrolmentStatus = (given, app: () => INestApplication) => {
  given(
    /^The (.*) has its enrolment status equals to (.*) for the application (.*)$/,
    async () => {
      await request(app().getHttpServer())
        .get('/identity')
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          console.log(body);
        });
    }
  );
};
