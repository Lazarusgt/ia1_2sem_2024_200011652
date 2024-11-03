// app.js

// Función para leer el archivo CSV
function readCSVFile(file, callback) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const text = event.target.result;
        const data = parseCSV(text);
        callback(data);
    };
    reader.readAsText(file);
}

// Función para convertir el texto CSV en datos de matriz
function parseCSV(text) {
    const rows = text.trim().split("\n");
    return rows.map(row => row.split(",").map(Number));
}

// Clase de Regresión Lineal
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

// Función para entrenar el modelo
function trainModel() {
    const fileInput = document.getElementById("fileInput").files[0];
    const modelSelect = document.getElementById("modelSelect").value;

    if (modelSelect === "linearRegression" && fileInput) {
        readCSVFile(fileInput, (data) => {
            loadedData = data;
            const xTrain = data.map(row => row[0]);
            const yTrain = data.map(row => row[1]);

            const linear = new LinearRegression();
            linear.fit(xTrain, yTrain);

            // Guardamos la predicción para mostrar en la gráfica después
            window.yPredict = linear.predict(xTrain);
            window.xTrain = xTrain;
            window.yTrain = yTrain;

            // Log de entrenamiento
            document.getElementById("log").innerHTML = `
                <b>Modelo Entrenado con éxito.</b><br>
                <b>X Train:</b> ${xTrain}<br>
                <b>Y Train:</b> ${yTrain}<br>
                <b>Y Predicción:</b> ${window.yPredict}
            `;
        });
    } else {
        alert("Seleccione un archivo CSV y un modelo válido para entrenar.");
    }
}

// Función para mostrar la gráfica
function showGraph() {
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
