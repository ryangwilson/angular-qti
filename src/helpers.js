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

    this.xmlToStr = function (xmlObject) {
        var str
        if (window.ActiveXObject) {
            str = xmlObject.xml;
        } else {
            str = (new XMLSerializer()).serializeToString(xmlObject);
        }
        str = str.replace(/\sxmlns=".*?"/gim, '');
        return str;
    };
});