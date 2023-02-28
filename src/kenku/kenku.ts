// const host = "192.168.86.46";
// const port = "3334";

const url = (host: string, port: string) => `http://${host}:${port}/v1`;

type Method = "get" | "put" | "post";

export interface KenkuRemoteConfig {
  host: string;
  port: string;
}

export const callKenku = async (
  config: KenkuRemoteConfig,
  req: {
    path: string;
    method: Method;
    body?: any;
  },
  quiet?: boolean
) => {
  const response = await fetch(`${url(config.host, config.port)}/${req.path}`, {
    method: req.method,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: req.body && JSON.stringify(req.body),
  });
  const data = await response.json();
  if (!quiet) {
    console.log(JSON.stringify(data, null, 2));
  }
  return data;
};
