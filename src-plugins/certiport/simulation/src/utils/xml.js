/**
 * xmlToJson v1.0
 * Converts XML to a JavaScript object
 *
 * Author: Rob Taylor <roboncode@gmail.com>
 */

(function () {
    var xmlToJson = function (node) {
        if (typeof node === 'string') {
            node = strToXML(node).firstElementChild;
        }

        var data = {};

        function convertValue(value) {
            if (isNaN(value)) {
                if (value === 'true') {
                    return true;
                }

                if (value === 'false') {
                    return false;
                }

                return value;
            }
            return Number(value);
        }

        // append a value
        function setValue(key, value) {
            if (data[key]) { // if the key is already defined
                if (data[key].constructor !== Array) { // and the key is not already an array
                    data[key] = [data[key]]; // convert to an array
                }
                data[key][data[key].length] = convertValue(value); // assign value to next slot in array
            } else {
                data[key] = convertValue(value); // assign value to key
            }
        }

        function setText(key, value) {
            data[key].text = value;
        }

        // element attributes
        var c, cn;
        for (c = 0; node.attributes[c]; c++) {
            cn = node.attributes[c];
            setValue(cn.name, cn.value);
        }

        // child elements
        for (c = 0; node.childNodes[c]; c++) {
            cn = node.childNodes[c];
            if (cn.nodeType === 1) {
                if (cn.childNodes.length === 1 && cn.firstChild.nodeType === 3) {
                    // text value
                    if (cn.attributes.length) { // if node has attributes
                        setValue(cn.nodeName, xmlToJson(cn));
                        setText(cn.nodeName, cn.firstChild.nodeValue);
                    } else {
                        setValue(cn.nodeName, cn.firstChild.nodeValue);
                    }
                } else {
                    // sub-object
                    setValue(cn.nodeName, xmlToJson(cn));
                }
            }
        }

        return data;

    };

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

    var xmlToStr = function (xmlObject) {
        var str
        if (window.ActiveXObject) {
            str = xmlObject.xml;
        } else {
            str = (new XMLSerializer()).serializeToString(xmlObject);
        }
        str = str.replace(/\sxmlns=".*?"/gim, '');
        return str;
    };

    angular.module('simulation').service('XMLService', function () {
        this.toJson = xmlToJson;
        this.toString = xmlToStr;
        this.parse = strToXML;
    });

})();
