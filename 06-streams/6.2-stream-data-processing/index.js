/*
  6.2 Stream data processing: On Kaggle, you can find a lot of interesting data
sets, such as the London Crime Data ( nodejsdp.link/london-crime ). You can
download the data in CSV format and build a stream processing script that
analyzes the data and tries to answer the following questions:
• Did the number of crimes go up or down over the years?
• What are the most dangerous areas of London?
• What is the most common crime per area?
• What is the least common crime?
*/

import { createReadStream } from 'fs';
import { parse } from 'csv-parse'
import { pipeline } from 'stream';
import { CountCrimesByParam  } from './CountCrimesByParam.js';
import { ResultToString  } from './ResultToString.js';
import { SortAndLimit } from './SortAndLimit.js';
import { TopCategoryPerArea } from './TopCategoryPerArea.js';


const fileDest = '/home/baiaman_dev/Documents/short.csv';

const readStream = createReadStream(fileDest);
const csvParser = parse({ skip_records_with_error: true, columns: true });

const cb = (err) => {
  console.log('Error occurred in pipeline', err);
}

// Did the number of crimes go up or down over the years?
pipeline(
  readStream,
  csvParser,
  new CountCrimesByParam({ param: 'year' }),
  new ResultToString({ label: 'Number of crimes by year' }),
  process.stdout,
  cb
);

// What are the most dangerous areas of London?
pipeline(
  readStream,
  csvParser,
  new CountCrimesByParam({ param: 'borough' }),
  new SortAndLimit({ sortDirection: 'desc', limit: 20 }),
  new ResultToString({ label: 'Most dangerous areas in London' }),
  process.stdout,
  cb
);

// What is the least common crime?
pipeline(
  readStream,
  csvParser,
  new CountCrimesByParam({ param: 'major_category' }),
  new SortAndLimit({ sortDirection: 'asc', limit: 20 }),
  new ResultToString({ label: 'Top least common crimes' }),
  process.stdout,
  cb
);

// What is the most common crime per area?
pipeline(
  readStream,
  csvParser,
  new TopCategoryPerArea(),
  new ResultToString({ label: 'Most common crime per area' }),
  process.stdout,
  cb
);
