// src/types/chartjs-annotation.d.ts
import 'chart.js';
import { AnnotationOptions } from 'chartjs-plugin-annotation';

// Khai bao de typescript hieu plugin annotation
declare module 'chart.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface PluginOptions<TType extends ChartType> {
    annotation?: AnnotationOptions;
  }
}