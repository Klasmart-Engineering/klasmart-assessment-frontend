export function sortByClassName(className: string) {
  return function (x: any, y: any) {
    let reg = /[a-zA-Z0-9]/;
    if (reg.test(x[className]) || reg.test(y[className])) {
      if (x[className].toLowerCase() > y[className].toLowerCase()) {
        return 1;
      } else if (x[className].toLowerCase() < y[className].toLowerCase()) {
        return -1;
      } else {
        return 0;
      }
    } else {
      return x[className].localeCompare(y[className], "zh");
    }
  };
}
