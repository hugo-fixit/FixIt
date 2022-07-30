#! /bin/bash
# author: Lruihao
# Copy this to your path use command:
# cat themes/FixIt/fixit_checker.sh > fixit_checker.sh
echo "Checking for FixIt updates ..."
git submodule update --remote --merge
git add themes/FixIt
git commit -m ":arrow_up: Chore: update FixIt theme version"