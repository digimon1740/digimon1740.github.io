/**
 * @author SangHoon, Lee(devsh@helloworlds.co.kr)
 */

var ObjectUtils = (function () {

	/************************************
	 Constructors
	 ************************************/
	function ObjectUtils(sourceObj) {
		this.sourceObj = sourceObj;
	}

	/************************************
	 Prototype
	 ************************************/
	ObjectUtils.prototype.getLastChainObjectValueByCommaSeparator = getLastChainObjectValueByCommaSeparator;

	/************************************
	 Functions
	 ************************************/
	/**
	 * var person = {
	 * 			gender: 'male',
	 * 			man: {
	 * 				sanghoon: {
	 * 					name: 'sanghoon',
	 * 					age: 29
	 * 				}
	 * 			}
	 * 		};
	 *
	 * var field = 'man.sanghoon';
	 *
	 * var objectUtil = new ObjectUtils(person);
	 * var sanghoon = objectUtil.getLastChainObjectValueByCommaSeparator(field);
	 * console.log(sanghoon);
	 */
	function getLastChainObjectValueByCommaSeparator(sourceField) {
		if (!sourceField) {
			return void 0;
		}

		if (sourceField.indexOf(".") == -1) {
			return void 0;
		}

		var lastChainObj;
		var fields = sourceField.split('.');
		var sourceObj = this.sourceObj;
		for (var i = 0; i < fields.length; i++) {
			var field = fields[i];
			if (i === fields.length - 1) {
				lastChainObj = sourceObj;
			} else {
				sourceObj = sourceObj[field];
			}
		}
		return lastChainObj;
	}

	return ObjectUtils;
}());


