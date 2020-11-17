const appName = 'agcyweb';

const staffInfoMap = {
  agcyweb: 'AgcyPlat',
};

const loginInfoMap = {
  agcyweb: 'agcyWeb',
};

function getTokenName() {
  return `${staffInfoMap[appName]}.token`;
}

export function getToken() {
  let token = localStorage.getItem(getTokenName());
  if (token) {
    const tokenObj = JSON.parse(token);
    tokenObj.appType = loginInfoMap[appName];
    token = JSON.stringify(tokenObj);
  }
  return token;
}

export function setToken(tokenStr) {
  const tokenObj = JSON.parse(tokenStr);
  const { loginTime, orgId, staffId } = tokenObj;
  localStorage.setItem(getTokenName(), JSON.stringify({ loginTime, orgId, staffId }));
}

export function clearToken() {
  localStorage.removeItem(getTokenName());
}
