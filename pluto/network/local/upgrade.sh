#!/bin/bash -ex
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

cd ../../fabric-helper-sdk

CHANNEL_NAME=defaultchannel
CC_NAME="pluto"
CC_SRC_DIR="pluto"


CHAINCODE_VERSION=$1

##I N S T A L L   C H A I N C O D E -  on all peers
printf "\n\n============ I N S T A L L    C H A I N C O D E -  on all peers ============\n"
# Install chaincode org1
NODE_ENV=local node fabric-cli.js chaincode install --src-dir ${CC_SRC_DIR} --org org1 --cc-version $CHAINCODE_VERSION --channel $CHANNEL_NAME --cc-name $CC_NAME
#Install chaincode org2
NODE_ENV=local node fabric-cli.js chaincode install --src-dir ${CC_SRC_DIR} --org org2 --cc-version $CHAINCODE_VERSION --channel $CHANNEL_NAME --cc-name $CC_NAME


printf "\n\n============ U P G R A D E    C H A I N C O D E ============\n"
NODE_ENV=local node fabric-cli.js chaincode instantiate --org org1 --cc-version $CHAINCODE_VERSION --channel $CHANNEL_NAME --cc-name $CC_NAME --init-arg '' --upgrade true
sleep 10