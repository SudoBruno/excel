const { handle } = require("./controller")
const { GoogleSpreadsheet } = require("google-spreadsheet")
const credentials = require("../credentials.json")

//buscando 

// async function getSheetData() {

//     const docId = '1FlXToLYL0W-EVvawsKNI1DJlnQ8dxkC-C62vRdSc1VE'
//     //setando id da planilha aser utilizada
//     const doc = new GoogleSpreadsheet(docId)
//     //autenticando no google
//     await doc.useServiceAccountAuth(credentials)

//     // carrego as informações da planilha
//     await doc.loadInfo();

//     //Seleciono a aba (pelo indice da mesma)
//     const worksheet = doc.sheetsByIndex[0]

//     //captura as linhas da planilha
//     const rows = await worksheet.getRows();

//     rows.map(row => {
//         console.log(row);
//     })


// }

// getSheetData();

async function executeAll() {

    const apiData = await handle()

    console.log(apiData);

    console.time("Tempo")

    // busca dados da planilha
    let xlsx = require("xlsx")

    let wb = xlsx.readFile("banana.xlsx")

    let obj1 = wb.Sheets["OBJ1"]
    let obj2 = wb.Sheets["OBJ2"]
    let obj3 = wb.Sheets["OBJ3"]

    let dataObj11 = apiData
    let dataObj2 = xlsx.utils.sheet_to_json(obj2);
    let dataObj3 = xlsx.utils.sheet_to_json(obj3);

    //complementando o ob1 com preço MO e tempo

    let dataObj1 = dataObj11.map((data, index) => {
        dataObj2.map((dado) => {
            if (data.codForn == dado.RefInt) {
                let add = {
                    Tempo: dado.Temp,
                    MO: dado.MDO,
                    Volumes: Number(dado.Volumes)
                }
                data = Object.assign(data, add)
                //console.log(data,"--__",dado)   
            }
        }
        )
        return data
    })
    //console.log(dataObj1)


    // altera dados
    // cria mes e ano
    let mes = []
    let ano = []
    let c = 0
    let Data = new Date("2023-10-05 00:00:00")
    //Data = "2022-10-05 00:00:00"


    for (var i = 0; i < ((Data.getFullYear()) - 2020); i++) {
        ano[i] = i + 2021

        if (Data.getFullYear() != ano[i]) {
            for (var j = 0; j < 12; j++) {

                mes[c] = j + 1
                c++
            }
        }
        else {
            for (var j = 0; j <= Data.getMonth(); j++) {

                mes[c] = j + 1
                c++
            }
        }
    }


    //console.log(mes, ano)
    //return 0


    // calculos por SKU

    let cont = 0
    let cfat = 0
    let ctempo = 0
    let auxq = []
    let auxf = []
    let auxt = []
    let auxquant = []
    let quantidade1 = []
    let quantidade = []
    let faturamento = []
    let tempo = []
    let y = 0
    let y1 = 0
    let quant = 0

    //console.log(dataObj1)
    //return 0



    for (c = 0; c < dataObj2.length; c++) {
        //console.log('FOR 1: ');
        for (m = 0; m < mes.length; m++) {
            // console.log('FOR 2: ', m);
            for (s = 0; s < dataObj1.length; s++) {
                //   console.log('FOR 3: ', s);
                if (dataObj2[c].RefInt == dataObj1[s].codForn) {
                    //console.log('IF 1');
                    //console.log(ano[y])
                    if (ano[y] == dataObj1[s].anoEntrada) {
                        //console.log('IF 2',ano[y],dataObj1[s].mesEntrada);
                        if (mes[m] == dataObj1[s].mesEntrada) {
                            //console.log('IF 3---',ano[y],"----",mes[m]);
                            cont++
                            quant = quant + quant / dataObj2[c].Volumes
                            //if (cont>0){console.log(cont)}
                            // console.log(mes[m],dataObj1[s].mesEntrada)
                            cfat = cfat + Number(dataObj2[c].MDO) / Number(dataObj2[c].Volumes)
                            ctempo = ctempo + Number(dataObj2[c].Temp) / Number(dataObj2[c].Volumes)

                        }
                    }
                }

            }

            y1 = y1 + Math.round(((1 / 12) + Number.EPSILON) * 10000000000000) / 10000000000000
            y = Math.trunc(y1)
            //console.log("string y ----", y1, "-------", y)

            auxquant[m] = quant
            quant = 0
            auxq[m] = cont
            cont = 0
            auxf[m] = cfat
            cfat = 0
            auxt[m] = ctempo
            ctempo = 0
        }
        y = 0
        y1 = 0
        quantidade1.push(auxquant) //quantidades
        auxquant = []
        quantidade.push(auxq) //volumes
        auxq = []
        faturamento.push(auxf)
        auxf = []
        tempo.push(auxt)
        auxt = []

    }

    //console.log(quantidade)
    //console.timeEnd("Tempo")

    // Calculo por linha

    let contY = 0
    let contY1 = 0
    let cont1 = 0
    let cfat1 = 0
    let ctemp1 = 0
    let quant1 = 0
    auxq = []
    auxquant = []
    auxf = []
    auxt = []
    let quantidadeLinha = []
    let quantidadeLinha1 = []
    let faturamentoLinha = []
    let tempoLinha = []

    for (let l = 0; l < dataObj3.length; l++) {

        for (m = 0; m < mes.length; m++) {

            for (s = 0; s < dataObj1.length; s++) {

                if (dataObj3[l].Setor == dataObj1[s].line) {

                    if (ano[contY] == dataObj1[s].anoEntrada) {

                        if (mes[m] == dataObj1[s].mesEntrada) {
                            cont1++
                            if (Number(dataObj1[s].Volumes) == 0) {
                                quant1 = quant1 + 0
                                cfat1 = cfat1 + 0
                                ctemp1 = ctemp1 + 0
                                //console.log("IF1------",ctemp1,"-------",dataObj1[s].Tempo,"-----",dataObj1[s].Volumes)
                            }
                            else {

                                quant1 = quant1 + quant1 / Number(dataObj1[s].Volumes)
                                cfat1 = cfat1 + Number(dataObj1[s].MO) / Number(dataObj1[s].Volumes)
                                ctemp1 = ctemp1 + Number(dataObj1[s].Tempo) / Number(dataObj1[s].Volumes)
                                //console.log(ctemp1,"-------",dataObj1[s].Tempo,"-----",dataObj1[s].Volumes)
                            }
                        }
                    }
                }
            }
            contY1 = contY1 + Math.round(((1 / 12) + Number.EPSILON) * 10000000000000) / 10000000000000
            contY = Math.trunc(contY1)
            // console.log("string y ----", y)
            auxquant[m] = quant1
            quant1 = 0
            auxq[m] = cont1
            cont1 = 0
            auxf[m] = cfat1
            cfat1 = 0
            auxt[m] = ctemp1
            //console.log(ctemp1)
            ctemp1 = 0

        }
        contY = 0
        contY1 = 0
        quantidadeLinha1.push(auxquant) //quantidade
        auxquant = []
        quantidadeLinha.push(auxq) //volumes
        auxq = []
        faturamentoLinha.push(auxf)
        auxf = []
        tempoLinha.push(auxt)
        auxt = []
        //console.log(tempoLinha)

    }




    // retorna dados

    // quantidade por código

    const newData = quantidade

    let newDataToSheet = xlsx.utils.book_new()
    let newSheet = xlsx.utils.json_to_sheet(newData)
    xlsx.utils.book_append_sheet(newDataToSheet, newSheet, "New Data")

    xlsx.writeFile(newDataToSheet, "QuantPorCod.xlsx")


    // Volumes por Código

    const newData1 = quantidade1

    let newDataToSheet1 = xlsx.utils.book_new()
    let newSheet1 = xlsx.utils.json_to_sheet(newData1)
    xlsx.utils.book_append_sheet(newDataToSheet1, newSheet1, "New Data")

    xlsx.writeFile(newDataToSheet1, "VolPorCod.xlsx")

    // Faturamento Por Código
    const newData2 = faturamento

    let newDataToSheet2 = xlsx.utils.book_new()
    let newSheet2 = xlsx.utils.json_to_sheet(newData2)
    xlsx.utils.book_append_sheet(newDataToSheet2, newSheet2, "New Data")

    xlsx.writeFile(newDataToSheet2, "FatPorCod.xlsx")

    // Tempo por Código
    const newData3 = tempo

    let newDataToSheet3 = xlsx.utils.book_new()
    let newSheet3 = xlsx.utils.json_to_sheet(newData3)
    xlsx.utils.book_append_sheet(newDataToSheet3, newSheet3, "New Data")

    xlsx.writeFile(newDataToSheet3, "TempoPorCod.xlsx")

    // quantidade por Linha

    const newData01 = quantidadeLinha

    let newDataToSheet01 = xlsx.utils.book_new()
    let newSheet01 = xlsx.utils.json_to_sheet(newData01)
    xlsx.utils.book_append_sheet(newDataToSheet01, newSheet01, "New Data")

    xlsx.writeFile(newDataToSheet01, "QuantPorLin.xlsx")


    // Volumes por Linha

    const newData11 = quantidadeLinha1

    let newDataToSheet11 = xlsx.utils.book_new()
    let newSheet11 = xlsx.utils.json_to_sheet(newData11)
    xlsx.utils.book_append_sheet(newDataToSheet11, newSheet11, "New Data")

    xlsx.writeFile(newDataToSheet11, "VolPorLin.xlsx")

    // Faturamento Por Linha
    const newData21 = faturamentoLinha

    let newDataToSheet21 = xlsx.utils.book_new()
    let newSheet21 = xlsx.utils.json_to_sheet(newData21)
    xlsx.utils.book_append_sheet(newDataToSheet21, newSheet21, "New Data")

    xlsx.writeFile(newDataToSheet21, "FatPorLin.xlsx")

    // Tempo por Linha
    const newData31 = tempoLinha

    let newDataToSheet31 = xlsx.utils.book_new()
    let newSheet31 = xlsx.utils.json_to_sheet(newData31)
    xlsx.utils.book_append_sheet(newDataToSheet31, newSheet31, "New Data")

    xlsx.writeFile(newDataToSheet31, "TempoPorLin.xlsx")

    console.log(apiData);

    console.timeEnd("Tempo")
}

executeAll()
