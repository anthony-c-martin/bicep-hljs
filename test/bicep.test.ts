// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { readdirSync, existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import path, { dirname, basename, extname } from 'path';
import { env } from 'process';
import { spawnSync } from 'child_process';
import * as highlight from 'highlight.js';
import bicep, { default as bicepLanguage } from '../src/bicep';

async function writeBaseline(filePath: string) {
  const baselineBaseName = basename(filePath, extname(filePath));
  const baselineFilePath = path.join(dirname(filePath), `${baselineBaseName}.html`);

  let diffBefore = '';
  const bicepFile = await readFile(filePath, { encoding: 'utf-8' });
  try {
    diffBefore = await readFile(baselineFilePath, { encoding: 'utf-8' });
  } catch {} // ignore and create the baseline file anyway

  highlight.registerLanguage('bicep', bicepLanguage);
  const result = highlight.highlight(bicepFile, { language: 'bicep' });
  const diffAfter = `
<html>
  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/styles/default.min.css">
  </head>
  <body>
    <pre class="hljs">
${result.value}
    </pre>
  </body>
</html`;

  await writeFile(baselineFilePath, diffAfter, { encoding: 'utf-8' });

  return {
    diffBefore,
    diffAfter,
    baselineFilePath,
  };
}

const baselinesDir = `${__dirname}/baselines`;

const baselineFiles = readdirSync(baselinesDir)
  .filter(p => extname(p) === '.bicep')
  .map(p => path.join(baselinesDir, p));

for (const filePath of baselineFiles) {
  describe(filePath, () => {
    let result = {
      baselineFilePath: '',
      diffBefore: '',
      diffAfter: ''
    };

    beforeAll(async () => {
      result = await writeBaseline(filePath);
    });
/*
    if (!basename(filePath).startsWith('bad_')) {
      // skip the invalid files - we don't expect them to compile

      it('can be compiled', async () => {
        const bicepExePathVariable = 'BICEP_CLI_EXECUTABLE';
        const bicepExePath = env[bicepExePathVariable];
        if (!bicepExePath) {
          fail(`Unable to find '${bicepExePathVariable}' env variable`);
          return;
        }
  
        if (!existsSync(bicepExePath)) {
          fail(`Unable to find '${bicepExePath}' specified in '${bicepExePathVariable}' env variable`);
          return;
        }
  
        const result = spawnSync(bicepExePath, ['build', '--stdout', filePath], { encoding: 'utf-8' });
  
        // NOTE - if stderr or status are null, this indicates we were unable to invoke the exe (missing file, or hasn't had 'chmod +x' run)
        expect(result.stderr).toBe('');
        expect(result.status).toBe(0);
      });
    }
*/
    it('baseline matches expected', () => {
      expect(result.diffBefore).toEqual(result.diffAfter);
    });
  });
}