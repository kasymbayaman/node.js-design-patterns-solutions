import fs from "fs";
import path from "path";

const result = {
  runningOps: 1,
  fileList: [],
};


function listNestedFiles(dirPath, cb) {
  fs.readdir(dirPath, {}, (err, files) => {
    if (err) {
      if (err.code !== "ENOTDIR") return cb(err);

      // if it is file -> push to filesList
      result.fileList.push(dirPath);
    } else {
      for (const file of files) {
        result.runningOps++;
        listNestedFiles(path.join(dirPath, file), cb);
      }
    }

    result.runningOps--;
    process.nextTick(() => {
      if (!result.runningOps) return cb(null, result.fileList);
    });
  });
}