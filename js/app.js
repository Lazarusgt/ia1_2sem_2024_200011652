// Variables globales para almacenar datos
let xTrain = [];
let yTrain = [];

// Función para leer el archivo CSV
function loadFile() {
    const input = document.getElementById('fileInput');
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result;
        const data = content.split('\n').map(row => row.split(',').map(Number));
        
        // Asume que los datos son numéricos y están en el formato [x, y]
        xTrain = data.map(row => row[0]);
        yTrain = data.map(row => row[1]);
        
        document.getElementById("output").innerHTML = "Archivo cargado con éxito.";
    };
    reader.readAsText(file);
}

// Clase para Regresión Lineal
class LinearRegression {
    constructor() {
        this.m = 0;
        this.b = 0;
    }

    fit(x, y) {
        const n = x.length;
        const xMean = x.reduce((sum, val) => sum + val, 0) / n;
        const yMean = y.reduce((sum, val) => sum + val, 0) / n;

        const num = x.reduce((sum, val, i) => sum + (val - xMean) * (y[i] - yMean), 0);
        const den = x.reduce((sum, val) => sum + Math.pow(val - xMean, 2), 0);

        this.m = num / den;
        this.b = yMean - this.m * xMean;
    }

    predict(x) {
        return x.map(val => this.m * val + this.b);
    }
}

function trainModel() {
    const model = document.getElementById("modelSelect").value;
    
    if (model === "linearRegression") {
        const linear = new LinearRegression();
        linear.fit(xTrain, yTrain);
        const yPredict = linear.predict(xTrain);
        
        document.getElementById("output").innerHTML = `Modelo Entrenado con éxito.
            <br>X Train: ${xTrain.join(',')}
            <br>Y Train: ${yTrain.join(',')}
            <br>Y Predicción: ${yPredict.join(',')}`;
    } else if (model === "kMeans") {
        trainKMeans();
    }
}

function showGraph() {
    const model = document.getElementById("modelSelect").value;
    if (model === "linearRegression") {
        showLinearGraph();
    } else if (model === "kMeans") {
        showKMeansGraph();
    }
}

function showLinearGraph() {
    const linear = new LinearRegression();
    linear.fit(xTrain, yTrain);
    const yPredict = linear.predict(xTrain);

    const chartData = [["X", "Y", "Predicción"]];
    for (let i = 0; i < xTrain.length; i++) {
        chartData.push([xTrain[i], yTrain[i], yPredict[i]]);
    }

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(() => {
        const dataTable = google.visualization.arrayToDataTable(chartData);
        const options = {
            title: "Regresión Lineal",
            seriesType: "scatter",
            series: {1: {type: "line"}}
        };
        const chart = new google.visualization.ComboChart(document.getElementById("chart_div"));
        chart.draw(dataTable, options);
    });
}

// Implementación de K-Means
class KMeans {
    constructor(k) {
        this.k = k;
        this.centroids = [];
    }

    initializeCentroids(data) {
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
    const data = xTrain.map((x, i) => [x, yTrain[i]]);
    const kmeans = new KMeans(3);
    const clusters = kmeans.fit(data);

    document.getElementById("output").innerHTML = `K-means Entrenado con éxito.<br>Clústeres: ${clusters.join(", ")}`;
}

function showKMeansGraph() {
    const data = xTrain.map((x, i) => [x, yTrain[i]]);
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
