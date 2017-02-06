/**
 * @author SangHoon, Lee(devsh@helloworlds.co.kr)
 *
 * dependency objectUtil.js
 *
 */
var QueryMatcher = (function () {

	/************************************
	 Constructors
	 ************************************/
	function QueryMatcher(source) {
		this.source = source;
		this.objectUtil = new ObjectUtils(this.source);
	}

	/************************************
	 Prototype
	 ************************************/
	QueryMatcher.prototype.VERSION = 1.0;
	QueryMatcher.prototype.contains = contains;
	QueryMatcher.prototype.containsAll = containsAll;

	/************************************
	 Functions
	 ************************************/
	function contains(filterField, value) {
		var compareValue = this.source[filterField];
		if (filterField && filterField.indexOf('.') !== -1) {
			var fields = filterField.split('.');
			var field = fields[fields.length - 1];

			var lastChainObj = this.objectUtil.getObject(filterField);
			if (!lastChainObj)
				return;
			compareValue = lastChainObj[field];
		}

		switch (typeof compareValue) {
			case 'number' :
				if (compareValue == value) {
					return true;
				}
				break;
			case 'string' :
				// start with search (LIKE 'prefix%')
				if (compareValue.indexOf(value) === 0) {
					return true;
				}
				break;
			case 'boolean' :
				if (compareValue == JSON.parse(value)) {
					return true;
				}
				break;
		}
		return false;
	}

	function containsAll(where) {
		if (!where) {
			return false;
		}

		var self = this;
		var contains = true;
		var action;
		var andFields = where['andFields'], andValues = where['andValues'];
		if (andFields && andValues) {
			action = 'and';
			contains = filterBy(action, andFields, andValues);
		}

		var orFields = where['orFields'], orValues = where['orValues'];
		if (orFields && orValues) {
			action = 'or';
			contains = filterBy(action, orFields, orValues);
		}

		function filterBy(action, fields, values) {
			if (!Array.isArray(fields) || !Array.isArray(values)) {
				return false;
			}
			if (fields.length !== values.length) {
				return false;
			}

			var contains = true;
			var trueCnt = 0;

			for (var i = 0; i < fields.length; i++) {
				var filterField = fields[i];
				var value = values[i];
				if (!value || value === 'all') {
					if (action === 'or')
						trueCnt++;
					continue;
				}

				if (action === 'and') {
					if (!self.contains(filterField, value)) {
						contains = false;
						break;
					}
				} else if (action === 'or') {
					if (self.contains(filterField, value)) {
						trueCnt++;
					}
				}
			}

			if (action === 'or') {
				contains = trueCnt !== 0;
			}

			return contains;
		}

		return contains;
	}

	return QueryMatcher;
}());
