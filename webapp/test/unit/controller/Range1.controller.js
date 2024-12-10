/*global QUnit*/

sap.ui.define([
	"calassap/calendarcustom/controller/Range1.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Range1 Controller");

	QUnit.test("I should test the Range1 controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
