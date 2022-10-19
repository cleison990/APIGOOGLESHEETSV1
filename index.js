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

app.post("/addReceita", async (req, res) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const { values } = req.body;

    const receita = await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "RECEITAS DIARIAS!A:B",
        valueInputOption: "USER_ENTERED", //para os dados serem adicionados como está na planilha
        resource: {
            values: values,
        },
    });

    res.send(receita.data);
});

app.post("/addDespesa", async (req, res) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const { values } = req.body;

    const despesa = await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "DESPESAS DIARIAS!A:B",
        valueInputOption: "USER_ENTERED", //para os dados serem adicionados como está na planilha
        resource: {
            values: values,
        },
    });

    res.send(despesa.data);
});

app.get("/getAverageReceita", async (req, res) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const getAverageReceita = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "RECEITAS DIARIAS!E2",
        valueRenderOption: "UNFORMATTED_VALUE",   //para os dados serem retornados sem formatação
        dateTimeRenderOption: "FORMATTED_STRING", // para a data ser retornada com formatação
    })
    res.send(getAverageReceita.data)
});

app.get("/getAverageDespesa", async (req, res) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const getAverageDespesa = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "DESPESAS DIARIAS!E2",
        valueRenderOption: "UNFORMATTED_VALUE",  //para os dados serem retornados sem formatação
        dateTimeRenderOption: "FORMATTED_STRING", // para a data ser retornada com formatação
    })
    res.send(getAverageDespesa.data)
});

app.get("/getTotalDespesa", async (req, res) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const getTotalDespesa = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "DESPESAS DIARIAS!F2",
        valueRenderOption: "UNFORMATTED_VALUE",  //para os dados serem retornados sem formatação
        dateTimeRenderOption: "FORMATTED_STRING", // para a data ser retornada com formatação
    })
    res.send(getTotalDespesa.data)
});

app.get("/getTotalReceita", async (req, res) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const getTotalReceita = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "RECEITAS DIARIAS!F2",
        valueRenderOption: "UNFORMATTED_VALUE",  //para os dados serem retornados sem formatação
        dateTimeRenderOption: "FORMATTED_STRING", // para a data ser retornada com formatação
    })
    res.send(getTotalReceita.data)
});


app.listen(port, () => console.log("rodando na porta 3001"))