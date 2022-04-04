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

##TODO: add debug flag to enable/disable for peer ad orderer
## usage message
function usage() {
	echo "Usage: "
	echo "  bootstrap.sh [-m start|stop|restart] [-t <release-tag>] [-c enable-CouchDB] [-l capture-logs]"
	echo "  bootstrap.sh -h|--help (print this message)"
	echo "      -m <mode> - one of 'start', 'stop', 'restart' " #or 'generate'"
	echo "      - 'start' - bring up the network with docker-compose up & start the app on port 3000"
	echo "      - 'up'    - same as start"
	echo "      - 'stop'  - stop the network with docker-compose down & clear containers , crypto keys etc.,"
	echo "      - 'down'  - same as stop"
	echo "      - 'restart' -  restarts the network and start the app on port 3000 (Typically stop + start)"
	echo "     -c enable CouchDB"
	echo "     -r re-Generate the certs and channel artifacts"
	echo "     -l capture docker logs before network teardown"
	echo "     -t <release-tag> - ex: alpha | beta | rc , missing this option will result in using the latest docker images"
	echo
	echo "Some possible options:"
	echo
	echo "	bootstrap.sh"
	echo "	bootstrap.sh -l"
	echo "	bootstrap.sh -r"
	echo "	bootstrap.sh -m restart -t 1.2.0"
	echo "	bootstrap.sh -m start -c"
	echo "	bootstrap.sh -m stop"
	echo "	bootstrap.sh -m stop -l"
	echo
	echo "All defaults:"
	echo "	bootstrap.sh"
	echo "	RESTART the network/app, use latest docker images but TAG, Disable couchdb "
	exit 1
}
#### Banner
function displayTitle() {
	echo " _                           _        _   _      _                      _"
	echo "| |    __ _ _   _ _ __   ___| |__    | \ | | ___| |___      _____  _ __| | __"
	echo "| |   / _\` | | | | '_ \ / __| '_ \   |  \| |/ _ \ __\ \ /\ / / _ \| '__| |/ /"
	echo "| |__| (_| | |_| | | | | (__| | | |  | |\  |  __/ |_ \ V  V / (_) | |  |   <"
	echo "|_____\__,_|\__,_|_| |_|\___|_| |_|  |_| \_|\___|\__| \_/\_/ \___/|_|  |_|\_\\"
	echo ""
}

displayTitle

: ${MODE:="restart"}
: ${IMAGE_TAG:="1.2.0"}
: ${COUCHDB:="y"}
: ${ENABLE_LOGS:="n"}
: ${TIMEOUT:="45"}

export THIRDPARTY_IMAGE_TAG="0.4.10" ## this has to match with the  version
export ARCH=$(echo "$(uname -s | tr '[:upper:]' '[:lower:]' | sed 's/mingw64_nt.*/windows/')-$(uname -m | sed 's/x86_64/amd64/g')" | awk '{print tolower($0)}')

COMPOSE_FILE=./docker-compose.yaml
COMPOSE_TEMPL_FILE=./docker-compose-template.yaml
COMPOSE_FILE_WITH_COUCH=./docker-compose-couch.yaml
COMPOSE_FILE_MONGO=./docker-compose-mongo.yaml

# Parse commandline args
while getopts "h?m:t:clr" opt; do
	case "$opt" in
	h | \?)
		usage
		exit 1
		;;
	m) MODE=$OPTARG
		;;
	c) COUCHDB='y'
		;;
	l) ENABLE_LOGS='y'
		;;
	r) REGENERATE='y'
		;;
	t) IMAGE_TAG="$OPTARG"
	##TODO: ensure package.json contains right node packages
		;;
	esac
done
export IMAGE_TAG

function dkcl() {
	CONTAINERS=$(docker ps -a | wc -l)
	if [ "$CONTAINERS" -gt "1" ]; then
		docker rm -f $(docker ps -aq)
	else
		printf "\n========== No containers available for deletion ==========\n"
	fi
}

function dkrm() {
	DOCKER_IMAGE_IDS=$(docker images | grep "dev\|none\|peer[0-9]-" | awk '{print $3}')
	echo
	if [ -z "$DOCKER_IMAGE_IDS" -o "$DOCKER_IMAGE_IDS" = " " ]; then
		echo "========== No images available for deletion ==========="
	else
		docker rmi -f $DOCKER_IMAGE_IDS
	fi
	echo
}

# delete all node modules and re-install
function cleanAndInstall() {
	## Make sure cleanup the node_moudles and re-install them again
	rm -rf ./node_modules

	printf "\n============== Installing node modules =============\n"
	npm install
}

# Install required node modules if not installed already
function checkNodeModules() {
	echo
	if [ -d node_modules ]; then
		npm ls fabric-client fabric-ca-client
		echo "---- Make sure to check for version ~1.2.x ---- "
	else
		cleanAndInstall && npm ls fabric-client fabric-ca-client
	fi
	echo
}

function checkForDockerImages() {
	DOCKER_IMAGES=$(docker images | grep "$IMAGE_TAG\|$THIRDPARTY_IMAGE_TAG" | grep -v "amd" | wc -l)
	if [ $DOCKER_IMAGES -ne 8 ]; then
		printf "\n############# You don't have all fabric images, Let me pull them for you ###########\n"
		printf "######## Pulling Fabric Images ... ########\n"
		for IMAGE in peer orderer ca ccenv tools; do
			docker pull hyperledger/fabric-$IMAGE:$IMAGE_TAG
		done
		printf "######## Pulling 3rdParty Images ... ########\n"
		for IMAGE in couchdb kafka zookeeper; do
			docker pull hyperledger/fabric-$IMAGE:$THIRDPARTY_IMAGE_TAG
		done
	fi
}
function checkOrdereingService() {
	local rc=1
	docker logs orderer0.example.com 2>&1 | grep -q "Start phase completed successfully"
	rc=$?
	local starttime=$(date +%s)
	while test "$(($(date +%s) - starttime))" -lt "$TIMEOUT" -a $rc -ne 0; do
		docker logs orderer0.example.com 2>&1 | grep -q "Start phase completed successfully"
		rc=$?
	done
}

function startNetwork() {
	LOCAL_DIR=$PWD
	# node generate.js

	printf "\n ========= FABRIC IMAGE TAG : $IMAGE_TAG ===========\n"
	checkForDockerImages

	### Let's not worry about dynamic generation of Org certs and channel artifacts
	if [ "$REGENERATE" = "y" ]; then
		echo "===> Downloading platform binaries"
		cd ./
		rm -rf bin
		curl https://nexus.hyperledger.org/content/repositories/releases/org/hyperledger/fabric/hyperledger-fabric/${ARCH}-${IMAGE_TAG}/hyperledger-fabric-${ARCH}-${IMAGE_TAG}.tar.gz | tar xz

		cd $LOCAL_DIR
		rm -rf .//channel/*.block .//channel/*.tx .//crypto-config
		cd ./

		source generateArtifacts.sh
		cd $LOCAL_DIR
	fi

	#Launch the network
	if [ "$COUCHDB" = "y" ]; then
		docker-compose -f $COMPOSE_FILE -f $COMPOSE_FILE_WITH_COUCH -f $COMPOSE_FILE_MONGO up -d
	else
		docker-compose -f $COMPOSE_FILE up -d
	fi
	if [ $? -ne 0 ]; then
		printf "\n\n!!!!!!!! FAILED to start the network, Check your docker-compose !!!!!\n\n"
		exit
	fi

	##Install node modules
	cleanAndInstall
	### Make sure Orderering service is available before creating channel etc.,
	checkOrdereingService
	sleep 5
	adminActivities

}

function adminActivities() {
	./admin.sh
}

function shutdownNetwork() {
	printf "\n======================= TEARDOWN NETWORK ====================\n"
	if [ "$ENABLE_LOGS" = "y" -o "$ENABLE_LOGS" = "Y" ]; then
		source .//getContainerLogs.sh
	fi
	# teardown the network and clean the containers and intermediate images
	docker-compose -f $COMPOSE_TEMPL_FILE -f $COMPOSE_FILE_WITH_COUCH -f $COMPOSE_FILE_MONGO down
	dkcl
	dkrm
	if [ $(ps -ef | grep "node file-watcher.js" | wc -l) -eq 2 ]; then
		kill -9 $(ps -ef | grep "node file-watcher.js" | grep -v grep | awk '{print $2}')
	fi

	# cleanup the material
	printf "\n======================= CLEANINGUP ARTIFACTS ====================\n\n"
	rm -rf /tmp/hfc-test-kvs_peerOrg* $HOME/.hfc-key-store/ /tmp/fabric-client-kvs_peerOrg*

}

#Launch the network using docker compose
case $MODE in
'start' | 'up')
	startNetwork
	;;
'stop' | 'down')
	shutdownNetwork
	;;
'restart')
	shutdownNetwork
	startNetwork
	;;
*)
	usage
	;;
esac
