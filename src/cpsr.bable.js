function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

!function (parent) {
  Storage.prototype.setObject = function (t, e) {
    this.setItem(t, JSON.stringify(e));
  }, Storage.prototype.getObject = function (t) {
    return JSON.parse(this.getItem(t));
  };

  function type(a, b) {
    if (b) return null === a ? "[object Null]" : Object.prototype.toString.call(a);
    if (null == a) return (a + "").toLowerCase();
    var c = Object.prototype.toString.call(a).slice(8, -1).toLowerCase();
    return "generatorfunction" === c ? "function" : c.match(/^(array|bigint|date|error|function|generator|regexp|symbol)$/) ? c : "object" == _typeof(a) || "function" == typeof a ? "object" : _typeof(a);
  }

  function bytes_to(t) {
    var B = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
    return function (B) {
      if (0 === t) return "0 Bytes";
      var e = B < 0 ? 0 : B,
          B = Math.floor(Math.log(t) / Math.log(1024));
      return parseFloat((t / Math.pow(1024, B)).toFixed(e)) + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][B];
    }(B);
  }

  function to_bytes(t, B) {
    var e = 1024;
    var o = "YB" === B ? t * (e * e * e * e * e * e * e * e) : "ZB" === B ? t * (e * e * e * e * e * e * e) : "EB" === B ? t * (e * e * e * e * e * e) : "PB" === B ? t * (e * e * e * e * e) : "TB" === B ? t * (e * e * e * e) : "GB" === B ? t * (e * e * e) : "MB" === B ? t * (e * e) : "KB" === B ? t * e : 0;
    return parseInt(o);
  }

  var CPSR = /*#__PURE__*/function () {
    "use strict";

    function CPSR() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'cpsr';

      _classCallCheck(this, CPSR);

      _defineProperty(this, "file_info", {
        name: '',
        type: '',
        size: '',
        lastModified: ''
      });

      _defineProperty(this, "file_mime", {
        primary: '',
        secondary: ''
      });

      _defineProperty(this, "file_value", '');

      _defineProperty(this, "file_content", '');

      _defineProperty(this, "storage_exists", false);

      this.name = name;

      if (type(sessionStorage.getObject(this.name)) === 'null') {
        sessionStorage.setObject(this.name, {
          session: Date.now(),
          recent: '',
          data: []
        });
      }
    }

    _createClass(CPSR, [{
      key: "_listen",
      value: function _listen(file, callback) {
        file.addEventListener('change', function (event) {
          var files = event.target.files[0];
          if (files) callback(files);
        });
      }
    }, {
      key: "_formatIframe",
      value: function _formatIframe(category, value) {
        var mime = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
        var result = '';

        switch (category) {
          case 'text':
            result = "\n          <pre>".concat(value, "</pre>\n        ");
            break;

          case 'image':
            result = "\n          <div style=\"display:flex;justify-content:center\">\n            <img src=\"".concat(value, "\" type=\"").concat(mime, "\" />\n          </div>'\n        ");
            break;

          case 'audio':
            result = "\n          <div style=\"display:flex;justify-content:center;align-items:center;height:100%\">\n            <audio controls>\n              <source src=\"".concat(value, "\" type=\"").concat(mime, "\">\n            </audio>\n          </div>'\n        ");
            break;

          case 'video':
            result = "\n          <video controls style=\"width:100%;height100%\">\n            <source src=\"".concat(value, "\" type=\"").concat(mime, "\">\n          </video>\n        ");
            break;

          case 'pdf':
            result = "\n          <embed width=\"100%\" height=\"100%\" src=\"".concat(value, "\" type=\"").concat(mime, "\" />\n        ");
            break;
        }

        return result;
      }
    }, {
      key: "storage_path",
      get: function get() {
        var result = [];
        var obj = sessionStorage.getObject(this.name);
        var a_data = Object.keys(obj.data);

        for (var i = 0; i < a_data.length; i++) {
          result.push(obj.data[a_data[i]].path);
        }

        return result;
      }
    }, {
      key: "storage_recent",
      get: function get() {
        var obj = sessionStorage.getObject(this.name);
        if (obj.recent.length === 0) return '';else return obj.recent;
      }
    }, {
      key: "capture",
      value: function capture(file, callback) {
        var _this = this;

        this._listen(file, function (files) {
          _this.file_info.name = files.name;
          _this.file_info.type = files.type;
          _this.file_info.size = bytes_to(files.size);
          _this.file_info.lastModified = files.lastModified;
          var reader = new FileReader();
          var a_files = files.type.split('/');
          _this.file_mime.primary = a_files[0];
          _this.file_mime.secondary = a_files[1];

          if (_this.file_mime.primary === 'text') {
            reader.addEventListener('loadend', function (event) {
              _this.file_value = event.target.result;
              callback();
            });
            reader.readAsText(files);
          }

          if (_this.file_mime.primary === 'image') {
            reader.addEventListener('loadend', function (event) {
              _this.file_value = event.target.result;
              callback();
            });
            if (_this.file_mime.secondary === 'svg+xml') reader.readAsText(files);else reader.readAsDataURL(files);
          }

          if (_this.file_mime.primary === 'audio' || _this.file_mime.primary === 'video') {
            reader.addEventListener('loadend', function (event) {
              _this.file_value = event.target.result;
              callback();
            });
            reader.readAsDataURL(files);
          }

          if (_this.file_mime.primary === 'application') {
            if (_this.file_mime.secondary === 'pdf') {
              reader.addEventListener('loadend', function (event) {
                _this.file_value = event.target.result;
                callback();
              });
              reader.readAsDataURL(files);
            }
          }
        });
      }
    }, {
      key: "capturePreview",
      value: function capturePreview(iframe) {
        if (this.file_mime.primary === 'text') {
          if (this.file_mime.secondary === 'html') this.file_content = this.file_value;else this.file_content = this._formatIframe('text', this.file_value);
        }

        if (this.file_mime.primary === 'image') {
          if (this.file_mime.secondary === 'svg+xml') this.file_content = this.file_value;else this.file_content = this._formatIframe('image', this.file_value, this.file_info.type);
        }

        if (this.file_mime.primary === 'audio') this.file_content = this._formatIframe('audio', this.file_value, this.file_info.type);
        if (this.file_mime.primary === 'video') this.file_content = this._formatIframe('video', this.file_value, this.file_info.type);

        if (this.file_mime.primary === 'application') {
          if (this.file_mime.secondary === 'pdf') this.file_content = this._formatIframe('pdf', this.file_value, this.file_info.type);
        }

        var content = iframe.contentDocument || iframe.contentWindow.document;
        content.open();
        content.write(this.file_content);
        content.close();
      }
    }, {
      key: "save",
      value: function save() {
        var data = {
          path: this.file_info.name,
          content: {
            type: this.file_info.type,
            size: this.file_info.size,
            value: this.file_value
          }
        };
        var obj = sessionStorage.getObject(this.name);
        obj.session = Date.now();
        obj.recent = this.file_info.name;
        var exist = false;
        var a_data = Object.keys(obj.data);

        for (var i = 0; i < a_data.length; i++) {
          var path = obj.data[a_data[i]].path;

          if (path === this.file_info.name) {
            exist = true;
            this.storage_exists = true;
          }
        }

        if (!exist) {
          obj.data.push(data);
          sessionStorage.setObject(this.name, obj);
        }
      }
    }, {
      key: "retrieve",
      value: function retrieve(path) {
        if (type(path) === 'undefined') path = this.storage_recent;

        if (path.length != 0) {
          var obj = sessionStorage.getObject(this.name);
          var value = '';
          var a_data = Object.keys(obj.data);

          for (var i = 0; i < a_data.length; i++) {
            var o_path = obj.data[a_data[i]].path;
            if (o_path === path) value = obj.data[a_data[i]].content;
          }

          return value;
        }
      }
    }, {
      key: "retrievePreview",
      value: function retrievePreview(iframe, data) {
        var mime = data.type.split('/'),
            mime_primary = mime[0],
            mime_secondary = mime[1];
        var content = iframe.contentDocument || iframe.contentWindow.document;
        var value = '';

        if (mime_primary === 'text') {
          if (mime_secondary === 'html') value = data.value;else value = this._formatIframe('text', data.value);
        }

        if (mime_primary === 'image') {
          if (mime_secondary === 'svg+xml') value = data.value;else value = this._formatIframe('image', data.value, data.type);
        }

        if (this.file_mime.primary === 'audio') value = this._formatIframe('audio', data.value, data.type);
        if (this.file_mime.primary === 'video') value = this._formatIframe('video', data.value, data.type);

        if (this.file_mime.primary === 'application') {
          if (mime_secondary === 'pdf') value = this._formatIframe('pdf', data.value, data.type);
        }

        content.open();
        content.write(value);
        content.close();
      }
    }]);

    return CPSR;
  }();

  parent.CPSR = CPSR;
}(window);