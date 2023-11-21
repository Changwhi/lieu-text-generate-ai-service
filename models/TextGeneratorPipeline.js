
import { pipeline, env } from '@xenova/transformers';

class TextGeneratorPipeline {
  static task = 'text-generation';
  static model = '../modelFiles/onnx-int8-TinyMistral-248M/';
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {

      // NOTE: Uncomment this to change the cache directory
      env.cacheDir = './.cache';

      this.instance = pipeline(this.task, this.model, { progress_callback });
    }

    return this.instance;
  }
}

export default TextGeneratorPipeline;
