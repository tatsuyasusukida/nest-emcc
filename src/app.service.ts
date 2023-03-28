import { Injectable, StreamableFile } from '@nestjs/common';
import { spawn } from 'child_process';
import { mkdir, readFile, rm, writeFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class AppService {
  async convertToWasm(source: string): Promise<StreamableFile> {
    const workingDirectory = join(process.cwd(), 'tmp', '' + Date.now());
    const sourceFilename = 'source_code.cpp';
    const sourcePath = join(workingDirectory, sourceFilename);

    await mkdir(workingDirectory, { recursive: true });
    await writeFile(sourcePath, source);
    await new Promise<void>((resolve, reject) => {
      const command = 'emcc';
      const args = [
        '-O2',
        '-s',
        'EXPORTED_FUNCTIONS=_control_loop',
        '-s',
        'ERROR_ON_UNDEFINED_SYMBOLS=0',
        '-o',
        sourceFilename + '.js',
        sourceFilename,
      ];

      const childProcess = spawn(command, args, {
        cwd: workingDirectory,
      });

      childProcess.stdout.pipe(process.stdout);
      childProcess.stderr.pipe(process.stderr);

      childProcess.on('error', reject);
      childProcess.on('exit', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Non-zero exit code: code = ${code}`));
        }
      });
    });

    const wasmBuffer = await readFile(sourcePath + '.wasm');
    await rm(workingDirectory, { force: true, recursive: true });

    return new StreamableFile(wasmBuffer);
  }
}
