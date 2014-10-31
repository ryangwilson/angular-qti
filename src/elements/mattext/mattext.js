/* global angular */
angular.module('qti').directive('mattext', function ($sce) {

    return {
        restrict: 'E',
        scope: true,
        link: function (scope, el, attr) {

            if (attr.hasOwnProperty('width')) {
                el.css('width', attr.width + 'px');
                el.css('display', 'inline-block');
            }

            if (attr.hasOwnProperty('height')) {
                el.css('height', attr.height + 'px');
                el.css('display', 'inline-block');
            }

            if (attr.hasOwnProperty('fontface')) {
                el.css('font-family', attr.fontface);
            }

            if (attr.hasOwnProperty('fontsize')) {
                el.css('font-size', attr.fontsize + 'px');
            }

        }
    };
});

angular.module('qti').service('mattext', function ($rootScope, helpers) {

    var _replaceSpaces = function (match, group) {
        return match.split(' ').join('__SPACE__');
    };

    var _replaceTabs = function (match, group) {
        return match.split(' ').join('__TAB__');
    };

    var fixMattext = function (xmlStr) {
        var xml = helpers.strToXML(xmlStr);
        var mattexts = xml.querySelectorAll('mattext');
        var mattext, childNodes, childNode, str;
        for (var i = 0; i < mattexts.length; i++) {
            mattext = mattexts[i];
            var mattextStr = mattext.innerHTML;
            if(mattextStr.indexOf('<') === -1) {
                helpers.addClass(mattext, 'qti-prewrap');
                //childNodes = mattext.childNodes;
                //for (var n = 0; n < childNodes.length; n++) {
                //    childNode = childNodes[n];
                //    if (childNode.nodeType === 3) { // text node
                //        str = childNode.nodeValue.replace(/\s{2,}/gim, _replaceSpaces);
                //        str = str.replace(/\t{2,}/gim, _replaceTabs);
                //        childNode.nodeValue = str;
                //    }
                //}
            }
        }
        var oSerializer = new XMLSerializer();
        xmlStr = oSerializer.serializeToString(xml);
        //xmlStr = xmlStr.split('__SPACE__').join('&nbsp;&#8203;');
        //xmlStr = xmlStr.split('__TAB__').join('&nbsp;&nbsp;&nbsp;&#8203;');
        return xmlStr;
    };

    $rootScope.$on('qti::setup', function (evt) {
        evt.targetScope.template = fixMattext(evt.targetScope.template);
    });

}).run(function (mattext) {

});
