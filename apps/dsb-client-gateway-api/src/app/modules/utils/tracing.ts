import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from '@opentelemetry/core';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

const exporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces',
});

const metricExporter = new OTLPMetricExporter({
  url: 'http://localhost:4318/v1/metrics',
});

// const provider = new BasicTracerProvider({
//   resource: new Resource({
//     [SemanticResourceAttributes.SERVICE_NAME]: 'ddhub-dev',
//     [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: 'dev',
//   }),
// });
//
// provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
//
// provider.register();

const otelSDK = new NodeSDK({
  // metricExporter: metricExporter,
  // metricInterval: 1000,
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'ddhub-dev',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: 'dev',
  }),
  // contextManager: new AsyncLocalStorageContextManager(),
  traceExporter: exporter,
  textMapPropagator: new CompositePropagator({
    propagators: [
      new W3CTraceContextPropagator(),
      new W3CBaggagePropagator(),
      new B3Propagator(),
      new B3Propagator({
        injectEncoding: B3InjectEncoding.MULTI_HEADER,
      }),
    ],
  }),
  spanProcessor: new BatchSpanProcessor(exporter, {
    // The maximum queue size. After the size is reached spans are dropped.
    maxQueueSize: 10,
    // The maximum batch size of every export. It must be smaller or equal to maxQueueSize.
    maxExportBatchSize: 10,
    // The interval between two consecutive exports
    scheduledDelayMillis: 50,
    // How long the export can run before it is cancelled
    exportTimeoutMillis: 3000,
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

export default otelSDK;

// You can also use the shutdown method to gracefully shut down the SDK before process shutdown
// or on some operating system signal.
// process.on('SIGTERM', () => {
//   otelSDK
//     .shutdown()
//     .then(
//       () => console.log('SDK shut down successfully'),
//       (err) => console.log('Error shutting down SDK', err)
//     )
//     .finally(() => process.exit(0));
// });
