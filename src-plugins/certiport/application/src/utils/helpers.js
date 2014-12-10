/* global angular */
angular.module('certiport').service('helpers', function () {

    var strToXML = function (str) {
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

    var xmlToJson = function (xml) {
        // Create the return object
        var obj = {};

        if (xml.nodeType === 1) { // element
            // do attributes
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.value;
                }
            }
        } else if (xml.nodeType === 3) { // text
            obj = xml.nodeValue.trim();
        }

        // do children
        if (xml.hasChildNodes()) {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                //console.log('nodeName', nodeName);
                if (typeof(obj[nodeName]) === "undefined") {
                    if (nodeName !== '#text') {
                        obj[nodeName] = xmlToJson(item);
                    } else if (item.nodeValue.trim()) {
                        obj = item.nodeValue.trim();
                    }
                } else {
                    if (typeof(obj[nodeName].push) === "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }
        return obj;
    };

    this.strToXML = strToXML;
    this.xmlToJson = xmlToJson;
});