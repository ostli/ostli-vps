#!/bin/sh

# 批量更新所有git历史提交纪录的邮箱和用户信息

git filter-branch --env-filter '

OLD_EMAIL="ostwindli@tencent.com"
CORRECT_NAME="ostli"
CORRECT_EMAIL="9837438@qq.com"

if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags