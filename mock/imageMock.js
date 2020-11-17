const imageUrl = {
  data:
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542272840700&di=3e36893aaf511209df6f23373233ca64&imgtype=0&src=http%3A%2F%2Fwww.jituwang.com%2Fuploads%2Fallimg%2F150922%2F258230-150922221K447.jpg',
};

function pushData(req, res) {
  return res.json(imageUrl);
}

export default {
  'POST /site/upload/image': pushData,
  'POST /boss/upload/image': pushData,
};
