export interface CanaryConfig { initialWeight: number; increment: number; interval: number; maxWeight: number; thresholds: { errorRate: number; latencyP99: number }; }
export async function canaryDeploy(config: CanaryConfig, deployFn: (weight: number) => Promise<void>): Promise<void> {
  let weight = config.initialWeight;
  while (weight < config.maxWeight) {
    await deployFn(weight);
    await sleep(config.interval);
    weight = Math.min(weight + config.increment, config.maxWeight);
  }
}
function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }
