import { Transform, TransformOptions } from 'stream';

export class AppendInitVect extends Transform {
  protected appended: boolean = false;

  constructor(protected readonly initVect, opts?: TransformOptions) {
    super(opts);
  }

  _transform(chunk, encoding, cb) {
    if (!this.appended) {
      this.push(this.initVect);
      this.appended = true;
    }
    this.push(chunk);
    cb();
  }
}
