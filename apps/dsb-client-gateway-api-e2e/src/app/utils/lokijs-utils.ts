import * as fs from 'fs';
import lokiDB from 'lokijs';

export const clearDatabase = async (loki: lokiDB) => {
  const filePath = __dirname + '/../../../data.db';

  if (fs.existsSync(filePath)) {
    const promise = () =>
      new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
          if (err) {
            return reject(err);
          }

          loki.deleteDatabase((err) => {
            if (err) {
              return resolve(null);
            }

            loki.save(() => {
              return resolve(null);
            });
          });
        });
      });

    await promise();
  }
};
