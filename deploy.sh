currentTime=`date "+%Y%m%d%H%M"`
npm run build:site --TIMESTAMP=$currentTime;
npm run build:boss --TIMESTAMP=$currentTime;
npm run build:frontsite --TIMESTAMP=$currentTime;
npm run build:designer --TIMESTAMP=$currentTime;
echo "sh front_all_deploy.sh $currentTime"

