import { Card, DataTable, Layout } from "@shopify/polaris";
import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { buildAlert, sendAlert } from "../helpers/utils";
import { themeShop } from "../constants/themeShop";
import { dataSolving } from "../helpers/dataSolving";
const Table = ({ state }) => {
  const [rowsUpdate, setRowsUpdate] = useState([
    ["MinimogWP", 0, 0],
    ["Flatsome", 0, 0],
    ["WoodMart", 0, 0],
    ["Porto", 0, 0],
    ["XStore", 0, 0],
    ["Razzi", 0, 0],
    ["Goya", 0, 0],
    ["Kalles", 0, 0],
    ["Electro", 0, 0],
    ["Agrofood", 0, 0],
    ["Rey", 0, 0],
    ["Bookory", 0, 0],
    ["Elessi", 0, 0],
    ["Savoy", 0, 0],
    ["MyDecor", 0, 0],
    ["Machic", 0, 0],
    ["Sober", 0, 0],
    ["ekommart", 0, 0],
    ["Bacola", 0, 0],
    ["Martfury", 0, 0],
  ]);

  const [rowsOfSlack, setRowsOfSlack] = useState([
    ["MinimogWP", 0, 0],
    ["Flatsome", 0, 0],
    ["WoodMart", 0, 0],
    ["Porto", 0, 0],
    ["XStore", 0, 0],
    ["Razzi", 0, 0],
    ["Goya", 0, 0],
    ["Kalles", 0, 0],
    ["Electro", 0, 0],
    ["Agrofood", 0, 0],
    ["Rey", 0, 0],
    ["Bookory", 0, 0],
    ["Elessi", 0, 0],
    ["Savoy", 0, 0],
    ["MyDecor", 0, 0],
    ["Machic", 0, 0],
    ["Sober", 0, 0],
    ["ekommart", 0, 0],
    ["Bacola", 0, 0],
    ["Martfury", 0, 0],
  ]);

  const [title, setTitle] = useState("");

  useEffect(() => {
    const filterData = [];

    for (let i = 0; i < themeShop.length; i++) {
      filterData.push(state.filter((item) => themeShop[i].name === item.name));
    }
    dataSolving(rowsUpdate, filterData, setRowsUpdate);
    //Setting up title of table
    const filterDate = [
      ...new Map(
        state.map((item) => [item.created_at, item.created_at])
      ).values(),
    ];
    let startingText = "Table of sales in ";
    setTitle((prev) => {
      if (filterDate.length === 0) {
        prev = startingText;
      } else if (filterDate.length === 1) {
        prev = startingText + filterDate[0];
      } else {
        prev =
          startingText +
          filterDate[0] +
          " to " +
          filterDate[filterDate.length - 1];
      }
      return prev;
    });
  }, [state]);

  useEffect(() => {
    if (typeof window === "object") {
      const domArr = document.getElementsByClassName("Polaris-DataTable__TableRow Polaris-DataTable--hoverable")
        for(let item of domArr) {
          let textName = item.getElementsByClassName("Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn")[0].innerHTML
          let textRating = item.getElementsByClassName("Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--numeric")[0].innerHTML
          const linkTheme = themeShop.find(theme => theme.name === textName)
          let a = textName.link(linkTheme?.url)
          // a.setAttribute("target", "_blank")
          // a.setAttribute("rel", "noopener noreferrer")
          let parser = new DOMParser();
	        let doc = parser.parseFromString(a, 'text/xml');
          if(linkTheme?.url !== undefined) {
            item.getElementsByClassName("Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn")[0].innerHTML = a;
          }
          if(textName !== "MinimogWP") {
            item.style.backgroundColor = ""
          }
          if(textName === "MinimogWP" && textRating !== 0 || doc.firstChild.firstChild.innerHTML === "MinimogWP") {
            item.style.backgroundColor = "#F2D7D5"
          }
        }
    }
  }, [rowsUpdate])
  
  //Data of Sending to Slack
  useEffect(() => {
    const getData = async () => {
      try {
        const filterData = [];
        await Promise.all(
          themeShop.map(async (theme) => {
            const { data } = await axios.get(`/api/crawl?shop=${theme.name}`);
            filterData.push(data);
          })
        );
        dataSolving(rowsOfSlack, filterData, setRowsOfSlack);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);
  const handleClick = () => {
    sendAlert(buildAlert(rowsOfSlack));
  };
  
  return (
    <Layout.Section fullWidth>
      <Card
        title={title}
        sectioned
        actions={[{ content: "Post to Slack", onAction: () => handleClick() }]}
      >
        <DataTable
          columnContentTypes={["text", "numeric", "numeric"]}
          headings={["Name", "Rating", "Sales"]}
          rows={rowsUpdate}
        />
      </Card>
    </Layout.Section>
  );
};

export default Table;
