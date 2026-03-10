import { useEffect, useState } from "react";
import api from "../api/api";

import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 BarElement,
 Title,
 Tooltip,
 Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
 CategoryScale,
 LinearScale,
 BarElement,
 Title,
 Tooltip,
 Legend
);

function RevenueChart(){

 const [chartData,setChartData] = useState(null);

 useEffect(()=>{

api.get("/dashboard/finance/monthly-revenue")
     .then(res => {

        const months = [
          "Jan","Feb","Mar","Apr","May","Jun",
          "Jul","Aug","Sep","Oct","Nov","Dec"
        ];

        const revenue = new Array(12).fill(0);

        Object.entries(res.data).forEach(([month,value])=>{
           revenue[month-1] = value;
        });

        setChartData({
          labels: months,
       datasets:[
            {
                label:"Revenue",
                data: revenue,
                backgroundColor:"#4f46e5",
                borderRadius:6,
                barThickness:25
            }
          ]
        });

     });

 },[]);

 if(!chartData) return null;

return (
  <div style={{
    marginTop:"30px",
    background:"#fff",
    padding:"20px",
    borderRadius:"12px",
    height:"300px"
  }}>

<h3 style={{marginBottom:"10px"}}>Monthly Revenue</h3>

<div style={{height:"240px"}}>
<Bar 
  data={chartData} 
  options={{
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => "₹" + value
        }
      }
    }
  }}
/>
    </div>

  </div>
);

}

export default RevenueChart;