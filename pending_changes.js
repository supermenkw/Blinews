var PendingChanges = function () {
  this.pendingFontSizeChanges_ = {};
};


PendingChanges.prototype.getFontSize = function (fontSizeKey) {
  return this.pendingFontSizeChanges_[fontSizeKey];
};



PendingChanges.prototype.setFontSize = function (fontSizeKey, size) {
  if (this.pendingFontSizeChanges_[fontSizeKey] == size)
    return;
  this.pendingFontSizeChanges_[fontSizeKey] = size;
};


PendingChanges.prototype.apply = function () {
  for (var script in this.pendingFontChanges_) {
    for (var genericFamily in this.pendingFontChanges_[script]) {
      var fontId = this.pendingFontChanges_[script][genericFamily];
      if (fontId == null)
        continue;
      var details = {};
      details.script = script;
      details.genericFamily = genericFamily;
      details.fontId = fontId;
      chrome.fontSettings.setFont(details);
    }
  }

  var size = this.pendingFontSizeChanges_['defaultFontSize'];
  if (size != null)
    chrome.fontSettings.setDefaultFontSize({
      pixelSize: size
    });

  size = this.pendingFontSizeChanges_['minFontSize'];
  if (size != null)
    chrome.fontSettings.setMinimumFontSize({
      pixelSize: size
    });

  this.clear();
};


PendingChanges.prototype.clearOneScript = function (script) {
  this.pendingFontChanges_[script] = {};
};

PendingChanges.prototype.clear = function () {
  this.pendingFontChanges_ = {};
  this.pendingFontSizeChanges_ = {};
};


PendingChanges.prototype.isEmpty = function () {
  for (var script in this.pendingFontChanges_) {
    for (var genericFamily in this.pendingFontChanges_[script]) {
      if (this.pendingFontChanges_[script][genericFamily] != null)
        return false;
    }
  }
  for (var name in this.pendingFontSizeChanges_) {
    if (this.pendingFontSizeChanges_[name] != null)
      return false;
  }
  return true;
};