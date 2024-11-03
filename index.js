'use strict';

let element_filechooser = undefined; // input
let element_ignorarHeaderCSV = undefined; // input
let element_algoritmo = undefined; // select
let element_seccionLinearRegression = undefined; // div
let element_seccionPolynomialRegression = undefined; // div
let element_seccionDecisionTree = undefined; // div
let element_seccionNaiveBayes = undefined; // div
let element_seccionNeuralNetwork = undefined; // div
let element_seccionKMeans = undefined; // div
let element_seccionKNearestNeighbor = undefined; // div
let element_resultadosGeneral = undefined; // div
let element_resultadosGoogle = undefined; // div
let element_resultadosCanvas = undefined; // div
let element_entrenarLinearRegression = undefined; // button
let element_rangoXLinearRegression = undefined; // input
let element_predecirLinearRegression = undefined; // button
let element_gradosPolynomialRegression = undefined; // input
let element_entrenarPolynomialRegression = undefined; // button
let element_rangoXPolynomialRegression = undefined; // input
let element_predecirPolynomialRegression = undefined; // button
let element_clasesKMeans = undefined; // input
let element_clasificarKMeans = undefined; // button

let LRData = undefined; // class LinearRegression
let PRData = undefined; // class PolynomialRegression

function Array2DToHTMLTable(array2D) {
    const table = document.createElement('table');
    const tableHead = document.createElement('thead');
    const tableBody = document.createElement('tbody');

    const headInfo = { parent: tableHead, celltype: 'th', cellstyle: 'font-bold p-2 border-b text-left' }
    const bodyInfo = { parent: tableBody, celltype: 'td', cellstyle: 'p-2 border-b text-left' }

    array2D.forEach(function(array1D, rowIndex) {
        const rowInfo = rowIndex === 0 ? headInfo : bodyInfo;
        const row = document.createElement('tr');

        array1D.forEach(function(value) {
            const cell = document.createElement(rowInfo.celltype);
            cell.appendChild(document.createTextNode(value !== undefined ? value : ''));

            cell.className = rowInfo.cellstyle;

            row.appendChild(cell);
        });
        rowInfo.parent.appendChild(row);
    });

    table.className = 'table-auto border';

    table.appendChild(tableHead);
    table.appendChild(tableBody);
    return table;
}

function isNumber(num) {
    if (typeof num === 'number') {
        return num - num === 0;
    }
    if (typeof num === 'string' && num.trim() !== '') {
        return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
    }
    return false;
}

function openCSV() {
    const [file] = element_filechooser.files;

    if (!file) {
        alert('File: debe seleccionar un archivo CSV');
        return undefined;
    }

    return file;
}

async function readCSV(file, onlyNumbersAllowed) {
    let rawText;
    try {
        rawText = await file.text();
    }
    catch (err) {
        alert('File: el archivo seleccionado ha cambiado externamente, debe re-seleccionarlo')
        return ''
    }
    const rawRows = rawText.trim().split('\n');

    if (element_ignorarHeaderCSV.checked) {
        rawRows.shift();
    }

    if (!rawRows.length) {
        alert('CSV: el archivo no tiene registros');
        return [];
    }

    const rows = rawRows.map(rawRow => rawRow.split(','));

    if (onlyNumbersAllowed && !rows.every(row => row.every(value => isNumber(value)))) {
        alert('CSV: advertencia: el archivo posee valores no numéricos');
    }

    return rows;
}

function showLinearRegression() {
    element_rangoXLinearRegression.value = '';
    LRData = undefined;

    element_seccionLinearRegression.style.display = '';
}
function hideLinearRegression() {
    element_resultadosGoogle.style.height = '';
    element_resultadosCanvas.style.height = '';
    element_resultadosGeneral.replaceChildren();
    element_resultadosGoogle.replaceChildren();
    element_resultadosCanvas.replaceChildren();

    element_seccionLinearRegression.style.display = 'none';
}

function showPolynomialRegression() {
    element_gradosPolynomialRegression.value = '';
    element_rangoXPolynomialRegression.value = '';
    PRData = undefined;

    element_seccionPolynomialRegression.style.display = '';
}
function hidePolynomialRegression() {
    element_resultadosGoogle.style.height = '';
    element_resultadosCanvas.style.height = '';
    element_resultadosGeneral.replaceChildren();
    element_resultadosGoogle.replaceChildren();
    element_resultadosCanvas.replaceChildren();

    element_seccionPolynomialRegression.style.display = 'none';
}

function showDecisionTree() {

    element_seccionDecisionTree.style.display = '';
}
function hideDecisionTree() {
    element_resultadosGoogle.style.height = '';
    element_resultadosCanvas.style.height = '';
    element_resultadosGeneral.replaceChildren();
    element_resultadosGoogle.replaceChildren();
    element_resultadosCanvas.replaceChildren();

    element_seccionDecisionTree.style.display = 'none';
}

function showNaiveBayes() {

    element_seccionNaiveBayes.style.display = '';
}
function hideNaiveBayes() {
    element_resultadosGoogle.style.height = '';
    element_resultadosCanvas.style.height = '';
    element_resultadosGeneral.replaceChildren();
    element_resultadosGoogle.replaceChildren();
    element_resultadosCanvas.replaceChildren();

    element_seccionNaiveBayes.style.display = 'none';
}

function showNeuralNetwork() {

    element_seccionNeuralNetwork.style.display = '';
}
function hideNeuralNetwork() {
    element_resultadosGoogle.style.height = '';
    element_resultadosCanvas.style.height = '';
    element_resultadosGeneral.replaceChildren();
    element_resultadosGoogle.replaceChildren();
    element_resultadosCanvas.replaceChildren();

    element_seccionNeuralNetwork.style.display = 'none';
}

function showKMeans() {

    element_seccionKMeans.style.display = '';
}
function hideKMeans() {
    element_resultadosGoogle.style.height = '';
    element_resultadosCanvas.style.height = '';
    element_resultadosGeneral.replaceChildren();
    element_resultadosGoogle.replaceChildren();
    element_resultadosCanvas.replaceChildren();

    element_seccionKMeans.style.display = 'none';
}

function showKNearestNeighbor() {

    element_seccionKNearestNeighbor.style.display = '';
}
function hideKNearestNeighbor() {
    element_resultadosGoogle.style.height = '';
    element_resultadosCanvas.style.height = '';
    element_resultadosGeneral.replaceChildren();
    element_resultadosGoogle.replaceChildren();
    element_resultadosCanvas.replaceChildren();

    element_seccionKNearestNeighbor.style.display = 'none';
}

const algoritmos = [
    {
        text: 'Linear Regression',
        showOptions: showLinearRegression,
        hideOptions: hideLinearRegression
    },
    {
        text: 'Polynomial Regression',
        showOptions: showPolynomialRegression,
        hideOptions: hidePolynomialRegression
    },
    {
        text: 'Decision Tree',
        showOptions: showDecisionTree,
        hideOptions: hideDecisionTree
    },
    {
        text: 'Naive Bayes',
        showOptions: showNaiveBayes,
        hideOptions: hideNaiveBayes
    },
    {
        text: 'Neural Network',
        showOptions: showNeuralNetwork,
        hideOptions: hideNeuralNetwork
    },
    {
        text: 'KMeans',
        showOptions: showKMeans,
        hideOptions: hideKMeans
    },
    {
        text: 'K-Nearest Neighbor',
        showOptions: showKNearestNeighbor,
        hideOptions: hideKNearestNeighbor
    }
];

async function LinearRegression_EjecutarEntrenamiento() {
    const file = openCSV();
    if (!file) {
        return;
    }

    const rows = await readCSV(file, true);
    if (!rows.length) {
        return;
    }

    const xTrain = rows.map(row => Number(row[0]));
    const yTrain = rows.map(row => Number(row[1]));
    const LR = new LinearRegression();

    LR.fit(xTrain, yTrain);

    LRData = {
        LR,
        xTrain,
        yTrain
    }
    alert('Linear Regression: entrenamiento finalizado correctamente');
}

function LinearRegression_EjecutarPrediccion() {
    if (!LRData) {
        alert('Linear Regression: debe ejecutarse el entrenamiento primero');
        return;
    }

    const rawValues = element_rangoXLinearRegression.value.trim().split(',');

    if (!rawValues.length) {
        alert('Linear Regression: debe introducir al menos un valor para predecir');
        return;
    }

    if (!rawValues.every(value => isNumber(value))) {
        alert('Linear Regression: para predecir debe introducir solo datos numéricos');
        return;
    }

    const xPredict = rawValues.map(value => Number(value));
    const yPredict = LRData.LR.predict(xPredict);

    if (!isGoogleChartsReady()) {
        alert('Google Charts: la librería no está cargada, no se pudo generar el gráfico');
        return;
    }

    const mapTrainData = new Map();
    for (let i = 0; i < LRData.xTrain.length; i++) {
        mapTrainData.set(LRData.xTrain[i], LRData.yTrain[i]);
    }

    const mapPredictData = new Map();
    for (let i = 0; i < xPredict.length; i++) {
        mapPredictData.set(xPredict[i], yPredict[i]);
    }

    const xAxisValues = [...new Set([...LRData.xTrain, ...xPredict])].sort((a, b) => a - b);

    const zipArrays = () => {
        return [['x', 'yTrain', 'yPredict']].concat(
            xAxisValues.map(
                value => [value, mapTrainData.get(value), mapPredictData.get(value)]
            )
        );
    }

    const googleArrayData = zipArrays();

    const data = google.visualization.arrayToDataTable(googleArrayData);
    const options = {
        seriesType: 'scatter',
        series: {1: {type: 'line'}},
        title: 'Linear Regression',
        hAxis: { title: 'X' },
        vAxis: { title: 'Y (evaluación en X)' },
    };

    const tableResults = Array2DToHTMLTable(googleArrayData);
    element_resultadosGeneral.replaceChildren(tableResults);

    element_resultadosGoogle.style.height = '800px';
    const chart = new google.visualization.ComboChart(element_resultadosGoogle);
    chart.draw(data, options);
}

async function PolynomialRegression_EjecutarEntrenamiento() {
    const file = openCSV();
    if (!file) {
        return;
    }

    const rows = await readCSV(file, true);
    if (!rows.length) {
        return;
    }

    const rawValues = element_gradosPolynomialRegression.value.trim().split(',');

    if (!rawValues.length) {
        alert('Polynomial Regression: debe introducir al menos un grado para entrenar');
        return;
    }

    if (!rawValues.every(value => isNumber(value))) {
        alert('Polynomial Regression: para entrenar debe introducir solo datos numéricos');
        return;
    }

    const grados = rawValues.map(value => Math.floor(Number(value)));

    if (!grados.every(grado => grado > 0)) {
        alert('Polynomial Regression: para entrenar, los grados deben ser mayores a 0');
        return;
    }

    const xTrain = rows.map(row => Number(row[0]));
    const yTrain = rows.map(row => Number(row[1]));

    PRData = {
        PRs: grados.map(grado => {
            const PR = new PolynomialRegression();

            PR.fit(xTrain, yTrain, grado);

            return {PR, grado}
        }),
        xTrain,
        yTrain
    }
    alert('Polynomial Regression: entrenamiento finalizado correctamente');
}

function PolynomialRegression_EjecutarPrediccion() {
    if (!PRData) {
        alert('Polynomial Regression: debe ejecutarse el entrenamiento primero');
        return;
    }

    const rawValues = element_rangoXPolynomialRegression.value.trim().split(',');

    if (!rawValues.length) {
        alert('Polynomial Regression: debe introducir al menos un valor para predecir');
        return;
    }

    if (!rawValues.every(value => isNumber(value))) {
        alert('Polynomial Regression: para predecir debe introducir solo datos numéricos');
        return;
    }

    const xPredict = rawValues.map(value => Number(value));
    const yPredicts = PRData.PRs.map(({PR, grado}) => {
        return {
            grado,
            yPredict: PR.predict(xPredict),
            R2: PR.getError()
        }
    });

    if (!isGoogleChartsReady()) {
        alert('Google Charts: la librería no está cargada, no se pudo generar el gráfico');
        return;
    }

    const mapTrainData = new Map();
    for (let i = 0; i < PRData.xTrain.length; i++) {
        mapTrainData.set(PRData.xTrain[i], PRData.yTrain[i]);
    }

    const mapsPredictData = yPredicts.map(({yPredict}) => {
        const mapPredictData = new Map();
        for (let i = 0; i < xPredict.length; i++) {
            mapPredictData.set(xPredict[i], yPredict[i]);
        }

        return mapPredictData;
    })

    const xAxisValues = [...new Set([...PRData.xTrain, ...xPredict])].sort((a, b) => a - b);

    const zipArrays = () => {
        return [['x', 'yTrain'].concat(yPredicts.map(({grado}) => `yPredict Grado ${grado}`))].concat(
            xAxisValues.map(
                value => [value, mapTrainData.get(value)].concat(
                    mapsPredictData.map(mapPredictData => mapPredictData.get(value))
                )
            )
        );
    }

    const googleArrayData = zipArrays();

    const data = google.visualization.arrayToDataTable(googleArrayData);
    const options = {
        seriesType: 'scatter',
        series: yPredicts.reduce((acc, _, index) => {
            acc[index + 1] = { type: 'line' };
            return acc;
        }, {}),
        title: 'Polynomial Regression',
        hAxis: { title: 'X' },
        vAxis: { title: 'Y (evaluación en X)' },
    };

    const zipArrays2 = () => {
        return [['Grado', 'r^2']].concat(yPredicts.map(({grado, R2}) => [grado, R2]));
    }

    const tableResults1 = Array2DToHTMLTable(zipArrays2());
    const tableResults2 = Array2DToHTMLTable(googleArrayData);

    element_resultadosGeneral.replaceChildren(tableResults1, tableResults2);

    element_resultadosGoogle.style.height = '800px';
    const chart = new google.visualization.ComboChart(element_resultadosGoogle);
    chart.draw(data, options);
}

async function KMeans_Clasificar() {
    const file = openCSV();
    if (!file) {
        return;
    }

    const rawRows = await readCSV(file, true);
    if (!rawRows.length) {
        return;
    }

    const rawValues = element_clasesKMeans.value.trim().split(',');

    if (!rawValues.length) {
        alert('KMeans: debe introducir la cantidad de clases para la clasificación');
        return;
    }

    if (!rawValues.every(value => isNumber(value))) {
        alert('KMeans: para la cantidad de clases debe introducir solo datos numéricos');
        return;
    }

    const cantidadesClases = rawValues.map(value => Math.floor(Number(value)));

    if (!cantidadesClases.every(cantidadClases => cantidadClases > 0)) {
        alert('KMeans: para clasificar, la cantidad de clases deben ser mayores a 0');
        return;
    }

    const rows = rawRows.map(rawRow => rawRow.map(value => Number(value)));

    const kmeansResults = cantidadesClases.map(cantidadClases => {
        const canvasElement = document.createElement('canvas');
        canvasElement.height = '600';
        canvasElement.width = '600';

        const KM = new G8_Kmeans({
            canvas: canvasElement,
            data: rows.map(row => [...row]),
            k: cantidadClases
        });

        console.log(cantidadClases, KM)
        return { KM, canvasElement }
    })

    const tableResult = Array2DToHTMLTable([['x', 'y'], ...rows])

    const tableResults = kmeansResults.map(({KM}) => Array2DToHTMLTable(
        [['Centroid-based cluster', 'x', 'y']].concat(
            KM.means.map((meansPair, index) => [`Cluster ${index + 1}`, ...meansPair])
        )))


    element_resultadosGeneral.replaceChildren(tableResult, ...tableResults)
    element_resultadosCanvas.replaceChildren(...kmeansResults.map(({canvasElement}) => canvasElement))
}

window.onload = function() {
    element_filechooser                  = document.getElementById('filechooser');
    element_ignorarHeaderCSV             = document.getElementById('ignorarHeaderCSV');
    element_algoritmo                    = document.getElementById('algoritmo');
    element_seccionLinearRegression      = document.getElementById('seccionLinearRegression');
    element_seccionPolynomialRegression  = document.getElementById('seccionPolynomialRegression');
    element_seccionDecisionTree          = document.getElementById('seccionDecisionTree');
    element_seccionNaiveBayes            = document.getElementById('seccionNaiveBayes');
    element_seccionNeuralNetwork         = document.getElementById('seccionNeuralNetwork');
    element_seccionKMeans                = document.getElementById('seccionKMeans');
    element_seccionKNearestNeighbor      = document.getElementById('seccionKNearestNeighbor');
    element_resultadosGeneral            = document.getElementById('resultadosGeneral');
    element_resultadosGoogle             = document.getElementById('resultadosGoogle');
    element_resultadosCanvas             = document.getElementById('resultadosCanvas');
    element_entrenarLinearRegression     = document.getElementById('entrenarLinearRegression');
    element_rangoXLinearRegression       = document.getElementById('rangoXLinearRegression');
    element_predecirLinearRegression     = document.getElementById('predecirLinearRegression');
    element_gradosPolynomialRegression   = document.getElementById('gradosPolynomialRegression');
    element_entrenarPolynomialRegression = document.getElementById('entrenarPolynomialRegression');
    element_rangoXPolynomialRegression   = document.getElementById('rangoXPolynomialRegression');
    element_predecirPolynomialRegression = document.getElementById('predecirPolynomialRegression');
    element_clasesKMeans                 = document.getElementById('clasesKMeans');
    element_clasificarKMeans             = document.getElementById('clasificarKMeans');

    if (
           !element_filechooser
        || !element_ignorarHeaderCSV
        || !element_algoritmo
        || !element_seccionLinearRegression
        || !element_seccionPolynomialRegression
        || !element_seccionDecisionTree
        || !element_seccionNaiveBayes
        || !element_seccionNeuralNetwork
        || !element_seccionKMeans
        || !element_seccionKNearestNeighbor
        || !element_resultadosGeneral
        || !element_resultadosGoogle
        || !element_resultadosCanvas
        || !element_entrenarLinearRegression
        || !element_rangoXLinearRegression
        || !element_predecirLinearRegression
        || !element_gradosPolynomialRegression
        || !element_entrenarPolynomialRegression
        || !element_rangoXPolynomialRegression
        || !element_predecirPolynomialRegression
        || !element_clasesKMeans
        || !element_clasificarKMeans
    ) {
        console.error('window.onload: no se ha cargado bien la página');
        return;
    }

    algoritmos.forEach((algoritmo, index) => {
        const isFirst = index === 0;
        const option = new Option(algoritmo.text, index, isFirst, isFirst);

        element_algoritmo.appendChild(option);
    })

    let [currentAlgoritmo] = algoritmos;
    currentAlgoritmo.showOptions();

    element_algoritmo.addEventListener('change', function (event) {
        currentAlgoritmo.hideOptions();

        currentAlgoritmo = algoritmos[event.target.selectedIndex];

        currentAlgoritmo.showOptions();
    });

    element_entrenarLinearRegression.addEventListener('click', LinearRegression_EjecutarEntrenamiento);
    element_predecirLinearRegression.addEventListener('click', LinearRegression_EjecutarPrediccion);
    element_entrenarPolynomialRegression.addEventListener('click', PolynomialRegression_EjecutarEntrenamiento);
    element_predecirPolynomialRegression.addEventListener('click', PolynomialRegression_EjecutarPrediccion);
    element_clasificarKMeans.addEventListener('click', KMeans_Clasificar);
}
