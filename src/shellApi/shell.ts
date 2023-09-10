const port = 5002;

const getUrl = () => {
  const currentUrl = window.location.href;
  const portMatch = currentUrl.match("(:[0-9]+)");
  const url = portMatch
    ? currentUrl.slice(0, currentUrl.indexOf(portMatch[1]))
    : currentUrl;
  return `${url}:${port}`;
};

const makeCall = async (
  method: "get" | "post",
  path?: string
): Promise<boolean> => {
  console.log(`Making call to ${getUrl()}/${path || ""}`);
  const response = await fetch(`${getUrl()}/${path || ""}`, {
    method,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });
  if (response.status >= 400) {
    return false;
  }
  return true;
};

export const checkRestartAvailable = async (): Promise<boolean> => {
  return makeCall("get");
};

export const restart = async (): Promise<boolean> => {
  return makeCall("post", "restart");
};

export const volumeUp = async (): Promise<boolean> => {
  const response = await fetch(`${getUrl()}/vup`, {
    method: "post",
    headers: {
      "Access-Control-Allow-Origin": "*",
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });
  if (response.status >= 400) {
    return false;
  }
  return true;
};

export const volumeDown = async (): Promise<boolean> => {
  return makeCall("post", "vdown");
};

export const bluetoothConnect = async (): Promise<boolean> => {
  return makeCall("post", "btconnect");
};

export const startCasting = async (): Promise<boolean> => {
  return makeCall("post", "caston");
};

export const stopCasting = async (): Promise<boolean> => {
  return makeCall("post", "castoff");
};
