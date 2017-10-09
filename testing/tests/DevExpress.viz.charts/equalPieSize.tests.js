
"use strict";

var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    commons = require("./chartParts/commons.js"),
    dataValidatorModule = require("viz/components/data_validator"),
    layoutManagerModule = require("viz/chart_components/layout_manager"),
    dxPieChart = require("viz/pie_chart");

/* global MockSeries, MockPoint, seriesMockData, insertMockFactory, resetMockFactory  */
require("../../helpers/chartMocks.js");

function getContainer() {
    return $('<div>').appendTo("#qunit-fixture");
}

function setupMocks() {
    insertMockFactory();

    this.stubPoints = [
        new MockPoint({ argument: "First", value: 10, visible: true }),
        new MockPoint({ argument: "Second", value: 11, visible: true }),
        new MockPoint({ argument: "Third", value: 12, visible: true })
    ];
}

function checkCorrectPosition(assert, correctPos, x, y, outer, inner, canvas) {
    assert.equal(correctPos[0].centerX, x, "centerX");
    assert.equal(correctPos[0].centerY, y, "centerY");
    assert.equal(correctPos[0].radiusOuter, outer, "radiusOuter");
    assert.equal(correctPos[0].radiusInner, inner, "radiusInner");
    assert.deepEqual(correctPos[1], canvas, "canvas");
}

var dataSourceTemplate = [
    { cat: "First", val: 100 },
    { cat: "Second", val: 200 },
    { cat: "Third", val: 300 }
];

commons.rendererModule.Renderer = sinon.spy(function(parameters) {
    return new vizMocks.Renderer(parameters);
});

var environment = {
    beforeEach: function() {
        setupMocks.call(this);

        this.originalLayoutManagerCtor = layoutManagerModule.LayoutManager;
        this.LayoutManager = sinon.stub(layoutManagerModule, "LayoutManager");

        this.validateData = sinon.stub(dataValidatorModule, "validateData", function(data) {
            return { arg: data || [] };
        });
    },
    afterEach: function() {
        this.LayoutManager.restore();
        this.validateData.restore();

        commons.resetModules();
        resetMockFactory();
    },
    createPieChart: function(options, layout, minLayout) {
        this._pieCounter = this._pieCounter || 0;

        var layoutManager = sinon.createStubInstance(this.originalLayoutManagerCtor);
        layoutManager.needMoreSpaceForPanesCanvas.returns(true);
        layoutManager.applyPieChartSeriesLayout.returns(layout);
        layoutManager.applyEqualPieChartLayout.returns(minLayout);

        this.LayoutManager.onCall(this._pieCounter++).returns(layoutManager);

        return new dxPieChart(getContainer(), options);
    }
};

QUnit.module("Get layout from LayoutManagers", environment);

QUnit.test("Create pies without groups. Get individual layout", function(assert) {
    var done = assert.async(2);

    seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));
    seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));

    this.createPieChart({
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: checkPie(done, 100, 200, 300, 0)
    },
    { radiusInner: 0, radiusOuter: 300, centerX: 100, centerY: 200, canvas: {} });
    this.createPieChart({
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: checkPie(done, 150, 250, 200, 0)
    },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });

    function checkPie(done, x, y, rOuter, rInner) {
        return function(e) {
            var series = e.component.series[0];

            assert.equal(series.drawLabelsWOPoints.callCount, 1);
            checkCorrectPosition(assert, series.correctPosition.lastCall.args, x, y, rOuter, rInner, e.component.DEBUG_canvas);
            assert.equal(series.correctRadius.lastCall.args[0].radiusOuter, rOuter, "correction radiusOuter");
            assert.equal(series.correctRadius.lastCall.args[0].radiusInner, rInner, "correction radiusInner");
            assert.equal(series.draw.callCount, 1);
            done();
        };
    }
});

QUnit.test("Create pies with group. Get common layout", function(assert) {
    var done = assert.async(2);

    seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));
    seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));

    this.createPieChart({
        sizeGroup: "group1",
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: checkPie(done, 150, 250, 200, 0)
    },
    { radiusInner: 0, radiusOuter: 300, centerX: 100, centerY: 200, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });
    this.createPieChart({
        sizeGroup: "group1",
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: checkPie(done, 150, 250, 200, 0)
    },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });

    function checkPie(done, x, y, rOuter, rInner) {
        return function(e) {
            var series = e.component.series[0];

            assert.equal(series.drawLabelsWOPoints.callCount, 1);
            checkCorrectPosition(assert, series.correctPosition.lastCall.args, x, y, rOuter, rInner, e.component.DEBUG_canvas);
            assert.equal(series.correctRadius.lastCall.args[0].radiusOuter, rOuter, "correction radiusOuter");
            assert.equal(series.correctRadius.lastCall.args[0].radiusInner, rInner, "correction radiusInner");
            assert.equal(series.draw.callCount, 1);
            done();
        };
    }
});

QUnit.module("Pass common layout to LayoutManagers", environment);

QUnit.test("Create pies without groups. Do not ask for common layout", function(assert) {
    var done = assert.async(2);

    seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));
    seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));

    this.createPieChart({
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: checkPie
    },
    { radiusInner: 0, radiusOuter: 300, centerX: 100, centerY: 200, canvas: {} });
    this.createPieChart({
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: checkPie
    },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });

    function checkPie(e) {
        assert.equal(e.component.layoutManager.applyEqualPieChartLayout.callCount, 0);
        done();
    }
});

QUnit.test("Create pies with same group. Ask for common layout", function(assert) {
    var done = assert.async(2);

    seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));
    seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));

    this.createPieChart({
        sizeGroup: "group1",
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: checkPie
    },
    { radiusInner: 0, radiusOuter: 300, centerX: 100, centerY: 200, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });
    this.createPieChart({
        sizeGroup: "group1",
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: checkPie
    },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });

    function checkPie(e) {
        assert.equal(e.component.layoutManager.applyEqualPieChartLayout.callCount, 1);
        assert.deepEqual(e.component.layoutManager.applyEqualPieChartLayout.lastCall.args, [
            e.component.series,
            { radius: 200, x: 150, y: 250 }
        ]);
        done();
    }
});

QUnit.test("Create two sets of pies with different groups. Ask corresponding common layout", function(assert) {
    var done = assert.async(4);

    seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));
    seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));
    seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));
    seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));

    this.createPieChart({
        sizeGroup: "group1",
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: checkPie(150, 250, 200)
    },
    { radiusInner: 0, radiusOuter: 300, centerX: 100, centerY: 200, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });
    this.createPieChart({
        sizeGroup: "group1",
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: checkPie(150, 250, 200)
    },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });

    this.createPieChart({
        sizeGroup: "group2",
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: checkPie(200, 300, 100)
    },
    { radiusInner: 0, radiusOuter: 100, centerX: 200, centerY: 300, canvas: {} },
    { radiusInner: 0, radiusOuter: 100, centerX: 200, centerY: 300, canvas: {} });
    this.createPieChart({
        sizeGroup: "group2",
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: checkPie(200, 300, 100)
    },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });

    function checkPie(x, y, radius) {
        return function(e) {
            assert.equal(e.component.layoutManager.applyEqualPieChartLayout.callCount, 1);
            assert.deepEqual(e.component.layoutManager.applyEqualPieChartLayout.lastCall.args, [
                e.component.series,
                { radius: radius, x: x, y: y }
            ]);
            done();
        };
    }
});

QUnit.test("Have pies with group. Add new pie to the same group. Ask common layout for all pies", function(assert) {
    var done = assert.async(3);

    seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));
    seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));
    seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));

    var skipFirstCallAndCreateNewPie = function(that) {
        var firstCall = true;
        return function(e) {
            if(firstCall) {
                that.createPieChart({
                    sizeGroup: "group1",
                    dataSource: dataSourceTemplate,
                    series: [{}],
                    onDrawn: checkPie
                },
                { radiusInner: 0, radiusOuter: 100, centerX: 200, centerY: 300, canvas: {} },
                { radiusInner: 0, radiusOuter: 100, centerX: 200, centerY: 300, canvas: {} });
            } else {
                checkPie(e);
            }
            firstCall = false;
        };
    };

    var skipFirstCall = (function() {
        var skipped = false;
        return function(e) {
            skipped && checkPie(e);
            skipped = true;
        };
    })();

    this.createPieChart({
        sizeGroup: "group1",
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: skipFirstCallAndCreateNewPie(this)
    },
    { radiusInner: 0, radiusOuter: 300, centerX: 100, centerY: 200, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });
    this.createPieChart({
        sizeGroup: "group1",
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: skipFirstCall
    },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });

    function checkPie(e) {
        assert.deepEqual(e.component.layoutManager.applyEqualPieChartLayout.lastCall.args, [
            e.component.series,
            { x: 200, y: 300, radius: 100 }
        ]);
        done();
    }
});

QUnit.module("Misc", environment);

QUnit.test("Have pies with group. Change group of one pie. Redraw only changed pie", function(assert) {
    var done = assert.async(2);
    assert.expect(0);

    seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));

    var changeGroupOnFirstCall = (function() {
        var firstCall = true;
        return function(e) {
            if(firstCall) {
                e.component.option("sizeGroup", "group2");
            }
            done();
            firstCall = false;
        };
    })();

    this.createPieChart({
        sizeGroup: "group1",
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: changeGroupOnFirstCall
    },
    { radiusInner: 0, radiusOuter: 300, centerX: 100, centerY: 200, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });
});

QUnit.test("Do not touch disposed pies", function(assert) {
    var done = assert.async(3);
    assert.expect(0);

    seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));
    seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));

    var killPieAndChangeGroupOnFirstCall = function(pieToKill) {
        var firstCall = true;
        return function(e) {
            if(firstCall) {
                pieToKill.$element().remove();
                e.component.option("sizeGroup", "group2");
            }
            done();
            firstCall = false;
        };
    };

    var pie1 = this.createPieChart({
        sizeGroup: "group1",
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: done
    },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });

    this.createPieChart({
        sizeGroup: "group1",
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: killPieAndChangeGroupOnFirstCall(pie1)
    },
    { radiusInner: 0, radiusOuter: 300, centerX: 100, centerY: 200, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });
});

QUnit.test("Create pies with group. Series should be animated", function(assert) {
    var done = assert.async(1);

    seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));

    this.createPieChart({
        sizeGroup: "group1",
        dataSource: dataSourceTemplate,
        series: [{}],
        onDrawn: check
    },
    { radiusInner: 0, radiusOuter: 300, centerX: 100, centerY: 200, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });

    function check(e) {
        assert.ok(e.component.series[0].wasAnimated);
        done();
    }
});

QUnit.test("Hide labes after first measuring render", function(assert) {
    var series1 = new MockSeries({ points: this.stubPoints });
    seriesMockData.series.push(series1);

    series1.drawLabelsWOPoints = sinon.spy(function() { return true; });

    seriesMockData.series.push(new MockSeries({ points: this.stubPoints }));

    var pie = this.createPieChart({
        dataSource: dataSourceTemplate,
        series: [{}]
    },
    { radiusInner: 0, radiusOuter: 300, centerX: 100, centerY: 200, canvas: {} },
    { radiusInner: 0, radiusOuter: 200, centerX: 150, centerY: 250, canvas: {} });

    var series = pie.series[0];

    assert.equal(pie.layoutManager.applyPieChartSeriesLayout.callCount, 2);
    assert.equal(series.drawLabelsWOPoints.callCount, 1);
    assert.equal(series.hideLabels.callCount, 1);
    assert.ok(series.hideLabels.lastCall.calledAfter(pie.layoutManager.applyPieChartSeriesLayout.lastCall));

});





