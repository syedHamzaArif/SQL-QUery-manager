import { ParsedJSON } from "../utils/types";

export const mariaDBParser = (script: string) => {
  const statements = script.split(";");
  const create: string[] = [];
  statements.forEach((statement) => {
    if (statement.trim().includes("CREATE TABLE")) {
      create.push(statement.trim());
    }
  });
  let tables = create.map((item) =>
    item
      .split("CREATE TABLE")[1]
      .split("(")[0]
      .trim()
      .replace('"', "")
      .replace('"', "")
      .replace("`", "")
      .replace("`", "")
  );
  const jsoned: ParsedJSON = {};
  tables = tables.slice(0, 100);
  tables.map((table) => {
    const tableWithColumns = create.filter((item) =>
      item.includes(`CREATE TABLE \`${table}\``)
    );
    const columns = tableWithColumns.map((table) => {
      const lines = table.split("\n");
      const columnLines = lines.filter((line) => line.trim().startsWith("`"));
      const columns = columnLines.map((line) => {
        const trimmed = line.trim();
        const name = trimmed.split(" ")[0].replace("`", "").replace("\`", "");
        const type = trimmed.split(" ")[1];
        return { name, type };
      });
      return columns;
    });
    jsoned[table] = columns[0];
  });
  return jsoned;
};

export const mySQLParser = (script: string) => {
  const statements = script.split(";");
  const create: string[] = [];
  statements.forEach((statement) => {
    if (statement.trim().includes("CREATE TABLE")) {
      create.push(statement.trim());
    }
  });
  let tables = create.map((item) =>
    item
      .split("CREATE TABLE")[1]
      .split("(")[0]
      .trim()
      .replace('"', "")
      .replace('"', "")
      .replace("`", "")
      .replace("`", "")
  );
  const jsoned: ParsedJSON = {};
  tables = tables.slice(0, 100);
  tables.map((table) => {
    const tableWithColumns = create.filter((item) =>
      item.includes(`CREATE TABLE \`${table}\``)
    );
    const columns = tableWithColumns.map((table) => {
      const lines = table.split("\n");
      const columnLines = lines.filter((line) => line.trim().startsWith("`"));
      const columns = columnLines.map((line) => {
        const trimmed = line.trim();
        const name = trimmed.split(" ")[0].replace("`", "").replace('\`', "");
        const type = trimmed.split(" ")[1].replace("\,", "");
        return { name, type };
      });
      return columns;
    });
    jsoned[table] = columns[0];
  });
  return jsoned;
};

export const postgreSQLParser = (script: string) => {
  const statements = script.split(";");
  const create: string[] = [];
  statements.forEach((statement) => {
    if (statement.trim().includes("CREATE TABLE")) {
      create.push(statement);
    }
  });
  let tables = create.map((item) =>
    item.split("CREATE TABLE")[1].split("(")[0].trim()
  );
  const jsoned: ParsedJSON = {};
  tables = tables.slice(0, 100);
  tables.map((table) => {
    const schema = table.split(".")[0];
    const tableName = table.split(".")[1].replace('"', "").replace('"', "");
    const tableWithColumns = create.filter((item) => item.includes(table))[0];
    const lines = tableWithColumns.split("\n");
    let createFlag = false;
    const columns = [];
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith("CREATE TABLE")) {
        createFlag = true;
        if (lines.length - 1 === i) {
          const col = lines[i].split("(")[1].split(" ");
          const name = col[1];
          const type = col[2];
          if (type === "ON") throw new Error("Invalid Schema");
          columns.push({
            name,
            type,
          });
        }
        continue;
      }
      if (createFlag) {
        lines[i] = lines[i].trim();
        const name = lines[i].split(" ")[0].replace('"', "");
        let type = lines[i].split(" ")[1];
        if(type === 'ON') throw new Error('Invalid Schema');
        if (!type) continue;
        type = type.replace("\,", "");
        columns.push({
          name,
          type,
        });
      }
    }
    jsoned[tableName] = columns;
  });
  return jsoned;
};

export const msSQLServerParser = (script: string) => {
  script = script.split('ON [PRIMARY]').map((item) => item[0] !== ';' ? ';' + item : item).join('ON [PRIMARY]');
  const statements = script.replaceAll("CREATE TABLE #", '').split(';');
  const create: string[] = [];
  statements.forEach((statement) => {
    if (statement.trim().includes("CREATE TABLE")) {
      create.push(statement.trim());
    }
  });
  let tables = create.map((item) =>
    item
      .split("CREATE TABLE")[1]
      .split("[")[2]
      .trim()
      .replace("[", "")
      .replace("]", "")
      .replace("(", "")
  );
  tables = tables.slice(0, 100);
  const jsoned: ParsedJSON = {};
  tables.map((table) => {
    const tableWithColumns = create.filter((item) =>
      item.includes(`CREATE TABLE [dbo].[${table.replaceAll('\r', '').replaceAll('\n', '')}]`)
    );
    const columns = tableWithColumns.map((table) => {
      const lines = table.split("\n");
      const columnLines = lines.filter((line) => line.trim().startsWith("["));
      const columns = columnLines.map((line) => {
        const trimmed = line.trim();
        const name = trimmed.split(" ")[0].replace("[", "").replace("]", "");
        const includesLimit = trimmed
          .split(" ")
          .slice(1)
          .join("")
          .includes("(");
        // If the type includes a limit, we don't need to split it with '(' or it'll break the logic
        let type = includesLimit
          ? trimmed
              .split(" ")
              .slice(1)
              .join("")
              .split(")")[0]
              .replace("[", "")
              .replace("]", "") + ")"
          : trimmed
              .split(" ")[1]
              .split("(")[0]
              .replace("[", "")
              .replace("]", "");
        //Remove unnecessary keywords here
        // if (type.includes("IDENTITY"))
        //   type = type.replace("IDENTITY(1,1)", " IDENTITY(1,1)");
        type = type.replace("IDENTITY(1,1)", "");
        return { name, type };
      });
      return columns;
    });
    jsoned[table.replaceAll('\r', '').replaceAll('\n', '')] = columns[0];
  });
  return jsoned;
};
