/**
 * Copyright 2018 IT People Corporation. All Rights Reserved.
 *
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * Author: Sandeep Pulluru <sandeep.pulluru@itpeoplecorp.com>
 */
exports.sendResponse = function (res, data, err) {

    if (data) {
        let result = data.toString();
        if (result.includes("Error:")) {
            result = {
                "status": result
            };
        } else {
            result = data;
        }
        res.status(200).send(result);
    } else {
        let error = {}
        if (err.message) {
            try {
                error.message = err.message.replace('chaincode error (', '').slice(0, -1);
                //error.message = JSON.parse("{" + error.message + "}").message;
                error.message = error.message.substring(error.message.indexOf("message: ") + ("message: ").length)
            } catch (e) {
                logger.error("Error while parsing =", e);
            }
        }
        res.status(500).send(error);
    }
}

exports.getArrayFromJson = function (json) {
    return Object.keys(json).map(
        function (k) {
            return json[k]
        });
}