// app.js
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

// Entrenar y predecir
const xTrain = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const yTrain = [1, 4, 1, 5, 3, 7, 2, 7, 4, 9];
const linear = new LinearRegression();
linear.fit(xTrain, yTrain);
const yPredict = linear.predict(xTrain);

// Mostrar resultados
document.getElementById("log").innerHTML = `
    <b>X Train:</b> ${xTrain}<br>
    <b>Y Train:</b> ${yTrain}<br>
    <b>Y Predict:</b> ${yPredict}
`;

// Preparar datos para graficar
const data = [['X', 'Y Real', 'Y Predicción']];
for (let i = 0; i < xTrain.length; i++) {
    data.push([xTrain[i], yTrain[i], yPredict[i]]);
}

// Cargar Google Charts y dibujar la gráfica
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    const chartData = google.visualization.arrayToDataTable(data);
    const options = {
        title: 'Regresión Lineal',
        hAxis: { title: 'X' },
        vAxis: { title: 'Y' },
        seriesType: 'scatter',
        series: {1: {type: 'line'}}
    };

    const chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
    chart.draw(chartData, options);
}
