Nick Allen
Ruben Rodriguez
Dan Pfeiffer
Alex Baumann
Omar Chughtai
Ameet Sarkar


# deploy new lambda function to AWS from command line
https://serverless.com/framework/docs/getting-started/

Install `Serverless`
```
npm install -g serverless
# Login to the serverless platform (optional)
serverless login
```
If you'd like a new function to test, change one or all of these fields in the `serverless.yml`
* `service` (change the value)
* `stage` (change the value)
* `main` (change the key)

Deploy your new function:
`serverless deploy`

# run node tests
`node -p "require('./index.js').requestTest()"`

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
