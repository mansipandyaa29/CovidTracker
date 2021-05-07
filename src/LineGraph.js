import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2"; #importing Line from react-chartjs-2
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0"); #lets you see whaat value is at a particular point on the graph
      },
    },
  },
--------------------------------------------------------------------------------------------------  
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
--------------------------------------------------------------------------------------------------    
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};
------------------------------------------------------------------------------------------
#converts data to a format that can be represented in the form of a graph
const buildChartData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};
-------------------------------------------------------------------------------------------------
function LineGraph({ casesType }) {
  const [data, setData] = useState({});

  #fetch data from last 120 days for the graph
  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => {return response.json(); })
        .then((data) => {
          let chartData = buildChartData(data, casesType);
          setData(chartData);
          console.log(chartData);
          // buildChart(chartData);
        });
    };

    fetchData();
  }, [casesType]);
-------------------------------------------------------------------------------------------------
  return (
    <div>
      {data?.length > 0 && ( 
        <Line
          data={{datasets: [{backgroundColor: "rgba(204, 16, 52, 0.5)", borderColor: "#CC1034",data: data,},],}}
          options={options}
        />
      )}
    </div>
  );
}

export default LineGraph;
