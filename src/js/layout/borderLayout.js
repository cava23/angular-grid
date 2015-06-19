var utils = require('../utils');

function BorderLayout(params) {

    this.isLayoutPanel = true;

    var template;
    if (!params.dontFill) {
        template =
            '<div style="height: 100%;">' +
                '<div id="north"></div>' +
                    '<div id="centerRow" style="height: 100%; overflow: auto;">' +
                    '<div id="west" style="height: 100%; float: left;"></div>' +
                    '<div id="east" style="height: 100%; float: right;"></div>' +
                '<div id="center" style="height: 100%;"></div>' +
                '</div>' +
                '<div id="south"></div>' +
            '</div>';
    } else {
        template =
            '<div>' +
                '<div id="north"></div>' +
                '<div id="centerRow">' +
                    '<div id="west"></div>' +
                    '<div id="east"></div>' +
                    '<div id="center"></div>' +
                '</div>' +
                '<div id="south"></div>' +
            '</div>';
    }

    this.eGui = utils.loadTemplate(template);

    this.id = 'borderLayout';
    if (params.name) {
        this.id += '_' + params.name;
    }
    this.eGui.setAttribute('id', this.id);
    this.childPanels = [];

    if (params) {
        this.setupPanels(params);
    }

    this.layoutActive = !params.dontFill;
}

BorderLayout.prototype.setupPanels = function(params) {

    this.eNorthWrapper = this.setupPanel(params.north, '#north');
    this.eSouthWrapper = this.setupPanel(params.south, '#south');
    this.eEastWrapper = this.setupPanel(params.east, '#east');
    this.eWestWrapper = this.setupPanel(params.west, '#west');
    this.eCenterWrapper = this.setupPanel(params.center, '#center');

    // center row is not provided by user, so we always grab this
    this.eCenterRow = this.eGui.querySelector('#centerRow');
};

BorderLayout.prototype.setupPanel = function(content, cssSelector) {
    var ePanel = this.eGui.querySelector(cssSelector);
    if (content) {
        var component;
        if (content.isLayoutPanel) {
            this.childPanels.push(content);
            component = content.getGui();
        } else {
            component = content;
        }
        ePanel.appendChild(component);
        return ePanel;
    } else {
        ePanel.parentNode.removeChild(ePanel);
        return  null;
    }
};

BorderLayout.prototype.getGui = function() {
    return this.eGui;
};

BorderLayout.prototype.doLayout = function() {
    if (this.layoutActive) {
        this.layoutHeight();
        this.layoutWidth();
    }
    for (var i = 0; i<this.childPanels.length; i++) {
        this.childPanels[i].doLayout();
    }
};

BorderLayout.prototype.layoutHeight = function() {
    var totalHeight = utils.offsetHeight(this.eGui);
    var northHeight = utils.offsetHeight(this.eNorthWrapper);
    var southHeight = utils.offsetHeight(this.eSouthWrapper);

    var centerHeight = totalHeight - northHeight - southHeight;
    if (centerHeight < 0) {
        centerHeight = 0;
    }

    this.eCenterRow.style.height = centerHeight + 'px';
};

BorderLayout.prototype.layoutWidth = function() {
    var totalWidth = utils.offsetWidth(this.eGui);
    var eastWidth = utils.offsetWidth(this.eEastWrapper);
    var westWidth = utils.offsetWidth(this.eWestWrapper);

    var centerWidth = totalWidth - eastWidth - westWidth;
    if (centerWidth < 0) {
        centerWidth = 0;
    }

    this.eCenterWrapper.style.width = centerWidth + 'px';
};

BorderLayout.prototype.setEastVisible = function(visible) {
    if (this.eEastWrapper) {
        this.eEastWrapper.style.display = visible ? '' : 'none';
    }
    this.doLayout();
};

BorderLayout.prototype.setSouthVisible = function(visible) {
    if (this.eSouthWrapper) {
        this.eSouthWrapper.style.display = visible ? '' : 'none';
        this.doLayout();
    }
    this.doLayout();
};

module.exports = BorderLayout;