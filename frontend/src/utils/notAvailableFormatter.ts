const notAvailableFormatter = <T>(data: T, suffix?: string) => {
  if (data) {
    if (suffix) {
      return data + suffix;
    }
    return data;
  }
  return "N/A";
};

export default notAvailableFormatter;
