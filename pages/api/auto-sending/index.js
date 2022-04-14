import { themeShop } from "../../../constants/themeShop";
import { crawlData } from "../../../helpers/crawlData";
import { buildAlert, getDateChart, sendAlert } from "../../../helpers/utils";
import Customers from "../../../models/Customers";
export default async function handler(req, res) {
  try {
    const getData = async () => {
      const result = [
        ["Minimog", 0, 0],
        ["Wokiee", 0, 0],
        ["Kalles", 0, 0],
        ["Shella", 0, 0],
        ["Gecko", 0, 0],
        ["Ella", 0, 0],
      ];
      for (let i = 0; i < themeShop.length; i++) {
        let time = getDateChart("this_week");
        const data = await Customers.find({
          created_at: {
            $gte: time.start,
            $lte: time.end,
          },
        }).exec();
        const filterData = data.filter(
          (item) => item.name === themeShop[i].name
        );

        result.forEach((item1) => {
          filterData.forEach((item2) => {
            if (item1[0] === item2.name) {
              item1[1] = item2.review;
              item1[2] += item2.sales;
            }
          });
        });

        result.sort((a, b) => {
          return b[2] - a[2];
        });
      }
      return result;
    };
    const boardData = await getData();

    sendAlert(buildAlert(boardData));

    res.json(buildAlert(boardData));
  } catch (error) {
    console.log(error);
  }
}
