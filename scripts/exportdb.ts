import fs from "fs";
import { QueryError, RowDataPacket } from "mysql2";
import { db } from "../src/db";

const showError = (error: QueryError, tableName: string) => {
  console.log("Error [" + error.code + "]: unable to export " + tableName + " table");
  process.exit(1);
}

const getData = (tables: Array<string>, outputJson: any) => {
  if (tables.length == 0) {
    fs.writeFileSync("./db.json", JSON.stringify(outputJson));
    process.exit(0);
  }

  const tableName = tables.shift() ?? "";
  const query = "SELECT * FROM " + tableName;

  db.query(query, [tableName, tables, outputJson], (error, result) => {
    if (error) showError(error, tableName);
    else {
      outputJson[tableName] = <RowDataPacket[]>result;
      getData(tables, outputJson);
    }
  });
}

getData(["users", "networks", "channels", "bonds"], {});
