export function isUTF8(bytes: Uint8Array) {
  var i = 0;
  while (i < bytes.length) {
      if ((// ASCII
          bytes[i] === 0x09 ||
          bytes[i] === 0x0A ||
          bytes[i] === 0x0D ||
          (0x20 <= bytes[i] && bytes[i] <= 0x7E)
      )
      ) {
          i += 1;
          continue;
      }

      if ((// non-overlong 2-byte
          (0xC2 <= bytes[i] && bytes[i] <= 0xDF) &&
          (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xBF)
      )
      ) {
          i += 2;
          continue;
      }

      if ((// excluding overlongs
          bytes[i] === 0xE0 &&
          (0xA0 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
          (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF)
      ) ||
          (// straight 3-byte
              ((0xE1 <= bytes[i] && bytes[i] <= 0xEC) ||
                  bytes[i] === 0xEE ||
                  bytes[i] === 0xEF) &&
              (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
              (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF)
          ) ||
          (// excluding surrogates
              bytes[i] === 0xED &&
              (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0x9F) &&
              (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF)
          )
      ) {
          i += 3;
          continue;
      }

      if ((// planes 1-3
          bytes[i] === 0xF0 &&
          (0x90 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
          (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
          (0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
      ) ||
          (// planes 4-15
              (0xF1 <= bytes[i] && bytes[i] <= 0xF3) &&
              (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
              (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
              (0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
          ) ||
          (// plane 16
              bytes[i] === 0xF4 &&
              (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0x8F) &&
              (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
              (0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
          )
      ) {
          i += 4;
          continue;
      }
      return false;
  }
  return true;
}

// 只处理逗号列分隔符
const COLUMN_DELIMITER = ',';

export function csvToArray(csv: string): string[][] {
  const table = [] as string[][];
  let row: string[] = [];
  let cell = '';
  let openQuote = false;
  let i = 0;
  
  const pushCell = () => {
    row.push(cell);
    cell = '';
  };
  
  const pushRow = () => {
    pushCell();
    table.push(row);
    row = [];
  }
  // 处理行分隔符和列分隔符
  const handleSeparator = (idx: number) => {
    const c = csv.charAt(idx);
    if (c === COLUMN_DELIMITER) {
      pushCell();
    } else if (c === '\r') {
      if (csv.charAt(idx + 1) === '\n') {
        i++;
      }
      pushRow();
    } else if (c === '\n') {
      pushRow();
    } else {
      return false;
    }
    return true;
  }
  
  while (i < csv.length) {
    const c = csv.charAt(i);
    const next = csv.charAt(i + 1);
    if (!openQuote && !cell && c === '"') {
      // 遇到单元第一个字符为双引号时假设整个单元都是被双引号括起来
        openQuote = true;
    } else if (openQuote) {
      // 双引号还未成对的时候
      if (c !== '"') {
        // 如非双引号，直接添加进单元内容
        cell += c;
      } else if (next === '"') {
        // 处理双引号转义
        cell += c;
        i++;
      } else {
        // 确认单元结束
        openQuote = false
        if (!handleSeparator(++i)){
          throw new Error('Wrong CSV format!');
        }
      }
    } else if (!handleSeparator(i)) {
      // 没有双引号包起来时，如非行列分隔符，一律直接加入单元内容
      cell += c;
    }
    i++;
  }
  if (cell) {
    pushRow();
  }
  if(row.length) {
    pushRow();
  }
  return table;
}