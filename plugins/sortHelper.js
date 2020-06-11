exports.sorter = sortTop;

function sortTop(type, data) {
  let sortable = [];
  for (const user of data) {
    if (user[1][type]) {
      sortable.push([user[0], user[1][type]]);
    } else {
      sortable.push([user[0], 0]);
    }
  }

  sortable.sort(function (a, b) {
    return a[1] - b[1];
  });
  return sortable.reverse();
}
