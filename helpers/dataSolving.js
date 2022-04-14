export const dataSolving = (rows, filterData, setRows) => {
  const result = [...rows];
  const data = filterData.map((theme) => {
    return theme.reduce(
      (prev, cur) => {
        prev[0] = cur.name;
        prev[1] = cur.review;
        prev[2] += cur.sales;
        return prev;
      },
      ["", 0, 0]
    );
  });

  result.map((result) => {
    data.forEach((item) => {
      if (result[0] === item[0]) {
        result[1] = item[1];
        result[2] = item[2];
      }
    });
  });

  result.sort((a, b) => {
    return b[2] - a[2];
  });
  setRows(result);
};
