import { ToWords } from "to-words";
const toWords = new ToWords({
  localeCode: "en-BD",
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      name: "Taka",
      plural: "Takas",
      symbol: "৳",
      fractionalUnit: {
        name: "Poisha",
        plural: "Poisha",
        symbol: "",
      },
    },
  },
});
const currencyToWords = (money: number) => {
  let m = typeof money === "number" ? money : Number(money);

  return toWords.convert(m);
};

export default currencyToWords;
