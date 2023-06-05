const port = 5002;

const getUrl = () => {
  const currentUrl = window.location.href;
  const portMatch = currentUrl.match("(:[0-9]+)");
  const url = portMatch
    ? currentUrl.slice(0, currentUrl.indexOf(portMatch[1]))
    : currentUrl;
  return `${url}:${port}`;
};

export const checkRestartAvailable = async (): Promise<boolean> => {
  const url = getUrl();
  const response = await fetch(url, {
    method: "get",
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

export const restart = async (): Promise<boolean> => {
  const response = await fetch(`${getUrl()}/restart`, {
    method: "post",
    headers: {
      "Access-Control-Allow-Origin": "*",
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    // body: JSON.stringify({}),
  });
  if (response.status >= 400) {
    return false;
  }
  return true;
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
  const response = await fetch(`${getUrl()}/vdown`, {
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
