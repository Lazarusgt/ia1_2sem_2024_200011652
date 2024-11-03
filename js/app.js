// app.js

// Cargar la API de gráficos de Google
google.charts.load('current', {'packages':['corechart']});

class LinearRegression {
    constructor() {
        this.m = 0;
        this.b = 0;
    }

    fit(xTrain, yTrain) {
        const n = xTrain.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

        for (let i = 0; i < n; i++) {
            sumX += xTrain[i];
            sumY += yTrain[i];
            sumXY += xTrain[i] * yTrain[i];
            sumXX += xTrain[i] * xTrain[i];
        }

        this.m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        this.b = (sumY * sumXX - sumX * sumXY) / (n * sumXX - sumX * sumX);
    }

    predict(xValues) {
        return xValues.map(x => this.m * x + this.b);
    }
}

let loadedData = [];
let linearRegressionModel;

// Función para leer el archivo CSV
function loadFile() {
    const fileInput = document.getElementById("fileInput").files[0];
    if (fileInput) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const text = event.target.result;
            loadedData = parseCSV(text);
            document.getElementById("log").innerHTML = "Archivo cargado exitosamente.";
        };
        reader.readAsText(fileInput);
    } else {
        alert("Seleccione un archivo CSV para cargar.");
    }
}

// Función para convertir el texto CSV en una matriz
function parseCSV(text) {
    const rows = text.trim().split("\n");
    return rows.map(row => row.split(",").map(Number));
}

// Función para entrenar el modelo
function trainModel() {
    const modelSelect = document.getElementById("modelSelect").value;
    if (modelSelect === "linearRegression" && loadedData.length > 0) {
        const xTrain = loadedData.map(row => row[0]);
        const yTrain = loadedData.map(row => row[1]);

        linearRegressionModel = new LinearRegression();
        linearRegressionModel.fit(xTrain, yTrain);

        // Guardamos predicciones para usar en la gráfica
        window.xTrain = xTrain;
        window.yTrain = yTrain;
        window.yPredict = linearRegressionModel.predict(xTrain);

        document.getElementById("log").innerHTML = `
            Modelo entrenado exitosamente.<br>
            X Train: ${xTrain}<br>
            Y Train: ${yTrain}<br>
            Y Predicción: ${window.yPredict}
        `;
    } else {
        alert("Seleccione un archivo CSV y el modelo 'Regresión Lineal' para entrenar.");
    }
}

// Función para mostrar la gráfica
function showChart() {
    if (!window.xTrain || !window.yPredict) {
        alert("Debe entrenar el modelo antes de mostrar la gráfica.");
        return;
    }

    const chartData = [['X', 'Y Real', 'Y Predicción']];
    for (let i = 0; i < window.xTrain.length; i++) {
        chartData.push([window.xTrain[i], window.yTrain[i], window.yPredict[i]]);
    }

    drawChart(chartData);
}

// Función para dibujar la gráfica
function drawChart(dataArray) {
    const data = google.visualization.arrayToDataTable(dataArray);
    const options = {
        title: 'Regresión Lineal',
        hAxis: { title: 'X' },
        vAxis: { title: 'Y' },
        seriesType: 'scatter',
        series: { 1: { type: 'line' } }
    };

    const chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}
