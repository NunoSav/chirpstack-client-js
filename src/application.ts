import axios from "axios";
import { chirpstackConfig } from "./config";

//#region Interfaces
export interface Applications {
  totalCount: number;
  result: Application[];
}

export interface Application {
  // Application ID.
  id: string;

  // Name of the application.
  name: string;

  // Description of the application.
  description: string;

  // ID of the organization to which the application belongs.
  organizationID: string;

  // ID of the service profile.
  serviceProfileID: string;

  // Service-profile name.
  serviceProfileName: string;
}

//#endregion

//#region Methods
export async function getAllApplications(): Promise<Applications> {
  const url = `${chirpstackConfig.domain}/api/applications`;

  const { data } = await axios.get<Applications>(url, {
    headers: chirpstackConfig.headers,
    params: {
      limit: 10000,
    }
  });

  return data;
}
//#endregion
