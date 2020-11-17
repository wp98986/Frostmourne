const imgReg = /(http:\/\/|https:\/\/|\/\/)*(.*)\/(\d{8})\/(.*)\.(jpg|png|gif|bin)(.*)/;
const sizeTable = ['56', '160', '352', '500', '1920'];

const getThumbUrl = (url, size, protocol) => {
  const matchSize = sizeTable.find(st => st === String(size));
  const result = imgReg.exec(url);
  if (!result) {
    return url;
  }
  // eslint-disable-next-line no-unused-vars
  const [origin, originProtocol, host, p1, p2, fileType, other] = result;
  let newProtocol = protocol || originProtocol;
  if (newProtocol === '//' || !newProtocol) newProtocol = 'https';
  newProtocol = newProtocol.replace('://', '');

  let newUrl = `${newProtocol}://${host}/${p1}/${p2}.${fileType}`;
  if (matchSize) {
    newUrl = `${newUrl}@!thumbnail-rule-${matchSize}`;
  }
  return newUrl;
};

const imgOpenUrl = (currentUser = {}) => {
  const { data: { org: { orgType } = {} } = {} } = currentUser;
  let url = '//pei.nature-home.cn/product/view/';
  if (orgType === 'xshCurator' || orgType === 'xshPlat' || orgType === 'xshDesigner') {
    url = '//shop.rzxsh.com/product/view/';
  }
  return url;
};

export { getThumbUrl, imgOpenUrl };
