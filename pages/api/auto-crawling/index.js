import { crawlData } from "../../../helpers/crawlData";

export default async function handler(req, res) {
  await crawlData();
}
