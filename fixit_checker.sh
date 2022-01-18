echo "Checking for FixIt updates ..."
cd ../..
git submodule update --remote --merge
git add themes/FixIt
git commit -m ":arrow_up: Chore: update FixIt theme version"