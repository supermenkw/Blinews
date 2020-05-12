function $(id) {
  return document.getElementById(id);
}

var blinNews = {};


blinNews.COMMON_SCRIPT = 'Zyyy';


blinNews.scripts = [{
  scriptCode: blinNews.COMMON_SCRIPT,
  scriptName: 'Default'
}];


blinNews.SAMPLE_TEXTS = {
  Zyyy: 'Lorem Ipsum.'
};


blinNews.pendingChanges = new PendingChanges();


blinNews.fontSettings = null;


blinNews.fontSizeSettings = null;


blinNews.getEffectiveFontSize = function (fontSizeKey, callback) {
  blinNews.fontSizeSettings[fontSizeKey].getter({}, function (details) {
    var controllable = blinNews.isControllableLevel(
      details.levelOfControl);
    var size = details.pixelSize;
    var pendingFontSize = blinNews.pendingChanges.getFontSize(fontSizeKey);

    if (!controllable) {
      if (pendingFontSize != null) {
        blinNews.pendingChanges.setFontSize(fontSizeKey, null);
        $('apply-settings').disabled = blinNews.pendingChanges.isEmpty();
        pendingFontSize = null;
      }
    }


    if (pendingFontSize != null)
      size = pendingFontSize;
    callback(size, controllable);
  });
};




blinNews.refreshFontSize = function (fontSizeSetting, size, controllable) {
  fontSizeSetting.label.textContent = 'Size: ' + size + 'px';
  blinNews.setFontSizeSlider(fontSizeSetting.slider, size, controllable);
  for (var i = 0; i < fontSizeSetting.samples.length; ++i)
    fontSizeSetting.samples[i].style.fontSize = size + 'px';
};

blinNews.refresh = function () {
  var script = blinNews.getSelectedScript();
  var sample;
  if (blinNews.SAMPLE_TEXTS[script])
    sample = blinNews.SAMPLE_TEXTS[script];
  else
    sample = blinNews.SAMPLE_TEXTS[blinNews.COMMON_SCRIPT];
  var sampleTexts = document.querySelectorAll('.sample-text-span');
  for (var i = 0; i < sampleTexts.length; i++)
    sampleTexts[i].textContent = sample;

  var setting;
  var callback;

  for (var fontSizeKey in blinNews.fontSizeSettings) {
    setting = blinNews.fontSizeSettings[fontSizeKey];
    callback = blinNews.refreshFontSize.bind(null, setting);
    blinNews.getEffectiveFontSize(fontSizeKey, callback);
  }

  $('apply-settings').disabled = blinNews.pendingChanges.isEmpty();
};


blinNews.getSelectedScript = function () {
  var scriptList = $('scriptList');
  return scriptList.options[scriptList.selectedIndex].value;
};



blinNews.handleFontSizeSliderChange = function (fontSizeKey, value) {
  var pixelSize = parseInt(value);
  if (!isNaN(pixelSize)) {
    blinNews.pendingChanges.setFontSize(fontSizeKey, pixelSize);
    blinNews.refresh();
  }
};


blinNews.isControllableLevel = function (levelOfControl) {
  return levelOfControl == 'controllable_by_this_extension' ||
    levelOfControl == 'controlled_by_this_extension';
};


blinNews.setFontSizeSlider = function (slider, size, enabled) {
  if (slider.getValue() != size)
    slider.setValue(size);
  var inputElement = slider.getInput();
  if (enabled) {
    inputElement.parentNode.classList.remove('disabled');
    inputElement.disabled = false;
  } else {
    inputElement.parentNode.classList.add('disabled');
    inputElement.disabled = true;
  }
};


blinNews.initFontSizeSetting = function (fontSizeKey) {
  var fontSizeSettings = blinNews.fontSizeSettings;
  var setting = fontSizeSettings[fontSizeKey];
  var label = setting.label;
  var samples = setting.samples;

  setting.slider = new Slider(
    setting.sliderContainer,
    0,
    setting.minValue,
    setting.maxValue,
    blinNews.handleFontSizeSliderChange.bind(null, fontSizeKey)
  );

  var slider = setting.slider;
  setting.getter({}, function (details) {
    var size = details.pixelSize.toString();
    var controllable = blinNews.isControllableLevel(
      details.levelOfControl);
    blinNews.setFontSizeSlider(slider, size, controllable);
    for (var i = 0; i < samples.length; i++)
      samples[i].style.fontSize = size + 'px';
  });
  fontSizeSettings[fontSizeKey].onChanged.addListener(blinNews.refresh);
};


blinNews.clearAllSettings = function () {
  blinNews.pendingChanges.clear();
  chrome.fontSettings.clearMinimumFontSize();
};


blinNews.initApplyAndResetButtons = function () {
  var applyButton = $('apply-settings');
  applyButton.addEventListener('click', function () {
    blinNews.pendingChanges.apply();
    blinNews.refresh();
  });

  $('reset-all-button').onclick = function (event) {
    blinNews.clearAllSettings();
    blinNews.refresh();
  };
};


blinNews.systemFonts = {
  cros: 'Noto Sans UI, sans-serif',
  linux: 'Ubuntu, sans-serif',
  mac: 'Lucida Grande, sans-serif',
  win: 'Segoe UI, Tahoma, sans-serif',
  unknown: 'sans-serif'
};


blinNews.getPlatform = function () {
  var ua = window.navigator.appVersion;
  if (ua.indexOf('Win') != -1) return 'win';
  if (ua.indexOf('Mac') != -1) return 'mac';
  if (ua.indexOf('Linux') != -1) return 'linux';
  if (ua.indexOf('CrOS') != -1) return 'cros';
  return 'unknown';
};


blinNews.useSystemFont = function () {
  document.body.style.fontFamily =
    blinNews.systemFonts[blinNews.getPlatform()];
};


blinNews.sortScripts = function () {
  var i;
  var scripts = blinNews.scripts;
  for (i = 0; i < scripts; ++i) {
    if (scripts[i].scriptCode == blinNews.COMMON_SCRIPT)
      break;
  }
  var defaultScript = scripts.splice(i, 1)[0];

  scripts.sort(function (a, b) {
    if (a.scriptName > b.scriptName)
      return 1;
    if (a.scriptName < b.scriptName)
      return -1;
    return 0;
  });

  scripts.unshift(defaultScript);
};




blinNews.initFontSizeControls = function () {
  blinNews.fontSizeSettings = {
    minFontSize: {
      sliderContainer: $('minFontSizeSliderContainer'),
      minValue: 6,
      maxValue: 24,
      samples: [$('minFontSample')],
      label: $('minFontSizeLabel'),
      getter: chrome.fontSettings.getMinimumFontSize,
      onChanged: chrome.fontSettings.onMinimumFontSizeChanged
    }
  };

  for (var fontSizeKey in blinNews.fontSizeSettings)
    blinNews.initFontSizeSetting(fontSizeKey);
};


blinNews.initScriptList = function () {
  var scriptList = $('scriptList');
  blinNews.sortScripts();
  var scripts = blinNews.scripts;
  for (var i = 0; i < scripts.length; i++) {
    var script = document.createElement('option');
    script.value = scripts[i].scriptCode;
    script.text = scripts[i].scriptName;
    scriptList.add(script);
  }
  scriptList.selectedIndex = 0;
  scriptList.addEventListener('change', blinNews.refresh);
};


blinNews.init = function () {
  blinNews.useSystemFont();
  blinNews.initFontSizeControls();
  blinNews.initScriptList();
  blinNews.initApplyAndResetButtons();
};

document.addEventListener('DOMContentLoaded', blinNews.init);