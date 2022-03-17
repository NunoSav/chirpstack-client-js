import { Applications, getAllApplications } from './application';
import { setAPIKey, setConfigValues, setDomain } from './config';
import { Device, Devices, getAllDevices, getDevices } from './device';
import { downlinkQueuePush, downlinkQueueReplace, Payload } from './downlink';

//#region Interfaces
export interface ClientOptions {
  /**
   * Personal User API key
   */
  apiKey?: string;

  /**
   * Domain of your account (e.g.: https://chirpstack.domain)
   */
  domain: string;
}

interface Client {
  getAllApplications(): Promise<Applications>;
  getAllDevices(): Promise<Devices>;
  getDevices(applicationIdentifier: number): Promise<Devices>;
  downlinkQueuePush(devices: Device[], payload: Payload): Promise<void>;
  downlinkQueueReplace(devices: Device[], payload: Payload): Promise<void>;
  setAPIKey(key: string): void;
  setDomain(domain: string): void;
}
//#endregion

export function client(options: ClientOptions): Client {
  setConfigValues(options);

  const response: Client = {
    getAllApplications,
    getAllDevices,
    getDevices,
    downlinkQueuePush,
    downlinkQueueReplace,
    setAPIKey,
    setDomain,
  };

  return response;
}
