import axios from "axios";
import { getAllApplications } from "./application";
import { chirpstackConfig } from "./config";

//#region Interfaces

export interface Devices {
  totalCount: number;
  result: Device[];
}

export interface Device {
    // Device EUI (HEX encoded).
    devEUI: string;

    // Name of the device.
    name: string;

    // Application ID.
    applicationID: number;

    // Description of the device.
    description: string;

    // Device-profile ID attached to the device.
    deviceProfileID: string;

    // Device-profile name.
    deviceProfileName: string;

    // The device battery status (deprecated, use device_status_battery_level).
    // 0:      The end-device is connected to an external power source
    // 1..254: The battery level, 1 being at minimum and 254 being at maximum
    // 255:    The end-device was not able to measure the battery level
    // 256:    The device-status is not available.
    deviceStatusBattery: number;

    // The device margin status
    // -32..32: The demodulation SNR ration in dB
    // 256:     The device-status is not available.
    deviceStatusMargin: number;

    // Device is connected to an external power source.
    deviceStatusExternalPowerSource: boolean;

    // Device battery status is unavailable.
    deviceStatusBatteryLevelUnavailable: boolean;

    // Device battery level as a percentage.
    deviceStatusBatteryLevel: number;

    // The last time the application-server received any data from the device,
    // or an empty string when the device never sent any data.
    lastSeenAt: string;
}

//#endregion

//#region Methods
export async function getAllDevices(): Promise<Devices> {
  const applicationList = await getAllApplications();

  const devices: Devices = {
    totalCount: 0,
    result: [],
  };

  for await (const application of applicationList.result) {
    const applicationDevices = await getDevices(application.id);

    devices.result.push(...applicationDevices.result);
    devices.totalCount += applicationDevices.totalCount;
  }

  return devices;
}

export async function getDevices(applicationId: number): Promise<Devices> {
  const url = `${chirpstackConfig.domain}/api/devices`;

  const { data } = await axios.get<Devices>(url, {
    headers: chirpstackConfig.headers,
    params: {
      limit: 10000,
      applicationId,
    }
  });

  return data;
}
//#endregion
