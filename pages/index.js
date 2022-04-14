import { AppProvider, Layout, Page } from "@shopify/polaris";
import Chart from "../components/Chart/Chart";
import Table from "../components/Table";
import translations from "@shopify/polaris/locales/en.json";
import { useState } from "react";
import Options from "../components/microComponents/Options";
const Home = () => {
  const [state, setState] = useState([]);
  return (
    <AppProvider i18n={translations}>
      <Page title="DashBoard">
        <div style={{ marginBottom: "10px" }}>
          <Options setState={setState} />
        </div>
        <Layout>
          <Table state={state} />
          <Chart state={state} />
        </Layout>
      </Page>
    </AppProvider>
  );
};

export default Home;
