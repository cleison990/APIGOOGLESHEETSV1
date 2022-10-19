const express = require("express");
const { google } = require("googleapis");
const cli = require("nodemon/lib/cli");


const app = express();
const port = process.env.PORT || 3000

app.use(express.json())

async function getAuthSheets() {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    })

    const client = await auth.getClient();

    const googleSheets = google.sheets({
        version: "v4",
        auth: client
    })

    const spreadsheetId = "1MigJzaLcJcg-X8DCVUA_pqwcpJjqlF-pJODaZTBjKzA";

    return {
        auth,
        client,
        googleSheets,
        spreadsheetId
    }
}

app.get("/metadata", async (req, res) => {

    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const metadata = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    });

    res.send(metadata.data);

});

app.get("/getRows", async (req, res) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "RECEITAS DIARIAS!A2:Z1000",
        valueRenderOption: "UNFORMATTED_VALUE",  //para os dados serem retornados sem formatação
        dateTimeRenderOption: "FORMATTED_STRING", // para a data ser retornada com formatação
    })
    res.send(getRows.data)
});

app.post("/addRow", async (req, res) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const { values } = req.body;

    const row = await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "RECEITAS DIARIAS",
        valueInputOption: "USER_ENTERED", //para os dados serem adicionados como está na planilha
        resource: {
            values: values,
        },
    });

    res.send(row.data);
});

app.get("/getAverage", async (req, res) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const getAverage = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "RECEITAS DIARIAS!E2",  //para os dados serem retornados sem formatação
        dateTimeRenderOption: "FORMATTED_STRING", // para a data ser retornada com formatação
    })
    res.send(getAverage.data)
});

app.listen(port, () => console.log("rodando na porta 3001"))