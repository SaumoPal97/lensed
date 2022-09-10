import axios from "axios";

export const pinataUpload = async (body, options) => {
  const data = JSON.stringify({
    ...options,
    pinataContent: body,
  });

  const response = await axios({
    method: "post",
    url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmYTVhMDA5Yy1lODZkLTQ5NWYtYWZjMi00NTRhM2E2YWU2OTAiLCJlbWFpbCI6InNhdW1vcGFsLnNoQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJiNzlmMGNlMzFmNmEzYzNkNTVkNSIsInNjb3BlZEtleVNlY3JldCI6Ijg0YzZlYTAyZWZjODg4YWIwNTgxOGIzMTMzMWNmNTA4ZGEyNWQ2ZGI2ZWQyNjU1NzQyYjE4MjUwNDdlMGIzMjUiLCJpYXQiOjE2NjI3OTEyOTR9.1C2GP1SwRXV4P5Tilk48JDuE8wwB9tCHjnKkWtmTwnQ`,
    },
    data: data,
  });
  return response;
};
