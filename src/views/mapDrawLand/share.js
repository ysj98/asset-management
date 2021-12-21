/*
 * type
 *   - 0 array to obj return Array  [{x,y}]
 *   - 1 obj to array return Array  [x,y]
 * */
export function arrayToObj(data, type) {
  if (type === 0) {
    return data.map((ele) => {
      return {
        x: ele[0],
        y: ele[1],
      };
    });
  }
  if (type === 1) {
    return data.map((ele) => {
      return [ele.x, ele.y];
    });
  }
}
/*
 * 根据默认样式生成自定义样式
 * */
export function generatePathStyle({ color }, options = {}) {
  const obj = {
    color: color,
    fillColor: color,
    fillOpacity: 0.3,
    hintlineStyle: color,
    templineStyle: color,
    // weight: 0.8,
  };
  return Object.assign(obj, options);
}
