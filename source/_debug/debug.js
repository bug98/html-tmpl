document.write('<link href="_debug/jquery-ui.css" rel="stylesheet">');
document.write('<script src="_debug/jquery.cookie.js"></script>');
document.write('<script src="_debug/jquery-ui.js"></script>');
document.write('<link rel="stylesheet" href="_debug/debug.css">');

$(function(){
  //設定値がクッキーに入っているか
    var _swatchVal = $.cookie("swatchVal") ? $.cookie("swatchVal") : 100;
    var _positionVal = $.cookie("positionVal") ? $.cookie("positionVal") : 150;
    var _spacingVal = $.cookie("spacingVal") ? $.cookie("spacingVal") : 500;


  //bodyの内側をwrapする
  $('body').wrapInner('<div class="sukesuke">');

  var dialog = '';
  dialog += '<div id="debug_dialog"><div class="handle"></div><div class="inner">';
  dialog += '<label><input type="checkbox" name="debug_check" id="debug_check" /> 非表示</label>';
  dialog += '<div><div id="opacity"></div></div>';
  dialog += '<div><div id="position"></div></div>';
  dialog += '<div><div id="spacing"></div></div>';
  dialog += '</div></div>';
  $(dialog).draggable({ handle: ".handle" }).appendTo('body');
  var opacity = 1;
  var refreshSwatch = function(){
    opacity = $( "#opacity" ).slider('value') / 100;
    $('body .sukesuke').css({'opacity' : opacity});
      $.cookie("swatchVal", $( "#opacity" ).slider('value'));
  }

  var refreshPosition = function(){
    position = $( "#position" ).slider('value') - 150;
    $('body').css('background-position', 'center ' + position + 'px');
      $.cookie("positionVal", $( "#position" ).slider('value'));
  }
  var refreshSpacing = function(){
    spacing = ($( "#spacing" ).slider('value') - 500) / 1000;
    $('body').css('letter-spacing', spacing + 'em');
      $.cookie("spacingVal", $( "#spacing" ).slider('value'));
  }

  $( "#opacity" ).slider({
    orientation: "horizontal",
    range: "min",
    max: 100,
    value: _swatchVal,
    slide: refreshSwatch,
    change: refreshSwatch
  });
  $( "#position" ).slider({
    orientation: "horizontal",
    range: "min",
    max: 300,
    value: _positionVal,
    slide: refreshPosition,
    change: refreshPosition
  });
  $( "#spacing" ).slider({
    orientation: "horizontal",
    range: "min",
    max: 500,
    value: _spacingVal,
    slide: refreshSpacing,
    change: refreshSpacing
  });

    refreshPosition();
    refreshPosition();
    refreshSpacing();

  var bg = $('body').css('background-image');


  $("#debug_check").click(function(){
    var op = $('body .sukesuke').css('opacity');
    if($(this).prop('checked')){
      $('body').css('background-image', 'none');
      $('body .sukesuke').css({
        'opacity' : 1
      });
    }else{
      $('body').css('background-image', bg);
      $('body .sukesuke').css({
        'opacity' : opacity
      });
    }
  });
});
