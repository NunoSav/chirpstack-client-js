import axios from "axios";
import { chirpstackConfig } from "./config";
import { Device } from "./device";

//#region Interfaces

export interface Payload {
  deviceQueueItem: Downlink;
}

export interface Downlink {
  /**
   * Device EUI (HEX encoded).
   */
  devEUI: string;

  /**
   * Set this to true when an acknowledgement from the device is required.
   * Please note that this must not be used to guarantee a delivery.
   */
  confirmed: boolean;

  /**
   * Downlink frame-counter.
   * This will be automatically set on enquue.
   */
  fCnt?: number;

  /**
   * FPort used (must be > 0)
   */
  fPort: number;

  /**
   * Base64 encoded data.
   * Or use the jsonObject field when an application codec has been configured.
   */
  data: string;

  /**
   * JSON object (string).
   * Only use this when an application codec has been configured that can convert
   * this object into binary form.
   */
  jsonObject: string;
}

export enum DownlinkQueueMethod {
  Push = "push",
  Replace = "replace",
}

//#endregion

//#region Methods
export async function downlinkQueuePush(
  devices: Device[],
  payload: Payload
): Promise<void> {
  for await (const device of devices) {
    await queueDownlink(device, payload, DownlinkQueueMethod.Push);
  }
}

export async function downlinkQueueReplace(
  devices: Device[],
  payload: Payload
): Promise<void> {
  for await (const device of devices) {
    await queueDownlink(device, payload, DownlinkQueueMethod.Replace);
  }
}

export async function queueDownlink(
  device: Device,
  payload: Payload,
  method: DownlinkQueueMethod
): Promise<void> {
  if (!device.devEUI)
    throw new Error("Device lacks device identifier (devEUI)!");

  if (method === DownlinkQueueMethod.Replace) await flushQueue(device);

  const url = `${chirpstackConfig.domain}/api/devices/${device.devEUI}/queue`;
  const data = JSON.stringify(payload);

  await axios.post(url, data, { headers: chirpstackConfig.headers });
}

async function flushQueue(device: Device): Promise<void> {
  const url = `${chirpstackConfig.domain}/api/devices/${device.devEUI}/queue`;
  await axios.delete(url, { headers: chirpstackConfig.headers });
}
//#endregion
