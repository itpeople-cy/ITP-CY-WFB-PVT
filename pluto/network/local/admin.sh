#!/bin/bash -e
#
#  Copyright 2018 IT People Corporation. All Rights Reserved.
#
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an 'AS IS' BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
#
#  Author: Sandeep Pulluru <sandeep.pulluru@itpeoplecorp.com>
#  Author: Ratnakar Asara <ratnakar.asara@itpeoplecorp.com>

echo "    _       _           _                    _   _"
echo "   / \   __| |_ __ ___ (_)_ __     __ _  ___| |_(_) ___  _ __  ___"
echo "  / _ \ / _\` | '_ \` _ \| | '_ \\   / _\` |/ __| __| |/ _ \| '_ \/ __|"
echo " / ___ \ (_| | | | | | | | | | | | (_| | (__| |_| | (_) | | | \__ \\"
echo "/_/   \_\__,_|_| |_| |_|_|_| |_|  \\__,_|\\___|\\__|_|\\___/|_| |_|___/"
CONTAINERS=$(docker ps | grep "hyperledger/fabric" | wc -l | tr -d '[:space:]')
# export HFC_LOGGING='{"debug":"console"}'
if [ $CONTAINERS -eq 16 ]; then
	printf "\n\n##### All containers are up & running, Ready to go ... ######\n\n"
else
	printf "\n\n!!!!!!! Network doesn't seem to be available !!!!!!!\n\n"
	exit
fi

cd ../../fabric-helper-sdk

CHANNEL_NAME=defaultchannel
CC_NAME="pluto"
CC_SRC_DIR="pluto"

CC_ROLE_NAME="role_manager"
CC_ROLE_SRC_DIR="role_manager"


# C R E A T E   C H A N N E L
printf "\n\n============ C R E A T E   C H A N N E L ============\n"
NODE_ENV=local node fabric-cli.js channel create --channel-name $CHANNEL_NAME --org org1
sleep 5

# J O I N  C H A N N E L -  on all peers
printf "\n\n============ J O I N   C H A N N E L ============\n"
#Join peer0 org1
NODE_ENV=local node fabric-cli.js channel join --channel-name $CHANNEL_NAME --org org1
sleep 2
#Join peer0 org2
NODE_ENV=local node fabric-cli.js channel join --channel-name $CHANNEL_NAME --org org2
sleep 2

# U P D A T E  C H A N N E L -  on all Orgs
printf "\n\n============ U P D A T E   C H A N N E L ============\n"
NODE_ENV=local node fabric-cli.js channel update --channel-name $CHANNEL_NAME --org org1 --path Org1.tx
sleep 2
NODE_ENV=local node fabric-cli.js channel update --channel-name $CHANNEL_NAME --org org2 --path Org2.tx
sleep 2

# I N S T A L L   C H A I N C O D E -  on all peers
printf "\n\n============ I N S T A L L    C H A I N C O D E -  on all peers ============\n"
# Install chaincode org1
NODE_ENV=local node fabric-cli.js chaincode install --src-dir ${CC_SRC_DIR} --org org1 --cc-version V1 --channel $CHANNEL_NAME --cc-name $CC_NAME
#Install chaincode org2
NODE_ENV=local node fabric-cli.js chaincode install --src-dir ${CC_SRC_DIR} --org org2 --cc-version V1 --channel $CHANNEL_NAME --cc-name $CC_NAME
# Install chaincode_role org1
NODE_ENV=local node fabric-cli.js chaincode install --src-dir ${CC_ROLE_SRC_DIR} --org org1 --cc-version V1 --channel $CHANNEL_NAME --cc-name $CC_ROLE_NAME
#Install chaincode_role org2
NODE_ENV=local node fabric-cli.js chaincode install --src-dir ${CC_ROLE_SRC_DIR} --org org2 --cc-version V1 --channel $CHANNEL_NAME --cc-name $CC_ROLE_NAME

# I N S T A N T I A T E   C H A I N C O D E
# Instantiating chaincode on peer0 of org1
printf "\n\n============ I N S T A N T I A T E    C H A I N C O D E ============\n"
NODE_ENV=local node fabric-cli.js chaincode instantiate --org org1 --cc-version V1 --channel $CHANNEL_NAME --cc-name $CC_NAME --init-arg ''
sleep 10

# Instantiating chaincode on peer0 of org1
printf "\n\n============ I N S T A N T I A T E    C H A I N C O D E ============\n"
NODE_ENV=local node fabric-cli.js chaincode instantiate --org org1 --cc-version V1 --channel $CHANNEL_NAME --cc-name $CC_ROLE_NAME --init-arg ''
sleep 10