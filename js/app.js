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
    const parsedData = rows.map(row => row.split(",").map(Number));
    
    // Validación: confirmar que no haya NaN en los datos
    for (let i = 0; i < parsedData.length; i++) {
        if (parsedData[i].some(isNaN)) {
            document.getElementById("log").innerHTML = "Error: Archivo CSV contiene datos no numéricos.";
            return [];
        }
    }
    return parsedData;
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
    google.charts.setOnLoadCallback(function() {
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
    });
}


/////////////////////////icicio//h-means//////////////////////////////

class KMeans {
    constructor(k) {
        this.k = k;
        this.centroids = [];
    }

    initializeCentroids(data) {
        // Inicializa los centroides aleatoriamente
        for (let i = 0; i < this.k; i++) {
            const randomPoint = data[Math.floor(Math.random() * data.length)];
            this.centroids.push([...randomPoint]);
        }
    }

    assignClusters(data) {
        return data.map(point => {
            let minDist = Infinity;
            let cluster = -1;
            this.centroids.forEach((centroid, index) => {
                const dist = Math.sqrt(
                    point.reduce((sum, val, i) => sum + Math.pow(val - centroid[i], 2), 0)
                );
                if (dist < minDist) {
                    minDist = dist;
                    cluster = index;
                }
            });
            return cluster;
        });
    }

    updateCentroids(data, clusters) {
        this.centroids = Array.from({ length: this.k }, () => Array(data[0].length).fill(0));
        const counts = Array(this.k).fill(0);
        data.forEach((point, i) => {
            const cluster = clusters[i];
            counts[cluster]++;
            point.forEach((val, j) => {
                this.centroids[cluster][j] += val;
            });
        });
        this.centroids.forEach((centroid, i) => {
            centroid.forEach((_, j) => centroid[j] /= counts[i] || 1);
        });
    }

    fit(data) {
        this.initializeCentroids(data);
        let clusters;
        for (let i = 0; i < 10; i++) {
            clusters = this.assignClusters(data);
            this.updateCentroids(data, clusters);
        }
        return clusters;
    }
}

function trainKMeans() {
    const data = getDataFromCSV();
    const k = 3; // Cambia la cantidad de clusters según sea necesario
    const kmeans = new KMeans(k);
    const clusters = kmeans.fit(data);

    document.getElementById("output").innerHTML = `<p>Clústeres asignados: ${clusters.join(", ")}</p>`;
}

function showKMeansGraph() {
    const data = getDataFromCSV();
    const kmeans = new KMeans(3);
    const clusters = kmeans.fit(data);

    const chartData = [["X", "Y", { role: "style" }]];
    clusters.forEach((cluster, i) => {
        chartData.push([data[i][0], data[i][1], `color: ${["red", "blue", "green"][cluster]}`]);
    });

    google.charts.setOnLoadCallback(() => {
        const dataTable = google.visualization.arrayToDataTable(chartData);
        const options = { title: "K-means Clustering", hAxis: { title: "X" }, vAxis: { title: "Y" } };
        const chart = new google.visualization.ScatterChart(document.getElementById("chart_div"));
        chart.draw(dataTable, options);
    });
}


///////////////////////////fin//k-means////////////////////////////////
