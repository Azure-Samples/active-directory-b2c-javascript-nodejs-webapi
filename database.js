const { Connection, Request } = require("tedious");

var config = {
  server: "testmipo33.database.windows.net", // or "localhost"
  options: {
    trustServerCertificate: false,
    database: "testmipodb",
  },
  authentication: {
    type: "default",
    options: {
      userName: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
    },
  },
};

var connection = new Connection(config);

// Setup event handler when the connection is established.
connection.on("connect", function (err) {
  if (err) {
    console.log("Error: ", err);
  }
  // If no error, then good to go...
});

// Initialize the connection.
connection.connect();

function executeSelectStatementWithEmail(email) {
  return new Promise((resolve, reject) => {
    let request = new Request(
      `select * from users where email='${email}'`,
      (err, rowCount) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log(rowCount + " rows");
        }
      }
    );

    request.on("row", (columns) => {
      let results = columns.reduce((prev, column) => {
        return Object.assign({ [column.metadata.colName]: column.value }, prev);
      }, {});
      resolve(results);
    });

    connection.execSql(request);
  });
}

function executeInsertStatement(name, email) {
  return new Promise((resolve, reject) => {
    let request = new Request(
      `insert into users (name, email) values (N'${name}', N'${email}');`,
      function (err, rowCount) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log(rowCount + " rows");
          resolve();
        }
      }
    );

    connection.execSql(request);
  });
}


module.exports = {executeSelectStatementWithEmail, executeInsertStatement};