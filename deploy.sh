echo "ENV: $1"

# Create the .aws and .ask directories
mkdir ~/.aws
mkdir ~/.ask

# Create AWS credentials
echo "[region-west]" > ~/.aws/credentials
echo "aws_access_key_id=$AWS_ACCESS_KEY_ID" >> ~/.aws/credentials
echo "aws_secret_access_key=$AWS_SECRET_ACCESS_KEY" >> ~/.aws/credentials

# Create ASK config
sed -e s/ASK_ACCESS_TOKEN_WEST/${ASK_ACCESS_TOKEN_WEST}/g -e \
    s/ASK_REFRESH_TOKEN_WEST/${ASK_REFRESH_TOKEN_WEST}/g conf/ask_cli.json > ~/.ask/cli_config

