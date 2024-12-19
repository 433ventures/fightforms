import fs from 'fs';
import path from 'path';

export default {
  chat: fs.readFileSync(path.join(__dirname,'chat.md'), 'utf8'),
  linkedin: fs.readFileSync(path.join(__dirname,'linkedin.md'), 'utf8'),
  postprocess: fs.readFileSync(path.join(__dirname,'postprocess.md'), 'utf8'),
};