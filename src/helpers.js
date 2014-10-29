/* global angular, ActiveXObject */
angular.module('qti').service('helpers', function () {
    this.strToXML = function (str) {
        var parser, xmlDoc;

        if (window.DOMParser) {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(str, "text/xml");
        }
        else // Internet Explorer
        {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(str);
        }

        return xmlDoc;
    };
});