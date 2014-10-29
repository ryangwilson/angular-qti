angular.module('qti').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/item.html',
    "<div class=shadow style=\"border: 1px solid #AA4155;margin-bottom: 15px\"><question-header></question-header><question-stem></question-stem><div ng-transclude=\"\"></div><div class=qti-title>Blueprint ID: {{item.blueprintId}}</div></div>"
  );


  $templateCache.put('templates/question-header.html',
    "<div class=qti-question-header>Question Id: {{item.questionId}}</div>"
  );


  $templateCache.put('templates/question-options.html',
    "<div><div class=qti-title>Options:</div><div ng-transclude=\"\"></div></div>"
  );


  $templateCache.put('templates/question-stem.html',
    "<div style=\"border: 1px solid #ecf0f1\"><div class=qti-title>Question Stem:</div><div class=qti-content ng-bind-html=trustHtml(item.question)></div></div>"
  );


  $templateCache.put('templates/question-type.html',
    "<div><div class=qti-title>Type: {{item.type | type}}</div><div ng-transclude=\"\"></div></div>"
  );


  $templateCache.put('templates/radio.html',
    "<input type=radio>"
  );

}]);
