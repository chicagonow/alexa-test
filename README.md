# [LINK TO KIBANA DASHBOARD](https://search-chicago-now-pizg4l7baxxzpwctvm6ranhodu.us-east-1.es.amazonaws.com/_plugin/kibana/app/kibana#/dashboard/29db0610-45bf-11e8-a9db-578d63ea6553?_g=(refreshInterval%3A('%24%24hashKey'%3A'object%3A351'%2Cdisplay%3A'10%20seconds'%2Cpause%3A!f%2Csection%3A1%2Cvalue%3A10000)%2Ctime%3A(from%3Anow-30m%2Cmode%3Aquick%2Cto%3Anow)))


Nick Allen
Ruben Rodriguez
Dan Pfeiffer
Alex Baumann
Omar Chughtai
Ameet Sarkar

# Disaster Recovery
Use the `stage-west` branch
1. merge in new code from stage (careful overwritting config)
2. initiate build for `stage-west` branch on travis-ci
3. check that lambda was deployed to us-west-2 (oregon) region
4. manually update Alexa Skill to point to newly deployed west endpoint

# run ask-cli to test alexa locally
NOTE: use a bash terminal (cygwin, gitbash, …)

[developer.amazon.com/ask-cli docs](https://developer.amazon.com/docs/smapi/ask-cli-command-reference.html)

TODO - how to make new skills and functions on the fly

#### 0. remove existing ask and aws config
```
rm -rf ~/.aws
rm -rf ~/.ask
```

#### 1. install nvm (node version manager)
* Follow instructions in your bash shell to install https://github.com/creationix/nvm/blob/master/README.md

#### 2. install and use node 9
```
nvm install 9
nvm use 9
```

####3. install aws-sdk (globally)
`npm install -g aws-sdk`

####4. install ask-cli (globally with pinned python version)
`npm install -g ask-cli --python=python2.7`

####5. initialize aws-sdk
`aws configure`

* follow the prompts : use the accesskey and secret key from #random channel
* enter `us-east-1` for region(?)
* enter `json` for type(?)

####6. initialize ask-cli
`ask init`
* choose default, you will be taken to aws login
* login to aws

####7. 
* no need to clone since we have all the code structure in source control

####8. create a new skill, or lambda, or both
1st, to create a new skill, set the `skill_id` to and empty string in ``intent-service/config`

`"skill_id": "",`

2nd, to create a new lambda, name your endpoint.uri to whatever you'd like
```bash

"endpoint": {
                "uri": "chicago-now-my-lambda"
            }
```
3rd, run `ask deploy`.
 
If a new skill or lambda, or both, are needed, they will be created, and a new `skill_id` will auto populate in the config file, but
the lambda may not have picked it up.

Go to your newly created lambda function in consol.aws.com and add a new alexa trigger with the newly created skill id. (you should only have to do this once)

####9. simulate and test your alexa skill against a deployed lambda
`ask simulate -t "ask chicago now what's the status of the diversey brown line" -l en-US`

# run node tests
cd into the directory where package.json is located, and run `npm test`

to run a specific exported runnable node function, `node -p "require('./index.js').theNameOfTheFunction()"`

# git and sourcetree
1. install git (comes with git-bash, or `$ brew install git` with homebrew on mac)
2. would highly recommend a git client like [Sourcetree](https://confluence.atlassian.com/get-started-with-sourcetree/install-and-set-up-sourcetree-847359043.html)
* I don't think we'll have merge conflicts, but the earlier we master this the better

# clone repo
```sh 
mkdir chicagonow
cd chicagonow
git clone git@github.com:chicagonow/test-repository.git
```

# create branch
create a branch
```sh
git checkout -b john-branch
```

NOTE: using `-b` with `checkout` will create the branch first

# change, check, add, commit changes
make a change to the README.md and check that your change exists
```
git status
```
then add and commit your changes to your branch
```
git commit -am"updated the readme"
```

NOTE: `-am` is short for "`a`dd" & "`m`essage"

Example output:
```bash
02/12/18|9:38:32 ➜  test-repository git:(john-test-branch)  $ vi README.md
02/12/18|9:39:10 ➜  test-repository git:(john-test-branch) ✗  $ git status
On branch john-test-branch
Your branch is up-to-date with 'origin/john-test-branch'.
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   README.md

no changes added to commit (use "git add" and/or "git commit -a")
02/12/18|9:41:07 ➜  test-repository git:(john-test-branch) ✗  $ git commit -am"updated readme"
[john-test-branch 33ca06c] updated readme
 1 file changed, 3 insertions(+), 2 deletions(-)
02/12/18|9:41:19 ➜  test-repository git:(john-test-branch)  $ git status
On branch john-test-branch
nothing to commit, working tree clean
02/12/18|9:41:27 ➜  test-repository git:(john-test-branch)  $
```

# push your branch with changes
the first time pushing a branch, you will need to create an "upstream" between your local and remote repos
```
git push -u origin john-test-branch
```
any changes you commit after this point can be pushed simply with
```
git push
```

# create pull request (PR) into master
1. visit the repository on github, and find your branch
2. find the button `Create Pull Request`
3. create a PR from your branch into the `master` (base) branch
4. get teammate to review the PR

# squash and merge

# delete your branch
this branch has served its purpose. don't use this branch again (maybe for a revert...).

# checkout master and pull updates
```
git checkout master
git pull
```
