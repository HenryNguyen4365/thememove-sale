import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { Card, Layout } from "@shopify/polaris";
import { themeChart } from "../../constants/themeChart";

const ChartPreview = ({ state }) => {
  const [inputData, setInputData] = useState([]);
  const [days, setDays] = useState([]);
  useEffect(() => {
    const filterData = themeChart.map((theme) => {
      return state
        .filter((item) => item.name === theme.label)
        .map((item) => {
          return item.sales;
        });
    });

    setInputData(() => {
      return themeChart.map((v, i) => {
        return { ...v, data: filterData[i] };
      });
    });
  }, [state]);

  useEffect(() => {
    const filterData = [
      ...new Map(
        state.map((item) => [item.created_at, item.created_at])
      ).values(),
    ];
    setDays(filterData);
  }, [state]);
  return (
    <div style={{ marginBottom: "30px", width: "100%" }}>
      <Layout.Section>
        <Card sectioned title="Chart">
          <Line
            data={{
              datasets: inputData,
              labels: days,
            }}
          />
        </Card>
      </Layout.Section>
    </div>
  );
};
export default ChartPreview;
