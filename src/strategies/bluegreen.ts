export interface BlueGreenConfig { active: string; standby: string; healthEndpoint: string; timeout: number; }
export async function blueGreenDeploy(config: BlueGreenConfig): Promise<string> {
  console.log(Deploying to ...);
  await sleep(config.timeout);
  const isHealthy = await checkHealth(config.healthEndpoint);
  if (!isHealthy) throw new Error('Health check failed');
  const tmp = config.active; config.active = config.standby; config.standby = tmp;
  return config.active;
}
async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }
async function checkHealth(url: string): Promise<boolean> { try { const r = await fetch(url); return r.ok; } catch { return false; } }
