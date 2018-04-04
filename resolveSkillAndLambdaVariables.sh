
# replace {BRANCH} with current branch, or use stage or prod .ask and skill.json configs

BRANCH=$(if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then echo $TRAVIS_BRANCH; else echo $TRAVIS_PULL_REQUEST_BRANCH; fi)
echo "TRAVIS_BRANCH=$TRAVIS_BRANCH, PR=$PR, BRANCH=$BRANCH"

if [ $BRANCH == "stage" ]
then
    mv .ask/config-stage .ask/config
    mv skill-stage.json skill.json
elif [ $BRANCH == "master" ]
then
    mv .ask/config-prod .ask/config
    mv skill-prod.json skill.json
else
    eval `sed -i '' s/{BRANCH}/${BRANCH}/g .ask/config`
    eval `sed -i '' s/{BRANCH}/${BRANCH}/g skill.json`
fi


