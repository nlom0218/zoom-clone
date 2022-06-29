const codePlaceHolder = (item: string) => {
  if (item === "1") {
    return "6";
  } else if (item === "2") {
    return "-";
  } else if (item === "3") {
    return "C";
  } else if (item === "4") {
    return "O";
  } else if (item === "5") {
    return "D";
  } else if (item === "6") {
    return "E";
  }
};

export default codePlaceHolder;
