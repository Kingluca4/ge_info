/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ge_info/ge_info/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
