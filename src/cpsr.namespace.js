// original file is 'docs/asset/main.js' + 'dependency.js'
!function( parent ) {
  Storage.prototype.setObject=function(t,e){this.setItem(t,JSON.stringify(e))},Storage.prototype.getObject=function(t){return JSON.parse(this.getItem(t))}
  function type(a,b){if(b)return null===a?"[object Null]":Object.prototype.toString.call(a);if(null==a)return(a+"").toLowerCase();var c=Object.prototype.toString.call(a).slice(8,-1).toLowerCase();return"generatorfunction"===c?"function":c.match(/^(array|bigint|date|error|function|generator|regexp|symbol)$/)?c:"object"==typeof a||"function"==typeof a?"object":typeof a}
  function bytes_to(t,B=2){if(0===t)return"0 Bytes";var e=B<0?0:B,B=Math.floor(Math.log(t)/Math.log(1024));return parseFloat((t/Math.pow(1024,B)).toFixed(e))+" "+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][B]}function to_bytes(t,B){var e=1024;let o="YB"===B?t*(e*e*e*e*e*e*e*e):"ZB"===B?t*(e*e*e*e*e*e*e):"EB"===B?t*(e*e*e*e*e*e):"PB"===B?t*(e*e*e*e*e):"TB"===B?t*(e*e*e*e):"GB"===B?t*(e*e*e):"MB"===B?t*(e*e):"KB"===B?t*e:0;return parseInt(o)}
  class CPSR {
    constructor( name = 'cpsr' ) {
      this.name = name
      if( type( sessionStorage.getObject( this.name ) ) === 'null' ) {
        sessionStorage.setObject( this.name, {
          session: Date.now(),
          recent: '',
          data: []
          })
        }
      }
    _listen( file, callback ) {
      file.addEventListener( 'change', ( event )=> {
        const files = event.target.files[0]
        if( files ) callback( files )
        })
      }
    _formatIframe( category, value, mime = '' ) {
      let result = ''
      switch( category ) {
        case 'text': result = `
          <pre>${value}</pre>
        `; break
        case 'image': result = `
          <div style="display:flex;justify-content:center">
            <img src="${value}" type="${mime}" />
          </div>'
        `; break
        case 'audio': result = `
          <div style="display:flex;justify-content:center;align-items:center;height:100%">
            <audio controls>
              <source src="${value}" type="${mime}">
            </audio>
          </div>'
        `; break
        case 'video': result = `
          <video controls style="width:100%;height100%">
            <source src="${value}" type="${mime}">
          </video>
        `; break
        case 'pdf': result = `
          <embed width="100%" height="100%" src="${value}" type="${mime}" />
        `; break
        }
      return result
      }
    file_info = { name: '', type: '', size: '', lastModified: '' }
    file_mime = { primary: '', secondary: '' }
    file_value = ''
    file_content = ''
    storage_exists = false
    get storage_path() {
      let result = []
      const obj = sessionStorage.getObject( this.name )
      const a_data = Object.keys( obj.data )
      for( var i = 0; i < a_data.length; i++ ) {
        result.push( obj.data[a_data[i]].path )
        }
      return result
      }
    get storage_recent() {
      const obj = sessionStorage.getObject( this.name )
      if( obj.recent.length === 0 ) return ''
      else return obj.recent
      }
    capture( file, callback ) {
      this._listen( file, ( files )=> {
        this.file_info.name = files.name
        this.file_info.type = files.type
        this.file_info.size = bytes_to( files.size )
        this.file_info.lastModified = files.lastModified
        const reader = new FileReader()
        const a_files = files.type.split('/')
        this.file_mime.primary = a_files[0]
        this.file_mime.secondary = a_files[1]
        if( this.file_mime.primary === 'text' ) {
          reader.addEventListener( 'loadend', ( event )=> {
            this.file_value = event.target.result
            callback()
            })
          reader.readAsText( files )
          }
        if( this.file_mime.primary === 'image' ) {
          reader.addEventListener( 'loadend', ( event )=> {
            this.file_value = event.target.result
            callback()
            })
          if( this.file_mime.secondary === 'svg+xml') reader.readAsText( files )
          else reader.readAsDataURL( files )
          }
        if( ( this.file_mime.primary === 'audio' ) || ( this.file_mime.primary === 'video') ) {
          reader.addEventListener( 'loadend', ( event )=> {
            this.file_value = event.target.result
            callback()
            })
          reader.readAsDataURL( files )
          }
        if( this.file_mime.primary === 'application' ) {
          if( this.file_mime.secondary === 'pdf') {
            reader.addEventListener( 'loadend', ( event )=> {
              this.file_value = event.target.result
              callback()
              })
            reader.readAsDataURL( files )
            }
          }
        })
      }
    capturePreview( iframe ) {
      if( this.file_mime.primary === 'text' ) {
        if( this.file_mime.secondary === 'html' ) this.file_content = this.file_value
        else this.file_content = this._formatIframe( 'text', this.file_value )
        }
      if( this.file_mime.primary === 'image' ) {
        if( this.file_mime.secondary === 'svg+xml') this.file_content = this.file_value
        else this.file_content = this._formatIframe( 'image', this.file_value, this.file_info.type )
        }
      if( this.file_mime.primary === 'audio' ) this.file_content = this._formatIframe( 'audio', this.file_value, this.file_info.type )
      if( this.file_mime.primary === 'video' ) this.file_content = this._formatIframe( 'video', this.file_value, this.file_info.type )
      if( this.file_mime.primary === 'application' ) {
        if( this.file_mime.secondary === 'pdf') this.file_content = this._formatIframe( 'pdf', this.file_value, this.file_info.type )
        }
      let content = iframe.contentDocument || iframe.contentWindow.document
      content.open()
      content.write( this.file_content );
      content.close()
      }
    save() {
      const data = {
        path: this.file_info.name,
        content: {
          type: this.file_info.type,
          size: this.file_info.size,
          value: this.file_value
          }
        }
      let obj = sessionStorage.getObject( this.name )
      obj.session = Date.now()
      obj.recent = this.file_info.name
      let exist = false
      let a_data = Object.keys( obj.data )
      for( var i = 0; i < a_data.length; i++ ) {
        let path = obj.data[a_data[i]].path
        if( path === this.file_info.name ) {
          exist = true
          this.storage_exists = true
          }
        }
      if( !exist ) {
        obj.data.push( data )
        sessionStorage.setObject( this.name, obj  )
        } 
      }
    retrieve( path ) {
      if( type(path) === 'undefined' )  path = this.storage_recent
      if( path.length != 0 ) {
        const obj = sessionStorage.getObject( this.name )
        let value = ''
        const a_data = Object.keys( obj.data )
        for( var i = 0; i < a_data.length; i++ ) {
          let o_path = obj.data[a_data[i]].path
          if( o_path === path ) value = obj.data[a_data[i]].content
          }
        return value
        }
      }
    retrievePreview( iframe, data ) {
      const mime = data.type.split('/'), mime_primary = mime[0], mime_secondary = mime[1]
      let content = iframe.contentDocument || iframe.contentWindow.document
      let value = ''
      if( mime_primary === 'text' ) {
        if( mime_secondary === 'html' ) value = data.value
        else value = this._formatIframe( 'text', data.value )
        }
      if( mime_primary === 'image' ) {
        if( mime_secondary === 'svg+xml') value = data.value
        else value = this._formatIframe( 'image', data.value, data.type )
        }
      if( this.file_mime.primary === 'audio' ) value = this._formatIframe( 'audio', data.value, data.type )
      if( this.file_mime.primary === 'video' ) value = this._formatIframe( 'video', data.value, data.type )
      if( this.file_mime.primary === 'application' ) {
        if( mime_secondary === 'pdf' ) value = this._formatIframe( 'pdf', data.value, data.type )
        }
      content.open()
      content.write( value );
      content.close()
      }
    }
    parent.CPSR = CPSR
  }( window )