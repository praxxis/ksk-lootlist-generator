import forEach from 'lodash.foreach';
import trimEnd from 'lodash.trimend';

function convert(value: any, indent = 0) {
  switch (typeof value) {
    case 'string':
      return `"${value}"`;
    case 'object':
      let out = '{\n';
      forEach(value, (v, k) => {
        out += `${' '.repeat(indent * 2)}["${k}"] = ${convert(v, indent + 1)},\n`;
      });
      out = trimEnd(out, ',\n');
      out += `\n${' '.repeat((indent - 1) * 2)}}`;
      return out;
  }
}

export function toLua(data: any) {
  return convert(data, 1);
}
