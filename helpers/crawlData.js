import dbConnect from "../utils/dbConnect";
import Customers from "../models/Customers";
import format from "date-fns/format";
import cheerio from "cheerio";
import axios from "axios";
import { themeShop } from "../constants/themeShop";
import { utcToZonedTime } from "date-fns-tz";
dbConnect();

export const crawlData = async () => {
  try {
    themeShop.forEach(async (theme) => {
      let presentSales;
      let review;
      await axios.get(theme.url).then((res) => {
        const $ = cheerio.load(res.data);
        presentSales = $(".item-header__sales-count").text();
        console.log(presentSales)
        review = $(".is-visually-hidden").text();
      });
      const getPreviousData = async () => {
        const currentDate = utcToZonedTime(new Date(), "Australia/Sydney");
        const yesterday = new Date(currentDate);

        yesterday.setDate(yesterday.getDate() - 1);
        const data = await Customers.find({
          created_at: format(yesterday, "MM/dd/yyyy"),
        });
        return data;
      };

      const previousDate = await getPreviousData();
      const filterData = previousDate.filter(
        (item) => item.name === theme.name
      );
      // if (previousDate.length === 0) {
      //   await Customers.findOneAndUpdate(
      //     {
      //       created_at: format(yesterday, "MM/dd/yyyy"),
      //       themeId: theme.themeId,
      //       name: theme.name,
      //     },
      //     {
      //       quantity:
      //         Number(presentSales.replace(/\D/g, "")) - theme.fixedSales,
      //       sales: Number(presentSales.replace(/\D/g, "")) - theme.fixedSales,
      //       review: Number(parseFloat(review.match(/[\d\.]+/))),
      //     },
      //     { upsert: true }
      //   );
      // } else {
      const currentDate = utcToZonedTime(new Date(), "Australia/Sydney");
      await Customers.findOneAndUpdate(
        {
          created_at: format(currentDate, "MM/dd/yyyy"),
          themeId: theme.themeId,
          name: theme.name,
        },
        {
          quantity: Number(presentSales.replace(/\D/g, "")) - theme.fixedSales,
          sales:
            Number(presentSales.replace(/\D/g, "")) -
            theme.fixedSales -
            filterData[0].quantity,
          review: Number(parseFloat(review.match(/[\d\.]+/))),
          updatedAt3: currentDate,
        },
        { upsert: true }
      );
      // }
    });
  } catch (error) {
    console.log(error);
  }
};
