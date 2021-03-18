import fs from "fs";
import path from "path";

const result = {
  runningOps: 1,
  fileList: [],
};

function recursiveFind(dirPath, searchText, cb) {
  fs.readdir(dirPath, {}, (err, files) => {
    if (err) {
      if (err.code !== "ENOTDIR") return cb(err);
      searchInFile(dirPath, searchText, cb);
    } else {
      for (const file of files) {
        result.runningOps++;
        recursiveFind(path.join(dirPath, file), searchText, cb);
      }

      finishOp(cb);
    }
  });
}

function searchInFile(dirPath, searchText, cb) {
  fs.readFile(dirPath, "utf8", (err, data) => {
    if (err) return cb(err);

    if (data.includes(searchText)) result.fileList.push(dirPath);
    finishOp(cb);
  });
}

function finishOp(cb) {
  result.runningOps--;

  process.nextTick(() => {
    if (!result.runningOps) return cb(null, result.fileList);
  });
}
